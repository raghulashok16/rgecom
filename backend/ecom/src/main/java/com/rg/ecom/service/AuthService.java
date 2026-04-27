package com.rg.ecom.service;

import com.rg.ecom.dao.AuthenticationDao;
import com.rg.ecom.dto.LoginRequestDTO;
import com.rg.ecom.dto.LoginResponseDTO;
import com.rg.ecom.dto.RegisterRequestDTO;
import com.rg.ecom.dto.RegisterResponseDTO;
import com.rg.ecom.dto.UserDTO;
import com.rg.ecom.entity.auth.Role;
import com.rg.ecom.entity.auth.User;
import com.rg.ecom.entity.auth.UserRole;
import com.rg.ecom.exception.UserAlreadyExistsException;
import com.rg.ecom.repository.RoleRepository;
import com.rg.ecom.repository.UserRepository;
import com.rg.ecom.repository.UserRoleRepository;
import com.rg.ecom.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationDao authenticationDao;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO request) {

        if (authenticationDao.emailExists(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email '" + request.getEmail() + "' is already registered. Please use a different email."
            );
        }

        if (authenticationDao.usernameExists(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Username '" + request.getUsername() + "' is already taken. Please choose a different username."
            );
        }

        User newUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .build();

        User savedUser = authenticationDao.saveUser(newUser);

        Role defaultRole = authenticationDao.findOrCreateRole("USER");

        UserRole userRole = UserRole.builder()
                .user(savedUser)
                .role(defaultRole)
                .build();

        authenticationDao.saveUserRole(userRole);

        return RegisterResponseDTO.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(defaultRole.getName())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        List<String> roles = auth.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .collect(Collectors.toList());

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found: " + auth.getName()));

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account is inactive. Please contact the administrator.");
        }

        String token = jwtUtil.generateToken(auth.getName(), roles, user.getId(), user.getEmail());

        return LoginResponseDTO.builder()
                .token(token)
                .username(auth.getName())
                .roles(roles)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !user.getUsername().equals("raghul"))
                .map(user -> {
                    List<String> roles = userRoleRepository.findByUser(user).stream()
                            .map(ur -> ur.getRole().getName())
                            .toList();
                    return UserDTO.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .roles(roles)
                            .active(user.isActive())
                            .createdAt(user.getCreatedAt())
                            .build();
                })
                .toList();
    }

    @Transactional
    public UserDTO updateUser(Long id, boolean active, List<String> roleNames) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setActive(active);
        userRepository.save(user);

        userRoleRepository.deleteByUser(user);
        for (String roleName : roleNames) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role not found: " + roleName));
            userRoleRepository.save(UserRole.builder().user(user).role(role).build());
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roleNames)
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByName(String name) {
        return userRepository.findByUsernameContainingIgnoreCase(name).stream()
                .filter(user -> !user.getUsername().equals("raghul"))
                .map(user -> {
                    List<String> roles = userRoleRepository.findByUser(user).stream()
                            .map(ur -> ur.getRole().getName())
                            .toList();
                    return UserDTO.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .roles(roles)
                            .active(user.isActive())
                            .createdAt(user.getCreatedAt())
                            .build();
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByFilter(String roleGroup, Boolean active) {
        List<String> targetRoles = switch (roleGroup.toLowerCase()) {
            case "admin"    -> List.of("ADMIN", "ADMIN_ORDER", "ADMIN_STOCK");
            case "supplier" -> List.of("SUPPLIER");
            case "user"     -> List.of("USER");
            default         -> List.of();
        };

        return userRepository.findAll().stream()
                .filter(user -> !user.getUsername().equals("raghul"))
                .filter(user -> active == null || user.isActive() == active)
                .flatMap(user -> {
                    List<String> roles = userRoleRepository.findByUser(user).stream()
                            .map(ur -> ur.getRole().getName())
                            .toList();
                    if (targetRoles.stream().noneMatch(roles::contains)) return Stream.empty();
                    return Stream.of(UserDTO.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .roles(roles)
                            .active(user.isActive())
                            .createdAt(user.getCreatedAt())
                            .build());
                })
                .toList();
    }

    @Transactional
    public void deleteAllUsers() {
        authenticationDao.deleteAllUsers();
    }
}
