package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.AddressDto;
import com.intellimart.service.AddressServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressServiceInterface addressService;

    // ================= CUSTOMER → ADD OWN ADDRESS =================
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PostMapping
    public ResponseEntity<AddressDto> addAddress(
            Authentication auth,
            @RequestBody AddressDto dto) {

        return ResponseEntity.ok(
                addressService.addAddressByEmail(auth.getName(), dto)
        );
    }

    // ================= CUSTOMER → GET OWN ADDRESSES =================
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @GetMapping
    public ResponseEntity<List<AddressDto>> getAddresses(Authentication auth) {

        return ResponseEntity.ok(
                addressService.getCustomerAddressesByEmail(auth.getName())
        );
    }
}
