package com.concertfever.concertfever_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter @Setter  @NoArgsConstructor
@Table(name = "events", schema = "concertfever")
public class Event {
    @Id
    @Column(name = "event_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer eventId;

    @ManyToOne(fetch = FetchType.EAGER, optional = false, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JsonManagedReference // Manage serialization
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @ManyToOne(fetch = FetchType.EAGER, optional = false, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JsonManagedReference // Manage serialization
    @JoinColumn(name = "organiser_user_id", nullable = false)
    private User organiserUser;

    //added
    @OneToMany(mappedBy = "eventId", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore // Avoid deeply nested serialization
    private List<TicketCategory> ticketCategories;

    //added
    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference // Manage serialization
    private List<DiscountCoupon> discountCoupons;

    //added
    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference // Manage serialization
    private List<Ticket> tickets;

    @Column(name = "event_name", nullable = false, length = 100)
    private String eventName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Lob
    @Column(name = "description")
    private String description;

    @ColumnDefault("'MUSIC'")
    @Lob
    @Column(name = "category", nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

}