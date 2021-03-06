package com.baeldung.optaplanner;

import com.baeldung.optaplanner.Schedule.Type;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ExcelWriter {

    private static int[] weeks = new int[]{1, 2, 3, 4, 5};
    private static int[] rowStart = new int[]{0, 4, 8, 12, 16};
    private static int[] colStart = new int[]{0, 2, 5, 7, 9};
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
    private static int analyticNameCol = 0;
    private static int analyticPAPCol = 1;
    private static int analyticMorningNoteCol = 2;
    private static int analyticW5NoteCol = 3;
    private static int analyticMorningSlideCol = 4;
    private static int analyticW5SlideCol = 5;
    private static int analyticJingfuCol = 6;

    public static void output(SchedulePlan plan, File excelFile) throws IOException {
        OutputStream output = new FileOutputStream(excelFile);
        output(plan, output);
    }

    public static void output(SchedulePlan plan, OutputStream stream) throws IOException {
        Workbook workbook = generateWorkbook(plan);
        workbook.write(stream);
    }

    private static Workbook generateWorkbook(SchedulePlan plan) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet();

        int startRow = 1;
        int startCol = 1;

        writeSheetHeaders(startRow, 0, sheet);

        Map<LocalDate, List<Schedule>> byDate =
                plan.getSchedules().stream()
                        .collect(Collectors.groupingBy(s -> s.getTime().getLocalDate()));
        for (Map.Entry<LocalDate, List<Schedule>> entry : byDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<Schedule> schedules = entry.getValue();
            int weekNum = getWeekNum(date);
            int baseRow = rowStart[weekNum - 1];
            int baseCol = colStart[date.getDayOfWeek().getValue() - 1];
            writeDaySchedule(startRow + baseRow, startCol + baseCol, date, schedules, sheet);
        }

        startRow = startRow + rowStart[rowStart.length - 1] + noteRow + 4;
        writeAnalyticHeaders(startRow, sheet);
        startRow += 1;

        Map<Person, List<Schedule>> byPerson =
                plan.getSchedules().stream()
                        .collect(Collectors.groupingBy(Schedule::getAssignee));
        for (Map.Entry<Person, List<Schedule>> entry : byPerson.entrySet()) {
            Person person = entry.getKey();
            List<Schedule> schedules = entry.getValue();
            writeAnalytic(startRow, person, schedules, sheet);
            startRow += 1;
        }

        return workbook;
    }

    private static int getWeekNum(LocalDate date) {
        int dayOfMonth = date.getDayOfMonth();
        int extraDays = date.withDayOfMonth(1).getDayOfWeek().getValue() - 1;
        return 1 + (dayOfMonth + extraDays - 1) / 7;
    }

    private static void writeSheetHeaders(int baseRow, int baseCol, Sheet sheet) {
        for (int weekNum : weeks) {
            int row = baseRow + rowStart[weekNum - 1];
            writeCell(sheet, baseCol, row + slideRow, "上午／投影片");
            writeCell(sheet, baseCol, row + noteRow, "下午／記錄");
        }
    }

    private static void writeDaySchedule(
            int baseRow, int baseCol, LocalDate date, List<Schedule> schedules, Sheet sheet) {
        writeHeaders(baseRow, baseCol, date, sheet);

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
                case MorningSlide:
                    col += morningHeaderCol;
                    row += slideRow;
                    break;
                case MorningNote:
                    col += morningHeaderCol;
                    row += noteRow;
                    break;
                case Jingfu:
                    col += extraHeaderCol;
                    row += slideRow;
                    break;
                case W5Slide:
                    col += extraHeaderCol;
                    row += slideRow;
                    break;
                case W5Note:
                    col += extraHeaderCol;
                    row += noteRow;
                    break;
                default:
                    throw new IllegalArgumentException();
            }
            writeCell(sheet, col, row, sched.getAssignee().getName());
        }
    }

    private static void writeHeaders(int baseRow, int baseCol, LocalDate date, Sheet sheet) {
        writeCell(
                sheet,
                baseCol + dateCol,
                baseRow + dateRow,
                Integer.toString(date.getDayOfMonth()));

        writeCell(sheet, baseCol + morningHeaderCol, baseRow + morningHeaderRow, "晨會");
        writeCell(sheet, baseCol + papHeaderCol, baseRow + papHeaderRow, "抹片");

        if (date.getDayOfWeek() == DayOfWeek.TUESDAY) {
            writeCell(sheet, baseCol + extraHeaderCol, baseRow + extraHeaderRow, "景福");
        } else if (date.getDayOfWeek() == DayOfWeek.FRIDAY) {
            writeCell(sheet, baseCol + extraHeaderCol, baseRow + extraHeaderRow, "科會");
        }
    }

    private static void writeAnalyticHeaders(int row, Sheet sheet) {
        writeAnalytic(sheet, row, Type.PAP, "抹片");
        writeAnalytic(sheet, row, Type.MorningNote, "晨會記錄");
        writeAnalytic(sheet, row, Type.W5Note, "科會記錄");
        writeAnalytic(sheet, row, Type.MorningSlide, "晨會投影片");
        writeAnalytic(sheet, row, Type.W5Slide, "科會投影片");
        writeAnalytic(sheet, row, Type.Jingfu, "景福");
    }

    private static void writeAnalytic(
            int row, Person person, List<Schedule> schedules, Sheet sheet) {
        writeCell(sheet, analyticNameCol, row, person.getName());
        writeAnalytic(sheet, row, Type.PAP, "0");
        writeAnalytic(sheet, row, Type.MorningNote, "0");
        writeAnalytic(sheet, row, Type.W5Note, "0");
        writeAnalytic(sheet, row, Type.MorningSlide, "0");
        writeAnalytic(sheet, row, Type.W5Slide, "0");
        writeAnalytic(sheet, row, Type.Jingfu, "0");

        Map<Type, Long> countByType =
                schedules.stream()
                        .collect(Collectors.groupingBy(Schedule::getType, Collectors.counting()));
        for (Map.Entry<Type, Long> entry : countByType.entrySet()) {
            Type type = entry.getKey();
            Long count = entry.getValue();
            writeAnalytic(sheet, row, type, count.toString());
        }
    }

    private static void writeAnalytic(Sheet sheet, int row, Type type, String value) {
        int col;
        switch (type) {
            case PAP:
                col = analyticPAPCol;
                break;
            case MorningSlide:
                col = analyticMorningSlideCol;
                break;
            case MorningNote:
                col = analyticMorningNoteCol;
                break;
            case Jingfu:
                col = analyticJingfuCol;
                break;
            case W5Slide:
                col = analyticW5SlideCol;
                break;
            case W5Note:
                col = analyticW5NoteCol;
                break;
            default:
                throw new IllegalArgumentException();
        }
        writeCell(sheet, col, row, value);
    }

    private static void writeCell(Sheet sheet, int colNum, int rowNum, String content) {
        Row row = sheet.getRow(rowNum);
        if (row == null) {
            row = sheet.createRow(rowNum);
        }
        Cell cell = row.getCell(colNum, MissingCellPolicy.CREATE_NULL_AS_BLANK);
        if (cell == null) {
            cell = row.createCell(colNum);
        }

        cell.setCellValue(content);
    }
}
