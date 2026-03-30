package com.rg.ecom.seeder;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SeederResult {
    private int suppliersCreated;
    private int categoriesCreated;
    private int productsCreated;
    private int ordersCreated;
}
