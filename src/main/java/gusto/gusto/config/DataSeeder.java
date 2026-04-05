package gusto.gusto.config;

import gusto.gusto.model.*;
import gusto.gusto.Repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private CategoryRepo categoryRepo;
    @Autowired private ProductRepo productRepo;
    @Autowired private RoleRepo roleRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepo.count() == 0) {
            roleRepo.save(new Role(AppRole.ROLE_USER));
            roleRepo.save(new Role(AppRole.ROLE_ADMIN));
            roleRepo.save(new Role(AppRole.ROLE_SELLER));
        }

        if (userRepo.count() == 0) {
            User admin = new User();
            admin.setUserName("admin");
            admin.setEmail("admin@gusto.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            Role adminRole = roleRepo.findByRoleName(AppRole.ROLE_ADMIN).orElse(null);
            if (adminRole != null) admin.getRoles().add(adminRole);
            userRepo.save(admin);
        }

        // --- PRODUCTION CATALOG (SYNCED TO FINAL SCHEMA) ---
        seedCategory("Electronics", Arrays.asList(
            new P("iPhone 15 Pro", "Apple", "Ultimate performance.", 134900, 5, 12, "https://images.unsplash.com/photo-1695048133142-1a20484d251e"),
            new P("Sony WH-1000XM5", "Sony", "Hear only the music.", 29990, 15, 60, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e")
        ));

        seedCategory("Fashion", Arrays.asList(
            new P("Air Jordan 1 Low", "Nike", "Iconic style.", 8995, 0, 150, "https://images.unsplash.com/photo-1542291026-7eec264c27ff"),
            new P("Levi's 501 Jeans", "Levi's", "The original icon.", 6599, 20, 300, "https://images.unsplash.com/photo-1542272604-12cd17424036")
        ));
    }

    private void seedCategory(String catName, List<P> prodData) {
        category cat = categoryRepo.findByCategoryName(catName).orElseGet(() -> {
            category c = new category(); c.setCategoryName(catName); return categoryRepo.save(c);
        });

        for (P data : prodData) {
            if (productRepo.findAll().stream().noneMatch(p -> p.getProductName().equals(data.name))) {
                Product p = new Product();
                p.setProductName(data.name); p.setBrand(data.brand); p.setDescription(data.desc);
                p.setPrice(data.price); p.setDiscount(data.discount);
                p.setQuantity(data.qty); p.setCategory(cat);
                p.setImageUrl(data.img);
                p.setSpecialPrice(data.price - ((data.discount/100.0)*data.price));
                productRepo.save(p);
            }
        }
    }

    private static class P {
        String name, brand, desc, img;
        double price, discount;
        int qty;
        P(String n, String b, String d, double p, double di, int q, String i) {
            name=n; brand=b; desc=d; price=p; discount=di; qty=q; img=i;
        }
    }
}
