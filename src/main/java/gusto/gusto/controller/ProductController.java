package gusto.gusto.controller;

import gusto.gusto.AppConstant4;
import gusto.gusto.Service.FileService;
import gusto.gusto.Service.ProductService;
import gusto.gusto.model.Product;
import gusto.gusto.payload.ProductDTO;
import gusto.gusto.payload.ProductResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.channels.MulticastChannel;

@RestController
@RequestMapping("/api")
public class ProductController {
    @Autowired
    ProductService productService;
    @Autowired
    FileService fileService;
@PostMapping("/add/{categoryId}")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO product,@PathVariable Long categoryId)
{
    ProductDTO p=productService.add(product,categoryId);
    return new ResponseEntity<>(p, HttpStatus.CREATED);
}
@GetMapping("/showAll")
    public ResponseEntity<ProductResponse> getAll(@RequestParam(name ="pageNumber" ,defaultValue = AppConstant4.PAGE_NUMBER ,required = false)Integer pageNumber,
                                                  @RequestParam(name ="pageSize" ,defaultValue = AppConstant4.PAGE_SIZE ,required = false)Integer pageSize,
                                                  @RequestParam(name="sortBy",defaultValue = AppConstant4.SORT_CATEGORIES_BY ,required = false)String sortBy,
                                                  @RequestParam(name="sortProduct",defaultValue = AppConstant4.sortProductBy ,required = false)String sortProduct)
{
    ProductResponse productResponse=  productService.getAllProduct(pageNumber,pageSize,sortBy,sortProduct);
    return new ResponseEntity<>(productResponse,HttpStatus.OK);
}
@GetMapping("getBy/{categoryId}")
    public ResponseEntity<ProductResponse> getByCategory(@PathVariable Long categoryId,@RequestParam(name ="pageNumber" ,defaultValue = AppConstant4.PAGE_NUMBER ,required = false)Integer pageNumber,
                                                         @RequestParam(name ="pageSize" ,defaultValue = AppConstant4.PAGE_SIZE ,required = false)Integer pageSize,
                                                         @RequestParam(name="sortBy",defaultValue = AppConstant4.SORT_CATEGORIES_BY ,required = false)String sortBy,
                                                         @RequestParam(name="sortProduct",defaultValue = AppConstant4.sortProductBy ,required = false)String sortProduct)
{
    ProductResponse productResponse= productService.getccByCategory(categoryId,pageNumber,pageSize,sortBy,sortProduct);
    return new ResponseEntity<>(productResponse,HttpStatus.OK);
}
@GetMapping("product/{keyword}")
    public ResponseEntity<ProductResponse> getProductByKeyword(@PathVariable String keyword,@RequestParam(name ="pageNumber" ,defaultValue = AppConstant4.PAGE_NUMBER ,required = false)Integer pageNumber,
                                                               @RequestParam(name ="pageSize" ,defaultValue = AppConstant4.PAGE_SIZE ,required = false)Integer pageSize,
                                                               @RequestParam(name="sortBy",defaultValue = AppConstant4.SORT_CATEGORIES_BY ,required = false)String sortBy,
                                                               @RequestParam(name="sortProduct",defaultValue = AppConstant4.sortProductBy ,required = false)String sortProduct)
{
      ProductResponse pr=productService.getByKeyword(keyword,pageNumber,pageSize,sortBy,sortProduct);
      return new ResponseEntity<>(pr,HttpStatus.OK);
}
@PutMapping("/{productId}")
    public ResponseEntity<ProductDTO> update(@PathVariable Long productId,@Valid ProductDTO product)
{
    ProductDTO productDTO=productService.updateProduct(productId,product);
    return new ResponseEntity<>(productDTO,HttpStatus.OK);
}
@DeleteMapping("/delete/{productId}")
    public ResponseEntity<ProductDTO> deleteing(@PathVariable Long productId)
{
     ProductDTO p=productService.deleteById(productId);
     return new ResponseEntity<>(p,HttpStatus.OK);
}
@PutMapping("/updateImage/{productId}")
    public ResponseEntity<ProductDTO> updateImage(@PathVariable Long productId, @RequestParam("image")MultipartFile image) throws IOException {
    ProductDTO productDTO =productService.updateProductImage(productId,image);
    return new ResponseEntity<>(productDTO,HttpStatus.OK);
}
}
