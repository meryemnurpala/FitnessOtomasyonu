package com.fitness.fitnessapp.Service;

import com.fitness.fitnessapp.DTO.AppointmentDTO;
import com.fitness.fitnessapp.Model.Appointment;
import com.fitness.fitnessapp.Model.User;
import com.fitness.fitnessapp.Repository.AppointmentRepository;
import com.fitness.fitnessapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;
import java.time.format.DateTimeFormatter;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketService webSocketService;

    @Transactional
    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
        User user = userRepository.findById(appointmentDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Gelen tarihi logla
        System.out.println("Gelen tarih: " + appointmentDTO.getAppointmentDate());
        
        // Randevu tarihini doğrudan kullan
        OffsetDateTime appointmentDate = appointmentDTO.getAppointmentDate();
        
        // İşlenmiş tarihi logla
        System.out.println("İşlenmiş tarih: " + appointmentDate);

        // Aynı tarih ve saatteki randevuları kontrol et
        List<Appointment> existingAppointments = appointmentRepository.findByAppointmentDate(appointmentDate);
        
        // Kullanıcının aynı saatte başka randevusu var mı kontrol et
        boolean hasUserAppointmentAtSameTime = existingAppointments.stream()
                .anyMatch(app -> app.getUser().getId().equals(user.getId()));
        
        if (hasUserAppointmentAtSameTime) {
            throw new RuntimeException("Bu saatte zaten bir randevunuz bulunmaktadır.");
        }

        if (!existingAppointments.isEmpty()) {
            // Toplam kapasiteyi kontrol et
            int totalCapacity = existingAppointments.stream()
                    .mapToInt(Appointment::getCurrentCapacity)
                    .sum();
            
            if (totalCapacity >= 100) {
                throw new RuntimeException("Bu saatte maksimum kapasiteye ulaşılmıştır (100 kişi).");
            }
        }

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setAppointmentDate(appointmentDate);
        appointment.setAppointmentType(appointmentDTO.getAppointmentType());
        appointment.setNotes(appointmentDTO.getNotes());
        appointment.setStatus("PENDING");
        appointment.setCurrentCapacity(1);
        appointment.setMaxCapacity(50);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // WebSocket üzerinden bildirim gönder
        webSocketService.sendAppointmentUpdate();
        
        return convertToDTO(savedAppointment);
    }

    public List<AppointmentDTO> getUserAppointments(Long userId) {
        return appointmentRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return convertToDTO(updatedAppointment);
    }

    @Transactional
    public void deleteAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (appointment.getCurrentCapacity() > 1) {
            appointment.setCurrentCapacity(appointment.getCurrentCapacity() - 1);
            appointmentRepository.save(appointment);
        } else {
            appointmentRepository.deleteById(appointmentId);
        }
    }

    public Map<Integer, Integer> getAppointmentsByHour() {
        // Türkiye saat dilimine göre şu anki zamanı al
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.ofHours(3));
        OffsetDateTime startOfDay = now.with(LocalTime.MIN);
        OffsetDateTime endOfDay = now.with(LocalTime.MAX);

        List<Appointment> appointments = appointmentRepository.findByAppointmentDateBetween(startOfDay, endOfDay);

        // Saatleri Türkiye saatine göre grupla
        return appointments.stream()
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentDate().withOffsetSameInstant(ZoneOffset.ofHours(3)).getHour(),
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
    }

    public Map<String, Object> getAppointmentStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Toplam randevu sayısı
        long totalAppointments = appointmentRepository.count();
        
        // Tamamlanan randevu sayısı
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        
        // Bekleyen randevu sayısı
        long pendingAppointments = appointmentRepository.countByStatus("PENDING");
        
        // Yarının randevuları
        OffsetDateTime tomorrow = OffsetDateTime.now().plusDays(1).withHour(0).withMinute(0).withSecond(0);
        OffsetDateTime tomorrowEnd = tomorrow.plusDays(1);
        long tomorrowAppointments = appointmentRepository.countByAppointmentDateBetween(tomorrow, tomorrowEnd);
        
        // Yarının doluluk oranı (varsayılan olarak günlük maksimum 20 randevu)
        double tomorrowOccupancyRate = Math.min(100, (tomorrowAppointments * 100.0) / 20);
        
        stats.put("totalAppointments", totalAppointments);
        stats.put("completedAppointments", completedAppointments);
        stats.put("pendingAppointments", pendingAppointments);
        stats.put("tomorrowAppointments", tomorrowAppointments);
        stats.put("tomorrowOccupancyRate", Math.round(tomorrowOccupancyRate));
        
        return stats;
    }

    public Map<String, Object> getChartData() {
        Map<String, Object> chartData = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();
        
        // Son 7 günün verilerini Türkiye saatine göre al
        OffsetDateTime endDate = OffsetDateTime.now(ZoneOffset.ofHours(3));
        OffsetDateTime startDate = endDate.minusDays(6);
        
        // Her gün için randevu sayısını hesapla
        for (OffsetDateTime date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            OffsetDateTime dayStart = date.withHour(0).withMinute(0).withSecond(0);
            OffsetDateTime dayEnd = date.withHour(23).withMinute(59).withSecond(59);
            
            long count = appointmentRepository.countByAppointmentDateBetween(dayStart, dayEnd);
            
            labels.add(date.format(DateTimeFormatter.ofPattern("dd/MM")));
            data.add((int) count);
        }
        
        chartData.put("labels", labels);
        chartData.put("datasets", Collections.singletonList(
            Map.of(
                "label", "Randevu Sayısı",
                "data", data,
                "borderColor", "rgb(75, 192, 192)",
                "tension", 0.1
            )
        ));
        
        return chartData;
    }

    public Map<Integer, Integer> getAppointmentsByDate(String date) {
        // Tarihi Türkiye saat dilimi ile ayarla
        OffsetDateTime startOfDay = OffsetDateTime.parse(date + "T00:00:00+03:00");
        OffsetDateTime endOfDay = OffsetDateTime.parse(date + "T23:59:59+03:00");

        List<Appointment> appointments = appointmentRepository.findByAppointmentDateBetween(startOfDay, endOfDay);

        // Saatleri Türkiye saatine göre grupla
        return appointments.stream()
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentDate().withOffsetSameInstant(ZoneOffset.ofHours(3)).getHour(),
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public AppointmentDTO convertToDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setUserId(appointment.getUser().getId());
        dto.setUserFirstName(appointment.getUser().getFirstName());
        dto.setUserLastName(appointment.getUser().getLastName());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentType(appointment.getAppointmentType());
        dto.setNotes(appointment.getNotes());
        dto.setStatus(appointment.getStatus());
        dto.setCurrentCapacity(appointment.getCurrentCapacity());
        dto.setMaxCapacity(appointment.getMaxCapacity());
        return dto;
    }
} 