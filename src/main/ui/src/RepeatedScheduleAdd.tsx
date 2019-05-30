import React, { Dispatch, ReactNode, SyntheticEvent, useState } from "react";
import { noop } from "./util";
import { Repeat, RepeatType } from "./Time";
import { DropdownProps, Form } from "semantic-ui-react";
import { RepeatedSchedule, Type } from "./Schedule";
import { RepeatedScheduleDetailEdit } from "./RepeatedScheduleDetailEdit";
import { BasicProps } from "./types";

type RepeatedScheduleAddProps = {
    forceType?: keyof typeof Type,
    submitText?: string,
    positiveButton?: boolean,
    onSubmit?: Dispatch<RepeatedSchedule>,
} & BasicProps;
export const RepeatedScheduleAdd: React.FC<RepeatedScheduleAddProps> = (
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