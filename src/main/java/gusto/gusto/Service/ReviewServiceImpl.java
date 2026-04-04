package gusto.gusto.Service;

import gusto.gusto.Repo.ProductRepo;
import gusto.gusto.Repo.ReviewRepository;
import gusto.gusto.exception.APIException;
import gusto.gusto.exception.ResourseNotFoundException;
import gusto.gusto.model.Product;
import gusto.gusto.model.Review;
import gusto.gusto.model.User;
import gusto.gusto.payload.ReviewDTO;
import gusto.gusto.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private AuthUtil authUtil;

    @Override
    public ReviewDTO addReview(Long productId, ReviewDTO reviewDTO) {
        User user = authUtil.loggedInUser();
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourseNotFoundException("Product", "productId", productId));

        if (reviewRepository.existsByUserUserIdAndProductProductId(user.getUserId(), productId)) {
            throw new APIException("You have already reviewed this product.");
        }

        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setReviewDate(LocalDate.now());
        review.setUser(user);
        review.setProduct(product);

        Review saved = reviewRepository.save(review);
        return toDTO(saved);
    }

    @Override
    public List<ReviewDTO> getProductReviews(Long productId) {
        return reviewRepository.findByProductProductId(productId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourseNotFoundException("Review", "reviewId", reviewId));
        reviewRepository.delete(review);
    }

    private ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewDate(review.getReviewDate());
        dto.setUsername(review.getUser().getUserName());
        return dto;
    }
}
