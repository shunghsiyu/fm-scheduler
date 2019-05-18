import React, { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { Card, Container, DropdownProps, Form, Grid, Header, InputOnChangeData, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Person, { Gender, Role } from './Person'
import { RepeatedSchedule, Type } from "./Schedule"
import { Period, Repeat, RepeatType, WeekDay, weekDayMapping, workingDays } from "./Time"
import isEqual from "lodash.isequal"

const YEAR = 2019;
const MONTH = 5;

const PersonDisplay: React.FC<{ person: Person }> = props => {
    return (
        <Card>
            <Card.Content>
                <Card.Header>{ props.person.name }
                    <small style={ { padding: '0.5em' } }>({ props.person.gender })</small>
                </Card.Header>
                <Card.Meta>{ props.person.role }</Card.Meta>
            </Card.Content>
        </Card>
    );
};

const PersonEdit: React.FC<{ onSubmit: Dispatch<SetStateAction<Person>> }> = props => {
    const roleOptions = Object.keys(Role).map(role => {
        return { key: role, text: Role[role as keyof typeof Role], value: role }
    });
    const genderOptions = Object.keys(Gender).map(gender => {
        return { key: gender, text: Gender[gender as keyof typeof Gender], value: gender }
    });

    const [store, setStore] = useState<{ name?: string, role?: Role, gender?: Gender }>({});
    const setName = (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
        setStore({ ...store, name: data.value });
    };
    const name = store.name ? store.name : "";
    const setGender = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
        setStore({ ...store, gender: Gender[data.value as keyof typeof Gender] });
    };
    const setRole = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
        setStore({ ...store, role: Role[data.value as keyof typeof Role] });
    };
    const addPerson = () => {
        if (store.name && store.role && store.gender) {
            props.onSubmit(new Person(store.name, store.role, store.gender));
        }
    };

    return (
        <Card>
            <Card.Content>
                <Card.Header>新增人員</Card.Header>
            </Card.Content>
            <Card.Content>
                <Form onSubmit={ addPerson }>
                    <Form.Input label="姓名" placeholder="請輸入姓名" required value={ name }
                                onChange={ setName }/>
                    <Form.Select label="性別" placeholder="請選擇性別" required options={ genderOptions }
                                 onChange={ setGender }/>
                    <Form.Select label="身份" placeholder="請選擇身份" required options={ roleOptions }
                                 onChange={ setRole }/>
                    <Form.Button positive>新增</Form.Button>
                </Form>
            </Card.Content>
        </Card>
    );
};

const RepeatedScheduleDisplay: React.FC = () => {
    const schedules = repeatedSchedules.flatMap(repeatedSchedule => repeatedSchedule.toSchedules());
    const tableRows = schedules.map((schedule, idx) => {
        const { type, time } = schedule;
        return (
            <Table.Row key={ idx }>
                <Table.Cell>{ time.dateStr() }
                    <small> { time.period }</small>
                </Table.Cell>
                <Table.Cell>{ type }</Table.Cell>
            </Table.Row>
        );
    });
    return (
        <Table singleLine>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>時間</Table.HeaderCell>
                    <Table.HeaderCell>工作</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                { tableRows }
            </Table.Body>
        </Table>
    )
};

const RepeatedScheduleEdit: React.FC = () => {
    const repeatTypeOptions = Object.keys(RepeatType).map(key => {
        return { key: key, text: RepeatType[key as keyof typeof RepeatType], value: key }
    });
    const typeOptions = Object.keys(Type).map(key => {
        return { key: key, text: Type[key as keyof typeof Type], value: key }
    });

    const [repeatTypeKey, _setRepeatTypeKey] = useState<keyof typeof RepeatType>();
    const setRepeatTypeKeyOnChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        _setRepeatTypeKey(data.value as keyof typeof RepeatType)
    };
    const [typeKey, _setTypeKey] = useState<keyof typeof Type>();
    const setTypeKeyOnChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        _setTypeKey(data.value as keyof typeof Type)
    };
    const [repeat, setRepeat] = useState<Repeat>();

    return (
        <Form>
            <Form.Select key="repeatType" label="重複" placeholder="請重複頻率" required options={ repeatTypeOptions }
                         value={ repeatTypeKey }
                         onChange={ setRepeatTypeKeyOnChange }/>
            <RepeatedScheduleDetailEdit repeatType={ repeatTypeKey ? RepeatType[repeatTypeKey] : undefined }
                                        value={ repeat }
                                        onChange={ r => setRepeat(r) }/>
            <Form.Select key="type" label="工作" placeholder="請選擇工作" required options={ typeOptions } value={ typeKey }
                         onChange={ setTypeKeyOnChange }/>
        </Form>
    );
};

type RepeatedScheduleDetailEditProps = { repeatType?: RepeatType, value?: Repeat, onChange?: (repeat: Repeat | undefined) => void }
const RepeatedScheduleDetailEdit: React.FC<RepeatedScheduleDetailEditProps> = ({
                                                                                   repeatType, value, onChange = () => {
    }
                                                                               }) => {
    const periodOptions = Object.keys(Period).map(key => {
        return { key: key, text: Period[key as keyof typeof Period], value: key }
    });
    const weekDayOptions = Object.keys(WeekDay).filter(key => isNaN(Number(key))).map(weekDay => {
        const weekDayValue = WeekDay[weekDay as keyof typeof WeekDay];
        return { key: weekDay, text: weekDayMapping[weekDayValue], value: weekDayValue }
    });
    const dateOptions = workingDays(YEAR, MONTH).map(dateTime => {
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
                <Form.Select key="date" label="日期" placeholder="請選擇日期" required options={ dateOptions } value={ date }
                             onChange={ setDate }/>
                <Form.Select key="period" label="時段" placeholder="請選擇時段" required options={ periodOptions }
                             value={ periodKey } onChange={ setPeriodKey }/>
            </>
        );
        if (date !== undefined && periodKey !== undefined) {
            repeat = { type: repeatType, date: date, period: Period[periodKey] }
        }
    } else if (repeatType === RepeatType.EvenWeek) {
        node = (
            <>
                <Form.Select key="weekDay" label="星期幾" placeholder="請選擇星期幾" required options={ weekDayOptions }
                             value={ weekDay }
                             onChange={ setWeekDay }/>
                <Form.Select key="period" label="時段" placeholder="請選擇時段" required options={ periodOptions }
                             value={ periodKey } onChange={ setPeriodKey }/>
            </>
        );
        if (weekDay !== undefined && periodKey !== undefined) {
            repeat = { type: repeatType, weekday: weekDay, period: Period[periodKey] }
        }
    } else if (repeatType === RepeatType.OddWeek) {
        node = (
            <>
                <Form.Select key="weekDay" label="星期幾" placeholder="請選擇星期幾" required options={ weekDayOptions }
                             value={ weekDay }
                             onChange={ setWeekDay }/>
                <Form.Select key="period" label="時段" placeholder="請選擇時段" required options={ periodOptions }
                             value={ periodKey } onChange={ setPeriodKey }/>
            </>
        );
        if (weekDay !== undefined && periodKey !== undefined) {
            repeat = { type: repeatType, weekday: weekDay, period: Period[periodKey] }
        }
    } else if (repeatType === RepeatType.Week) {
        node = (
            <>
                <Form.Select key="weekDay" label="星期幾" placeholder="請選擇星期幾" required options={ weekDayOptions }
                             value={ weekDay }
                             onChange={ setWeekDay }/>
                <Form.Select key="period" label="時段" placeholder="請選擇時段" required options={ periodOptions }
                             value={ periodKey } onChange={ setPeriodKey }/>
            </>
        );
        if (weekDay !== undefined && periodKey !== undefined) {
            repeat = { type: repeatType, weekday: weekDay, period: Period[periodKey] }
        }
    } else if (repeatType === RepeatType.Day) {
        node = (
            <Form.Select key="period" label="時段" placeholder="請選擇時段" required options={ periodOptions }
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

const defaultPerson: Person = new Person('王小明', Role.AssistantChiefResident, Gender.Male);
const repeatedSchedules: Array<RepeatedSchedule> = [
    new RepeatedSchedule(Type.Jingfu, 2019, 5, { type: RepeatType.At, date: 3, period: Period.Afternoon }),
    new RepeatedSchedule(Type.OPD, 2019, 5, {
        type: RepeatType.EvenWeek,
        weekday: 2,
        period: Period.Morning
    }, defaultPerson),
    new RepeatedSchedule(Type.W5Slide, 2019, 5, { type: RepeatType.Week, weekday: 5, period: Period.Afternoon }),
    new RepeatedSchedule(Type.Other, 2019, 5, { type: RepeatType.Day, period: Period.Morning }),
    new RepeatedSchedule(Type.PAP, 2019, 5, { type: RepeatType.Period }),
];

const App: React.FC = () => {
    const [person, setPerson] = useState<Person>(defaultPerson);

    return (
        <Container style={ { margin: 20 } }>
            <Header as="h3">編輯排班</Header>
            <Grid columns={ 2 }>
                <Grid.Column>
                    <PersonDisplay person={ person }/>
                    <PersonEdit onSubmit={ setPerson }/>
                </Grid.Column>
                <Grid.Column>
                    <RepeatedScheduleEdit/>
                    <RepeatedScheduleDisplay/>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default App;
