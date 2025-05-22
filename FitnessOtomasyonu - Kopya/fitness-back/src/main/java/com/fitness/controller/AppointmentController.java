package com.fitness.controller;

import com.fitness.model.Appointment;
import com.fitness.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        try {
            // Aynı kullanıcının aynı saate randevu oluşturup oluşturmadığını kontrol et
            List<Appointment> existingAppointments = appointmentService.getAppointmentsByUserId(appointment.getUserId());
            LocalDateTime newAppointmentDateTime = appointment.getAppointmentDate();
            
            for (Appointment existingAppointment : existingAppointments) {
                LocalDateTime existingDateTime = existingAppointment.getAppointmentDate();
                // Aynı gün ve saatte randevu var mı kontrol et
                if (existingDateTime.toLocalDate().equals(newAppointmentDateTime.toLocalDate()) &&
                    existingDateTime.toLocalTime().equals(newAppointmentDateTime.toLocalTime())) {
                    return ResponseEntity.badRequest().body("Bu saatte zaten bir randevunuz bulunmaktadır!");
                }
            }
            
            Appointment savedAppointment = appointmentService.createAppointment(appointment);
            return ResponseEntity.ok(savedAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Randevu oluşturulurken bir hata oluştu: " + e.getMessage());
        }
    }
} 