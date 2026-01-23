package com.intellimart.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.intellimart.entities.User;

import lombok.Getter;

@Getter
public class UserPrincipal implements UserDetails {

    private String userId;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private String role;

    // 🔥 Constructor used by JWT filter
    public UserPrincipal(String userId, String email, String password,
                         Collection<? extends GrantedAuthority> authorities,
                         String role) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.role = role;
    }

    // 🔥 Constructor used by UserDetailsService
    public UserPrincipal(User user) {
        this.userId = String.valueOf(user.getId());
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole().name();
        this.authorities = List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    // Keep security simple
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
