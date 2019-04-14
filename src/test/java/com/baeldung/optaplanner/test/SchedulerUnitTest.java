package com.baeldung.optaplanner.test;

import com.baeldung.optaplanner.Time;
import com.baeldung.optaplanner.Time.Period;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

public class SchedulerUnitTest {

    @Test
    public void test_createTime() {
        Time time = new Time(1, Period.MORNING);
        Assert.assertNotNull(time);
        Assert.assertEquals((int) time.getDate(), 1);
        Assert.assertEquals(time.getPeriod(), Period.valueOf("MORNING"));
    }

}
