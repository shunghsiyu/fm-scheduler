package com.baeldung.optaplanner;

import org.optaplanner.core.api.score.Score;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.impl.score.director.easy.EasyScoreCalculator;
import lombok.EqualsAndHashCode;

import java.util.HashSet;

public class ScoreCalculator implements EasyScoreCalculator<SchedulePlan> {

    @EqualsAndHashCode
    public class PersonAtTime {
        private Person person;
        private Time time;

        public PersonAtTime(Person person, Time time) {
            this.person = person;
            this.time = time;
        }

        public Person getPerson() {
            return this.person;
        }

        public Time getTime() {
            return this.time;
        }
    }

    @Override
    public Score calculateScore(SchedulePlan plan) {
        int hardScore = 0;
        int softScore = 0;

        HashSet<PersonAtTime> occupancy = new HashSet<>();
        for (Schedule sched : plan.getScheduleList()) {
            Person person = sched.getAssignee();
            Time time = sched.getTime();
            if(person != null) {
                PersonAtTime occupied = new PersonAtTime(person, time);
                if (occupancy.contains(occupied)) {
                    hardScore += -1;
                } else {
                    occupancy.add(occupied);
                }
            } else {
                hardScore += -1;
            }
        }

        return HardSoftScore.valueOf(hardScore, softScore);
    }
}
