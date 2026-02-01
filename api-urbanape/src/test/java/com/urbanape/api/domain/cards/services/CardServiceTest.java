package com.urbanape.api.domain.cards.services;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
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

import com.urbanape.api.domain.cards.dtos.CardResponseDTO;
import com.urbanape.api.domain.cards.dtos.DeleteCardListRequestDTO;
import com.urbanape.api.domain.cards.dtos.NewCardRequestDTO;
import com.urbanape.api.domain.cards.dtos.UpdateCardRequestDTO;
import com.urbanape.api.domain.cards.entities.Card;
import com.urbanape.api.domain.cards.entities.CardType;
import com.urbanape.api.domain.cards.repositories.CardRepository;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;
import com.urbanape.api.domain.users.services.UserService;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CardService cardService;

    private User user;
    private Card card;

    @BeforeEach
    void setup() {
        user = new User(1L, "João", "joao@test.com", "senha123", UserRole.USER);
        card = new Card(7777123456789012L, "Meu Cartão", true, CardType.COMUM, user);
    }

    @Test
    void testCreate() {
        NewCardRequestDTO request = new NewCardRequestDTO(1L, "Cartão Novo", CardType.ESTUDANTE);
        
        when(cardRepository.nextCardNumber()).thenReturn(100L);
        when(userService.findEntityById(1L)).thenReturn(user);
        when(cardRepository.save(any(Card.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CardResponseDTO result = cardService.create(request);

        assertNotNull(result);
        assertEquals("Cartão Novo", result.title());
        assertEquals(CardType.ESTUDANTE, result.type());
        assertTrue(result.status());
        verify(cardRepository).save(any(Card.class));
    }

    @Test
    void testCreate_whenUserNotFound() {
        NewCardRequestDTO request = new NewCardRequestDTO(999L, "Cartão", CardType.COMUM);
        
        when(cardRepository.nextCardNumber()).thenReturn(100L);
        when(userService.findEntityById(999L)).thenReturn(null);

        CardResponseDTO result = cardService.create(request);

        assertNull(result);
        verify(cardRepository, never()).save(any());
    }

    @Test
    void testFindAll() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Card> cardPage = new PageImpl<>(java.util.List.of(card), pageable, 1);
        
        when(cardRepository.findAllNotDeleted(pageable)).thenReturn(cardPage);

        Page<CardResponseDTO> result = cardService.findAll(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Meu Cartão", result.getContent().get(0).title());
    }

    @Test
    void testFindById() {
        when(cardRepository.findById(7777123456789012L)).thenReturn(Optional.of(card));

        CardResponseDTO result = cardService.findById(7777123456789012L);

        assertNotNull(result);
        assertEquals(7777123456789012L, result.number());
        assertEquals("Meu Cartão", result.title());
    }

    @Test
    void testFindById_notFound() {
        when(cardRepository.findById(999L)).thenReturn(Optional.empty());

        CardResponseDTO result = cardService.findById(999L);

        assertNull(result);
    }

    @Test
    void testFindAllByUserId() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Card> cardPage = new PageImpl<>(java.util.List.of(card), pageable, 1);
        
        when(cardRepository.findAllByUserId(1L, pageable)).thenReturn(cardPage);

        Page<CardResponseDTO> result = cardService.findAllByUserId(1L, pageable);

        assertEquals(1, result.getTotalElements());
        verify(cardRepository).findAllByUserId(1L, pageable);
    }

    @Test
    void testFindByIdAndUserId() {
        when(cardRepository.findByIdAndUserId(7777123456789012L, 1L))
            .thenReturn(Optional.of(card));

        CardResponseDTO result = cardService.findByIdAndUserId(7777123456789012L, 1L);

        assertNotNull(result);
        assertEquals(7777123456789012L, result.number());
    }

    @Test
    void testFindByIdAndUserId_wrongUser() {
        when(cardRepository.findByIdAndUserId(7777123456789012L, 2L))
            .thenReturn(Optional.empty());

        CardResponseDTO result = cardService.findByIdAndUserId(7777123456789012L, 2L);

        assertNull(result);
    }

    @Test
    void testUpdate() {
        UpdateCardRequestDTO update = new UpdateCardRequestDTO("Título Atualizado", false, CardType.TRABALHADOR);
        
        when(cardRepository.findById(7777123456789012L)).thenReturn(Optional.of(card));
        when(cardRepository.save(any(Card.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CardResponseDTO result = cardService.update(7777123456789012L, update);

        assertNotNull(result);
        assertEquals("Título Atualizado", result.title());
        assertFalse(result.status());
        assertEquals(CardType.TRABALHADOR, result.type());
    }

    @Test
    void testUpdate_partial() {
        UpdateCardRequestDTO update = new UpdateCardRequestDTO(null, false, null);
        
        when(cardRepository.findById(7777123456789012L)).thenReturn(Optional.of(card));
        when(cardRepository.save(any(Card.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CardResponseDTO result = cardService.update(7777123456789012L, update);

        assertNotNull(result);
        assertEquals("Meu Cartão", result.title());
        assertFalse(result.status());
    }

    @Test
    void testUpdate_notFound() {
        UpdateCardRequestDTO update = new UpdateCardRequestDTO("Teste", true, CardType.COMUM);
        
        when(cardRepository.findById(999L)).thenReturn(Optional.empty());

        CardResponseDTO result = cardService.update(999L, update);

        assertNull(result);
        verify(cardRepository, never()).save(any());
    }

    @Test
    void testDeleteAll() {
        Set<Long> numbers = Set.of(7777123456789012L, 7777123456789013L);
        DeleteCardListRequestDTO request = new DeleteCardListRequestDTO(numbers);
        
        doNothing().when(cardRepository).softDeleteAllByNumbers(numbers);

        cardService.deleteAll(request);

        verify(cardRepository).softDeleteAllByNumbers(numbers);
    }

    @Test
    void testDeleteAllByUserIds() {
        Set<Long> userIds = Set.of(1L, 2L);
        
        doNothing().when(cardRepository).softDeleteAllByUserIds(userIds);

        cardService.deleteAllByUserIds(userIds);

        verify(cardRepository).softDeleteAllByUserIds(userIds);
    }

    @Test
    void testGenerateCardNumber() {
        long sequence = 12345L;
        
        Long cardNumber = CardService.generateCardNumber(sequence);

        assertNotNull(cardNumber);
        assertTrue(cardNumber.toString().startsWith("7777"));
        assertEquals(16, cardNumber.toString().length());
    }

    @Test
    void testGenerateCardNumber_differentSequences() {
        Long card1 = CardService.generateCardNumber(1L);
        Long card2 = CardService.generateCardNumber(2L);

        assertNotEquals(card1, card2);
    }
}
