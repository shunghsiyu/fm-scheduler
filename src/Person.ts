export enum Gender {
    Male,
    Female
}

export default class Person {
    name: string;
    gender: Gender;

    constructor(name: string, gender: Gender) {
        this.name = name;
        this.gender = gender;
    }
}
