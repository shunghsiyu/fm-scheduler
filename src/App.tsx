import React from 'react';
import { Container, Header, List, Card, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Person, { Gender } from './Person'

const PersonCard: React.FC<{ person: Person }> = props => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{ props.person.name }</Card.Header>
        <Card.Meta>小 CR</Card.Meta>
      </Card.Content>
    </Card>
  );
};

const person: Person = new Person('王小明', Gender.Male);

const App: React.FC = () => {
  return (
    <Container style={{ margin: 20 }}>
      <Header as="h3">編輯排班</Header>
      <Container>
        <PersonCard person={ person } />
      </Container>
    </Container>
  );
};

export default App;
