import React, { ChangeEvent, Dispatch, ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import {
    Accordion,
    Button,
    Card,
    Container,
    Divider,
    DropdownProps,
    Form,
    Grid,
    Header,
    Icon,
    InputOnChangeData,
    Label,
    List,
    Segment,
    Table
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Person, { Gender, Role } from './Person'
import Schedule, { RepeatedSchedule, Type } from "./Schedule"
import { Period, Repeat, RepeatType, WeekDay, weekDayMapping, workingDays } from "./Time"
import isEqual from "lodash.isequal"
import { DateTime } from "luxon";
import { noop, request, saveBlob } from "./util";

type BasicProps = {
    year: number,
    month: number,
}
type PersonSchedule = [Person, RepeatedSchedule[]]

type PersonScheduleOverviewProps = {
    value: PersonSchedule[],
    onChange?: Dispatch<PersonSchedule[]>,
} & BasicProps;
const PersonScheduleOverview: React.FC<PersonScheduleOverviewProps> = ({ year, month, value, onChange = noop }) => {
    const children = value.map(([person, repeatedSchedules], idx) => {
        const deletePerson = () => {
            const newValue = value.slice();
            newValue.splice(idx, 1);
            onChange(newValue);
        };
        const updatePerson: Dispatch<PersonSchedule> = ([newPerson, newRepeatedSchedules]) => {
            const newValue = value.slice();
            newValue.splice(idx, 1, [newPerson, newRepeatedSchedules]);
            onChange(newValue);
        };
        return (
            <PersonScheduleEdit key={ person.name } year={ year } month={ month } person={ person }
                                occupiedSchedules={ repeatedSchedules }
                                onChange={ updatePerson }
                                onDelete={ deletePerson }/>
        );
    });
    return (
        <>
            { children }
            <PersonAdd onSubmit={ newPerson => onChange([...value, [newPerson, []]]) }/>
        </>);
};

type PersonScheduleEditProps = {
    person: Person,
    occupiedSchedules: RepeatedSchedule[],
    onChange?: Dispatch<PersonSchedule>,
    onDelete?: () => void,
} & BasicProps;
const PersonScheduleEdit: React.FC<PersonScheduleEditProps> = ({ year, month, person, occupiedSchedules, onChange = noop, onDelete = noop }) => {
    const setOccupiedSchedules: Dispatch<RepeatedSchedule[]> = newOccupiedSchedules => {
        onChange([person, newOccupiedSchedules]);
    };
    const newOccupiedSchedule: Dispatch<RepeatedSchedule> = (value: RepeatedSchedule) => {
        setOccupiedSchedules([...occupiedSchedules, value])
    };

    const schedulesItem = occupiedSchedules.map((repeatedSchedule, idx) => {
        const repeatStr: string = Object.values(repeatedSchedule.repeat).join(' ');
        const deleteSchedule = () => {
            const newOccupiedSchedules = occupiedSchedules.slice();
            newOccupiedSchedules.splice(idx, 1);
            setOccupiedSchedules(newOccupiedSchedules)
        };
        return (
            <List.Item key={ repeatStr }>
                { repeatStr }
                <Icon name="delete" onClick={ deleteSchedule } style={ { cursor: "pointer", paddingLeft: "0.4em" } }/>
            </List.Item>
        );
    });
    return (
        <Card as="section" fluid>
            <Card.Content>
                <Card.Header>{ person.name }
                    <small style={ { padding: '0.5em' } }>({ person.gender })</small>
                    <Label corner="right"><Icon name="delete" style={ { cursor: "pointer" } }
                                                onClick={ onDelete }/></Label>
                </Card.Header>
                <Card.Meta>{ person.role }</Card.Meta>
            </Card.Content>
            <Card.Content>
                <Header size="tiny">不能排班時間</Header>
                <List style={ { margin: "0 1em" } }>{ schedulesItem }</List>
                <RepeatedScheduleAdd year={ year } month={ month } forceType={ "Other" } positiveButton={ false }
                                     submitText="新增時間" onSubmit={ newOccupiedSchedule }/>
            </Card.Content>
        </Card>
    )
};

const PersonAdd: React.FC<{ onSubmit: Dispatch<Person> }> = ({ onSubmit }) => {
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
            onSubmit(new Person(store.name, store.role, store.gender));
        }
    };

    return (
        <Form onSubmit={ addPerson }>
            <Form.Group inline style={ { justifyContent: "flex-end" } }>
                <label>加入</label>
                <Form.Input placeholder="請輸入姓名" required value={ name }
                            onChange={ setName }/>
                <Form.Select placeholder="請選擇性別" compact required options={ genderOptions }
                             onChange={ setGender }/>
                <Form.Select placeholder="請選擇身份" compact required options={ roleOptions }
                             onChange={ setRole }/>
                <Form.Button positive>新增人員</Form.Button>
            </Form.Group>
        </Form>
    );
};

const ScheduleEdit: React.FC<{ value: Schedule[], onChange: Dispatch<Schedule[]> }> = ({ onChange, value }) => {
    const tableRows = value.map((schedule, idx) => {
        const { type, time } = schedule;
        const deleteSchedule = (): void => {
            const newValue = value.slice();
            newValue.splice(idx, 1);
            onChange(newValue)
        };
        const deleteButton = <Button icon="delete" size="mini" onClick={ deleteSchedule }/>;
        return (
            <Table.Row key={ type + time.localDate.toISODate() + time.period }>
                <Table.Cell>{ time.dateStr() }
                    <small> { time.period }</small>
                </Table.Cell>
                <Table.Cell>{ type }</Table.Cell>
                <Table.Cell collapsing>{ deleteButton }</Table.Cell>
            </Table.Row>
        );
    });
    return (
        <Table singleLine>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>時間</Table.HeaderCell>
                    <Table.HeaderCell>工作</Table.HeaderCell>
                    <Table.HeaderCell collapsing>{ "" }</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                { tableRows }
            </Table.Body>
        </Table>
    )
};

type RepeatedSchedulesEditProps = {
    year: number,
    month: number,
    value: RepeatedSchedule[],
    onChange?: Dispatch<RepeatedSchedule[]>,
}
const RepeatedSchedulesEdit: React.FC<RepeatedSchedulesEditProps> = ({ year, month, value, onChange = noop }) => {
    const tableRows = value.map((repeatedSchedule, idx) => {
        const { type, repeat } = repeatedSchedule;
        const deleteRepeatedSchedule = (): void => {
            const newValue = value.slice();
            newValue.splice(idx, 1);
            onChange(newValue)
        };
        const repeatStr = Object.values(repeat).join(' ');
        return (
            <Table.Row key={ repeatStr + type }>
                <Table.Cell>
                    { repeatStr }
                </Table.Cell>
                <Table.Cell>
                    { type }
                </Table.Cell>
                <Table.Cell collapsing>
                    <Button icon="delete" size="mini" onClick={ deleteRepeatedSchedule }/>
                </Table.Cell>
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
                        <Table.HeaderCell collapsing>{ "" }</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { tableRows }
                </Table.Body>
            </Table>
            <RepeatedScheduleAdd year={ year } month={ month }
                                 onSubmit={ repeatedSchedule => onChange([...value, repeatedSchedule]) }/>
        </>
    )
};

type RepeatedScheduleAddProps = {
    forceType?: keyof typeof Type,
    submitText?: string,
    positiveButton?: boolean,
    onSubmit?: Dispatch<RepeatedSchedule>,
} & BasicProps;
const RepeatedScheduleAdd: React.FC<RepeatedScheduleAddProps> = (
    { year, month, forceType, positiveButton = true, submitText = "新增班次", onSubmit = noop }
) => {
    const repeatTypeOptions = Object.keys(RepeatType).map(key => {
        return { key: key, text: RepeatType[key as keyof typeof RepeatType], value: key }
    });
    const [repeatTypeKey, _setRepeatTypeKey] = useState<keyof typeof RepeatType>();
    const setRepeatTypeKeyOnChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        _setRepeatTypeKey(data.value as keyof typeof RepeatType)
    };

    const typeOptions = Object.keys(Type).map(key => {
        return { key: key, text: Type[key as keyof typeof Type], value: key }
    });
    let [typeKey, _setTypeKey] = useState<keyof typeof Type>();
    const setTypeKeyOnChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        _setTypeKey(data.value as keyof typeof Type)
    };
    let typeChooser: ReactNode = (
        <>
            <label>要</label>
            <Form.Select compact key="type" placeholder="請選擇工作" options={ typeOptions }
                         value={ typeKey }
                         onChange={ setTypeKeyOnChange }/>
        </>
    );
    if (forceType) {
        typeKey = forceType;
        typeChooser = null;
    }

    const [repeat, setRepeat] = useState<Repeat>();

    const submitRepeatedSchedule = () => {
        if (repeat !== undefined && typeKey !== undefined) {
            const repeatedSchedule = new RepeatedSchedule(Type[typeKey], year, month, repeat);
            onSubmit(repeatedSchedule)
        }
    };

    return (
        <Form onSubmit={ submitRepeatedSchedule }>
            <Form.Group inline style={ { justifyContent: "flex-end" } }>
                <Form.Select compact key="repeatType" placeholder="請重複頻率" options={ repeatTypeOptions }
                             value={ repeatTypeKey }
                             onChange={ setRepeatTypeKeyOnChange }/>
                <RepeatedScheduleDetailEdit year={ year } month={ month }
                                            repeatType={ repeatTypeKey ? RepeatType[repeatTypeKey] : undefined }
                                            value={ repeat }
                                            onChange={ r => setRepeat(r) }/>
                { typeChooser }
                <Form.Button positive={ positiveButton }>{ submitText }</Form.Button>
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


const now = DateTime.local();
const yearOptions = Array(5).fill(1).map((_, i) => {
    const year = i + now.year;
    return { key: year, text: year.toString(), value: year }
});
const monthOptions = Array(12).fill(1).map((_, i) => {
    const month = i + 1;
    return { key: month, text: month.toString(), value: month }
});
type YearMonthChooseProps = { year: number, month: number, setYear: Dispatch<number>, setMonth: Dispatch<number> }
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

const defaultPersonSchedules: PersonSchedule[] = [
    [
        new Person('孫小美', Role.AssistantChiefResident, Gender.Female),
        [
            new RepeatedSchedule(Type.Other, now.year, now.month + 1, {
                type: RepeatType.Week,
                weekday: WeekDay.Monday,
                period: Period.Afternoon
            }),
        ]
    ],
    [new Person('王小明', Role.Resident, Gender.Male), []],
];
const defaultRepeatedSchedules: RepeatedSchedule[] = [
    new RepeatedSchedule(Type.MorningNote, now.year, now.month + 1, { type: RepeatType.Day, period: Period.Morning }),
    new RepeatedSchedule(Type.MorningSlide, now.year, now.month + 1, { type: RepeatType.Day, period: Period.Morning }),
    new RepeatedSchedule(Type.Jingfu, now.year, now.month + 1, {
        type: RepeatType.Week,
        weekday: 2,
        period: Period.Afternoon
    }),
    new RepeatedSchedule(Type.W5Note, now.year, now.month + 1, {
        type: RepeatType.Week,
        weekday: 5,
        period: Period.Afternoon
    }),
    new RepeatedSchedule(Type.W5Slide, now.year, now.month + 1, {
        type: RepeatType.Week,
        weekday: 5,
        period: Period.Afternoon
    }),
    new RepeatedSchedule(Type.PAP, now.year, now.month + 1, { type: RepeatType.Period }),
];
const defaultSchedules = defaultRepeatedSchedules.flatMap(r => r.toSchedules()).sort((a, b) => a.comparesTo(b));
const App: React.FC = () => {
    const [year, setYear] = useState<number>(now.year);
    const [month, setMonth] = useState<number>((now.plus({ month: 1 })).month);
    const [repeatedSchedules, _setRepeatedSchedules] = useState<RepeatedSchedule[]>(defaultRepeatedSchedules);
    const [emptySchedules, setEmptySchedules] = useState<Schedule[]>(defaultSchedules);
    const [accordionState, setAccordionState] = useState<boolean>(false);
    const setRepeatedSchedules: Dispatch<RepeatedSchedule[]> = newRepeatedSchedules => {
        const schedules = newRepeatedSchedules.flatMap(r => r.toSchedules()).sort((a, b) => a.comparesTo(b));
        setEmptySchedules(schedules);
        setAccordionState(true);
        _setRepeatedSchedules(newRepeatedSchedules);
    };
    const [personSchedules, setPersonSchedules] = useState<PersonSchedule[]>(defaultPersonSchedules);
    const segmentStyle = { paddingBottom: "4em" };
    const [loading, setLoading] = useState<boolean>(false);

    const generateOutput = () => {
        const persons: Person[] = [];
        personSchedules.forEach(([person, repeatedSchedules]) => {
            persons.push(person);
            repeatedSchedules.forEach(repeatedSchedule => {
                const newRepeatedSchedule = Object.create(repeatedSchedule);
                Object.assign(newRepeatedSchedule, repeatedSchedule);
                newRepeatedSchedule.assignee = person;
                person.schedules = person.schedules.concat(newRepeatedSchedule.toSchedules());
            })
        });
        const output = { schedules: emptySchedules, persons };
        return JSON.stringify(output, function (key, value) {
            if (key === 'assignee' && value instanceof Person) {
                return value.name;
            }
            return value;
        });
    };
    const sendRequest = (): void => {
        setLoading(true);
        request('POST', 'http://localhost:8080/schedules', generateOutput())
            .then(target => {
                setLoading(false);
                saveBlob(target.response as Blob, 'output.xlsx');
            })
            .catch(console.error);
    };
    return (
        <Container style={ { margin: 20 } }>
            <Segment as="section" basic style={ segmentStyle }>
                <Header as="h2">選擇時間</Header>
                <Divider hidden/>
                <YearMonthChooser year={ year } month={ month } setYear={ setYear } setMonth={ setMonth }/>
            </Segment>
            <Segment as="section" basic style={ segmentStyle }>
                <Header as="h2">編輯班次</Header>
                <Divider hidden/>
                <RepeatedSchedulesEdit year={ year } month={ month } value={ repeatedSchedules }
                                       onChange={ setRepeatedSchedules }/>
                <Accordion as="section">
                    <Accordion.Title active={ accordionState } onClick={ () => setAccordionState(!accordionState) }>
                        <Header as="h3">
                            <Icon name='dropdown'/>
                            { accordionState ? "隱藏" : "編輯" }詳細班次
                        </Header>
                    </Accordion.Title>
                    <Accordion.Content active={ accordionState }>
                        <p>編輯上方班次後，下面詳細班次將會重置</p>
                        <ScheduleEdit value={ emptySchedules } onChange={ setEmptySchedules }/>
                    </Accordion.Content>
                </Accordion>
            </Segment>
            <Segment as="section" basic style={ segmentStyle }>
                <Header as="h2">參與者</Header>
                <Divider hidden/>
                <PersonScheduleOverview year={ year } month={ month } value={ personSchedules }
                                        onChange={ setPersonSchedules }/>
            </Segment>
            <Segment as="section" basic style={ segmentStyle }>
                <Header as="h2">產生班表</Header>
                <Divider hidden/>
                <Grid>
                    <Grid.Column width={ 4 }/>
                    <Grid.Column width={ 8 }>
                        <Button positive fluid size="huge" loading={ loading }
                                onClick={ sendRequest }>自動排班</Button>
                    </Grid.Column>
                    <Grid.Column width={ 4 }/>
                </Grid>
            </Segment>
        </Container>
    );
};

export default App;
