package gusto.gusto.payload;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
public class CartItemDTO {
    public CartItemDTO() {}
    public CartItemDTO(Long cartItemId, CartDTO cart, ProductDTO productDTO, Integer quantity, Double Discount, Double productPrice) {
        this.cartItemId = cartItemId;
        this.cart = cart;
        this.productDTO = productDTO;
        this.quantity = quantity;
        this.Discount = Discount;
        this.productPrice = productPrice;
    }

    public Long getCartItemId() { return cartItemId; }
    public void setCartItemId(Long cartItemId) { this.cartItemId = cartItemId; }

    public CartDTO getCart() { return cart; }
    public void setCart(CartDTO cart) { this.cart = cart; }

    public ProductDTO getProductDTO() { return productDTO; }
    public void setProductDTO(ProductDTO productDTO) { this.productDTO = productDTO; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getDiscount() { return Discount; }
    public void setDiscount(Double Discount) { this.Discount = Discount; }

    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }
    private Long cartItemId;
    private CartDTO cart;
    private ProductDTO productDTO;
    private Integer quantity;
    private Double Discount;
    private Double productPrice;

}
