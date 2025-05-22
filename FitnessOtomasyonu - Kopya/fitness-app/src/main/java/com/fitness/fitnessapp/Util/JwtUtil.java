package com.fitness.fitnessapp.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private String secretKey = "mysecretkeymysecretkeymysecretkey"; // Gizli anahtarınız

    // Token'dan claim çıkarma
    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Token'dan tüm claim'leri çıkarma
    private Claims extractAllClaims(String token) {
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // JWT token oluşturma
    public String generateToken(String username, String role) {
        try {
            Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
            Date now = new Date();
            Date expiration = new Date(now.getTime() + 1000 * 60 * 60 * 24); // 24 saat

            return Jwts.builder()
                    .setSubject(username)
                    .claim("role", role)
                    .setIssuedAt(now)
                    .setExpiration(expiration)
                    .signWith(key)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("Token oluşturulurken hata oluştu", e);
        }
    }

    // Token'dan kullanıcı adı alma
    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Token'ın geçerliliğini kontrol etme
    public boolean isTokenExpired(String token) {
        try {
            if (token == null || token.isEmpty()) {
                return true;
            }
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    // Token doğrulama
    public boolean validateToken(String token, String username) {
        try {
            if (token == null || token.isEmpty() || username == null || username.isEmpty()) {
                return false;
            }
            String extractedUsername = extractUsername(token);
            return (extractedUsername != null && 
                    extractedUsername.equals(username) && 
                    !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }
}
