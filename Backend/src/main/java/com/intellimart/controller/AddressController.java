package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.AddressDto;
import com.intellimart.service.AddressServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressServiceInterface addressService;

    // CUSTOMER add address
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/{customerId}")
    public ResponseEntity<AddressDto> addAddress(
            @PathVariable Long customerId,
            @RequestBody AddressDto dto) {

        return ResponseEntity.ok(addressService.addAddress(customerId, dto));
    }

    // CUSTOMER view addresses
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/{customerId}")
    public ResponseEntity<List<AddressDto>> getAddresses(@PathVariable Long customerId) {

        return ResponseEntity.ok(addressService.getCustomerAddresses(customerId));
    }
}
