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
                                "theme", user.getTheme(),
                                "cardid", user.getCardid())));
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
                "theme", user.getTheme(),
                "cardid", user.getCardid()));
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

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("password");

        if (email == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email ve şifre zorunludur"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Kullanıcı bulunamadı"));
        }

        User user = userOpt.get();

        user.setPassword(newPassword);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Şifre başarıyla güncellendi"));
    }

    @GetMapping("/find-by-cardid/{cardid}")
    public ResponseEntity<?> findByCardId(@PathVariable String cardid) {
        Optional<User> userOpt = userRepository.findByCardid(cardid);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Kullanıcı bulunamadı"));
        }

        User user = userOpt.get();

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()));
    }

    @PostMapping("/user/add-contact")
    public ResponseEntity<?> addContact(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Long> body) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
        }

        Long userId = jwtUtil.getUserIdFromToken(token);

        Long contactId = body.get("contactUserId");
        if (contactId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "contactUserId zorunlu"));
        }

        if (userId.equals(contactId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Kendini kişi olarak ekleyemezsin"));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> contactOpt = userRepository.findById(contactId);

        if (userOpt.isEmpty() || contactOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Kullanıcı bulunamadı"));
        }

        User user = userOpt.get();
        User contact = contactOpt.get();

        if (user.getContacts().contains(contact)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Kişi zaten ekli"));
        }

        user.addContact(contact);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Kişi başarıyla eklendi"));
    }

    @DeleteMapping("/user/remove-contact")
    public ResponseEntity<?> removeContact(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Long> body) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
        }

        Long userId = jwtUtil.getUserIdFromToken(token);

        Long contactId = body.get("contactUserId");
        if (contactId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "contactUserId zorunlu"));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> contactOpt = userRepository.findById(contactId);

        if (userOpt.isEmpty() || contactOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Kullanıcı bulunamadı"));
        }

        User user = userOpt.get();
        User contact = contactOpt.get();

        if (!user.getContacts().contains(contact)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Kişi listede yok"));
        }

        user.removeContact(contact);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Kişi başarıyla silindi"));
    }

    @GetMapping("/user/contacts")
    public ResponseEntity<?> getUserContacts(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
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

        var contacts = user.getContacts();

        // Basit örnek dönüş
        var contactList = contacts.stream().map(contact -> Map.of(
                "id", contact.getId(),
                "username", contact.getUsername(),
                "email", contact.getEmail(),
                "cardid", contact.getCardid())).toList();

        return ResponseEntity.ok(contactList);
    }

}