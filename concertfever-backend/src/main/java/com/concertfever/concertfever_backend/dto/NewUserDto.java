package com.concertfever.concertfever_backend.dto;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link com.concertfever.concertfever_backend.entities.User}
 */
public record NewUserDto(String firstName, String lastName, String email, String password, BigDecimal accountBalance) implements Serializable {
}