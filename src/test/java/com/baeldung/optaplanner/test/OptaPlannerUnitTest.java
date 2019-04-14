package com.baeldung.optaplanner.test;

import com.baeldung.optaplanner.CourseSchedule;
import com.baeldung.optaplanner.Lecture;
import org.junit.Assert;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.apache.log4j.Logger;
import org.apache.log4j.Level;
import org.apache.log4j.BasicConfigurator;
import java.util.Arrays;

public class OptaPlannerUnitTest {

    static CourseSchedule unsolvedCourseSchedule;

    @BeforeAll
    public static void setUp() {
        BasicConfigurator.configure();
        Logger.getRootLogger().setLevel(Level.INFO);

        unsolvedCourseSchedule = new CourseSchedule();

        for(int i = 0; i < 10; i++){
            unsolvedCourseSchedule.getLectureList().add(new Lecture());
        }

        unsolvedCourseSchedule.getPeriodList().addAll(Arrays.asList(new Integer[] { 1, 2, 3 }));
        unsolvedCourseSchedule.getRoomList().addAll(Arrays.asList(new Integer[] { 1, 2 }));
    }

    @Disabled @Test
    public void test_whenCustomJavaSolver() {

        SolverFactory<CourseSchedule> solverFactory = SolverFactory.createFromXmlResource("courseScheduleSolverConfiguration.xml");
        Solver<CourseSchedule> solver = solverFactory.buildSolver();
        CourseSchedule solvedCourseSchedule = solver.solve(unsolvedCourseSchedule);
        solvedCourseSchedule.printCourseSchedule();

        Assert.assertNotNull(solvedCourseSchedule.getScore());
        Assert.assertEquals(-4, solvedCourseSchedule.getScore().getHardScore());
    }

    @Disabled @Test
    public void test_whenDroolsSolver() {

        SolverFactory<CourseSchedule> solverFactory = SolverFactory.createFromXmlResource("courseScheduleSolverConfigDrools.xml");
        Solver<CourseSchedule> solver = solverFactory.buildSolver();
        CourseSchedule solvedCourseSchedule = solver.solve(unsolvedCourseSchedule);
        solvedCourseSchedule.printCourseSchedule();

        Assert.assertNotNull(solvedCourseSchedule.getScore());
        Assert.assertEquals(0, solvedCourseSchedule.getScore().getHardScore());
    }
}
