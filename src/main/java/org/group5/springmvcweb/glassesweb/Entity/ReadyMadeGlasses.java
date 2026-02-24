package org.group5.springmvcweb.glassesweb.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "ReadyMadeGlasses")
public class ReadyMadeGlasses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ready_glasses_id")
    private Integer readyGlassesId;

    @Column(name = "frame_id")
    private Integer frameId;

    @Column(name = "lens_id")
    private Integer lensId;

    @Column(name = "fixed_prescription")
    private String fixedPrescription;

    @Column(name = "price")
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "frame_id", insertable = false, updatable = false)
    private Frame frame;

    @ManyToOne
    @JoinColumn(name = "lens_id", insertable = false, updatable = false)
    private Lens lens;

}
