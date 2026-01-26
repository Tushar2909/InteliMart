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
    public AddressDto addAddressByEmail(String email, AddressDto dto) {

        Customer customer =
                customerRepo.findByUser_Email(email)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        Address a = new Address();
        a.setCity(dto.getCity());
        a.setDetailAddress(dto.getDetailAddress());
        a.setState(dto.getState());
        a.setStreet(dto.getStreet());
        a.setZipcode(dto.getZipcode());
        a.setCustomer(customer);

        Address saved = addressRepo.save(a);

        return toDto(saved);
    }

    @Override
    public List<AddressDto> getCustomerAddressesByEmail(String email) {

        Customer customer =
                customerRepo.findByUser_Email(email)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        return addressRepo.findByCustomer_Id(customer.getId())
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ===== unused ID methods kept for compatibility =====

    @Override
    public AddressDto addAddress(Long customerId, AddressDto dto) {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<AddressDto> getCustomerAddresses(Long customerId) {
        throw new UnsupportedOperationException();
    }

    // ================= DTO =================

    private AddressDto toDto(Address a) {

        return new AddressDto(
                a.getAid(),
                a.getCity(),
                a.getDetailAddress(),
                a.getState(),
                a.getStreet(),
                a.getZipcode()
        );
    }
}
