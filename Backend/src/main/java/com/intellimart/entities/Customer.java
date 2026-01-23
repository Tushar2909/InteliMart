package com.intellimart.entities;

import java.util.*;
import jakarta.persistence.*;
import lombok.*;

@Getter 
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Address> addresses = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    private List<Orders> orders = new ArrayList<>();

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
