package com.baeldung.optaplanner.test;

import com.baeldung.optaplanner.Person;
import com.baeldung.optaplanner.Person.Gender;
import com.baeldung.optaplanner.Time;
import com.baeldung.optaplanner.Time.Period;
import com.baeldung.optaplanner.ScoreCalculator;
import com.baeldung.optaplanner.Schedule;
import com.baeldung.optaplanner.Schedule.Type;
import com.baeldung.optaplanner.SchedulePlan;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.Score;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

public class SchedulerUnitTest {

    @Test
    public void test_createTime() {
        Time time = Time.of(2019, 5, 1, Period.MORNING);
        assertNotNull(time);
        assertEquals((int) time.getDate(), 1);
        assertEquals(time.getDayOfWeek(), DayOfWeek.WEDNESDAY);
        assertEquals(time.getPeriod(), Period.valueOf("MORNING"));
    }

    @Test
    public void test_createPerson() {
        Person person = new Person("王小明", Gender.MALE, DayOfWeek.TUESDAY, Period.AFTERNOON);
        assertNotNull(person);
        assertEquals(person.getName(), "王小明");
        assertEquals(person.getGender(), Gender.valueOf("MALE"));
    }

    @Test
    public void test_assignSchedule() {
        Person person = new Person("王小明", Gender.MALE, DayOfWeek.TUESDAY, Period.AFTERNOON);
        Schedule sched = new Schedule(Schedule.Type.JINGFUMEETING, Time.of(2019, 5, 1, Period.MORNING), null);
        sched.setAssignee(person);
        assertEquals(sched.getAssignee(), person);
    }

    @Test
    public void test_createPAPSchedule() {
        Schedule sched = Schedule.PAP(Time.of(2019, 5, 1, Period.MORNING));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.PAP);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.MORNING));
    }

    @Test
    public void test_createMorningSlideSchedule() {
        Schedule sched = Schedule.MorningSlide(Time.of(2019, 5, 1, Period.MORNING));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.MORNINGMEETING_SLIDE);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.MORNING));
    }

    @Test
    public void test_createMorningSlideScheduleThrow() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.MorningSlide(Time.of(2019, 5, 1, Period.AFTERNOON))
        );
    }

    @Test
    public void test_createMorningNoteSchedule() {
        Schedule sched = Schedule.MorningNote(Time.of(2019, 5, 1, Period.MORNING));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.MORNINGMEETING_NOTE);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.MORNING));
    }

    @Test
    public void test_createMorningNoteScheduleThrow() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.MorningNote(Time.of(2019, 5, 1, Period.AFTERNOON))
        );
    }

    @Test
    public void test_createW5SlideSchedule() {
        Schedule sched = Schedule.W5Slide(Time.of(2019, 5, 3, Period.AFTERNOON));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.W5MEETING_SLIDE);
        assertEquals(sched.getTime(), Time.of(2019, 5, 3, Period.AFTERNOON));
    }

    @Test
    public void test_createW5SlideScheduleThrowDayOfWeek() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.W5Slide(Time.of(2019, 5, 1, Period.AFTERNOON))
        );
    }

    @Test
    public void test_createW5SlideScheduleThrowPeriod() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.W5Slide(Time.of(2019, 5, 3, Period.MORNING))
        );
    }

    @Test
    public void test_createW5NoteSchedule() {
        Schedule sched = Schedule.W5Note(Time.of(2019, 5, 3, Period.AFTERNOON));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.W5MEETING_NOTE);
        assertEquals(sched.getTime(), Time.of(2019, 5, 3, Period.AFTERNOON));
    }

    @Test
    public void test_createW5NoteScheduleThrowDayOfWeek() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.W5Note(Time.of(2019, 5, 1, Period.AFTERNOON))
        );
    }

    @Test
    public void test_createW5NoteScheduleThrowPeriod() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.W5Note(Time.of(2019, 5, 3, Period.MORNING))
        );
    }

    @Test
    public void test_createJingfuSchedule() {
        Schedule sched = Schedule.Jingfu(Time.of(2019, 5, 7, Period.AFTERNOON));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.JINGFUMEETING);
        assertEquals(sched.getTime(), Time.of(2019, 5, 7, Period.AFTERNOON));
    }

    @Test
    public void test_createJingfuScheduleThrowDayOfWeek() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.Jingfu(Time.of(2019, 5, 1, Period.AFTERNOON))
        );
    }

    @Test
    public void test_createJingfuScheduleThrowPeriod() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.Jingfu(Time.of(2019, 5, 7, Period.MORNING))
        );
    }

    @Test
    public void test_createOPDSchedule() {
        Person person = new Person("王小明", Gender.MALE, DayOfWeek.TUESDAY, Period.AFTERNOON);
        Schedule sched = Schedule.OPD(Time.of(2019, 5, 1, Period.AFTERNOON), person);
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.OPD);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.AFTERNOON));
    }

    @Test
    public void test_createOPDScheduleThrowAssignee() {
        assertThrows(
            IllegalArgumentException.class,
            () -> Schedule.OPD(Time.of(2019, 5, 1, Period.AFTERNOON), null)
        );
    }

    @Test
    public void test_createSchedulePlan() {
        List<Person> persons = new ArrayList<>();
        persons.add(new Person("王小明", Gender.MALE, DayOfWeek.TUESDAY, Period.AFTERNOON));

        List<Schedule> schedules = new ArrayList<>();
        schedules.add(Schedule.PAP(Time.of(2019, 5, 1, Period.MORNING)));

        SchedulePlan plan = new SchedulePlan(persons, schedules);
        assertNotNull(plan);
    }

    @Test
    public void test_calculateScore() {
        List<Schedule> schedules = new ArrayList<>();
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 1, Period.MORNING));
        schedules.add(s1);
        Schedule s2 = Schedule.Jingfu(Time.of(2019, 5, 7, Period.AFTERNOON));
        schedules.add(s2);
        Schedule s3 = Schedule.PAP(Time.of(2019, 5, 1, Period.MORNING));
        schedules.add(s3);
        Schedule s4 = Schedule.PAP(Time.of(2019, 5, 1, Period.MORNING));
        schedules.add(s4);
        
        List<Person> persons = new ArrayList<>();
        Person p1 = new Person("王小明", Gender.MALE, DayOfWeek.THURSDAY, Period.AFTERNOON);
        persons.add(p1);
        s3.setAssignee(p1);
        s4.setAssignee(p1);
        Person p2 = new Person("陳小美", Gender.FEMALE, DayOfWeek.THURSDAY, Period.MORNING);
        persons.add(p2);

        SchedulePlan plan = new SchedulePlan(persons, schedules);

        ScoreCalculator calculator = new ScoreCalculator();
        Score score = calculator.calculateScore(plan);
        System.out.print(score.toString());
        assertEquals(HardSoftScore.valueOf(-3, 0), score);
    }
}
