package com.urbanape.api.domain.cards.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.urbanape.api.domain.users.entities.User;

import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.JoinColumn;

@Entity(name = "Card")
@Table(name = "cards")
public class Card {

    @Id
    @Column(name = "number", unique = true, nullable = false)
    private Long number;

    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "status", nullable = false)
    private Boolean status;
    
    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private CardType type;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "record", insertable = false, updatable = false, nullable = false)
    private Long record;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    public Card() {}

    public Card(Long number, String title, Boolean status, CardType type, User user) {
        this.number = number;
        this.title = title;
        this.status = status;
        this.type = type;
        this.user = user;
    }

    public Long getNumber() {
        return number;
    }

    public String getTitle() {
        return title;
    }

    public Boolean getStatus() {
        return status;
    }

    public CardType getType() {
        return type;
    }

    public User getUser() {
        return user;
    }

    public Long getRecord() {
        return record;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public void setType(CardType type) {
        this.type = type;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

}
