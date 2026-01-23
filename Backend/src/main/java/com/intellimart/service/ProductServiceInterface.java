package com.intellimart.service;
import java.util.List;

import com.intellimart.dto.ProductDto;


public interface ProductServiceInterface {
	
	    // 1. Fetch all products for the catalog
	    List<ProductDto> getAllProducts(); 

	    // 2. Fetch a single product for the details page
	    ProductDto getProductById(Long id); 

	    // 3. Add a new product (with null image support)
	    ProductDto addProduct(ProductDto productDto); 

	    // 4. Delete a product from the database
	    String deleteProduct(Long id);

		ProductDto updateProduct(Long id, ProductDto dto); 
	
	

}
