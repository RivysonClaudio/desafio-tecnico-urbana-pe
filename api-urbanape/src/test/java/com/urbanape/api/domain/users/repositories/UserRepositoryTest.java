package com.urbanape.api.domain.users.repositories;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.urbanape.api.domain.cards.entities.Card;
import com.urbanape.api.domain.cards.entities.CardType;
import com.urbanape.api.domain.cards.repositories.CardRepository;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CardRepository cardRepository;

    private User user1;
    private User user2;
    private User deletedUser;

    @BeforeEach
    void setup() {
        user1 = new User("João", "joao@test.com", "senha123", UserRole.USER);
        user2 = new User("Maria", "maria@test.com", "senha123", UserRole.ADMIN);
        deletedUser = new User("Pedro", "pedro@test.com", "senha123", UserRole.USER);
        deletedUser.setIsDeleted(true);

        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);
        deletedUser = userRepository.save(deletedUser);
    }

    @Test
    void testFindAllNotDeleted() {
        Pageable pageable = PageRequest.of(0, 100);
        
        Page<User> result = userRepository.findAllNotDeleted("", pageable);

        assertTrue(result.getTotalElements() >= 2);
        assertFalse(result.getContent().stream().anyMatch(u -> u.getIsDeleted()));
        assertTrue(result.getContent().stream().anyMatch(u -> u.getEmail().equals("joao@test.com")));
        assertTrue(result.getContent().stream().anyMatch(u -> u.getEmail().equals("maria@test.com")));
    }

    @Test
    void testFindAllNotDeleted_withSearchByName() {
        Pageable pageable = PageRequest.of(0, 100);
        
        Page<User> result = userRepository.findAllNotDeleted("joão", pageable);

        assertTrue(result.getTotalElements() >= 1);
        assertTrue(result.getContent().stream().anyMatch(u -> u.getName().toLowerCase().contains("joão") || u.getName().toLowerCase().contains("joao")));
    }

    @Test
    void testFindAllNotDeleted_withSearchByEmail() {
        Pageable pageable = PageRequest.of(0, 100);
        
        Page<User> result = userRepository.findAllNotDeleted("maria@test.com", pageable);

        assertTrue(result.getTotalElements() >= 1);
        assertTrue(result.getContent().stream().anyMatch(u -> u.getEmail().equals("maria@test.com")));
    }

    @Test
    void testFindAllNotDeleted_withCards() {
        Card card = new Card(7777123456789012L, "Cartão Teste", true, CardType.COMUM, user1);
        cardRepository.save(card);
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<User> result = userRepository.findAllNotDeleted("", pageable);

        User userWithCard = result.getContent().stream()
            .filter(u -> u.getId().equals(user1.getId()))
            .findFirst()
            .orElse(null);
        
        assertNotNull(userWithCard);
        assertEquals("João", userWithCard.getName());
    }

    @Test
    void testFindByEmail() {
        UserDetails result = userRepository.findByEmail("joao@test.com");

        assertNotNull(result);
        assertEquals("joao@test.com", result.getUsername());
    }

    @Test
    void testFindByEmail_notFound() {
        UserDetails result = userRepository.findByEmail("naoexiste@test.com");

        assertNull(result);
    }

    @Test
    void testFindNotDeletedById() {
        Optional<User> result = userRepository.findNotDeletedById(user1.getId());

        assertTrue(result.isPresent());
        assertEquals("João", result.get().getName());
        assertEquals("joao@test.com", result.get().getEmail());
        assertFalse(result.get().getIsDeleted());
    }

    @Test
    void testFindNotDeletedById_deletedUser() {
        Optional<User> result = userRepository.findNotDeletedById(deletedUser.getId());

        assertFalse(result.isPresent());
    }

    @Test
    void testFindNotDeletedById_withCards() {
        Card card1 = new Card(7777123456789013L, "Cartão 1", true, CardType.COMUM, user1);
        Card card2 = new Card(7777123456789014L, "Cartão 2", true, CardType.ESTUDANTE, user1);
        cardRepository.save(card1);
        cardRepository.save(card2);

        Optional<User> result = userRepository.findNotDeletedById(user1.getId());

        assertTrue(result.isPresent());
        assertEquals("João", result.get().getName());
        assertEquals("joao@test.com", result.get().getEmail());
    }

    @Test
    void testSoftDeleteAllByIds() {
        Set<Long> ids = Set.of(user1.getId(), user2.getId());
        Pageable pageable = PageRequest.of(0, 100);
        long countBefore = userRepository.findAllNotDeleted("", pageable).getTotalElements();
        
        userRepository.softDeleteAllByIds(ids);

        Page<User> result = userRepository.findAllNotDeleted("", pageable);
        
        assertTrue(result.getTotalElements() < countBefore);
        assertFalse(result.getContent().stream().anyMatch(u -> ids.contains(u.getId())));
        
        Optional<User> user1After = userRepository.findById(user1.getId());
        assertTrue(user1After.isPresent());
        assertTrue(user1After.get().getIsDeleted());
    }

    @Test
    void testSoftDeleteAllByIds_partial() {
        User user3 = new User("Carlos", "carlos@test.com", "senha123", UserRole.USER);
        User savedUser3 = userRepository.save(user3);
        
        Set<Long> ids = Set.of(user1.getId());
        Pageable pageable = PageRequest.of(0, 100);
        long countBefore = userRepository.findAllNotDeleted("", pageable).getTotalElements();
        
        userRepository.softDeleteAllByIds(ids);

        Page<User> result = userRepository.findAllNotDeleted("", pageable);
        
        assertTrue(result.getTotalElements() < countBefore);
        assertFalse(result.getContent().stream().anyMatch(u -> u.getId().equals(user1.getId())));
        assertTrue(result.getContent().stream().anyMatch(u -> u.getId().equals(user2.getId())));
        assertTrue(result.getContent().stream().anyMatch(u -> u.getId().equals(savedUser3.getId())));
    }
}
