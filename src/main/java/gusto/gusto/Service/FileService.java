package gusto.gusto.Service;

import gusto.gusto.payload.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {



    String uploadImage(String path, MultipartFile image) throws IOException;
}
