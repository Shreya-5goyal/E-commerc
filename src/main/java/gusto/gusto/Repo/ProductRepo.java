package gusto.gusto.Repo;

import gusto.gusto.model.Product;
import gusto.gusto.model.category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {

   Page<Product> findByCategoryOrderByPriceAsc(category category, Pageable pageDetails);

   Page<Product> findByProductNameLikeIgnoreCase(String keyword, Pageable pageDetails);
}
