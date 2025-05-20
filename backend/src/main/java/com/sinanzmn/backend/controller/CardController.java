package com.sinanzmn.backend.controller;

import com.sinanzmn.backend.model.Card;
import com.sinanzmn.backend.model.Project;
import com.sinanzmn.backend.model.User;
import com.sinanzmn.backend.repository.UserRepository;
import com.sinanzmn.backend.security.JwtUtil;
import com.sinanzmn.backend.service.CardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class CardController {

    @Autowired
    private CardService cardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Kullanıcının kartını getir
    @GetMapping("")
    public ResponseEntity<?> getCard(@RequestHeader(value = "Authorization", required = false) String authHeader) {
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

        Optional<Card> cardOpt = cardService.getCardByUser(user);

        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Card not found"));
        }

        return ResponseEntity.ok(cardOpt.get());
    }

    // Kart oluştur veya güncelle
    @PostMapping("")
    public ResponseEntity<?> createOrUpdateCard(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Card cardRequest) {

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

        // Eğer kullanıcıya ait kart varsa, güncelle; yoksa yeni oluştur
        Card card = cardService.getCardByUser(user).orElse(new Card());
        card.setUser(user);
        card.setProfileImageUrl(cardRequest.getProfileImageUrl());
        card.setFullName(cardRequest.getFullName());
        card.setJobTitle(cardRequest.getJobTitle());
        card.setAbout(cardRequest.getAbout());
        card.setPhone(cardRequest.getPhone());
        card.setLinkedinUrl(cardRequest.getLinkedinUrl());
        card.setGithubUrl(cardRequest.getGithubUrl());
        card.setWebsiteUrl(cardRequest.getWebsiteUrl());
        card.setSkills(cardRequest.getSkills());
        if (cardRequest.getProjects() != null) {
            card.getProjects().clear();
            for (Project p : cardRequest.getProjects()) {
                p.setCard(card);
                card.getProjects().add(p);
            }
        } else {
            card.getProjects().clear();
        }
        card.setSelectedDesignId(cardRequest.getSelectedDesignId());

        Card savedCard = cardService.saveCard(card);

        return ResponseEntity.ok(savedCard);
    }
}
