package gusto.gusto.payload;

import jakarta.persistence.Access;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@Data
@AllArgsConstructor
public class CategoryDTO {

    private Long  categoryId;
    private String categoryName;

}
