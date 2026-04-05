package gusto.gusto.Service;
import gusto.gusto.Repo.CategoryRepo;
import gusto.gusto.exception.APIException;
import gusto.gusto.exception.ResourseNotFoundException;
import gusto.gusto.model.category;
import gusto.gusto.payload.CategoryDTO;
import gusto.gusto.payload.DTOResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService{
    @Autowired
    CategoryRepo categoryRepo;
    @Autowired
    private ModelMapper modelMapper;

    public DTOResponse getCategories(int pageNumber, int pageSize, String sortOrder, String sortBy) {
        Sort sortByOrder=sortOrder.equalsIgnoreCase("asc")?Sort.by(sortBy).ascending():Sort.by(sortBy).descending();
        Pageable pageDetails= PageRequest.of(pageNumber,pageSize,sortByOrder);
        Page<category> categoryPage=categoryRepo.findAll(pageDetails);
        List<category> categories=categoryPage.getContent();
        if(categories.isEmpty())
            return new DTOResponse();
        List<CategoryDTO> categoryDTOS=categories.stream().map(category -> modelMapper.map(category,CategoryDTO.class)).toList();
        DTOResponse dtoResponse=new DTOResponse();
        dtoResponse.setContent(categoryDTOS);
        dtoResponse.setPageNumber(categoryPage.getNumber());
        dtoResponse.setPageSize(categoryPage.getSize());
        dtoResponse.setTotalElement(categoryPage.getTotalElements());
        dtoResponse.setTotalPages(categoryPage.getTotalPages());
        dtoResponse.setLastPage(categoryPage.isLast());
        return dtoResponse;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        category Category = modelMapper.map(categoryDTO, category.class);
        
        java.util.Optional<category> savedCategory = categoryRepo.findByCategoryName(Category.getCategoryName());
        if(savedCategory.isPresent())
            throw new APIException("Category with same name is already present.");

        category Cat = categoryRepo.save(Category);
        return modelMapper.map(Cat, CategoryDTO.class);
    }

    @Override
    public CategoryDTO deleteCategoryById(Long id) {
        category categories=categoryRepo.findById(id).orElseThrow(()-> new ResourseNotFoundException("category","categoryId",id));
        categoryRepo.deleteById(id);
        return modelMapper.map(categories,CategoryDTO.class);
    }

    public CategoryDTO update(CategoryDTO categoryDTO, Long id) {
        category categories = categoryRepo.findById(id).orElseThrow(()-> new ResourseNotFoundException("category","categoryId",id));
        
        java.util.Optional<category> existingCategory = categoryRepo.findByCategoryName(categoryDTO.getCategoryName());
        if(existingCategory.isPresent() && !existingCategory.get().getCategoryId().equals(id))
            throw new APIException("Category with same name is already present.");

        categories.setCategoryName(categoryDTO.getCategoryName());
        category saved = categoryRepo.save(categories);
        return modelMapper.map(saved, CategoryDTO.class);
    }


}
