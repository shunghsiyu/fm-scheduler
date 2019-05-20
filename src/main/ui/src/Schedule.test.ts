import Schedule, { RepeatedSchedule, Type } from './Schedule'
import { DateTime } from "luxon";
import Time, { Period, RepeatType } from "./Time";

describe('RepeatedSchedule', () => {
    test('Returns the correct value being repeated', () => {
        const schedules = [
            new Schedule(Type.PAP, new Time(DateTime.fromISO('2019-05-03'), Period.Afternoon)),
            new Schedule(Type.PAP, new Time(DateTime.fromISO('2019-05-17'), Period.Afternoon)),
            new Schedule(Type.PAP, new Time(DateTime.fromISO('2019-05-31'), Period.Afternoon)),
        ];
        const repeatedSchedule = new RepeatedSchedule(Type.PAP, 2019, 5, {
            type: RepeatType.OddWeek,
            weekday: 5,
            period: Period.Afternoon
        });
        expect(repeatedSchedule.toSchedules()).toEqual(schedules);
    });

});