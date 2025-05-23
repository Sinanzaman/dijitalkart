package com.sinanzmn.backend.service;

import com.sinanzmn.backend.model.Card;
import com.sinanzmn.backend.model.User;
import com.sinanzmn.backend.repository.CardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    public Optional<Card> getCardByUser(User user) {
        return cardRepository.findByUser(user);
    }

    public Card saveCard(Card card) {
        return cardRepository.save(card);
    }

    public Optional<Card> getCardByCardid(String cardid) {
        return cardRepository.findByCardid(cardid);
    }

}
