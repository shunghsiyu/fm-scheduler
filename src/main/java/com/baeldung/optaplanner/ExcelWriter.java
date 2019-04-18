package com.baeldung.optaplanner;

import java.io.File;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ExcelWriter {

    private static int[] rowStart = new int[] {0, 2, 4, 6, 8};
    private static int[] colStart = new int[] {0, 2, 5, 7, 9};

    public static void output(SchedulePlan plan, File excelFile) {
        Map<LocalDate, List<Schedule>> byDate =
                plan.getScheduleList().stream()
                        .collect(Collectors.groupingBy(s -> s.getTime().getLocalDate()));
        for (Map.Entry<LocalDate, List<Schedule>> entry : byDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<Schedule> schedules = entry.getValue();
            System.out.println(date.toString());
            int weekNum =
                    1
                            + (date.getDayOfMonth()
                                            + date.withDayOfMonth(1).getDayOfWeek().getValue()
                                            - 2)
                                    / 7;
            System.out.printf("Week: %d\n", weekNum);
            int baseRow = rowStart[weekNum - 1];
            int baseCol = colStart[date.getDayOfWeek().getValue() - 1];
            writeDaySchedule(baseRow + 1, baseCol + 1, date, schedules);
            System.out.println();
        }
        return;
    }

    private static int dateCol = 0;
    private static int dateRow = 0;
    private static int morningHeaderCol = 0;
    private static int morningHeaderRow = 1;
    private static int papHeaderCol = 1;
    private static int papHeaderRow = 1;
    private static int extraHeaderCol = 2;
    private static int extraHeaderRow = 1;
    private static int papBaseRow = 2;
    private static int slideRow = 2;
    private static int noteRow = 3;

    private static void writeDaySchedule(
            int baseRow, int baseCol, LocalDate date, List<Schedule> schedules) {
        writeHeaders(baseRow, baseCol, date);

        for (Schedule sched : schedules) {
            Schedule.Type type = sched.getType();
            Time.Period period = sched.getTime().getPeriod();
            int col = baseCol;
            int row = baseRow;
            switch (type) {
                case PAP:
                    col += papHeaderCol;
                    row += papBaseRow + period.getValue();
                    break;
                case MORNINGMEETING_SLIDE:
                    col += morningHeaderCol;
                    row += slideRow;
                    break;
                case MORNINGMEETING_NOTE:
                    col += morningHeaderCol;
                    row += noteRow;
                    break;
                case JINGFUMEETING:
                    col += extraHeaderCol;
                    row += slideRow;
                    break;
                case W5MEETING_SLIDE:
                    col += extraHeaderCol;
                    row += slideRow;
                    break;
                case W5MEETING_NOTE:
                    col += extraHeaderCol;
                    row += noteRow;
                    break;
                default:
                    throw new IllegalArgumentException();
            }
            System.out.printf(
                    "Write %s (%s) at (%d,%d)\n",
                    sched.getAssignee().getName(), sched.getType().name(), col, row);
        }
        return;
    }

    private static void writeHeaders(int baseRow, int baseCol, LocalDate date) {
        System.out.printf(
                "Write %d at (%d,%d)\n",
                date.getDayOfMonth(), baseCol + dateCol, baseRow + dateRow);

        System.out.printf(
                "Write %s at (%d,%d)\n",
                "Morning", baseCol + morningHeaderCol, baseRow + morningHeaderRow);
        System.out.printf(
                "Write %s at (%d,%d)\n", "PAP", baseCol + papHeaderCol, baseRow + papHeaderRow);

        if (date.getDayOfWeek() == DayOfWeek.TUESDAY) {
            System.out.printf(
                    "Write %s at (%d,%d)\n",
                    "Jingfu", baseCol + extraHeaderCol, baseRow + extraHeaderRow);
        } else if (date.getDayOfWeek() == DayOfWeek.FRIDAY) {
            System.out.printf(
                    "Write %s at (%d,%d)\n",
                    "W5Meeting", baseCol + extraHeaderCol, baseRow + extraHeaderRow);
        }
    }
}
