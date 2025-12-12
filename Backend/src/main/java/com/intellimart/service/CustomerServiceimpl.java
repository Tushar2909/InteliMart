package com.intellimart.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.intellimart.dto.CustomerDto;
import com.intellimart.dto.UserDto;
import com.intellimart.entities.Customer;
import com.intellimart.entities.User;
import com.intellimart.repos.CustomerRepo;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class CustomerServiceimpl implements CustomerServiceinterface {

    private final CustomerRepo customerRepo;
    private final ModelMapper mapper;

    @PostConstruct
    public void init() {
        // no special custom mappings required if CustomerDto contains a "UserDto user" field
        // and UserDto fields have the same names as User entity fields.
        // If you later want flattening (user fields at top-level of CustomerDto), we can add mappings.
    }

    /**
     * Read method — keep a read-only transaction so lazy user can be initialized safely.
     */
    @Override
    @Transactional(Transactional.TxType.REQUIRED)
    public CustomerDto findById(Long id) {
        Customer customer = customerRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        // touch user inside transaction to ensure the proxy is initialized (defensive)
        if (customer.getUser() != null) {
            customer.getUser().getName();
        }

        // ModelMapper will map nested User -> UserDto automatically
        return mapper.map(customer, CustomerDto.class);
    }

    /**
     * Create a new customer (only user part is considered). Returns simple success string.
     */
    @Override
    public String addcustomer(CustomerDto dto) {
        if (dto == null || dto.getUser() == null) {
            throw new IllegalArgumentException("CustomerDto and nested UserDto must be provided");
        }

        // Map UserDto -> User entity
        User user = mapper.map(dto.getUser(), User.class);

        // TODO: Hash password here using PasswordEncoder when you add security:
        // if (dto.getUser().getPassword() != null) {
        //     user.setPassword(passwordEncoder.encode(dto.getUser().getPassword()));
        // }

        // Create Customer entity and attach User
        Customer customer = new Customer();
        customer.setUser(user);

        // Save customer (cascade = ALL on Customer.user will persist User as well)
        customerRepo.save(customer);

        return "Customer added successfully!";
    }

    public List<CustomerDto> getallcustomers() {

        List<Customer> customers = customerRepo.findAll();

        return customers.stream()
                .map(customer -> mapper.map(customer, CustomerDto.class))
                .toList();
    }

	public String deletecustomer(Long id) {
		// TODO Auto-generated method stub
		
	      Customer customer = customerRepo.findById(id)
	              .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
	      
	      customerRepo.delete(customer);

	      
	      

		return "Customer with id  "+ id +" Deleted Sucessfully";
	}

	
	@Transactional
	public String updatecustomer(Long id, CustomerDto customerDto) {

	    Customer customer = customerRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

	    User user = customer.getUser();
	    UserDto u = customerDto.getUser();
	    
	    
	    
	    if (u.getName() != null) user.setName(u.getName());
	    if (u.getNumber() != null) user.setNumber(u.getNumber());
	    if (u.getEmail() != null) user.setEmail(u.getEmail());
	    if (u.getRole() != null) user.setRole(u.getRole());

	    // Gender — update only if sent
	    if (u.getGender() != null) {
	        user.setGender(u.getGender());
	    }

	    // Password — update only if user provided new one (no encode)
	    if (u.getPassword() != null && !customerDto.getUser().getPassword().isBlank()) {
	        user.setPassword(u.getPassword());
	    }

//	    // Update only fields provided in DTO
//	    if (customerDto.getUser().getName() != null) user.setName(customerDto.getUser().getName());
//	    if (customerDto.getUser().getNumber() != null) user.setNumber(customerDto.getUser().getNumber());
//	    if (customerDto.getUser().getEmail() != null) user.setEmail(customerDto.getUser().getEmail());
//	    if (customerDto.getUser().getRole() != null) user.setRole(customerDto.getUser().getRole());
//
//	    // Gender — update only if sent
//	    if (customerDto.getUser().getGender() != null) {
//	        user.setGender(customerDto.getUser().getGender());
//	    }
//
//	    // Password — update only if user provided new one (no encode)
//	    if (customerDto.getUser().getPassword() != null && !customerDto.getUser().getPassword().isBlank()) {
//	        user.setPassword(customerDto.getUser().getPassword());
//	    }

	    customerRepo.save(customer);
//	    user.setEmail(customerDto.getUser().getEmail());

	    return "Customer with id " + id + " updated successfully";
	}


	
	

}


//public class CustomerServiceimpl implements CustomerServiceinterface  {
//	private final CustomerRepo customerRepo;
//	
//	private final ModelMapper mapp;
//	@Override
//	public CustomerDto findById(Long id) {
//		// TODO Auto-generated method stub
//		 Customer customer = customerRepo.findById(id)
//	                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
//		 
//		 
//	        User user = customer.getUser();
//	        
//	        CustomerDto dto = new CustomerDto(
//	                customer.getId(),      // id from Customer table
//	                user.getName(),        // name from User
//	                user.getNumber(),      // number from User
//	                user.getRole(),        // role from User
//	                user.getEmail(),       // email from User
//	                user.getPassword(),    // password from User
//	                user.getGender()       // gender from User
//	        );
//
////		  CustomerDto dto = mapp.map(customer, CustomerDto.class);
//		 
//		  return dto;
//	}
//	
//
//}




//@PostConstruct
//public void setupMappings() {
//    mapper.typeMap(Customer.class, CustomerDto.class)
//        .addMapping(src -> src.getUser().getName(), CustomerDto::setName)
//        .addMapping(src -> src.getUser().getNumber(), CustomerDto::setNumber)
//        .addMapping(src -> src.getUser().getRole(), CustomerDto::setRole)
//        .addMapping(src -> src.getUser().getEmail(), CustomerDto::setEmail)
//        .addMapping(src -> src.getUser().getPassword(), CustomerDto::setPassword)
//        .addMapping(src -> src.getUser().getGender(), CustomerDto::setGender);
//}


