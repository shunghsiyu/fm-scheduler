package com.baeldung.optaplanner;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

import java.time.DayOfWeek;

@PlanningEntity
@EqualsAndHashCode
@ToString
public class Schedule implements Comparable<Schedule> {

    private Type type;
    private Time time;
    @EqualsAndHashCode.Exclude
    private Person assignee;
    public Schedule() {
        this.type = null;
        this.time = null;
        this.assignee = null;
    }

    public Schedule(Type type, Time time, Person assignee) {
        this.type = type;
        this.time = time;
        this.assignee = assignee;
    }

    public static Schedule PAP(Time time) {
        return new Schedule(Type.PAP, time, null);
    }

    public static Schedule MorningSlide(Time time) {
        if (time.getPeriod() != Time.Period.Morning) {
            throw new IllegalArgumentException("Morning Slide should be in the morning");
        }

        return new Schedule(Type.MorningSlide, time, null);
    }

    public static Schedule MorningNote(Time time) {
        if (time.getPeriod() != Time.Period.Morning) {
            throw new IllegalArgumentException("Morning Note should be in the morning");
        }

        return new Schedule(Type.MorningNote, time, null);
    }

    public static Schedule W5Slide(Time time) {
        if (time.getDayOfWeek() != DayOfWeek.FRIDAY) {
            throw new IllegalArgumentException("W5 Slide should be on Friday");
        }
        if (time.getPeriod() != Time.Period.Afternoon) {
            throw new IllegalArgumentException("W5 Slide should be in the afternoon");
        }

        return new Schedule(Type.W5Slide, time, null);
    }

    public static Schedule W5Note(Time time) {
        if (time.getDayOfWeek() != DayOfWeek.FRIDAY) {
            throw new IllegalArgumentException("W5 Note should be on Friday");
        }
        if (time.getPeriod() != Time.Period.Afternoon) {
            throw new IllegalArgumentException("W5 Note should be in the afternoon");
        }

        return new Schedule(Type.W5Note, time, null);
    }

    public static Schedule Jingfu(Time time) {
        if (time.getDayOfWeek() != DayOfWeek.TUESDAY) {
            throw new IllegalArgumentException("Jingfu should be on Tuesday");
        }
        if (time.getPeriod() != Time.Period.Afternoon) {
            throw new IllegalArgumentException("Jingfu should be in the afternoon");
        }

        return new Schedule(Type.Jingfu, time, null);
    }

    public static Schedule OPD(Time time, Person assignee) {
        if (assignee == null) {
            throw new IllegalArgumentException("OPD requires an assignee");
        }

        return new Schedule(Type.OPD, time, assignee);
    }

    static Schedule Other(Time time) {
        return new Schedule(Type.Other, time, null);
    }

    public Type getType() {
        return this.type;
    }

    public Time getTime() {
        return this.time;
    }

    @PlanningVariable(valueRangeProviderRefs = {"availablePersons"})
    public Person getAssignee() {
        return this.assignee;
    }

    public void setAssignee(Person assignee) {
        this.assignee = assignee;
    }

    @Override
    public int compareTo(Schedule other) {
        int compareTime = this.time.compareTo(other.time);
        if (compareTime == 0) {
            return this.type.compareTo(other.type);
        } else {
            return compareTime;
        }
    }

    @JsonIgnore
    public int getId() {
        return System.identityHashCode(this);
    }

    public enum Type {
        @JsonProperty("晨會投影片")
        MorningSlide,
        @JsonProperty("晨會記錄")
        MorningNote,
        @JsonProperty("抹片")
        PAP,
        @JsonProperty("景福")
        Jingfu,
        @JsonProperty("科會投影片")
        W5Slide,
        @JsonProperty("科會記錄")
        W5Note,
        @JsonProperty("門診")
        OPD,
        @JsonProperty("其他")
        Other,
    }
}
