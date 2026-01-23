package com.intellimart.service;

import java.util.ArrayList;
import java.util.List;

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

    // ================= GET CUSTOMER =================

    @Override
    @Transactional(readOnly = true)
    public CustomerDto findById(Long id) {

        Customer customer = customerRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found or account deactivated. ID: " + id));

        return mapper.map(customer, CustomerDto.class);
    }

    // ================= REGISTER CUSTOMER =================

    @Override
    public String addcustomer(CustomerDto dto) {

        if (dto == null || dto.getUser() == null) {
            throw new RuntimeException("Customer details and user info are required");
        }

        UserDto uDto = dto.getUser();

        // Duplicate email check
        if (userRepo.findByEmailAndIsDeletedFalse(uDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + uDto.getEmail());
        }

        if (uDto.getPassword() == null || uDto.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        // 🔐 Create User safely
        User user = new User();
        user.setName(uDto.getName());
        user.setEmail(uDto.getEmail());
        user.setNumber(uDto.getNumber());
        user.setGender(uDto.getGender());
        user.setPassword(passwordEncoder.encode(uDto.getPassword()));
        user.setRole(Roles.ROLE_CUSTOMER);
        user.setIsDeleted(false);

        User savedUser = userRepo.save(user);

        // Create Customer entry
        Customer customer = new Customer();
        customer.setUser(savedUser);
        customer.setDeleted(false);

        customerRepo.save(customer);

        return "Customer registered successfully with email: " + savedUser.getEmail();
    }

    // ================= GET ALL CUSTOMERS =================

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDto> getallcustomers() {

        List<Customer> customers = customerRepo.findAllByIsDeletedFalse();
        List<CustomerDto> result = new ArrayList<>();

        for (Customer customer : customers) {
            result.add(mapper.map(customer, CustomerDto.class));
        }

        return result;
    }

    // ================= SOFT DELETE CUSTOMER =================

    @Override
    public String deletecustomer(Long id) {

        Customer customer = customerRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found or already deactivated"));

        customer.setDeleted(true);

        User user = customer.getUser();
        if (user != null) {
            user.setIsDeleted(true);
            userRepo.save(user);
        }

        customerRepo.save(customer);

        return "Customer account deactivated successfully";
    }

    // ================= UPDATE CUSTOMER =================

    @Override
    public String updatecustomer(Long id, CustomerDto customerDto) {

        Customer customer = customerRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException("Cannot update: customer not found"));

        User user = customer.getUser();
        UserDto uDto = customerDto.getUser();

        if (uDto == null) {
            throw new RuntimeException("User data is required");
        }

        if (uDto.getName() != null) {
            user.setName(uDto.getName());
        }

        if (uDto.getNumber() != null) {
            user.setNumber(uDto.getNumber());
        }

        if (uDto.getGender() != null) {
            user.setGender(uDto.getGender());
        }

        if (uDto.getEmail() != null &&
            !uDto.getEmail().equals(user.getEmail())) {

            if (userRepo.findByEmailAndIsDeletedFalse(uDto.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use: " + uDto.getEmail());
            }
            user.setEmail(uDto.getEmail());
        }

        if (uDto.getPassword() != null && !uDto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(uDto.getPassword()));
        }

        userRepo.save(user);
        customerRepo.save(customer);

        return "Customer with id " + id + " updated successfully";
    }
}
