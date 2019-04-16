package com.baeldung.optaplanner;

import java.time.DayOfWeek;
import java.time.LocalDate;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@EqualsAndHashCode
@ToString
public class Time implements Comparable<Time> {

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

    @Override
    public int compareTo(Time other) {
        int compareDate = this.date.compareTo(other.date);
        if (compareDate == 0) {
            return this.period.compareTo(other.period);
        } else {
            return compareDate;
        }
    }
}
