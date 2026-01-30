package com.intellimart.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.intellimart.dto.ApiResponse;
import com.intellimart.dto.CustomerDto;
import com.intellimart.service.CustomerServiceinterface;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerServiceinterface customerService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody CustomerDto dto) {
        String msg = customerService.addcustomer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(true, msg));
    }

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<CustomerDto> me(Authentication auth) {
        return ResponseEntity.ok(customerService.findByEmail(auth.getName()));
    }

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse> update(Authentication auth, @RequestBody CustomerDto dto) {
        String msg = customerService.updateByEmail(auth.getName(), dto);
        return ResponseEntity.ok(new ApiResponse(true, msg));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Long id) {
        String msg = customerService.deletecustomer(id);
        return ResponseEntity.ok(new ApiResponse(true, msg));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getallcustomers());
    }
}