package com.baeldung.optaplanner.test;

import com.baeldung.optaplanner.Person;
import com.baeldung.optaplanner.Person.Gender;
import com.baeldung.optaplanner.Time;
import com.baeldung.optaplanner.Time.Period;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

public class SchedulerUnitTest {

    @Test
    public void test_createTime() {
        Time time = new Time(1, 3, Period.MORNING);
        Assert.assertNotNull(time);
        Assert.assertEquals((int) time.getDate(), 1);
        Assert.assertEquals((int) time.getDayOfWeek(), 3);
        Assert.assertEquals(time.getPeriod(), Period.valueOf("MORNING"));
    }

    @Test
    public void test_createPerson() {
        Person person = new Person("王小明", Gender.MALE, new Time(null, 2, Period.AFTERNOON));
        Assert.assertNotNull(person);
        Assert.assertEquals(person.getName(), "王小明");
        Assert.assertEquals(person.getGender(), Gender.valueOf("MALE"));
        Assert.assertEquals(person.getOPDTime(), new Time(null, 2, Period.AFTERNOON));
    }

}
