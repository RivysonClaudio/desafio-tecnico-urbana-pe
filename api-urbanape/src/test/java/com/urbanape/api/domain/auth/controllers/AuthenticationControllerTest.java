package com.urbanape.api.domain.auth.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.urbanape.api.domain.auth.dtos.LoginRequestDTO;
import com.urbanape.api.domain.auth.dtos.RegisterRequestDTO;
import com.urbanape.api.domain.auth.dtos.TokenResponseDTO;
import com.urbanape.api.domain.auth.services.TokenService;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;
import com.urbanape.api.domain.users.repositories.UserRepository;
import com.urbanape.api.infra.dtos.ResponseMessageDTO;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthenticationController controller;

    private User user;

    @BeforeEach
    void setup() {
        user = new User(1L, "João", "joao@test.com", "$2a$10$encrypted", UserRole.USER);
    }

    @Test
    void testLogin() {
        LoginRequestDTO request = new LoginRequestDTO("joao@test.com", "senha123");
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(auth);
        when(tokenService.generateToken(user)).thenReturn("token123");

        ResponseEntity<TokenResponseDTO> response = controller.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("token123", response.getBody().token());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenService).generateToken(user);
    }

    @Test
    void testLogin_invalidCredentials() {
        LoginRequestDTO request = new LoginRequestDTO("joao@test.com", "senhaErrada");
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Invalid credentials"));

        try {
            controller.login(request);
        } catch (BadCredentialsException e) {
            assertEquals("Invalid credentials", e.getMessage());
        }
        
        verify(tokenService, never()).generateToken(any());
    }

    @Test
    void testRegister() {
        RegisterRequestDTO request = new RegisterRequestDTO(
            "Maria", "maria@test.com", "Senha123@", UserRole.USER
        );
        
        when(userRepository.findByEmail("maria@test.com")).thenReturn(null);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<ResponseMessageDTO> response = controller.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("User registered successfully", response.getBody().message());
        verify(userRepository).findByEmail("maria@test.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegister_emailAlreadyExists() {
        RegisterRequestDTO request = new RegisterRequestDTO(
            "João", "joao@test.com", "Senha123@", UserRole.USER
        );
        
        when(userRepository.findByEmail("joao@test.com")).thenReturn(user);

        ResponseEntity<ResponseMessageDTO> response = controller.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("User already registered", response.getBody().message());
        verify(userRepository).findByEmail("joao@test.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_adminRole() {
        RegisterRequestDTO request = new RegisterRequestDTO(
            "Admin", "admin@test.com", "Senha123@", UserRole.ADMIN
        );
        
        when(userRepository.findByEmail("admin@test.com")).thenReturn(null);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<ResponseMessageDTO> response = controller.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userRepository).save(any(User.class));
    }
}
