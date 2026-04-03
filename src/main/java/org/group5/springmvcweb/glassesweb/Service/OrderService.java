package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.*;
import org.group5.springmvcweb.glassesweb.Entity.*;
import org.group5.springmvcweb.glassesweb.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private ReadyMadeGlassesRepository readyMadeGlassesRepository;
    @Autowired private MyGlassesRepository myGlassesRepository;
    @Autowired private ContactLensRepository contactLensRepository;
    @Autowired private FrameRepository frameRepository;
    @Autowired private LensRepository lensRepository;
    @Autowired private DiscountRepository discountRepository;
    @Autowired private ManufacturingOrderRepository manufacturingOrderRepository;
    @Autowired private ShipmentRepository shipmentRepository;

    // ===== Đặt hàng =====
    @Transactional
    public OrderResponse placeOrder(String username, PlaceOrderRequest request) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found!"));
        Cart cart = cartRepository.findByCustomerId(account.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Cart not found!"));
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getCartId());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty!");

        Double totalAmount = cartItems.stream()
                .mapToDouble(item -> getProductPrice(item.getProductType(), item.getProductId()) * item.getQuantity())
                .sum();

        Double discountAmount = 0.0;
        if (request.getDiscountCode() != null && !request.getDiscountCode().isEmpty()) {
            Discount discount = discountRepository.findByCode(request.getDiscountCode())
                    .orElseThrow(() -> new RuntimeException("Ma giam gia khong ton tai!"));
            if (!"ACTIVE".equals(discount.getStatus())) throw new RuntimeException("Ma giam gia da het hieu luc!");
            LocalDateTime now = LocalDateTime.now();
            if (discount.getStartDate() != null && now.isBefore(discount.getStartDate()))
                throw new RuntimeException("Ma giam gia chua co hieu luc!");
            if (discount.getEndDate() != null && now.isAfter(discount.getEndDate()))
                throw new RuntimeException("Ma giam gia da het han!");
            if (discount.getMinOrderAmount() != null && totalAmount < discount.getMinOrderAmount().doubleValue())
                throw new RuntimeException("Don hang toi thieu " + discount.getMinOrderAmount() + "d de dung ma nay!");
            discountAmount = totalAmount * discount.getDiscountValue().doubleValue() / 100;
        }

        Double finalAmount = totalAmount - discountAmount;
        Order order = new Order();
        order.setCustomerId(account.getCustomerId());
        order.setShippingAddress(request.getShippingAddress());
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setFinalAmount(finalAmount);
        order.setDiscountCode(request.getDiscountCode());
        Order savedOrder = orderRepository.save(order);

        List<CartItem> finalCartItems = cartItems;
        cartItems.forEach(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getOrderId());
            orderItem.setProductType(cartItem.getProductType());
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(getProductPrice(cartItem.getProductType(), cartItem.getProductId()));
            orderItem.setProductSnapshot(getProductName(cartItem.getProductType(), cartItem.getProductId()));
            orderItemRepository.save(orderItem);
        });

        Payment payment = new Payment();
        payment.setOrderId(savedOrder.getOrderId());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaidAmount(finalAmount);
        payment.setPaymentStatus("PENDING");
        paymentRepository.save(payment);
        cartItemRepository.deleteByCartId(cart.getCartId());

        String customerName = customerRepository.findById(account.getCustomerId())
                .map(c -> c.getName()).orElse(null);

        List<CartItemResponse> itemResponses = finalCartItems.stream()
                .map(item -> new CartItemResponse(item.getCartItemId(), item.getProductType(), item.getProductId(),
                        getProductName(item.getProductType(), item.getProductId()), item.getQuantity(),
                        getProductPrice(item.getProductType(), item.getProductId())))
                .collect(Collectors.toList());

        return new OrderResponse(savedOrder.getOrderId(), savedOrder.getStatus(), savedOrder.getShippingAddress(),
                savedOrder.getOrderDate(), savedOrder.getTotalAmount(), savedOrder.getDiscountAmount(),
                savedOrder.getFinalAmount(), savedOrder.getDiscountCode(), request.getPaymentMethod(),
                "PENDING", null, customerName, false, itemResponses);
    }

    // ===== Xem đơn hàng của khách (Customer) =====
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found!"));
        List<Order> orders = orderRepository.findByCustomerId(account.getCustomerId());
        String customerName = customerRepository.findById(account.getCustomerId())
                .map(c -> c.getName()).orElse(null);

        return orders.stream().map(order -> buildOrderResponse(order, customerName)).collect(Collectors.toList());
    }

    // ===== Xem tất cả đơn hàng (Staff/Admin) =====
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    String customerName = customerRepository.findById(order.getCustomerId())
                            .map(c -> c.getName()).orElse("KH #" + order.getCustomerId());
                    return buildOrderResponse(order, customerName);
                })
                .collect(Collectors.toList());
    }

    // ===== Helper: build OrderResponse =====
    private OrderResponse buildOrderResponse(Order order, String customerName) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());
        Payment payment = paymentRepository.findByOrderId(order.getOrderId()).orElse(null);
        String mfgStatus = manufacturingOrderRepository.findByOrderId(order.getOrderId())
                .map(mfg -> mfg.getStatus()).orElse(null);

        List<CartItemResponse> itemResponses = orderItems.stream()
                .map(item -> new CartItemResponse(item.getOrderItemId(), item.getProductType(), item.getProductId(),
                        item.getProductSnapshot() != null ? item.getProductSnapshot() : "Unknown",
                        item.getQuantity(), item.getPrice()))
                .collect(Collectors.toList());

        return new OrderResponse(order.getOrderId(), order.getStatus(), order.getShippingAddress(),
                order.getOrderDate(), order.getTotalAmount(), order.getDiscountAmount(), order.getFinalAmount(),
                order.getDiscountCode(), payment != null ? payment.getPaymentMethod() : null,
                payment != null ? payment.getPaymentStatus() : null, mfgStatus, customerName,
                shipmentRepository.findByOrderId(order.getOrderId()).isPresent(), itemResponses);
    }

    // ===== Huỷ đơn hàng =====
    @Transactional
    public void cancelOrder(String username, Integer orderId) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found!"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        if (!order.getCustomerId().equals(account.getCustomerId()))
            throw new RuntimeException("You are not authorized to do this!");
        if (!"PENDING".equals(order.getStatus()))
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        order.setStatus("CANCELLED");
        orderRepository.save(order);
        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            payment.setPaymentStatus("PAID".equals(payment.getPaymentStatus()) ? "REFUNDED" : "CANCELLED");
            paymentRepository.save(payment);
        });
    }

    // ===== Order Tracking =====
    @Transactional(readOnly = true)
    public OrderTrackingResponse trackOrder(String username, Integer orderId) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found!"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        if (!order.getCustomerId().equals(account.getCustomerId()))
            throw new RuntimeException("You are not authorized to do this!");
        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        List<String> statusFlow = List.of("PENDING", "CONFIRMED", "MANUFACTURING", "SHIPPING", "DELIVERED");
        int currentIndex = statusFlow.indexOf(order.getStatus());
        List<OrderTrackingResponse.TrackingStep> steps = List.of(
                new OrderTrackingResponse.TrackingStep("PENDING", "Cho xac nhan", currentIndex >= 0),
                new OrderTrackingResponse.TrackingStep("CONFIRMED", "Da xac nhan", currentIndex >= 1),
                new OrderTrackingResponse.TrackingStep("MANUFACTURING", "Dang san xuat", currentIndex >= 2),
                new OrderTrackingResponse.TrackingStep("SHIPPING", "Dang giao hang", currentIndex >= 3),
                new OrderTrackingResponse.TrackingStep("DELIVERED", "Da giao hang", currentIndex >= 4));
        return new OrderTrackingResponse(order.getOrderId(), order.getStatus(), order.getShippingAddress(),
                order.getOrderDate(), order.getFinalAmount(), payment != null ? payment.getPaymentStatus() : null, steps);
    }

    // ===== Helper: Lấy giá sản phẩm (hỗ trợ FRAME + LENS) =====
    @Transactional
    public Double getProductPrice(String productType, Integer productId) {
        switch (productType) {
            case "READY_MADE": return readyMadeGlassesRepository.findById(productId)
                    .map(p -> p.getPrice() != null ? p.getPrice().doubleValue() : 0.0).orElse(0.0);
            case "MY_GLASSES": return myGlassesRepository.findById(productId)
                    .map(p -> p.getGlassesDesign() != null && p.getGlassesDesign().getTotalPrice() != null
                            ? p.getGlassesDesign().getTotalPrice().doubleValue() : 0.0).orElse(0.0);
            case "CONTACT_LENS": return contactLensRepository.findById(productId)
                    .map(p -> p.getPrice() != null ? p.getPrice().doubleValue() : 0.0).orElse(0.0);
            case "FRAME": return frameRepository.findById(productId)
                    .map(p -> p.getPrice() != null ? p.getPrice().doubleValue() : 0.0).orElse(0.0);
            case "LENS": return lensRepository.findById(productId)
                    .map(p -> p.getBasePrice() != null ? p.getBasePrice().doubleValue() : 0.0).orElse(0.0);
            default: return 0.0;
        }
    }

    // ===== Helper: Lấy tên sản phẩm =====
    private String getProductName(String productType, Integer productId) {
        switch (productType) {
            case "READY_MADE": return readyMadeGlassesRepository.findById(productId)
                    .map(ReadyMadeGlasses::getName).orElse("Unknown");
            case "MY_GLASSES": return myGlassesRepository.findById(productId)
                    .map(p -> p.getGlassesDesign() != null ? p.getGlassesDesign().getDesignName() : "My Glasses")
                    .orElse("Unknown");
            case "CONTACT_LENS": return contactLensRepository.findById(productId)
                    .map(ContactLens::getName).orElse("Unknown");
            case "FRAME": return frameRepository.findById(productId)
                    .map(Frame::getName).orElse("Unknown");
            case "LENS": return lensRepository.findById(productId)
                    .map(Lens::getName).orElse("Unknown");
            default: return "Unknown";
        }
    }
}