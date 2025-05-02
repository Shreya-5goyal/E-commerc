package gusto.gusto.model;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="categories")
public class category {
    @Id
  Long  categoryId;
    @NotBlank
    @Size(min=5,message = "length should at least be 5")
     String categoryName;
    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
   private List<Product> productList;

}
