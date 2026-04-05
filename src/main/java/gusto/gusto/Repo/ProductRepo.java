package gusto.gusto.Repo;

import gusto.gusto.model.Product;
import gusto.gusto.model.category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {

    Page<Product> findByCategoryOrderByPriceAsc(category category, Pageable pageDetails);

    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.category.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(p.specialPrice >= :minPrice AND p.specialPrice <= :maxPrice)")
    Page<Product> findFilteredProducts(String keyword, Double minPrice, Double maxPrice, Pageable pageDetails);

    Page<Product> findByDiscountGreaterThan(double discount, Pageable pageable);

    Page<Product> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);
}
