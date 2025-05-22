package com.fitness.fitnessapp.Service;

import com.fitness.fitnessapp.Model.User;
import com.fitness.fitnessapp.Repository.UserRepository;
import com.fitness.fitnessapp.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String ADMIN_CODE = "123456"; // Admin kodu sabiti

    public User registerUser(User user) {
        try {
            // E-posta kontrolü
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new RuntimeException("Bu e-posta adresi zaten kullanımda");
            }

            // Şifre hashleme
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);

            // Admin kodu kontrolü
            if (user.getRole() == null || user.getRole().isEmpty()) {
                if (ADMIN_CODE.equals(user.getAdminCode())) {
                    user.setRole("ADMIN");
                } else {
                    user.setRole("USER");
                }
            }

            // Üyelik süresi ve tarihleri ayarlama
            if ("USER".equals(user.getRole())) {
                if (user.getMembershipDuration() == null) {
                    throw new RuntimeException("Üyelik süresi seçilmelidir");
                }
                user.setMembershipStartDate(LocalDateTime.now());
                user.setMembershipEndDate(LocalDateTime.now().plusMonths(user.getMembershipDuration()));
            }

            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Kayıt işlemi sırasında hata oluştu: " + e.getMessage());
        }
    }

    public Map<String, Object> loginUser(String email, String password) {
        try {
            // Kullanıcıyı bul
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            // Şifreyi kontrol et
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("Geçersiz şifre");
            }

            // Admin kullanıcılar için onay kontrolü yapma
            if (!"ADMIN".equals(user.getRole()) && !user.isApproved()) {
                throw new RuntimeException("Hesabınız henüz onaylanmamış. Lütfen yönetici onayını bekleyin.");
            }

            // JWT token oluştur
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            // Kullanıcı bilgilerini ve token'ı içeren bir Map oluştur
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Giriş işlemi sırasında hata oluştu: " + e.getMessage());
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
    }

    // Tüm kullanıcıları getir
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Kullanıcı sil
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // Kullanıcı güncelle
    public User updateUser(Long userId, User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setMembershipType(userDetails.getMembershipType());
        user.setApproved(userDetails.isApproved());

        return userRepository.save(user);
    }

    // Üye onaylama metodu
    public User approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
        
        if ("USER".equals(user.getRole())) {
            user.setApproved(true);
            user.setMembershipStartDate(LocalDateTime.now());
            if (user.getMembershipDuration() != null) {
                user.setMembershipEndDate(LocalDateTime.now().plusMonths(user.getMembershipDuration()));
            }
            return userRepository.save(user);
        }
        throw new RuntimeException("Sadece normal kullanıcılar onaylanabilir!");
    }
}
