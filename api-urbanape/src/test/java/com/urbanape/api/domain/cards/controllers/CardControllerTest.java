package com.urbanape.api.domain.cards.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.urbanape.api.domain.cards.dtos.CardResponseDTO;
import com.urbanape.api.domain.cards.dtos.DeleteCardListRequestDTO;
import com.urbanape.api.domain.cards.dtos.NewCardRequestDTO;
import com.urbanape.api.domain.cards.dtos.UpdateCardRequestDTO;
import com.urbanape.api.domain.cards.entities.CardType;
import com.urbanape.api.domain.cards.services.CardService;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;

@ExtendWith(MockitoExtension.class)
class CardControllerTest {

    @Mock
    private CardService cardService;

    @InjectMocks
    private CardController controller;

    private User user;

    @BeforeEach
    void setup() {
        user = new User(1L, "João", "joao@test.com", "senha123", UserRole.USER);
    }

    @Test
    void testGetCardsMe() {
        CardResponseDTO card1 = new CardResponseDTO(7777123456789012L, "Cartão 1", true, CardType.COMUM);
        CardResponseDTO card2 = new CardResponseDTO(7777123456789013L, "Cartão 2", false, CardType.ESTUDANTE);
        Page<CardResponseDTO> page = new PageImpl<>(List.of(card1, card2), PageRequest.of(0, 10), 2);
        
        org.mockito.Mockito.when(cardService.findAllByUserId(any(), any())).thenReturn(page);

        ResponseEntity<Page<CardResponseDTO>> response = controller.getCardsMe(user, PageRequest.of(0, 10));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().getTotalElements());
    }

    @Test
    void testGetCardMe() {
        CardResponseDTO card = new CardResponseDTO(7777123456789012L, "Meu Cartão", true, CardType.COMUM);
        
        org.mockito.Mockito.when(cardService.findByIdAndUserId(any(), any())).thenReturn(card);

        ResponseEntity<CardResponseDTO> response = controller.getCardMe(user, 7777123456789012L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(7777123456789012L, response.getBody().number());
        assertEquals("Meu Cartão", response.getBody().title());
    }

    @Test
    void testGetCards() {
        CardResponseDTO card = new CardResponseDTO(7777123456789012L, "Cartão", true, CardType.COMUM);
        Page<CardResponseDTO> page = new PageImpl<>(List.of(card), PageRequest.of(0, 10), 1);
        
        org.mockito.Mockito.when(cardService.findAll(any())).thenReturn(page);

        ResponseEntity<Page<CardResponseDTO>> response = controller.getCards(null, PageRequest.of(0, 10));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getTotalElements());
    }

    @Test
    void testGetCards_withUserFilter() {
        CardResponseDTO card = new CardResponseDTO(7777123456789012L, "Cartão", true, CardType.COMUM);
        Page<CardResponseDTO> page = new PageImpl<>(List.of(card), PageRequest.of(0, 10), 1);
        
        org.mockito.Mockito.when(cardService.findAllByUserId(eq(1L), any())).thenReturn(page);

        ResponseEntity<Page<CardResponseDTO>> response = controller.getCards(1L, PageRequest.of(0, 10));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getTotalElements());
    }

    @Test
    void testGetCard() {
        CardResponseDTO card = new CardResponseDTO(7777123456789012L, "Cartão", true, CardType.COMUM);
        
        org.mockito.Mockito.when(cardService.findById(7777123456789012L)).thenReturn(card);

        ResponseEntity<CardResponseDTO> response = controller.getCard(7777123456789012L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(7777123456789012L, response.getBody().number());
    }

    @Test
    void testCreateCard() {
        NewCardRequestDTO request = new NewCardRequestDTO(1L, "Novo Cartão", CardType.ESTUDANTE);
        CardResponseDTO created = new CardResponseDTO(7777123456789012L, "Novo Cartão", true, CardType.ESTUDANTE);
        
        org.mockito.Mockito.when(cardService.create(any())).thenReturn(created);

        ResponseEntity<CardResponseDTO> response = controller.createCard(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Novo Cartão", response.getBody().title());
        assertEquals(CardType.ESTUDANTE, response.getBody().type());
    }

    @Test
    void testUpdateCard() {
        UpdateCardRequestDTO updateDTO = new UpdateCardRequestDTO("Cartão Atualizado", false, CardType.TRABALHADOR);
        CardResponseDTO updated = new CardResponseDTO(7777123456789012L, "Cartão Atualizado", false, CardType.TRABALHADOR);
        
        org.mockito.Mockito.when(cardService.update(eq(7777123456789012L), any())).thenReturn(updated);

        ResponseEntity<CardResponseDTO> response = controller.updateCard(7777123456789012L, updateDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Cartão Atualizado", response.getBody().title());
        assertEquals(false, response.getBody().status());
    }

    @Test
    void testDeleteCard() {
        DeleteCardListRequestDTO deleteDTO = new DeleteCardListRequestDTO(Set.of(7777123456789012L, 7777123456789013L));
        
        org.mockito.Mockito.doNothing().when(cardService).deleteAll(any());

        ResponseEntity<Object> response = controller.deleteCard(deleteDTO);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}
