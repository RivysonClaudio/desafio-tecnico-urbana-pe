package com.urbanape.api.domain.users.repositories;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.urbanape.api.domain.users.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    UserDetails findByEmail(String email);
    
    @EntityGraph(attributePaths = {"cards"})
    @Query("SELECT u FROM User u WHERE u.isDeleted = FALSE AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY u.id ASC")
    Page<User> findAllNotDeleted(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.cards WHERE u.isDeleted = FALSE AND u.id = :id")
    Optional<User> findNotDeletedById(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE users SET is_deleted = TRUE WHERE id IN :ids", nativeQuery = true)
    void softDeleteAllByIds(@Param("ids") Set<Long> ids);
}
