package com.temanlansiabe.temanlansia_backend.Model;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "assignments",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_assignment_request", columnNames = "request_id")
    }
)
@Getter @Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer assignmentId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "request_id",
        nullable = false,
        referencedColumnName = "request_id",
        foreignKey = @ForeignKey(name = "fk_assignment_request")
    )
    private Request requestId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "volunteer_user_id",
        nullable = false,
        referencedColumnName = "user_id",
        foreignKey = @ForeignKey(name = "fk_assignment_volunteer")
    )
    private User volunteer;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.SCHEDULED;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum Status {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETE,
        CANCELLED
    }
}