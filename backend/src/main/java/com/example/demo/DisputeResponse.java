package com.example.demo;


public class DisputeResponse {
    private Long id;
    private String reason;
    private String description;
    private String userEmail;
    private String status;

    public DisputeResponse() {
    }

   
    public DisputeResponse(Long id, String reason, String description, String userEmail, String status) {
        this.id = id;
        this.reason = reason;
        this.description = description;
        this.userEmail = userEmail;
        this.status = status;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}