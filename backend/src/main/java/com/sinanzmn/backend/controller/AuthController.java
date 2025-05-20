package com.sinanzmn.backend.controller;

import com.sinanzmn.backend.model.User;
import com.sinanzmn.backend.repository.UserRepository;
import com.sinanzmn.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        Optional<User> userOpt = userRepository.findByEmail(loginUser.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (user.getPassword().equals(loginUser.getPassword())) {
                String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getEmail());

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "user", Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "email", user.getEmail(),
                                "theme", user.getTheme()
                                )));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Email veya şifre hatalı"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email zaten kullanılıyor"));
        }

        userRepository.save(newUser);
        return ResponseEntity.ok(Map.of("message", "Kayıt başarılı"));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
        }

        Long userId = jwtUtil.getUserIdFromToken(token);
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "theme", user.getTheme()
        ));
    }

    @PutMapping("/user/theme")
public ResponseEntity<?> updateTheme(
    @RequestHeader(value = "Authorization", required = false) String authHeader,
    @RequestBody Map<String, String> body) {
    
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
    }

    String token = authHeader.substring(7);

    if (!jwtUtil.isTokenValid(token)) {
        return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
    }

    Long userId = jwtUtil.getUserIdFromToken(token);
    Optional<User> userOpt = userRepository.findById(userId);

    if (userOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("message", "User not found"));
    }

    User user = userOpt.get();
    String newTheme = body.get("theme");

    if (newTheme == null || (!newTheme.equals("light") && !newTheme.equals("dark"))) {
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid theme value"));
    }

    user.setTheme(newTheme);
    userRepository.save(user);

    return ResponseEntity.ok(Map.of("message", "Theme updated", "theme", newTheme));
}

}