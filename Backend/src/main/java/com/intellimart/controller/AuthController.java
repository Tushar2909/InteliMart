package com.intellimart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.intellimart.dto.ResetPasswordDto;
import com.intellimart.dto.SellerDto;
import com.intellimart.dto.SigninResponse;
import com.intellimart.security.JwtUtils;
import com.intellimart.security.UserPrincipal;
import com.intellimart.service.CustomerServiceinterface;
import com.intellimart.service.SellerServiceInterface;
import com.intellimart.service.UserServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final CustomerServiceinterface customerService;
    private final SellerServiceInterface sellerService;
    private final UserServiceInterface userService;   // ✅ added

    @PostMapping("/signup/customer")
    public ResponseEntity<ApiResponse> signupCustomer(@RequestBody CustomerDto dto) {

        String msg = customerService.addcustomer(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, msg));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/signup/seller")
    public ResponseEntity<ApiResponse> signupSeller(@RequestBody SellerDto dto) {

        String msg = sellerService.addSeller(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, msg));
    }

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
                new SigninResponse(token, "Login Successful", principal.getRole())
        );
    }

    // ✅ PASSWORD RESET
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> reset(@RequestBody ResetPasswordDto dto) {

        userService.resetPassword(dto.getEmail(), dto.getNewPassword());

        return ResponseEntity.ok(new ApiResponse(true, "Password updated"));
    }
}
