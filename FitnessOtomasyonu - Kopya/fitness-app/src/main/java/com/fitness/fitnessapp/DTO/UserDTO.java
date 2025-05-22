package com.fitness.fitnessapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private String membershipType;
    private String adminCode;
}
