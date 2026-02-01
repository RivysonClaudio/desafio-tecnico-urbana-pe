package com.urbanape.api.domain.users.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.urbanape.api.domain.cards.entities.Card;
import com.urbanape.api.domain.cards.entities.CardType;
import com.urbanape.api.domain.cards.services.CardService;
import com.urbanape.api.domain.users.dtos.UpdateUserRequestDTO;
import com.urbanape.api.domain.users.dtos.UserResponseDTO;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;
import com.urbanape.api.domain.users.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CardService cardService;

    @InjectMocks
    private UserService userService;

    private User user;
    private User admin;

    @BeforeEach
    void setup() {
        user = new User(1L, "João", "joao@test.com", "senha123", UserRole.USER);
        admin = new User(2L, "Admin", "admin@test.com", "senha123", UserRole.ADMIN);
        
        Card card1 = new Card(7777123456789012L, "Cartão 1", true, CardType.COMUM, user);
        Card card2 = new Card(7777123456789013L, "Cartão 2", true, CardType.ESTUDANTE, user);
        user.setCards(List.of(card1, card2));
    }

    @Test
    void testFindById() {
        when(userRepository.findNotDeletedById(1L)).thenReturn(Optional.of(user));

        UserResponseDTO result = userService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("João", result.name());
        assertEquals("joao@test.com", result.email());
        assertEquals(UserRole.USER, result.role());
        assertEquals(2, result.cardNumber().size());
    }

    @Test
    void testFindById_notFound() {
        when(userRepository.findNotDeletedById(999L)).thenReturn(Optional.empty());

        UserResponseDTO result = userService.findById(999L);

        assertNull(result);
    }

    @Test
    void testFindAll() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> page = new PageImpl<>(List.of(user, admin), pageable, 2);
        
        when(userRepository.findAllNotDeleted(any(String.class), eq(pageable))).thenReturn(page);

        Page<UserResponseDTO> result = userService.findAll("", pageable);

        assertEquals(2, result.getTotalElements());
        assertEquals("João", result.getContent().get(0).name());
        assertEquals("Admin", result.getContent().get(1).name());
    }

    @Test
    void testFindAll_withSearch() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> page = new PageImpl<>(List.of(user), pageable, 1);
        
        when(userRepository.findAllNotDeleted(eq("joão"), eq(pageable))).thenReturn(page);

        Page<UserResponseDTO> result = userService.findAll("joão", pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("João", result.getContent().get(0).name());
    }

    @Test
    void testUpdate_name() {
        UpdateUserRequestDTO dto = new UpdateUserRequestDTO("João Atualizado", null, null);
        
        when(userRepository.findNotDeletedById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO result = userService.update(1L, dto);

        assertNotNull(result);
        assertEquals("João Atualizado", result.name());
        assertEquals("joao@test.com", result.email());
    }

    @Test
    void testUpdate_email() {
        UpdateUserRequestDTO dto = new UpdateUserRequestDTO(null, "novo@test.com", null);
        
        when(userRepository.findNotDeletedById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO result = userService.update(1L, dto);

        assertEquals("novo@test.com", result.email());
        assertEquals("João", result.name());
    }

    @Test
    void testUpdate_role() {
        UpdateUserRequestDTO dto = new UpdateUserRequestDTO(null, null, UserRole.ADMIN);
        
        when(userRepository.findNotDeletedById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO result = userService.update(1L, dto);

        assertEquals(UserRole.ADMIN, result.role());
    }

    @Test
    void testUpdate_allFields() {
        UpdateUserRequestDTO dto = new UpdateUserRequestDTO("Maria", "maria@test.com", UserRole.ADMIN);
        
        when(userRepository.findNotDeletedById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO result = userService.update(1L, dto);

        assertEquals("Maria", result.name());
        assertEquals("maria@test.com", result.email());
        assertEquals(UserRole.ADMIN, result.role());
    }

    @Test
    void testUpdate_userNotFound() {
        UpdateUserRequestDTO dto = new UpdateUserRequestDTO("Teste", null, null);
        
        when(userRepository.findNotDeletedById(999L)).thenReturn(Optional.empty());

        UserResponseDTO result = userService.update(999L, dto);

        assertNull(result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testDelete() {
        Set<Long> ids = Set.of(1L, 2L);
        
        doNothing().when(userRepository).softDeleteAllByIds(ids);
        doNothing().when(cardService).deleteAllByUserIds(ids);

        userService.delete(ids);

        verify(userRepository).softDeleteAllByIds(ids);
        verify(cardService).deleteAllByUserIds(ids);
    }

    @Test
    void testFindEntityById() {
        when(userRepository.findNotDeletedById(1L)).thenReturn(Optional.of(user));

        User result = userService.findEntityById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("João", result.getName());
    }

    @Test
    void testFindEntityById_notFound() {
        when(userRepository.findNotDeletedById(999L)).thenReturn(Optional.empty());

        User result = userService.findEntityById(999L);

        assertNull(result);
    }

    @Test
    void testFindById_userWithoutCards() {
        User userSemCards = new User(3L, "Pedro", "pedro@test.com", "senha123", UserRole.USER);
        userSemCards.setCards(null);
        
        when(userRepository.findNotDeletedById(3L)).thenReturn(Optional.of(userSemCards));

        UserResponseDTO result = userService.findById(3L);

        assertNotNull(result);
        assertEquals(3L, result.id());
        assertNotNull(result.cardNumber());
        assertTrue(result.cardNumber().isEmpty());
    }
}
