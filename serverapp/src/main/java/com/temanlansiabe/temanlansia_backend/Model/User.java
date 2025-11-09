package com.temanlansiabe.temanlansia_backend.Model;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    // Klo NotBlank itu mastiin walau ada spasi, misal " ", tetep dianggap kosong
    @NotBlank
    @Column(name = "username", nullable = false, unique = true, length = 20)
    private String username;
    
    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true, length = 50)
    private String email;

    @NotBlank
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "fullname", length = 50)
    private String fullname;

    @Column(name = "phone" )
    private String phone;

    @Column(name = "province", length = 30)
    private String province;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "address_detail", length = 100)
    private String addressDetail;

    @Column(name = "bio", length = 255)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    public enum Role {
        ADMIN,
        LANSIA,
        RELAWAN
    }
}
