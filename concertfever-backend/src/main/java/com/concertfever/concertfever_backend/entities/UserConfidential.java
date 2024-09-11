package com.concertfever.concertfever_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "user_confidential", schema = "concertfever")
public class UserConfidential {
    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @MapsId
    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference // Manage serialization
    private User user;

    @Column(name = "id_created_at", nullable = false)
    private LocalDate idCreatedAt;

    @Column(name = "id_last_login", nullable = false)
    private LocalDate idLastLogin;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "password_last_changed_at", nullable = false)
    private LocalDate passwordLastChangedAt;

    @Column(name = "account_balance", nullable = false, precision = 10, scale = 2)
    private BigDecimal accountBalance;

    public UserConfidential(User user, LocalDate idCreatedAt, LocalDate idLastLogin, String password, LocalDate passwordLastChangedAt, BigDecimal accountBalance) {
        this.user = user;
        this.idCreatedAt = idCreatedAt;
        this.idLastLogin = idLastLogin;
        this.password = password;
        this.passwordLastChangedAt = passwordLastChangedAt;
        this.accountBalance = accountBalance;
    }

}