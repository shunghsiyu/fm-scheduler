package com.baeldung.optaplanner;

public class Person {

    public enum Gender {
        MALE,
        FEMALE
    }

    private String name;
    private Gender gender;
    private Time OPDTime;
    
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
