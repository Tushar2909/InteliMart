package com.intellimart.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.SellerDto;
import com.intellimart.entities.Seller;
import com.intellimart.entities.User;
import com.intellimart.repos.SellerRepo;
import com.intellimart.repos.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SellerServiceImpl implements SellerServiceInterface {

    private final SellerRepo sellerRepo;
    private final UserRepo userRepo;

    // ================= ADD SELLER =================

    @Override
    public String addSeller(SellerDto dto) {

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Seller seller = new Seller();
        seller.setCompanyName(dto.getCompanyName());
        seller.setUser(user);
        seller.setDeleted(false);

        sellerRepo.save(seller);

        return "Seller added successfully";
    }

    // ================= GET ALL SELLERS =================

    @Override
    @Transactional(readOnly = true)
    public List<SellerDto> getAllSellers() {

        return sellerRepo.findByIsDeletedFalse()
                .stream()
                .map(s -> {

                    SellerDto dto = new SellerDto();
                    dto.setId(s.getId());
                    dto.setCompanyName(s.getCompanyName());
                    dto.setUserId(s.getUser().getId());

                    return dto;

                }).toList();
    }
}
