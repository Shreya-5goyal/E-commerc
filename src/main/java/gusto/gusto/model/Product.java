package gusto.gusto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "products")
@ToString
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;
    @NotBlank
    @Size(min=5,message = "length should at least be 50")
    private String description;
    @NotBlank
    @Size(min=5,message = "length should at least be 5")
    private String productName;
    @NotBlank
    private Integer quantity;
    @NotBlank
    private double price;
    @NotBlank
    private String image;
@NotBlank
    private double discount;
    @NotBlank
    private  double specialPrice;

    @ManyToOne
    @JoinColumn(name ="category_id")
  private category category;
    @ManyToOne
    @JoinColumn(name="seller_id")
    private User user;

@OneToMany(mappedBy="product",cascade = {CascadeType.PERSIST,CascadeType.MERGE},fetch =FetchType.EAGER)
    private List<CartItem>products=new ArrayList<>();

}
