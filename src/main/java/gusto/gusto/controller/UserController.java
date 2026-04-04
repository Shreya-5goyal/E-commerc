package gusto.gusto.controller;

import gusto.gusto.Repo.OrderRepository;
import gusto.gusto.Repo.ProductRepo;
import gusto.gusto.Repo.UserRepo;
import gusto.gusto.exception.ResourseNotFoundException;
import gusto.gusto.model.Product;
import gusto.gusto.model.User;
import gusto.gusto.payload.OrderDTO;
import gusto.gusto.payload.ProductDTO;
import gusto.gusto.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ModelMapper modelMapper;

    // ── Wishlist ──────────────────────────────────────────────────────────

    @org.springframework.transaction.annotation.Transactional
    @GetMapping("/users/wishlist")
    public ResponseEntity<List<ProductDTO>> getWishlist() {
        User user = authUtil.loggedInUser();
        List<ProductDTO> wishlist = user.getWishlist()
                .stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(wishlist);
    }

    @org.springframework.transaction.annotation.Transactional
    @PostMapping("/users/wishlist/{productId}")
    public ResponseEntity<String> addToWishlist(@PathVariable Long productId) {
        User user = authUtil.loggedInUser();
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourseNotFoundException("Product", "productId", productId));

        boolean alreadyExists = user.getWishlist().stream()
                .anyMatch(p -> p.getProductId().equals(productId));
        if (!alreadyExists) {
            user.getWishlist().add(product);
            userRepo.save(user);
        }
        return ResponseEntity.ok("Added to wishlist");
    }

    @org.springframework.transaction.annotation.Transactional
    @DeleteMapping("/users/wishlist/{productId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long productId) {
        User user = authUtil.loggedInUser();
        user.getWishlist().removeIf(p -> p.getProductId().equals(productId));
        userRepo.save(user);
        return ResponseEntity.ok("Removed from wishlist");
    }

    // ── Orders ────────────────────────────────────────────────────────────

    @org.springframework.transaction.annotation.Transactional
    @GetMapping("/users/orders")
    public ResponseEntity<List<OrderDTO>> getUserOrders() {
        String email = authUtil.loggedInEmail();
        List<OrderDTO> orders = orderRepository.findByEmailOrderByOrderDateDesc(email)
                .stream()
                .map(o -> modelMapper.map(o, OrderDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }
}
