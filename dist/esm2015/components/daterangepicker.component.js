import * as tslib_1 from "tslib";
var DaterangepickerComponent_1;
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { LocaleService } from '../services/locale.service';
const moment = _moment;
export var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
let DaterangepickerComponent = DaterangepickerComponent_1 = class DaterangepickerComponent {
    constructor(el, _ref, _localeService) {
        this.el = el;
        this._ref = _ref;
        this._localeService = _localeService;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.timepickerVariables = { left: {}, right: {} };
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.dateLimit = null;
        // used in template for compile time support of enum values.
        this.sideEnum = SideEnum;
        this.minDate = null;
        this.maxDate = null;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.linkedCalendars = !this.singleDatePicker;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.lockStartDate = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        // end of timepicker variables
        this.showClearButton = false;
        this.firstMonthDayClass = null;
        this.lastMonthDayClass = null;
        this.emptyWeekRowClass = null;
        this.firstDayOfNextMonthClass = null;
        this.lastDayOfPreviousMonthClass = null;
        this._locale = {};
        // custom ranges
        this._ranges = {};
        this.showCancel = false;
        this.keepCalendarOpeningWithRange = false;
        this.showRangeLabelOnInput = false;
        this.customRangeDirection = false;
        this.rangesArray = [];
        // some state information
        this.isShown = false;
        this.inline = true;
        this.leftCalendar = { month: moment() };
        this.rightCalendar = { month: moment().add(1, 'month') };
        this.showCalInRanges = false;
        this.options = {}; // should get some opt from user
        this.closeOnAutoApply = true;
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
    }
    set locale(value) {
        this._locale = Object.assign({}, this._localeService.config, value);
    }
    get locale() {
        return this._locale;
    }
    set ranges(value) {
        this._ranges = value;
        this.renderRanges();
    }
    get ranges() {
        return this._ranges;
    }
    ngOnInit() {
        this._buildLocale();
        const daysOfWeek = [...this.locale.daysOfWeek];
        if (this.locale.firstDay !== 0) {
            let iterator = this.locale.firstDay;
            while (iterator > 0) {
                daysOfWeek.push(daysOfWeek.shift());
                iterator--;
            }
        }
        this.locale.daysOfWeek = daysOfWeek;
        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        if (this.startDate && this.timePicker) {
            this.setStartDate(this.startDate);
            this.renderTimePicker(SideEnum.left);
        }
        if (this.endDate && this.timePicker) {
            this.setEndDate(this.endDate);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    }
    renderRanges() {
        this.rangesArray = [];
        let start, end;
        if (typeof this.ranges === 'object') {
            for (const range in this.ranges) {
                if (this.ranges.hasOwnProperty(range)) {
                    if (typeof this.ranges[range][0] === 'string') {
                        start = moment(this.ranges[range][0], this.locale.format);
                    }
                    else {
                        start = moment(this.ranges[range][0]);
                    }
                    if (typeof this.ranges[range][1] === 'string') {
                        end = moment(this.ranges[range][1], this.locale.format);
                    }
                    else {
                        end = moment(this.ranges[range][1]);
                    }
                    // If the start or end date exceed those allowed by the minDate
                    // option, shorten the range to the allowable period.
                    if (this.minDate && start.isBefore(this.minDate)) {
                        start = this.minDate.clone();
                    }
                    const maxDate = this.maxDate;
                    if (maxDate && end.isAfter(maxDate)) {
                        end = maxDate.clone();
                    }
                    // If the end of the range is before the minimum or the start of the range is
                    // after the maximum, don't display this range option at all.
                    if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day')) ||
                        (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                        continue;
                    }
                    // Support unicode chars in the range names.
                    const elem = document.createElement('textarea');
                    elem.innerHTML = range;
                    const rangeHtml = elem.value;
                    this.ranges[rangeHtml] = [start, end];
                }
            }
            for (const range in this.ranges) {
                if (this.ranges.hasOwnProperty(range)) {
                    this.rangesArray.push(range);
                }
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }
        }
    }
    renderTimePicker(side) {
        if (side === SideEnum.right && !this.endDate) {
            return;
        }
        let selected, minDate;
        const maxDate = this.maxDate;
        if (side === SideEnum.left) {
            (selected = this.startDate.clone()), (minDate = this.minDate);
        }
        else if (side === SideEnum.right) {
            (selected = this.endDate.clone()), (minDate = this.startDate);
        }
        const start = this.timePicker24Hour ? 0 : 1;
        const end = this.timePicker24Hour ? 23 : 12;
        this.timepickerVariables[side] = {
            hours: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0
        };
        // generate hours
        for (let i = start; i <= end; i++) {
            let i_in_24 = i;
            if (!this.timePicker24Hour) {
                i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : i === 12 ? 0 : i;
            }
            const time = selected.clone().hour(i_in_24);
            let disabled = false;
            if (minDate && time.minute(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.minute(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].hours.push(i);
            if (i_in_24 === selected.hour() && !disabled) {
                this.timepickerVariables[side].selectedHour = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledHours.push(i);
            }
        }
        // generate minutes
        for (let i = 0; i < 60; i += this.timePickerIncrement) {
            const padded = i < 10 ? '0' + i : i;
            const time = selected.clone().minute(i);
            let disabled = false;
            if (minDate && time.second(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.second(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].minutes.push(i);
            this.timepickerVariables[side].minutesLabel.push(padded);
            if (selected.minute() === i && !disabled) {
                this.timepickerVariables[side].selectedMinute = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledMinutes.push(i);
            }
        }
        // generate seconds
        if (this.timePickerSeconds) {
            for (let i = 0; i < 60; i++) {
                const padded = i < 10 ? '0' + i : i;
                const time = selected.clone().second(i);
                let disabled = false;
                if (minDate && time.isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.isAfter(maxDate)) {
                    disabled = true;
                }
                this.timepickerVariables[side].seconds.push(i);
                this.timepickerVariables[side].secondsLabel.push(padded);
                if (selected.second() === i && !disabled) {
                    this.timepickerVariables[side].selectedSecond = i;
                }
                else if (disabled) {
                    this.timepickerVariables[side].disabledSeconds.push(i);
                }
            }
        }
        // generate AM/PM
        if (!this.timePicker24Hour) {
            if (minDate &&
                selected
                    .clone()
                    .hour(12)
                    .minute(0)
                    .second(0)
                    .isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }
            if (maxDate &&
                selected
                    .clone()
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }
            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            }
            else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }
        }
        this.timepickerVariables[side].selected = selected;
    }
    renderCalendar(side) {
        // side enum
        const mainCalendar = side === SideEnum.left ? this.leftCalendar : this.rightCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = moment([year, month]).daysInMonth();
        const firstDay = moment([year, month, 1]);
        const lastDay = moment([year, month, daysInMonth]);
        const lastMonth = moment(firstDay)
            .subtract(1, 'month')
            .month();
        const lastYear = moment(firstDay)
            .subtract(1, 'month')
            .year();
        const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        const dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        const calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (let i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate
                .clone()
                .hour(hour)
                .minute(minute)
                .second(second);
            curDate.hour(12);
            if (this.minDate &&
                calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) &&
                side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }
            if (this.maxDate &&
                calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) &&
                side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }
        }
        // make the calendar object available to hoverDate/clickDate
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        }
        else {
            this.rightCalendar.calendar = calendar;
        }
        //
        // Display the calendar
        //
        const minDate = side === 'left' ? this.minDate : this.startDate;
        let maxDate = this.maxDate;
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const maxLimit = this.startDate
                .clone()
                .add(this.dateLimit, 'day')
                .endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            const currentMonth = calendar[1][1].month();
            const currentYear = calendar[1][1].year();
            const realCurrentYear = moment().year();
            const maxYear = (maxDate && maxDate.year()) || realCurrentYear + 5;
            const minYear = (minDate && minDate.year()) || realCurrentYear - 50;
            const inMinYear = currentYear === minYear;
            const inMaxYear = currentYear === maxYear;
            const years = [];
            for (let y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        this._buildCells(calendar, side);
    }
    setStartDate(startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (!this.isShown) {
            this.updateElement();
        }
        this.startDateChanged.emit({ startDate: this.startDate });
        this.updateMonthsInView();
    }
    setEndDate(endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
        }
        if (!this.timePicker) {
            this.endDate = this.endDate
                .add(1, 'd')
                .startOf('day')
                .subtract(1, 'second');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }
        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }
        if (this.dateLimit &&
            this.startDate
                .clone()
                .add(this.dateLimit, 'day')
                .isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit, 'day');
        }
        if (!this.isShown) {
            // this.updateElement();
        }
        this.endDateChanged.emit({ endDate: this.endDate });
        this.updateMonthsInView();
    }
    isInvalidDate(date) {
        return false;
    }
    isCustomDate(date) {
        return false;
    }
    updateView() {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    }
    updateMonthsInView() {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker &&
                this.leftCalendar.month &&
                this.rightCalendar.month &&
                ((this.startDate &&
                    this.leftCalendar &&
                    this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate &&
                        this.rightCalendar &&
                        this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) &&
                (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                    this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars &&
                    (this.endDate.month() !== this.startDate.month() || this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                }
                else {
                    this.rightCalendar.month = this.startDate
                        .clone()
                        .date(2)
                        .add(1, 'month');
                }
            }
        }
        else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate
                    .clone()
                    .date(2)
                    .add(1, 'month');
            }
        }
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate
                .clone()
                .date(2)
                .subtract(1, 'month');
        }
    }
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars() {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    }
    updateElement() {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on input
                if (this.rangesArray.length &&
                    this.showRangeLabelOnInput === true &&
                    this.chosenRange &&
                    this.locale.customRangeLabel !== this.chosenRange) {
                    this.chosenLabel = this.chosenRange;
                }
                else {
                    this.chosenLabel =
                        this.startDate.format(this.locale.format) +
                            this.locale.separator +
                            this.endDate.format(this.locale.format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(this.locale.format);
        }
    }
    remove() {
        this.isShown = false;
    }
    /**
     * this should calculate the label
     */
    calculateChosenLabel() {
        if (!this.locale || !this.locale.separator) {
            this._buildLocale();
        }
        let customRange = true;
        let i = 0;
        if (this.rangesArray.length > 0) {
            for (const range in this.ranges) {
                if (this.ranges[range]) {
                    if (this.timePicker) {
                        const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                        // ignore times when comparing dates if time picker seconds is not enabled
                        if (this.startDate.format(format) === this.ranges[range][0].format(format) &&
                            this.endDate.format(format) === this.ranges[range][1].format(format)) {
                            customRange = false;
                            this.chosenRange = this.rangesArray[i];
                            break;
                        }
                    }
                    else {
                        // ignore times when comparing dates if time picker is not enabled
                        if (this.startDate.format('YYYY-MM-DD') === this.ranges[range][0].format('YYYY-MM-DD') &&
                            this.endDate.format('YYYY-MM-DD') === this.ranges[range][1].format('YYYY-MM-DD')) {
                            customRange = false;
                            this.chosenRange = this.rangesArray[i];
                            break;
                        }
                    }
                    i++;
                }
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                }
                else {
                    this.chosenRange = null;
                }
                // if custom label: show calendar
                this.showCalInRanges = true;
            }
        }
        this.updateElement();
    }
    clickApply(e) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            const d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'days');
                    this.calculateChosenLabel();
                    break;
                }
                d.add(1, 'days');
            }
        }
        if (this.chosenLabel) {
            this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        if (e || (this.closeOnAutoApply && !e)) {
            this.hide();
        }
    }
    clickCancel(e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    }
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    monthChanged(monthEvent, side) {
        const year = this.calendarVariables[side].dropdowns.currentYear;
        const month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    yearChanged(yearEvent, side) {
        const month = this.calendarVariables[side].dropdowns.currentMonth;
        const year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side left or right
     */
    timeChanged(timeEvent, side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        if (side === SideEnum.left) {
            const start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            }
            else if (this.endDate &&
                this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') &&
                this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
        }
        else if (this.endDate) {
            const end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);
        }
        // update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();
        // re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);
        if (this.autoApply) {
            this.clickApply();
        }
    }
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month, year, side) {
        const isLeft = side === SideEnum.left;
        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }
        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }
        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }
        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;
        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    }
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        }
        else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e, side, row, col) {
        if (e.target.tagName === 'TD') {
            if (!e.target.classList.contains('available')) {
                return;
            }
        }
        else if (e.target.tagName === 'SPAN') {
            if (!e.target.parentElement.classList.contains('available')) {
                return;
            }
        }
        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }
        let date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if ((this.endDate || (date.isBefore(this.startDate, 'day') && this.customRangeDirection === false)) &&
            this.lockStartDate === false) {
            // picking start
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.left);
            }
            this.endDate = null;
            this.setStartDate(date.clone());
        }
        else if (!this.endDate && date.isBefore(this.startDate) && this.customRangeDirection === false) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());
        }
        else {
            // picking end
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.right);
            }
            if (date.isBefore(this.startDate, 'day') === true && this.customRangeDirection === true) {
                this.setEndDate(this.startDate);
                this.setStartDate(date.clone());
            }
            else {
                this.setEndDate(date.clone());
            }
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }
        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }
        this.updateView();
        if (this.autoApply && this.startDate && this.endDate) {
            this.clickApply();
        }
        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();
    }
    /**
     *  Click on the custom range
     * @param e: Event
     * @param label
     */
    clickRange(e, label) {
        this.chosenRange = label;
        if (label === this.locale.customRangeLabel) {
            this.isShown = true; // show calendars
            this.showCalInRanges = true;
        }
        else {
            const dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
                this.chosenLabel = label;
            }
            else {
                this.calculateChosenLabel();
            }
            this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }
            if (!this.alwaysShowCalendars) {
                this.isShown = false; // hide calendars
            }
            this.rangeClicked.emit({ label: label, dates: dates });
            if (!this.keepCalendarOpeningWithRange) {
                this.clickApply();
            }
            else {
                if (!this.alwaysShowCalendars) {
                    return this.clickApply();
                }
                if (this.maxDate && this.maxDate.isSame(dates[0], 'month')) {
                    this.rightCalendar.month.month(dates[0].month());
                    this.rightCalendar.month.year(dates[0].year());
                    this.leftCalendar.month.month(dates[0].month() - 1);
                    this.leftCalendar.month.year(dates[1].year());
                }
                else {
                    this.leftCalendar.month.month(dates[0].month());
                    this.leftCalendar.month.year(dates[0].year());
                    // get the next year
                    const nextMonth = dates[0].clone().add(1, 'month');
                    this.rightCalendar.month.month(nextMonth.month());
                    this.rightCalendar.month.year(nextMonth.year());
                }
                this.updateCalendars();
                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }
            }
        }
    }
    show(e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    }
    hide(e) {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }
        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
            // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }
        // if picker is attached to a text input, update it
        this.updateElement();
        this.isShown = false;
        this._ref.detectChanges();
    }
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    handleInternalClick(e) {
        e.stopPropagation();
    }
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale) {
        for (const key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
                if (key === 'customRangeLabel') {
                    this.renderRanges();
                }
            }
        }
    }
    /**
     *  clear the daterange picker
     */
    clear() {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.updateCalendars();
        this.updateView();
    }
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(range) {
        if (range === this.locale.customRangeLabel) {
            return false;
        }
        const rangeMarkers = this.ranges[range];
        const areBothBefore = rangeMarkers.every(date => {
            if (!this.minDate) {
                return false;
            }
            return date.isBefore(this.minDate);
        });
        const areBothAfter = rangeMarkers.every(date => {
            if (!this.maxDate) {
                return false;
            }
            return date.isAfter(this.maxDate);
        });
        return areBothBefore || areBothAfter;
    }
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    _getDateWithTime(date, side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date
            .clone()
            .hour(hour)
            .minute(minute)
            .second(second);
    }
    /**
     *  build the locale config
     */
    _buildLocale() {
        this.locale = Object.assign({}, this._localeService.config, this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
    }
    _buildCells(calendar, side) {
        for (let row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            let colOffCount = 0;
            const rowClasses = [];
            if (this.emptyWeekRowClass &&
                !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (let col = 0; col < 7; col++) {
                const classes = [];
                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off', 'disabled', 'hidden');
                    colOffCount++;
                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass &&
                        (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) &&
                        calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass &&
                        (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) &&
                        calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass &&
                    calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass &&
                    calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of dates after the maximum date
                if (this.calendarVariables[side].maxDate &&
                    calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled', 'invalid');
                }
                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }
                // highlight the currently selected end date
                if (this.endDate != null &&
                    calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }
                // highlight dates in-between the selected dates
                if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                const isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                let cname = '', disabled = false;
                for (let i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            if (colOffCount === 7) {
                rowClasses.push('off');
                rowClasses.push('disabled');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    }
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth, row) {
        for (let day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "startDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "endDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], DaterangepickerComponent.prototype, "dateLimit", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "minDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "maxDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "autoApply", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "singleDatePicker", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "showDropdowns", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "showWeekNumbers", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "showISOWeekNumbers", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "linkedCalendars", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "autoUpdateInput", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "alwaysShowCalendars", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "lockStartDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "timePicker", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "timePicker24Hour", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "timePickerIncrement", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "timePickerSeconds", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "showClearButton", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerComponent.prototype, "firstMonthDayClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerComponent.prototype, "lastMonthDayClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerComponent.prototype, "emptyWeekRowClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerComponent.prototype, "firstDayOfNextMonthClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerComponent.prototype, "lastDayOfPreviousMonthClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], DaterangepickerComponent.prototype, "locale", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], DaterangepickerComponent.prototype, "ranges", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerComponent.prototype, "showCustomRangeLabel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "showCancel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "keepCalendarOpeningWithRange", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "showRangeLabelOnInput", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "customRangeDirection", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerComponent.prototype, "drops", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerComponent.prototype, "opens", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerComponent.prototype, "closeOnAutoApply", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerComponent.prototype, "choosedDate", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerComponent.prototype, "rangeClicked", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerComponent.prototype, "datesUpdated", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerComponent.prototype, "startDateChanged", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerComponent.prototype, "endDateChanged", void 0);
tslib_1.__decorate([
    ViewChild('pickerContainer'),
    tslib_1.__metadata("design:type", ElementRef)
], DaterangepickerComponent.prototype, "pickerContainer", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DaterangepickerComponent.prototype, "isInvalidDate", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DaterangepickerComponent.prototype, "isCustomDate", null);
DaterangepickerComponent = DaterangepickerComponent_1 = tslib_1.__decorate([
    Component({
        // tslint:disable-next-line:component-selector
        selector: 'ngx-daterangepicker-material',
        template: "<div\n\tclass=\"md-drppicker\"\n\t#pickerContainer\n\t[ngClass]=\"{\n\t\tltr: locale.direction === 'ltr',\n\t\trtl: this.locale.direction === 'rtl',\n\t\tshown: isShown || inline,\n\t\thidden: !isShown && !inline,\n\t\tinline: inline,\n\t\tdouble: !singleDatePicker && showCalInRanges,\n\t\t'show-ranges': rangesArray.length\n\t}\"\n\t[class]=\"'drops-' + drops + '-' + opens\"\n>\n\t<div class=\"field-row\">\n    <mat-form-field color=\"primary\">\n      <input matInput color=\"primary\" [value]=\"endDate | date: 'MM/dd/yyyy'\" readonly />\n      <span matPrefix>\n\t\t\t\t<mat-icon matDatepickerToggleIcon>date_range</mat-icon>\n\t\t\t</span>\n    </mat-form-field>\n\t\t<mat-form-field>\n\t\t\t<input matInput [value]=\"startDate | date: 'MM/dd/yyyy'\" readonly />\n\t\t\t<span matPrefix>\n\t\t\t\t<mat-icon matDatepickerToggleIcon>date_range</mat-icon>\n\t\t\t</span>\n\t\t</mat-form-field>\n\t\t<button type=\"button\" *ngIf=\"showClearButton\" class=\"accesso-text-default cal-reset-btn\" (click)=\"clear()\">\n\t\t\tReset\n\t\t</button>\n\t</div>\n\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\n\t\t<div class=\"calendar-table\">\n\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t!calendarVariables.left.minDate ||\n\t\t\t\t\t\t\t\t(calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) &&\n\t\t\t\t\t\t\t\t\t(!this.linkedCalendars || true))\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div (click)=\"clickPrev(sideEnum.left)\" class=\"prev available\"></div>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t!calendarVariables.left.minDate ||\n\t\t\t\t\t\t\t\t\t(calendarVariables.left.minDate.isBefore(\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.firstDay\n\t\t\t\t\t\t\t\t\t) &&\n\t\t\t\t\t\t\t\t\t\t(!this.linkedCalendars || true))\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<th colspan=\"5\" class=\"month drp-animate\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t<div class=\"dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t<select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.left)\">\n\t\t\t\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t[selected]=\"calendarVariables.left.dropdowns.currentMonth == m\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ locale.monthNames[m] }}\n\t\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t\t<select class=\"yearselect\" (change)=\"yearChanged($event, sideEnum.left)\">\n\t\t\t\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t[selected]=\"y === calendarVariables.left.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ y }}\n\t\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t(!calendarVariables.left.maxDate ||\n\t\t\t\t\t\t\t\t\tcalendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) &&\n\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker)\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div class=\"next available\" (click)=\"clickNext(sideEnum.left)\"></div>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t(!calendarVariables.left.maxDate ||\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.lastDay\n\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker)\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody class=\"drp-animate\">\n\t\t\t\t\t<tr\n\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.left.calRows\"\n\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row].classList\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<!-- add week number -->\n\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<!-- cal -->\n\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.left.calCols\"\n\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row][col]\"\n\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.left, row, col)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\tclass=\"hourselect select-item\"\n\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedHour\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t>\n\t\t\t\t\t<option\n\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.hours\"\n\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t>\n\t\t\t\t</select>\n\t\t\t</div>\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedMinute\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t>\n\t\t\t\t\t<option\n\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.minutes; let index = index\"\n\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t>{{ timepickerVariables.left.minutesLabel[index] }}</option\n\t\t\t\t\t>\n\t\t\t\t</select>\n\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t</div>\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedSecond\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t>\n\t\t\t\t\t<option\n\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.seconds; let index = index\"\n\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t>{{ timepickerVariables.left.secondsLabel[index] }}</option\n\t\t\t\t\t>\n\t\t\t\t</select>\n\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t</div>\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.ampmModel\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t>\n\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\n\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\n\t\t\t\t</select>\n\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\n\t\t<div class=\"calendar-table\">\n\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t(!calendarVariables.right.minDate ||\n\t\t\t\t\t\t\t\t\tcalendarVariables.right.minDate.isBefore(\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.calendar.firstDay\n\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t!this.linkedCalendars\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div (click)=\"clickPrev(sideEnum.right)\" class=\"prev available\"></div>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t(!calendarVariables.right.minDate ||\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.minDate.isBefore(\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.calendar.firstDay\n\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t!this.linkedCalendars\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<th colspan=\"5\" class=\"month\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t<div class=\"dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t<select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.right)\">\n\t\t\t\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t[selected]=\"calendarVariables.right.dropdowns.currentMonth == m\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ locale.monthNames[m] }}\n\t\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t\t<select class=\"yearselect\" (change)=\"yearChanged($event, sideEnum.right)\">\n\t\t\t\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t[selected]=\"y === calendarVariables.right.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ y }}\n\t\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t!calendarVariables.right.maxDate ||\n\t\t\t\t\t\t\t\t(calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) &&\n\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker || true))\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div class=\"next available\" (click)=\"clickNext(sideEnum.right)\"></div>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t!calendarVariables.right.maxDate ||\n\t\t\t\t\t\t\t\t\t(calendarVariables.right.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.calendar.lastDay\n\t\t\t\t\t\t\t\t\t) &&\n\t\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker || true))\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr\n\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.right.calRows\"\n\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row].classList\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.right.calCols\"\n\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row][col]\"\n\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.right, row, col)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\tclass=\"select-item hourselect\"\n\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedHour\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t>\n\t\t\t\t\t<option\n\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.hours\"\n\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t>\n\t\t\t\t</select>\n\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t</div>\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedMinute\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t>\n\t\t\t\t\t<option\n\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.minutes; let index = index\"\n\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t>{{ timepickerVariables.right.minutesLabel[index] }}</option\n\t\t\t\t\t>\n\t\t\t\t</select>\n\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t</div>\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedSecond\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t>\n\t\t\t\t\t<option\n\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.seconds; let index = index\"\n\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t>{{ timepickerVariables.right.secondsLabel[index] }}</option\n\t\t\t\t\t>\n\t\t\t\t</select>\n\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t</div>\n\t\t\t<div class=\"select\">\n\t\t\t\t<select\n\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.ampmModel\"\n\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t>\n\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\n\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\n\t\t\t\t</select>\n\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"buttons\" *ngIf=\"!autoApply && (!rangesArray.length || (showCalInRanges && !singleDatePicker))\">\n\t\t<div class=\"bottom-buttons\">\n\t\t\t<div class=\"ranges\">\n\t\t\t\t<ul>\n\t\t\t\t\t<li *ngFor=\"let range of rangesArray\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"accesso-text-primary\"\n\t\t\t\t\t\t\t(click)=\"clickRange($event, range)\"\n\t\t\t\t\t\t\t[disabled]=\"disableRange(range)\"\n\t\t\t\t\t\t\t[ngClass]=\"{ active: range === chosenRange }\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ range }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"buttons_input\">\n\t\t\t\t<button type=\"button\" class=\"accesso-contained-primary\" (click)=\"clickApply($event)\">Done</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n",
        // tslint:disable-next-line:no-host-metadata-property
        host: {
            '(click)': 'handleInternalClick($event)'
        },
        encapsulation: ViewEncapsulation.None,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DaterangepickerComponent_1),
                multi: true
            }
        ],
        styles: ["td.hidden span,tr.hidden{display:none;cursor:default}td.available:not(.off):hover{border:2px solid #42a5f5}.ranges li{display:inline-block}div.available.prev{display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.6em;background-position:center;opacity:1;transition:background-color .2s;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);left:-20px;background-color:#fff;box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}div.available.next{transform:rotate(180deg);display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.6em;background-position:center;opacity:1;transition:background-color .2s;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);right:-20px;background-color:#fff;box-shadow:0 -4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}div.available:hover{background-color:#eee;border-color:transparent;color:inherit;cursor:pointer}.md-drppicker{position:absolute;color:inherit;background-color:#fff;border-radius:4px;width:420px;height:565px;padding:4px;margin-top:-10px;overflow:visible;z-index:1000;font-size:16px;box-shadow:0 8px 10px 1px rgba(0,0,0,.14),0 2px 8px 0 rgba(0,0,0,.12)}.md-drppicker.double{width:auto}.md-drppicker .bottom-buttons{height:40px;position:fixed;width:calc(100% - 35px);bottom:0;padding:15px;border-top:1px solid #eee}.md-drppicker.inline{position:relative;display:inline-block}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:''}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{transform:scale(1);transition:.1s ease-in-out;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{display:block}.md-drppicker.hidden{transition:.1s;transform:scale(0);transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:NaN}.md-drppicker.hidden.drops-up-center{transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:390px;margin:0 15px 15px}.md-drppicker .calendar .week-days th{height:28px;width:15px;color:#424242;font-size:16px;letter-spacing:.44px;line-height:28px;text-align:center;font-weight:500}.md-drppicker .calendar .month{height:28px;width:103px;color:#000;font-size:16px;letter-spacing:.44px;line-height:28px;text-align:center;font-weight:500}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;min-width:44px;height:44px}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border:1px solid #fff;padding:15px;border-radius:25px;background-color:#fff}.md-drppicker table{width:100%;margin:0;border-collapse:separate}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:25px;border:2px solid transparent;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.week,.md-drppicker th.week{font-size:80%;color:#ccc}.md-drppicker td{margin:.25em 0;opacity:.8;transition:background-color .2s;border-radius:2em;transform:scale(1)}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#e3f2fd;border-color:#e3f2fd;color:#000;opacity:1;border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:25px}.md-drppicker td.active{transition:background .3s ease-out;color:#fff;box-sizing:border-box;height:44px;width:44px;background-color:#42a5f5}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-repeat:no-repeat;background-size:10px;background-position-y:center;background-position-x:right;width:108px;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.md-drppicker .dropdowns select{display:inline-block;background-color:rgba(255,255,255,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{width:50px;margin:0 auto;background:#eee;border:1px solid #eee;padding:2px;outline:0;font-size:12px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{font-size:12px;height:auto;cursor:pointer;opacity:0;position:absolute;top:0;left:0;margin:0;padding:0}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{display:inline-block;width:auto;position:relative;font-family:inherit;background-color:transparent;padding:10px 10px 10px 0;font-size:18px;border-radius:0;border:none;border-bottom:1px solid rgba(0,0,0,.12)}.md-drppicker .calendar-time .select .select-item:after{position:absolute;top:18px;right:10px;width:0;height:0;padding:0;content:'';border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);pointer-events:none}.md-drppicker .calendar-time .select .select-item:focus{outline:0}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:25px;color:#555;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border:1px solid #08c;border-radius:25px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px;margin-right:20px}.md-drppicker .ranges ul li button{padding:8px 12px;width:100%;background:0 0;border:none;text-align:left;cursor:pointer}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}.md-drppicker .btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);background-color:#3f51b5;color:#ecf0f1;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.md-drppicker .btn:focus,.md-drppicker .btn:hover{background-color:#3f51b5}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{content:'';position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(236,240,241,.3);transform:translate(-50%,-50%)}.md-drppicker .btn:active:before{width:120%;padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{color:#000;background-color:#dcdcdc}.md-drppicker .clear{box-shadow:none;background-color:#fff!important}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}@media (min-width:564px){.md-drppicker{width:auto}.md-drppicker.single .calendar.left{clear:none}.md-drppicker.ltr{direction:ltr;text-align:left}.md-drppicker.ltr .calendar.left{clear:left}.md-drppicker.ltr .calendar.left .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;padding-right:12px}.md-drppicker.ltr .calendar.right{margin-left:0}.md-drppicker.ltr .calendar.right .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.ltr .left .md-drppicker_input,.md-drppicker.ltr .right .md-drppicker_input{padding-right:35px}.md-drppicker.ltr .calendar,.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl{direction:rtl;text-align:right}.md-drppicker.rtl .calendar.left{clear:right;margin-left:0}.md-drppicker.rtl .calendar.left .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.rtl .calendar.right{margin-right:0}.md-drppicker.rtl .calendar.right .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}.md-drppicker.rtl .calendar.left .calendar-table,.md-drppicker.rtl .left .md-drppicker_input{padding-left:12px}.md-drppicker.rtl .calendar,.md-drppicker.rtl .ranges{text-align:right;float:right}.drp-animate{transform:translate(0);transition:transform .2s,opacity .2s}.drp-animate.drp-picker-site-this{transition-timing-function:linear}.drp-animate.drp-animate-right{transform:translateX(10%);opacity:0}.drp-animate.drp-animate-left{transform:translateX(-10%);opacity:0}}@media (min-width:730px){.md-drppicker .ranges{width:auto}.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl .ranges{float:right}.md-drppicker .calendar.left{clear:none!important}}.field-row{width:100%;height:65px;border-bottom:1px solid #eee}.field-row mat-form-field{float:right;margin-right:15px}.field-row .mat-form-field-flex{height:55px;padding-top:10px}.cal-reset-btn{margin-top:15px;float:right;margin-right:15px}td.available:hover{border:2px solid #42a5f5}.mobile-datepicker ngx-daterangepicker-material{top:0;left:0}.mobile-datepicker .md-drppicker{height:calc(100vh);width:calc(100% - 8px);top:0!important;left:0!important;right:auto!important;overflow:hidden}.mobile-datepicker .md-drppicker .calendar-table{padding:0}.mobile-datepicker .md-drppicker .prev{top:85px;left:10px}.mobile-datepicker .md-drppicker .next{top:85px;left:calc(100vw - 55px)}.mobile-datepicker .field-row{width:100vw;height:65px}.mobile-datepicker .field-row mat-form-field{float:right;margin-right:10px;width:36%}.mobile-datepicker .field-row button{width:20%;margin-right:5px}.mobile-datepicker .calendar{text-align:center;margin:35px 0 0 -5px;max-width:100vw}"]
    }),
    tslib_1.__metadata("design:paramtypes", [ElementRef, ChangeDetectorRef, LocaleService])
], DaterangepickerComponent);
export { DaterangepickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2RhdGVyYW5nZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQ04saUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWhFLE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUzRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFFdkIsTUFBTSxDQUFOLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNuQix5QkFBYSxDQUFBO0lBQ2IsMkJBQWUsQ0FBQTtBQUNoQixDQUFDLEVBSFcsUUFBUSxLQUFSLFFBQVEsUUFHbkI7QUFvQkQsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBK0dwQyxZQUFvQixFQUFjLEVBQVUsSUFBdUIsRUFBVSxjQUE2QjtRQUF0RixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQTlHbEcsU0FBSSxHQUE2QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1FBRXBFLHNCQUFpQixHQUE4QixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3ZFLHdCQUFtQixHQUE4QixFQUFFLElB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ZDtJQUFSLEtBQUssRUFBRTs7a0VBQXlCO0FBQ3ZCO0lBQVQsTUFBTSxFQUFFO3NDQUFjLFlBQVk7NkRBQVM7QUFDbEM7SUFBVCxNQUFNLEVBQUU7c0NBQWUsWUFBWTs4REFBUztBQUNuQztJQUFULE1BQU0sRUFBRTtzQ0FBZSxZQUFZOzhEQUFTO0FBQ25DO0lBQVQsTUFBTSxFQUFFO3NDQUFtQixZQUFZO2tFQUFTO0FBQ3ZDO0lBQVQsTUFBTSxFQUFFO3NDQUFpQixZQUFZO2dFQUFTO0FBQ2pCO0lBQTdCLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztzQ0FBa0IsVUFBVTtpRUFBQztBQW1jMUQ7SUFEQyxLQUFLLEVBQUU7Ozs7NkRBR1A7QUFFRDtJQURDLEtBQUssRUFBRTs7Ozs0REFHUDtBQXJqQlcsd0JBQXdCO0lBbEJwQyxTQUFTLENBQUM7UUFDViw4Q0FBOEM7UUFDOUMsUUFBUSxFQUFFLDhCQUE4QjtRQUV4Qyxtc2pCQUErQztRQUMvQyxxREFBcUQ7UUFDckQsSUFBSSxFQUFFO1lBQ0wsU0FBUyxFQUFFLDZCQUE2QjtTQUN4QztRQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1FBQ3JDLFNBQVMsRUFBRTtZQUNWO2dCQUNDLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQXdCLENBQUM7Z0JBQ3ZELEtBQUssRUFBRSxJQUFJO2FBQ1g7U0FDRDs7S0FDRCxDQUFDOzZDQWdIdUIsVUFBVSxFQUFnQixpQkFBaUIsRUFBMEIsYUFBYTtHQS9HOUYsd0JBQXdCLENBNHdDcEM7U0E1d0NZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnQsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0Zm9yd2FyZFJlZixcblx0SW5wdXQsXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRWaWV3Q2hpbGQsXG5cdFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XG5cbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbmV4cG9ydCBlbnVtIFNpZGVFbnVtIHtcblx0bGVmdCA9ICdsZWZ0Jyxcblx0cmlnaHQgPSAncmlnaHQnXG59XG5cbkBDb21wb25lbnQoe1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG5cdHNlbGVjdG9yOiAnbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbCcsXG5cdHN0eWxlVXJsczogWycuL2RhdGVyYW5nZXBpY2tlci5jb21wb25lbnQuc2NzcyddLFxuXHR0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5odG1sJyxcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtbWV0YWRhdGEtcHJvcGVydHlcblx0aG9zdDoge1xuXHRcdCcoY2xpY2spJzogJ2hhbmRsZUludGVybmFsQ2xpY2soJGV2ZW50KSdcblx0fSxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQpLFxuXHRcdFx0bXVsdGk6IHRydWVcblx0XHR9XG5cdF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblx0cHJpdmF0ZSBfb2xkOiB7IHN0YXJ0OiBhbnk7IGVuZDogYW55IH0gPSB7IHN0YXJ0OiBudWxsLCBlbmQ6IG51bGwgfTtcblx0Y2hvc2VuTGFiZWw6IHN0cmluZztcblx0Y2FsZW5kYXJWYXJpYWJsZXM6IHsgbGVmdDogYW55OyByaWdodDogYW55IH0gPSB7IGxlZnQ6IHt9LCByaWdodDoge30gfTtcblx0dGltZXBpY2tlclZhcmlhYmxlczogeyBsZWZ0OiBhbnk7IHJpZ2h0OiBhbnkgfSA9IHsgbGVmdDoge30sIHJpZ2h0OiB7fSB9O1xuXHRkYXRlcmFuZ2VwaWNrZXI6IHsgc3RhcnQ6IEZvcm1Db250cm9sOyBlbmQ6IEZvcm1Db250cm9sIH0gPSB7IHN0YXJ0OiBuZXcgRm9ybUNvbnRyb2woKSwgZW5kOiBuZXcgRm9ybUNvbnRyb2woKSB9O1xuXHRhcHBseUJ0bjogeyBkaXNhYmxlZDogYm9vbGVhbiB9ID0geyBkaXNhYmxlZDogZmFsc2UgfTtcblx0QElucHV0KClcblx0c3RhcnREYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG5cdEBJbnB1dCgpXG5cdGVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG5cblx0QElucHV0KClcblx0ZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xuXHQvLyB1c2VkIGluIHRlbXBsYXRlIGZvciBjb21waWxlIHRpbWUgc3VwcG9ydCBvZiBlbnVtIHZhbHVlcy5cblx0c2lkZUVudW0gPSBTaWRlRW51bTtcblxuXHRASW5wdXQoKVxuXHRtaW5EYXRlOiBfbW9tZW50Lk1vbWVudCA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdG1heERhdGU6IF9tb21lbnQuTW9tZW50ID0gbnVsbDtcblx0QElucHV0KClcblx0YXV0b0FwcGx5OiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHNpbmdsZURhdGVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0c2hvd0Ryb3Bkb3duczogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRzaG93V2Vla051bWJlcnM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0c2hvd0lTT1dlZWtOdW1iZXJzOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGxpbmtlZENhbGVuZGFyczogQm9vbGVhbiA9ICF0aGlzLnNpbmdsZURhdGVQaWNrZXI7XG5cdEBJbnB1dCgpXG5cdGF1dG9VcGRhdGVJbnB1dDogQm9vbGVhbiA9IHRydWU7XG5cdEBJbnB1dCgpXG5cdGFsd2F5c1Nob3dDYWxlbmRhcnM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0bG9ja1N0YXJ0RGF0ZTogQm9vbGVhbiA9IGZhbHNlO1xuXHQvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0dGltZVBpY2tlckluY3JlbWVudCA9IDE7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXJTZWNvbmRzOiBCb29sZWFuID0gZmFsc2U7XG5cdC8vIGVuZCBvZiB0aW1lcGlja2VyIHZhcmlhYmxlc1xuXHRASW5wdXQoKVxuXHRzaG93Q2xlYXJCdXR0b246IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0Zmlyc3RNb250aERheUNsYXNzOiBzdHJpbmcgPSBudWxsO1xuXHRASW5wdXQoKVxuXHRsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0ZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZyA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdGZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0bGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmcgPSBudWxsO1xuXHRfbG9jYWxlOiBMb2NhbGVDb25maWcgPSB7fTtcblx0QElucHV0KCkgc2V0IGxvY2FsZSh2YWx1ZSkge1xuXHRcdHRoaXMuX2xvY2FsZSA9IHsgLi4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnZhbHVlIH07XG5cdH1cblx0Z2V0IGxvY2FsZSgpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLl9sb2NhbGU7XG5cdH1cblx0Ly8gY3VzdG9tIHJhbmdlc1xuXHRfcmFuZ2VzOiBhbnkgPSB7fTtcblxuXHRASW5wdXQoKSBzZXQgcmFuZ2VzKHZhbHVlKSB7XG5cdFx0dGhpcy5fcmFuZ2VzID0gdmFsdWU7XG5cdFx0dGhpcy5yZW5kZXJSYW5nZXMoKTtcblx0fVxuXHRnZXQgcmFuZ2VzKCk6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMuX3Jhbmdlcztcblx0fVxuXG5cdEBJbnB1dCgpXG5cdHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93Q2FuY2VsID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UgPSBmYWxzZTtcblx0QElucHV0KClcblx0c2hvd1JhbmdlTGFiZWxPbklucHV0ID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGN1c3RvbVJhbmdlRGlyZWN0aW9uID0gZmFsc2U7XG5cdGNob3NlblJhbmdlOiBzdHJpbmc7XG5cdHJhbmdlc0FycmF5OiBBcnJheTxhbnk+ID0gW107XG5cblx0Ly8gc29tZSBzdGF0ZSBpbmZvcm1hdGlvblxuXHRpc1Nob3duOiBCb29sZWFuID0gZmFsc2U7XG5cdGlubGluZSA9IHRydWU7XG5cdGxlZnRDYWxlbmRhcjogYW55ID0geyBtb250aDogbW9tZW50KCkgfTtcblx0cmlnaHRDYWxlbmRhcjogYW55ID0geyBtb250aDogbW9tZW50KCkuYWRkKDEsICdtb250aCcpIH07XG5cdHNob3dDYWxJblJhbmdlczogQm9vbGVhbiA9IGZhbHNlO1xuXG5cdG9wdGlvbnM6IGFueSA9IHt9OyAvLyBzaG91bGQgZ2V0IHNvbWUgb3B0IGZyb20gdXNlclxuXHRASW5wdXQoKSBkcm9wczogc3RyaW5nO1xuXHRASW5wdXQoKSBvcGVuczogc3RyaW5nO1xuXHRASW5wdXQoKSBjbG9zZU9uQXV0b0FwcGx5ID0gdHJ1ZTtcblx0QE91dHB1dCgpIGNob29zZWREYXRlOiBFdmVudEVtaXR0ZXI8T2JqZWN0Pjtcblx0QE91dHB1dCgpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XG5cdEBPdXRwdXQoKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuXHRAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XG5cdEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XG5cdEBWaWV3Q2hpbGQoJ3BpY2tlckNvbnRhaW5lcicpIHBpY2tlckNvbnRhaW5lcjogRWxlbWVudFJlZjtcblx0JGV2ZW50OiBhbnk7XG5cblx0Y29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSkge1xuXHRcdHRoaXMuY2hvb3NlZERhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5yYW5nZUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5kYXRlc1VwZGF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5zdGFydERhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRcdHRoaXMuZW5kRGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdH1cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLl9idWlsZExvY2FsZSgpO1xuXHRcdGNvbnN0IGRheXNPZldlZWsgPSBbLi4udGhpcy5sb2NhbGUuZGF5c09mV2Vla107XG5cdFx0aWYgKHRoaXMubG9jYWxlLmZpcnN0RGF5ICE9PSAwKSB7XG5cdFx0XHRsZXQgaXRlcmF0b3IgPSB0aGlzLmxvY2FsZS5maXJzdERheTtcblxuXHRcdFx0d2hpbGUgKGl0ZXJhdG9yID4gMCkge1xuXHRcdFx0XHRkYXlzT2ZXZWVrLnB1c2goZGF5c09mV2Vlay5zaGlmdCgpKTtcblx0XHRcdFx0aXRlcmF0b3ItLTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5sb2NhbGUuZGF5c09mV2VlayA9IGRheXNPZldlZWs7XG5cdFx0aWYgKHRoaXMuaW5saW5lKSB7XG5cdFx0XHR0aGlzLl9vbGQuc3RhcnQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdFx0dGhpcy5fb2xkLmVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKHRoaXMuc3RhcnREYXRlKTtcblx0XHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5lbmREYXRlICYmIHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5zZXRFbmREYXRlKHRoaXMuZW5kRGF0ZSk7XG5cdFx0XHR0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuXHRcdHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XG5cdFx0dGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XG5cdFx0dGhpcy5yZW5kZXJSYW5nZXMoKTtcblx0fVxuXHRyZW5kZXJSYW5nZXMoKSB7XG5cdFx0dGhpcy5yYW5nZXNBcnJheSA9IFtdO1xuXHRcdGxldCBzdGFydCwgZW5kO1xuXHRcdGlmICh0eXBlb2YgdGhpcy5yYW5nZXMgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHJhbmdlIGluIHRoaXMucmFuZ2VzKSB7XG5cdFx0XHRcdGlmICh0aGlzLnJhbmdlcy5oYXNPd25Qcm9wZXJ0eShyYW5nZSkpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHRoaXMucmFuZ2VzW3JhbmdlXVswXSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdHN0YXJ0ID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVswXSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3RhcnQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzBdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnJhbmdlc1tyYW5nZV1bMV0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzFdLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHN0YXJ0IG9yIGVuZCBkYXRlIGV4Y2VlZCB0aG9zZSBhbGxvd2VkIGJ5IHRoZSBtaW5EYXRlXG5cdFx0XHRcdFx0Ly8gb3B0aW9uLCBzaG9ydGVuIHRoZSByYW5nZSB0byB0aGUgYWxsb3dhYmxlIHBlcmlvZC5cblx0XHRcdFx0XHRpZiAodGhpcy5taW5EYXRlICYmIHN0YXJ0LmlzQmVmb3JlKHRoaXMubWluRGF0ZSkpIHtcblx0XHRcdFx0XHRcdHN0YXJ0ID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnN0IG1heERhdGUgPSB0aGlzLm1heERhdGU7XG5cdFx0XHRcdFx0aWYgKG1heERhdGUgJiYgZW5kLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcblx0XHRcdFx0XHRcdGVuZCA9IG1heERhdGUuY2xvbmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIGVuZCBvZiB0aGUgcmFuZ2UgaXMgYmVmb3JlIHRoZSBtaW5pbXVtIG9yIHRoZSBzdGFydCBvZiB0aGUgcmFuZ2UgaXNcblx0XHRcdFx0XHQvLyBhZnRlciB0aGUgbWF4aW11bSwgZG9uJ3QgZGlzcGxheSB0aGlzIHJhbmdlIG9wdGlvbiBhdCBhbGwuXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0KHRoaXMubWluRGF0ZSAmJiBlbmQuaXNCZWZvcmUodGhpcy5taW5EYXRlLCB0aGlzLnRpbWVQaWNrZXIgPyAnbWludXRlJyA6ICdkYXknKSkgfHxcblx0XHRcdFx0XHRcdChtYXhEYXRlICYmIHN0YXJ0LmlzQWZ0ZXIobWF4RGF0ZSwgdGhpcy50aW1lUGlja2VyID8gJ21pbnV0ZScgOiAnZGF5JykpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gU3VwcG9ydCB1bmljb2RlIGNoYXJzIGluIHRoZSByYW5nZSBuYW1lcy5cblx0XHRcdFx0XHRjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcblx0XHRcdFx0XHRlbGVtLmlubmVySFRNTCA9IHJhbmdlO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlSHRtbCA9IGVsZW0udmFsdWU7XG5cdFx0XHRcdFx0dGhpcy5yYW5nZXNbcmFuZ2VIdG1sXSA9IFtzdGFydCwgZW5kXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Zm9yIChjb25zdCByYW5nZSBpbiB0aGlzLnJhbmdlcykge1xuXHRcdFx0XHRpZiAodGhpcy5yYW5nZXMuaGFzT3duUHJvcGVydHkocmFuZ2UpKSB7XG5cdFx0XHRcdFx0dGhpcy5yYW5nZXNBcnJheS5wdXNoKHJhbmdlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcblx0XHRcdFx0dGhpcy5yYW5nZXNBcnJheS5wdXNoKHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWwpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zaG93Q2FsSW5SYW5nZXMgPSAhdGhpcy5yYW5nZXNBcnJheS5sZW5ndGggfHwgdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzO1xuXHRcdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdFx0dGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcblx0XHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlLmVuZE9mKCdkYXknKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmVuZGVyVGltZVBpY2tlcihzaWRlOiBTaWRlRW51bSkge1xuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5yaWdodCAmJiAhdGhpcy5lbmREYXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBzZWxlY3RlZCwgbWluRGF0ZTtcblx0XHRjb25zdCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHQoc2VsZWN0ZWQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpKSwgKG1pbkRhdGUgPSB0aGlzLm1pbkRhdGUpO1xuXHRcdH0gZWxzZSBpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQpIHtcblx0XHRcdChzZWxlY3RlZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpKSwgKG1pbkRhdGUgPSB0aGlzLnN0YXJ0RGF0ZSk7XG5cdFx0fVxuXHRcdGNvbnN0IHN0YXJ0ID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gMCA6IDE7XG5cdFx0Y29uc3QgZW5kID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gMjMgOiAxMjtcblx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0gPSB7XG5cdFx0XHRob3VyczogW10sXG5cdFx0XHRtaW51dGVzOiBbXSxcblx0XHRcdG1pbnV0ZXNMYWJlbDogW10sXG5cdFx0XHRzZWNvbmRzOiBbXSxcblx0XHRcdHNlY29uZHNMYWJlbDogW10sXG5cdFx0XHRkaXNhYmxlZEhvdXJzOiBbXSxcblx0XHRcdGRpc2FibGVkTWludXRlczogW10sXG5cdFx0XHRkaXNhYmxlZFNlY29uZHM6IFtdLFxuXHRcdFx0c2VsZWN0ZWRIb3VyOiAwLFxuXHRcdFx0c2VsZWN0ZWRNaW51dGU6IDAsXG5cdFx0XHRzZWxlY3RlZFNlY29uZDogMFxuXHRcdH07XG5cdFx0Ly8gZ2VuZXJhdGUgaG91cnNcblx0XHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcblx0XHRcdGxldCBpX2luXzI0ID0gaTtcblx0XHRcdGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG5cdFx0XHRcdGlfaW5fMjQgPSBzZWxlY3RlZC5ob3VyKCkgPj0gMTIgPyAoaSA9PT0gMTIgPyAxMiA6IGkgKyAxMikgOiBpID09PSAxMiA/IDAgOiBpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5ob3VyKGlfaW5fMjQpO1xuXHRcdFx0bGV0IGRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRpZiAobWluRGF0ZSAmJiB0aW1lLm1pbnV0ZSg1OSkuaXNCZWZvcmUobWluRGF0ZSkpIHtcblx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1heERhdGUgJiYgdGltZS5taW51dGUoMCkuaXNBZnRlcihtYXhEYXRlKSkge1xuXHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5ob3Vycy5wdXNoKGkpO1xuXHRcdFx0aWYgKGlfaW5fMjQgPT09IHNlbGVjdGVkLmhvdXIoKSAmJiAhZGlzYWJsZWQpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciA9IGk7XG5cdFx0XHR9IGVsc2UgaWYgKGRpc2FibGVkKSB7XG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZEhvdXJzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGdlbmVyYXRlIG1pbnV0ZXNcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpICs9IHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuXHRcdFx0Y29uc3QgcGFkZGVkID0gaSA8IDEwID8gJzAnICsgaSA6IGk7XG5cdFx0XHRjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5taW51dGUoaSk7XG5cblx0XHRcdGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0aWYgKG1pbkRhdGUgJiYgdGltZS5zZWNvbmQoNTkpLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG5cdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChtYXhEYXRlICYmIHRpbWUuc2Vjb25kKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcblx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLm1pbnV0ZXMucHVzaChpKTtcblx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzTGFiZWwucHVzaChwYWRkZWQpO1xuXHRcdFx0aWYgKHNlbGVjdGVkLm1pbnV0ZSgpID09PSBpICYmICFkaXNhYmxlZCkge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUgPSBpO1xuXHRcdFx0fSBlbHNlIGlmIChkaXNhYmxlZCkge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uZGlzYWJsZWRNaW51dGVzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGdlbmVyYXRlIHNlY29uZHNcblx0XHRpZiAodGhpcy50aW1lUGlja2VyU2Vjb25kcykge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHBhZGRlZCA9IGkgPCAxMCA/ICcwJyArIGkgOiBpO1xuXHRcdFx0XHRjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5zZWNvbmQoaSk7XG5cblx0XHRcdFx0bGV0IGRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmIChtaW5EYXRlICYmIHRpbWUuaXNCZWZvcmUobWluRGF0ZSkpIHtcblx0XHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG1heERhdGUgJiYgdGltZS5pc0FmdGVyKG1heERhdGUpKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlY29uZHMucHVzaChpKTtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlY29uZHNMYWJlbC5wdXNoKHBhZGRlZCk7XG5cdFx0XHRcdGlmIChzZWxlY3RlZC5zZWNvbmQoKSA9PT0gaSAmJiAhZGlzYWJsZWQpIHtcblx0XHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQgPSBpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGRpc2FibGVkKSB7XG5cdFx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkU2Vjb25kcy5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGdlbmVyYXRlIEFNL1BNXG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bWluRGF0ZSAmJlxuXHRcdFx0XHRzZWxlY3RlZFxuXHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0LmhvdXIoMTIpXG5cdFx0XHRcdFx0Lm1pbnV0ZSgwKVxuXHRcdFx0XHRcdC5zZWNvbmQoMClcblx0XHRcdFx0XHQuaXNCZWZvcmUobWluRGF0ZSlcblx0XHRcdCkge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1EaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0bWF4RGF0ZSAmJlxuXHRcdFx0XHRzZWxlY3RlZFxuXHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0LmhvdXIoMClcblx0XHRcdFx0XHQubWludXRlKDApXG5cdFx0XHRcdFx0LnNlY29uZCgwKVxuXHRcdFx0XHRcdC5pc0FmdGVyKG1heERhdGUpXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnBtRGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHNlbGVjdGVkLmhvdXIoKSA+PSAxMikge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsID0gJ1BNJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWwgPSAnQU0nO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcblx0fVxuXHRyZW5kZXJDYWxlbmRhcihzaWRlOiBTaWRlRW51bSkge1xuXHRcdC8vIHNpZGUgZW51bVxuXHRcdGNvbnN0IG1haW5DYWxlbmRhcjogYW55ID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdCA/IHRoaXMubGVmdENhbGVuZGFyIDogdGhpcy5yaWdodENhbGVuZGFyO1xuXHRcdGNvbnN0IG1vbnRoID0gbWFpbkNhbGVuZGFyLm1vbnRoLm1vbnRoKCk7XG5cdFx0Y29uc3QgeWVhciA9IG1haW5DYWxlbmRhci5tb250aC55ZWFyKCk7XG5cdFx0Y29uc3QgaG91ciA9IG1haW5DYWxlbmRhci5tb250aC5ob3VyKCk7XG5cdFx0Y29uc3QgbWludXRlID0gbWFpbkNhbGVuZGFyLm1vbnRoLm1pbnV0ZSgpO1xuXHRcdGNvbnN0IHNlY29uZCA9IG1haW5DYWxlbmRhci5tb250aC5zZWNvbmQoKTtcblx0XHRjb25zdCBkYXlzSW5Nb250aCA9IG1vbWVudChbeWVhciwgbW9udGhdKS5kYXlzSW5Nb250aCgpO1xuXHRcdGNvbnN0IGZpcnN0RGF5ID0gbW9tZW50KFt5ZWFyLCBtb250aCwgMV0pO1xuXHRcdGNvbnN0IGxhc3REYXkgPSBtb21lbnQoW3llYXIsIG1vbnRoLCBkYXlzSW5Nb250aF0pO1xuXHRcdGNvbnN0IGxhc3RNb250aCA9IG1vbWVudChmaXJzdERheSlcblx0XHRcdC5zdWJ0cmFjdCgxLCAnbW9udGgnKVxuXHRcdFx0Lm1vbnRoKCk7XG5cdFx0Y29uc3QgbGFzdFllYXIgPSBtb21lbnQoZmlyc3REYXkpXG5cdFx0XHQuc3VidHJhY3QoMSwgJ21vbnRoJylcblx0XHRcdC55ZWFyKCk7XG5cdFx0Y29uc3QgZGF5c0luTGFzdE1vbnRoID0gbW9tZW50KFtsYXN0WWVhciwgbGFzdE1vbnRoXSkuZGF5c0luTW9udGgoKTtcblx0XHRjb25zdCBkYXlPZldlZWsgPSBmaXJzdERheS5kYXkoKTtcblx0XHQvLyBpbml0aWFsaXplIGEgNiByb3dzIHggNyBjb2x1bW5zIGFycmF5IGZvciB0aGUgY2FsZW5kYXJcblx0XHRjb25zdCBjYWxlbmRhcjogYW55ID0gW107XG5cdFx0Y2FsZW5kYXIuZmlyc3REYXkgPSBmaXJzdERheTtcblx0XHRjYWxlbmRhci5sYXN0RGF5ID0gbGFzdERheTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG5cdFx0XHRjYWxlbmRhcltpXSA9IFtdO1xuXHRcdH1cblxuXHRcdC8vIHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGRhdGUgb2JqZWN0c1xuXHRcdGxldCBzdGFydERheSA9IGRheXNJbkxhc3RNb250aCAtIGRheU9mV2VlayArIHRoaXMubG9jYWxlLmZpcnN0RGF5ICsgMTtcblx0XHRpZiAoc3RhcnREYXkgPiBkYXlzSW5MYXN0TW9udGgpIHtcblx0XHRcdHN0YXJ0RGF5IC09IDc7XG5cdFx0fVxuXG5cdFx0aWYgKGRheU9mV2VlayA9PT0gdGhpcy5sb2NhbGUuZmlyc3REYXkpIHtcblx0XHRcdHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gNjtcblx0XHR9XG5cblx0XHRsZXQgY3VyRGF0ZSA9IG1vbWVudChbbGFzdFllYXIsIGxhc3RNb250aCwgc3RhcnREYXksIDEyLCBtaW51dGUsIHNlY29uZF0pO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGNvbCA9IDAsIHJvdyA9IDA7IGkgPCA0MjsgaSsrLCBjb2wrKywgY3VyRGF0ZSA9IG1vbWVudChjdXJEYXRlKS5hZGQoMjQsICdob3VyJykpIHtcblx0XHRcdGlmIChpID4gMCAmJiBjb2wgJSA3ID09PSAwKSB7XG5cdFx0XHRcdGNvbCA9IDA7XG5cdFx0XHRcdHJvdysrO1xuXHRcdFx0fVxuXHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdID0gY3VyRGF0ZVxuXHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHQuaG91cihob3VyKVxuXHRcdFx0XHQubWludXRlKG1pbnV0ZSlcblx0XHRcdFx0LnNlY29uZChzZWNvbmQpO1xuXHRcdFx0Y3VyRGF0ZS5ob3VyKDEyKTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHR0aGlzLm1pbkRhdGUgJiZcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLm1pbkRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgJiZcblx0XHRcdFx0c2lkZSA9PT0gJ2xlZnQnXG5cdFx0XHQpIHtcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0dGhpcy5tYXhEYXRlICYmXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5tYXhEYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkgJiZcblx0XHRcdFx0c2lkZSA9PT0gJ3JpZ2h0J1xuXHRcdFx0KSB7XG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIG1ha2UgdGhlIGNhbGVuZGFyIG9iamVjdCBhdmFpbGFibGUgdG8gaG92ZXJEYXRlL2NsaWNrRGF0ZVxuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5jYWxlbmRhciA9IGNhbGVuZGFyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcblx0XHR9XG5cdFx0Ly9cblx0XHQvLyBEaXNwbGF5IHRoZSBjYWxlbmRhclxuXHRcdC8vXG5cdFx0Y29uc3QgbWluRGF0ZSA9IHNpZGUgPT09ICdsZWZ0JyA/IHRoaXMubWluRGF0ZSA6IHRoaXMuc3RhcnREYXRlO1xuXHRcdGxldCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xuXHRcdC8vIGFkanVzdCBtYXhEYXRlIHRvIHJlZmxlY3QgdGhlIGRhdGVMaW1pdCBzZXR0aW5nIGluIG9yZGVyIHRvXG5cdFx0Ly8gZ3JleSBvdXQgZW5kIGRhdGVzIGJleW9uZCB0aGUgZGF0ZUxpbWl0XG5cdFx0aWYgKHRoaXMuZW5kRGF0ZSA9PT0gbnVsbCAmJiB0aGlzLmRhdGVMaW1pdCkge1xuXHRcdFx0Y29uc3QgbWF4TGltaXQgPSB0aGlzLnN0YXJ0RGF0ZVxuXHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHQuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5Jylcblx0XHRcdFx0LmVuZE9mKCdkYXknKTtcblx0XHRcdGlmICghbWF4RGF0ZSB8fCBtYXhMaW1pdC5pc0JlZm9yZShtYXhEYXRlKSkge1xuXHRcdFx0XHRtYXhEYXRlID0gbWF4TGltaXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0gPSB7XG5cdFx0XHRtb250aDogbW9udGgsXG5cdFx0XHR5ZWFyOiB5ZWFyLFxuXHRcdFx0aG91cjogaG91cixcblx0XHRcdG1pbnV0ZTogbWludXRlLFxuXHRcdFx0c2Vjb25kOiBzZWNvbmQsXG5cdFx0XHRkYXlzSW5Nb250aDogZGF5c0luTW9udGgsXG5cdFx0XHRmaXJzdERheTogZmlyc3REYXksXG5cdFx0XHRsYXN0RGF5OiBsYXN0RGF5LFxuXHRcdFx0bGFzdE1vbnRoOiBsYXN0TW9udGgsXG5cdFx0XHRsYXN0WWVhcjogbGFzdFllYXIsXG5cdFx0XHRkYXlzSW5MYXN0TW9udGg6IGRheXNJbkxhc3RNb250aCxcblx0XHRcdGRheU9mV2VlazogZGF5T2ZXZWVrLFxuXHRcdFx0Ly8gb3RoZXIgdmFyc1xuXHRcdFx0Y2FsUm93czogQXJyYXkuZnJvbShBcnJheSg2KS5rZXlzKCkpLFxuXHRcdFx0Y2FsQ29sczogQXJyYXkuZnJvbShBcnJheSg3KS5rZXlzKCkpLFxuXHRcdFx0Y2xhc3Nlczoge30sXG5cdFx0XHRtaW5EYXRlOiBtaW5EYXRlLFxuXHRcdFx0bWF4RGF0ZTogbWF4RGF0ZSxcblx0XHRcdGNhbGVuZGFyOiBjYWxlbmRhclxuXHRcdH07XG5cdFx0aWYgKHRoaXMuc2hvd0Ryb3Bkb3ducykge1xuXHRcdFx0Y29uc3QgY3VycmVudE1vbnRoID0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRZZWFyID0gY2FsZW5kYXJbMV1bMV0ueWVhcigpO1xuXHRcdFx0Y29uc3QgcmVhbEN1cnJlbnRZZWFyID0gbW9tZW50KCkueWVhcigpO1xuXHRcdFx0Y29uc3QgbWF4WWVhciA9IChtYXhEYXRlICYmIG1heERhdGUueWVhcigpKSB8fCByZWFsQ3VycmVudFllYXIgKyA1O1xuXHRcdFx0Y29uc3QgbWluWWVhciA9IChtaW5EYXRlICYmIG1pbkRhdGUueWVhcigpKSB8fCByZWFsQ3VycmVudFllYXIgLSA1MDtcblx0XHRcdGNvbnN0IGluTWluWWVhciA9IGN1cnJlbnRZZWFyID09PSBtaW5ZZWFyO1xuXHRcdFx0Y29uc3QgaW5NYXhZZWFyID0gY3VycmVudFllYXIgPT09IG1heFllYXI7XG5cdFx0XHRjb25zdCB5ZWFycyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgeSA9IG1pblllYXI7IHkgPD0gbWF4WWVhcjsgeSsrKSB7XG5cdFx0XHRcdHllYXJzLnB1c2goeSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducyA9IHtcblx0XHRcdFx0Y3VycmVudE1vbnRoOiBjdXJyZW50TW9udGgsXG5cdFx0XHRcdGN1cnJlbnRZZWFyOiBjdXJyZW50WWVhcixcblx0XHRcdFx0bWF4WWVhcjogbWF4WWVhcixcblx0XHRcdFx0bWluWWVhcjogbWluWWVhcixcblx0XHRcdFx0aW5NaW5ZZWFyOiBpbk1pblllYXIsXG5cdFx0XHRcdGluTWF4WWVhcjogaW5NYXhZZWFyLFxuXHRcdFx0XHRtb250aEFycmF5czogQXJyYXkuZnJvbShBcnJheSgxMikua2V5cygpKSxcblx0XHRcdFx0eWVhckFycmF5czogeWVhcnNcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dGhpcy5fYnVpbGRDZWxscyhjYWxlbmRhciwgc2lkZSk7XG5cdH1cblx0c2V0U3RhcnREYXRlKHN0YXJ0RGF0ZSkge1xuXHRcdGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnc3RyaW5nJykge1xuXHRcdFx0dGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlLm1pbnV0ZShcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnRcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubWluRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpKSB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcblx0XHRcdFx0dGhpcy5zdGFydERhdGUubWludXRlKFxuXHRcdFx0XHRcdE1hdGgucm91bmQodGhpcy5zdGFydERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5tYXhEYXRlLmNsb25lKCk7XG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuXHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5taW51dGUoXG5cdFx0XHRcdFx0TWF0aC5mbG9vcih0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnRcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNTaG93bikge1xuXHRcdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdFx0fVxuXHRcdHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KHsgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSB9KTtcblx0XHR0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuXHR9XG5cblx0c2V0RW5kRGF0ZShlbmREYXRlKSB7XG5cdFx0aWYgKHR5cGVvZiBlbmREYXRlID09PSAnc3RyaW5nJykge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUsIHRoaXMubG9jYWxlLmZvcm1hdCk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBlbmREYXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlXG5cdFx0XHRcdC5hZGQoMSwgJ2QnKVxuXHRcdFx0XHQuc3RhcnRPZignZGF5Jylcblx0XHRcdFx0LnN1YnRyYWN0KDEsICdzZWNvbmQnKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuXHRcdFx0dGhpcy5lbmREYXRlLm1pbnV0ZShcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLmVuZERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmVuZERhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUpKSB7XG5cdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5lbmREYXRlLmlzQWZ0ZXIodGhpcy5tYXhEYXRlKSkge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5tYXhEYXRlLmNsb25lKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0dGhpcy5kYXRlTGltaXQgJiZcblx0XHRcdHRoaXMuc3RhcnREYXRlXG5cdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdC5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKVxuXHRcdFx0XHQuaXNCZWZvcmUodGhpcy5lbmREYXRlKVxuXHRcdCkge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNTaG93bikge1xuXHRcdFx0Ly8gdGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdFx0fVxuXHRcdHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdCh7IGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcblx0XHR0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuXHR9XG5cdEBJbnB1dCgpXG5cdGlzSW52YWxpZERhdGUoZGF0ZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRASW5wdXQoKVxuXHRpc0N1c3RvbURhdGUoZGF0ZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHVwZGF0ZVZpZXcoKSB7XG5cdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHR9XG5cblx0dXBkYXRlTW9udGhzSW5WaWV3KCkge1xuXHRcdGlmICh0aGlzLmVuZERhdGUpIHtcblx0XHRcdC8vIGlmIGJvdGggZGF0ZXMgYXJlIHZpc2libGUgYWxyZWFkeSwgZG8gbm90aGluZ1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQhdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoICYmXG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCAmJlxuXHRcdFx0XHQoKHRoaXMuc3RhcnREYXRlICYmXG5cdFx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIgJiZcblx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpIHx8XG5cdFx0XHRcdFx0KHRoaXMuc3RhcnREYXRlICYmXG5cdFx0XHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIgJiZcblx0XHRcdFx0XHRcdHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpKSAmJlxuXHRcdFx0XHQodGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSB8fFxuXHRcdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSkge1xuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdCF0aGlzLmxpbmtlZENhbGVuZGFycyAmJlxuXHRcdFx0XHRcdCh0aGlzLmVuZERhdGUubW9udGgoKSAhPT0gdGhpcy5zdGFydERhdGUubW9udGgoKSB8fCB0aGlzLmVuZERhdGUueWVhcigpICE9PSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpLmRhdGUoMik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGVcblx0XHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0XHQuZGF0ZSgyKVxuXHRcdFx0XHRcdFx0LmFkZCgxLCAnbW9udGgnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpICE9PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSAmJlxuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgIT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlXG5cdFx0XHRcdFx0LmNsb25lKClcblx0XHRcdFx0XHQuZGF0ZSgyKVxuXHRcdFx0XHRcdC5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5saW5rZWRDYWxlbmRhcnMgJiYgIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPiB0aGlzLm1heERhdGUpIHtcblx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMubWF4RGF0ZVxuXHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHQuZGF0ZSgyKVxuXHRcdFx0XHQuc3VidHJhY3QoMSwgJ21vbnRoJyk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiAgVGhpcyBpcyByZXNwb25zaWJsZSBmb3IgdXBkYXRpbmcgdGhlIGNhbGVuZGFyc1xuXHQgKi9cblx0dXBkYXRlQ2FsZW5kYXJzKCkge1xuXHRcdHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XG5cdFx0dGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XG5cblx0XHRpZiAodGhpcy5lbmREYXRlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0fVxuXHR1cGRhdGVFbGVtZW50KCkge1xuXHRcdGlmICghdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XG5cdFx0XHRpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG5cdFx0XHRcdC8vIGlmIHdlIHVzZSByYW5nZXMgYW5kIHNob3VsZCBzaG93IHJhbmdlIGxhYmVsIG9uIGlucHV0XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCAmJlxuXHRcdFx0XHRcdHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0ID09PSB0cnVlICYmXG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5SYW5nZSAmJlxuXHRcdFx0XHRcdHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWwgIT09IHRoaXMuY2hvc2VuUmFuZ2Vcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5MYWJlbCA9IHRoaXMuY2hvc2VuUmFuZ2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5MYWJlbCA9XG5cdFx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQodGhpcy5sb2NhbGUuZm9ybWF0KSArXG5cdFx0XHRcdFx0XHR0aGlzLmxvY2FsZS5zZXBhcmF0b3IgK1xuXHRcdFx0XHRcdFx0dGhpcy5lbmREYXRlLmZvcm1hdCh0aGlzLmxvY2FsZS5mb3JtYXQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0aGlzLmF1dG9VcGRhdGVJbnB1dCkge1xuXHRcdFx0dGhpcy5jaG9zZW5MYWJlbCA9IHRoaXMuc3RhcnREYXRlLmZvcm1hdCh0aGlzLmxvY2FsZS5mb3JtYXQpO1xuXHRcdH1cblx0fVxuXG5cdHJlbW92ZSgpIHtcblx0XHR0aGlzLmlzU2hvd24gPSBmYWxzZTtcblx0fVxuXHQvKipcblx0ICogdGhpcyBzaG91bGQgY2FsY3VsYXRlIHRoZSBsYWJlbFxuXHQgKi9cblx0Y2FsY3VsYXRlQ2hvc2VuTGFiZWwoKSB7XG5cdFx0aWYgKCF0aGlzLmxvY2FsZSB8fCAhdGhpcy5sb2NhbGUuc2VwYXJhdG9yKSB7XG5cdFx0XHR0aGlzLl9idWlsZExvY2FsZSgpO1xuXHRcdH1cblx0XHRsZXQgY3VzdG9tUmFuZ2UgPSB0cnVlO1xuXHRcdGxldCBpID0gMDtcblx0XHRpZiAodGhpcy5yYW5nZXNBcnJheS5sZW5ndGggPiAwKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHJhbmdlIGluIHRoaXMucmFuZ2VzKSB7XG5cdFx0XHRcdGlmICh0aGlzLnJhbmdlc1tyYW5nZV0pIHtcblx0XHRcdFx0XHRpZiAodGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmb3JtYXQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gJ1lZWVktTU0tREQgSEg6bW06c3MnIDogJ1lZWVktTU0tREQgSEg6bW0nO1xuXHRcdFx0XHRcdFx0Ly8gaWdub3JlIHRpbWVzIHdoZW4gY29tcGFyaW5nIGRhdGVzIGlmIHRpbWUgcGlja2VyIHNlY29uZHMgaXMgbm90IGVuYWJsZWRcblx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0dGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCkgPT09IHRoaXMucmFuZ2VzW3JhbmdlXVswXS5mb3JtYXQoZm9ybWF0KSAmJlxuXHRcdFx0XHRcdFx0XHR0aGlzLmVuZERhdGUuZm9ybWF0KGZvcm1hdCkgPT09IHRoaXMucmFuZ2VzW3JhbmdlXVsxXS5mb3JtYXQoZm9ybWF0KVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdGN1c3RvbVJhbmdlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHRoaXMuY2hvc2VuUmFuZ2UgPSB0aGlzLnJhbmdlc0FycmF5W2ldO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gaWdub3JlIHRpbWVzIHdoZW4gY29tcGFyaW5nIGRhdGVzIGlmIHRpbWUgcGlja2VyIGlzIG5vdCBlbmFibGVkXG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMF0uZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcblx0XHRcdFx0XHRcdFx0dGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMV0uZm9ybWF0KCdZWVlZLU1NLUREJylcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRjdXN0b21SYW5nZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmNob3NlblJhbmdlID0gdGhpcy5yYW5nZXNBcnJheVtpXTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGN1c3RvbVJhbmdlKSB7XG5cdFx0XHRcdGlmICh0aGlzLnNob3dDdXN0b21SYW5nZUxhYmVsKSB7XG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5SYW5nZSA9IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5SYW5nZSA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaWYgY3VzdG9tIGxhYmVsOiBzaG93IGNhbGVuZGFyXG5cdFx0XHRcdHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcblx0fVxuXG5cdGNsaWNrQXBwbHkoZT8pIHtcblx0XHRpZiAoIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiAhdGhpcy5lbmREYXRlKSB7XG5cdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdFx0dGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5pc0ludmFsaWREYXRlICYmIHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xuXHRcdFx0Ly8gZ2V0IGlmIHRoZXJlIGFyZSBpbnZhbGlkIGRhdGUgYmV0d2VlbiByYW5nZVxuXHRcdFx0Y29uc3QgZCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0XHR3aGlsZSAoZC5pc0JlZm9yZSh0aGlzLmVuZERhdGUpKSB7XG5cdFx0XHRcdGlmICh0aGlzLmlzSW52YWxpZERhdGUoZCkpIHtcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUgPSBkLnN1YnRyYWN0KDEsICdkYXlzJyk7XG5cdFx0XHRcdFx0dGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGQuYWRkKDEsICdkYXlzJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0aGlzLmNob3NlbkxhYmVsKSB7XG5cdFx0XHR0aGlzLmNob29zZWREYXRlLmVtaXQoeyBjaG9zZW5MYWJlbDogdGhpcy5jaG9zZW5MYWJlbCwgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSwgZW5kRGF0ZTogdGhpcy5lbmREYXRlIH0pO1xuXHRcdH1cblxuXHRcdHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQoeyBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLCBlbmREYXRlOiB0aGlzLmVuZERhdGUgfSk7XG5cdFx0aWYgKGUgfHwgKHRoaXMuY2xvc2VPbkF1dG9BcHBseSAmJiAhZSkpIHtcblx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGNsaWNrQ2FuY2VsKGUpIHtcblx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuX29sZC5zdGFydDtcblx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLl9vbGQuZW5kO1xuXHRcdGlmICh0aGlzLmlubGluZSkge1xuXHRcdFx0dGhpcy51cGRhdGVWaWV3KCk7XG5cdFx0fVxuXHRcdHRoaXMuaGlkZSgpO1xuXHR9XG5cdC8qKlxuXHQgKiBjYWxsZWQgd2hlbiBtb250aCBpcyBjaGFuZ2VkXG5cdCAqIEBwYXJhbSBtb250aEV2ZW50IGdldCB2YWx1ZSBpbiBldmVudC50YXJnZXQudmFsdWVcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuXHQgKi9cblx0bW9udGhDaGFuZ2VkKG1vbnRoRXZlbnQ6IGFueSwgc2lkZTogU2lkZUVudW0pIHtcblx0XHRjb25zdCB5ZWFyID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXI7XG5cdFx0Y29uc3QgbW9udGggPSBwYXJzZUludChtb250aEV2ZW50LnRhcmdldC52YWx1ZSwgMTApO1xuXHRcdHRoaXMubW9udGhPclllYXJDaGFuZ2VkKG1vbnRoLCB5ZWFyLCBzaWRlKTtcblx0fVxuXHQvKipcblx0ICogY2FsbGVkIHdoZW4geWVhciBpcyBjaGFuZ2VkXG5cdCAqIEBwYXJhbSB5ZWFyRXZlbnQgZ2V0IHZhbHVlIGluIGV2ZW50LnRhcmdldC52YWx1ZVxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG5cdCAqL1xuXHR5ZWFyQ2hhbmdlZCh5ZWFyRXZlbnQ6IGFueSwgc2lkZTogU2lkZUVudW0pIHtcblx0XHRjb25zdCBtb250aCA9IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRNb250aDtcblx0XHRjb25zdCB5ZWFyID0gcGFyc2VJbnQoeWVhckV2ZW50LnRhcmdldC52YWx1ZSwgMTApO1xuXHRcdHRoaXMubW9udGhPclllYXJDaGFuZ2VkKG1vbnRoLCB5ZWFyLCBzaWRlKTtcblx0fVxuXHQvKipcblx0ICogY2FsbGVkIHdoZW4gdGltZSBpcyBjaGFuZ2VkXG5cdCAqIEBwYXJhbSB0aW1lRXZlbnQgIGFuIGV2ZW50XG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcblx0ICovXG5cdHRpbWVDaGFuZ2VkKHRpbWVFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuXHRcdGxldCBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xuXHRcdGNvbnN0IG1pbnV0ZSA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZE1pbnV0ZSwgMTApO1xuXHRcdGNvbnN0IHNlY29uZCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQsIDEwKSA6IDA7XG5cblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xuXHRcdFx0Y29uc3QgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XG5cdFx0XHRpZiAoYW1wbSA9PT0gJ1BNJyAmJiBob3VyIDwgMTIpIHtcblx0XHRcdFx0aG91ciArPSAxMjtcblx0XHRcdH1cblx0XHRcdGlmIChhbXBtID09PSAnQU0nICYmIGhvdXIgPT09IDEyKSB7XG5cdFx0XHRcdGhvdXIgPSAwO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHRjb25zdCBzdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0XHRzdGFydC5ob3VyKGhvdXIpO1xuXHRcdFx0c3RhcnQubWludXRlKG1pbnV0ZSk7XG5cdFx0XHRzdGFydC5zZWNvbmQoc2Vjb25kKTtcblx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKHN0YXJ0KTtcblx0XHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcblx0XHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcblx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdHRoaXMuZW5kRGF0ZSAmJlxuXHRcdFx0XHR0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG5cdFx0XHRcdHRoaXMuZW5kRGF0ZS5pc0JlZm9yZShzdGFydClcblx0XHRcdCkge1xuXHRcdFx0XHR0aGlzLnNldEVuZERhdGUoc3RhcnQuY2xvbmUoKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0aGlzLmVuZERhdGUpIHtcblx0XHRcdGNvbnN0IGVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuXHRcdFx0ZW5kLmhvdXIoaG91cik7XG5cdFx0XHRlbmQubWludXRlKG1pbnV0ZSk7XG5cdFx0XHRlbmQuc2Vjb25kKHNlY29uZCk7XG5cdFx0XHR0aGlzLnNldEVuZERhdGUoZW5kKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG5cblx0XHQvLyByZS1yZW5kZXIgdGhlIHRpbWUgcGlja2VycyBiZWNhdXNlIGNoYW5naW5nIG9uZSBzZWxlY3Rpb24gY2FuIGFmZmVjdCB3aGF0J3MgZW5hYmxlZCBpbiBhbm90aGVyXG5cdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG5cblx0XHRpZiAodGhpcy5hdXRvQXBwbHkpIHtcblx0XHRcdHRoaXMuY2xpY2tBcHBseSgpO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogIGNhbGwgd2hlbiBtb250aCBvciB5ZWFyIGNoYW5nZWRcblx0ICogQHBhcmFtIG1vbnRoIG1vbnRoIG51bWJlciAwIC0xMVxuXHQgKiBAcGFyYW0geWVhciB5ZWFyIGVnOiAxOTk1XG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcblx0ICovXG5cdG1vbnRoT3JZZWFyQ2hhbmdlZChtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIsIHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0Y29uc3QgaXNMZWZ0ID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdDtcblxuXHRcdGlmICghaXNMZWZ0KSB7XG5cdFx0XHRpZiAoeWVhciA8IHRoaXMuc3RhcnREYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5zdGFydERhdGUueWVhcigpICYmIG1vbnRoIDwgdGhpcy5zdGFydERhdGUubW9udGgoKSkpIHtcblx0XHRcdFx0bW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5tb250aCgpO1xuXHRcdFx0XHR5ZWFyID0gdGhpcy5zdGFydERhdGUueWVhcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1pbkRhdGUpIHtcblx0XHRcdGlmICh5ZWFyIDwgdGhpcy5taW5EYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5taW5EYXRlLnllYXIoKSAmJiBtb250aCA8IHRoaXMubWluRGF0ZS5tb250aCgpKSkge1xuXHRcdFx0XHRtb250aCA9IHRoaXMubWluRGF0ZS5tb250aCgpO1xuXHRcdFx0XHR5ZWFyID0gdGhpcy5taW5EYXRlLnllYXIoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5tYXhEYXRlKSB7XG5cdFx0XHRpZiAoeWVhciA+IHRoaXMubWF4RGF0ZS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMubWF4RGF0ZS55ZWFyKCkgJiYgbW9udGggPiB0aGlzLm1heERhdGUubW9udGgoKSkpIHtcblx0XHRcdFx0bW9udGggPSB0aGlzLm1heERhdGUubW9udGgoKTtcblx0XHRcdFx0eWVhciA9IHRoaXMubWF4RGF0ZS55ZWFyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRZZWFyID0geWVhcjtcblx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50TW9udGggPSBtb250aDtcblx0XHRpZiAoaXNMZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChtb250aCkueWVhcih5ZWFyKTtcblx0XHRcdGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5jbG9uZSgpLmFkZCgxLCAnbW9udGgnKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xuXHRcdFx0aWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmNsb25lKCkuc3VidHJhY3QoMSwgJ21vbnRoJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xpY2sgb24gcHJldmlvdXMgbW9udGhcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxuXHQgKi9cblx0Y2xpY2tQcmV2KHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0aWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcblx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xuXHRcdFx0aWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHR9XG5cdC8qKlxuXHQgKiBDbGljayBvbiBuZXh0IG1vbnRoXG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHQgY2FsZW5kYXJcblx0ICovXG5cdGNsaWNrTmV4dChzaWRlOiBTaWRlRW51bSkge1xuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0XHRpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguYWRkKDEsICdtb250aCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHR9XG5cdC8qKlxuXHQgKiBXaGVuIHNlbGVjdGluZyBhIGRhdGVcblx0ICogQHBhcmFtIGUgZXZlbnQ6IGdldCB2YWx1ZSBieSBlLnRhcmdldC52YWx1ZVxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG5cdCAqIEBwYXJhbSByb3cgcm93IHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxuXHQgKiBAcGFyYW0gY29sIGNvbCBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcblx0ICovXG5cdGNsaWNrRGF0ZShlLCBzaWRlOiBTaWRlRW51bSwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XG5cdFx0aWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdURCcpIHtcblx0XHRcdGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhdmFpbGFibGUnKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnU1BBTicpIHtcblx0XHRcdGlmICghZS50YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2F2YWlsYWJsZScpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmNob3NlblJhbmdlID0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbDtcblx0XHR9XG5cblx0XHRsZXQgZGF0ZSA9XG5cdFx0XHRzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXJbcm93XVtjb2xdIDogdGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXTtcblxuXHRcdGlmIChcblx0XHRcdCh0aGlzLmVuZERhdGUgfHwgKGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUsICdkYXknKSAmJiB0aGlzLmN1c3RvbVJhbmdlRGlyZWN0aW9uID09PSBmYWxzZSkpICYmXG5cdFx0XHR0aGlzLmxvY2tTdGFydERhdGUgPT09IGZhbHNlXG5cdFx0KSB7XG5cdFx0XHQvLyBwaWNraW5nIHN0YXJ0XG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHRcdGRhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgU2lkZUVudW0ubGVmdCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmVuZERhdGUgPSBudWxsO1xuXHRcdFx0dGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcblx0XHR9IGVsc2UgaWYgKCF0aGlzLmVuZERhdGUgJiYgZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkgJiYgdGhpcy5jdXN0b21SYW5nZURpcmVjdGlvbiA9PT0gZmFsc2UpIHtcblx0XHRcdC8vIHNwZWNpYWwgY2FzZTogY2xpY2tpbmcgdGhlIHNhbWUgZGF0ZSBmb3Igc3RhcnQvZW5kLFxuXHRcdFx0Ly8gYnV0IHRoZSB0aW1lIG9mIHRoZSBlbmQgZGF0ZSBpcyBiZWZvcmUgdGhlIHN0YXJ0IGRhdGVcblx0XHRcdHRoaXMuc2V0RW5kRGF0ZSh0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGlja2luZyBlbmRcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdFx0ZGF0ZSA9IHRoaXMuX2dldERhdGVXaXRoVGltZShkYXRlLCBTaWRlRW51bS5yaWdodCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpID09PSB0cnVlICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcblx0XHRcdFx0dGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuc2V0RW5kRGF0ZShkYXRlLmNsb25lKCkpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5hdXRvQXBwbHkpIHtcblx0XHRcdFx0dGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuXHRcdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyKSB7XG5cdFx0XHR0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUpO1xuXHRcdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdFx0XHRpZiAodGhpcy5hdXRvQXBwbHkpIHtcblx0XHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVWaWV3KCk7XG5cblx0XHRpZiAodGhpcy5hdXRvQXBwbHkgJiYgdGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG5cdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcblx0XHR9XG5cblx0XHQvLyBUaGlzIGlzIHRvIGNhbmNlbCB0aGUgYmx1ciBldmVudCBoYW5kbGVyIGlmIHRoZSBtb3VzZSB3YXMgaW4gb25lIG9mIHRoZSBpbnB1dHNcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG5cdC8qKlxuXHQgKiAgQ2xpY2sgb24gdGhlIGN1c3RvbSByYW5nZVxuXHQgKiBAcGFyYW0gZTogRXZlbnRcblx0ICogQHBhcmFtIGxhYmVsXG5cdCAqL1xuXHRjbGlja1JhbmdlKGUsIGxhYmVsKSB7XG5cdFx0dGhpcy5jaG9zZW5SYW5nZSA9IGxhYmVsO1xuXHRcdGlmIChsYWJlbCA9PT0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCkge1xuXHRcdFx0dGhpcy5pc1Nob3duID0gdHJ1ZTsgLy8gc2hvdyBjYWxlbmRhcnNcblx0XHRcdHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZGF0ZXMgPSB0aGlzLnJhbmdlc1tsYWJlbF07XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZSA9IGRhdGVzWzBdLmNsb25lKCk7XG5cdFx0XHR0aGlzLmVuZERhdGUgPSBkYXRlc1sxXS5jbG9uZSgpO1xuXHRcdFx0aWYgKHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0ICYmIGxhYmVsICE9PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG5cdFx0XHRcdHRoaXMuY2hvc2VuTGFiZWwgPSBsYWJlbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gIXRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoIHx8IHRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycztcblxuXHRcdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdFx0dGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XG5cdFx0XHRcdHRoaXMuZW5kRGF0ZS5lbmRPZignZGF5Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzKSB7XG5cdFx0XHRcdHRoaXMuaXNTaG93biA9IGZhbHNlOyAvLyBoaWRlIGNhbGVuZGFyc1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5yYW5nZUNsaWNrZWQuZW1pdCh7IGxhYmVsOiBsYWJlbCwgZGF0ZXM6IGRhdGVzIH0pO1xuXHRcdFx0aWYgKCF0aGlzLmtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UpIHtcblx0XHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIXRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycykge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNsaWNrQXBwbHkoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMubWF4RGF0ZS5pc1NhbWUoZGF0ZXNbMF0sICdtb250aCcpKSB7XG5cdFx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKGRhdGVzWzBdLm1vbnRoKCkpO1xuXHRcdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC55ZWFyKGRhdGVzWzBdLnllYXIoKSk7XG5cdFx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgubW9udGgoZGF0ZXNbMF0ubW9udGgoKSAtIDEpO1xuXHRcdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnllYXIoZGF0ZXNbMV0ueWVhcigpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChkYXRlc1swXS5tb250aCgpKTtcblx0XHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKGRhdGVzWzBdLnllYXIoKSk7XG5cdFx0XHRcdFx0Ly8gZ2V0IHRoZSBuZXh0IHllYXJcblx0XHRcdFx0XHRjb25zdCBuZXh0TW9udGggPSBkYXRlc1swXS5jbG9uZSgpLmFkZCgxLCAnbW9udGgnKTtcblx0XHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgubW9udGgobmV4dE1vbnRoLm1vbnRoKCkpO1xuXHRcdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC55ZWFyKG5leHRNb250aC55ZWFyKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG5cdFx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdFx0XHR0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHNob3coZT8pIHtcblx0XHRpZiAodGhpcy5pc1Nob3duKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0dGhpcy5fb2xkLmVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuXHRcdHRoaXMuaXNTaG93biA9IHRydWU7XG5cdFx0dGhpcy51cGRhdGVWaWV3KCk7XG5cdH1cblxuXHRoaWRlKGU/KSB7XG5cdFx0aWYgKCF0aGlzLmlzU2hvd24pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gaW5jb21wbGV0ZSBkYXRlIHNlbGVjdGlvbiwgcmV2ZXJ0IHRvIGxhc3QgdmFsdWVzXG5cdFx0aWYgKCF0aGlzLmVuZERhdGUpIHtcblx0XHRcdGlmICh0aGlzLl9vbGQuc3RhcnQpIHtcblx0XHRcdFx0dGhpcy5zdGFydERhdGUgPSB0aGlzLl9vbGQuc3RhcnQuY2xvbmUoKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9vbGQuZW5kKSB7XG5cdFx0XHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMuX29sZC5lbmQuY2xvbmUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBpZiBhIG5ldyBkYXRlIHJhbmdlIHdhcyBzZWxlY3RlZCwgaW52b2tlIHRoZSB1c2VyIGNhbGxiYWNrIGZ1bmN0aW9uXG5cdFx0aWYgKCF0aGlzLnN0YXJ0RGF0ZS5pc1NhbWUodGhpcy5fb2xkLnN0YXJ0KSB8fCAhdGhpcy5lbmREYXRlLmlzU2FtZSh0aGlzLl9vbGQuZW5kKSkge1xuXHRcdFx0Ly8gdGhpcy5jYWxsYmFjayh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlLCB0aGlzLmNob3NlbkxhYmVsKTtcblx0XHR9XG5cblx0XHQvLyBpZiBwaWNrZXIgaXMgYXR0YWNoZWQgdG8gYSB0ZXh0IGlucHV0LCB1cGRhdGUgaXRcblx0XHR0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcblx0XHR0aGlzLmlzU2hvd24gPSBmYWxzZTtcblx0XHR0aGlzLl9yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIGhhbmRsZSBjbGljayBvbiBhbGwgZWxlbWVudCBpbiB0aGUgY29tcG9uZW50LCB1c2VmdWwgZm9yIG91dHNpZGUgb2YgY2xpY2tcblx0ICogQHBhcmFtIGUgZXZlbnRcblx0ICovXG5cdGhhbmRsZUludGVybmFsQ2xpY2soZSkge1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cblx0LyoqXG5cdCAqIHVwZGF0ZSB0aGUgbG9jYWxlIG9wdGlvbnNcblx0ICogQHBhcmFtIGxvY2FsZVxuXHQgKi9cblx0dXBkYXRlTG9jYWxlKGxvY2FsZSkge1xuXHRcdGZvciAoY29uc3Qga2V5IGluIGxvY2FsZSkge1xuXHRcdFx0aWYgKGxvY2FsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdHRoaXMubG9jYWxlW2tleV0gPSBsb2NhbGVba2V5XTtcblx0XHRcdFx0aWYgKGtleSA9PT0gJ2N1c3RvbVJhbmdlTGFiZWwnKSB7XG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJSYW5nZXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvKipcblx0ICogIGNsZWFyIHRoZSBkYXRlcmFuZ2UgcGlja2VyXG5cdCAqL1xuXHRjbGVhcigpIHtcblx0XHR0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xuXHRcdHRoaXMuZW5kRGF0ZSA9IG1vbWVudCgpLmVuZE9mKCdkYXknKTtcblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHRcdHRoaXMudXBkYXRlVmlldygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmQgb3V0IGlmIHRoZSBzZWxlY3RlZCByYW5nZSBzaG91bGQgYmUgZGlzYWJsZWQgaWYgaXQgZG9lc24ndFxuXHQgKiBmaXQgaW50byBtaW5EYXRlIGFuZCBtYXhEYXRlIGxpbWl0YXRpb25zLlxuXHQgKi9cblx0ZGlzYWJsZVJhbmdlKHJhbmdlKSB7XG5cdFx0aWYgKHJhbmdlID09PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGNvbnN0IHJhbmdlTWFya2VycyA9IHRoaXMucmFuZ2VzW3JhbmdlXTtcblx0XHRjb25zdCBhcmVCb3RoQmVmb3JlID0gcmFuZ2VNYXJrZXJzLmV2ZXJ5KGRhdGUgPT4ge1xuXHRcdFx0aWYgKCF0aGlzLm1pbkRhdGUpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRhdGUuaXNCZWZvcmUodGhpcy5taW5EYXRlKTtcblx0XHR9KTtcblxuXHRcdGNvbnN0IGFyZUJvdGhBZnRlciA9IHJhbmdlTWFya2Vycy5ldmVyeShkYXRlID0+IHtcblx0XHRcdGlmICghdGhpcy5tYXhEYXRlKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkYXRlLmlzQWZ0ZXIodGhpcy5tYXhEYXRlKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gYXJlQm90aEJlZm9yZSB8fCBhcmVCb3RoQWZ0ZXI7XG5cdH1cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRlIHRoZSBkYXRlIHRvIGFkZCB0aW1lXG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcblx0ICovXG5cdHByaXZhdGUgX2dldERhdGVXaXRoVGltZShkYXRlLCBzaWRlOiBTaWRlRW51bSk6IF9tb21lbnQuTW9tZW50IHtcblx0XHRsZXQgaG91ciA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIsIDEwKTtcblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xuXHRcdFx0Y29uc3QgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XG5cdFx0XHRpZiAoYW1wbSA9PT0gJ1BNJyAmJiBob3VyIDwgMTIpIHtcblx0XHRcdFx0aG91ciArPSAxMjtcblx0XHRcdH1cblx0XHRcdGlmIChhbXBtID09PSAnQU0nICYmIGhvdXIgPT09IDEyKSB7XG5cdFx0XHRcdGhvdXIgPSAwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zdCBtaW51dGUgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUsIDEwKTtcblx0XHRjb25zdCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xuXHRcdHJldHVybiBkYXRlXG5cdFx0XHQuY2xvbmUoKVxuXHRcdFx0LmhvdXIoaG91cilcblx0XHRcdC5taW51dGUobWludXRlKVxuXHRcdFx0LnNlY29uZChzZWNvbmQpO1xuXHR9XG5cdC8qKlxuXHQgKiAgYnVpbGQgdGhlIGxvY2FsZSBjb25maWdcblx0ICovXG5cdHByaXZhdGUgX2J1aWxkTG9jYWxlKCkge1xuXHRcdHRoaXMubG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udGhpcy5sb2NhbGUgfTtcblx0XHRpZiAoIXRoaXMubG9jYWxlLmZvcm1hdCkge1xuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0XHR0aGlzLmxvY2FsZS5mb3JtYXQgPSBtb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdsbGwnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubG9jYWxlLmZvcm1hdCA9IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ0wnKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cHJpdmF0ZSBfYnVpbGRDZWxscyhjYWxlbmRhciwgc2lkZTogU2lkZUVudW0pIHtcblx0XHRmb3IgKGxldCByb3cgPSAwOyByb3cgPCA2OyByb3crKykge1xuXHRcdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd10gPSB7fTtcblx0XHRcdGxldCBjb2xPZmZDb3VudCA9IDA7XG5cdFx0XHRjb25zdCByb3dDbGFzc2VzID0gW107XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHRoaXMuZW1wdHlXZWVrUm93Q2xhc3MgJiZcblx0XHRcdFx0IXRoaXMuaGFzQ3VycmVudE1vbnRoRGF5cyh0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1vbnRoLCBjYWxlbmRhcltyb3ddKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJvd0NsYXNzZXMucHVzaCh0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDc7IGNvbCsrKSB7XG5cdFx0XHRcdGNvbnN0IGNsYXNzZXMgPSBbXTtcblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IHRvZGF5J3MgZGF0ZVxuXHRcdFx0XHRpZiAoY2FsZW5kYXJbcm93XVtjb2xdLmlzU2FtZShuZXcgRGF0ZSgpLCAnZGF5JykpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ3RvZGF5Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IHdlZWtlbmRzXG5cdFx0XHRcdGlmIChjYWxlbmRhcltyb3ddW2NvbF0uaXNvV2Vla2RheSgpID4gNSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnd2Vla2VuZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGdyZXkgb3V0IHRoZSBkYXRlcyBpbiBvdGhlciBtb250aHMgZGlzcGxheWVkIGF0IGJlZ2lubmluZyBhbmQgZW5kIG9mIHRoaXMgY2FsZW5kYXJcblx0XHRcdFx0aWYgKGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpICE9PSBjYWxlbmRhclsxXVsxXS5tb250aCgpKSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnLCAnaGlkZGVuJyk7XG5cdFx0XHRcdFx0Y29sT2ZmQ291bnQrKztcblxuXHRcdFx0XHRcdC8vIG1hcmsgdGhlIGxhc3QgZGF5IG9mIHRoZSBwcmV2aW91cyBtb250aCBpbiB0aGlzIGNhbGVuZGFyXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0dGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgJiZcblx0XHRcdFx0XHRcdChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA8IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHwgY2FsZW5kYXJbMV1bMV0ubW9udGgoKSA9PT0gMCkgJiZcblx0XHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZGF5c0luTGFzdE1vbnRoXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2godGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgbmV4dCBtb250aCBpbiB0aGlzIGNhbGVuZGFyXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgJiZcblx0XHRcdFx0XHRcdChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA+IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHwgY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IDApICYmXG5cdFx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSAxXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2godGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBtYXJrIHRoZSBmaXJzdCBkYXkgb2YgdGhlIGN1cnJlbnQgbW9udGggd2l0aCBhIGN1c3RvbSBjbGFzc1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSAmJlxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmZpcnN0RGF5LmRhdGUoKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2godGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIG1hcmsgdGhlIGxhc3QgZGF5IG9mIHRoZSBjdXJyZW50IG1vbnRoIHdpdGggYSBjdXN0b20gY2xhc3Ncblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSAmJlxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmxhc3REYXkuZGF0ZSgpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCh0aGlzLmxhc3RNb250aERheUNsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZXMgYmVmb3JlIHRoZSBtaW5pbXVtIGRhdGVcblx0XHRcdFx0aWYgKHRoaXMubWluRGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uaXNCZWZvcmUodGhpcy5taW5EYXRlLCAnZGF5JykpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlcyBhZnRlciB0aGUgbWF4aW11bSBkYXRlXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1heERhdGUgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uaXNBZnRlcih0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1heERhdGUsICdkYXknKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlIGlmIGEgY3VzdG9tIGZ1bmN0aW9uIGRlY2lkZXMgaXQncyBpbnZhbGlkXG5cdFx0XHRcdGlmICh0aGlzLmlzSW52YWxpZERhdGUoY2FsZW5kYXJbcm93XVtjb2xdKSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJywgJ2ludmFsaWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBoaWdobGlnaHQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBzdGFydCBkYXRlXG5cdFx0XHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdhY3RpdmUnLCAnc3RhcnQtZGF0ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGhpZ2hsaWdodCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGVuZCBkYXRlXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUgIT0gbnVsbCAmJlxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ2VuZC1kYXRlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IGRhdGVzIGluLWJldHdlZW4gdGhlIHNlbGVjdGVkIGRhdGVzXG5cdFx0XHRcdGlmICh0aGlzLmVuZERhdGUgIT0gbnVsbCAmJiBjYWxlbmRhcltyb3ddW2NvbF0gPiB0aGlzLnN0YXJ0RGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0gPCB0aGlzLmVuZERhdGUpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ2luLXJhbmdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gYXBwbHkgY3VzdG9tIGNsYXNzZXMgZm9yIHRoaXMgZGF0ZVxuXHRcdFx0XHRjb25zdCBpc0N1c3RvbSA9IHRoaXMuaXNDdXN0b21EYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XG5cdFx0XHRcdGlmIChpc0N1c3RvbSAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGlzQ3VzdG9tID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGlzQ3VzdG9tKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoY2xhc3NlcywgaXNDdXN0b20pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBzdG9yZSBjbGFzc2VzIHZhclxuXHRcdFx0XHRsZXQgY25hbWUgPSAnJyxcblx0XHRcdFx0XHRkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjbmFtZSArPSBjbGFzc2VzW2ldICsgJyAnO1xuXHRcdFx0XHRcdGlmIChjbGFzc2VzW2ldID09PSAnZGlzYWJsZWQnKSB7XG5cdFx0XHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghZGlzYWJsZWQpIHtcblx0XHRcdFx0XHRjbmFtZSArPSAnYXZhaWxhYmxlJztcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XVtjb2xdID0gY25hbWUucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNvbE9mZkNvdW50ID09PSA3KSB7XG5cdFx0XHRcdHJvd0NsYXNzZXMucHVzaCgnb2ZmJyk7XG5cdFx0XHRcdHJvd0NsYXNzZXMucHVzaCgnZGlzYWJsZWQnKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddLmNsYXNzTGlzdCA9IHJvd0NsYXNzZXMuam9pbignICcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kIG91dCBpZiB0aGUgY3VycmVudCBjYWxlbmRhciByb3cgaGFzIGN1cnJlbnQgbW9udGggZGF5c1xuXHQgKiAoYXMgb3Bwb3NlZCB0byBjb25zaXN0aW5nIG9mIG9ubHkgcHJldmlvdXMvbmV4dCBtb250aCBkYXlzKVxuXHQgKi9cblx0aGFzQ3VycmVudE1vbnRoRGF5cyhjdXJyZW50TW9udGgsIHJvdykge1xuXHRcdGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB7XG5cdFx0XHRpZiAocm93W2RheV0ubW9udGgoKSA9PT0gY3VycmVudE1vbnRoKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbiJdfQ==