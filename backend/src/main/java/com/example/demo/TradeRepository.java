package com.example.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TradeRepository extends JpaRepository<Trades, Long> {
    List<Trades> findByOrderId(Long orderId);
}