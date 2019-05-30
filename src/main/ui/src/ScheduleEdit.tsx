import React, { Dispatch } from "react";
import Schedule from "./Schedule";
import { Button, Table } from "semantic-ui-react";

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

export default ScheduleEdit;