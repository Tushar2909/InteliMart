package com.intellimart.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name ="orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDate orderDate;

    private BigDecimal totalAmount;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Address address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<OrderLineItem> lineItems;

    @OneToOne(mappedBy = "order")
    private Payment payment;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
