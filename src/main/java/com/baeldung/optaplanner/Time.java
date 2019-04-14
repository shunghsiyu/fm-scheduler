package com.baeldung.optaplanner;

public class Time {

    public enum Period {
        MORNING,
        AFTERNOON
    }

    private Integer date;
    private Integer dayOfWeek;
    private Period period;

    public Time(Integer date, Integer dayOfWeek, Period period) {
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.period = period;
    }

    public Integer getDate() {
        return this.date;
    }

    public Integer getDayOfWeek() {
        return this.dayOfWeek;
    }

    public Period getPeriod() {
        return this.period;
    }

}
