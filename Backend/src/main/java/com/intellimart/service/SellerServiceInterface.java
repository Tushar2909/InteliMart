package com.intellimart.service;

import java.util.List;

import com.intellimart.dto.SellerDto;

public interface SellerServiceInterface {

    String addSeller(SellerDto dto);

    List<SellerDto> getAllSellers();
}
