package org.group5.springmvcweb.glassesweb.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Account")
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer accountId;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "username")
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "role")
    private String role;

    @Column(name = "created_at")
    private java.util.Date createdAt;
}
