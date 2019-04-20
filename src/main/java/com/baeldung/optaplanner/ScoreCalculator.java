package com.baeldung.optaplanner;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.optaplanner.core.api.score.Score;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.impl.score.director.easy.EasyScoreCalculator;

public class ScoreCalculator implements EasyScoreCalculator<SchedulePlan> {

    Logger logger = LogManager.getLogger();

    @Data
    public class PersonAtTime {
        private final Person person;
        private final Time time;
    }

    @Override
    public Score calculateScore(SchedulePlan plan) {
        int hardScore = 0;
        int softScore = 0;

        Map<Person, Integer> scheduleCount = new HashMap<>();
        Set<PersonAtTime> occupancy = new HashSet<>();

        for (Person person : plan.getPersonList()) {
            for (Schedule sched : person.getSchedules()) {
                Time time = sched.getTime();
                PersonAtTime occupied = new PersonAtTime(person, time);
                occupancy.add(occupied);
                Integer count = scheduleCount.getOrDefault(person, 0) + 1;
                scheduleCount.put(person, count);
            }
        }

        for (Schedule sched : plan.getScheduleList()) {
            Person person = sched.getAssignee();
            Time time = sched.getTime();
            if (person != null) {
                PersonAtTime occupied = new PersonAtTime(person, time);
                if (occupancy.contains(occupied)) {
                    hardScore += -1;
                } else {
                    occupancy.add(occupied);
                }

                PersonAtTime dayOccupied =
                        new PersonAtTime(
                                person, new Time(time.getLocalDate(), time.getPeriod().next()));
                // The person has other schedule that day
                if (occupancy.contains(dayOccupied)) {
                    softScore += -100;
                }

                Integer count = scheduleCount.getOrDefault(person, 0);
                scheduleCount.put(person, count + 1);
            } else {
                hardScore += -1;
            }
        }

        for (Map.Entry<Person, Integer> entry : scheduleCount.entrySet()) {
            Integer count = entry.getValue();
            softScore += -(count * count);
        }

        return HardSoftScore.valueOf(hardScore, softScore);
    }
}
