export enum Gender {
  Male = "男",
  Female = "女"
}

export enum Role {
  Resident = "住院醫師",
  AssistantChiefResident = "小 CR"
}

export default class Person {
  name: string;
  gender: Gender;
  role: Role;

  constructor(name: string, role: Role, gender: Gender) {
    this.name = name;
    this.role = role;
    this.gender = gender;
  }
}
