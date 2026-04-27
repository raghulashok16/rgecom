package com.rg.ecom.repository;

import com.rg.ecom.entity.auth.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    java.util.List<UserRole> findByUser(com.rg.ecom.entity.auth.User user);
    void deleteByUser(com.rg.ecom.entity.auth.User user);
}
