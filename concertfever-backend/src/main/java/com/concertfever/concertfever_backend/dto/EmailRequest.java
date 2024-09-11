package com.concertfever.concertfever_backend.dto;

import java.io.Serializable;

public record EmailRequest(String to, String subject, String body) implements Serializable {
}
