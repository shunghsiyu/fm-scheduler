import Time from "./Time";
import Person from "./Person";

export enum Type {
    MorningSlide = "晨會投影片",
    MorningNote = "晨會記錄",
    PAP = "抹片",
    Jingfu = "景福",
    W5Slide = "科會投影片",
    W5Note = "科會記錄",
    OPD = "門診",
    Other = "其他"
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