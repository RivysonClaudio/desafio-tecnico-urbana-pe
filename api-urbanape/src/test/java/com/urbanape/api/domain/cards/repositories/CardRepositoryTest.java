package com.urbanape.api.domain.cards.repositories;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.urbanape.api.domain.cards.entities.Card;
import com.urbanape.api.domain.cards.entities.CardType;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;
import com.urbanape.api.domain.users.repositories.UserRepository;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CardRepositoryTest {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    private User user1;
    private User user2;
    private Card card1;
    private Card card2;
    private Card card3;
    private Card deletedCard;

    @BeforeEach
    void setup() {
        user1 = new User("João", "joao@test.com", "senha123", UserRole.USER);
        user2 = new User("Maria", "maria@test.com", "senha123", UserRole.USER);
        
        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);

        card1 = new Card(7777123456789012L, "Cartão 1", true, CardType.COMUM, user1);
        card2 = new Card(7777123456789013L, "Cartão 2", false, CardType.ESTUDANTE, user1);
        card3 = new Card(7777123456789014L, "Cartão 3", true, CardType.TRABALHADOR, user2);
        deletedCard = new Card(7777123456789015L, "Cartão Deletado", true, CardType.COMUM, user1);
        deletedCard.setIsDeleted(true);

        card1 = cardRepository.save(card1);
        card2 = cardRepository.save(card2);
        card3 = cardRepository.save(card3);
        deletedCard = cardRepository.save(deletedCard);
    }

    @Test
    void testFindAllNotDeleted() {
        Pageable pageable = PageRequest.of(0, 100);
        
        Page<Card> result = cardRepository.findAllNotDeleted(pageable);

        assertTrue(result.getTotalElements() >= 3);
        assertFalse(result.getContent().stream().anyMatch(c -> c.getIsDeleted()));
        assertTrue(result.getContent().stream().anyMatch(c -> c.getNumber().equals(card1.getNumber())));
        assertTrue(result.getContent().stream().anyMatch(c -> c.getNumber().equals(card2.getNumber())));
        assertTrue(result.getContent().stream().anyMatch(c -> c.getNumber().equals(card3.getNumber())));
    }

    @Test
    void testFindAllByUserId() {
        Pageable pageable = PageRequest.of(0, 10);
        
        Page<Card> result = cardRepository.findAllByUserId(user1.getId(), pageable);

        assertEquals(2, result.getTotalElements());
        assertTrue(result.getContent().stream().allMatch(c -> c.getUser().getId().equals(user1.getId())));
        assertFalse(result.getContent().stream().anyMatch(c -> c.getIsDeleted()));
    }

    @Test
    void testFindAllByUserId_emptyResult() {
        User user3 = new User("Pedro", "pedro@test.com", "senha123", UserRole.USER);
        user3 = userRepository.save(user3);
        
        Pageable pageable = PageRequest.of(0, 10);
        Page<Card> result = cardRepository.findAllByUserId(user3.getId(), pageable);

        assertEquals(0, result.getTotalElements());
    }

    @Test
    void testFindByIdAndUserId() {
        Optional<Card> result = cardRepository.findByIdAndUserId(card1.getNumber(), user1.getId());

        assertTrue(result.isPresent());
        assertEquals(card1.getNumber(), result.get().getNumber());
        assertEquals(user1.getId(), result.get().getUser().getId());
    }

    @Test
    void testFindByIdAndUserId_wrongUser() {
        Optional<Card> result = cardRepository.findByIdAndUserId(card1.getNumber(), user2.getId());

        assertFalse(result.isPresent());
    }

    @Test
    void testFindByIdAndUserId_deletedCard() {
        Optional<Card> result = cardRepository.findByIdAndUserId(deletedCard.getNumber(), user1.getId());

        assertFalse(result.isPresent());
    }

    @Test
    void testFindAllNotDeletedByNumbers() {
        Set<Long> numbers = Set.of(card1.getNumber(), card2.getNumber());
        Pageable pageable = PageRequest.of(0, 10);
        
        Page<Card> result = cardRepository.findAllNotDeletedByNumbers(numbers, pageable);

        assertEquals(2, result.getTotalElements());
        assertTrue(result.getContent().stream().allMatch(c -> numbers.contains(c.getNumber())));
    }

    @Test
    void testSoftDeleteAllByNumbers() {
        Set<Long> numbers = Set.of(card1.getNumber(), card2.getNumber());
        Pageable pageable = PageRequest.of(0, 100);
        long countBefore = cardRepository.findAllNotDeleted(pageable).getTotalElements();
        
        cardRepository.softDeleteAllByNumbers(numbers);

        Page<Card> result = cardRepository.findAllNotDeleted(pageable);
        
        assertTrue(result.getTotalElements() < countBefore);
        assertFalse(result.getContent().stream().anyMatch(c -> numbers.contains(c.getNumber())));
        assertTrue(result.getContent().stream().anyMatch(c -> c.getNumber().equals(card3.getNumber())));
    }

    @Test
    void testSoftDeleteAllByUserIds() {
        Set<Long> userIds = Set.of(user1.getId());
        
        cardRepository.softDeleteAllByUserIds(userIds);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Card> result = cardRepository.findAllByUserId(user1.getId(), pageable);
        
        assertEquals(0, result.getTotalElements());
    }

    @Test
    void testNextCardNumber() {
        Long sequence1 = cardRepository.nextCardNumber();
        Long sequence2 = cardRepository.nextCardNumber();

        assertNotNull(sequence1);
        assertNotNull(sequence2);
        assertTrue(sequence2 > sequence1);
    }
}
