package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;

@Service
public class NodeJsUserService implements UserService {
    private final RestTemplate restTemplate;
    private final String nodeJsApiUrl;

    public NodeJsUserService(RestTemplateBuilder restTemplateBuilder,
                            @Value("${nodejs.api.url}") String nodeJsApiUrl) {
        this.restTemplate = restTemplateBuilder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
        this.nodeJsApiUrl = nodeJsApiUrl;
    }

    @Override
    public UserDto getUserById(String userId) {
        String url = String.format("%s/users/%s", nodeJsApiUrl, userId);
        
        try {
            ResponseEntity<UserDto> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<UserDto>() {}
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
            throw new ServiceException("Unexpected response status: " + response.getStatusCode());
            
        } catch (HttpClientErrorException.NotFound ex) {
            throw new UserNotFoundException("User not found with ID: " + userId);
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            throw new ServiceException("Error communicating with Node.js service: " + ex.getMessage());
        }
    }

    @Override
    public UserDto getUserByEmail(String email) {
        String url = String.format("%s/users?email=%s", nodeJsApiUrl, email);
        try {
            ResponseEntity<UserDto> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<UserDto>() {}
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
            throw new ServiceException("Unexpected response status: " + response.getStatusCode());
            
        } catch (HttpClientErrorException.NotFound ex) {
            throw new UserNotFoundException("User not found with email: " + email);
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            throw new ServiceException("Error communicating with Node.js service: " + ex.getMessage());
        }
    }
}