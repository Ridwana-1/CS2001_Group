package com.example.demo;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "trades")
public class Trades {
    public enum TradeType { BUY, SELL, EXCHANGE }
    public enum TradeStatus { PENDING, COMPLETED, CANCELLED }
    public enum PriceType { EXCHANGE, CURRENCY }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trade_date", nullable = false)
    private LocalDateTime tradeDate;

    @Column(name = "quantity_received", nullable = false)
    private Integer quantityReceived;

    @Column(name = "quantity_given", nullable = false)
    private Integer quantityGiven;

    @Column(name = "trade_price", nullable = false)
    private Double tradePrice;

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

  
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getTradeDate() { return tradeDate; }
    public void setTradeDate(LocalDateTime tradeDate) { this.tradeDate = tradeDate; }
    public Integer getQuantityReceived() { return quantityReceived; }
    public void setQuantityReceived(Integer quantityReceived) { this.quantityReceived = quantityReceived; }
    public Integer getQuantityGiven() { return quantityGiven; }
    public void setQuantityGiven(Integer quantityGiven) { this.quantityGiven = quantityGiven; }
    public Double getTradePrice() { return tradePrice; }
    public void setTradePrice(Double tradePrice) { this.tradePrice = tradePrice; }
    public TradeType getTradeType() { return tradeType; }
    public void setTradeType(TradeType tradeType) { this.tradeType = tradeType; }
    public TradeStatus getTradeStatus() { return tradeStatus; }
    public void setTradeStatus(TradeStatus tradeStatus) { this.tradeStatus = tradeStatus; }
    public PriceType getPriceType() { return priceType; }
    public void setPriceType(PriceType priceType) { this.priceType = priceType; }
    public String getItemExchanged() { return itemExchanged; }
    public void setItemExchanged(String itemExchanged) { this.itemExchanged = itemExchanged; }
    public Orders getOrder() { return order; }
    public void setOrder(Orders order) { this.order = order; }
}