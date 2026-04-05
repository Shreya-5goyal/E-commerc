package gusto.gusto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @NotBlank
    @Size(min = 3, message = "Product name must contain at least 3 characters")
    @Column(name = "product_name")
    private String productName;

    @Column(name = "brand")
    private String brand;

    @Column(name = "description")
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private double price;

    @Column(name = "discount")
    private double discount;

    @Column(name = "special_price")
    private double specialPrice;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private category category;

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public gusto.gusto.model.category getCategory() {
        return category;
    }

    public void setCategory(gusto.gusto.model.category category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public List<ProductImage> getGallery() {
        return gallery;
    }

    public void setGallery(List<ProductImage> gallery) {
        this.gallery = gallery;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public @NotBlank @Size(min = 3, message = "Product name must contain at least 3 characters") String getProductName() {
        return productName;
    }

    public void setProductName(@NotBlank @Size(min = 3, message = "Product name must contain at least 3 characters") String productName) {
        this.productName = productName;
    }

    public List<CartItem> getProducts() {
        return products;
    }

    public void setProducts(List<CartItem> products) {
        this.products = products;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public void setSpecialPrice(double specialPrice) {
        this.specialPrice = specialPrice;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne
    @JoinColumn(name="seller_id")
    private User user;

    @OneToMany(mappedBy="product", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<CartItem> products = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> gallery = new ArrayList<>();
    public Integer getQuantity() {
        return quantity;
    }

    public double getDiscount() {
        return discount;
    }

    public double getSpecialPrice() {
        return specialPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getBrand() {
        return brand;
    }
    // COMPATIBILITY SHIMS
    public String getImage() { return imageUrl; }
    public void setImage(String image) { this.imageUrl = image; }
}
