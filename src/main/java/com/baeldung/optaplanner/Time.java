package com.baeldung.optaplanner;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.DayOfWeek;
import java.time.LocalDate;

@EqualsAndHashCode
@ToString(doNotUseGetters = true)
public class Time implements Comparable<Time> {

    public enum Period {
        MORNING,
        AFTERNOON;

        private static Period[] vals = values();

        public Period next() {
            return vals[(this.ordinal() + 1) % vals.length];
        }

        public int getValue() {
            return this.ordinal();
        }
    }

    @JsonSerialize(using = JSONUtil.LocalDateSerializer.class)
    private LocalDate localDate;
    private Period period;

    public Time(LocalDate localDate, Period period) {
        this.localDate = localDate;
        this.period = period;
    }

    public static Time of(Integer year, Integer month, Integer dayOfMonth, Period period) {
        LocalDate date = LocalDate.of(year, month, dayOfMonth);
        return new Time(date, period);
    }

    public LocalDate getLocalDate() {
        return this.localDate;
    }

    @JsonIgnore
    public Integer getDate() {
        return this.localDate.getDayOfMonth();
    }

    @JsonIgnore
    public DayOfWeek getDayOfWeek() {
        return this.localDate.getDayOfWeek();
    }

    public Period getPeriod() {
        return this.period;
    }

    @Override
    public int compareTo(Time other) {
        int compareDate = this.localDate.compareTo(other.localDate);
        if (compareDate == 0) {
            return this.period.compareTo(other.period);
        } else {
            return compareDate;
        }
    }
}
