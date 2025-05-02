package gusto.gusto.Service;

import gusto.gusto.payload.CategoryDTO;
import gusto.gusto.payload.DTOResponse;

public interface CategoryService {

   DTOResponse getCategories(int pageNumber, int pageSize, String sortOrder, String sortBy);
    public CategoryDTO createCategory(CategoryDTO categoryDTO);
    public CategoryDTO deleteCategoryById(Long id);

    public CategoryDTO update(CategoryDTO categoryDTO, Long id);
}
