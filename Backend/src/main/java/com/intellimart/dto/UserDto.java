package com.intellimart.dto;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id; // ✅ Add this field so ud.setId() works in your Service
    private String name;
    private String email;
    private String number;
    private String gender;
    private String password;
}