package gusto.gusto.Service;

import gusto.gusto.payload.ReviewDTO;
import java.util.List;

public interface ReviewService {
    ReviewDTO addReview(Long productId, ReviewDTO reviewDTO);
    List<ReviewDTO> getProductReviews(Long productId);
    void deleteReview(Long reviewId);
}
