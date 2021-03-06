import { ChangeDetectorRef, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { DateRangePreset } from '../date-range-picker.models';
import { LocaleConfig } from '../date-range-picker.config';
import { LocaleService } from '../services/locale.service';
export declare enum SideEnum {
    left = "left",
    right = "right"
}
export declare class DateRangePickerComponent implements OnInit {
    private el;
    private _ref;
    private _localeService;
    locale: LocaleConfig;
    ranges: DateRangePreset[];
    constructor(el: ElementRef, _ref: ChangeDetectorRef, _localeService: LocaleService);
    private _old;
    chosenLabel: string;
    calendarVariables: {
        left: any;
        right: any;
    };
    timepickerVariables: {
        left: any;
        right: any;
    };
    daterangepicker: {
        start: FormControl;
        end: FormControl;
    };
    applyBtn: {
        disabled: boolean;
    };
    startDate: _moment.Moment;
    endDate: _moment.Moment;
    dateLimit: number;
    sideEnum: typeof SideEnum;
    minDate: _moment.Moment;
    maxDate: _moment.Moment;
    autoApply: Boolean;
    singleDatePicker: Boolean;
    showDropdowns: Boolean;
    showWeekNumbers: Boolean;
    showISOWeekNumbers: Boolean;
    linkedCalendars: Boolean;
    autoUpdateInput: Boolean;
    alwaysShowCalendars: Boolean;
    lockStartDate: Boolean;
    timePicker: Boolean;
    timePicker24Hour: Boolean;
    timePickerIncrement: number;
    timePickerSeconds: Boolean;
    showClearButton: Boolean;
    firstMonthDayClass: string;
    lastMonthDayClass: string;
    emptyWeekRowClass: string;
    firstDayOfNextMonthClass: string;
    lastDayOfPreviousMonthClass: string;
    buttonClassApply: string;
    buttonClassReset: string;
    buttonClassRange: string;
    isFullScreenPicker: boolean;
    _locale: LocaleConfig;
    _ranges: DateRangePreset[];
    showCustomRangeLabel: boolean;
    showCancel: boolean;
    keepCalendarOpeningWithRange: boolean;
    showRangeLabelOnInput: boolean;
    customRangeDirection: boolean;
    chosenRange: DateRangePreset;
    isShown: Boolean;
    inline: boolean;
    leftCalendar: any;
    rightCalendar: any;
    showCalInRanges: Boolean;
    options: any;
    drops: string;
    opens: string;
    closeOnAutoApply: boolean;
    choosedDate: EventEmitter<Object>;
    rangeClicked: EventEmitter<Object>;
    datesUpdated: EventEmitter<Object>;
    startDateChanged: EventEmitter<Object>;
    endDateChanged: EventEmitter<Object>;
    pickerContainer: ElementRef;
    $event: any;
    ngOnInit(): void;
    renderRanges(): void;
    renderTimePicker(side: SideEnum): void;
    renderCalendar(side: SideEnum): void;
    setStartDate(startDate: any): void;
    setEndDate(endDate: any): void;
    isInvalidDate(date: any): boolean;
    isCustomDate(date: any): boolean;
    updateView(): void;
    updateMonthsInView(): void;
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars(): void;
    updateElement(): void;
    remove(): void;
    /**
     * this should calculate the label
     */
    calculateChosenLabel(): void;
    clickApply(e?: any): void;
    clickCancel(e: any): void;
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    monthChanged(monthEvent: any, side: SideEnum): void;
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    yearChanged(yearEvent: any, side: SideEnum): void;
    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side left or right
     */
    timeChanged(timeEvent: any, side: SideEnum): void;
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month: number, year: number, side: SideEnum): void;
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side: SideEnum): void;
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side: SideEnum): void;
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e: any, side: SideEnum, row: number, col: number): void;
    /**
     *  Click on the custom range
     * @param e: Event
     * @param preset
     */
    clickRange(e: any, preset: DateRangePreset): void;
    show(e?: any): void;
    hide(e?: any): void;
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    handleInternalClick(e: any): void;
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale: any): void;
    /**
     *  clear the daterange picker
     */
    clear(): void;
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(preset: any): any;
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    private _getDateWithTime;
    /**
     *  build the locale config
     */
    private _buildLocale;
    private _buildCells;
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth: any, row: any): boolean;
    scrollDetection(event: any): void;
}
