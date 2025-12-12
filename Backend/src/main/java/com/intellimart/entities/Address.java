package com.intellimart.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "address")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "customer")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aid")
    private Long aid;

    @Column(name = "zipcode", nullable = false)
    private String zipcode;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "street", nullable = false)
    private String street;

    // DB column is `detail_address`
    @Column(name = "detail_address", nullable = false)
    private String detailAddress;

    // owning side of the relation; column is customer_id and NOT NULL in DB
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
}
