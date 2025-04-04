package com.example.demo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByUserId(Long userId);
    List<Orders> findByOrderStatus(OrderStatus orderStatus);
    List<Orders> findByUserIdAndOrderStatus(Long userId, OrderStatus orderStatus);
}