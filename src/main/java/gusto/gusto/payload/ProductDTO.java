package gusto.gusto.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long productId;
    private String productName;
    private String brand;
    private String description;
    private String imageUrl;
    private List<String> gallery;
    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;
    private CategoryDTO category;

    // COMPATIBILITY SHIMS
    public String getImage() { return imageUrl; }
    public void setImage(String image) { this.imageUrl = image; }
}
