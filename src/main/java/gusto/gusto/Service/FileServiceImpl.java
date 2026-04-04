package gusto.gusto.Service;

import gusto.gusto.payload.ProductDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {
    @Override
    public String uploadImage(String path, MultipartFile image) throws IOException {
        String originalFileName = image.getOriginalFilename();
        if (originalFileName == null) originalFileName = "default.png";

        // upload to server
        // rename and name it uniquely by using random uuid
        String randomUUID = UUID.randomUUID().toString();
        String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        String fileName = randomUUID.concat(extension);
        String filepath = path + File.separator + fileName;
        //uploading to server and check if path exist
        File folder=new File(path);
        if(!folder.exists())
        {
            folder.mkdir();
        }
        //uploading to server
        Files.copy(image.getInputStream(), Paths.get(filepath));

        //return path
        return fileName;
    }


}
