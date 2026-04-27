package com.rg.ecom.dao;

import com.rg.ecom.entity.auth.Role;
import com.rg.ecom.entity.auth.User;
import com.rg.ecom.entity.auth.UserRole;
import com.rg.ecom.repository.RoleRepository;
import com.rg.ecom.repository.UserRepository;
import com.rg.ecom.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@SuppressWarnings("null")
@Repository
@RequiredArgsConstructor
public class AuthenticationDaoImpl implements AuthenticationDao {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public UserRole saveUserRole(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }

    @Override
    public Role findOrCreateRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(roleName).build()
                ));
    }

    @Override
    public void deleteAllUsers() {
        userRoleRepository.deleteAll();
        userRepository.deleteAll();
    }
}
