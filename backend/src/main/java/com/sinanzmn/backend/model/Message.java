package com.sinanzmn.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderCardId; // Gönderenin CardId'si
    private String recipientCardId; // Alıcının CardId'si

    private String title;
    private String body;

    private boolean sentByMe; // true ise "Gönderilen mesajlar" / false ise "Alınan mesajlar"

    private LocalDateTime timestamp;

    private boolean isRead = false;

    public Message() {
    }

    public Message(String senderCardId, String recipientCardId, String title, String body, boolean sentByMe) {
        this.senderCardId = senderCardId;
        this.recipientCardId = recipientCardId;
        this.title = title;
        this.body = body;
        this.sentByMe = sentByMe;
        this.timestamp = LocalDateTime.now();
        this.isRead = false;
    }

    // Getter ve Setter'lar

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public boolean isSentByMe() {
        return sentByMe;
    }

    public void setSentByMe(boolean sentByMe) {
        this.sentByMe = sentByMe;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setisRead(boolean isRead) {
        this.isRead = isRead;
    }
}
