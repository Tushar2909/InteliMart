package com.intellimart.entities;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "seller")
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true) 
    private String companyName;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @OneToOne
    @JoinColumn(name="user_id")
    private User user;

    @OneToOne
    @JoinColumn(name="business_address_id")
    private Address businessAddress;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
