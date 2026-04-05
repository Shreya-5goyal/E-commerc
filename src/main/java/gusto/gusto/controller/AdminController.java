package gusto.gusto.controller;

import gusto.gusto.Repo.*;
import gusto.gusto.model.Order;
import gusto.gusto.model.User;
import gusto.gusto.payload.OrderDTO;
import gusto.gusto.payload.ProductDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * GET /api/admin/stats
     * Returns high-level analytics: total revenue, orders, users, products.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalOrders = orderRepository.count();
        long totalUsers = userRepo.count();
        long totalProducts = productRepo.count();
        long totalReviews = reviewRepository.count();

        List<Order> allOrders = orderRepository.findAll();
        double totalRevenue = allOrders.stream()
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();

        // Order status breakdown
        Map<String, Long> orderStatusCount = allOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getOrderStatus() != null ? o.getOrderStatus() : "Unknown",
                        Collectors.counting()
                ));

        // Recent 10 orders
        List<Map<String, Object>> recentOrders = allOrders.stream()
                .sorted((a, b) -> {
                    if (a.getOrderDate() == null) return 1;
                    if (b.getOrderDate() == null) return -1;
                    return b.getOrderDate().compareTo(a.getOrderDate());
                })
                .limit(10)
                .map(o -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("orderId", o.getOrderId());
                    m.put("email", o.getEmail());
                    m.put("totalAmount", o.getTotalAmount());
                    m.put("orderStatus", o.getOrderStatus());
                    m.put("orderDate", o.getOrderDate() != null ? o.getOrderDate().toString() : null);
                    m.put("itemCount", o.getOrderItems() != null ? o.getOrderItems().size() : 0);
                    return m;
                })
                .collect(Collectors.toList());

        // Low stock products (quantity < 10)
        List<Map<String, Object>> lowStockProducts = productRepo.findAll().stream()
                .filter(p -> p.getQuantity() != null && p.getQuantity() < 10)
                .limit(10)
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("productId", p.getProductId());
                    m.put("productName", p.getProductName());
                    m.put("quantity", p.getQuantity());
                    m.put("price", p.getPrice());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalReviews", totalReviews);
        stats.put("orderStatusBreakdown", orderStatusCount);
        stats.put("recentOrders", recentOrders);
        stats.put("lowStockProducts", lowStockProducts);

        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/admin/orders
     * Returns all orders with full detail.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderRepository.findAll().stream()
                .sorted((a, b) -> {
                    if (a.getOrderDate() == null) return 1;
                    if (b.getOrderDate() == null) return -1;
                    return b.getOrderDate().compareTo(a.getOrderDate());
                })
                .map(o -> modelMapper.map(o, OrderDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    /**
     * PUT /api/admin/orders/{orderId}/status
     * Update order status. Body: { "status": "SHIPPED" }
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        order.setOrderStatus(newStatus);
        orderRepository.save(order);

        Map<String, Object> res = new HashMap<>();
        res.put("orderId", order.getOrderId());
        res.put("orderStatus", order.getOrderStatus());
        res.put("message", "Order status updated successfully");
        return ResponseEntity.ok(res);
    }

    /**
     * GET /api/admin/users
     * Returns all registered users (without password).
     */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userRepo.findAll().stream()
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("userId", u.getUserId());
                    m.put("userName", u.getUserName());
                    m.put("email", u.getEmail());
                    m.put("roles", u.getRoles().stream()
                            .map(r -> r.getRoleName().name())
                            .collect(Collectors.toList()));
                    return m;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     * DELETE /api/admin/users/{userId}
     * Delete a user account.
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        if (!userRepo.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
        userRepo.deleteById(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
