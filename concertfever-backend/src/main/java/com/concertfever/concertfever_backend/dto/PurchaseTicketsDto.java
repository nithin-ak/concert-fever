package com.concertfever.concertfever_backend.dto;

import java.io.Serializable;
import java.util.List;

public record PurchaseTicketsDto(Integer userId, Integer couponId, List<TicketRequestDto> tickets) implements Serializable {

}
