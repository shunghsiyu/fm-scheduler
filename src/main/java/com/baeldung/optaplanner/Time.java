package com.baeldung.optaplanner;

//import org.optaplanner.core.api.domain.entity.PlanningEntity;
//import org.optaplanner.core.api.domain.variable.PlanningVariable;

public class Time {

    public enum Period {
        MORNING,
        AFTERNOON
    }

    private Integer date;
    private Period period;

    //@PlanningVariable(valueRangeProviderRefs = {"availableRooms"})
    public Integer getDate() {
        return this.date;
    }

    //@PlanningVariable(valueRangeProviderRefs = {"availablePeriods"})
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
