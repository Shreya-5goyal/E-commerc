package gusto.gusto.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class ReviewDTO {
    public ReviewDTO() {}

    public ReviewDTO(Long reviewId, Integer rating, String comment, LocalDate reviewDate, String username) {
        this.reviewId = reviewId;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.username = username;
    }

    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    private Long reviewId;
    private Integer rating;
    private String comment;
    private LocalDate reviewDate;
    private String username;
}
