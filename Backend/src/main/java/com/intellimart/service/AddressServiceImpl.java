package com.intellimart.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.AddressDto;
import com.intellimart.entities.Address;
import com.intellimart.entities.Customer;
import com.intellimart.repos.AddressRepo;
import com.intellimart.repos.CustomerRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressServiceInterface {

    private final AddressRepo addressRepo;
    private final CustomerRepo customerRepo;

    @Override
    public AddressDto addAddress(Long customerId, AddressDto dto) {

        Customer customer = customerRepo.findByIdAndIsDeletedFalse(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Address a = new Address();
        a.setCity(dto.getCity());
        a.setDetailAddress(dto.getDetailAddress());
        a.setState(dto.getState());
        a.setStreet(dto.getStreet());
        a.setZipcode(dto.getZipcode());
        a.setCustomer(customer);

        Address saved = addressRepo.save(a);

        dto.setAid(saved.getAid());
        return dto;
    }

    @Override
    public List<AddressDto> getCustomerAddresses(Long customerId) {

        return addressRepo.findByCustomer_Id(customerId)
                .stream()
                .map(a -> new AddressDto(
                        a.getAid(),
                        a.getCity(),
                        a.getDetailAddress(),
                        a.getState(),
                        a.getStreet(),
                        a.getZipcode()
                ))
                .toList();
    }
}
