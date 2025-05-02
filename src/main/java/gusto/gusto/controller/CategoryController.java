package gusto.gusto.controller;
import gusto.gusto.AppConstant4;
import gusto.gusto.Service.CategoryService;
import gusto.gusto.model.category;
import gusto.gusto.payload.CategoryDTO;
import gusto.gusto.payload.DTOResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {
    @Autowired
CategoryService categoryService;
    @GetMapping("api/public/categories")
 public ResponseEntity<DTOResponse> getAllCategories(@RequestParam(name ="pageNumber" ,defaultValue = AppConstant4.PAGE_NUMBER ,required = false)Integer pageNumber,
                                                     @RequestParam(name ="pageSize" ,defaultValue = AppConstant4.PAGE_SIZE ,required = false)Integer pageSize,
                                                     @RequestParam(name="sortBy",defaultValue = AppConstant4.SORT_CATEGORIES_BY ,required = false)String sortBy,@RequestParam(name="sortOrder",defaultValue = AppConstant4.SORT_DIR ,required = false)String sortOrder)
    {
        DTOResponse k= categoryService.getCategories(pageNumber,pageSize,sortOrder,sortBy);
        return new ResponseEntity<>(k,HttpStatus.OK);
    }
    @PostMapping("/api/admin/add")
    public ResponseEntity<CategoryDTO> addCategories(@Valid    @RequestBody CategoryDTO categoryDTO)
    {
        categoryService.createCategory(categoryDTO);
        CategoryDTO savedCategory= categoryService.createCategory(categoryDTO);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
    @DeleteMapping("api/admin/delete/{id}")
    public ResponseEntity<CategoryDTO> deleteById(@PathVariable Long id)
    {

           CategoryDTO deleteCategory=categoryService.deleteCategoryById(id);
            return new  ResponseEntity<>(deleteCategory, HttpStatus.OK);
        }

    @PutMapping("api/admin/update/{id}")
    public ResponseEntity<CategoryDTO> update(@Valid @RequestBody CategoryDTO categoryDTO,@PathVariable Long id)
    {

         CategoryDTO  Cate =categoryService.update(categoryDTO,id);
            return new  ResponseEntity<>(Cate, HttpStatus.OK);

    }
}

