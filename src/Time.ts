import { DateTime, Duration } from 'luxon'

const oneDay = Duration.fromObject({days: 1});
const oneMonth = Duration.fromObject({month: 1});

export function daysInMonth(year: number, month: number): Array<DateTime> {
    const firstDayOfMonth = DateTime.fromObject({year, month});
    const firstDayOfNextMonth = firstDayOfMonth.plus(oneMonth);
    const arr = [];
    for (let day: DateTime = firstDayOfMonth; day < firstDayOfNextMonth; day = day.plus(oneDay)) {
        arr.push(day)
    }
    return arr;
}

export function workingDays(year: number, month: number): Array<DateTime> {
    const days = daysInMonth(year, month);
    return days.filter(day => 1 <= day.weekday && day.weekday <= 5)
}

export enum Period {
    Morning = "早上",
    Afternoon = "下午"
}

export default class Time {
    date: DateTime;
    period: Period;

    constructor(date: DateTime, period: Period) {
        this.date = date.setLocale('zh-TW');
        this.period = period;
    }

    dateStr(): string {
        const date = this.date;
        const dayOfWeek = date.weekdayShort.slice(1);
        return `${ date.month }/${ date.day } (${ dayOfWeek })`;
    }
};
