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
            throw new APIException("resource is not added till now  ");
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
        category Category=modelMapper.map(categoryDTO,category.class);
      category savedCategory=categoryRepo.findByCategoryName(Category.getCategoryName());

     category Cat= categoryRepo.save(Category);
     CategoryDTO categoryDTO1=modelMapper.map(Cat,CategoryDTO.class);
     return categoryDTO1;
    }

    @Override
    public CategoryDTO deleteCategoryById(Long id) {
    category categories=categoryRepo.findById(id).orElseThrow(()-> new ResourseNotFoundException("categrory","categoryId",id));
    categoryRepo.deleteById(id);
     return modelMapper.map(categories,CategoryDTO.class);
    }

    public CategoryDTO update(CategoryDTO categoryDTO, Long id) {
        category Category=modelMapper.map(categoryDTO,category.class);
        category categories=categoryRepo.findById(id).orElseThrow(()-> new ResourseNotFoundException("category","categoryId",id));
        category saved=categoryRepo.findByCategoryName(Category.getCategoryName());
        if(saved!=null)
            throw new APIException("category with same name is already present ");
        Category.setCategoryId(id);
        saved=categoryRepo.save(Category);
        CategoryDTO ss=modelMapper.map(saved,CategoryDTO.class);
        return  ss;

    }


}
