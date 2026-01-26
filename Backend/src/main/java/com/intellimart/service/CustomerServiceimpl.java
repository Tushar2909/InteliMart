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
                        .orElseThrow();

        return mapper.map(customer, CustomerDto.class);
    }

    @Override
    public String addcustomer(CustomerDto dto) {

        UserDto uDto = dto.getUser();

        if (userRepo.findByEmailAndIsDeletedFalse(uDto.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

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
            list.add(mapper.map(c, CustomerDto.class));
        }

        return list;
    }

    @Override
    public String deletecustomer(Long id) {

        Customer c =
                customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow();

        c.setDeleted(true);
        c.getUser().setIsDeleted(true);

        return "Customer deleted";
    }

    @Override
    public String updatecustomer(Long id, CustomerDto dto) {

        Customer c =
                customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow();

        User u = c.getUser();
        UserDto ud = dto.getUser();

        if (ud.getName() != null) u.setName(ud.getName());
        if (ud.getNumber() != null) u.setNumber(ud.getNumber());
        if (ud.getGender() != null) u.setGender(ud.getGender());

        userRepo.save(u);

        return "Updated";
    }
}
