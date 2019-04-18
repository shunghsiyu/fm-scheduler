package com.baeldung.optaplanner;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@EqualsAndHashCode
@ToString(includeFieldNames = true)
public class Person {

    public enum Gender {
        MALE,
        FEMALE
    }

    public enum Role {
        NORMAL,
        SCR
    }

    private String name;
    @EqualsAndHashCode.Exclude private Gender gender;
    @EqualsAndHashCode.Exclude private Role role;
    @ToString.Exclude @EqualsAndHashCode.Exclude private List<Schedule> opdSchedules;

    public Person(String name, Gender gender, List<Schedule> opdSchedules) {
        this(name, gender, opdSchedules, Role.NORMAL);
    }

    public Person(String name, Gender gender, List<Schedule> opdSchedules, Role role) {
        this.name = name;
        this.gender = gender;
        this.opdSchedules = opdSchedules;
        this.role = role;
    }

    public static Person repeatedSchedule(
            String name,
            Gender gender,
            Integer opdYear,
            Integer opdMonth,
            DayOfWeek opdDayOfWeek,
            Time.Period opdPeriod) {
        Person person = new Person(name, gender, null);
        person.opdSchedules =
                person.generateOPDSchedule(opdYear, opdMonth, opdDayOfWeek, opdPeriod);
        return person;
    }

    public Person addOPDSchedule(
            Integer opdYear, Integer opdMonth, DayOfWeek opdDayOfWeek, Time.Period opdPeriod) {
        List<Schedule> additionalSchedules =
                this.generateOPDSchedule(opdYear, opdMonth, opdDayOfWeek, opdPeriod);
        this.opdSchedules.addAll(additionalSchedules);
        return this;
    }

    private List<Schedule> generateOPDSchedule(
            Integer opdYear, Integer opdMonth, DayOfWeek opdDayOfWeek, Time.Period opdPeriod) {
        List<Schedule> list = new ArrayList<>();

        // Get first DayOfWeek in that month
        LocalDate baseDate = LocalDate.of(opdYear, opdMonth, 1);
        LocalDate date = baseDate.with(TemporalAdjusters.firstInMonth(opdDayOfWeek));

        while (date.getMonthValue() == opdMonth) {
            list.add(Schedule.OPD(new Time(date, opdPeriod), this));
            date = date.plusWeeks(1);
        }
        return list;
    }

    public String getName() {
        return this.name;
    }

    public Gender getGender() {
        return this.gender;
    }

    public List<Schedule> getOPDSchedule() {
        return this.opdSchedules;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
