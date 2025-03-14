package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;

    public Dispute createDispute(String reason, String description, String email, Long orderId) {
        Dispute dispute = new Dispute();
        dispute.setReason(reason);
        dispute.setDescription(description);
        dispute.setUserEmail(email);
        dispute.setStatus("PENDING");
        dispute.setOrderId(orderId);
        
        return disputeRepository.save(dispute);
    }
    
    public Dispute createDispute(DisputeRequest request) {
        return createDispute(
            request.getReason(),
            request.getDescription(),
            request.getEmail(),
            request.getOrderId()
        );
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public Optional<Dispute> getDisputeById(Long id) {
        return disputeRepository.findById(id);
    }
}
