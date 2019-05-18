import React, { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import {
    Accordion,
    Card,
    Container,
    DropdownProps,
    Form,
    Header,
    Icon,
    InputOnChangeData,
    Segment,
    Table
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Person, { Gender, Role } from './Person'
import { RepeatedSchedule, Type } from "./Schedule"
import { Period, Repeat, RepeatType, WeekDay, weekDayMapping, workingDays } from "./Time"
import isEqual from "lodash.isequal"
import { DateTime } from "luxon";

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

const RepeatedScheduleDisplay: React.FC<{ repeatedSchedules: RepeatedSchedule[] }> = ({ repeatedSchedules }) => {
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

type SchedulesEditProps = {
    year: number,
    month: number,
    value: RepeatedSchedule[],
    onChange?: Dispatch<SetStateAction<RepeatedSchedule[]>>
}
const SchedulesEdit: React.FC<SchedulesEditProps> = ({ year, month, value, onChange = Function.prototype }) => {
    const tableRows = value.map((repeatedSchedule, idx) => {
        const { type, repeat } = repeatedSchedule;
        return (
            <Table.Row key={ idx }>
                <Table.Cell>
                    { Object.values(repeat).join(' ') }
                </Table.Cell>
                <Table.Cell>{ type }</Table.Cell>
            </Table.Row>
        );
    });
    return (
        <>
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
            <RepeatedScheduleEdit year={ year } month={ month }
                                  onSubmit={ repeatedSchedule => onChange([repeatedSchedule]) }/>
        </>
    )
};

type RepeatedScheduleEditProps = {
    year: number,
    month: number,
    onSubmit?: Dispatch<SetStateAction<RepeatedSchedule>>
}
const RepeatedScheduleEdit: React.FC<RepeatedScheduleEditProps> = ({ year, month, onSubmit = Function.prototype }) => {
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

    const submitRepeatedSchedule = () => {
        if (repeat !== undefined && typeKey !== undefined) {
            const repeatedSchedule = new RepeatedSchedule(Type[typeKey], year, month, repeat);
            onSubmit(repeatedSchedule)
        }
    };

    return (
        <Form onSubmit={ submitRepeatedSchedule }>
            <Form.Group inline>
                <Form.Select compact key="repeatType" placeholder="請重複頻率" options={ repeatTypeOptions }
                             value={ repeatTypeKey }
                             onChange={ setRepeatTypeKeyOnChange }/>
                <RepeatedScheduleDetailEdit year={ year } month={ month }
                                            repeatType={ repeatTypeKey ? RepeatType[repeatTypeKey] : undefined }
                                            value={ repeat }
                                            onChange={ r => setRepeat(r) }/>
                <label>要</label>
                <Form.Select compact key="type" placeholder="請選擇工作" options={ typeOptions }
                             value={ typeKey }
                             onChange={ setTypeKeyOnChange }/>
                <Form.Button positive>新增</Form.Button>
            </Form.Group>
        </Form>
    );
};

type RepeatedScheduleDetailEditProps = {
    year: number,
    month: number,
    repeatType?: RepeatType,
    value?: Repeat,
    onChange?: (repeat: Repeat | undefined) => void
}
const RepeatedScheduleDetailEdit: React.FC<RepeatedScheduleDetailEditProps> =
    ({ year, month, repeatType, value, onChange = Function.prototype }) => {
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

const defaultPerson: Person = new Person('王小明', Role.AssistantChiefResident, Gender.Male);
const defaultRepeatedSchedule: RepeatedSchedule =
    new RepeatedSchedule(Type.W5Slide, 2019, 5, { type: RepeatType.Week, weekday: 5, period: Period.Afternoon });

const now = DateTime.local();
const yearOptions = Array(5).fill(1).map((_, i) => {
    const year = i + now.year;
    return { key: year, text: year.toString(), value: year }
});
const monthOptions = Array(12).fill(1).map((_, i) => {
    const month = i + 1;
    return { key: month, text: month.toString(), value: month }
});
type YearMonthChooseProps = { year: number, month: number, setYear: Dispatch<SetStateAction<number>>, setMonth: Dispatch<SetStateAction<number>> }
const YearMonthChooser: React.FC<YearMonthChooseProps> = ({ year, month, setYear, setMonth }) => {
    return (
        <Form>
            <Form.Group inline>
                <Form.Select compact placeholder="請選擇年份" options={ yearOptions } value={ year }
                             onChange={ (event, data) => {
                                 if (typeof data.value === 'number') setYear(data.value)
                             } }/>
                <label>年</label>
                <Form.Select compact placeholder="請選擇月份" options={ monthOptions } value={ month }
                             onChange={ (event, data) => {
                                 if (typeof data.value === 'number') setMonth(data.value)
                             } }/>
                <label>月</label>
            </Form.Group>
        </Form>
    )
};
const App: React.FC = () => {
    const [year, setYear] = useState<number>(now.year);
    const [month, setMonth] = useState<number>((now.plus({ month: 1 })).month);
    const [person, setPerson] = useState<Person>(defaultPerson);
    const [repeatedSchedules, setRepeatedSchedules] = useState<RepeatedSchedule[]>([defaultRepeatedSchedule]);

    return (
        <Container style={ { margin: 20 } }>
            <Segment as="section" basic>
                <Header as="h3">選擇時間</Header>
                <YearMonthChooser year={ year } month={ month } setYear={ setYear } setMonth={ setMonth }/>
            </Segment>
            <Segment as="section" basic>
                <Header as="h3">編輯班次</Header>
                <SchedulesEdit year={ year } month={ month } value={ repeatedSchedules }
                               onChange={ setRepeatedSchedules }/>
                <Accordion>
                    <Accordion.Title active>
                        <Icon name='dropdown'/>
                        顯示詳細班次
                    </Accordion.Title>
                    <Accordion.Content active>
                        <RepeatedScheduleDisplay repeatedSchedules={ repeatedSchedules }/>
                    </Accordion.Content>
                </Accordion>
            </Segment>
            <Segment as="section" basic>
                <Header as="h3">參與者</Header>
                <PersonDisplay person={ person }/>
                <PersonEdit onSubmit={ setPerson }/>
            </Segment>
        </Container>
    );
};

export default App;
