package com.sinanzmn.backend.service;

import com.sinanzmn.backend.model.Message;
import com.sinanzmn.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository repo) {
        this.messageRepository = repo;
    }

    // Mesaj gönder
    public void sendMessage(String senderCardId, String recipientCardId, String title, String body) {
        // Gönderilen mesaj (sentByMe = true)
        Message sentMessage = new Message(senderCardId, recipientCardId, title, body, true);
        messageRepository.save(sentMessage);

        // Alınan mesaj (sentByMe = false)
        Message receivedMessage = new Message(senderCardId, recipientCardId, title, body, false);
        messageRepository.save(receivedMessage);
    }

    // Gönderilen mesajları getir
    public List<Message> getSentMessages(String senderCardId) {
        return messageRepository.findBySenderCardIdAndSentByMeTrueOrderByTimestampDesc(senderCardId);
    }

    // Alınan mesajları getir
    public List<Message> getReceivedMessages(String recipientCardId) {
        return messageRepository.findByRecipientCardIdAndSentByMeFalseOrderByTimestampDesc(recipientCardId);
    }

    public void deleteMessage(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new RuntimeException("Mesaj bulunamadı");
        }
        messageRepository.deleteById(id);
    }

    public void markAsRead(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesaj bulunamadı"));

        message.setisRead(true);

        messageRepository.save(message);
    }

}
