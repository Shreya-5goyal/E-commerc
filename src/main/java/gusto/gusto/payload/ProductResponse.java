package gusto.gusto.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private List<ProductDTO> content;
    private Integer pageNumber;
    private Integer pageSize;
    @Getter
    private Long totalElement;
    private Integer totalPages;
    private boolean lastPage;


    public void setTotalElements(long totalElements) {
    }
}
