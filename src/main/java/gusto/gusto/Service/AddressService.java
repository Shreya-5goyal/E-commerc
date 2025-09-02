package gusto.gusto.Service;

import gusto.gusto.model.User;
import gusto.gusto.payload.AddressDTO;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);



    List<AddressDTO> getAddresses();
}
