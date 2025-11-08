package com.temanlansiabe.temanlansia_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "assignments")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "request_id", nullable = false) 
    private Integer requestId;

    @Column(name = "user_id", nullable = false) // relawan id
    private Integer userId; // relawan

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.SCHEDULED;

    // Relasi opsional — non-insertable/non-updatable agar FK dikontrol lewat requestId/userId
    @ManyToOne
    @JoinColumn(name = "request_id", insertable = false, updatable = false)
    private Request request;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    public enum Status {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETE
    }
}