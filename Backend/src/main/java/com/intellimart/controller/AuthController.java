package com.intellimart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.intellimart.dto.ApiResponse;
import com.intellimart.dto.CustomerDto;
import com.intellimart.dto.LoginDto;
import com.intellimart.dto.SigninResponse;
import com.intellimart.security.JwtUtils;
import com.intellimart.security.UserPrincipal;
import com.intellimart.service.CustomerServiceinterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final CustomerServiceinterface customerService;

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<SigninResponse> login(@RequestBody LoginDto request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtUtils.generateToken(principal);

        return ResponseEntity.ok(
                new SigninResponse(
                        token,
                        "Login Successful",
                        principal.getRole()
                )
        );
    }

    // ================= CUSTOMER SIGNUP =================
    @PostMapping("/signup/customer")
    public ResponseEntity<ApiResponse> signupCustomer(@RequestBody CustomerDto dto) {

        String message = customerService.addcustomer(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse(true, message));
    }
}
