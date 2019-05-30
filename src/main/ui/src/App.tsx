import React, { Dispatch, useState } from 'react';
import { Accordion, Button, Container, Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Person, { Gender, Role } from './Person'
import Schedule, { RepeatedSchedule, Type } from "./Schedule"
import { Period, RepeatType, WeekDay } from "./Time"
import { DateTime } from "luxon";
import { request, saveBlob } from "./util";
import { PersonSchedule } from "./types";
import RepeatedSchedulesEdit from "./RepeatedSchedulesEdit";
import ScheduleEdit from "./ScheduleEdit";
import PersonScheduleOverview from "./PersonScheduleOverview";

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

const getDefaultPersonSchedules = (year: number, month: number): PersonSchedule[] => {
    return [
        [
            new Person('孫小美', Role.AssistantChiefResident, Gender.Female),
            [
                new RepeatedSchedule(Type.OPD, year, month, {
                    type: RepeatType.Week,
                    weekday: WeekDay.Monday,
                    period: Period.Afternoon
                }),
                new RepeatedSchedule(Type.Other, year, month, {
                    type: RepeatType.Week,
                    weekday: WeekDay.Wednesday,
                    period: Period.Morning
                }),
            ]
        ],
        [new Person('王小明', Role.Resident, Gender.Male), []],
    ];
};

const getDefaultRepeatedSchedules = (year: number, month: number): RepeatedSchedule[] => {
    return [
        new RepeatedSchedule(Type.MorningNote, year, month, { type: RepeatType.Day, period: Period.Morning }),
        new RepeatedSchedule(Type.MorningSlide, year, month, { type: RepeatType.Day, period: Period.Morning }),
        new RepeatedSchedule(Type.Jingfu, year, month, {
            type: RepeatType.Week,
            weekday: 2,
            period: Period.Afternoon
        }),
        new RepeatedSchedule(Type.W5Note, year, month, {
            type: RepeatType.Week,
            weekday: 5,
            period: Period.Afternoon
        }),
        new RepeatedSchedule(Type.W5Slide, year, month, {
            type: RepeatType.Week,
            weekday: 5,
            period: Period.Afternoon
        }),
        new RepeatedSchedule(Type.PAP, year, month, { type: RepeatType.Period }),
    ];
};
const App: React.FC = () => {
    const [year, _setYear] = useState<number>(now.year);
    const [month, _setMonth] = useState<number>((now.plus({ month: 1 })).month);
    const [repeatedSchedules, _setRepeatedSchedules] = useState<RepeatedSchedule[]>(getDefaultRepeatedSchedules(year, month));
    const [emptySchedules, setEmptySchedules] = useState<Schedule[]>(repeatedSchedules.flatMap(r => r.toSchedules()).sort((a, b) => a.comparesTo(b)));
    const [accordionState, setAccordionState] = useState<boolean>(false);
    const setRepeatedSchedules: Dispatch<RepeatedSchedule[]> = newRepeatedSchedules => {
        const schedules = newRepeatedSchedules.flatMap(r => r.toSchedules()).sort((a, b) => a.comparesTo(b));
        setEmptySchedules(schedules);
        setAccordionState(true);
        _setRepeatedSchedules(newRepeatedSchedules);
    };
    const [personSchedules, setPersonSchedules] = useState<PersonSchedule[]>(getDefaultPersonSchedules(year, month));
    const segmentStyle = { paddingBottom: "4em" };
    const [loading, setLoading] = useState<boolean>(false);

    const setYear = (newYear: number) => {
        setRepeatedSchedules(getDefaultRepeatedSchedules(newYear, month));
        setPersonSchedules(getDefaultPersonSchedules(newYear, month));
        _setYear(newYear);
    };
    const setMonth = (newMonth: number) => {
        setRepeatedSchedules(getDefaultRepeatedSchedules(year, newMonth));
        setPersonSchedules(getDefaultPersonSchedules(year, newMonth));
        _setMonth(newMonth);
    };
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
