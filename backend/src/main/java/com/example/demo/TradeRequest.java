
package com.example.demo;

public class TradeRequest {
    private Integer quantity;
    private Double price;
    private Trades.TradeType tradeType;
    private Trades.PriceType priceType;
    private String itemExchanged;

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Trades.TradeType getTradeType() { return tradeType; }
    public void setTradeType(Trades.TradeType tradeType) { this.tradeType = tradeType; }
    public Trades.PriceType getPriceType() { return priceType; }
    public void setPriceType(Trades.PriceType priceType) { this.priceType = priceType; }
    public String getItemExchanged() { return itemExchanged; }
    public void setItemExchanged(String itemExchanged) { this.itemExchanged = itemExchanged; }
}