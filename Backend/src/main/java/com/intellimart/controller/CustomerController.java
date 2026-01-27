package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.CustomerDto;
import com.intellimart.service.CustomerServiceinterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerServiceinterface customerService;

    // REGISTER (public)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody CustomerDto dto) {
        return ResponseEntity.ok(customerService.addcustomer(dto));
    }

    // ================= CUSTOMER =================

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<CustomerDto> me(Authentication auth) {
        return ResponseEntity.ok(customerService.findByEmail(auth.getName()));
    }

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PutMapping("/me")
    public ResponseEntity<String> update(Authentication auth,
                                         @RequestBody CustomerDto dto) {

        return ResponseEntity.ok(
                customerService.updateByEmail(auth.getName(), dto)
        );
    }

    // ================= ADMIN =================

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.deletecustomer(id));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getallcustomers());
    }
}
