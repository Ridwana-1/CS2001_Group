package com.example.demo;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/transactions")
public class DisputeController {

    private static final Logger logger = LoggerFactory.getLogger(DisputeController.class);

    private final DisputeService disputeService;

    @Autowired
    public DisputeController(DisputeService disputeService) {
        this.disputeService = disputeService;
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        List<Dispute> disputes = disputeService.getAllDisputes();
        logger.debug("Retrieved {} disputes", disputes.size());
        return ResponseEntity.ok(disputes);
    }

    @PostMapping("/disputes")
    public ResponseEntity<?> createDispute(@RequestBody DisputeRequest request) {
        if (request.getReason() == null || request.getReason().isEmpty()) {
            return ResponseEntity.badRequest().body("Reason is required for dispute submission.");
        }

        try {
            logger.debug("Received dispute request: {}", request);
            Dispute dispute = disputeService.createDispute(request);
            logger.debug("Dispute saved successfully: {}", dispute);
            return ResponseEntity.status(HttpStatus.CREATED).body(dispute);
        } catch (Exception e) {
            logger.error("Error creating dispute:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating dispute: " + e.getMessage());
        }
    }
}
