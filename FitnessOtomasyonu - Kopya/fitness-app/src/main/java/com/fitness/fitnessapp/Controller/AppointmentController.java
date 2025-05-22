package com.fitness.fitnessapp.Controller;

import com.fitness.fitnessapp.DTO.AppointmentDTO;
import com.fitness.fitnessapp.Model.Appointment;
import com.fitness.fitnessapp.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            AppointmentDTO createdAppointment = appointmentService.createAppointment(appointmentDTO);
            return ResponseEntity.ok(createdAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Randevu oluşturulurken hata oluştu: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AppointmentDTO>> getUserAppointments(@PathVariable Long userId) {
        return ResponseEntity.ok(appointmentService.getUserAppointments(userId));
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(appointmentId, status));
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/hourly-stats")
    public ResponseEntity<Map<Integer, Integer>> getHourlyAppointmentStats() {
        Map<Integer, Integer> hourlyStats = appointmentService.getAppointmentsByHour();
        return ResponseEntity.ok(hourlyStats);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<Integer, Integer>> getAppointmentStats(@RequestParam String date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
    }

    @GetMapping("/chart-data")
    public ResponseEntity<Map<String, Object>> getChartData() {
        return ResponseEntity.ok(appointmentService.getChartData());
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(appointmentService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(appointmentDTOs);
    }
} 