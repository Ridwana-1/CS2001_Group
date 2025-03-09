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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/transactions")  
public class DisputeController {

    private final DisputeService disputeService;

    @Autowired
    public DisputeController(DisputeService disputeService) {
        this.disputeService = disputeService;
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
    public ResponseEntity<?> createDispute(@RequestParam Long orderId, @RequestParam String reason) {
        if (reason == null || reason.isEmpty()) {
            return ResponseEntity.badRequest().body("Reason is required for dispute submission.");
        }

        Dispute dispute = disputeService.createDispute(orderId, reason);
        return ResponseEntity.status(HttpStatus.CREATED).body(dispute);
    }

    @PutMapping("/disputes/{id}/status")
    public ResponseEntity<?> updateDisputeStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            DisputeStatus disputeStatus = DisputeStatus.valueOf(status.toUpperCase());
            Dispute updatedDispute = disputeService.updateDisputeStatus(id, disputeStatus);
            return ResponseEntity.ok(updatedDispute);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid dispute status: " + status);
        }
    }
}
