package com.temanlansiabe.temanlansia_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reviews")
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "rating", nullable = false)
    private Integer rating; // 1-5

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    // Relasi ke User (pemberi review)
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false) //
    private User user;

    // Relasi ke Request (request yang direview)
    @ManyToOne
    @JoinColumn(name = "request_id", insertable = false, updatable = false)
    private Request request;
}