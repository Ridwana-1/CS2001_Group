package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final OrderRepository OrderRepository;

    @Autowired
    public DisputeService(DisputeRepository disputeRepository, OrderRepository OrderRepository) {
        this.disputeRepository = disputeRepository;
        this.OrderRepository = OrderRepository;
    }

    public Dispute createDispute(Long orderId, String reason) {
        Orders order = OrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        Dispute dispute = new Dispute();
        dispute.setOrder(order);
        dispute.setReason(reason);
        dispute.setStatus(DisputeStatus.PENDING); // Or whatever the default status is

        return disputeRepository.save(dispute);
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public Optional<Dispute> getDisputeById(Long id) {
        return disputeRepository.findById(id);
    }

    public Dispute updateDisputeStatus(Long id, DisputeStatus status) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found with id: " + id));
        
        dispute.setStatus(status);
        return disputeRepository.save(dispute);
    }
}
