package com.urbanape.api.domain.users.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.urbanape.api.domain.cards.services.CardService;
import com.urbanape.api.domain.users.dtos.UpdateUserRequestDTO;
import com.urbanape.api.domain.users.dtos.UserResponseDTO;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired @Lazy
    private CardService cardService;

    public UserResponseDTO findById(Long id) {
        Optional<User> user = userRepository.findNotDeletedById(id);
        if (user.isEmpty()) return null;
        return mapUserToResponseDTO(user.get());
    }

    public Page<UserResponseDTO> findAll(String search, Pageable pageable) {
        Page<User> usersPage = userRepository.findAllNotDeleted(search, pageable);
        return usersPage.map(this::mapUserToResponseDTO);
    }

    @Transactional
    public UserResponseDTO update(Long id, UpdateUserRequestDTO updateUserRequestDTO) {
        Optional<User> user = userRepository.findNotDeletedById(id);
        
        if (user.isEmpty()) return null;

        User userEntity = user.get();

        if (updateUserRequestDTO.name() != null && !updateUserRequestDTO.name().isEmpty()) {
            userEntity.setName(updateUserRequestDTO.name());
        }
        if (updateUserRequestDTO.email() != null && !updateUserRequestDTO.email().isEmpty()) {
            userEntity.setEmail(updateUserRequestDTO.email());
        }
        if (updateUserRequestDTO.role() != null && !updateUserRequestDTO.role().name().isEmpty()) {
            userEntity.setRole(updateUserRequestDTO.role());
        }

        userRepository.save(userEntity);

        return mapUserToResponseDTO(userEntity);
    }

    @Transactional
    public void delete(Set<Long> ids) {
        userRepository.softDeleteAllByIds(ids);
        cardService.deleteAllByUserIds(ids);
    }

    private UserResponseDTO mapUserToResponseDTO(User user) {
        return new UserResponseDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getCards() != null 
                ? user.getCards().stream()
                    .map(card -> card.getNumber())
                    .collect(Collectors.toList())
                : List.of()
        );
    }

    public User findEntityById(Long id) {
        return userRepository.findNotDeletedById(id).orElse(null);
    }

}
