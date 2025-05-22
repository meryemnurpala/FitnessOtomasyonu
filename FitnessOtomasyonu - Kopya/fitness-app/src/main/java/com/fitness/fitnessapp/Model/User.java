package com.fitness.fitnessapp.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    private String phone;
    
    @Column(name = "membership_type")
    private String membershipType;
    
    @Column(name = "membership_duration")
    private Integer membershipDuration;

    @Column(name = "membership_start_date")
    private LocalDateTime membershipStartDate;

    @Column(name = "membership_end_date")
    private LocalDateTime membershipEndDate;
    
    @Column(name = "admin_code")
    private String adminCode;
    
    @Column(nullable = false)
    private String role = "USER";

    @Column(name = "is_approved")
    private boolean isApproved = false;
}
