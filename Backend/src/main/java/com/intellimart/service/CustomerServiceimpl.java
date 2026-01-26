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

    @Override
    public CustomerDto findById(Long id) {

        Customer customer =
                customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        return toDto(customer);
    }

    @Override
    public String addcustomer(CustomerDto dto) {

        if (userRepo.existsByEmail(dto.getUser().getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserDto uDto = dto.getUser();

        User user = new User();
        user.setName(uDto.getName());
        user.setEmail(uDto.getEmail());
        user.setNumber(uDto.getNumber());
        user.setGender(uDto.getGender());
        user.setPassword(passwordEncoder.encode(uDto.getPassword()));
        user.setRole(Roles.ROLE_CUSTOMER);
        user.setIsDeleted(false);

        userRepo.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setDeleted(false);

        customerRepo.save(customer);

        return "Customer registered successfully";
    }

    @Override
    public List<CustomerDto> getallcustomers() {

        List<CustomerDto> list = new ArrayList<>();

        for (Customer c : customerRepo.findAllByIsDeletedFalse()) {
            list.add(toDto(c));
        }

        return list;
    }

    @Override
    public String deletecustomer(Long id) {

        Customer c =
                customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        c.setDeleted(true);
        c.getUser().setIsDeleted(true);

        return "Customer deleted";
    }

    @Override
    public String updatecustomer(Long id, CustomerDto dto) {

        Customer c =
                customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        User u = c.getUser();
        UserDto ud = dto.getUser();

        if (ud.getName() != null) u.setName(ud.getName());
        if (ud.getNumber() != null) u.setNumber(ud.getNumber());
        if (ud.getGender() != null) u.setGender(ud.getGender());

        userRepo.save(u);

        return "Updated";
    }

    @Override
    public CustomerDto findByEmail(String email) {

        Customer c = customerRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return toDto(c);
    }

    @Override
    public String updateByEmail(String email, CustomerDto dto) {

        Customer c = customerRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User u = c.getUser();

        u.setName(dto.getUser().getName());
        u.setNumber(dto.getUser().getNumber());
        u.setGender(dto.getUser().getGender());

        userRepo.save(u);

        return "Customer updated successfully";
    }

    // ================= DTO MAPPER =================

    private CustomerDto toDto(Customer c) {

        CustomerDto dto = new CustomerDto();
        dto.setId(c.getId());

        User u = c.getUser();
        if (u != null) {
            UserDto ud = new UserDto();
            ud.setName(u.getName());
            ud.setEmail(u.getEmail());
            ud.setNumber(u.getNumber());
            ud.setGender(u.getGender());
            dto.setUser(ud);
        }

        return dto;
    }
}
