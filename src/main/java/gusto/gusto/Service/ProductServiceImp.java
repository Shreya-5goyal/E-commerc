package gusto.gusto.Service;

import gusto.gusto.Repo.CategoryRepo;
import gusto.gusto.Repo.ProductRepo;
import gusto.gusto.exception.APIException;
import gusto.gusto.exception.ResourseNotFoundException;
import gusto.gusto.model.Product;
import gusto.gusto.model.category;
import gusto.gusto.payload.ProductDTO;
import gusto.gusto.payload.ProductResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
@Service

public  class ProductServiceImp implements ProductService{
    @Autowired
    ProductRepo productRepository;
   @Autowired
 CategoryRepo categoryRepository;
    @Autowired
    private ModelMapper modelMapper;
        @Value("${project.image}")
         private String path;
    @Autowired
    private FileService fileservice;

    public ProductDTO add(ProductDTO product, Long categoryId) {
        boolean isProductisPresent=true;
           category Category= categoryRepository.findById(categoryId).orElseThrow(()-> new ResourseNotFoundException("category","categoryId",categoryId));
        List<Product>products=Category.getProductList();
        for(int i=0;i<products.size();i++)
        {
          if(products.get(i).getProductName().equals(product.getProductName())){
              isProductisPresent=false;
              break;
          }
        }
           product.setCategory(Category);
           double specialPrice= product.getPrice()-(product.getDiscount()*0.01* product.getPrice());
           product.setImage(".png");
           Product product1=modelMapper.map(product,Product.class);
           Product saved= productRepository.save(product1);
           return modelMapper.map(saved,ProductDTO.class);

    }
    @Override
    public ProductResponse getAllProduct(Integer pageNumber, Integer pageSize, String sortBy, String sortProduct) {
        Sort sortByOrder=sortBy.equalsIgnoreCase("asc")?Sort.by(sortProduct).ascending():Sort.by(sortProduct).descending();
        Pageable pageDetail= PageRequest.of(pageNumber,pageSize,sortByOrder);
        Page<Product> p= productRepository.findAll(pageDetail);
        List<Product> ps=p.getContent();
        if(ps.isEmpty())
        {
            throw  new APIException(" no products exists");
        }
         List<ProductDTO> pDA=ps.stream().map(pr->modelMapper.map(pr,ProductDTO.class)).collect(Collectors.toList());
   ProductResponse productResponse=new ProductResponse();
   productResponse.setContent(pDA);
   productResponse.setPageNumber(p.getNumber());
   productResponse.setPageSize(p.getSize());
   productResponse.setTotalElement(p.getTotalElements());
        productResponse.setTotalPages(p.getTotalPages());
   return productResponse;
    }
    @Override
    public ProductResponse getccByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortProduct) {

        category Category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourseNotFoundException("category","categoryId",categoryId));
        

         List<Product> products = productRepository.findByCategoryOrderByPriceAsc(Category);
        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();


        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        return productResponse;
    }

    @Override
    public ProductResponse getByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortProduct) {
        List<Product> products = productRepository.findByProductNameLikeIgnoreCase(keyword);
        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();


        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        return productResponse;
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO product) {
      Product product2=modelMapper.map(product,Product.class);
        Product product1=productRepository.findById(productId).orElseThrow(()-> new ResourseNotFoundException("Product","productId",productId));
        product1.setProductName(product.getProductName());
        product1.setDescription(product.getDescription());
        product1.setPrice(product.getPrice());
        product1.setDiscount(product.getDiscount());
        product1.setSpecialPrice(product.getSpecialPrice());
        product1.setQuantity(product.getQuantity());
         Product saved=productRepository.save(product1);
        ProductDTO ss=modelMapper.map(saved,ProductDTO.class);
        return  ss;
    }

    @Override
    public ProductDTO deleteById(Long productId) {
          Product p=productRepository.findById(productId).orElseThrow(()-> new ResourseNotFoundException("Product","productId",productId));

              productRepository.deleteById(productId);
            return modelMapper.map(p,ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product product= productRepository.findById(productId).orElseThrow(()-> new ResourseNotFoundException("Product","productId",productId));

        String fileName=fileservice.uploadImage(path,image);
        product.setImage(fileName);
        Product product1=productRepository.save(product);
        return modelMapper.map(product1,ProductDTO.class);
    }



}

