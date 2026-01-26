package com.intellimart.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.intellimart.dto.SellerDto;
import com.intellimart.dto.UserDto;
import com.intellimart.entities.Roles;
import com.intellimart.entities.Seller;
import com.intellimart.entities.User;
import com.intellimart.repos.SellerRepo;
import com.intellimart.repos.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SellerServiceImpl implements SellerServiceInterface {

    private final SellerRepo sellerRepository;
    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String addSeller(SellerDto dto) {

        // ✅ DUPLICATE EMAIL CHECK
        if (userRepository.existsByEmail(dto.getUser().getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create User
        User user = new User();
        user.setName(dto.getUser().getName());
        user.setEmail(dto.getUser().getEmail());
        user.setNumber(dto.getUser().getNumber());
        user.setGender(dto.getUser().getGender());
        user.setPassword(passwordEncoder.encode(dto.getUser().getPassword()));
        user.setRole(Roles.ROLE_SELLER);

        // Create Seller
        Seller seller = new Seller();
        seller.setCompanyName(dto.getCompanyName());
        seller.setUser(user);

        // Cascade saves user
        sellerRepository.save(seller);

        return "Seller created successfully";
    }

    @Override
    public List<SellerDto> getAllSellers() {

        return sellerRepository.findAll()
                .stream()
                .map(seller -> {
                    SellerDto dto = new SellerDto();
                    dto.setId(seller.getId());
                    dto.setCompanyName(seller.getCompanyName());

                    User user = seller.getUser();
                    if (user != null) {
                        UserDto userDto = new UserDto();
                        userDto.setName(user.getName());
                        userDto.setEmail(user.getEmail());
                        userDto.setNumber(user.getNumber());
                        userDto.setGender(user.getGender());
                        dto.setUser(userDto);
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }
}
