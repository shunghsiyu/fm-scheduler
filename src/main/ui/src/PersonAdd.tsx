import React, { ChangeEvent, Dispatch, SyntheticEvent, useState } from "react";
import Person, { Gender, Role } from "./Person";
import { DropdownProps, Form, InputOnChangeData } from "semantic-ui-react";

export const PersonAdd: React.FC<{ onSubmit: Dispatch<Person> }> = ({ onSubmit }) => {
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