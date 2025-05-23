package com.sinanzmn.backend.repository;

import com.sinanzmn.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Kullanıcıya ait gönderilen mesajlar
    List<Message> findBySenderCardIdAndSentByMeTrueOrderByTimestampDesc(String senderCardId);

    // Kullanıcıya ait alınan mesajlar
    List<Message> findByRecipientCardIdAndSentByMeFalseOrderByTimestampDesc(String recipientCardId);
}
