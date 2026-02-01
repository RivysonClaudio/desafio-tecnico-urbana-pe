package com.urbanape.api.domain.users.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
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
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.urbanape.api.domain.users.dtos.DeleteUserListRequestDTO;
import com.urbanape.api.domain.users.dtos.UpdateUserRequestDTO;
import com.urbanape.api.domain.users.dtos.UserResponseDTO;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;
import com.urbanape.api.domain.users.services.UserService;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController controller;

    private User user;

    @BeforeEach
    void setup() {
        user = new User(1L, "João", "joao@test.com", "senha123", UserRole.USER);
    }

    @Test
    void testGetUsers() {
        UserResponseDTO user1 = new UserResponseDTO(1L, "João", "joao@test.com", UserRole.USER, List.of());
        UserResponseDTO user2 = new UserResponseDTO(2L, "Maria", "maria@test.com", UserRole.ADMIN, List.of());
        Page<UserResponseDTO> page = new PageImpl<>(List.of(user1, user2), PageRequest.of(0, 10), 2);
        
        org.mockito.Mockito.when(userService.findAll(any(String.class), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<UserResponseDTO>> response = controller.getUsers(null, PageRequest.of(0, 10));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().getTotalElements());
    }

    @Test
    void testGetUsers_withSearch() {
        UserResponseDTO user1 = new UserResponseDTO(1L, "João", "joao@test.com", UserRole.USER, List.of());
        Page<UserResponseDTO> page = new PageImpl<>(List.of(user1), PageRequest.of(0, 10), 1);
        
        org.mockito.Mockito.when(userService.findAll(eq("joão"), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<UserResponseDTO>> response = controller.getUsers("joão", PageRequest.of(0, 10));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getTotalElements());
        assertEquals("João", response.getBody().getContent().get(0).name());
    }

    @Test
    void testGetMe() {
        UserResponseDTO userDTO = new UserResponseDTO(1L, "João", "joao@test.com", UserRole.USER, List.of());
        
        org.mockito.Mockito.when(userService.findById(1L)).thenReturn(userDTO);

        ResponseEntity<UserResponseDTO> response = controller.getMe(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("João", response.getBody().name());
        assertEquals("joao@test.com", response.getBody().email());
    }

    @Test
    void testGetMe_notFound() {
        org.mockito.Mockito.when(userService.findById(any())).thenReturn(null);

        ResponseEntity<UserResponseDTO> response = controller.getMe(user);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testGetUser() {
        UserResponseDTO userDTO = new UserResponseDTO(1L, "João", "joao@test.com", UserRole.USER, List.of());
        
        org.mockito.Mockito.when(userService.findById(1L)).thenReturn(userDTO);

        ResponseEntity<UserResponseDTO> response = controller.getUser(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().id());
    }

    @Test
    void testGetUser_notFound() {
        org.mockito.Mockito.when(userService.findById(999L)).thenReturn(null);

        ResponseEntity<UserResponseDTO> response = controller.getUser(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testUpdateUser() {
        UpdateUserRequestDTO updateDTO = new UpdateUserRequestDTO("João Atualizado", "novo@test.com", UserRole.ADMIN);
        UserResponseDTO updated = new UserResponseDTO(1L, "João Atualizado", "novo@test.com", UserRole.ADMIN, List.of());
        
        org.mockito.Mockito.when(userService.update(eq(1L), any())).thenReturn(updated);

        ResponseEntity<UserResponseDTO> response = controller.updateUser(1L, updateDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("João Atualizado", response.getBody().name());
        assertEquals("novo@test.com", response.getBody().email());
    }

    @Test
    void testUpdateUser_notFound() {
        UpdateUserRequestDTO updateDTO = new UpdateUserRequestDTO("Teste", null, null);
        
        org.mockito.Mockito.when(userService.update(eq(999L), any())).thenReturn(null);

        ResponseEntity<UserResponseDTO> response = controller.updateUser(999L, updateDTO);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeleteUser() {
        DeleteUserListRequestDTO deleteDTO = new DeleteUserListRequestDTO(Set.of(1L, 2L));
        
        org.mockito.Mockito.doNothing().when(userService).delete(any());

        ResponseEntity<Void> response = controller.deleteUser(deleteDTO);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testDeleteUser_emptyList() {
        DeleteUserListRequestDTO deleteDTO = new DeleteUserListRequestDTO(Set.of());

        ResponseEntity<Void> response = controller.deleteUser(deleteDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
