package gusto.gusto.Service;

import gusto.gusto.Repo.AddressRepository;
import gusto.gusto.model.Address;
import gusto.gusto.model.User;
import gusto.gusto.payload.AddressDTO;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import javax.swing.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService{

    @Autowired
    AddressRepository addressRepository;
    @Autowired
    ModelMapper modelMapper;

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        Address address =modelMapper.map(addressDTO,Address.class);
        List<Address> addressList=user.getAddresses();
        addressList.add(address);
        user.setAddresses(addressList);
        address.setUser(user);
         Address savedAddress=addressRepository.save(address);
         return modelMapper.map(savedAddress,AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddresses() {
        List<Address> addressList=addressRepository.findAll();
      List<AddressDTO> addressDTOList=  addressList.stream().map(address->modelMapper.map(address,AddressDTO.class)).toList();
        return addressDTOList;


    }
}
