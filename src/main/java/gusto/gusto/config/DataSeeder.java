package gusto.gusto.config;

import gusto.gusto.Repo.*;
import gusto.gusto.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        // Ensure users have carts
        ensureUserCarts();

        if (categoryRepo.count() == 0 || productRepo.count() == 0) {
            seedBigData(10000);
        }
    }

    private void ensureUserCarts() {
        userRepo.findAll().forEach(user -> {
            Cart cart = cartRepository.findCartByEmail(user.getEmail());
            if (cart == null) {
                Cart newCart = new Cart();
                newCart.setUser(user);
                newCart.setTotalPrice(0.0);
                cartRepository.save(newCart);
                System.out.println("Created cart for user: " + user.getUserName());
            }
        });
    }

    @Transactional
    public void seedBigData(int totalProducts) {
        System.out.println("Starting to seed " + totalProducts + " products...");

        User seller = userRepo.findByUserName("seller1").orElse(null);
        if (seller == null) seller = userRepo.findByUserName("admin").orElse(null);
        
        User consumer = userRepo.findByUserName("user1").orElse(null);

        // Define Categories
        String[] categoryNames = {
            "Electronics", "Fashion", "Home & Kitchen", "Books & Stationery", 
            "Health & Beauty", "Sports & Outdoors", "Toys & Games", "Automotive", 
            "Grocery", "Office Supplies"
        };
        
        List<category> categories = new ArrayList<>();
        for (String name : categoryNames) {
            category cat = new category();
            cat.setCategoryName(name);
            categories.add(categoryRepo.save(cat));
        }

        // Templates for product generation
        String[] adjectives = {"Premium", "Ultra", "Dynamic", "Classic", "Smart", "Eco-friendly", "Modern", "Professional", "Wireless", "Portable"};
        
        String[][] categoryProducts = {
            {"Smartphone", "Laptop", "Headphones", "Smartwatch", "Tablet", "Camera", "Speaker", "Monitor"}, // Electronics
            {"T-Shirt", "Jeans", "Jacket", "Sneakers", "Dress", "Handbag", "Sunglass", "Watch"}, // Fashion
            {"Coffee Maker", "Blender", "Toaster", "Air Purifier", "Vacuum Cleaner", "Cookware Set", "Lamp", "Bedding"}, // Home
            {"Novel", "Notebook", "Pen Set", "Planner", "Textbook", "Art Kit", "Dictionary", "Bookmark"}, // Books
            {"Serum", "Shampoo", "Face Cream", "Makeup Kit", "Perfume", "Hair Dryer", "Toothbrush", "Vitamin C"}, // Health
            {"Yoga Mat", "Dumbbells", "Bicycle", "Tent", "Football", "Running Shoes", "Treadmill", "Water Bottle"}, // Sports
            {"Puzzle", "Action Figure", "Board Game", "Dollhouse", "RC Car", "Lego Set", "Plush Toy", "Cards"}, // Toys
            {"Car Wax", "Air Freshener", "Tire Inflator", "Dash Cam", "Oil Filter", "Wiper Blades", "Seat Cover", "Jumper Cables"}, // Automotive
            {"Organic Tea", "Pasta", "Chocolate", "Coffee Beans", "Olive Oil", "Honey", "Snack Bar", "Cereal"}, // Grocery
            {"Chair", "Desk", "File Organizer", "Printer", "Whiteboard", "Calculator", "Tape Dispenser", "Stapler"} // Office
        };

        String[] brands = {"Gusto", "Apex", "Nova", "Zenith", "Quantum", "Peak", "Vibe", "Core", "Flux", "Titan"};

        List<Product> batch = new ArrayList<>();
        int batchSize = 100;

        for (int i = 0; i < totalProducts; i++) {
            int catIdx = random.nextInt(categories.size());
            category cat = categories.get(catIdx);
            
            String subType = categoryProducts[catIdx][random.nextInt(categoryProducts[catIdx].length)];
            String brand = brands[random.nextInt(brands.length)];
            String adj = adjectives[random.nextInt(adjectives.length)];
            
            String name = brand + " " + adj + " " + subType + " " + (i + 1);
            String description = adj + " " + subType + " designed for high quality and " + brand + " performance. Perfect for daily use.";
            double price = 10 + (2000 - 10) * random.nextDouble();
            double discount = random.nextInt(30);
            int quantity = 10 + random.nextInt(500);
            
            // Random Unsplash image relative to category
            String imageUrl = getRealisticImage(cat.getCategoryName());

            Product p = createProduct(name, description, price, discount, quantity, imageUrl, cat, seller);
            batch.add(p);

            if (batch.size() >= batchSize) {
                productRepo.saveAll(batch);
                batch.clear();
                if ((i + 1) % 1000 == 0) {
                    System.out.println("Seeded " + (i + 1) + " products...");
                }
            }
        }
        
        if (!batch.isEmpty()) {
            productRepo.saveAll(batch);
        }

        System.out.println("Finished seeding " + totalProducts + " products!");
    }

    private String getRealisticImage(String category) {
        switch (category) {
            case "Electronics": return "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800";
            case "Fashion": return "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=800";
            case "Home & Kitchen": return "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800";
            case "Books & Stationery": return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800";
            case "Health & Beauty": return "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800";
            case "Sports & Outdoors": return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800";
            case "Toys & Games": return "https://images.unsplash.com/photo-1531323380765-a1195db3f28d?q=80&w=800";
            case "Automotive": return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800";
            case "Grocery": return "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800";
            case "Office Supplies": return "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800";
            default: return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800";
        }
    }

    private Product createProduct(String name, String description, double price, double discount, Integer quantity, String imageUrl, category category, User seller) {
        Product product = new Product();
        product.setProductName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setDiscount(discount);
        product.setSpecialPrice(price - (price * discount / 100.0));
        product.setQuantity(quantity);
        product.setImage(imageUrl);
        product.setCategory(category);
        product.setUser(seller);
        return product;
    }

    private void createReview(Product product, User user, Integer rating, String comment, LocalDate date) {
        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);
        review.setReviewDate(date);
        reviewRepository.save(review);
    }
}
