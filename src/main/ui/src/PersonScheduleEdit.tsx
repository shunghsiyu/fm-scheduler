import React, { Dispatch } from "react";
import { noop } from "./util";
import { RepeatedSchedule, Type } from "./Schedule";
import { Card, Header, Icon, Label, List } from "semantic-ui-react";
import { RepeatedScheduleAdd } from "./RepeatedScheduleAdd";
import Person from "./Person";
import { BasicProps, PersonSchedule } from "./types";

type PersonScheduleEditProps = {
    person: Person,
    occupiedSchedules: RepeatedSchedule[],
    onChange?: Dispatch<PersonSchedule>,
    onDelete?: () => void,
} & BasicProps;
export const PersonScheduleEdit: React.FC<PersonScheduleEditProps> = ({ year, month, person, occupiedSchedules, onChange = noop, onDelete = noop }) => {
    const setOccupiedSchedules: Dispatch<RepeatedSchedule[]> = newOccupiedSchedules => {
        onChange([person, newOccupiedSchedules]);
    };
    const newOccupiedSchedule: Dispatch<RepeatedSchedule> = (value: RepeatedSchedule) => {
        setOccupiedSchedules([...occupiedSchedules, value])
    };

    const repeatedSchedulesToListItems = (repeatedSchedules: RepeatedSchedule[], type: Type) => {
        return repeatedSchedules.filter(repeatedSchedule => repeatedSchedule.type === type)
            .map(repeatedSchedule => {
                const repeatStr: string = Object.values(repeatedSchedule.repeat).join(' ');
                const deleteSchedule = () => {
                    const newOccupiedSchedules = occupiedSchedules.slice();
                    const idx = newOccupiedSchedules.indexOf(repeatedSchedule);
                    newOccupiedSchedules.splice(idx, 1);
                    setOccupiedSchedules(newOccupiedSchedules)
                };
                return (
                    <List.Item key={ repeatStr }>
                        { repeatStr }
                        <Icon name="delete" onClick={ deleteSchedule }
                              style={ { cursor: "pointer", paddingLeft: "0.4em" } }/>
                    </List.Item>
                );
            })
    };
    const otherSchedulesItem = repeatedSchedulesToListItems(occupiedSchedules, Type.Other);
    const opdSchedulesItem = repeatedSchedulesToListItems(occupiedSchedules, Type.OPD);
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
                <Header size="tiny">門診時間</Header>
                <List style={ { margin: "0 1em" } }>{ opdSchedulesItem }</List>
                <RepeatedScheduleAdd year={ year } month={ month } forceType={ "OPD" } positiveButton={ false }
                                     submitText="新增時間" onSubmit={ newOccupiedSchedule }/>
                <Header size="tiny">其他不能排班時間</Header>
                <List style={ { margin: "0 1em" } }>{ otherSchedulesItem }</List>
                <RepeatedScheduleAdd year={ year } month={ month } forceType={ "Other" } positiveButton={ false }
                                     submitText="新增時間" onSubmit={ newOccupiedSchedule }/>
            </Card.Content>
        </Card>
    )
};