package com.baeldung.optaplanner.test;

import com.baeldung.optaplanner.Time;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

public class SchedulerUnitTest {


    @Test
    public void test_createTime() {
        Time time = new Time();
        Assert.assertNotNull(time);
    }

}
