package gusto.gusto.Service;

import gusto.gusto.Repo.AddressRepository;
import gusto.gusto.Repo.UserRepo;
import gusto.gusto.exception.ResourseNotFoundException;
import gusto.gusto.model.Address;
import gusto.gusto.model.User;
import gusto.gusto.payload.AddressDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService{

    @Autowired
    AddressRepository addressRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    UserRepo userRepo;

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

    @Override
    public AddressDTO getAddressesById(Long addressId) {
        Address address= addressRepository.findById(addressId).orElseThrow(()-> new ResourseNotFoundException("Address","addressId",addressId));

        AddressDTO addressDTO=modelMapper.map(address,AddressDTO.class);
        return addressDTO;


    }

    @Override
    public List<AddressDTO> getAddressesByUser(User user) {
        List<Address> addressList=user.getAddresses();
        return addressList.stream().map(address -> modelMapper.map(address,AddressDTO.class)).toList();
    }

    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        Address addressFromDatabase = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourseNotFoundException("Address", "addressId", addressId));

        addressFromDatabase.setCity(addressDTO.getCity());
        addressFromDatabase.setPincode(addressDTO.getPincode());
        addressFromDatabase.setState(addressDTO.getState());
        addressFromDatabase.setCountry(addressDTO.getCountry());
        addressFromDatabase.setStreet(addressDTO.getStreet());
        addressFromDatabase.setBuildingName(addressDTO.getBuildingName());

        Address updatedAddress = addressRepository.save(addressFromDatabase);

        User user = addressFromDatabase.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        user.getAddresses().add(updatedAddress);
        userRepo.save(user);

        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    public String deleteAddress(Long addressId) {
        Address addressFromDatabase = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourseNotFoundException("Address", "addressId", addressId));

        User user = addressFromDatabase.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        userRepo.save(user);

        addressRepository.delete(addressFromDatabase);

        return "Address deleted successfully with addressId: " + addressId;
    }
}
