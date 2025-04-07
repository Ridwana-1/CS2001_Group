package com.example.demo;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop")
    private String shop;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "order_status")
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Column(name = "price")
    private Double price;

    @Column(name = "item")
    private String item;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Orders() {}

    
    public Orders(String shop, LocalDateTime orderDate, OrderStatus orderStatus, Double price, String item, Integer quantity, Long userId) {
        this.shop = shop;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.price = price;
        this.item = item;
        this.quantity = quantity;
        this.userId = userId; 
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShop() {
        return shop;
    }

    public void setShop(String shop) {
        this.shop = shop;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId; 
    }

    @Override
    public String toString() {
        return "Orders{" +
                "id=" + id +
                ", shop='" + shop + '\'' +
                ", orderDate=" + orderDate +
                ", orderStatus=" + orderStatus +
                ", price=" + price +
                ", item='" + item + '\'' +
                ", quantity=" + quantity +
                ", userId=" + userId +
                '}';
    }
}