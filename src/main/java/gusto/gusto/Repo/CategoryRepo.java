package gusto.gusto.Repo;
import gusto.gusto.model.category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryRepo extends JpaRepository<category,Long> {


    java.util.Optional<category> findByCategoryName(@NotBlank @Size(min=2,message = "length should at least be 2") String categoryName);
}
