package com.urbanape.api.domain.cards.services;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.urbanape.api.domain.cards.dtos.CardResponseDTO;
import com.urbanape.api.domain.cards.dtos.DeleteCardListRequestDTO;
import com.urbanape.api.domain.cards.dtos.NewCardRequestDTO;
import com.urbanape.api.domain.cards.dtos.UpdateCardRequestDTO;
import com.urbanape.api.domain.cards.entities.Card;
import com.urbanape.api.domain.cards.repositories.CardRepository;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.services.UserService;

import jakarta.transaction.Transactional;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired @Lazy
    private UserService userService;

    private static final String PREFIX = "7777";

    public Page<CardResponseDTO> findAll(Pageable pageable) {
        Page<CardResponseDTO> cards = cardRepository.findAllNotDeleted(pageable)
            .map(card -> mapCardToDTO(card));

        return cards;
    }

    public CardResponseDTO findById(Long id) {
        return cardRepository.findById(id).map(card -> mapCardToDTO(card)).orElse(null);
    }

    @Transactional
    public CardResponseDTO create(NewCardRequestDTO requestNewCardDTO) {
        Long sequence = cardRepository.nextCardNumber();

        Long cardNumber = generateCardNumber(sequence);

        User user = userService.findEntityById(requestNewCardDTO.userId());

        if (user == null) return null;

        Card card = new Card(
            cardNumber,
            requestNewCardDTO.title(),
            true, 
            requestNewCardDTO.type(),
            user
        );

        cardRepository.save(card);

        return mapCardToDTO(card);
    }

    @Transactional
    public CardResponseDTO update(Long id, UpdateCardRequestDTO requestUpdateCardDTO) {
        Card card = cardRepository.findById(id).orElse(null);

        if (card == null) return null;

        if (requestUpdateCardDTO.title() != null) card.setTitle(requestUpdateCardDTO.title());
        if (requestUpdateCardDTO.type() != null) card.setType(requestUpdateCardDTO.type());
        if (requestUpdateCardDTO.status() != null) card.setStatus(requestUpdateCardDTO.status());

        cardRepository.save(card);

        return mapCardToDTO(card);
    }

    @Transactional
    public void deleteAll(DeleteCardListRequestDTO requestDeleteCardDTO) {
        cardRepository.softDeleteAllByNumbers(requestDeleteCardDTO.numbers());
    }

    @Transactional
    public void deleteAllByUserIds(Set<Long> userIds) {
        cardRepository.softDeleteAllByUserIds(userIds);
    }

    public Page<CardResponseDTO> findAllByUserId(Long userId, Pageable pageable) {
        Page<CardResponseDTO> cards = cardRepository.findAllByUserId(userId, pageable)
            .map(card -> mapCardToDTO(card));
        return cards;
    }

    public CardResponseDTO findByIdAndUserId(Long id, Long userId) {
        return cardRepository.findByIdAndUserId(id, userId)
            .map(card -> mapCardToDTO(card)).orElse(null);
    }

    public static Long generateCardNumber(long sequence) {
        
        long obfuscated = (sequence * 7919) % 1_000_000_000_000L;

        String base = PREFIX + String.format("%011d", obfuscated);

        int checkDigit = luhn(base);

        return Long.parseLong(base) * 10 + checkDigit;
    }

    private static int luhn(String number) {
        int sum = 0;
        boolean alternate = true;

        for (int i = number.length() - 1; i >= 0; i--) {
            int n = number.charAt(i) - '0';
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return (10 - (sum % 10)) % 10;
    }

    private CardResponseDTO mapCardToDTO(Card card) {
        return new CardResponseDTO(
            card.getNumber(),
            card.getTitle(),
            card.getStatus(),
            card.getType()
        );
    }
}
