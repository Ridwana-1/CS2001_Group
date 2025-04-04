package com.example.demo;
public class OrderNotFoundException extends RuntimeException {
    
    public OrderNotFoundException(Long orderId) {
        super("Order not found with ID: " + orderId);
    }
}