package com.urbanape.api.infra.exceptions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.SQLException;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import com.urbanape.api.domain.users.exceptions.UserAlreadyExistExeption;
import com.urbanape.api.domain.users.exceptions.UserNotFoundException;
import com.urbanape.api.infra.dtos.ErrorValidationDTO;
import com.urbanape.api.infra.dtos.ResponseMessageDTO;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionsHandleTest {

    private GlobalExceptionsHandle exceptionHandler;

    @Mock
    private WebRequest webRequest;

    @BeforeEach
    void setup() {
        exceptionHandler = new GlobalExceptionsHandle();
    }

    @Test
    void testHandleDatabaseExceptions_dataIntegrity() {
        DataIntegrityViolationException ex = new DataIntegrityViolationException("Constraint violation");

        ResponseEntity<Object> response = exceptionHandler.handleDatabaseExceptions(ex, webRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody() instanceof ResponseMessageDTO);
        ResponseMessageDTO body = (ResponseMessageDTO) response.getBody();
        assertEquals("Internal server error", body.message());
    }

    @Test
    void testHandleDatabaseExceptions_sqlException() {
        SQLException ex = new SQLException("Database error");

        ResponseEntity<Object> response = exceptionHandler.handleDatabaseExceptions(ex, webRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody() instanceof ResponseMessageDTO);
    }

    @Test
    void testHandleAllExceptions() {
        RuntimeException ex = new RuntimeException("Generic error");

        ResponseEntity<Object> response = exceptionHandler.handleAllExceptions(ex, webRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody() instanceof ResponseMessageDTO);
        ResponseMessageDTO body = (ResponseMessageDTO) response.getBody();
        assertEquals("Internal server error", body.message());
    }

    @Test
    void testHandleUserNotFoundException() {
        UserNotFoundException ex = new UserNotFoundException("User not found");

        ResponseEntity<Object> response = exceptionHandler.handleUserNotFoundException(ex, webRequest);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testHandleUserAlreadyExistExeption() {
        UserAlreadyExistExeption ex = new UserAlreadyExistExeption("Email already exists");

        ResponseEntity<Object> response = exceptionHandler.handleUserAlreadyExistExeption(ex, webRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email already exists", response.getBody());
    }

    @Test
    void testHandleMethodArgumentNotValid() throws Exception {
        BindingResult bindingResult = org.mockito.Mockito.mock(BindingResult.class);
        FieldError fieldError1 = new FieldError("user", "email", "invalid", false, null, null, "Email is required");
        FieldError fieldError2 = new FieldError("user", "name", null, false, null, null, "Name cannot be empty");
        
        org.mockito.Mockito.when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));
        
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null, bindingResult);
        HttpHeaders headers = new HttpHeaders();
        
        ResponseEntity<Object> response = exceptionHandler.handleMethodArgumentNotValid(
            ex, headers, HttpStatus.BAD_REQUEST, webRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody() instanceof List);
        
        @SuppressWarnings("unchecked")
        List<ErrorValidationDTO> errors = (List<ErrorValidationDTO>) response.getBody();
        assertEquals(2, errors.size());
        assertEquals("email", errors.get(0).field());
        assertEquals("Email is required", errors.get(0).message());
    }
}
