package com.urbanape.api.domain.cards.entities;

public enum CardType {

    COMUM("COMUM"),
    ESTUDANTE("ESTUDANTE"),
    TRABALHADOR("TRABALHADOR");

    private String type;

    CardType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

}
