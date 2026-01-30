package com.intellimart.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.CustomerDto;
import com.intellimart.dto.UserDto;
import com.intellimart.entities.Customer;
import com.intellimart.entities.Roles;
import com.intellimart.entities.User;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceimpl implements CustomerServiceinterface {

    private final CustomerRepo customerRepo;
    private final UserRepo userRepo;
    private final ModelMapper mapper;
    private final PasswordEncoder passwordEncoder;

    // ================= FIND BY ID (ADMIN) =================

    @Override
    public CustomerDto findById(Long id) {
        // Correctly finds by Customer record ID (e.g., 207)
        Customer customer = customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        return toDto(customer);
    }

    // ================= REGISTER =================

    @Override
    public String addcustomer(CustomerDto dto) {

        if (userRepo.existsByEmail(dto.getUser().getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserDto uDto = dto.getUser();

        // Initialize the User Entity (ID 120)
        User user = new User();
        user.setName(uDto.getName());
        user.setEmail(uDto.getEmail());
        user.setNumber(uDto.getNumber());
        user.setGender(uDto.getGender());
        user.setPassword(passwordEncoder.encode(uDto.getPassword()));
        user.setRole(Roles.ROLE_CUSTOMER);
        user.setIsDeleted(false);

        User savedUser = userRepo.save(user);

        // Initialize the Customer Record (ID 207)
        Customer customer = new Customer();
        customer.setUser(savedUser); // ✅ FIX: Establishes the bridge between 120 and 207
        customer.setDeleted(false);

        customerRepo.save(customer);

        return "Customer registered successfully";
    }

    // ================= GET ALL =================

    @Override
    public List<CustomerDto> getallcustomers() {
        // Optimized using Stream API for performance
        return customerRepo.findAllByIsDeletedFalse()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ================= DELETE =================

    @Override
    public String deletecustomer(Long id) {

        Customer c = customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Cascade soft-delete across both tables
        c.setDeleted(true);
        if (c.getUser() != null) {
            c.getUser().setIsDeleted(true);
        }

        return "Customer deleted";
    }

    // ================= UPDATE BY ID =================

    @Override
    public String updatecustomer(Long id, CustomerDto dto) {

        Customer c = customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        User u = c.getUser();
        UserDto ud = dto.getUser();

        if (ud != null) {
            if (ud.getName() != null) u.setName(ud.getName());
            if (ud.getNumber() != null) u.setNumber(ud.getNumber());
            if (ud.getGender() != null) u.setGender(ud.getGender());
            userRepo.save(u);
        }

        return "Updated";
    }

    // ================= FIND BY EMAIL =================

    @Override
    public CustomerDto findByEmail(String email) {
        // Navigation through the User relationship
        Customer c = customerRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return toDto(c);
    }

    // ================= UPDATE BY EMAIL =================

    @Override
    public String updateByEmail(String email, CustomerDto dto) {

        Customer c = customerRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User u = c.getUser();

        if (dto.getUser() != null) {
            u.setName(dto.getUser().getName());
            u.setNumber(dto.getUser().getNumber());
            u.setGender(dto.getUser().getGender());
            userRepo.save(u);
        }

        return "Customer updated successfully";
    }

    // ================= DTO MAPPER =================

    private CustomerDto toDto(Customer c) {
        CustomerDto dto = new CustomerDto();
        dto.setId(c.getId()); // Internal Customer ID (e.g., 207)

        User u = c.getUser();
        if (u != null) {
            UserDto ud = new UserDto();
            // ✅ FIX: Populate the UserDto ID for frontend state sync (ID 120)
            ud.setId(u.getId()); 
            ud.setName(u.getName());
            ud.setEmail(u.getEmail());
            ud.setNumber(u.getNumber());
            ud.setGender(u.getGender());
            dto.setUser(ud);
        }

        return dto;
    }
}