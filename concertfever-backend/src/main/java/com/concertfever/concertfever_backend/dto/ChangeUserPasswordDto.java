package com.concertfever.concertfever_backend.dto;

import java.io.Serializable;
/**
 * DTO for {@link com.concertfever.concertfever_backend.entities.UserConfidential}
 */
public record ChangeUserPasswordDto(String email, String currentPassword, String newPassword) implements Serializable {
}