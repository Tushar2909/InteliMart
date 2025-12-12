package com.intellimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto {

    // Client must NOT send aid — DB generates it.
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long aid;

    private String zipcode;
    private String state;
    private String city;
    private String street;

    // matches entity field detailAddress (DB column: detail_address)
    private String detailAddress;
}
