package com.rg.ecom.seeder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StartupSeeder implements ApplicationRunner {

    private final DataSeederService dataSeederService;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Running startup seeders...");
        dataSeederService.seedRoles();
        log.info("Roles seeded.");
        dataSeederService.seedAdminUser();
        log.info("Admin user seeded.");
        dataSeederService.seedStaffUsers();
        log.info("Staff users seeded.");
    }
}
