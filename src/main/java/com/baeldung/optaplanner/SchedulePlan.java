package com.baeldung.optaplanner;

import org.optaplanner.core.api.domain.solution.drools.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;

import java.util.List;

@PlanningSolution
public class SchedulePlan {

    private List<Schedule> schedules;
    private List<Person> persons;
    private HardSoftScore score;

    public SchedulePlan(List<Person> person, List<Schedule> schedules) {
        this.persons = persons;
        this.schedules = schedules;
    }

    @ValueRangeProvider(id = "availablePersons")
    @ProblemFactCollectionProperty
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