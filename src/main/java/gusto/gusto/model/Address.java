package gusto.gusto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "addresses")
@AllArgsConstructor
@NoArgsConstructor

public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;
    @NotBlank
    @Size(min=5,message = "street name must be atleast 5 length")
    private String street;
    @NotBlank
    @Size(min=5,message = "building name must be atleast 5 length")
    private String buildingName;
    @NotBlank
    @Size(min=4,message = "city name must be atleast 4 length")
    private String city;
    @NotBlank
    @Size(min=2,message = "state name must be atleast 2 length")
    private String state;
    @NotBlank
    @Size(min=2,message = "country name must be atleast 2 length")
    private String country;
    @NotBlank
    @Size(min=6,message = "Pincode must be atleast 6 length")
    private String pincode;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Address(String street,String buildingName,String city,String state,String country,String pincode) {
        this.street = street;
        this.buildingName=buildingName;
        this.state=state;
        this.city=city;
        this.pincode=pincode;
        this.country=country;

    }
}
