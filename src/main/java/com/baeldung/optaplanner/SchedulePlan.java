package com.baeldung.optaplanner;

import java.util.ArrayList;
import java.util.List;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.drools.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@PlanningSolution
public class SchedulePlan {

    Logger logger = LoggerFactory.getLogger("SchedulePlan");

    private List<Schedule> schedules;
    private List<Person> persons;
    private HardSoftScore score;

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
