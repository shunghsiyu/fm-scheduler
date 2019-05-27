package com.baeldung.optaplanner;

import lombok.ToString;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.drools.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;

import java.util.ArrayList;
import java.util.List;

@PlanningSolution
@ToString
public class SchedulePlan {

    Logger logger = LogManager.getLogger();

    private List<Schedule> schedules;
    private List<Person> persons;
    private HardSoftScore score;

    // Empty constructor is required by OptaPlanner
    @SuppressWarnings("unused")
    public SchedulePlan() {
        this.persons = new ArrayList<>();
        this.schedules = new ArrayList<>();
    }

    public SchedulePlan(List<Person> persons, List<Schedule> schedules) {
        this.persons = persons;
        this.schedules = schedules;
    }

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "availablePersons")
    @SuppressWarnings("WeakerAccess")
    public List<Person> getPersons() {
        return this.persons;
    }

    public void setPersons(List<Person> persons) {
        this.persons = persons;
    }

    @PlanningEntityCollectionProperty
    @SuppressWarnings("WeakerAccess")
    public List<Schedule> getSchedules() {
        return this.schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        this.schedules = schedules;
    }

    @PlanningScore
    public HardSoftScore getScore() {
        return score;
    }

    public void setScore(HardSoftScore score) {
        this.score = score;
    }
}
