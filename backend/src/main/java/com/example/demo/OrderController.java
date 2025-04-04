package com.example.demo;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/swapsaviour/Checkout/orders")
public class OrderController {

    private final OrdersRepository orderRepository;
    private final TradeService tradeService;

    @Autowired
    public OrderController(OrdersRepository orderRepository, TradeService tradeService) {
        this.orderRepository = orderRepository;
        this.tradeService = tradeService;
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<List<Orders>> getAllOrders() {
        List<Orders> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    // Get orders by user ID 
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Orders>> getOrdersByUser(@PathVariable Long userId) {
        List<Orders> orders = orderRepository.findByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // Get orders by status with optional user filter
    @GetMapping("/status")
    public ResponseEntity<List<Orders>> getOrdersByStatus(
            @RequestParam String status,
            @RequestParam(required = false) Long userId) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            List<Orders> orders = userId != null 
                ? orderRepository.findByUserIdAndOrderStatus(userId, orderStatus)
                : orderRepository.findByOrderStatus(orderStatus);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }

    // Create new order with automatic trade creation
    @PostMapping
    public ResponseEntity<OrderTradeResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        // Create and save order func
        Orders newOrder = new Orders(
            orderRequest.getShop(),
            LocalDateTime.now(),
            OrderStatus.PENDING,
            orderRequest.getPrice(),
            orderRequest.getItem(),
            orderRequest.getQuantity(),
            orderRequest.getUserId()
        );
        Orders savedOrder = orderRepository.save(newOrder);

        // Create  trade record
        TradeRequest tradeRequest = new TradeRequest();
        tradeRequest.setQuantity(savedOrder.getQuantity());
        tradeRequest.setPrice(savedOrder.getPrice());
        tradeRequest.setTradeType(Trades.TradeType.BUY);
        tradeRequest.setPriceType(Trades.PriceType.TOTAL);
        tradeRequest.setItemExchanged(savedOrder.getItem());

        Trades createdTrade = tradeService.createTrade(
            savedOrder.getId(), 
            tradeRequest, 
            savedOrder.getUserId().toString()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new OrderTradeResponse(savedOrder, createdTrade));
    }

    // Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<Orders> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatus status) {
        Orders order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setOrderStatus(status);
        Orders updatedOrder = orderRepository.save(order);
        return ResponseEntity.ok(updatedOrder);
    }

    // Get trades for specific order
    @GetMapping("/{orderId}/trades")
    public ResponseEntity<List<Trades>> getOrderTrades(@PathVariable Long orderId) {
        List<Trades> trades = tradeService.getTradesForOrder(orderId);
        return ResponseEntity.ok(trades);
    }

   
    static class OrderRequest {
        private String shop;
        private Double price;
        private String item;
        private Integer quantity;
        private Long userId;

     
        
        public String getShop() { return shop; }
        public void setShop(String shop) { this.shop = shop; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getItem() { return item; }
        public void setItem(String item) { this.item = item; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

    static class OrderTradeResponse {
        private final Orders order;
        private final Trades trade;

        public OrderTradeResponse(Orders order, Trades trade) {
            this.order = order;
            this.trade = trade;
        }

        public Orders getOrder() { return order; }
        public Trades getTrade() { return trade; }
    }

    // Exception Handling 
    @ExceptionHandler({ResourceNotFoundException.class, IllegalArgumentException.class})
    public ResponseEntity<String> handleExceptions(RuntimeException ex) {
        HttpStatus status = ex instanceof ResourceNotFoundException 
            ? HttpStatus.NOT_FOUND 
            : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(ex.getMessage());
    }
}

class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}