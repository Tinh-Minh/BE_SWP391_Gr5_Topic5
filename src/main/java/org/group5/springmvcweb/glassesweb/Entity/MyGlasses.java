package org.group5.springmvcweb.glassesweb.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "MyGlasses")
public class MyGlasses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "my_glasses_id")
    private Integer myGlassesId;

    @Column(name = "design_id", unique = true)
    private Integer designId;

    @Column(name = "final_price")
    private double finalPrice;

    private String status; // "DRAFT", "COMPLETED", "ORDERED"

    // Getter/setter
    public Integer getMyGlassesId() { return myGlassesId; }
    public void setMyGlassesId(Integer myGlassesId) { this.myGlassesId = myGlassesId; }

    public Integer getDesignId() { return designId; }
    public void setDesignId(Integer designId) { this.designId = designId; }

    public double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(double finalPrice) { this.finalPrice = finalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}