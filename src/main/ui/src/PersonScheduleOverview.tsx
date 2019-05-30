import { BasicProps, PersonSchedule } from "./types";
import React, { Dispatch } from "react";
import { noop } from "./util";
import { PersonScheduleEdit } from "./PersonScheduleEdit";
import { PersonAdd } from "./PersonAdd";

type PersonScheduleOverviewProps = {
    value: PersonSchedule[],
    onChange?: Dispatch<PersonSchedule[]>,
} & BasicProps;
export const PersonScheduleOverview: React.FC<PersonScheduleOverviewProps> = ({ year, month, value, onChange = noop }) => {
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