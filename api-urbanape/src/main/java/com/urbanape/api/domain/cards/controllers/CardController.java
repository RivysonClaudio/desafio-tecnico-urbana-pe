package com.urbanape.api.domain.cards.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.urbanape.api.domain.cards.dtos.CardResponseDTO;
import com.urbanape.api.domain.cards.dtos.DeleteCardListRequestDTO;
import com.urbanape.api.domain.cards.dtos.NewCardRequestDTO;
import com.urbanape.api.domain.cards.dtos.UpdateCardRequestDTO;
import com.urbanape.api.domain.cards.services.CardService;
import com.urbanape.api.domain.users.entities.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/")
public class CardController {

    @Autowired
    private CardService cardService;

    @GetMapping("v1/cards/me")
    public ResponseEntity<Page<CardResponseDTO>> getCardsMe(@AuthenticationPrincipal User user, Pageable pageable) {
        return ResponseEntity.ok(cardService.findAllByUserId(user.getId(), pageable));
    }

    @GetMapping("v1/cards/me/{id}")
    public ResponseEntity<CardResponseDTO> getCardMe(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(cardService.findByIdAndUserId(id, user.getId()));
    }

    @GetMapping("v1/admin/cards")
    public ResponseEntity<Page<CardResponseDTO>> getCards(@RequestParam(required = false) Long user, Pageable pageable) {
        if (user != null) {
            return ResponseEntity.ok(cardService.findAllByUserId(user, pageable));
        }
        return ResponseEntity.ok(cardService.findAll(pageable));
    }

    @GetMapping("v1/admin/cards/{id}")
    public ResponseEntity<CardResponseDTO> getCard(@PathVariable Long id) {
        return ResponseEntity.ok(cardService.findById(id));
    }

    @PostMapping("v1/admin/cards")
    public ResponseEntity<CardResponseDTO> createCard(@RequestBody @Valid NewCardRequestDTO newCardRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.create(newCardRequest));
    }

    @PatchMapping("v1/admin/cards/{id}")
    public ResponseEntity<CardResponseDTO> updateCard(@PathVariable Long id, @RequestBody @Valid UpdateCardRequestDTO RequestUpdateCard) {
        return ResponseEntity.status(HttpStatus.OK).body(cardService.update(id, RequestUpdateCard));
    }

    @DeleteMapping("v1/admin/cards")
    public ResponseEntity<Object> deleteCard(@RequestBody @Valid DeleteCardListRequestDTO RequestDeleteCard) {
        cardService.deleteAll(RequestDeleteCard);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }

}
