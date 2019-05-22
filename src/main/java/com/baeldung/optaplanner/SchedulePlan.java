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
@ToString(includeFieldNames = true)
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
    public List<Person> getPersonList() {
        return this.persons;
    }

    @PlanningEntityCollectionProperty
    public List<Schedule> getScheduleList() {
        return this.schedules;
    }

    @PlanningScore
    public HardSoftScore getScore() {
        return score;
    }

    public void setScore(HardSoftScore score) {
        this.score = score;
    }
}
