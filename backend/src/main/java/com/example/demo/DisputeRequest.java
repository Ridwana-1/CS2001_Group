package com.example.demo;

public class DisputeRequest {
    private String reason;
    private String description;
    private String email;
    private Long orderId;

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    @Override
    public String toString() {
        return "DisputeRequest{" +
            "orderId=" + orderId +
            ", email='" + email + '\'' +
            ", reason='" + reason + '\'' +
            ", description='" + description + '\'' +
            '}';
    }
}
