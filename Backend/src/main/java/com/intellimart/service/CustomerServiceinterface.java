package com.intellimart.service;

import java.util.List;

import com.intellimart.dto.CustomerDto;

public interface CustomerServiceinterface {
	//public CustomerDto getcustomerbyid(Long id);
	public CustomerDto findById(Long id);
	public String addcustomer(CustomerDto customerdto);
	 public List<CustomerDto> getallcustomers();
	
}