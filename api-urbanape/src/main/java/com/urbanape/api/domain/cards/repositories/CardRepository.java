package com.urbanape.api.domain.cards.repositories;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.urbanape.api.domain.cards.entities.Card;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    @Query(value = "SELECT nextval('card_number_seq')", nativeQuery = true)
    Long nextCardNumber();

    @Query("SELECT c FROM Card c WHERE c.isDeleted = FALSE ORDER BY c.record ASC")
    Page<Card> findAllNotDeleted(Pageable pageable);

    @Query("SELECT c FROM Card c WHERE c.isDeleted = FALSE AND c.number IN :numbers ORDER BY c.record ASC")
    Page<Card> findAllNotDeletedByNumbers(@Param("numbers") Set<Long> numbers, Pageable pageable);

    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE cards SET is_deleted = TRUE WHERE number IN :numbers", nativeQuery = true)
    void softDeleteAllByNumbers(@Param("numbers") Set<Long> numbers);

    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE cards SET is_deleted = TRUE WHERE user_id IN :userIds", nativeQuery = true)
    void softDeleteAllByUserIds(@Param("userIds") Set<Long> userIds);

    @Query("SELECT c FROM Card c WHERE c.user.id = :userId AND c.isDeleted = FALSE ORDER BY c.record ASC")
    Page<Card> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT c FROM Card c WHERE c.user.id = :userId AND c.id = :id AND c.isDeleted = FALSE ORDER BY c.record ASC")
    Optional<Card> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
