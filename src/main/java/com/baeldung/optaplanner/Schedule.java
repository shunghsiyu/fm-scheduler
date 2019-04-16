package com.baeldung.optaplanner;

import java.time.DayOfWeek;
import lombok.EqualsAndHashCode;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

@PlanningEntity
@EqualsAndHashCode
public class Schedule {

    public enum Type {
        PAP,
        MORNINGMEETING_SLIDE,
        MORNINGMEETING_NOTE,
        W5MEETING_SLIDE,
        W5MEETING_NOTE,
        JINGFUMEETING,
        OPD
    }

    private Type type;
    private Time time;
    @EqualsAndHashCode.Exclude private Person assignee;

    public Schedule(Type type, Time time, Person assignee) {
        this.type = type;
        this.time = time;
        this.assignee = assignee;
    }

    public static Schedule PAP(Time time) {
        return new Schedule(Type.PAP, time, null);
    }

    public static Schedule MorningSlide(Time time) {
        if (time.getPeriod() != Time.Period.MORNING) {
            throw new IllegalArgumentException("Morning Slide should be in the morning");
        }

        return new Schedule(Type.MORNINGMEETING_SLIDE, time, null);
    }

    public static Schedule MorningNote(Time time) {
        if (time.getPeriod() != Time.Period.MORNING) {
            throw new IllegalArgumentException("Morning Note should be in the morning");
        }

        return new Schedule(Type.MORNINGMEETING_NOTE, time, null);
    }

    public static Schedule W5Slide(Time time) {
        if (time.getDayOfWeek() != DayOfWeek.FRIDAY) {
            throw new IllegalArgumentException("W5 Slide should be on Friday");
        }
        if (time.getPeriod() != Time.Period.AFTERNOON) {
            throw new IllegalArgumentException("W5 Slide should be in the afternoon");
        }

        return new Schedule(Type.W5MEETING_SLIDE, time, null);
    }

    public static Schedule W5Note(Time time) {
        if (time.getDayOfWeek() != DayOfWeek.FRIDAY) {
            throw new IllegalArgumentException("W5 Note should be on Friday");
        }
        if (time.getPeriod() != Time.Period.AFTERNOON) {
            throw new IllegalArgumentException("W5 Note should be in the afternoon");
        }

        return new Schedule(Type.W5MEETING_NOTE, time, null);
    }

    public static Schedule Jingfu(Time time) {
        if (time.getDayOfWeek() != DayOfWeek.TUESDAY) {
            throw new IllegalArgumentException("Jingfu should be on Tuesday");
        }
        if (time.getPeriod() != Time.Period.AFTERNOON) {
            throw new IllegalArgumentException("Jingfu should be in the afternoon");
        }

        return new Schedule(Type.JINGFUMEETING, time, null);
    }

    public static Schedule OPD(Time time, Person assignee) {
        if (assignee == null) {
            throw new IllegalArgumentException("OPD requires an assignee");
        }

        return new Schedule(Type.OPD, time, assignee);
    }

    public Type getType() {
        return this.type;
    }

    public Time getTime() {
        return this.time;
    }

    @PlanningVariable(valueRangeProviderRefs = {"availablePerson"})
    public Person getAssignee() {
        return this.assignee;
    }

    public void setAssignee(Person assignee) {
        this.assignee = assignee;
    }
}
