package com.intellimart.service;

import java.util.List;
import com.intellimart.dto.CustomerDto;

public interface CustomerServiceinterface {

    CustomerDto findById(Long id);

    String addcustomer(CustomerDto customerDto);

    List<CustomerDto> getallcustomers();

    String updatecustomer(Long id, CustomerDto customerDto);

    String deletecustomer(Long id);
}
