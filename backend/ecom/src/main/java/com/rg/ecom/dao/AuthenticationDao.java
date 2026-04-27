package com.rg.ecom.dao;

import com.rg.ecom.entity.auth.Role;
import com.rg.ecom.entity.auth.User;
import com.rg.ecom.entity.auth.UserRole;

public interface AuthenticationDao {

    boolean emailExists(String email);

    boolean usernameExists(String username);

    User saveUser(User user);

    UserRole saveUserRole(UserRole userRole);

    Role findOrCreateRole(String roleName);

    void deleteAllUsers();
}
