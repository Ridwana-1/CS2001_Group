package com.example.demo;

public class ServiceException extends RuntimeException {
    public ServiceException(String message) {
        super(message);
    }
}