import Schedule from "./Schedule";

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
  schedules: Schedule[];

  constructor(name: string, role: Role, gender: Gender, schedules?: Schedule[]) {
    this.name = name;
    this.role = role;
    this.gender = gender;
    this.schedules = schedules ? schedules : [];
  }
}
