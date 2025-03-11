package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;

    @Autowired
    public DisputeService(DisputeRepository disputeRepository) {
        this.disputeRepository = disputeRepository;
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public Optional<Dispute> getDisputeById(Long id) {
        return disputeRepository.findById(id);
    }

    public Dispute createDispute(String reason, String description) {  
        Dispute dispute = new Dispute();
        dispute.setReason(reason);
        dispute.setDescription(description); 
        dispute.setStatus(DisputeStatus.PENDING);
    
        return disputeRepository.save(dispute);
    }
    
    public Dispute updateDisputeStatus(Long id, DisputeStatus status) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found with id: " + id));

        dispute.setStatus(status);
        return disputeRepository.save(dispute);
    }
}
