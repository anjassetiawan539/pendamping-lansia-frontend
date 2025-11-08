package com.temanlansiabe.temanlansia_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "requests")
public class Request {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "family_id", nullable = false)
    private Integer familyId;

    @Column(name = "category", nullable = false)
    private String category; // teman_ngobrol, belanja, antar_obat, ke_dokter

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "duration")
    private Integer duration; // dalam menit atau jam (sesuaikan kebutuhan)

    @Column(name = "status", nullable = false)
    private String status; // offered, on_going, done

    //  @Enumerated(EnumType.STRING)
    // @Column(name = "status", nullable = false)
    // private StatusType status;

    // Opsional: Relasi ke tabel User (Foreign Key)
 @ManyToOne(optional = false, fetch = FetchType.LAZY)
 @JoinColumn(name = "family_id", nullable = false, insertable = false, updatable = false) // <- NOT NULL
private User family; // user ber-role KELUARGA
}
//  // Enum untuk category
//     public enum CategoryType {
//         TEMAN_NGOBROL,
//         BELANJA,
//         ANTAR_OBAT,
//         KE_DOKTER
//     }

//     // Enum untuk status
//     public enum StatusType {
//         OFFERED,
//         ON_GOING,
//         DONE


