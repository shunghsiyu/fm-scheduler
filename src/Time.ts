import { DateTime, Duration } from 'luxon'

const oneDay = Duration.fromObject({ days: 1 });
const oneMonth = Duration.fromObject({ month: 1 });

export function daysInMonth(year: number, month: number): Array<DateTime> {
    const firstDayOfMonth = DateTime.fromObject({ year, month });
    const firstDayOfNextMonth = firstDayOfMonth.plus(oneMonth);
    const arr = [];
    for (let dateTime: DateTime = firstDayOfMonth; dateTime < firstDayOfNextMonth; dateTime = dateTime.plus(oneDay)) {
        arr.push(dateTime)
    }
    return arr;
}

export function workingDays(year: number, month: number): Array<DateTime> {
    const days = daysInMonth(year, month);
    return days.filter(day => 1 <= day.weekday && day.weekday <= 5)
}

export function workingWeekDays(year: number, month: number, weekday: number): Array<DateTime> {
    const days = workingDays(year, month);
    return days.filter(day => day.weekday === weekday)
}

export enum Period {
    Morning = "早上",
    Afternoon = "下午"
}

export default class Time {
    localDate: DateTime;
    period: Period;

    constructor(date: DateTime, period: Period) {
        this.localDate = date.setLocale('zh-TW');
        this.period = period;
    }

    oddWeek(): boolean {
        const dayInMonth = this.localDate.day;
        const weekNum = Math.floor((dayInMonth - 1) / 7) + 1;
        return (weekNum % 2) === 1;
    }

    evenWeek(): boolean {
        return !this.oddWeek();
    }

    dateStr(): string {
        const date = this.localDate;
        const dayOfWeek = date.weekdayShort.slice(1);
        return `${ date.month }/${ date.day } (${ dayOfWeek })`;
    }

    comparesTo(another: Time) {
        let diff = this.localDate.toMillis() - another.localDate.toMillis();
        if (diff === 0) {
            diff = another.period.localeCompare(this.period)
        }
        return diff;
    }

    toJSON(): object {
        return {
            localDate: this.localDate.toISODate(),
            period: this.period,
        }
    }
};

export enum RepeatType {
    At = "特定時間",
    EvenWeek = "每雙週",
    OddWeek = "每單週",
    Week = "每週",
    Day = "每天",
    Period = "每個時段",
}

export enum WeekDay {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
}

export const weekDayMapping = [
    undefined,
    "一",
    "二",
    "三",
    "四",
    "五",
];

export type Repeat =
    { type: RepeatType.At, date: number, period: Period } |
    { type: RepeatType.EvenWeek, weekday: WeekDay, period: Period } |
    { type: RepeatType.OddWeek, weekday: WeekDay, period: Period } |
    { type: RepeatType.Week, weekday: WeekDay, period: Period } |
    { type: RepeatType.Day, period: Period } |
    { type: RepeatType.Period };

export function getTimes(year: number, month: number, repeat: Repeat): Array<Time> {
    const arr = [];
    if (repeat.type === RepeatType.At) {
        const time = new Time(DateTime.local(year, month, repeat.date), repeat.period);
        arr.push(time)
    } else if (repeat.type === RepeatType.Period) {
        for (const dateTime of workingDays(year, month)) {
            for (const period of Object.values(Period)) {
                const time = new Time(dateTime, period);
                arr.push(time)
            }
        }
    } else if (repeat.type === RepeatType.Day) {
        const period = repeat.period;
        for (const dateTime of workingDays(year, month)) {
            const time = new Time(dateTime, period);
            arr.push(time)
        }
    } else {
        const weekday = repeat.weekday;
        const period = repeat.period;
        for (const dateTime of workingWeekDays(year, month, weekday)) {
            const time = new Time(dateTime, period);
            if (repeat.type === RepeatType.OddWeek && time.oddWeek()) {
                arr.push(time)
            } else if (repeat.type === RepeatType.EvenWeek && time.evenWeek()) {
                arr.push(time)
            } else if (repeat.type === RepeatType.Week) {
                arr.push(time)
            }
        }
    }
    return arr
}
