package com.baeldung.optaplanner;

import lombok.EqualsAndHashCode;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode
public class Person {

    public enum Gender {
        MALE,
        FEMALE
    }

    private String name;
    @EqualsAndHashCode.Exclude private Gender gender;
    @EqualsAndHashCode.Exclude private Integer OPDYear;
    @EqualsAndHashCode.Exclude private Integer OPDMonth;
    @EqualsAndHashCode.Exclude private DayOfWeek OPDDayOfWeek;
    @EqualsAndHashCode.Exclude private Time.Period OPDPeriod;
    
    public Person(String name, Gender gender, Integer OPDYear, Integer OPDMonth, DayOfWeek OPDDayOfWeek, Time.Period OPDPeriod) {
        this.name = name;
        this.gender = gender;
        this.OPDYear = OPDYear;
        this.OPDMonth = OPDMonth;
        this.OPDDayOfWeek = OPDDayOfWeek;
        this.OPDPeriod = OPDPeriod;
    }

    public String getName() {
        return this.name;
    }

    public Gender getGender() {
        return this.gender;
    }

    public List<Schedule> getOPDSchedule() {
        List<Schedule> list = new ArrayList<>();
        
        // Get first DayOfWeek in that month
        LocalDate baseDate = LocalDate.of(this.OPDYear, this.OPDMonth, 1);
        LocalDate date = baseDate.with(TemporalAdjusters.firstInMonth(this.OPDDayOfWeek));

        while (date.getMonthValue() == this.OPDMonth) {
            list.add(Schedule.OPD(new Time(date, this.OPDPeriod), this));
            date = date.plusMonths(1);
        }
        return list;
    }
}
