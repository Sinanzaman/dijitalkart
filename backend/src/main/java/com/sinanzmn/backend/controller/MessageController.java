package com.sinanzmn.backend.controller;

import com.sinanzmn.backend.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.sinanzmn.backend.model.Message;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService service) {
        this.messageService = service;
    }

    // Mesaj gönderme
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        try {
            messageService.sendMessage(request.getSenderCardId(), request.getRecipientCardId(), request.getTitle(),
                    request.getBody());
            return ResponseEntity.ok().body("Mesaj gönderildi");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Mesaj gönderilirken hata oluştu");
        }
    }

    // Gönderilen mesajları getir
    @GetMapping("/sent/{cardId}")
    public ResponseEntity<List<Message>> getSentMessages(@PathVariable String cardId) {
        List<Message> sent = messageService.getSentMessages(cardId);
        return ResponseEntity.ok(sent);
    }

    // Alınan mesajları getir
    @GetMapping("/received/{cardId}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable String cardId) {
        List<Message> received = messageService.getReceivedMessages(cardId);
        return ResponseEntity.ok(received);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteMessage(id);
            return ResponseEntity.ok().body("Mesaj silindi");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Mesaj silinirken hata oluştu");
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markMessageAsRead(@PathVariable Long id) {
        try {
            messageService.markAsRead(id);
            return ResponseEntity.ok().body("Mesaj okundu olarak işaretlendi");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Mesaj okundu olarak işaretlenirken hata oluştu");
        }
    }

    // MesajRequest DTO
    public static class MessageRequest {
        private String senderCardId;
        private String recipientCardId;
        private String title;
        private String body;

        // getter-setter
        public String getSenderCardId() {
            return senderCardId;
        }

        public void setSenderCardId(String senderCardId) {
            this.senderCardId = senderCardId;
        }

        public String getRecipientCardId() {
            return recipientCardId;
        }

        public void setRecipientCardId(String recipientCardId) {
            this.recipientCardId = recipientCardId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }
    }
}
