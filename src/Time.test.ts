import { DateTime } from 'luxon'
import Time, { daysInMonth, getTimes, Period, RepeatType, WeekDay, workingDays, workingWeekDays } from './Time';

expect.extend({
    toDateTimeEqual(received: DateTime, actual: DateTime) {
        const pass = received.equals(actual);
        if (pass) {
            return {
                message: () => `expected ${ received } not to equal ${ actual }`,
                pass: true
            }
        } else {
            return {
                message: () => `expected ${ received } to equal ${ actual }`,
                pass: false
            }
        }
    },
    sameDaysAs(received: Array<DateTime>, actual: Array<DateTime>) {
        let pass = received.length === actual.length;
        if (!pass) {
            return {
                message: () => `expected length of ${ received } to equal ${ actual }`,
                pass: false
            }
        }

        for (let i = 0; i < received.length; i++) {
            pass = pass && received[i].equals(actual[i])
        }
        if (pass) {
            return {
                message: () => `expected ${ received } not to equal ${ actual }`,
                pass: true
            }
        } else {
            return {
                message: () => `expected ${ received } to equal ${ actual }`,
                pass: false
            }
        }
    }
});

describe('daysInMonth', () => {
    test('Returns every day in a month', () => {
        const days = [
            DateTime.fromISO('2019-05-01'),
            DateTime.fromISO('2019-05-02'),
            DateTime.fromISO('2019-05-03'),
            DateTime.fromISO('2019-05-04'),
            DateTime.fromISO('2019-05-05'),
            DateTime.fromISO('2019-05-06'),
            DateTime.fromISO('2019-05-07'),
            DateTime.fromISO('2019-05-08'),
            DateTime.fromISO('2019-05-09'),
            DateTime.fromISO('2019-05-10'),
            DateTime.fromISO('2019-05-11'),
            DateTime.fromISO('2019-05-12'),
            DateTime.fromISO('2019-05-13'),
            DateTime.fromISO('2019-05-14'),
            DateTime.fromISO('2019-05-15'),
            DateTime.fromISO('2019-05-16'),
            DateTime.fromISO('2019-05-17'),
            DateTime.fromISO('2019-05-18'),
            DateTime.fromISO('2019-05-19'),
            DateTime.fromISO('2019-05-20'),
            DateTime.fromISO('2019-05-21'),
            DateTime.fromISO('2019-05-22'),
            DateTime.fromISO('2019-05-23'),
            DateTime.fromISO('2019-05-24'),
            DateTime.fromISO('2019-05-25'),
            DateTime.fromISO('2019-05-26'),
            DateTime.fromISO('2019-05-27'),
            DateTime.fromISO('2019-05-28'),
            DateTime.fromISO('2019-05-29'),
            DateTime.fromISO('2019-05-30'),
            DateTime.fromISO('2019-05-31')
        ];
        expect(daysInMonth(2019, 5)).toEqual(days);
    });
});

describe('workingDays', () => {
    test('Only return week days', () => {
        const days = [
            DateTime.fromISO('2019-05-01'),
            DateTime.fromISO('2019-05-02'),
            DateTime.fromISO('2019-05-03'),
            DateTime.fromISO('2019-05-06'),
            DateTime.fromISO('2019-05-07'),
            DateTime.fromISO('2019-05-08'),
            DateTime.fromISO('2019-05-09'),
            DateTime.fromISO('2019-05-10'),
            DateTime.fromISO('2019-05-13'),
            DateTime.fromISO('2019-05-14'),
            DateTime.fromISO('2019-05-15'),
            DateTime.fromISO('2019-05-16'),
            DateTime.fromISO('2019-05-17'),
            DateTime.fromISO('2019-05-20'),
            DateTime.fromISO('2019-05-21'),
            DateTime.fromISO('2019-05-22'),
            DateTime.fromISO('2019-05-23'),
            DateTime.fromISO('2019-05-24'),
            DateTime.fromISO('2019-05-27'),
            DateTime.fromISO('2019-05-28'),
            DateTime.fromISO('2019-05-29'),
            DateTime.fromISO('2019-05-30'),
            DateTime.fromISO('2019-05-31')
        ];
        expect(workingDays(2019, 5)).sameDaysAs(days);
    })
});

describe('workingWeekDays', () => {
    test('Only return the specific weekdays', () => {
        const days = [
            DateTime.fromISO('2019-05-01'),
            DateTime.fromISO('2019-05-08'),
            DateTime.fromISO('2019-05-15'),
            DateTime.fromISO('2019-05-22'),
            DateTime.fromISO('2019-05-29'),
        ];
        expect(workingWeekDays(2019, 5, 3)).sameDaysAs(days);
    })
});

describe('getTimes', () => {
    test('returns the same time wrapped in Array for At repeat type', () => {
        const time = new Time(DateTime.fromISO('2019-05-01'), Period.Morning);
        expect(getTimes(2019, 5, { type: RepeatType.At, date: 1, period: Period.Morning })).toEqual([time])
    });

    test('returns specific even weekdays for EvenWeek repeat type', () => {
        const times = [
            new Time(DateTime.fromISO('2019-05-14'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-28'), Period.Afternoon),
        ];
        expect(getTimes(2019, 5, {
            type: RepeatType.EvenWeek,
            weekday: WeekDay.Tuesday,
            period: Period.Afternoon
        })).toEqual(times)
    });

    test('returns specific odd weekdays for OddWeek repeat type', () => {
        const times = [
            new Time(DateTime.fromISO('2019-05-06'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-20'), Period.Morning),
        ];
        expect(getTimes(2019, 5, {
            type: RepeatType.OddWeek,
            weekday: WeekDay.Monday,
            period: Period.Morning
        })).toEqual(times)
    });

    test('returns specific weekdays for Week repeat type', () => {
        const times = [
            new Time(DateTime.fromISO('2019-05-01'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-08'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-15'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-22'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-29'), Period.Morning),
        ];
        expect(getTimes(2019, 5, {
            type: RepeatType.Week,
            weekday: WeekDay.Wednesday,
            period: Period.Morning
        })).toEqual(times)
    });

    test('returns all working days with specific period for Day repeat type', () => {
        const times = [
            new Time(DateTime.fromISO('2019-05-01'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-02'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-03'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-06'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-07'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-08'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-09'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-10'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-13'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-14'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-15'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-16'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-17'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-20'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-21'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-22'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-23'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-24'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-27'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-28'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-29'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-30'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-31'), Period.Afternoon),
        ];
        expect(getTimes(2019, 5, {
            type: RepeatType.Day,
            period: Period.Afternoon
        })).toEqual(times)
    });

    test('returns all periods for Period repeat type', () => {
        const times = [
            new Time(DateTime.fromISO('2019-05-01'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-01'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-02'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-02'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-03'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-03'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-06'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-06'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-07'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-07'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-08'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-08'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-09'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-09'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-10'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-10'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-13'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-13'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-14'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-14'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-15'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-15'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-16'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-16'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-17'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-17'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-20'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-20'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-21'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-21'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-22'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-22'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-23'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-23'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-24'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-24'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-27'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-27'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-28'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-28'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-29'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-29'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-30'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-30'), Period.Afternoon),
            new Time(DateTime.fromISO('2019-05-31'), Period.Morning),
            new Time(DateTime.fromISO('2019-05-31'), Period.Afternoon),
        ];
        expect(getTimes(2019, 5, {
            type: RepeatType.Period,
        })).toEqual(times)
    });


});
