package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.CustomerDto;
import com.intellimart.service.CustomerServiceinterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerServiceinterface customerService;

    // PUBLIC REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody CustomerDto dto) {
        return ResponseEntity.ok(customerService.addcustomer(dto));
    }

    // CUSTOMER
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.findById(id));
    }

    // CUSTOMER
    @PutMapping("/{id}")
    public ResponseEntity<String> updateCustomer(@PathVariable Long id,
                                                 @RequestBody CustomerDto dto) {
        return ResponseEntity.ok(customerService.updatecustomer(id, dto));
    }

    // CUSTOMER & ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.deletecustomer(id));
    }

    // ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getallcustomers());
    }
}
