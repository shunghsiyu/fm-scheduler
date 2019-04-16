package com.baeldung.optaplanner;

import java.time.DayOfWeek;
import java.time.LocalDate;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@EqualsAndHashCode
@ToString
public class Time {

    public enum Period {
        MORNING,
        AFTERNOON
    }

    private LocalDate date;
    private Period period;

    public Time(LocalDate date, Period period) {
        this.date = date;
        this.period = period;
    }

    public static Time of(Integer year, Integer month, Integer dayOfMonth, Period period) {
        LocalDate date = LocalDate.of(year, month, dayOfMonth);
        return new Time(date, period);
    }

    public Integer getDate() {
        return this.date.getDayOfMonth();
    }

    public DayOfWeek getDayOfWeek() {
        return this.date.getDayOfWeek();
    }

    public Period getPeriod() {
        return this.period;
    }
}
