package org.group5.springmvcweb.glassesweb.Entity.eye;

import jakarta.persistence.*;

@Entity
@Table(name = "EyePrescription")
public class EyePrescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_id")
    private Integer prescriptionId;

    @Column(name = "eye_profile_id")
    private Integer eyeProfileId;

    @Column(name = "eye_side")
    private String eyeSide; // "LEFT", "RIGHT", "BOTH"

    @Column(name = "sph")
    private Double sph;

    @Column(name = "cyl")
    private Double cyl;

    @Column(name = "axis")
    private Integer axis;

    @Column(name = "pd")
    private Double pd;

    @Column(name = "add_value")
    private Double add;

    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }

    public Integer getEyeProfileId() { return eyeProfileId; }
    public void setEyeProfileId(Integer eyeProfileId) { this.eyeProfileId = eyeProfileId; }

    public String getEyeSide() { return eyeSide; }
    public void setEyeSide(String eyeSide) { this.eyeSide = eyeSide; }

    public Double getSph() { return sph; }
    public void setSph(Double sph) { this.sph = sph; }

    public Double getCyl() { return cyl; }
    public void setCyl(Double cyl) { this.cyl = cyl; }

    public Integer getAxis() { return axis; }
    public void setAxis(Integer axis) { this.axis = axis; }

    public Double getPd() { return pd; }
    public void setPd(Double pd) { this.pd = pd; }

    public Double getAdd() { return add; }
    public void setAdd(Double add) { this.add = add; }
}