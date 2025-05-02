package gusto.gusto.Service;

import gusto.gusto.payload.ProductDTO;
import gusto.gusto.payload.ProductResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface ProductService {

    ProductDTO add(ProductDTO product, Long categoryId);

    ProductResponse getAllProduct(Integer pageNumber, Integer pageSize, String sortBy, String sortProduct);

    ProductResponse getccByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortProduct);

    ProductResponse getByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortProduct);

    ProductDTO updateProduct(Long productId, ProductDTO product);

    ProductDTO deleteById(Long productId);

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;
}
