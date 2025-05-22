package com.fitness.fitnessapp.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private OffsetDateTime appointmentDate;

    @Column(nullable = false)
    private String appointmentType; // Örn: "Personal Training", "Group Class", "Consultation"

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private String status; // "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private Integer currentCapacity = 0;

    @Column(nullable = false)
    private Integer maxCapacity = 50;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }
} 