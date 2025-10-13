package gusto.gusto.Service;

import gusto.gusto.model.User;
import gusto.gusto.payload.AddressDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);



    List<AddressDTO> getAddresses();

    AddressDTO getAddressesById(Long addressId);


    List<AddressDTO> getAddressesByUser(User user);

    AddressDTO updateAddress(Long addressId, AddressDTO addressDTO);

    String deleteAddress(Long addressId);

    //AddressDTO updateAddress(Long addressId, AddressDTO addressDTO);
}
