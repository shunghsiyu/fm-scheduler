import Person from "./Person";
import { RepeatedSchedule } from "./Schedule";

export type BasicProps = {
    year: number,
    month: number,
}
export type PersonSchedule = [Person, RepeatedSchedule[]]