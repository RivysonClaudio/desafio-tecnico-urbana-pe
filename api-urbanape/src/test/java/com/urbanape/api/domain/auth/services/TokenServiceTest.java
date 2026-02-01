package com.urbanape.api.domain.auth.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;

@SpringBootTest
@ActiveProfiles("test")
class TokenServiceTest {

    @Autowired
    private TokenService tokenService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User(1L, "João", "joao@test.com", "senha123", UserRole.USER);
    }

    @Test
    void testGenerateToken() {
        String token = tokenService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGenerateToken_differentUsers() {
        User user2 = new User(2L, "Maria", "maria@test.com", "senha123", UserRole.ADMIN);
        
        String token1 = tokenService.generateToken(user);
        String token2 = tokenService.generateToken(user2);

        assertNotNull(token1);
        assertNotNull(token2);
        assertNotEquals(token1, token2);
    }

    @Test
    void testValidateToken() {
        String token = tokenService.generateToken(user);
        
        String email = tokenService.validateToken(token);

        assertEquals("joao@test.com", email);
    }

    @Test
    void testValidateToken_invalidToken() {
        String invalidToken = "token.invalido.aqui";

        assertThrows(RuntimeException.class, () -> {
            tokenService.validateToken(invalidToken);
        });
    }

    @Test
    void testValidateToken_emptyToken() {
        assertThrows(RuntimeException.class, () -> {
            tokenService.validateToken("");
        });
    }

    @Test
    void testGenerateAndValidateToken() {
        String token = tokenService.generateToken(user);
        String email = tokenService.validateToken(token);

        assertEquals(user.getEmail(), email);
    }

    @Test
    void testGenerateToken_adminUser() {
        User admin = new User(2L, "Admin", "admin@test.com", "senha123", UserRole.ADMIN);
        
        String token = tokenService.generateToken(admin);
        String email = tokenService.validateToken(token);

        assertEquals("admin@test.com", email);
    }
}
