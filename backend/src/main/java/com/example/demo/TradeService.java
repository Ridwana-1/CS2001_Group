package com.example.demo;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TradeService {
    private final OrdersRepository ordersRepository;
    private final TradeRepository tradeRepository;
    private final UserService userService;

    public TradeService(OrdersRepository ordersRepository,
                       TradeRepository tradeRepository,
                       UserService userService) {
        this.ordersRepository = ordersRepository;
        this.tradeRepository = tradeRepository;
        this.userService = userService;
    }

    @Transactional
    public Trades createTrade(Long orderId, OrderController.TradeRequest request, String userId) {
        Orders order = ordersRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        Trades trade = new Trades();
        trade.setTradeDate(LocalDateTime.now());
        trade.setQuantityReceived(request.getQuantityReceived());
        trade.setQuantityGiven(request.getQuantityGiven());
        trade.setTradePrice(request.getTradePrice());
        trade.setTradeType(request.getTradeType());
        trade.setTradeStatus(Trades.TradeStatus.PENDING);
        trade.setPriceType(request.getPriceType());
        trade.setItemExchanged(request.getItemExchanged());
        trade.setOrder(order);

        return tradeRepository.save(trade);
    }

    public List<Trades> getTradesForOrder(Long orderId) {
        return tradeRepository.findByOrderId(orderId);
    }
}