package com.intellimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.intellimart.entities.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDto {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Phone number is required")
    private String number;

    private Roles role;

    @Email(message = "Invalid Email format")
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password cannot be blank")
    private String password;

    private String gender;
}
