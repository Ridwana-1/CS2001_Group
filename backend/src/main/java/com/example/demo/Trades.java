package com.example.demo;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "trades")
public class Trades {

    public enum UserType { ADMIN, USER }
    public enum TradeType { BUY, SELL, EXCHANGE }
    public enum TradeStatus { PENDING, COMPLETED, CANCELLED }
    public enum PriceType { INDIVIDUAL, TOTAL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trade_date", nullable = false)
    private LocalDateTime tradeDate;

    @Column(name = "trade_quantity", nullable = false)
    private Integer tradeQuantity;

    @Column(name = "trade_price", nullable = false)
    private Double tradePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    @Enumerated(EnumType.STRING)
    @Column(name = "trade_type", nullable = false)
    private TradeType tradeType;

    @Enumerated(EnumType.STRING)
    @Column(name = "trade_status", nullable = false)
    private TradeStatus tradeStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", nullable = false)
    private PriceType priceType;

    @Column(name = "item_exchanged")
    private String itemExchanged;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id", nullable = false)
    private Orders order;

    // Getters
    public Long getId() {
        return id;
    }

    public LocalDateTime getTradeDate() {
        return tradeDate;
    }

    public Integer getTradeQuantity() {
        return tradeQuantity;
    }

    public Double getTradePrice() {
        return tradePrice;
    }

    public UserType getUserType() {
        return userType;
    }

    public TradeType getTradeType() {
        return tradeType;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public PriceType getPriceType() {
        return priceType;
    }

    public String getItemExchanged() {
        return itemExchanged;
    }

    public Orders getOrder() {
        return order;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTradeDate(LocalDateTime tradeDate) {
        this.tradeDate = tradeDate;
    }

    public void setTradeQuantity(Integer tradeQuantity) {
        this.tradeQuantity = tradeQuantity;
    }

    public void setTradePrice(Double tradePrice) {
        this.tradePrice = tradePrice;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public void setTradeType(TradeType tradeType) {
        this.tradeType = tradeType;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setPriceType(PriceType priceType) {
        this.priceType = priceType;
    }

    public void setItemExchanged(String itemExchanged) {
        this.itemExchanged = itemExchanged;
    }

    public void setOrder(Orders order) {
        this.order = order;
    }

    @Override
    public String toString() {
        return "Trades{" +
                "id=" + id +
                ", tradeDate=" + tradeDate +
                ", tradeQuantity=" + tradeQuantity +
                ", tradePrice=" + tradePrice +
                ", userType=" + userType +
                ", tradeType=" + tradeType +
                ", tradeStatus=" + tradeStatus +
                ", priceType=" + priceType +
                ", itemExchanged='" + itemExchanged + '\'' +
                ", order=" + order +
                '}';
    }
}