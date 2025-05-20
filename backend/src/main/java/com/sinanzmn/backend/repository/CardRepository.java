package com.sinanzmn.backend.repository;

import com.sinanzmn.backend.model.Card;
import com.sinanzmn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByUser(User user);
}
