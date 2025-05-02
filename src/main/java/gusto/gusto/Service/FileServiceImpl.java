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
   public String uploadImage(String path, MultipartFile image) throws IOException {
        //get the file name of original file
        String otriginalFileName =image.getName();

        // upload to server
        //rename and name it uniquely
        // by using random uuid
        String randomUUID= UUID.randomUUID().toString();
        String fileName=randomUUID.concat(otriginalFileName.substring(otriginalFileName.lastIndexOf('.')));
        String filepath=path+ File.pathSeparator+fileName;
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
