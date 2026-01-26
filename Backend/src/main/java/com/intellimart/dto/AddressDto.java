package com.intellimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long aid;

    private String city;
    private String detailAddress;
    private String state;
    private String street;
    private String zipcode;
}
