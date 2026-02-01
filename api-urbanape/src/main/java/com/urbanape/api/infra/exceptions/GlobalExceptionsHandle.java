package com.urbanape.api.infra.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.urbanape.api.domain.users.exceptions.UserNotFoundException;
import com.urbanape.api.domain.users.exceptions.UserAlreadyExistExeption;

import com.urbanape.api.infra.dtos.ErrorValidationDTO;

import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.dao.DataIntegrityViolationException;
import java.sql.SQLException;

import com.urbanape.api.infra.dtos.ResponseMessageDTO;

@ControllerAdvice
public class GlobalExceptionsHandle extends ResponseEntityExceptionHandler {

    @ExceptionHandler({DataIntegrityViolationException.class, SQLException.class})
    public final ResponseEntity<Object> handleDatabaseExceptions(Exception ex, WebRequest request) {
        return new ResponseEntity<>(
            new ResponseMessageDTO("Internal server error"), 
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        return new ResponseEntity<>(
            new ResponseMessageDTO("Internal server error"), // ex.getMessage()
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<ErrorValidationDTO> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new ErrorValidationDTO(error.getField(), error.getDefaultMessage(), error.getRejectedValue()))
                .collect(Collectors.toList());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistExeption.class)
    public ResponseEntity<Object> handleUserAlreadyExistExeption(UserAlreadyExistExeption ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
