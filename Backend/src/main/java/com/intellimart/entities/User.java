package com.intellimart.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String number;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String password;
    private String gender;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles role;
    
    private Boolean isDeleted = false;
}
