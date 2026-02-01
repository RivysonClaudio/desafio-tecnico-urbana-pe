package com.urbanape.api.domain.users.controllers;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.urbanape.api.domain.users.dtos.DeleteUserListRequestDTO;
import com.urbanape.api.domain.users.dtos.UpdateUserRequestDTO;
import com.urbanape.api.domain.users.dtos.UserResponseDTO;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("v1/admin/users")
    public ResponseEntity<Page<UserResponseDTO>> getUsers(@RequestParam(required = false) String search, Pageable pageable) {
        if (search == null) search = "";
        Page<UserResponseDTO> users = userService.findAll(search, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("v1/users/me")
    public ResponseEntity<UserResponseDTO> getMe(@AuthenticationPrincipal User authenticatedUser) {
        
        UserResponseDTO user = userService.findById(authenticatedUser.getId());

        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(user);
    }

    @GetMapping("v1/admin/users/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {

        UserResponseDTO user = userService.findById(id);

        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(user);
    }

    @PatchMapping("v1/admin/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserRequestDTO updateUserRequestDTO) {

        UserResponseDTO user = userService.update(id, updateUserRequestDTO);

        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("v1/admin/users")
    public ResponseEntity<Void> deleteUser(@RequestBody @Valid DeleteUserListRequestDTO deleteUserRequestDTO) {

        if (deleteUserRequestDTO.ids().isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        userService.delete(deleteUserRequestDTO.ids());

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
