package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/transactions")
public class DisputeController {

    private final DisputeService disputeService;
    private final OrderRepository orderRepository;

    @Autowired
    public DisputeController(DisputeService disputeService, OrderRepository orderRepository) {
        this.disputeService = disputeService;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(disputeService.getAllDisputes());
    }

    @GetMapping("/disputes/{id}")
    public ResponseEntity<Dispute> getDisputeById(@PathVariable Long id) {
        return disputeService.getDisputeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PostMapping("/disputes")
    public ResponseEntity<?> createDispute(@RequestBody DisputeRequest request) {
        if (request.getReason() == null || request.getReason().isEmpty()) {
            return ResponseEntity.badRequest().body("Reason is required for dispute submission.");
        }

        
        Dispute dispute = disputeService.createDispute(request.getReason(), request.getDescription());

        return ResponseEntity.status(HttpStatus.CREATED).body(dispute);
    }

    @PutMapping("/disputes/{id}/status")
    public ResponseEntity<?> updateDisputeStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        try {
            DisputeStatus disputeStatus = DisputeStatus.valueOf(request.getStatus().toUpperCase());
            Dispute updatedDispute = disputeService.updateDisputeStatus(id, disputeStatus);
            return ResponseEntity.ok(updatedDispute);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid dispute status: " + request.getStatus());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Orders>> getOrders() {
        List<Orders> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }
}
