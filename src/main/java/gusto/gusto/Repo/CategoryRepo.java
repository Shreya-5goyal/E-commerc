package gusto.gusto.Repo;
import gusto.gusto.model.category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryRepo extends JpaRepository<category,Long> {


    category findByCategoryName(@NotBlank @Size(min=5,message = "length should at least be 5") String categoryName);
}
