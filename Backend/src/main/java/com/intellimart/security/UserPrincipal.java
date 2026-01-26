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

    private final String userId;
    private final String email;
    private final String password;
    private final String role;
    private final List<GrantedAuthority> authorities;
    private final boolean enabled;

    // ✅ Constructor used during LOGIN (DB → Security)
    public UserPrincipal(User user) {
        this.userId = String.valueOf(user.getId());
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole().name();
        this.authorities = List.of(new SimpleGrantedAuthority(this.role));
        this.enabled = !user.getIsDeleted();
    }

    // ✅ Constructor used during JWT validation (NO DB hit)
    public UserPrincipal(String userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.password = null;
        this.role = role;
        this.authorities = List.of(new SimpleGrantedAuthority(role));
        this.enabled = true;
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

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }
}
