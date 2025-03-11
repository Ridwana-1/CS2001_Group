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
        System.out.println("Creating Dispute...");
        System.out.println("Reason: " + reason);
        System.out.println("Description: " + description);

        Dispute dispute = new Dispute();
        dispute.setReason(reason);
        dispute.setDescription(description);
        dispute.setStatus(DisputeStatus.PENDING);

        Dispute savedDispute = disputeRepository.save(dispute);
        System.out.println("Dispute saved with ID: " + savedDispute.getId());

        return savedDispute;
    }

    public Dispute updateDisputeStatus(Long id, DisputeStatus status) {
        System.out.println("Updating dispute status for ID: " + id);
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found with id: " + id));

        dispute.setStatus(status);
        Dispute updatedDispute = disputeRepository.save(dispute);
        System.out.println("Dispute status updated to: " + status);
        return updatedDispute;
    }
}
