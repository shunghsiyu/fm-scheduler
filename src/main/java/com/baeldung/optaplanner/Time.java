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

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (!(obj instanceof Time))
            return false;
        if (obj == this)
            return true;

        Time time = (Time) obj;
        if (time.getDate() == this.date &&
            time.getDayOfWeek() == this.dayOfWeek &&
            time.getPeriod() == this.period) {
            return true;
        }

        return false;
    }

}
