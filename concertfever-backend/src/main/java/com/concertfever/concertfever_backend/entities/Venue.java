package com.concertfever.concertfever_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "venue", schema = "concertfever")
public class Venue {
    @Id
    @Column(name = "venue_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer venueId;

    @Column(name = "venue_name", nullable = false, length = 100)
    private String venueName;

    @Column(name = "seating_capacity", nullable = false)
    private Integer seatingCapacity;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "country", nullable = false, length = 100)
    private String country;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "pin_code", nullable = false, length = 10)
    private String pinCode;

    // added
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "venue", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JsonBackReference // Manage serialization
    private List<Event> event;

}