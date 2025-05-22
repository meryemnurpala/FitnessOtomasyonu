package com.fitness.fitnessapp.Repository;

import com.fitness.fitnessapp.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);
    List<Appointment> findByUserIdAndStatus(Long userId, String status);
    List<Appointment> findByAppointmentDate(OffsetDateTime appointmentDate);
    List<Appointment> findByAppointmentDateBetween(OffsetDateTime startDate, OffsetDateTime endDate);
    long countByStatus(String status);
    long countByAppointmentDateBetween(OffsetDateTime start, OffsetDateTime end);
} 