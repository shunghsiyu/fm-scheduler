package com.baeldung.optaplanner;

public class Schedule {

    public enum Type {
        PAP,
        MORNINGMEETING_SLIDE,
        MORNINGMEETING_NOTE,
        W5MEETING_SLIDE,
        W5MEETING_NOTE,
        JINGFUMEETING
    }

    private Type type;
    private Time time;
    private Person assignee;

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
        if (time.getDayOfWeek() != 5) {
            throw new IllegalArgumentException("W5 Slide should be on weekday 5");
        }
        if (time.getPeriod() != Time.Period.AFTERNOON) {
            throw new IllegalArgumentException("W5 Slide should be in the afternoon");
        }

        return new Schedule(Type.W5MEETING_SLIDE, time, null);
    }

    public static Schedule W5Note(Time time) {
        if (time.getDayOfWeek() != 5) {
            throw new IllegalArgumentException("W5 Note should be on weekday 5");
        }
        if (time.getPeriod() != Time.Period.AFTERNOON) {
            throw new IllegalArgumentException("W5 Note should be in the afternoon");
        }

        return new Schedule(Type.W5MEETING_NOTE, time, null);
    }

    public static Schedule Jingfu(Time time) {
        if (time.getDayOfWeek() != 2) {
            throw new IllegalArgumentException("Jingfu should be on weekday 2");
        }
        if (time.getPeriod() != Time.Period.AFTERNOON) {
            throw new IllegalArgumentException("Jingfu should be in the afternoon");
        }

        return new Schedule(Type.JINGFUMEETING, time, null);
    }

    public Type getType() {
        return this.type;
    }

    public Time getTime() {
        return this.time;
    }

    public Person getAssignee() {
        return this.assignee;
    }

    public void setAssignee(Person assignee) {
        this.assignee = assignee;
    }

}
