import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { LocaleService } from '../services/locale.service';
var moment = _moment;
export var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
var DateRangePickerComponent = /** @class */ (function () {
    function DateRangePickerComponent(el, _ref, _localeService) {
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
        this.buttonClassApply = null;
        this.buttonClassReset = null;
        this.buttonClassRange = null;
        this._locale = {};
        // custom ranges
        this._ranges = [];
        this.showCancel = false;
        this.keepCalendarOpeningWithRange = false;
        this.showRangeLabelOnInput = false;
        this.customRangeDirection = false;
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
    DateRangePickerComponent_1 = DateRangePickerComponent;
    Object.defineProperty(DateRangePickerComponent.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            this._locale = tslib_1.__assign({}, this._localeService.config, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateRangePickerComponent.prototype, "ranges", {
        get: function () {
            return this._ranges;
        },
        set: function (value) {
            this._ranges = value;
            this.renderRanges();
        },
        enumerable: true,
        configurable: true
    });
    DateRangePickerComponent.prototype.ngOnInit = function () {
        this._buildLocale();
        var daysOfWeek = tslib_1.__spread(this.locale.daysOfWeek);
        if (this.locale.firstDay !== 0) {
            var iterator = this.locale.firstDay;
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
    };
    DateRangePickerComponent.prototype.renderRanges = function () {
        var _this = this;
        var start, end;
        this.ranges.forEach(function (preset) {
            start = preset.range.start;
            end = preset.range.end;
            // If the start or end date exceed those allowed by the minDate
            // option, shorten the range to the allowable period.
            if (_this.minDate && start.isBefore(_this.minDate)) {
                start = _this.minDate.clone();
            }
            var maxDate = _this.maxDate;
            if (maxDate && end.isAfter(maxDate)) {
                end = maxDate.clone();
            }
            // If the end of the range is before the minimum or the start of the range is
            // after the maximum, don't display this range option at all.
            if ((_this.minDate && end.isBefore(_this.minDate, _this.timePicker ? 'minute' : 'day')) ||
                (maxDate && end.isAfter(maxDate, _this.timePicker ? 'minute' : 'day'))) {
                // continue;
            }
            else {
                // Support unicode chars in the range names.
                var elem = document.createElement('textarea');
                elem.innerHTML = preset.label;
                preset.label = elem.value;
            }
        });
        this.showCalInRanges = true;
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
            this.endDate = this.endDate.endOf('day');
        }
    };
    DateRangePickerComponent.prototype.renderTimePicker = function (side) {
        if (side === SideEnum.right && !this.endDate) {
            return;
        }
        var selected, minDate;
        var maxDate = this.maxDate;
        if (side === SideEnum.left) {
            (selected = this.startDate.clone()), (minDate = this.minDate);
        }
        else if (side === SideEnum.right) {
            (selected = this.endDate.clone()), (minDate = this.startDate);
        }
        var start = this.timePicker24Hour ? 0 : 1;
        var end = this.timePicker24Hour ? 23 : 12;
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
        for (var i = start; i <= end; i++) {
            var i_in_24 = i;
            if (!this.timePicker24Hour) {
                i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : i === 12 ? 0 : i;
            }
            var time = selected.clone().hour(i_in_24);
            var disabled = false;
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
        for (var i = 0; i < 60; i += this.timePickerIncrement) {
            var padded = i < 10 ? '0' + i : i;
            var time = selected.clone().minute(i);
            var disabled = false;
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
            for (var i = 0; i < 60; i++) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().second(i);
                var disabled = false;
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
    };
    DateRangePickerComponent.prototype.renderCalendar = function (side) {
        var mainCalendar = side === SideEnum.left ? this.leftCalendar : this.rightCalendar;
        var month = mainCalendar.month.month();
        var year = mainCalendar.month.year();
        var hour = mainCalendar.month.hour();
        var minute = mainCalendar.month.minute();
        var second = mainCalendar.month.second();
        var daysInMonth = moment([year, month]).daysInMonth();
        var firstDay = moment([year, month, 1]);
        var lastDay = moment([year, month, daysInMonth]);
        var lastMonth = moment(firstDay)
            .subtract(1, 'month')
            .month();
        var lastYear = moment(firstDay)
            .subtract(1, 'month')
            .year();
        var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        var dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        var calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (var i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
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
        var minDate = side === 'left' ? this.minDate : this.startDate.clone();
        if (this.leftCalendar.month && minDate && this.leftCalendar.month.year() < minDate.year()) {
            minDate.year(this.leftCalendar.month.year());
        }
        var maxDate = this.maxDate;
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            var maxLimit = this.startDate
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
            var currentMonth = calendar[1][1].month();
            var currentYear = calendar[1][1].year();
            var realCurrentYear = moment().year();
            var maxYear = (maxDate && maxDate.year()) || realCurrentYear + 5;
            var minYear = (minDate && minDate.year()) || realCurrentYear - 100;
            var inMinYear = currentYear === minYear;
            var inMaxYear = currentYear === maxYear;
            var years = [];
            for (var y = minYear; y <= maxYear; y++) {
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
    };
    DateRangePickerComponent.prototype.setStartDate = function (startDate) {
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
    };
    DateRangePickerComponent.prototype.setEndDate = function (endDate) {
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
    };
    DateRangePickerComponent.prototype.isInvalidDate = function (date) {
        return false;
    };
    DateRangePickerComponent.prototype.isCustomDate = function (date) {
        return false;
    };
    DateRangePickerComponent.prototype.updateView = function () {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    };
    DateRangePickerComponent.prototype.updateMonthsInView = function () {
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
    };
    /**
     *  This is responsible for updating the calendars
     */
    DateRangePickerComponent.prototype.updateCalendars = function () {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    };
    DateRangePickerComponent.prototype.updateElement = function () {
        var format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on input
                if (this.ranges.length &&
                    this.showRangeLabelOnInput === true &&
                    this.chosenRange /*&&
                this.locale.customRangeLabel !== this.chosenRange.label*/) {
                    this.chosenLabel = this.chosenRange.label;
                }
                else {
                    this.chosenLabel =
                        this.startDate.format(format) +
                            this.locale.separator +
                            this.endDate.format(format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(format);
        }
    };
    DateRangePickerComponent.prototype.remove = function () {
        this.isShown = false;
    };
    /**
     * this should calculate the label
     */
    DateRangePickerComponent.prototype.calculateChosenLabel = function () {
        var _this = this;
        if (!this.locale || !this.locale.separator) {
            this._buildLocale();
        }
        var customRange = true;
        var i = 0;
        this.ranges.forEach(function (preset) {
            if (_this.timePicker) {
                var format = _this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                // ignore times when comparing dates if time picker seconds is not enabled
                if (_this.startDate.format(format) === preset.range.start.format(format) &&
                    _this.endDate.format(format) === preset.range.end.format(format)) {
                    customRange = false;
                    _this.chosenRange = preset;
                }
            }
            else {
                // ignore times when comparing dates if time picker is not enabled
                if (_this.startDate.format('YYYY-MM-DD') === preset.range.start.format('YYYY-MM-DD') &&
                    _this.endDate.format('YYYY-MM-DD') === preset.range.end.format('YYYY-MM-DD')) {
                    customRange = false;
                    _this.chosenRange = preset;
                }
            }
            i++;
        });
        if (customRange) {
            if (this.showCustomRangeLabel) {
                // this.chosenRange.label = this.locale.customRangeLabel;
            }
            else {
                this.chosenRange = null;
            }
            // if custom label: show calendar
            this.showCalInRanges = true;
        }
        this.updateElement();
    };
    DateRangePickerComponent.prototype.clickApply = function (e) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            var d = this.startDate.clone();
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
    };
    DateRangePickerComponent.prototype.clickCancel = function (e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    };
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    DateRangePickerComponent.prototype.monthChanged = function (monthEvent, side) {
        var year = this.calendarVariables[side].dropdowns.currentYear;
        var month = parseInt(monthEvent.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    DateRangePickerComponent.prototype.yearChanged = function (yearEvent, side) {
        var month = this.calendarVariables[side].dropdowns.currentMonth;
        var year = parseInt(yearEvent.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side left or right
     */
    DateRangePickerComponent.prototype.timeChanged = function (timeEvent, side) {
        var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        if (!this.timePicker24Hour) {
            var ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        if (side === SideEnum.left) {
            var start = this.startDate.clone();
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
            var end = this.endDate.clone();
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
    };
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    DateRangePickerComponent.prototype.monthOrYearChanged = function (month, year, side) {
        var isLeft = side === SideEnum.left;
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
    };
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    DateRangePickerComponent.prototype.clickPrev = function (side) {
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
    };
    /**
     * Click on next month
     * @param side left or right calendar
     */
    DateRangePickerComponent.prototype.clickNext = function (side) {
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
    };
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    DateRangePickerComponent.prototype.clickDate = function (e, side, row, col) {
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
        var date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
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
    };
    /**
     *  Click on the custom range
     * @param e: Event
     * @param preset
     */
    DateRangePickerComponent.prototype.clickRange = function (e, preset) {
        this.chosenRange = preset;
        this.startDate = preset.range.start.clone();
        this.endDate = preset.range.end.clone();
        if (this.showRangeLabelOnInput) {
            this.chosenLabel = preset.label;
        }
        else {
            this.calculateChosenLabel();
        }
        this.showCalInRanges = true;
        if (!this.timePicker) {
            this.startDate.startOf('day');
            this.endDate.endOf('day');
        }
        if (!this.alwaysShowCalendars) {
            this.isShown = false; // hide calendars
        }
        this.rangeClicked.emit({ label: preset.label, dates: preset.range });
        if (!this.keepCalendarOpeningWithRange) {
            this.clickApply();
        }
        else {
            if (!this.alwaysShowCalendars) {
                return this.clickApply();
            }
            if (this.maxDate && this.maxDate.isSame(preset.range.start, 'month')) {
                this.rightCalendar.month.month(preset.range.start.month());
                this.rightCalendar.month.year(preset.range.start.year());
                this.leftCalendar.month.month(preset.range.start.month() - 1);
                this.leftCalendar.month.year(preset.range.end.year());
            }
            else {
                this.leftCalendar.month.month(preset.range.start.month());
                this.leftCalendar.month.year(preset.range.start.year());
                // get the next year
                var nextMonth = preset.range.start.clone().add(1, 'month');
                this.rightCalendar.month.month(nextMonth.month());
                this.rightCalendar.month.year(nextMonth.year());
            }
            this.updateCalendars();
            if (this.timePicker) {
                this.renderTimePicker(SideEnum.left);
                this.renderTimePicker(SideEnum.right);
            }
        }
    };
    DateRangePickerComponent.prototype.show = function (e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        if (this.isFullScreenPicker) {
            setTimeout(function () {
                document.getElementById('scroll-body').scrollTo({ top: 150 });
            });
        }
        this.updateView();
    };
    DateRangePickerComponent.prototype.hide = function (e) {
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
    };
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    DateRangePickerComponent.prototype.handleInternalClick = function (e) {
        e.stopPropagation();
    };
    /**
     * update the locale options
     * @param locale
     */
    DateRangePickerComponent.prototype.updateLocale = function (locale) {
        for (var key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
                if (key === 'customRangeLabel') {
                    this.renderRanges();
                }
            }
        }
    };
    /**
     *  clear the daterange picker
     */
    DateRangePickerComponent.prototype.clear = function () {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.updateCalendars();
        this.updateView();
    };
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    DateRangePickerComponent.prototype.disableRange = function (preset) {
        if (preset.label === this.locale.customRangeLabel) {
            return false;
        }
        var areBothBefore = this.minDate
            && preset.range.start.isBefore(this.minDate)
            && preset.range.end.isBefore(this.minDate);
        var areBothAfter = this.maxDate
            && preset.range.start.isAfter(this.maxDate)
            && preset.range.end.isAfter(this.maxDate);
        return areBothBefore || areBothAfter;
    };
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    DateRangePickerComponent.prototype._getDateWithTime = function (date, side) {
        var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            var ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date
            .clone()
            .hour(hour)
            .minute(minute)
            .second(second);
    };
    /**
     *  build the locale config
     */
    DateRangePickerComponent.prototype._buildLocale = function () {
        this.locale = tslib_1.__assign({}, this._localeService.config, this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
    };
    DateRangePickerComponent.prototype._buildCells = function (calendar, side) {
        for (var row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            var colOffCount = 0;
            var rowClasses = [];
            if (this.emptyWeekRowClass &&
                !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (var col = 0; col < 7; col++) {
                var classes = [];
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
                if (this.endDate != null &&
                    calendar[row][col].isAfter(this.startDate, 'day') &&
                    calendar[row][col].isBefore(this.endDate, 'day')) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                var isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                var cname = '', disabled = false;
                for (var i = 0; i < classes.length; i++) {
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
                rowClasses.push('hidden');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    };
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    DateRangePickerComponent.prototype.hasCurrentMonthDays = function (currentMonth, row) {
        for (var day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    };
    DateRangePickerComponent.prototype.scrollDetection = function (event) {
        var scrollBodyTop = event.target.scrollTop;
        var scrollBodyBottom = scrollBodyTop + event.target.clientHeight + 1;
        if (scrollBodyTop <= 0) {
            this.clickPrev(SideEnum.left);
            event.target.scrollTop = 150;
        }
        if (scrollBodyBottom >= event.target.scrollHeight) {
            this.clickNext(SideEnum.right);
            event.target.scrollTop = event.target.scrollTop - 150;
        }
    };
    var DateRangePickerComponent_1;
    DateRangePickerComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: LocaleService }
    ]; };
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "locale", null);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "ranges", null);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "startDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "endDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "dateLimit", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "minDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "maxDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "autoApply", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "singleDatePicker", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "showDropdowns", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "showWeekNumbers", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "showISOWeekNumbers", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "linkedCalendars", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "autoUpdateInput", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "alwaysShowCalendars", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "lockStartDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "timePicker", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "timePicker24Hour", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "timePickerIncrement", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "timePickerSeconds", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "showClearButton", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "firstMonthDayClass", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "lastMonthDayClass", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "emptyWeekRowClass", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "firstDayOfNextMonthClass", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "lastDayOfPreviousMonthClass", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "buttonClassApply", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "buttonClassReset", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "buttonClassRange", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "isFullScreenPicker", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "showCustomRangeLabel", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "showCancel", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "keepCalendarOpeningWithRange", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "showRangeLabelOnInput", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "customRangeDirection", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "drops", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "opens", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "closeOnAutoApply", void 0);
    tslib_1.__decorate([
        Output()
    ], DateRangePickerComponent.prototype, "choosedDate", void 0);
    tslib_1.__decorate([
        Output()
    ], DateRangePickerComponent.prototype, "rangeClicked", void 0);
    tslib_1.__decorate([
        Output()
    ], DateRangePickerComponent.prototype, "datesUpdated", void 0);
    tslib_1.__decorate([
        Output()
    ], DateRangePickerComponent.prototype, "startDateChanged", void 0);
    tslib_1.__decorate([
        Output()
    ], DateRangePickerComponent.prototype, "endDateChanged", void 0);
    tslib_1.__decorate([
        ViewChild('pickerContainer', { static: true })
    ], DateRangePickerComponent.prototype, "pickerContainer", void 0);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "isInvalidDate", null);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "isCustomDate", null);
    DateRangePickerComponent = DateRangePickerComponent_1 = tslib_1.__decorate([
        Component({
            // tslint:disable-next-line:component-selector
            selector: 'ngx-daterangepicker-material',
            template: "<div\n\tclass=\"md-drppicker\"\n\t#pickerContainer\n\t[ngClass]=\"{\n\t\tltr: locale.direction === 'ltr',\n\t\trtl: this.locale.direction === 'rtl',\n\t\tshown: isShown || inline,\n\t\tsingle: singleDatePicker,\n\t\thidden: !isShown && !inline,\n\t\tinline: inline,\n\t\tdouble: !isFullScreenPicker && !singleDatePicker && showCalInRanges,\n\t\t'show-ranges': ranges.length > 0,\n\t\t'full-screen': isFullScreenPicker\n\t}\"\n\t[class]=\"'drops-' + drops + '-' + opens\"\n\t[attr.data-cy]=\"'date-range-picker__content--' + (isFullScreenPicker ? 'full-screen' : 'modal')\"\n>\n\t<div *ngIf=\"!isFullScreenPicker; else fullScreenView;\">\n\t\t<div class=\"dp-header\" *ngIf=\"!singleDatePicker\">\n\t\t\t<button mat-button *ngIf=\"showClearButton\" class=\"cal-reset-btn\" (click)=\"clear()\" data-cy=\"date-range-picker-clear__button\">\n\t\t\t\t{{ _locale.clearLabel }}\n\t\t\t</button>\n\t\t\t<mat-form-field class=\"cal-start-date\">\n\t\t\t\t<button mat-icon-button matPrefix>\n\t\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<input\n\t\t\t\t\tmatInput\n\t\t\t\t\t[value]=\"startDate | date: locale.displayFormat:undefined:locale.localeId\"\n\t\t\t\t\treadonly\n\t\t\t\t\tdata-cy=\"date-range-picker-start-date__input\"\n\t\t\t\t/>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field color=\"primary\">\n\t\t\t\t<button mat-icon-button matPrefix>\n\t\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<input\n\t\t\t\t\tmatInput\n\t\t\t\t\t[value]=\"endDate | date: locale.displayFormat:undefined:locale.localeId\"\n\t\t\t\t\treadonly\n\t\t\t\t\tdata-cy=\"date-range-picker-end-date__input\"\n\t\t\t\t/>\n\t\t\t</mat-form-field>\n\t\t</div>\n\t\t<div class=\"dp-body\">\n\t\t\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\n\t\t\t\t<button color=\"primary\" mat-mini-fab class=\"prev available\" (click)=\"clickPrev(sideEnum.left)\" data-cy=\"date-range-picker-previous__button\">\n\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month drp-animate\">\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentMonth\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t\t(!calendarVariables.left.maxDate ||\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.lastDay\n\t\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker)\n\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tcolor=\"primary\"\n\t\t\t\t\t\t\t\t\t\tmat-mini-fab\n\t\t\t\t\t\t\t\t\t\tclass=\"next available\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"clickNext(sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\tdata-cy=\"date-range-picker-next__button--single-calendar\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody class=\"drp-animate\">\n\t\t\t\t\t\t\t<tr\n\t\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.left.calRows; let rowIndex = index;\"\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row].classList\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<!-- add week number -->\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<!-- cal -->\n\t\t\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.left.calCols; let colIndex = index\"\n\t\t\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row][col]\"\n\t\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.left, row, col)\"\n\t\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"hourselect select-item\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedHour\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.hours\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedMinute\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.minutes; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.left.minutesLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedSecond\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.seconds; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.left.secondsLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.ampmModel\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\n\t\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\n\t\t\t\t<button color=\"primary\" mat-mini-fab class=\"next available\" (click)=\"clickNext(sideEnum.right)\" data-cy=\"date-range-picker-next__button\">\n\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month\">\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentMonth\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t<tr\n\t\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.right.calRows; let rowIndex = index;\"\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row].classList\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.right.calCols; let colIndex = index;\"\n\t\t\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row][col]\"\n\t\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.right, row, col)\"\n\t\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item hourselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedHour\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.hours\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedMinute\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.minutes; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.right.minutesLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedSecond\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.seconds; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.right.secondsLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.ampmModel\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\n\t\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"dp-footer\" *ngIf=\"!autoApply && (!ranges.length || (showCalInRanges && !singleDatePicker))\">\n\t\t\t<div class=\"range-buttons\">\n\t\t\t\t<div class=\"custom-range-label\" *ngIf=\"showCustomRangeLabel\">\n\t\t\t\t\t<strong>{{ _locale.customRangeLabel }}:</strong>\n\t\t\t\t</div>\n\t\t\t\t<button\n\t\t\t\t\t*ngFor=\"let range of ranges\"\n\t\t\t\t\tmat-stroked-button\n\t\t\t\t\tcolor=\"primary\"\n\t\t\t\t\tclass=\"{{ buttonClassRange }}\"\n\t\t\t\t\t(click)=\"clickRange($event, range)\"\n\t\t\t\t\t[disabled]=\"disableRange(range)\"\n\t\t\t\t\t[ngClass]=\"{ active: range.label === chosenLabel }\"\n\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-range-' + range.key + '__button'\"\n\t\t\t\t>\n\t\t\t\t\t{{ range.label }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"control-buttons\">\n\t\t\t\t<button mat-flat-button color=\"primary\" (click)=\"clickApply($event)\" data-cy=\"date-range-picker-apply__button\">\n\t\t\t\t\t{{ _locale.applyLabel }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<ng-template #fullScreenView>\n\t\t<div class=\"dp-header\" id=\"scroll-top\">\n\t\t\t<button mat-icon-button (click)=\"clickCancel($event)\" data-cy=\"date-range-picker-close__button\">\n\t\t\t\t<mat-icon>close</mat-icon>\n\t\t\t</button>\n\t\t\t<div class=\"selected-range\">\n\t\t\t\t{{startDate | date: locale.displayFormat:undefined:locale.localeId}} - {{endDate | date: locale.displayFormat:undefined:locale.localeId}}\n\t\t\t</div>\n\t\t\t<div class=\"header-icon\">\n\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"dp-body\" id=\"scroll-body\" (scroll)=\"scrollDetection($event)\">\n\t\t\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month drp-animate\">\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.left.dropdowns.currentMonth\" (selectionChange)=\"monthChanged($event, sideEnum.left)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.left.dropdowns.currentYear\" (selectionChange)=\"yearChanged($event, sideEnum.left)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [value]=\"y\">{{ y }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody class=\"drp-animate\">\n\t\t\t\t\t\t<tr *ngFor=\"let row of calendarVariables.left.calRows; let rowIndex = index;\" [class]=\"calendarVariables.left.classes[row].classList\">\n\t\t\t\t\t\t\t<!-- add week number -->\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<!-- cal -->\n\t\t\t\t\t\t\t<td *ngFor=\"let col of calendarVariables.left.calCols; let colIndex = index\" [class]=\"calendarVariables.left.classes[row][col]\" (click)=\"clickDate($event, sideEnum.left, row, col)\" [attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month\">\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.right.dropdowns.currentMonth\" (selectionChange)=\"monthChanged($event, sideEnum.right)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\" *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\" *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.right.dropdowns.currentYear\" (selectionChange)=\"yearChanged($event, sideEnum.right)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\" [value]=\"y\">{{ y }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<tr *ngFor=\"let row of calendarVariables.right.calRows; let rowIndex = index;\" [class]=\"calendarVariables.right.classes[row].classList\">\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td *ngFor=\"let col of calendarVariables.right.calCols; let colIndex = index;\" [class]=\"calendarVariables.right.classes[row][col]\" (click)=\"clickDate($event, sideEnum.right, row, col)\" [attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"dp-footer\">\n\t\t\t<div class=\"control-buttons\" id=\"scroll-bottom\">\n\t\t\t\t<button mat-button *ngIf=\"showClearButton\" class=\"cal-reset-btn\" (click)=\"clear()\" data-cy=\"date-range-picker-clear__button\">\n\t\t\t\t\t{{ _locale.clearLabel }}\n\t\t\t\t</button>\n\t\t\t\t<button mat-flat-button color=\"primary\" (click)=\"clickApply($event)\" data-cy=\"date-range-picker-apply__button\">\n\t\t\t\t\t{{ _locale.applyLabel }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t</ng-template>\n</div>\n",
            // tslint:disable-next-line:no-host-metadata-property
            host: {
                '(click)': 'handleInternalClick($event)'
            },
            encapsulation: ViewEncapsulation.None,
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return DateRangePickerComponent_1; }),
                    multi: true
                }
            ],
            styles: [":host{position:absolute;top:0;left:0}td.hidden span,tr.hidden{display:none;cursor:default}td.available:not(.off):hover{border:2px solid #42a5f5}.ranges li{display:inline-block}button.available.prev{display:block;opacity:1;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);left:-20px;background-color:#fff;color:#000}button.available.prev mat-icon{transform:rotateY(180deg)}button.available.next{display:block;opacity:1;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);right:-20px;background-color:#fff;color:#000}.md-drppicker{display:flex;flex-direction:column;justify-content:space-between;position:absolute;height:555px;padding:0;margin:0;color:inherit;background-color:#fff;width:420px;z-index:1000}.md-drppicker .dp-header{display:flex;flex-direction:row;justify-content:flex-end;align-items:center;padding:16px;border-bottom:1px solid #eee}.md-drppicker .dp-header .mat-form-field{max-width:214px}.md-drppicker .dp-header .cal-reset-btn,.md-drppicker .dp-header .cal-start-date{margin-right:16px}.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex::after,.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex::before{margin-top:0}.md-drppicker .dp-header .mat-form-field-prefix,.md-drppicker .dp-header .mat-form-field-suffix{top:0}.md-drppicker .dp-body{display:flex;flex-direction:row;margin-bottom:auto}.md-drppicker .dp-footer{display:flex;flex-direction:row;justify-content:space-between;padding:16px;border-top:1px solid #eee}.md-drppicker.single{height:395px}.md-drppicker.single .calendar.right{margin:0}.md-drppicker *,.md-drppicker :after,.md-drppicker :before{box-sizing:border-box}.md-drppicker .mat-form-field-flex::before{margin-top:0!important}.md-drppicker .mat-form-field-appearance-standard .mat-form-field-flex,.md-drppicker .mat-form-field-flex{align-items:center;padding:0}.md-drppicker .mat-form-field-infix,.md-drppicker .mat-form-field-wrapper{border-top:none;margin:0;padding:0;line-height:44px}.md-drppicker .mat-select{border:none}.md-drppicker .mat-select .mat-select-trigger{margin:0}.md-drppicker .mat-select-value{font-weight:500;font-size:16px}.md-drppicker .year{max-width:88px}.md-drppicker .year mat-form-field{width:100%}.md-drppicker .mat-form-field-appearance-legacy .mat-form-field-infix{padding:.4375em 0}.md-drppicker .custom-range-label{display:inline-flex}.md-drppicker .range-buttons{display:flex;flex-direction:row;justify-content:flex-start;width:100%}.md-drppicker .range-buttons button:not(:last-child){margin-right:15px}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:\"\"}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{transform:scale(1);transition:.1s ease-in-out;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN%}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{display:flex;align-self:start}.md-drppicker.hidden{transition:.1s;transform:scale(0);transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:NaN%}.md-drppicker.hidden.drops-up-center{transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:390px;margin:0 15px}.md-drppicker .calendar .week-days th{height:28px;width:15px;color:#424242;font-size:16px;letter-spacing:.44px;line-height:28px;text-align:center;font-weight:500}.md-drppicker .calendar .month{height:28px;width:103px;color:#000;font-size:16px;letter-spacing:.44px;line-height:48px;text-align:center;font-weight:500}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;min-width:44px;height:44px}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border:1px solid #fff;padding:15px;border-radius:25px;background-color:#fff}.md-drppicker table{width:100%;margin:0;border-collapse:separate}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:25px;border:2px solid transparent;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.week,.md-drppicker th.week{font-size:80%;color:#ccc}.md-drppicker td{margin:.25em 0;opacity:.8;transition:background-color .2s;border-radius:2em;transform:scale(1)}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#e3f2fd;border-color:#e3f2fd;color:#000;opacity:1;border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:25px}.md-drppicker td.active{transition:background .3s ease-out;color:#fff;box-sizing:border-box;height:44px;width:44px;background-color:#42a5f5;border-color:#42a5f5}.md-drppicker td.active:hover{border-color:#e3f2fd}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-repeat:no-repeat;background-size:10px;background-position-y:center;background-position-x:right;width:108px;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.md-drppicker .dropdowns select{display:inline-block;background-color:rgba(255,255,255,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{width:50px;margin:0 auto;background:#eee;border:1px solid #eee;padding:2px;outline:0;font-size:12px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{font-size:12px;height:auto;cursor:pointer;opacity:0;position:absolute;top:0;left:0;margin:0;padding:0}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{display:inline-block;width:auto;position:relative;font-family:inherit;background-color:transparent;padding:10px 10px 10px 0;font-size:18px;border-radius:0;border:none;border-bottom:1px solid rgba(0,0,0,.12)}.md-drppicker .calendar-time .select .select-item:after{position:absolute;top:18px;right:10px;width:0;height:0;padding:0;content:\"\";border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);pointer-events:none}.md-drppicker .calendar-time .select .select-item:focus{outline:0}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:25px;color:#555;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border:1px solid #42a5f5;border-radius:25px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px;margin-right:20px}.md-drppicker .ranges ul li button{padding:8px 12px;width:100%;background:0 0;border:none;text-align:left;cursor:pointer}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}.md-drppicker .btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);background-color:#3f51b5;color:#ecf0f1;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.md-drppicker .btn:focus,.md-drppicker .btn:hover{background-color:#3f51b5}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{content:\"\";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(236,240,241,.3);transform:translate(-50%,-50%)}.md-drppicker .btn:active:before{width:120%;padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{color:#000;background-color:#dcdcdc}.md-drppicker .clear{box-shadow:none;background-color:#fff!important}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}.field-row{width:100%;height:65px;border-bottom:1px solid #eee}.field-row mat-form-field{float:right;margin-right:15px}.field-row .mat-form-field-flex{height:55px;padding-top:10px}.cal-reset-btn{margin-right:15px}td.available:hover{border:2px solid #42a5f5}.full-screen{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between}.full-screen .dp-header{background-color:#1565c0;color:#fff;width:100%;padding:0 16px;flex:0 0 56px;display:flex;flex-direction:row;justify-content:space-between;align-items:center}.full-screen .dp-header .header-icon{height:40px;width:40px;line-height:40px;vertical-align:middle;text-align:center}.full-screen .dp-header .header-icon mat-icon{vertical-align:middle}.full-screen .body-container{height:100%;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between}.full-screen .dp-body{margin-bottom:auto;flex:1 1 auto;flex-direction:column;padding:150px 0;overflow-y:scroll}.full-screen .dp-body .calendar{flex:1 1 100%;max-width:616px;width:100%;height:auto;margin:0 auto}.full-screen .dp-body .calendar-table{flex:1 0 100%}.full-screen .dp-body .available{z-index:999}.full-screen .dp-body .available.next{right:10px}.full-screen .dp-body .available.prev{left:10px}.full-screen .dp-footer{flex:0 0 56px;display:flex;flex-direction:row;justify-content:flex-end;align-items:center}.full-screen .dp-footer .control-buttons{display:flex;flex-direction:row;justify-content:space-between;width:166px}"]
        })
    ], DateRangePickerComponent);
    return DateRangePickerComponent;
}());
export { DateRangePickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ04saUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5RCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUdsQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFFekQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBRXZCLE1BQU0sQ0FBTixJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDbkIseUJBQWEsQ0FBQTtJQUNiLDJCQUFlLENBQUE7QUFDaEIsQ0FBQyxFQUhXLFFBQVEsS0FBUixRQUFRLFFBR25CO0FBb0JEO0lBZ0JDLGtDQUFvQixFQUFjLEVBQVUsSUFBdUIsRUFBVSxjQUE2QjtRQUF0RixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQU9sRyxTQUFJLEdBQTZCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFcEUsc0JBQWlCLEdBQThCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDdkUsd0JBQW1CLEdBQThCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxL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Q0MsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsMEJBQXdCLEVBQXhCLENBQXdCLENBQUM7b0JBQ3ZELEtBQUssRUFBRSxJQUFJO2lCQUNYO2FBQ0Q7O1NBQ0QsQ0FBQztPQUNXLHdCQUF3QixDQTh3Q3BDO0lBQUQsK0JBQUM7Q0FBQSxBQTl3Q0QsSUE4d0NDO1NBOXdDWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50LFxuXHRFbGVtZW50UmVmLFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdElucHV0LFxuXHRPbkluaXQsXG5cdE91dHB1dCxcblx0Vmlld0NoaWxkLFxuXHRWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUNvbnRyb2wsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCAqIGFzIF9tb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IERhdGVSYW5nZVByZXNldCB9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyLm1vZGVscyc7XG5pbXBvcnQge0xvY2FsZUNvbmZpZ30gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIuY29uZmlnJztcbmltcG9ydCB7TG9jYWxlU2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvbG9jYWxlLnNlcnZpY2UnO1xuXG5jb25zdCBtb21lbnQgPSBfbW9tZW50O1xuXG5leHBvcnQgZW51bSBTaWRlRW51bSB7XG5cdGxlZnQgPSAnbGVmdCcsXG5cdHJpZ2h0ID0gJ3JpZ2h0J1xufVxuXG5AQ29tcG9uZW50KHtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuXHRzZWxlY3RvcjogJ25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwnLFxuXHRzdHlsZVVybHM6IFsnLi9kYXRlLXJhbmdlLXBpY2tlci5jb21wb25lbnQuc2NzcyddLFxuXHR0ZW1wbGF0ZVVybDogJy4vZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuXHRob3N0OiB7XG5cdFx0JyhjbGljayknOiAnaGFuZGxlSW50ZXJuYWxDbGljaygkZXZlbnQpJ1xuXHR9LFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRwcm92aWRlcnM6IFtcblx0XHR7XG5cdFx0XHRwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCksXG5cdFx0XHRtdWx0aTogdHJ1ZVxuXHRcdH1cblx0XVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXHRASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XG5cdFx0dGhpcy5fbG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWUgfTtcblx0fVxuXHRnZXQgbG9jYWxlKCk6IExvY2FsZUNvbmZpZyB7XG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsZTtcblx0fVxuXG5cdEBJbnB1dCgpIHNldCByYW5nZXModmFsdWU6IERhdGVSYW5nZVByZXNldFtdKSB7XG5cdFx0dGhpcy5fcmFuZ2VzID0gdmFsdWU7XG5cdFx0dGhpcy5yZW5kZXJSYW5nZXMoKTtcblx0fVxuXHRnZXQgcmFuZ2VzKCk6IERhdGVSYW5nZVByZXNldFtdIHtcblx0XHRyZXR1cm4gdGhpcy5fcmFuZ2VzO1xuXHR9XG5cblx0Y29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSkge1xuXHRcdHRoaXMuY2hvb3NlZERhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5yYW5nZUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5kYXRlc1VwZGF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5zdGFydERhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRcdHRoaXMuZW5kRGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdH1cblx0cHJpdmF0ZSBfb2xkOiB7IHN0YXJ0OiBhbnk7IGVuZDogYW55IH0gPSB7IHN0YXJ0OiBudWxsLCBlbmQ6IG51bGwgfTtcblx0Y2hvc2VuTGFiZWw6IHN0cmluZztcblx0Y2FsZW5kYXJWYXJpYWJsZXM6IHsgbGVmdDogYW55OyByaWdodDogYW55IH0gPSB7IGxlZnQ6IHt9LCByaWdodDoge30gfTtcblx0dGltZXBpY2tlclZhcmlhYmxlczogeyBsZWZ0OiBhbnk7IHJpZ2h0OiBhbnkgfSA9IHsgbGVmdDoge30sIHJpZ2h0OiB7fSB9O1xuXHRkYXRlcmFuZ2VwaWNrZXI6IHsgc3RhcnQ6IEZvcm1Db250cm9sOyBlbmQ6IEZvcm1Db250cm9sIH0gPSB7IHN0YXJ0OiBuZXcgRm9ybUNvbnRyb2woKSwgZW5kOiBuZXcgRm9ybUNvbnRyb2woKSB9O1xuXHRhcHBseUJ0bjogeyBkaXNhYmxlZDogYm9vbGVhbiB9ID0geyBkaXNhYmxlZDogZmFsc2UgfTtcblx0QElucHV0KClcblx0c3RhcnREYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG5cdEBJbnB1dCgpXG5cdGVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG5cblx0QElucHV0KClcblx0ZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xuXHQvLyB1c2VkIGluIHRlbXBsYXRlIGZvciBjb21waWxlIHRpbWUgc3VwcG9ydCBvZiBlbnVtIHZhbHVlcy5cblx0c2lkZUVudW0gPSBTaWRlRW51bTtcblx0QElucHV0KClcblx0bWluRGF0ZTogX21vbWVudC5Nb21lbnQgPSBudWxsO1xuXHRASW5wdXQoKVxuXHRtYXhEYXRlOiBfbW9tZW50Lk1vbWVudCA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdGF1dG9BcHBseTogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRzaW5nbGVEYXRlUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHNob3dEcm9wZG93bnM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0c2hvd1dlZWtOdW1iZXJzOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHNob3dJU09XZWVrTnVtYmVyczogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRsaW5rZWRDYWxlbmRhcnM6IEJvb2xlYW4gPSAhdGhpcy5zaW5nbGVEYXRlUGlja2VyO1xuXHRASW5wdXQoKVxuXHRhdXRvVXBkYXRlSW5wdXQ6IEJvb2xlYW4gPSB0cnVlO1xuXHRASW5wdXQoKVxuXHRhbHdheXNTaG93Q2FsZW5kYXJzOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGxvY2tTdGFydERhdGU6IEJvb2xlYW4gPSBmYWxzZTtcblx0Ly8gdGltZXBpY2tlciB2YXJpYWJsZXNcblx0QElucHV0KClcblx0dGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyMjRIb3VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXJJbmNyZW1lbnQgPSAxO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xuXHQvLyBlbmQgb2YgdGltZXBpY2tlciB2YXJpYWJsZXNcblx0QElucHV0KClcblx0c2hvd0NsZWFyQnV0dG9uOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0bGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmcgPSBudWxsO1xuXHRASW5wdXQoKVxuXHRmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZyA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NBcHBseTogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSZXNldDogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSYW5nZTogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0aXNGdWxsU2NyZWVuUGlja2VyOiBib29sZWFuO1xuXG5cdF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuXHQvLyBjdXN0b20gcmFuZ2VzXG5cdF9yYW5nZXM6IERhdGVSYW5nZVByZXNldFtdID0gW107XG5cblx0QElucHV0KClcblx0c2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDYW5jZWwgPSBmYWxzZTtcblx0QElucHV0KClcblx0a2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRzaG93UmFuZ2VMYWJlbE9uSW5wdXQgPSBmYWxzZTtcblx0QElucHV0KClcblx0Y3VzdG9tUmFuZ2VEaXJlY3Rpb24gPSBmYWxzZTtcblx0Y2hvc2VuUmFuZ2U6IERhdGVSYW5nZVByZXNldDtcblxuXHQvLyBzb21lIHN0YXRlIGluZm9ybWF0aW9uXG5cdGlzU2hvd246IEJvb2xlYW4gPSBmYWxzZTtcblx0aW5saW5lID0gdHJ1ZTtcblx0bGVmdENhbGVuZGFyOiBhbnkgPSB7IG1vbnRoOiBtb21lbnQoKSB9O1xuXHRyaWdodENhbGVuZGFyOiBhbnkgPSB7IG1vbnRoOiBtb21lbnQoKS5hZGQoMSwgJ21vbnRoJykgfTtcblx0c2hvd0NhbEluUmFuZ2VzOiBCb29sZWFuID0gZmFsc2U7XG5cblx0b3B0aW9uczogYW55ID0ge307IC8vIHNob3VsZCBnZXQgc29tZSBvcHQgZnJvbSB1c2VyXG5cdEBJbnB1dCgpIGRyb3BzOiBzdHJpbmc7XG5cdEBJbnB1dCgpIG9wZW5zOiBzdHJpbmc7XG5cdEBJbnB1dCgpIGNsb3NlT25BdXRvQXBwbHkgPSB0cnVlO1xuXHRAT3V0cHV0KCkgY2hvb3NlZERhdGU6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuXHRAT3V0cHV0KCkgcmFuZ2VDbGlja2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0Pjtcblx0QE91dHB1dCgpIGRhdGVzVXBkYXRlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XG5cdEBPdXRwdXQoKSBzdGFydERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0Pjtcblx0QE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0Pjtcblx0Ly8gQHRzLWlnbm9yZVxuXHRAVmlld0NoaWxkKCdwaWNrZXJDb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBwaWNrZXJDb250YWluZXI6IEVsZW1lbnRSZWY7XG5cdCRldmVudDogYW55O1xuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMuX2J1aWxkTG9jYWxlKCk7XG5cdFx0Y29uc3QgZGF5c09mV2VlayA9IFsuLi50aGlzLmxvY2FsZS5kYXlzT2ZXZWVrXTtcblx0XHRpZiAodGhpcy5sb2NhbGUuZmlyc3REYXkgIT09IDApIHtcblx0XHRcdGxldCBpdGVyYXRvciA9IHRoaXMubG9jYWxlLmZpcnN0RGF5O1xuXG5cdFx0XHR3aGlsZSAoaXRlcmF0b3IgPiAwKSB7XG5cdFx0XHRcdGRheXNPZldlZWsucHVzaChkYXlzT2ZXZWVrLnNoaWZ0KCkpO1xuXHRcdFx0XHRpdGVyYXRvci0tO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmxvY2FsZS5kYXlzT2ZXZWVrID0gZGF5c09mV2Vlaztcblx0XHRpZiAodGhpcy5pbmxpbmUpIHtcblx0XHRcdHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0XHR0aGlzLl9vbGQuZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5zZXRTdGFydERhdGUodGhpcy5zdGFydERhdGUpO1xuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmVuZERhdGUgJiYgdGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHR0aGlzLnNldEVuZERhdGUodGhpcy5lbmREYXRlKTtcblx0XHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XG5cdFx0dGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5sZWZ0KTtcblx0XHR0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcblx0XHR0aGlzLnJlbmRlclJhbmdlcygpO1xuXHR9XG5cblx0cmVuZGVyUmFuZ2VzKCkge1xuXHRcdGxldCBzdGFydCwgZW5kO1xuXHRcdHRoaXMucmFuZ2VzLmZvckVhY2gocHJlc2V0ID0+IHtcblx0XHRcdHN0YXJ0ID0gcHJlc2V0LnJhbmdlLnN0YXJ0O1xuXHRcdFx0ZW5kID0gcHJlc2V0LnJhbmdlLmVuZDtcblx0XHRcdC8vIElmIHRoZSBzdGFydCBvciBlbmQgZGF0ZSBleGNlZWQgdGhvc2UgYWxsb3dlZCBieSB0aGUgbWluRGF0ZVxuXHRcdFx0Ly8gb3B0aW9uLCBzaG9ydGVuIHRoZSByYW5nZSB0byB0aGUgYWxsb3dhYmxlIHBlcmlvZC5cblx0XHRcdGlmICh0aGlzLm1pbkRhdGUgJiYgc3RhcnQuaXNCZWZvcmUodGhpcy5taW5EYXRlKSkge1xuXHRcdFx0XHRzdGFydCA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcblx0XHRcdGlmIChtYXhEYXRlICYmIGVuZC5pc0FmdGVyKG1heERhdGUpKSB7XG5cdFx0XHRcdGVuZCA9IG1heERhdGUuY2xvbmUoKTtcblx0XHRcdH1cblx0XHRcdC8vIElmIHRoZSBlbmQgb2YgdGhlIHJhbmdlIGlzIGJlZm9yZSB0aGUgbWluaW11bSBvciB0aGUgc3RhcnQgb2YgdGhlIHJhbmdlIGlzXG5cdFx0XHQvLyBhZnRlciB0aGUgbWF4aW11bSwgZG9uJ3QgZGlzcGxheSB0aGlzIHJhbmdlIG9wdGlvbiBhdCBhbGwuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCh0aGlzLm1pbkRhdGUgJiYgZW5kLmlzQmVmb3JlKHRoaXMubWluRGF0ZSwgdGhpcy50aW1lUGlja2VyID8gJ21pbnV0ZScgOiAnZGF5JykpIHx8XG5cdFx0XHRcdChtYXhEYXRlICYmIGVuZC5pc0FmdGVyKG1heERhdGUsIHRoaXMudGltZVBpY2tlciA/ICdtaW51dGUnIDogJ2RheScpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIGNvbnRpbnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gU3VwcG9ydCB1bmljb2RlIGNoYXJzIGluIHRoZSByYW5nZSBuYW1lcy5cblx0XHRcdFx0Y29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG5cdFx0XHRcdGVsZW0uaW5uZXJIVE1MID0gcHJlc2V0LmxhYmVsO1xuXHRcdFx0XHRwcmVzZXQubGFiZWwgPSAgZWxlbS52YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMuZW5kRGF0ZS5lbmRPZignZGF5Jyk7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyVGltZVBpY2tlcihzaWRlOiBTaWRlRW51bSkge1xuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5yaWdodCAmJiAhdGhpcy5lbmREYXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBzZWxlY3RlZCwgbWluRGF0ZTtcblx0XHRjb25zdCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHQoc2VsZWN0ZWQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpKSwgKG1pbkRhdGUgPSB0aGlzLm1pbkRhdGUpO1xuXHRcdH0gZWxzZSBpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQpIHtcblx0XHRcdChzZWxlY3RlZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpKSwgKG1pbkRhdGUgPSB0aGlzLnN0YXJ0RGF0ZSk7XG5cdFx0fVxuXHRcdGNvbnN0IHN0YXJ0ID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gMCA6IDE7XG5cdFx0Y29uc3QgZW5kID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gMjMgOiAxMjtcblx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0gPSB7XG5cdFx0XHRob3VyczogW10sXG5cdFx0XHRtaW51dGVzOiBbXSxcblx0XHRcdG1pbnV0ZXNMYWJlbDogW10sXG5cdFx0XHRzZWNvbmRzOiBbXSxcblx0XHRcdHNlY29uZHNMYWJlbDogW10sXG5cdFx0XHRkaXNhYmxlZEhvdXJzOiBbXSxcblx0XHRcdGRpc2FibGVkTWludXRlczogW10sXG5cdFx0XHRkaXNhYmxlZFNlY29uZHM6IFtdLFxuXHRcdFx0c2VsZWN0ZWRIb3VyOiAwLFxuXHRcdFx0c2VsZWN0ZWRNaW51dGU6IDAsXG5cdFx0XHRzZWxlY3RlZFNlY29uZDogMFxuXHRcdH07XG5cdFx0Ly8gZ2VuZXJhdGUgaG91cnNcblx0XHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcblx0XHRcdGxldCBpX2luXzI0ID0gaTtcblx0XHRcdGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG5cdFx0XHRcdGlfaW5fMjQgPSBzZWxlY3RlZC5ob3VyKCkgPj0gMTIgPyAoaSA9PT0gMTIgPyAxMiA6IGkgKyAxMikgOiBpID09PSAxMiA/IDAgOiBpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5ob3VyKGlfaW5fMjQpO1xuXHRcdFx0bGV0IGRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRpZiAobWluRGF0ZSAmJiB0aW1lLm1pbnV0ZSg1OSkuaXNCZWZvcmUobWluRGF0ZSkpIHtcblx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1heERhdGUgJiYgdGltZS5taW51dGUoMCkuaXNBZnRlcihtYXhEYXRlKSkge1xuXHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5ob3Vycy5wdXNoKGkpO1xuXHRcdFx0aWYgKGlfaW5fMjQgPT09IHNlbGVjdGVkLmhvdXIoKSAmJiAhZGlzYWJsZWQpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciA9IGk7XG5cdFx0XHR9IGVsc2UgaWYgKGRpc2FibGVkKSB7XG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZEhvdXJzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGdlbmVyYXRlIG1pbnV0ZXNcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpICs9IHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuXHRcdFx0Y29uc3QgcGFkZGVkID0gaSA8IDEwID8gJzAnICsgaSA6IGk7XG5cdFx0XHRjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5taW51dGUoaSk7XG5cblx0XHRcdGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0aWYgKG1pbkRhdGUgJiYgdGltZS5zZWNvbmQoNTkpLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG5cdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChtYXhEYXRlICYmIHRpbWUuc2Vjb25kKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcblx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLm1pbnV0ZXMucHVzaChpKTtcblx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzTGFiZWwucHVzaChwYWRkZWQpO1xuXHRcdFx0aWYgKHNlbGVjdGVkLm1pbnV0ZSgpID09PSBpICYmICFkaXNhYmxlZCkge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUgPSBpO1xuXHRcdFx0fSBlbHNlIGlmIChkaXNhYmxlZCkge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uZGlzYWJsZWRNaW51dGVzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGdlbmVyYXRlIHNlY29uZHNcblx0XHRpZiAodGhpcy50aW1lUGlja2VyU2Vjb25kcykge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHBhZGRlZCA9IGkgPCAxMCA/ICcwJyArIGkgOiBpO1xuXHRcdFx0XHRjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5zZWNvbmQoaSk7XG5cblx0XHRcdFx0bGV0IGRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmIChtaW5EYXRlICYmIHRpbWUuaXNCZWZvcmUobWluRGF0ZSkpIHtcblx0XHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG1heERhdGUgJiYgdGltZS5pc0FmdGVyKG1heERhdGUpKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlY29uZHMucHVzaChpKTtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlY29uZHNMYWJlbC5wdXNoKHBhZGRlZCk7XG5cdFx0XHRcdGlmIChzZWxlY3RlZC5zZWNvbmQoKSA9PT0gaSAmJiAhZGlzYWJsZWQpIHtcblx0XHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQgPSBpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGRpc2FibGVkKSB7XG5cdFx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkU2Vjb25kcy5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGdlbmVyYXRlIEFNL1BNXG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bWluRGF0ZSAmJlxuXHRcdFx0XHRzZWxlY3RlZFxuXHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0LmhvdXIoMTIpXG5cdFx0XHRcdFx0Lm1pbnV0ZSgwKVxuXHRcdFx0XHRcdC5zZWNvbmQoMClcblx0XHRcdFx0XHQuaXNCZWZvcmUobWluRGF0ZSlcblx0XHRcdCkge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1EaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0bWF4RGF0ZSAmJlxuXHRcdFx0XHRzZWxlY3RlZFxuXHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0LmhvdXIoMClcblx0XHRcdFx0XHQubWludXRlKDApXG5cdFx0XHRcdFx0LnNlY29uZCgwKVxuXHRcdFx0XHRcdC5pc0FmdGVyKG1heERhdGUpXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnBtRGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHNlbGVjdGVkLmhvdXIoKSA+PSAxMikge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsID0gJ1BNJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWwgPSAnQU0nO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcblx0fVxuXHRyZW5kZXJDYWxlbmRhcihzaWRlOiBTaWRlRW51bSkge1xuXHRcdGNvbnN0IG1haW5DYWxlbmRhcjogYW55ID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdCA/IHRoaXMubGVmdENhbGVuZGFyIDogdGhpcy5yaWdodENhbGVuZGFyO1xuXHRcdGNvbnN0IG1vbnRoID0gbWFpbkNhbGVuZGFyLm1vbnRoLm1vbnRoKCk7XG5cdFx0Y29uc3QgeWVhciA9IG1haW5DYWxlbmRhci5tb250aC55ZWFyKCk7XG5cdFx0Y29uc3QgaG91ciA9IG1haW5DYWxlbmRhci5tb250aC5ob3VyKCk7XG5cdFx0Y29uc3QgbWludXRlID0gbWFpbkNhbGVuZGFyLm1vbnRoLm1pbnV0ZSgpO1xuXHRcdGNvbnN0IHNlY29uZCA9IG1haW5DYWxlbmRhci5tb250aC5zZWNvbmQoKTtcblx0XHRjb25zdCBkYXlzSW5Nb250aCA9IG1vbWVudChbeWVhciwgbW9udGhdKS5kYXlzSW5Nb250aCgpO1xuXHRcdGNvbnN0IGZpcnN0RGF5ID0gbW9tZW50KFt5ZWFyLCBtb250aCwgMV0pO1xuXHRcdGNvbnN0IGxhc3REYXkgPSBtb21lbnQoW3llYXIsIG1vbnRoLCBkYXlzSW5Nb250aF0pO1xuXHRcdGNvbnN0IGxhc3RNb250aCA9IG1vbWVudChmaXJzdERheSlcblx0XHRcdC5zdWJ0cmFjdCgxLCAnbW9udGgnKVxuXHRcdFx0Lm1vbnRoKCk7XG5cdFx0Y29uc3QgbGFzdFllYXIgPSBtb21lbnQoZmlyc3REYXkpXG5cdFx0XHQuc3VidHJhY3QoMSwgJ21vbnRoJylcblx0XHRcdC55ZWFyKCk7XG5cdFx0Y29uc3QgZGF5c0luTGFzdE1vbnRoID0gbW9tZW50KFtsYXN0WWVhciwgbGFzdE1vbnRoXSkuZGF5c0luTW9udGgoKTtcblx0XHRjb25zdCBkYXlPZldlZWsgPSBmaXJzdERheS5kYXkoKTtcblx0XHQvLyBpbml0aWFsaXplIGEgNiByb3dzIHggNyBjb2x1bW5zIGFycmF5IGZvciB0aGUgY2FsZW5kYXJcblx0XHRjb25zdCBjYWxlbmRhcjogYW55ID0gW107XG5cdFx0Y2FsZW5kYXIuZmlyc3REYXkgPSBmaXJzdERheTtcblx0XHRjYWxlbmRhci5sYXN0RGF5ID0gbGFzdERheTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG5cdFx0XHRjYWxlbmRhcltpXSA9IFtdO1xuXHRcdH1cblxuXHRcdC8vIHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGRhdGUgb2JqZWN0c1xuXHRcdGxldCBzdGFydERheSA9IGRheXNJbkxhc3RNb250aCAtIGRheU9mV2VlayArIHRoaXMubG9jYWxlLmZpcnN0RGF5ICsgMTtcblx0XHRpZiAoc3RhcnREYXkgPiBkYXlzSW5MYXN0TW9udGgpIHtcblx0XHRcdHN0YXJ0RGF5IC09IDc7XG5cdFx0fVxuXG5cdFx0aWYgKGRheU9mV2VlayA9PT0gdGhpcy5sb2NhbGUuZmlyc3REYXkpIHtcblx0XHRcdHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gNjtcblx0XHR9XG5cblx0XHRsZXQgY3VyRGF0ZSA9IG1vbWVudChbbGFzdFllYXIsIGxhc3RNb250aCwgc3RhcnREYXksIDEyLCBtaW51dGUsIHNlY29uZF0pO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGNvbCA9IDAsIHJvdyA9IDA7IGkgPCA0MjsgaSsrLCBjb2wrKywgY3VyRGF0ZSA9IG1vbWVudChjdXJEYXRlKS5hZGQoMjQsICdob3VyJykpIHtcblx0XHRcdGlmIChpID4gMCAmJiBjb2wgJSA3ID09PSAwKSB7XG5cdFx0XHRcdGNvbCA9IDA7XG5cdFx0XHRcdHJvdysrO1xuXHRcdFx0fVxuXHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdID0gY3VyRGF0ZVxuXHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHQuaG91cihob3VyKVxuXHRcdFx0XHQubWludXRlKG1pbnV0ZSlcblx0XHRcdFx0LnNlY29uZChzZWNvbmQpO1xuXHRcdFx0Y3VyRGF0ZS5ob3VyKDEyKTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHR0aGlzLm1pbkRhdGUgJiZcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLm1pbkRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgJiZcblx0XHRcdFx0c2lkZSA9PT0gJ2xlZnQnXG5cdFx0XHQpIHtcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0dGhpcy5tYXhEYXRlICYmXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5tYXhEYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkgJiZcblx0XHRcdFx0c2lkZSA9PT0gJ3JpZ2h0J1xuXHRcdFx0KSB7XG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIG1ha2UgdGhlIGNhbGVuZGFyIG9iamVjdCBhdmFpbGFibGUgdG8gaG92ZXJEYXRlL2NsaWNrRGF0ZVxuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5jYWxlbmRhciA9IGNhbGVuZGFyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcblx0XHR9XG5cdFx0Ly9cblx0XHQvLyBEaXNwbGF5IHRoZSBjYWxlbmRhclxuXHRcdC8vXG5cdFx0Y29uc3QgbWluRGF0ZSA9IHNpZGUgPT09ICdsZWZ0JyA/IHRoaXMubWluRGF0ZSA6IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0aWYgKHRoaXMubGVmdENhbGVuZGFyLm1vbnRoICYmIG1pbkRhdGUgJiYgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgueWVhcigpIDwgbWluRGF0ZS55ZWFyKCkpIHtcblx0XHRcdG1pbkRhdGUueWVhcih0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKCkpO1xuXHRcdH1cblx0XHRsZXQgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcblx0XHQvLyBhZGp1c3QgbWF4RGF0ZSB0byByZWZsZWN0IHRoZSBkYXRlTGltaXQgc2V0dGluZyBpbiBvcmRlciB0b1xuXHRcdC8vIGdyZXkgb3V0IGVuZCBkYXRlcyBiZXlvbmQgdGhlIGRhdGVMaW1pdFxuXHRcdGlmICh0aGlzLmVuZERhdGUgPT09IG51bGwgJiYgdGhpcy5kYXRlTGltaXQpIHtcblx0XHRcdGNvbnN0IG1heExpbWl0ID0gdGhpcy5zdGFydERhdGVcblx0XHRcdFx0LmNsb25lKClcblx0XHRcdFx0LmFkZCh0aGlzLmRhdGVMaW1pdCwgJ2RheScpXG5cdFx0XHRcdC5lbmRPZignZGF5Jyk7XG5cdFx0XHRpZiAoIW1heERhdGUgfHwgbWF4TGltaXQuaXNCZWZvcmUobWF4RGF0ZSkpIHtcblx0XHRcdFx0bWF4RGF0ZSA9IG1heExpbWl0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdID0ge1xuXHRcdFx0bW9udGg6IG1vbnRoLFxuXHRcdFx0eWVhcjogeWVhcixcblx0XHRcdGhvdXI6IGhvdXIsXG5cdFx0XHRtaW51dGU6IG1pbnV0ZSxcblx0XHRcdHNlY29uZDogc2Vjb25kLFxuXHRcdFx0ZGF5c0luTW9udGg6IGRheXNJbk1vbnRoLFxuXHRcdFx0Zmlyc3REYXk6IGZpcnN0RGF5LFxuXHRcdFx0bGFzdERheTogbGFzdERheSxcblx0XHRcdGxhc3RNb250aDogbGFzdE1vbnRoLFxuXHRcdFx0bGFzdFllYXI6IGxhc3RZZWFyLFxuXHRcdFx0ZGF5c0luTGFzdE1vbnRoOiBkYXlzSW5MYXN0TW9udGgsXG5cdFx0XHRkYXlPZldlZWs6IGRheU9mV2Vlayxcblx0XHRcdC8vIG90aGVyIHZhcnNcblx0XHRcdGNhbFJvd3M6IEFycmF5LmZyb20oQXJyYXkoNikua2V5cygpKSxcblx0XHRcdGNhbENvbHM6IEFycmF5LmZyb20oQXJyYXkoNykua2V5cygpKSxcblx0XHRcdGNsYXNzZXM6IHt9LFxuXHRcdFx0bWluRGF0ZTogbWluRGF0ZSxcblx0XHRcdG1heERhdGU6IG1heERhdGUsXG5cdFx0XHRjYWxlbmRhcjogY2FsZW5kYXJcblx0XHR9O1xuXHRcdGlmICh0aGlzLnNob3dEcm9wZG93bnMpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRNb250aCA9IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCk7XG5cdFx0XHRjb25zdCBjdXJyZW50WWVhciA9IGNhbGVuZGFyWzFdWzFdLnllYXIoKTtcblx0XHRcdGNvbnN0IHJlYWxDdXJyZW50WWVhciA9IG1vbWVudCgpLnllYXIoKTtcblx0XHRcdGNvbnN0IG1heFllYXIgPSAobWF4RGF0ZSAmJiBtYXhEYXRlLnllYXIoKSkgfHwgcmVhbEN1cnJlbnRZZWFyICsgNTtcblx0XHRcdGNvbnN0IG1pblllYXIgPSAobWluRGF0ZSAmJiBtaW5EYXRlLnllYXIoKSkgfHwgcmVhbEN1cnJlbnRZZWFyIC0gMTAwO1xuXHRcdFx0Y29uc3QgaW5NaW5ZZWFyID0gY3VycmVudFllYXIgPT09IG1pblllYXI7XG5cdFx0XHRjb25zdCBpbk1heFllYXIgPSBjdXJyZW50WWVhciA9PT0gbWF4WWVhcjtcblx0XHRcdGNvbnN0IHllYXJzID0gW107XG5cdFx0XHRmb3IgKGxldCB5ID0gbWluWWVhcjsgeSA8PSBtYXhZZWFyOyB5KyspIHtcblx0XHRcdFx0eWVhcnMucHVzaCh5KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zID0ge1xuXHRcdFx0XHRjdXJyZW50TW9udGg6IGN1cnJlbnRNb250aCxcblx0XHRcdFx0Y3VycmVudFllYXI6IGN1cnJlbnRZZWFyLFxuXHRcdFx0XHRtYXhZZWFyOiBtYXhZZWFyLFxuXHRcdFx0XHRtaW5ZZWFyOiBtaW5ZZWFyLFxuXHRcdFx0XHRpbk1pblllYXI6IGluTWluWWVhcixcblx0XHRcdFx0aW5NYXhZZWFyOiBpbk1heFllYXIsXG5cdFx0XHRcdG1vbnRoQXJyYXlzOiBBcnJheS5mcm9tKEFycmF5KDEyKS5rZXlzKCkpLFxuXHRcdFx0XHR5ZWFyQXJyYXlzOiB5ZWFyc1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0dGhpcy5fYnVpbGRDZWxscyhjYWxlbmRhciwgc2lkZSk7XG5cdH1cblx0c2V0U3RhcnREYXRlKHN0YXJ0RGF0ZSkge1xuXHRcdGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnc3RyaW5nJykge1xuXHRcdFx0dGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlLm1pbnV0ZShcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnRcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubWluRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpKSB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcblx0XHRcdFx0dGhpcy5zdGFydERhdGUubWludXRlKFxuXHRcdFx0XHRcdE1hdGgucm91bmQodGhpcy5zdGFydERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5tYXhEYXRlLmNsb25lKCk7XG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuXHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5taW51dGUoXG5cdFx0XHRcdFx0TWF0aC5mbG9vcih0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnRcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNTaG93bikge1xuXHRcdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdFx0fVxuXHRcdHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KHsgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSB9KTtcblx0XHR0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuXHR9XG5cblx0c2V0RW5kRGF0ZShlbmREYXRlKSB7XG5cdFx0aWYgKHR5cGVvZiBlbmREYXRlID09PSAnc3RyaW5nJykge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUsIHRoaXMubG9jYWxlLmZvcm1hdCk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBlbmREYXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlXG5cdFx0XHRcdC5hZGQoMSwgJ2QnKVxuXHRcdFx0XHQuc3RhcnRPZignZGF5Jylcblx0XHRcdFx0LnN1YnRyYWN0KDEsICdzZWNvbmQnKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuXHRcdFx0dGhpcy5lbmREYXRlLm1pbnV0ZShcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLmVuZERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmVuZERhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUpKSB7XG5cdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5lbmREYXRlLmlzQWZ0ZXIodGhpcy5tYXhEYXRlKSkge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5tYXhEYXRlLmNsb25lKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0dGhpcy5kYXRlTGltaXQgJiZcblx0XHRcdHRoaXMuc3RhcnREYXRlXG5cdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdC5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKVxuXHRcdFx0XHQuaXNCZWZvcmUodGhpcy5lbmREYXRlKVxuXHRcdCkge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNTaG93bikge1xuXHRcdFx0Ly8gdGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdFx0fVxuXHRcdHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdCh7IGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcblx0XHR0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuXHR9XG5cdEBJbnB1dCgpXG5cdGlzSW52YWxpZERhdGUoZGF0ZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRASW5wdXQoKVxuXHRpc0N1c3RvbURhdGUoZGF0ZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHVwZGF0ZVZpZXcoKSB7XG5cdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHR9XG5cblx0dXBkYXRlTW9udGhzSW5WaWV3KCkge1xuXHRcdGlmICh0aGlzLmVuZERhdGUpIHtcblx0XHRcdC8vIGlmIGJvdGggZGF0ZXMgYXJlIHZpc2libGUgYWxyZWFkeSwgZG8gbm90aGluZ1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQhdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoICYmXG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCAmJlxuXHRcdFx0XHQoKHRoaXMuc3RhcnREYXRlICYmXG5cdFx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIgJiZcblx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpIHx8XG5cdFx0XHRcdFx0KHRoaXMuc3RhcnREYXRlICYmXG5cdFx0XHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIgJiZcblx0XHRcdFx0XHRcdHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpKSAmJlxuXHRcdFx0XHQodGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSB8fFxuXHRcdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSkge1xuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdCF0aGlzLmxpbmtlZENhbGVuZGFycyAmJlxuXHRcdFx0XHRcdCh0aGlzLmVuZERhdGUubW9udGgoKSAhPT0gdGhpcy5zdGFydERhdGUubW9udGgoKSB8fCB0aGlzLmVuZERhdGUueWVhcigpICE9PSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpLmRhdGUoMik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGVcblx0XHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0XHQuZGF0ZSgyKVxuXHRcdFx0XHRcdFx0LmFkZCgxLCAnbW9udGgnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpICE9PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSAmJlxuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgIT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlXG5cdFx0XHRcdFx0LmNsb25lKClcblx0XHRcdFx0XHQuZGF0ZSgyKVxuXHRcdFx0XHRcdC5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5saW5rZWRDYWxlbmRhcnMgJiYgIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPiB0aGlzLm1heERhdGUpIHtcblx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMubWF4RGF0ZVxuXHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHQuZGF0ZSgyKVxuXHRcdFx0XHQuc3VidHJhY3QoMSwgJ21vbnRoJyk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiAgVGhpcyBpcyByZXNwb25zaWJsZSBmb3IgdXBkYXRpbmcgdGhlIGNhbGVuZGFyc1xuXHQgKi9cblx0dXBkYXRlQ2FsZW5kYXJzKCkge1xuXHRcdHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XG5cdFx0dGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XG5cblx0XHRpZiAodGhpcy5lbmREYXRlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0fVxuXHR1cGRhdGVFbGVtZW50KCkge1xuXHRcdGNvbnN0IGZvcm1hdCA9IHRoaXMubG9jYWxlLmRpc3BsYXlGb3JtYXQgPyB0aGlzLmxvY2FsZS5kaXNwbGF5Rm9ybWF0IDogdGhpcy5sb2NhbGUuZm9ybWF0O1xuXG5cdFx0aWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5hdXRvVXBkYXRlSW5wdXQpIHtcblx0XHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcblx0XHRcdFx0Ly8gaWYgd2UgdXNlIHJhbmdlcyBhbmQgc2hvdWxkIHNob3cgcmFuZ2UgbGFiZWwgb24gaW5wdXRcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMucmFuZ2VzLmxlbmd0aCAmJlxuXHRcdFx0XHRcdHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0ID09PSB0cnVlICYmXG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5SYW5nZSAvKiYmXG5cdFx0XHRcdFx0dGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCAhPT0gdGhpcy5jaG9zZW5SYW5nZS5sYWJlbCovXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLmNob3NlblJhbmdlLmxhYmVsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuY2hvc2VuTGFiZWwgPVxuXHRcdFx0XHRcdFx0dGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCkgK1xuXHRcdFx0XHRcdFx0dGhpcy5sb2NhbGUuc2VwYXJhdG9yICtcblx0XHRcdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoZm9ybWF0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGhpcy5hdXRvVXBkYXRlSW5wdXQpIHtcblx0XHRcdHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoZm9ybWF0KTtcblx0XHR9XG5cdH1cblxuXHRyZW1vdmUoKSB7XG5cdFx0dGhpcy5pc1Nob3duID0gZmFsc2U7XG5cdH1cblx0LyoqXG5cdCAqIHRoaXMgc2hvdWxkIGNhbGN1bGF0ZSB0aGUgbGFiZWxcblx0ICovXG5cdGNhbGN1bGF0ZUNob3NlbkxhYmVsKCkge1xuXHRcdGlmICghdGhpcy5sb2NhbGUgfHwgIXRoaXMubG9jYWxlLnNlcGFyYXRvcikge1xuXHRcdFx0dGhpcy5fYnVpbGRMb2NhbGUoKTtcblx0XHR9XG5cdFx0bGV0IGN1c3RvbVJhbmdlID0gdHJ1ZTtcblx0XHRsZXQgaSA9IDA7XG5cblx0XHR0aGlzLnJhbmdlcy5mb3JFYWNoKHByZXNldCA9PiB7XG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyAnWVlZWS1NTS1ERCBISDptbTpzcycgOiAnWVlZWS1NTS1ERCBISDptbSc7XG5cdFx0XHRcdC8vIGlnbm9yZSB0aW1lcyB3aGVuIGNvbXBhcmluZyBkYXRlcyBpZiB0aW1lIHBpY2tlciBzZWNvbmRzIGlzIG5vdCBlbmFibGVkXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoZm9ybWF0KSA9PT0gcHJlc2V0LnJhbmdlLnN0YXJ0LmZvcm1hdChmb3JtYXQpICYmXG5cdFx0XHRcdFx0dGhpcy5lbmREYXRlLmZvcm1hdChmb3JtYXQpID09PSBwcmVzZXQucmFuZ2UuZW5kLmZvcm1hdChmb3JtYXQpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGN1c3RvbVJhbmdlID0gZmFsc2U7XG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5SYW5nZSA9IHByZXNldDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaWdub3JlIHRpbWVzIHdoZW4gY29tcGFyaW5nIGRhdGVzIGlmIHRpbWUgcGlja2VyIGlzIG5vdCBlbmFibGVkXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gcHJlc2V0LnJhbmdlLnN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG5cdFx0XHRcdFx0dGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSBwcmVzZXQucmFuZ2UuZW5kLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGN1c3RvbVJhbmdlID0gZmFsc2U7XG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5SYW5nZSA9IHByZXNldDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aSsrO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGN1c3RvbVJhbmdlKSB7XG5cdFx0XHRpZiAodGhpcy5zaG93Q3VzdG9tUmFuZ2VMYWJlbCkge1xuXHRcdFx0XHQvLyB0aGlzLmNob3NlblJhbmdlLmxhYmVsID0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY2hvc2VuUmFuZ2UgPSBudWxsO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgY3VzdG9tIGxhYmVsOiBzaG93IGNhbGVuZGFyXG5cdFx0XHR0aGlzLnNob3dDYWxJblJhbmdlcyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdH1cblxuXHRjbGlja0FwcGx5KGU/KSB7XG5cdFx0aWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5zdGFydERhdGUgJiYgIXRoaXMuZW5kRGF0ZSkge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcblx0XHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuaXNJbnZhbGlkRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcblx0XHRcdC8vIGdldCBpZiB0aGVyZSBhcmUgaW52YWxpZCBkYXRlIGJldHdlZW4gcmFuZ2Vcblx0XHRcdGNvbnN0IGQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdFx0d2hpbGUgKGQuaXNCZWZvcmUodGhpcy5lbmREYXRlKSkge1xuXHRcdFx0XHRpZiAodGhpcy5pc0ludmFsaWREYXRlKGQpKSB7XG5cdFx0XHRcdFx0dGhpcy5lbmREYXRlID0gZC5zdWJ0cmFjdCgxLCAnZGF5cycpO1xuXHRcdFx0XHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRkLmFkZCgxLCAnZGF5cycpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodGhpcy5jaG9zZW5MYWJlbCkge1xuXHRcdFx0dGhpcy5jaG9vc2VkRGF0ZS5lbWl0KHsgY2hvc2VuTGFiZWw6IHRoaXMuY2hvc2VuTGFiZWwsIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsIGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcblx0XHR9XG5cblx0XHR0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHsgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSwgZW5kRGF0ZTogdGhpcy5lbmREYXRlIH0pO1xuXHRcdGlmIChlIHx8ICh0aGlzLmNsb3NlT25BdXRvQXBwbHkgJiYgIWUpKSB7XG5cdFx0XHR0aGlzLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjbGlja0NhbmNlbChlKSB7XG5cdFx0dGhpcy5zdGFydERhdGUgPSB0aGlzLl9vbGQuc3RhcnQ7XG5cdFx0dGhpcy5lbmREYXRlID0gdGhpcy5fb2xkLmVuZDtcblx0XHRpZiAodGhpcy5pbmxpbmUpIHtcblx0XHRcdHRoaXMudXBkYXRlVmlldygpO1xuXHRcdH1cblx0XHR0aGlzLmhpZGUoKTtcblx0fVxuXHQvKipcblx0ICogY2FsbGVkIHdoZW4gbW9udGggaXMgY2hhbmdlZFxuXHQgKiBAcGFyYW0gbW9udGhFdmVudCBnZXQgdmFsdWUgaW4gZXZlbnQudGFyZ2V0LnZhbHVlXG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcblx0ICovXG5cdG1vbnRoQ2hhbmdlZChtb250aEV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0Y29uc3QgeWVhciA9IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRZZWFyO1xuXHRcdGNvbnN0IG1vbnRoID0gcGFyc2VJbnQobW9udGhFdmVudC52YWx1ZSwgMTApO1xuXHRcdHRoaXMubW9udGhPclllYXJDaGFuZ2VkKG1vbnRoLCB5ZWFyLCBzaWRlKTtcblx0fVxuXHQvKipcblx0ICogY2FsbGVkIHdoZW4geWVhciBpcyBjaGFuZ2VkXG5cdCAqIEBwYXJhbSB5ZWFyRXZlbnQgZ2V0IHZhbHVlIGluIGV2ZW50LnRhcmdldC52YWx1ZVxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG5cdCAqL1xuXHR5ZWFyQ2hhbmdlZCh5ZWFyRXZlbnQ6IGFueSwgc2lkZTogU2lkZUVudW0pIHtcblx0XHRjb25zdCBtb250aCA9IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRNb250aDtcblx0XHRjb25zdCB5ZWFyID0gcGFyc2VJbnQoeWVhckV2ZW50LnZhbHVlLCAxMCk7XG5cdFx0dGhpcy5tb250aE9yWWVhckNoYW5nZWQobW9udGgsIHllYXIsIHNpZGUpO1xuXHR9XG5cdC8qKlxuXHQgKiBjYWxsZWQgd2hlbiB0aW1lIGlzIGNoYW5nZWRcblx0ICogQHBhcmFtIHRpbWVFdmVudCAgYW4gZXZlbnRcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuXHQgKi9cblx0dGltZUNoYW5nZWQodGltZUV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0bGV0IGhvdXIgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyLCAxMCk7XG5cdFx0Y29uc3QgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XG5cdFx0Y29uc3Qgc2Vjb25kID0gdGhpcy50aW1lUGlja2VyU2Vjb25kcyA/IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZCwgMTApIDogMDtcblxuXHRcdGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG5cdFx0XHRjb25zdCBhbXBtID0gdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbDtcblx0XHRcdGlmIChhbXBtID09PSAnUE0nICYmIGhvdXIgPCAxMikge1xuXHRcdFx0XHRob3VyICs9IDEyO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFtcG0gPT09ICdBTScgJiYgaG91ciA9PT0gMTIpIHtcblx0XHRcdFx0aG91ciA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcblx0XHRcdGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcblx0XHRcdHN0YXJ0LmhvdXIoaG91cik7XG5cdFx0XHRzdGFydC5taW51dGUobWludXRlKTtcblx0XHRcdHN0YXJ0LnNlY29uZChzZWNvbmQpO1xuXHRcdFx0dGhpcy5zZXRTdGFydERhdGUoc3RhcnQpO1xuXHRcdFx0aWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xuXHRcdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0dGhpcy5lbmREYXRlICYmXG5cdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcblx0XHRcdFx0dGhpcy5lbmREYXRlLmlzQmVmb3JlKHN0YXJ0KVxuXHRcdFx0KSB7XG5cdFx0XHRcdHRoaXMuc2V0RW5kRGF0ZShzdGFydC5jbG9uZSgpKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHRoaXMuZW5kRGF0ZSkge1xuXHRcdFx0Y29uc3QgZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XG5cdFx0XHRlbmQuaG91cihob3VyKTtcblx0XHRcdGVuZC5taW51dGUobWludXRlKTtcblx0XHRcdGVuZC5zZWNvbmQoc2Vjb25kKTtcblx0XHRcdHRoaXMuc2V0RW5kRGF0ZShlbmQpO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB0aGUgY2FsZW5kYXJzIHNvIGFsbCBjbGlja2FibGUgZGF0ZXMgcmVmbGVjdCB0aGUgbmV3IHRpbWUgY29tcG9uZW50XG5cdFx0dGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcblxuXHRcdC8vIHJlLXJlbmRlciB0aGUgdGltZSBwaWNrZXJzIGJlY2F1c2UgY2hhbmdpbmcgb25lIHNlbGVjdGlvbiBjYW4gYWZmZWN0IHdoYXQncyBlbmFibGVkIGluIGFub3RoZXJcblx0XHR0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XG5cdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcblxuXHRcdGlmICh0aGlzLmF1dG9BcHBseSkge1xuXHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiAgY2FsbCB3aGVuIG1vbnRoIG9yIHllYXIgY2hhbmdlZFxuXHQgKiBAcGFyYW0gbW9udGggbW9udGggbnVtYmVyIDAgLTExXG5cdCAqIEBwYXJhbSB5ZWFyIHllYXIgZWc6IDE5OTVcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuXHQgKi9cblx0bW9udGhPclllYXJDaGFuZ2VkKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlciwgc2lkZTogU2lkZUVudW0pIHtcblx0XHRjb25zdCBpc0xlZnQgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0O1xuXG5cdFx0aWYgKCFpc0xlZnQpIHtcblx0XHRcdGlmICh5ZWFyIDwgdGhpcy5zdGFydERhdGUueWVhcigpIHx8ICh5ZWFyID09PSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkgJiYgbW9udGggPCB0aGlzLnN0YXJ0RGF0ZS5tb250aCgpKSkge1xuXHRcdFx0XHRtb250aCA9IHRoaXMuc3RhcnREYXRlLm1vbnRoKCk7XG5cdFx0XHRcdHllYXIgPSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubWluRGF0ZSkge1xuXHRcdFx0aWYgKHllYXIgPCB0aGlzLm1pbkRhdGUueWVhcigpIHx8ICh5ZWFyID09PSB0aGlzLm1pbkRhdGUueWVhcigpICYmIG1vbnRoIDwgdGhpcy5taW5EYXRlLm1vbnRoKCkpKSB7XG5cdFx0XHRcdG1vbnRoID0gdGhpcy5taW5EYXRlLm1vbnRoKCk7XG5cdFx0XHRcdHllYXIgPSB0aGlzLm1pbkRhdGUueWVhcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1heERhdGUpIHtcblx0XHRcdGlmICh5ZWFyID4gdGhpcy5tYXhEYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5tYXhEYXRlLnllYXIoKSAmJiBtb250aCA+IHRoaXMubWF4RGF0ZS5tb250aCgpKSkge1xuXHRcdFx0XHRtb250aCA9IHRoaXMubWF4RGF0ZS5tb250aCgpO1xuXHRcdFx0XHR5ZWFyID0gdGhpcy5tYXhEYXRlLnllYXIoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50WWVhciA9IHllYXI7XG5cdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudE1vbnRoID0gbW9udGg7XG5cblx0XHRpZiAoaXNMZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChtb250aCkueWVhcih5ZWFyKTtcblx0XHRcdGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5jbG9uZSgpLmFkZCgxLCAnbW9udGgnKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xuXHRcdFx0aWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmNsb25lKCkuc3VidHJhY3QoMSwgJ21vbnRoJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xpY2sgb24gcHJldmlvdXMgbW9udGhcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxuXHQgKi9cblx0Y2xpY2tQcmV2KHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0aWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcblx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xuXHRcdFx0aWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHR9XG5cdC8qKlxuXHQgKiBDbGljayBvbiBuZXh0IG1vbnRoXG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHQgY2FsZW5kYXJcblx0ICovXG5cdGNsaWNrTmV4dChzaWRlOiBTaWRlRW51bSkge1xuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0XHRpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguYWRkKDEsICdtb250aCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHR9XG5cdC8qKlxuXHQgKiBXaGVuIHNlbGVjdGluZyBhIGRhdGVcblx0ICogQHBhcmFtIGUgZXZlbnQ6IGdldCB2YWx1ZSBieSBlLnRhcmdldC52YWx1ZVxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG5cdCAqIEBwYXJhbSByb3cgcm93IHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxuXHQgKiBAcGFyYW0gY29sIGNvbCBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcblx0ICovXG5cdGNsaWNrRGF0ZShlLCBzaWRlOiBTaWRlRW51bSwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XG5cdFx0aWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdURCcpIHtcblx0XHRcdGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhdmFpbGFibGUnKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnU1BBTicpIHtcblx0XHRcdGlmICghZS50YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2F2YWlsYWJsZScpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgZGF0ZSA9XG5cdFx0XHRzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXJbcm93XVtjb2xdIDogdGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXTtcblxuXHRcdGlmIChcblx0XHRcdCh0aGlzLmVuZERhdGUgfHwgKGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUsICdkYXknKSAmJiB0aGlzLmN1c3RvbVJhbmdlRGlyZWN0aW9uID09PSBmYWxzZSkpICYmXG5cdFx0XHR0aGlzLmxvY2tTdGFydERhdGUgPT09IGZhbHNlXG5cdFx0KSB7XG5cdFx0XHQvLyBwaWNraW5nIHN0YXJ0XG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHRcdGRhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgU2lkZUVudW0ubGVmdCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmVuZERhdGUgPSBudWxsO1xuXHRcdFx0dGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcblx0XHR9IGVsc2UgaWYgKCF0aGlzLmVuZERhdGUgJiYgZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkgJiYgdGhpcy5jdXN0b21SYW5nZURpcmVjdGlvbiA9PT0gZmFsc2UpIHtcblx0XHRcdC8vIHNwZWNpYWwgY2FzZTogY2xpY2tpbmcgdGhlIHNhbWUgZGF0ZSBmb3Igc3RhcnQvZW5kLFxuXHRcdFx0Ly8gYnV0IHRoZSB0aW1lIG9mIHRoZSBlbmQgZGF0ZSBpcyBiZWZvcmUgdGhlIHN0YXJ0IGRhdGVcblx0XHRcdHRoaXMuc2V0RW5kRGF0ZSh0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGlja2luZyBlbmRcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdFx0ZGF0ZSA9IHRoaXMuX2dldERhdGVXaXRoVGltZShkYXRlLCBTaWRlRW51bS5yaWdodCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpID09PSB0cnVlICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcblx0XHRcdFx0dGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuc2V0RW5kRGF0ZShkYXRlLmNsb25lKCkpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5hdXRvQXBwbHkpIHtcblx0XHRcdFx0dGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuXHRcdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyKSB7XG5cdFx0XHR0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUpO1xuXHRcdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdFx0XHRpZiAodGhpcy5hdXRvQXBwbHkpIHtcblx0XHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVWaWV3KCk7XG5cblx0XHRpZiAodGhpcy5hdXRvQXBwbHkgJiYgdGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG5cdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcblx0XHR9XG5cblx0XHQvLyBUaGlzIGlzIHRvIGNhbmNlbCB0aGUgYmx1ciBldmVudCBoYW5kbGVyIGlmIHRoZSBtb3VzZSB3YXMgaW4gb25lIG9mIHRoZSBpbnB1dHNcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG5cdC8qKlxuXHQgKiAgQ2xpY2sgb24gdGhlIGN1c3RvbSByYW5nZVxuXHQgKiBAcGFyYW0gZTogRXZlbnRcblx0ICogQHBhcmFtIHByZXNldFxuXHQgKi9cblx0Y2xpY2tSYW5nZShlLCBwcmVzZXQ6IERhdGVSYW5nZVByZXNldCkge1xuXHRcdHRoaXMuY2hvc2VuUmFuZ2UgPSBwcmVzZXQ7XG5cdFx0dGhpcy5zdGFydERhdGUgPSBwcmVzZXQucmFuZ2Uuc3RhcnQuY2xvbmUoKTtcblx0XHR0aGlzLmVuZERhdGUgPSBwcmVzZXQucmFuZ2UuZW5kLmNsb25lKCk7XG5cblx0XHRpZiAodGhpcy5zaG93UmFuZ2VMYWJlbE9uSW5wdXQpIHtcblx0XHRcdHRoaXMuY2hvc2VuTGFiZWwgPSBwcmVzZXQubGFiZWw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0XHR9XG5cdFx0dGhpcy5zaG93Q2FsSW5SYW5nZXMgPSB0cnVlO1xuXG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlLnN0YXJ0T2YoJ2RheScpO1xuXHRcdFx0dGhpcy5lbmREYXRlLmVuZE9mKCdkYXknKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycykge1xuXHRcdFx0dGhpcy5pc1Nob3duID0gZmFsc2U7IC8vIGhpZGUgY2FsZW5kYXJzXG5cdFx0fVxuXHRcdHRoaXMucmFuZ2VDbGlja2VkLmVtaXQoeyBsYWJlbDogcHJlc2V0LmxhYmVsLCBkYXRlczogcHJlc2V0LnJhbmdlIH0pO1xuXHRcdGlmICghdGhpcy5rZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlKSB7XG5cdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCF0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnMpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2xpY2tBcHBseSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLm1heERhdGUuaXNTYW1lKHByZXNldC5yYW5nZS5zdGFydCwgJ21vbnRoJykpIHtcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKHByZXNldC5yYW5nZS5zdGFydC5tb250aCgpKTtcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnllYXIocHJlc2V0LnJhbmdlLnN0YXJ0LnllYXIoKSk7XG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKHByZXNldC5yYW5nZS5zdGFydC5tb250aCgpIC0gMSk7XG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnllYXIocHJlc2V0LnJhbmdlLmVuZC55ZWFyKCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgubW9udGgocHJlc2V0LnJhbmdlLnN0YXJ0Lm1vbnRoKCkpO1xuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKHByZXNldC5yYW5nZS5zdGFydC55ZWFyKCkpO1xuXHRcdFx0XHQvLyBnZXQgdGhlIG5leHQgeWVhclxuXHRcdFx0XHRjb25zdCBuZXh0TW9udGggPSBwcmVzZXQucmFuZ2Uuc3RhcnQuY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChuZXh0TW9udGgubW9udGgoKSk7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC55ZWFyKG5leHRNb250aC55ZWFyKCkpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdFx0XHR0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHNob3coZT8pIHtcblx0XHRpZiAodGhpcy5pc1Nob3duKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0dGhpcy5fb2xkLmVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuXHRcdHRoaXMuaXNTaG93biA9IHRydWU7XG5cdFx0aWYgKHRoaXMuaXNGdWxsU2NyZWVuUGlja2VyKSB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njcm9sbC1ib2R5Jykuc2Nyb2xsVG8oeyB0b3A6IDE1MCB9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZVZpZXcoKTtcblx0fVxuXG5cdGhpZGUoZT8pIHtcblx0XHRpZiAoIXRoaXMuaXNTaG93bikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBpbmNvbXBsZXRlIGRhdGUgc2VsZWN0aW9uLCByZXZlcnQgdG8gbGFzdCB2YWx1ZXNcblx0XHRpZiAoIXRoaXMuZW5kRGF0ZSkge1xuXHRcdFx0aWYgKHRoaXMuX29sZC5zdGFydCkge1xuXHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuX29sZC5zdGFydC5jbG9uZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX29sZC5lbmQpIHtcblx0XHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5fb2xkLmVuZC5jbG9uZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGlmIGEgbmV3IGRhdGUgcmFuZ2Ugd2FzIHNlbGVjdGVkLCBpbnZva2UgdGhlIHVzZXIgY2FsbGJhY2sgZnVuY3Rpb25cblx0XHRpZiAoIXRoaXMuc3RhcnREYXRlLmlzU2FtZSh0aGlzLl9vbGQuc3RhcnQpIHx8ICF0aGlzLmVuZERhdGUuaXNTYW1lKHRoaXMuX29sZC5lbmQpKSB7XG5cdFx0XHQvLyB0aGlzLmNhbGxiYWNrKHRoaXMuc3RhcnREYXRlLCB0aGlzLmVuZERhdGUsIHRoaXMuY2hvc2VuTGFiZWwpO1xuXHRcdH1cblxuXHRcdC8vIGlmIHBpY2tlciBpcyBhdHRhY2hlZCB0byBhIHRleHQgaW5wdXQsIHVwZGF0ZSBpdFxuXHRcdHRoaXMudXBkYXRlRWxlbWVudCgpO1xuXHRcdHRoaXMuaXNTaG93biA9IGZhbHNlO1xuXHRcdHRoaXMuX3JlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogaGFuZGxlIGNsaWNrIG9uIGFsbCBlbGVtZW50IGluIHRoZSBjb21wb25lbnQsIHVzZWZ1bCBmb3Igb3V0c2lkZSBvZiBjbGlja1xuXHQgKiBAcGFyYW0gZSBldmVudFxuXHQgKi9cblx0aGFuZGxlSW50ZXJuYWxDbGljayhlKSB7XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXHQvKipcblx0ICogdXBkYXRlIHRoZSBsb2NhbGUgb3B0aW9uc1xuXHQgKiBAcGFyYW0gbG9jYWxlXG5cdCAqL1xuXHR1cGRhdGVMb2NhbGUobG9jYWxlKSB7XG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gbG9jYWxlKSB7XG5cdFx0XHRpZiAobG9jYWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0dGhpcy5sb2NhbGVba2V5XSA9IGxvY2FsZVtrZXldO1xuXHRcdFx0XHRpZiAoa2V5ID09PSAnY3VzdG9tUmFuZ2VMYWJlbCcpIHtcblx0XHRcdFx0XHR0aGlzLnJlbmRlclJhbmdlcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiAgY2xlYXIgdGhlIGRhdGVyYW5nZSBwaWNrZXJcblx0ICovXG5cdGNsZWFyKCkge1xuXHRcdHRoaXMuc3RhcnREYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG5cdFx0dGhpcy5lbmREYXRlID0gbW9tZW50KCkuZW5kT2YoJ2RheScpO1xuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG5cdFx0dGhpcy51cGRhdGVWaWV3KCk7XG5cdH1cblxuXHQvKipcblx0ICogRmluZCBvdXQgaWYgdGhlIHNlbGVjdGVkIHJhbmdlIHNob3VsZCBiZSBkaXNhYmxlZCBpZiBpdCBkb2Vzbid0XG5cdCAqIGZpdCBpbnRvIG1pbkRhdGUgYW5kIG1heERhdGUgbGltaXRhdGlvbnMuXG5cdCAqL1xuXHRkaXNhYmxlUmFuZ2UocHJlc2V0KSB7XG5cdFx0aWYgKHByZXNldC5sYWJlbCA9PT0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFyZUJvdGhCZWZvcmUgPSB0aGlzLm1pbkRhdGVcblx0XHRcdCYmIHByZXNldC5yYW5nZS5zdGFydC5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpXG5cdFx0XHQmJiBwcmVzZXQucmFuZ2UuZW5kLmlzQmVmb3JlKHRoaXMubWluRGF0ZSk7XG5cblx0XHRjb25zdCBhcmVCb3RoQWZ0ZXIgPSB0aGlzLm1heERhdGVcblx0XHRcdCYmIHByZXNldC5yYW5nZS5zdGFydC5pc0FmdGVyKHRoaXMubWF4RGF0ZSlcblx0XHRcdCYmIHByZXNldC5yYW5nZS5lbmQuaXNBZnRlcih0aGlzLm1heERhdGUpO1xuXG5cdFx0cmV0dXJuIGFyZUJvdGhCZWZvcmUgfHwgYXJlQm90aEFmdGVyO1xuXHR9XG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gZGF0ZSB0aGUgZGF0ZSB0byBhZGQgdGltZVxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG5cdCAqL1xuXHRwcml2YXRlIF9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgc2lkZTogU2lkZUVudW0pOiBfbW9tZW50Lk1vbWVudCB7XG5cdFx0bGV0IGhvdXIgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyLCAxMCk7XG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcblx0XHRcdGNvbnN0IGFtcG0gPSB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsO1xuXHRcdFx0aWYgKGFtcG0gPT09ICdQTScgJiYgaG91ciA8IDEyKSB7XG5cdFx0XHRcdGhvdXIgKz0gMTI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYW1wbSA9PT0gJ0FNJyAmJiBob3VyID09PSAxMikge1xuXHRcdFx0XHRob3VyID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29uc3QgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XG5cdFx0Y29uc3Qgc2Vjb25kID0gdGhpcy50aW1lUGlja2VyU2Vjb25kcyA/IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZCwgMTApIDogMDtcblx0XHRyZXR1cm4gZGF0ZVxuXHRcdFx0LmNsb25lKClcblx0XHRcdC5ob3VyKGhvdXIpXG5cdFx0XHQubWludXRlKG1pbnV0ZSlcblx0XHRcdC5zZWNvbmQoc2Vjb25kKTtcblx0fVxuXHQvKipcblx0ICogIGJ1aWxkIHRoZSBsb2NhbGUgY29uZmlnXG5cdCAqL1xuXHRwcml2YXRlIF9idWlsZExvY2FsZSgpIHtcblx0XHR0aGlzLmxvY2FsZSA9IHsgLi4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnRoaXMubG9jYWxlIH07XG5cdFx0aWYgKCF0aGlzLmxvY2FsZS5mb3JtYXQpIHtcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdFx0dGhpcy5sb2NhbGUuZm9ybWF0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnbGxsJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvY2FsZS5mb3JtYXQgPSBtb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdMJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHByaXZhdGUgX2J1aWxkQ2VsbHMoY2FsZW5kYXIsIHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0Zm9yIChsZXQgcm93ID0gMDsgcm93IDwgNjsgcm93KyspIHtcblx0XHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddID0ge307XG5cdFx0XHRsZXQgY29sT2ZmQ291bnQgPSAwO1xuXHRcdFx0Y29uc3Qgcm93Q2xhc3NlcyA9IFtdO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHR0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzICYmXG5cdFx0XHRcdCF0aGlzLmhhc0N1cnJlbnRNb250aERheXModGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tb250aCwgY2FsZW5kYXJbcm93XSlcblx0XHRcdCkge1xuXHRcdFx0XHRyb3dDbGFzc2VzLnB1c2godGhpcy5lbXB0eVdlZWtSb3dDbGFzcyk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA3OyBjb2wrKykge1xuXHRcdFx0XHRjb25zdCBjbGFzc2VzID0gW107XG5cdFx0XHRcdC8vIGhpZ2hsaWdodCB0b2RheSdzIGRhdGVcblx0XHRcdFx0aWYgKGNhbGVuZGFyW3Jvd11bY29sXS5pc1NhbWUobmV3IERhdGUoKSwgJ2RheScpKSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCd0b2RheScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGhpZ2hsaWdodCB3ZWVrZW5kc1xuXHRcdFx0XHRpZiAoY2FsZW5kYXJbcm93XVtjb2xdLmlzb1dlZWtkYXkoKSA+IDUpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ3dlZWtlbmQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBncmV5IG91dCB0aGUgZGF0ZXMgaW4gb3RoZXIgbW9udGhzIGRpc3BsYXllZCBhdCBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGlzIGNhbGVuZGFyXG5cdFx0XHRcdGlmIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSAhPT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJywgJ2hpZGRlbicpO1xuXHRcdFx0XHRcdGNvbE9mZkNvdW50Kys7XG5cblx0XHRcdFx0XHQvLyBtYXJrIHRoZSBsYXN0IGRheSBvZiB0aGUgcHJldmlvdXMgbW9udGggaW4gdGhpcyBjYWxlbmRhclxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzICYmXG5cdFx0XHRcdFx0XHQoY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPCBjYWxlbmRhclsxXVsxXS5tb250aCgpIHx8IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgPT09IDApICYmXG5cdFx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRheXNJbkxhc3RNb250aFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBtYXJrIHRoZSBmaXJzdCBkYXkgb2YgdGhlIG5leHQgbW9udGggaW4gdGhpcyBjYWxlbmRhclxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzICYmXG5cdFx0XHRcdFx0XHQoY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPiBjYWxlbmRhclsxXVsxXS5tb250aCgpIHx8IGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSAwKSAmJlxuXHRcdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gMVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gbWFyayB0aGUgZmlyc3QgZGF5IG9mIHRoZSBjdXJyZW50IG1vbnRoIHdpdGggYSBjdXN0b20gY2xhc3Ncblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuZmlyc3RNb250aERheUNsYXNzICYmXG5cdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSBjYWxlbmRhci5maXJzdERheS5kYXRlKClcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKHRoaXMuZmlyc3RNb250aERheUNsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBtYXJrIHRoZSBsYXN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCB3aXRoIGEgY3VzdG9tIGNsYXNzXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmxhc3RNb250aERheUNsYXNzICYmXG5cdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSBjYWxlbmRhci5sYXN0RGF5LmRhdGUoKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2godGhpcy5sYXN0TW9udGhEYXlDbGFzcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGVzIGJlZm9yZSB0aGUgbWluaW11bSBkYXRlXG5cdFx0XHRcdGlmICh0aGlzLm1pbkRhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSwgJ2RheScpKSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZXMgYWZ0ZXIgdGhlIG1heGltdW0gZGF0ZVxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlICYmXG5cdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmlzQWZ0ZXIodGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlLCAnZGF5Jylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZSBpZiBhIGN1c3RvbSBmdW5jdGlvbiBkZWNpZGVzIGl0J3MgaW52YWxpZFxuXHRcdFx0XHRpZiAodGhpcy5pc0ludmFsaWREYXRlKGNhbGVuZGFyW3Jvd11bY29sXSkpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcsICdpbnZhbGlkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgc3RhcnQgZGF0ZVxuXHRcdFx0XHRpZiAodGhpcy5zdGFydERhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ3N0YXJ0LWRhdGUnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBoaWdobGlnaHQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBlbmQgZGF0ZVxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5lbmREYXRlICE9IG51bGwgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ2FjdGl2ZScsICdlbmQtZGF0ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGhpZ2hsaWdodCBkYXRlcyBpbi1iZXR3ZWVuIHRoZSBzZWxlY3RlZCBkYXRlc1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5lbmREYXRlICE9IG51bGwgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uaXNBZnRlcih0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpICYmXG5cdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMuZW5kRGF0ZSwgJ2RheScpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnaW4tcmFuZ2UnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBhcHBseSBjdXN0b20gY2xhc3NlcyBmb3IgdGhpcyBkYXRlXG5cdFx0XHRcdGNvbnN0IGlzQ3VzdG9tID0gdGhpcy5pc0N1c3RvbURhdGUoY2FsZW5kYXJbcm93XVtjb2xdKTtcblx0XHRcdFx0aWYgKGlzQ3VzdG9tICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgaXNDdXN0b20gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goaXNDdXN0b20pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShjbGFzc2VzLCBpc0N1c3RvbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHN0b3JlIGNsYXNzZXMgdmFyXG5cdFx0XHRcdGxldCBjbmFtZSA9ICcnLFxuXHRcdFx0XHRcdGRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNuYW1lICs9IGNsYXNzZXNbaV0gKyAnICc7XG5cdFx0XHRcdFx0aWYgKGNsYXNzZXNbaV0gPT09ICdkaXNhYmxlZCcpIHtcblx0XHRcdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFkaXNhYmxlZCkge1xuXHRcdFx0XHRcdGNuYW1lICs9ICdhdmFpbGFibGUnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddW2NvbF0gPSBjbmFtZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY29sT2ZmQ291bnQgPT09IDcpIHtcblx0XHRcdFx0cm93Q2xhc3Nlcy5wdXNoKCdvZmYnKTtcblx0XHRcdFx0cm93Q2xhc3Nlcy5wdXNoKCdkaXNhYmxlZCcpO1xuXHRcdFx0XHRyb3dDbGFzc2VzLnB1c2goJ2hpZGRlbicpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd10uY2xhc3NMaXN0ID0gcm93Q2xhc3Nlcy5qb2luKCcgJyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmQgb3V0IGlmIHRoZSBjdXJyZW50IGNhbGVuZGFyIHJvdyBoYXMgY3VycmVudCBtb250aCBkYXlzXG5cdCAqIChhcyBvcHBvc2VkIHRvIGNvbnNpc3Rpbmcgb2Ygb25seSBwcmV2aW91cy9uZXh0IG1vbnRoIGRheXMpXG5cdCAqL1xuXHRoYXNDdXJyZW50TW9udGhEYXlzKGN1cnJlbnRNb250aCwgcm93KSB7XG5cdFx0Zm9yIChsZXQgZGF5ID0gMDsgZGF5IDwgNzsgZGF5KyspIHtcblx0XHRcdGlmIChyb3dbZGF5XS5tb250aCgpID09PSBjdXJyZW50TW9udGgpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRzY3JvbGxEZXRlY3Rpb24oZXZlbnQpOiB2b2lkIHtcblx0XHRjb25zdCBzY3JvbGxCb2R5VG9wID0gZXZlbnQudGFyZ2V0LnNjcm9sbFRvcDtcblx0XHRjb25zdCBzY3JvbGxCb2R5Qm90dG9tID0gc2Nyb2xsQm9keVRvcCArIGV2ZW50LnRhcmdldC5jbGllbnRIZWlnaHQgKyAxO1xuXG5cdFx0aWYgKHNjcm9sbEJvZHlUb3AgPD0gMCkge1xuXHRcdFx0dGhpcy5jbGlja1ByZXYoU2lkZUVudW0ubGVmdCk7XG5cdFx0XHRldmVudC50YXJnZXQuc2Nyb2xsVG9wID0gMTUwO1xuXHRcdH1cblxuXHRcdGlmIChzY3JvbGxCb2R5Qm90dG9tID49IGV2ZW50LnRhcmdldC5zY3JvbGxIZWlnaHQpIHtcblx0XHRcdHRoaXMuY2xpY2tOZXh0KFNpZGVFbnVtLnJpZ2h0KTtcblx0XHRcdGV2ZW50LnRhcmdldC5zY3JvbGxUb3AgPSBldmVudC50YXJnZXQuc2Nyb2xsVG9wIC0gMTUwO1xuXHRcdH1cblx0fVxufVxuIl19