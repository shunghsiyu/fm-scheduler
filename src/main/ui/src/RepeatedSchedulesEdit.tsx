import { RepeatedSchedule } from "./Schedule";
import React, { Dispatch } from "react";
import { noop } from "./util";
import { Button, Table } from "semantic-ui-react";
import { RepeatedScheduleAdd } from "./RepeatedScheduleAdd";

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
            <Table singleLine selectable>
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

export default RepeatedSchedulesEdit;