package com.urbanape.api.domain.users.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserAlreadyExistExeption extends RuntimeException {

    public UserAlreadyExistExeption(String message) {
        super(message);
    }

    public UserAlreadyExistExeption(String message, Throwable cause) {
        super(message, cause);
    }

    public UserAlreadyExistExeption(Throwable cause) {
        super(cause);
    }

}
