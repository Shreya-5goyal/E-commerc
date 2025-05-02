package gusto.gusto.Repo;

import gusto.gusto.model.Product;
import gusto.gusto.model.category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {

   List<Product> findByCategoryOrderByPriceAsc(category Category);
   

   List<Product> findByProductNameLikeIgnoreCase(String keyword);
}
