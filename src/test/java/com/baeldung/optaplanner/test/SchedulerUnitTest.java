package com.baeldung.optaplanner.test;

import com.baeldung.optaplanner.*;
import com.baeldung.optaplanner.Person.Gender;
import com.baeldung.optaplanner.Schedule.Type;
import com.baeldung.optaplanner.Time.Period;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.core.config.Configurator;
import org.apache.logging.log4j.core.config.DefaultConfiguration;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;

import java.io.IOException;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SuppressWarnings("WeakerAccess")
public class SchedulerUnitTest {

    @BeforeAll
    public static void setUp() {
        Configurator.initialize(new DefaultConfiguration());
        Configurator.setRootLevel(Level.INFO);
    }

    @Test
    public void test_createTime() {
        Time time = Time.of(2019, 5, 1, Period.Morning);
        assertNotNull(time);
        assertEquals((int) time.getDate(), 1);
        assertEquals(time.getDayOfWeek(), DayOfWeek.WEDNESDAY);
        assertEquals(time.getPeriod(), Period.valueOf("Morning"));
    }

    @Test
    void test_compareTime1() {
        Time t1 = Time.of(2019, 5, 1, Period.Morning);
        Time t2 = Time.of(2019, 5, 1, Period.Afternoon);
        assertTrue(t1.compareTo(t2) < 0);
    }

    @Test
    void test_compareTime2() {
        Time t1 = Time.of(2019, 5, 1, Period.Morning);
        Time t2 = Time.of(2019, 5, 1, Period.Morning);
        assertTrue(t1.compareTo(t2) == 0);
    }

    @Test
    void test_compareTime3() {
        Time t1 = Time.of(2019, 5, 3, Period.Morning);
        Time t2 = Time.of(2019, 5, 1, Period.Afternoon);
        assertTrue(t1.compareTo(t2) > 0);
    }

    @Test
    public void test_createPerson() {
        Person person =
                Person.repeatedSchedule(
                        "王小明", Gender.Male, 2019, 5, DayOfWeek.TUESDAY, Period.Afternoon);
        assertNotNull(person);
        assertEquals(person.getName(), "王小明");
        assertEquals(person.getGender(), Gender.valueOf("Male"));
    }

    @Test
    public void test_assignSchedule() {
        Person person =
                Person.repeatedSchedule(
                        "王小明", Gender.Male, 2019, 5, DayOfWeek.TUESDAY, Period.Afternoon);
        Schedule sched = new Schedule(Schedule.Type.PAP, Time.of(2019, 5, 1, Period.Morning), null);
        sched.setAssignee(person);
        assertEquals(sched.getAssignee(), person);
    }

    @Test
    public void test_createPAPSchedule() {
        Schedule sched = Schedule.PAP(Time.of(2019, 5, 1, Period.Morning));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.PAP);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.Morning));
    }

    @Test
    public void test_createMorningSlideSchedule() {
        Schedule sched = Schedule.MorningSlide(Time.of(2019, 5, 1, Period.Morning));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.MorningSlide);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.Morning));
    }

    @Test
    public void test_createMorningSlideScheduleThrow() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.MorningSlide(Time.of(2019, 5, 1, Period.Afternoon)));
    }

    @Test
    public void test_createMorningNoteSchedule() {
        Schedule sched = Schedule.MorningNote(Time.of(2019, 5, 1, Period.Morning));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.MorningNote);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.Morning));
    }

    @Test
    public void test_createMorningNoteScheduleThrow() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.MorningNote(Time.of(2019, 5, 1, Period.Afternoon)));
    }

    @Test
    public void test_createW5SlideSchedule() {
        Schedule sched = Schedule.W5Slide(Time.of(2019, 5, 3, Period.Afternoon));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.W5Slide);
        assertEquals(sched.getTime(), Time.of(2019, 5, 3, Period.Afternoon));
    }

    @Test
    public void test_createW5SlideScheduleThrowDayOfWeek() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.W5Slide(Time.of(2019, 5, 1, Period.Afternoon)));
    }

    @Test
    public void test_createW5SlideScheduleThrowPeriod() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.W5Slide(Time.of(2019, 5, 3, Period.Morning)));
    }

    @Test
    public void test_createW5NoteSchedule() {
        Schedule sched = Schedule.W5Note(Time.of(2019, 5, 3, Period.Afternoon));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.W5Note);
        assertEquals(sched.getTime(), Time.of(2019, 5, 3, Period.Afternoon));
    }

    @Test
    public void test_createW5NoteScheduleThrowDayOfWeek() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.W5Note(Time.of(2019, 5, 1, Period.Afternoon)));
    }

    @Test
    public void test_createW5NoteScheduleThrowPeriod() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.W5Note(Time.of(2019, 5, 3, Period.Morning)));
    }

    @Test
    public void test_createJingfuSchedule() {
        Schedule sched = Schedule.Jingfu(Time.of(2019, 5, 7, Period.Afternoon));
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.Jingfu);
        assertEquals(sched.getTime(), Time.of(2019, 5, 7, Period.Afternoon));
    }

    @Test
    public void test_createJingfuScheduleThrowDayOfWeek() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.Jingfu(Time.of(2019, 5, 1, Period.Afternoon)));
    }

    @Test
    public void test_createJingfuScheduleThrowPeriod() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.Jingfu(Time.of(2019, 5, 7, Period.Morning)));
    }

    @Test
    public void test_createOPDSchedule() {
        Person person =
                Person.repeatedSchedule(
                        "王小明", Gender.Male, 2019, 5, DayOfWeek.TUESDAY, Period.Afternoon);
        Schedule sched = Schedule.OPD(Time.of(2019, 5, 1, Period.Afternoon), person);
        assertNotNull(sched);
        assertEquals(sched.getType(), Type.OPD);
        assertEquals(sched.getTime(), Time.of(2019, 5, 1, Period.Afternoon));
    }

    @Test
    public void test_createOPDScheduleThrowAssignee() {
        assertThrows(
                IllegalArgumentException.class,
                () -> Schedule.OPD(Time.of(2019, 5, 1, Period.Afternoon), null));
    }

    @Test
    public void test_compareSchedule1() {
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 1, Period.Afternoon));
        Schedule s2 = Schedule.Jingfu(Time.of(2019, 5, 7, Period.Afternoon));
        assertTrue(s1.compareTo(s2) < 0);
    }

    @Test
    public void test_compareSchedule2() {
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 1, Period.Afternoon));
        Schedule s2 = Schedule.PAP(Time.of(2019, 5, 1, Period.Afternoon));
        assertTrue(s1.compareTo(s2) == 0);
    }

    @Test
    public void test_compareSchedule3() {
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 7, Period.Afternoon));
        Schedule s2 = Schedule.Jingfu(Time.of(2019, 5, 7, Period.Afternoon));
        assertTrue(s1.compareTo(s2) < 0);
    }

    @Test
    public void test_compareSchedule4() {
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 1, Period.Afternoon));
        Schedule s2 = Schedule.PAP(Time.of(2019, 5, 1, Period.Morning));
        assertTrue(s1.compareTo(s2) > 0);
    }

    @Test
    public void test_createSchedulePlan() {
        List<Person> persons = new ArrayList<>();
        persons.add(
                Person.repeatedSchedule(
                        "王小明", Gender.Male, 2019, 5, DayOfWeek.TUESDAY, Period.Afternoon));

        List<Schedule> schedules = new ArrayList<>();
        schedules.add(Schedule.PAP(Time.of(2019, 5, 1, Period.Morning)));

        SchedulePlan plan = new SchedulePlan(persons, schedules);
        assertNotNull(plan);
    }

    @Test
    public void test_calculateScore1() {
        List<Schedule> schedules = new ArrayList<>();
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 1, Period.Morning));
        schedules.add(s1);
        Schedule s2 = Schedule.Jingfu(Time.of(2019, 5, 7, Period.Afternoon));
        schedules.add(s2);
        Schedule s3 = Schedule.PAP(Time.of(2019, 5, 1, Period.Morning));
        schedules.add(s3);
        Schedule s4 = Schedule.PAP(Time.of(2019, 5, 1, Period.Morning));
        schedules.add(s4);

        List<Person> persons = new ArrayList<>();
        Person p1 =
                Person.repeatedSchedule(
                        "王小明", Gender.Male, 2019, 5, DayOfWeek.THURSDAY, Period.Afternoon);
        persons.add(p1);
        s3.setAssignee(p1);
        s4.setAssignee(p1);
        Person p2 =
                Person.repeatedSchedule(
                        "陳小美", Gender.Female, 2019, 5, DayOfWeek.THURSDAY, Period.Morning);
        persons.add(p2);

        SchedulePlan plan = new SchedulePlan(persons, schedules);

        ScoreCalculator calculator = new ScoreCalculator();
        HardSoftScore score = (HardSoftScore) calculator.calculateScore(plan);
        assertEquals(-3, score.getHardScore());
        assertEquals(-74, score.getSoftScore());
    }

    @Test
    public void test_calculateScore2() {
        List<Schedule> schedules = new ArrayList<>();
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 1, Period.Morning));
        schedules.add(s1);

        List<Person> persons = new ArrayList<>();
        Person p1 =
                Person.repeatedSchedule(
                        "王小明", Gender.Male, 2019, 5, DayOfWeek.WEDNESDAY, Period.Morning);
        persons.add(p1);
        s1.setAssignee(p1);

        SchedulePlan plan = new SchedulePlan(persons, schedules);

        ScoreCalculator calculator = new ScoreCalculator();
        HardSoftScore score = (HardSoftScore) calculator.calculateScore(plan);
        assertEquals(-1, score.getHardScore());
        assertEquals(-36, score.getSoftScore());
    }

    @Test
    public void test_whenCustomJavaSolver() {
        List<Schedule> schedules = new ArrayList<>();
        Schedule s1 = Schedule.PAP(Time.of(2019, 5, 1, Period.Morning));
        schedules.add(s1);

        List<Person> persons = new ArrayList<>();
        Person p1 =
                Person.repeatedSchedule(
                        "王小明", Gender.Male, 2019, 5, DayOfWeek.FRIDAY, Period.Afternoon);
        persons.add(p1);

        SchedulePlan unsolvedPlan = new SchedulePlan(persons, schedules);
        SolverFactory<SchedulePlan> solverFactory =
                SolverFactory.createFromXmlResource("schedulePlanSolverTestConfiguration.xml");
        Solver<SchedulePlan> solver = solverFactory.buildSolver();
        SchedulePlan solvedPlan = solver.solve(unsolvedPlan);

        assertNotNull(solvedPlan.getScore());
        assertEquals(0, solvedPlan.getScore().getHardScore());
    }

    @Test
    public void test_parseSchedulePlan() {
        String input = "{\n" +
                "  \"schedules\":[\n" +
                "    {\n" +
                "      \"type\":\"其他\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-03\",\n" +
                "        \"period\":\"下午\"\n" +
                "      },\n" +
                "      \"assignee\":\"孫小美\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\":\"其他\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-10\",\n" +
                "        \"period\":\"下午\"\n" +
                "      },\n" +
                "      \"assignee\":\"孫小美\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\":\"其他\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-17\",\n" +
                "        \"period\":\"下午\"\n" +
                "      },\n" +
                "      \"assignee\":\"孫小美\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\":\"其他\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-24\",\n" +
                "        \"period\":\"下午\"\n" +
                "      },\n" +
                "      \"assignee\":\"孫小美\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\":\"景福\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-04\",\n" +
                "        \"period\":\"下午\"\n" +
                "      }\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\":\"景福\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-11\",\n" +
                "        \"period\":\"下午\"\n" +
                "      }\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\":\"景福\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-18\",\n" +
                "        \"period\":\"下午\"\n" +
                "      }\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\":\"景福\",\n" +
                "      \"time\":{\n" +
                "        \"localDate\":\"2019-06-25\",\n" +
                "        \"period\":\"下午\"\n" +
                "      }\n" +
                "    }\n" +
                "  ],\n" +
                "  \"persons\":[\n" +
                "    {\n" +
                "      \"name\":\"孫小美\",\n" +
                "      \"gender\":\"女\",\n" +
                "      \"role\":\"小 CR\"\n" +
                "    }\n" +
                "  ]\n" +
                "}";
        ObjectMapper mapper = new ObjectMapper();
        try {
            SchedulePlan plan = mapper.readValue(input, SchedulePlan.class);
            System.out.println(plan.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
