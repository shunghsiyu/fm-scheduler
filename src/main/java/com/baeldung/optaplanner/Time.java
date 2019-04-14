package com.baeldung.optaplanner;

public class Time {

    public enum Period {
        MORNING,
        AFTERNOON
    }

    private Integer date;
    private Period period;

    public Time(Integer date, Period period) {
        this.date = date;
        this.period = period;
    }

    public Integer getDate() {
        return this.date;
    }

    public Period getPeriod() {
        return this.period;
    }

    public void setDate(Integer date) {
        this.date = date;
    }

    public void setPeriod(Period period) {
        this.period = period;
    }

}
