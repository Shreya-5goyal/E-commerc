package gusto.gusto.payload;

import gusto.gusto.model.category;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class ProductDTO {
    public ProductDTO() {}
    public ProductDTO(Long productId, String description, String productName, Integer quantity, String image, double price, double discount, double specialPrice, CategoryDTO category) {
        this.productId = productId;
        this.description = description;
        this.productName = productName;
        this.quantity = quantity;
        this.image = image;
        this.price = price;
        this.discount = discount;
        this.specialPrice = specialPrice;
        this.category = category;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public double getSpecialPrice() { return specialPrice; }
    public void setSpecialPrice(double specialPrice) { this.specialPrice = specialPrice; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    private Long productId;
    private String description;
    private String productName;
    private Integer quantity;
    private String image;
    private double price;
    private double discount;
    private double specialPrice;
    private CategoryDTO category;
}
