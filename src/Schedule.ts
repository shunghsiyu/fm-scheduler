import Time from "./Time";
import Person from "./Person";

export enum Type {
    MORNINGMEETING_SLIDE,
    MORNINGMEETING_NOTE,
    PAP,
    JINGFUMEETING,
    W5MEETING_SLIDE,
    W5MEETING_NOTE,
    OPD,
    OTHER
}

export default class Schedule {
    type: Type;
    time: Time;
    assignee: Person;

    constructor(type: Type, time: Time, assignee: Person) {
        this.type = type;
        this.time = time;
        this.assignee = assignee;
    }
}