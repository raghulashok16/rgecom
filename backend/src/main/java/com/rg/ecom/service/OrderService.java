package com.rg.ecom.service;

import com.rg.ecom.dto.order.*;
import com.rg.ecom.entity.auth.User;
import com.rg.ecom.entity.order.Order;
import com.rg.ecom.entity.order.OrderItem;
import com.rg.ecom.entity.order.OrderStatus;
import com.rg.ecom.entity.product.Product;
import com.rg.ecom.exception.ResourceNotFoundException;
import com.rg.ecom.entity.inventory.Inventory;
import com.rg.ecom.entity.order.MovementType;
import com.rg.ecom.entity.order.StockMovement;
import com.rg.ecom.repository.InventoryRepository;
import com.rg.ecom.repository.OrderItemRepository;
import com.rg.ecom.repository.OrderRepository;
import com.rg.ecom.repository.ProductRepository;
import com.rg.ecom.repository.StockMovementRepository;
import com.rg.ecom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final int FIRST_ITEM_NAME_MAX = 30;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        LocalDateTime now = LocalDateTime.now();

        Order order = Order.builder()
                .user(user)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .status(OrderStatus.ORDERED)
                .totalAmount(BigDecimal.ZERO)
                .orderedAt(now)
                .build();

        Order savedOrder = orderRepository.save(order);
        savedOrder.setOrderNumber(generateOrderNumber(savedOrder.getId(), now));

        // Stock check — validate all items before creating any
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));
            long available = inventoryRepository.findByProduct_Id(itemReq.getProductId())
                    .map(inv -> inv.getQuantity())
                    .orElse(0L);
            if (available < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Out of stock: " + product.getName());
            }
        }

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));
            return OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(items);

        // Deduct inventory and record stock movements
        for (OrderItem item : items) {
            Inventory inventory = inventoryRepository.findByProduct_Id(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + item.getProduct().getName()));
            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventoryRepository.save(inventory);

            stockMovementRepository.save(StockMovement.builder()
                    .productId(item.getProduct().getId())
                    .movementType(MovementType.OUT)
                    .quantity(item.getQuantity())
                    .referenceType("ORDER")
                    .referenceId(savedOrder.getId())
                    .build());
        }

        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        savedOrder.setTotalAmount(total);
        savedOrder.setItems(items);
        orderRepository.save(savedOrder);

        return mapToOrderResponse(savedOrder, items);
    }

    public List<OrderSummaryResponse> getOrdersByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return orderRepository.findByUser_Id(user.getId()).stream()
                .map(order -> mapToSummaryResponse(order, order.getItems()))
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToOrderResponse(order, order.getItems());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        LocalDateTime now = LocalDateTime.now();
        order.setStatus(request.getStatus());

        switch (request.getStatus()) {
            case PAYMENT -> order.setPaymentAt(now);
            case CONFIRMED -> {
                if (order.getPaymentAt() == null) order.setPaymentAt(now);
                order.setConfirmationAt(now);
            }
            case DELIVERED -> {
                if (order.getPaymentAt() == null)      order.setPaymentAt(now);
                if (order.getConfirmationAt() == null) order.setConfirmationAt(now);
                order.setDeliveryAt(now);
            }
            case CANCELLED -> {
                order.setOrderedAt(null);
                order.setPaymentAt(null);
                order.setConfirmationAt(null);
                order.setDeliveryAt(null);
                order.setCancelledAt(now);
                restoreStock(order);
            }
            default -> {}
        }

        orderRepository.save(order);
        return mapToOrderResponse(order, order.getItems());
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setStatus(OrderStatus.CANCELLED);
        order.setOrderedAt(null);
        order.setPaymentAt(null);
        order.setConfirmationAt(null);
        order.setDeliveryAt(null);
        order.setCancelledAt(LocalDateTime.now());

        restoreStock(order);

        orderRepository.save(order);
        return mapToOrderResponse(order, order.getItems());
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            inventoryRepository.findByProduct_Id(item.getProduct().getId()).ifPresent(inventory -> {
                inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
                inventoryRepository.save(inventory);
            });

            stockMovementRepository.save(StockMovement.builder()
                    .productId(item.getProduct().getId())
                    .movementType(MovementType.IN)
                    .quantity(item.getQuantity())
                    .referenceType("ORDER_CANCEL")
                    .referenceId(order.getId())
                    .build());
        }
    }

    public Page<OrderSummaryResponse> getAllOrders(OrderStatus status, String date, Integer month, Integer year, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orders;

        if (date != null && !date.isEmpty()) {
            LocalDateTime start = LocalDate.parse(date).atStartOfDay();
            LocalDateTime end = start.plusDays(1);
            orders = status != null
                    ? orderRepository.findByStatusAndOrderedAtBetween(status, start, end, pageable)
                    : orderRepository.findByOrderedAtBetween(start, end, pageable);
        } else if (month != null && year != null) {
            LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
            LocalDateTime end = start.plusMonths(1);
            orders = status != null
                    ? orderRepository.findByStatusAndOrderedAtBetween(status, start, end, pageable)
                    : orderRepository.findByOrderedAtBetween(start, end, pageable);
        } else {
            orders = status != null
                    ? orderRepository.findByStatus(status, pageable)
                    : orderRepository.findAll(pageable);
        }
        return orders.map(order -> mapToSummaryResponse(order, order.getItems()));
    }

    private String generateOrderNumber(Long id, LocalDateTime date) {
        return String.format("ORD-%s-%04d", date.format(DateTimeFormatter.ofPattern("yyyyMMdd")), id);
    }

    private String formatDate(LocalDateTime dt) {
        return dt != null ? dt.format(DATE_FORMATTER) : null;
    }

    private OrderTimeline buildTimeline(Order order) {
        return OrderTimeline.builder()
                .orderedAt(formatDate(order.getOrderedAt()))
                .paymentAt(formatDate(order.getPaymentAt()))
                .confirmationAt(formatDate(order.getConfirmationAt()))
                .deliveryAt(formatDate(order.getDeliveryAt()))
                .cancelledAt(formatDate(order.getCancelledAt()))
                .build();
    }

    private OrderItemResponse mapToItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }

    private OrderResponse mapToOrderResponse(Order order, List<OrderItem> items) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items.stream().map(this::mapToItemResponse).collect(Collectors.toList()))
                .timeline(buildTimeline(order))
                .build();
    }

    private OrderSummaryResponse mapToSummaryResponse(Order order, List<OrderItem> items) {
        String firstItemName = null;
        int extraItemsCount = 0;
        if (items != null && !items.isEmpty()) {
            String name = items.get(0).getProduct().getName();
            firstItemName = name.length() > FIRST_ITEM_NAME_MAX
                    ? name.substring(0, FIRST_ITEM_NAME_MAX) + "..."
                    : name;
            extraItemsCount = items.size() - 1;
        }
        return OrderSummaryResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .username(order.getUser() != null ? order.getUser().getUsername() : null)
                .firstItemName(firstItemName)
                .extraItemsCount(extraItemsCount)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .orderedAt(formatDate(order.getOrderedAt()))
                .timeline(buildTimeline(order))
                .build();
    }
}
