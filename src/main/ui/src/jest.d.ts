import {DateTime} from "@types/luxon";

declare global {
    namespace jest {
        interface Matchers<R> {
            toDateTimeEqual(received: DateTime): R;
            sameDaysAs(received: Array<DateTime>): R;
        }
    }
}