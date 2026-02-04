package org.group5.springmvcweb.glassesweb.Repository;

import org.apache.catalina.User;
import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EditAccountRepository extends JpaRepository<Account, Integer> {

    Account findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByPassword(String password);

    @Modifying
    @Query(value = "UPDATE Account SET password_hash = ?2 WHERE a   ccount_id = ?1", nativeQuery = true)
    void updatePassword(Long id, String password);

    @Modifying
    @Query(value = "UPDATE Account  SET username = ?2 WHERE account_id = ?1", nativeQuery = true)
    void updateUsername(Long id, String username);

}