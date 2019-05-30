import React, { SyntheticEvent, useEffect, useState } from "react";
import { noop } from "./util";
import { Period, Repeat, RepeatType, WeekDay, weekDayMapping, workingDays } from "./Time";
import { DropdownProps, Form } from "semantic-ui-react";
import isEqual from "lodash.isequal";

type RepeatedScheduleDetailEditProps = {
    year: number,
    month: number,
    repeatType?: RepeatType,
    value?: Repeat,
    onChange?: (repeat: Repeat | undefined) => void
}
export const RepeatedScheduleDetailEdit: React.FC<RepeatedScheduleDetailEditProps> =
    ({ year, month, repeatType, value, onChange = noop }) => {
        const periodOptions = Object.keys(Period).map(key => {
            return { key: key, text: Period[key as keyof typeof Period], value: key }
        });
        const weekDayOptions = Object.keys(WeekDay).filter(key => isNaN(Number(key))).map(weekDay => {
            const weekDayValue = WeekDay[weekDay as keyof typeof WeekDay];
            return { key: weekDay, text: weekDayMapping[weekDayValue], value: weekDayValue }
        });
        const dateOptions = workingDays(year, month).map(dateTime => {
            const day = dateTime.day;
            const weekDay = dateTime.setLocale('zh-TW').weekdayShort.slice(1);
            return { key: day, text: `${ dateTime.month }/${ day } (${ weekDay })`, value: day }
        });

        const [periodKey, _setPeriodKey] = useState<keyof typeof Period>();
        const setPeriodKey = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            _setPeriodKey(data.value as keyof typeof Period);
        };
        const [weekDay, _setWeekDay] = useState<WeekDay>();
        const setWeekDay = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            _setWeekDay(data.value as WeekDay);
        };
        const [date, _setDate] = useState<number>();
        const setDate = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            if (typeof data.value === 'number') {
                _setDate(data.value);
            }
        };

        let node = <noscript/>;
        let repeat: Repeat | undefined = undefined;
        if (repeatType === RepeatType.At) {
            node = (
                <>
                    <Form.Select compact key="date" placeholder="請選擇日期" options={ dateOptions }
                                 value={ date }
                                 onChange={ setDate }/>
                    <Form.Select compact key="period" placeholder="請選擇時段" options={ periodOptions }
                                 value={ periodKey } onChange={ setPeriodKey }/>
                </>
            );
            if (date !== undefined && periodKey !== undefined) {
                repeat = { type: repeatType, date: date, period: Period[periodKey] }
            }
        } else if (repeatType === RepeatType.EvenWeek) {
            node = (
                <>
                    <Form.Select compact key="weekDay" placeholder="請選擇星期幾" options={ weekDayOptions }
                                 value={ weekDay }
                                 onChange={ setWeekDay }/>
                    <Form.Select compact key="period" placeholder="請選擇時段" options={ periodOptions }
                                 value={ periodKey } onChange={ setPeriodKey }/>
                </>
            );
            if (weekDay !== undefined && periodKey !== undefined) {
                repeat = { type: repeatType, weekday: weekDay, period: Period[periodKey] }
            }
        } else if (repeatType === RepeatType.OddWeek) {
            node = (
                <>
                    <Form.Select compact key="weekDay" placeholder="請選擇星期幾" options={ weekDayOptions }
                                 value={ weekDay }
                                 onChange={ setWeekDay }/>
                    <Form.Select compact key="period" placeholder="請選擇時段" options={ periodOptions }
                                 value={ periodKey } onChange={ setPeriodKey }/>
                </>
            );
            if (weekDay !== undefined && periodKey !== undefined) {
                repeat = { type: repeatType, weekday: weekDay, period: Period[periodKey] }
            }
        } else if (repeatType === RepeatType.Week) {
            node = (
                <>
                    <Form.Select compact key="weekDay" placeholder="請選擇星期幾" options={ weekDayOptions }
                                 value={ weekDay }
                                 onChange={ setWeekDay }/>
                    <Form.Select compact key="period" placeholder="請選擇時段" options={ periodOptions }
                                 value={ periodKey } onChange={ setPeriodKey }/>
                </>
            );
            if (weekDay !== undefined && periodKey !== undefined) {
                repeat = { type: repeatType, weekday: weekDay, period: Period[periodKey] }
            }
        } else if (repeatType === RepeatType.Day) {
            node = (
                <Form.Select compact key="period" placeholder="請選擇時段" options={ periodOptions }
                             value={ periodKey } onChange={ setPeriodKey }/>
            );
            if (periodKey !== undefined) {
                repeat = { type: repeatType, period: Period[periodKey] }
            }
        } else if (repeatType === RepeatType.Period) {
            repeat = { type: repeatType };
        }

        useEffect(() => {
            if (!isEqual(repeat, value)) {
                onChange(repeat)
            }
        });
        return node;
    };