package gusto.gusto.controller;

import gusto.gusto.Service.AddressService;
import gusto.gusto.model.User;
import gusto.gusto.payload.AddressDTO;
import gusto.gusto.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AddressController {
    @Autowired
   private AddressService addressService;
    @Autowired
   private AuthUtil authUtil;
    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO)
    {
        User user= authUtil.loggedInUser();
        AddressDTO addressDTO1=addressService.createAddress(addressDTO,user);
        return new ResponseEntity<>(addressDTO1, HttpStatus.CREATED);
    }
    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAddresses()
    {
        List<AddressDTO> addressDTOList= addressService.getAddresses();
        return new ResponseEntity<>(addressDTOList,HttpStatus.OK);
    }
    @GetMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAddressesById(@PathVariable Long addressId)
    {
        AddressDTO addressDTO=addressService.getAddressesById(addressId);
        return new ResponseEntity<>(addressDTO,HttpStatus.OK);
    }
    @GetMapping("/users/addresses")
    public ResponseEntity<List<AddressDTO>> getAddressesByUser()
    {
        User user= authUtil.loggedInUser();
        List<AddressDTO> addressDTOList=addressService.getAddressesByUser(user);
        return new ResponseEntity<>(addressDTOList,HttpStatus.OK);
    }
    @PutMapping("/addresses/{addressid}")
    public ResponseEntity<AddressDTO> updateAddressById(@PathVariable Long addressId,@RequestBody AddressDTO addressDTO)
    {
        AddressDTO addressDTO1=addressService.updateAddress(addressId,addressDTO);
        return new ResponseEntity<>(addressDTO1,HttpStatus.OK);
    }
    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<String> updateAddress(@PathVariable Long addressId){
        String status = addressService.deleteAddress(addressId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
