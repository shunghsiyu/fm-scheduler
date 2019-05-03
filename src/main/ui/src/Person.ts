enum Gender {
    Male,
    Female
}

class Person {
    name: string;
    gender: Gender;

    constructor(name: string, gender: Gender) {
        this.name = name;
        this.gender = gender;
    }
}

export default Person;
