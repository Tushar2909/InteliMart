package com.intellimart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.CustomerDto;
import com.intellimart.service.CustomerServiceimpl;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/")
@AllArgsConstructor
public class CustomerContoller {

    private final CustomerServiceimpl customerServiceimpl;

    /**
     * Get customer by id (returns CustomerDto).
     * The controller return type stays ResponseEntity<?> as you requested.
     */
    @GetMapping("getcustomer/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        ;
        return ResponseEntity.ok(customerServiceimpl.findById(id));
    }

    /**
     * Add customer (expects CustomerDto with nested UserDto).
     * Returns simple string message (as you wanted).
     */
    @PostMapping("addcustomer")
    public ResponseEntity<?> addcustomer(@RequestBody CustomerDto customerDto){
        
        return ResponseEntity.ok(customerServiceimpl.addcustomer(customerDto));
    }
    @GetMapping("getallcustomer")
    public ResponseEntity<?>getallcustomer(){
    	return ResponseEntity.ok(customerServiceimpl.getallcustomers());
    }
    
    @DeleteMapping("@deleteCustomer/{id}")
    public ResponseEntity<?>deletecustomer(@PathVariable Long id){
    	return ResponseEntity.ok(customerServiceimpl.deletecustomer(id));
    }
    @PutMapping("updatecustomer/{id}")
    public ResponseEntity<?>updateCustomer(@PathVariable Long id,@RequestBody CustomerDto customerDto)
    {
    	return ResponseEntity.ok(customerServiceimpl.updatecustomer(id,customerDto));

    }
    
    
    
    
    
    
}
