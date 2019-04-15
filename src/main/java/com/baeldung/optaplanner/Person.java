package com.baeldung.optaplanner;

import lombok.EqualsAndHashCode;

@EqualsAndHashCode
public class Person {

    public enum Gender {
        MALE,
        FEMALE
    }

    private String name;
    private Gender gender;
    @EqualsAndHashCode.Exclude private Time OPDTime;
    
    public Person(String name, Gender gender, Time OPDTime) {
        this.name = name;
        this.gender = gender;
        this.OPDTime = OPDTime;
    }

    public String getName() {
        return this.name;
    }

    public Gender getGender() {
        return this.gender;
    }

    public Time getOPDTime() {
        return this.OPDTime;
    }

}
