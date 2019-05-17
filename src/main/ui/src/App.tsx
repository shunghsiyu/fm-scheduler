import React, { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useState } from 'react';
import { Card, Container, DropdownProps, Form, Grid, Header, InputOnChangeData, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Person, { Gender, Role } from './Person'
import { RepeatedSchedule, Type } from "./Schedule"
import { Period, RepeatType } from "./Time"

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
                    <RepeatedScheduleDisplay/>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default App;