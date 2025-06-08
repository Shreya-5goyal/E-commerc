package gusto.gusto.Repo;

import gusto.gusto.model.Cart;
import gusto.gusto.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {


        @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = ?1 AND ci.product.id = ?2")
        CartItem findCartItemByProductIdAndCartId(Long cartId, Long productId);
    @Query("SELECT c FROM Cart c WHERE c.user.email = ?1 AND c.id = ?2")
    void deleteCartItemByProductIdAndCartId(Long cartId, Long productId);
}

