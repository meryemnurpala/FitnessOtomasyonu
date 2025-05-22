package com.fitness.fitnessapp.Repository;

import com.fitness.fitnessapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Kullanıcıyı e-posta ile bul
    Optional<User> findByEmail(String email);
}
