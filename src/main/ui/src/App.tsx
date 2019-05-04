import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import { Container, Card, DropdownProps, Form, Header, InputOnChangeData } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Person, { Gender, Role } from './Person'

const PersonDisplay: React.FC<{ person: Person }> = props => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{ props.person.name }</Card.Header>
        <Card.Meta>{ props.person.role }</Card.Meta>
      </Card.Content>
    </Card>
  );
};

const PersonEdit: React.FC = () => {
  const roleOptions = Object.keys(Role).map(role => {
    return {key: role, text: Role[role as keyof typeof Role], value: role} 
  });
  const genderOptions = Object.keys(Gender).map(gender => {
    return {key: gender, text: Gender[gender as keyof typeof Gender], value: gender} 
  });
  
  const [store, setStore] = useState<{ name?: string, role?: Role, gender?: Gender }>({});
  const setName = (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    setStore({...store, name: data.value });
  };
  const name = store.name ? store.name : "";
  const setGender = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
    setStore({...store, gender: data.value as Gender });
  };
  const gender = store.gender;
  const setRole = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
    setStore({...store, role: data.value as Role });
  };
  const role = store.role;
  const addPerson = () => {
    if(store.name && store.role && store.gender) {
      console.log(new Person(store.name, store.role, store.gender));
    }
  }

  return (
    <Card>
      <Card.Content>
        <Card.Header>新增人員</Card.Header>
      </Card.Content>
      <Card.Content>
        <Form>
          <Form.Input label="姓名" placeholder="請輸入姓名" value={ name } onChange={ setName } />
          <Form.Select label="性別" placeholder="請選擇性別" options={ genderOptions } value={ gender } onChange={ setGender } />
          <Form.Select label="身份" placeholder="請選擇身份" options={ roleOptions } value={ role } onChange={ setRole } />
          <Form.Button positive onClick={ addPerson } >新增</Form.Button>
        </Form>
      </Card.Content>
    </Card>
  );
};

const person: Person = new Person('王小明', Role.AssistantChiefResident, Gender.Male);

const App: React.FC = () => {
  return (
    <Container style={{ margin: 20 }}>
      <Header as="h3">編輯排班</Header>
      <Container>
        <PersonDisplay person={ person } />
        <PersonEdit />
      </Container>
    </Container>
  );
};

export default App;
