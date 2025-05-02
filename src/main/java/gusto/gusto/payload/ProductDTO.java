package gusto.gusto.payload;

import gusto.gusto.model.category;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String description;
    private String productName;
    private Integer quantity;
    private String image;
    private double price;
    private double discount;
    private  double specialPrice;
    private category Category;
}
