package com.baeldung.optaplanner;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode
@ToString
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "name")
public class Person {

    private String name;
    @EqualsAndHashCode.Exclude
    private Gender gender;
    @EqualsAndHashCode.Exclude
    private Role role;
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Schedule> schedules;

    public Person() {
        this(null, null, new ArrayList<>());
    }

    @SuppressWarnings("WeakerAccess")
    public Person(String name, Gender gender, List<Schedule> schedules) {
        this(name, gender, schedules, Role.Resident);
    }

    @SuppressWarnings("WeakerAccess")
    public Person(String name, Gender gender, List<Schedule> schedules, Role role) {
        if (schedules == null) {
            throw new IllegalArgumentException("schedules cannot be null");
        }
        this.name = name;
        this.gender = gender;
        this.schedules = schedules;
        this.role = role;
    }

    Person addOtherSchedules(
            Integer opdYear,
            Integer opdMonth,
            DayOfWeek opdDayOfWeek,
            Time.Period opdPeriod,
            Integer weekNumMod2Remainder) {
        List<Schedule> additionalSchedules =
                this.generateSchedules(
                        Schedule.Type.Other, opdYear, opdMonth, opdDayOfWeek, opdPeriod, weekNumMod2Remainder);
        this.schedules.addAll(additionalSchedules);
        return this;
    }

    public enum Gender {
        @JsonProperty("男")
        Male,
        @JsonProperty("女")
        Female
    }

    public static Person repeatedSchedule(
            String name,
            Gender gender,
            Integer opdYear,
            Integer opdMonth,
            DayOfWeek opdDayOfWeek,
            Time.Period opdPeriod) {
        Person person = new Person(name, gender, new ArrayList<>());
        person.schedules =
                person.generateSchedules(Schedule.Type.OPD, opdYear, opdMonth, opdDayOfWeek, opdPeriod, null);
        return person;
    }

    Person addSchedule(Schedule sched) {
        sched.setAssignee(this);
        this.schedules.add(sched);
        return this;
    }

    Person addOtherSchedules(
            Integer opdYear, Integer opdMonth, DayOfWeek opdDayOfWeek, Time.Period opdPeriod) {
        return this.addOPDSchedules(opdYear, opdMonth, opdDayOfWeek, opdPeriod, null);
    }

    public enum Role {
        @JsonProperty("住院醫師")
        Resident,
        @JsonProperty("小 CR")
        AssistantChiefResident
    }

    Person addOPDSchedules(
            Integer opdYear, Integer opdMonth, DayOfWeek opdDayOfWeek, Time.Period opdPeriod) {
        return this.addOPDSchedules(opdYear, opdMonth, opdDayOfWeek, opdPeriod, null);
    }

    Person addOPDSchedules(
            Integer opdYear,
            Integer opdMonth,
            DayOfWeek opdDayOfWeek,
            Time.Period opdPeriod,
            Integer weekNumMod2Remainder) {
        List<Schedule> additionalSchedules =
                this.generateSchedules(
                        Schedule.Type.OPD, opdYear, opdMonth, opdDayOfWeek, opdPeriod, weekNumMod2Remainder);
        this.schedules.addAll(additionalSchedules);
        return this;
    }

    private List<Schedule> generateSchedules(Schedule.Type type, Integer opdYear, Integer opdMonth, DayOfWeek opdDayOfWeek, Time.Period opdPeriod, Integer weekNumMod2Remainder) {
        List<Schedule> list = new ArrayList<>();

        // Get first DayOfWeek in that month
        LocalDate baseDate = LocalDate.of(opdYear, opdMonth, 1);

        for (LocalDate date = baseDate.with(TemporalAdjusters.firstInMonth(opdDayOfWeek));
             date.getMonthValue() == opdMonth;
             date = date.plusWeeks(1)) {
            int simpleWeekNum = 1 + (date.getDayOfMonth() - 1) / 7;
            if (weekNumMod2Remainder != null && (simpleWeekNum % 2) != weekNumMod2Remainder) {
                continue;
            }
            list.add(new Schedule(type, new Time(date, opdPeriod), this));
        }
        return list;
    }

    public String getName() {
        return this.name;
    }

    public Gender getGender() {
        return this.gender;
    }

    public List<Schedule> getSchedules() {
        return this.schedules;
    }

    public Role getRole() {
        return this.role;
    }

    void setRole(Role role) {
        this.role = role;
    }
}
