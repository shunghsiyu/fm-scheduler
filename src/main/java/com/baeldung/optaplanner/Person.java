package com.baeldung.optaplanner;

import lombok.EqualsAndHashCode;

import java.time.DayOfWeek;
import java.util.List;

@EqualsAndHashCode
public class Person {

    public enum Gender {
        MALE,
        FEMALE
    }

    private String name;
    @EqualsAndHashCode.Exclude private Gender gender;
    @EqualsAndHashCode.Exclude private DayOfWeek OPDDayOfWeek;
    @EqualsAndHashCode.Exclude private Time.Period OPDPeriod;
    
    public Person(String name, Gender gender, DayOfWeek OPDDayOfWeek, Time.Period OPDPeriod) {
        this.name = name;
        this.gender = gender;
        this.OPDDayOfWeek = OPDDayOfWeek;
        this.OPDPeriod = OPDPeriod;
    }

    public String getName() {
        return this.name;
    }

    public Gender getGender() {
        return this.gender;
    }

}
