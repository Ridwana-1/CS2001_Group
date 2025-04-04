package com.example.demo;

public interface UserService {
    UserDto getUserById(String userId);
    UserDto getUserByEmail(String email);
}