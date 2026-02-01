package com.urbanape.api.domain.auth.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.urbanape.api.domain.auth.dtos.LoginRequestDTO;
import com.urbanape.api.domain.auth.dtos.RegisterRequestDTO;
import com.urbanape.api.domain.auth.dtos.TokenResponseDTO;
import com.urbanape.api.domain.auth.services.TokenService;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.repositories.UserRepository;
import com.urbanape.api.infra.dtos.ResponseMessageDTO;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.ResponseEntity;

import jakarta.validation.Valid;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("api/v1/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(request.email(), request.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new TokenResponseDTO(token));
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<ResponseMessageDTO> register(@RequestBody @Valid RegisterRequestDTO request) {
        if(userRepository.findByEmail(request.email()) != null) {
            return ResponseEntity.badRequest().body(new ResponseMessageDTO("User already registered"));
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(request.password());

        User user = new User(request.name(), request.email(), encryptedPassword, request.role());

        userRepository.save(user);

        return ResponseEntity.ok(new ResponseMessageDTO("User registered successfully"));
    }

}
