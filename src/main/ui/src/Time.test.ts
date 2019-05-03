import {DateTime} from 'luxon'
import Time from './Time';

expect.extend({
    toDateTimeEqual(received: DateTime, actual: DateTime) {
        const pass = received.equals(actual);
        if (pass) {
            return {
                message: () => `expected ${received} not to equal ${actual}`,
                pass: true
            }
        } else {
            return {
                message: () => `expected ${received} to equal ${actual}`,
                pass: false
            }
        }
    },
    sameDaysAs(received: Array<DateTime>, actual: Array<DateTime>) {
        let pass = received.length === actual.length;
        if (!pass) {
            return {
                message: () => `expected length of ${received} to equal ${actual}`,
                pass: false
            }
        }

        for (let i = 0; i < received.length; i++) {
            pass = pass && received[i].equals(actual[i])
        }
        if (pass) {
            return {
                message: () => `expected ${received} not to equal ${actual}`,
                pass: true
            }
        } else {
            return {
                message: () => `expected ${received} to equal ${actual}`,
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
        expect(Time.daysInMonth(2019, 5)).toEqual(days);
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
        expect(Time.workingDays(2019, 5)).sameDaysAs(days);
    })
});
