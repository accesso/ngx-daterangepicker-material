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
        // @Input()
        // isMobile = false;
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
    var DateRangePickerComponent_1;
    DateRangePickerComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: LocaleService }
    ]; };
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
    ], DateRangePickerComponent.prototype, "locale", null);
    tslib_1.__decorate([
        Input()
    ], DateRangePickerComponent.prototype, "ranges", null);
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
            template: "<div\n\tclass=\"md-drppicker\"\n\t#pickerContainer\n\t[ngClass]=\"{\n\t\tltr: locale.direction === 'ltr',\n\t\trtl: this.locale.direction === 'rtl',\n\t\tshown: isShown || inline,\n\t\tsingle: singleDatePicker,\n\t\thidden: !isShown && !inline,\n\t\tinline: inline,\n\t\tdouble: !singleDatePicker && showCalInRanges,\n\t\t'show-ranges': ranges.length > 0\n\t}\"\n\t[class]=\"'drops-' + drops + '-' + opens\"\n\tdata-cy=\"date-range-picker__content\"\n>\n\t<div class=\"dp-header\" *ngIf=\"!singleDatePicker\">\n\t\t<button mat-button *ngIf=\"showClearButton\" class=\"cal-reset-btn\" (click)=\"clear()\" data-cy=\"date-range-picker-clear__button\">\n\t\t\t{{ _locale.clearLabel }}\n\t\t</button>\n\t\t<mat-form-field class=\"cal-start-date\">\n\t\t\t<button mat-icon-button matPrefix>\n\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t</button>\n\t\t\t<input\n\t\t\t\tmatInput\n\t\t\t\t[value]=\"startDate | date: locale.displayFormat:undefined:locale.localeId\"\n\t\t\t\treadonly\n\t\t\t\tdata-cy=\"date-range-picker-start-date__input\"\n\t\t\t/>\n\t\t</mat-form-field>\n\t\t<mat-form-field color=\"primary\">\n\t\t\t<button mat-icon-button matPrefix>\n\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t</button>\n\t\t\t<input\n\t\t\t\tmatInput\n\t\t\t\t[value]=\"endDate | date: locale.displayFormat:undefined:locale.localeId\"\n\t\t\t\treadonly\n\t\t\t\tdata-cy=\"date-range-picker-end-date__input\"\n\t\t\t/>\n\t\t</mat-form-field>\n\t</div>\n\t<div class=\"dp-body\">\n\t\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\n\t\t\t<button color=\"primary\" mat-mini-fab class=\"prev available\" (click)=\"clickPrev(sideEnum.left)\" data-cy=\"date-range-picker-previous__button\">\n\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t</button>\n\t\t\t<div class=\"calendar-table\">\n\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t!calendarVariables.left.minDate ||\n\t\t\t\t\t\t\t\t\t(calendarVariables.left.minDate.isBefore(\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.firstDay\n\t\t\t\t\t\t\t\t\t) &&\n\t\t\t\t\t\t\t\t\t\t(!this.linkedCalendars || true))\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t\t!calendarVariables.left.minDate ||\n\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.minDate.isBefore(\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.firstDay\n\t\t\t\t\t\t\t\t\t\t) &&\n\t\t\t\t\t\t\t\t\t\t\t(!this.linkedCalendars || true))\n\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month drp-animate\">\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentMonth\"\n\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\n\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t(!calendarVariables.left.maxDate ||\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.lastDay\n\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tcolor=\"primary\"\n\t\t\t\t\t\t\t\t\tmat-mini-fab\n\t\t\t\t\t\t\t\t\tclass=\"next available\"\n\t\t\t\t\t\t\t\t\t(click)=\"clickNext(sideEnum.left)\"\n\t\t\t\t\t\t\t\t\tdata-cy=\"date-range-picker-next__button--single-calendar\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t\t(!calendarVariables.left.maxDate ||\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.lastDay\n\t\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker)\n\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody class=\"drp-animate\">\n\t\t\t\t\t\t<tr\n\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.left.calRows; let rowIndex = index;\"\n\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row].classList\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<!-- add week number -->\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<!-- cal -->\n\t\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.left.calCols; let colIndex = index\"\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row][col]\"\n\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.left, row, col)\"\n\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\tclass=\"hourselect select-item\"\n\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedHour\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.hours\"\n\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t\t>\n\t\t\t\t\t</select>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedMinute\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.minutes; let index = index\"\n\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t\t>{{ timepickerVariables.left.minutesLabel[index] }}</option\n\t\t\t\t\t\t>\n\t\t\t\t\t</select>\n\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedSecond\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.seconds; let index = index\"\n\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t\t>{{ timepickerVariables.left.secondsLabel[index] }}</option\n\t\t\t\t\t\t>\n\t\t\t\t\t</select>\n\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.ampmModel\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\n\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\n\t\t\t<button color=\"primary\" mat-mini-fab class=\"next available\" (click)=\"clickNext(sideEnum.right)\" data-cy=\"date-range-picker-next__button\">\n\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t</button>\n\t\t\t<div class=\"calendar-table\">\n\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t(!calendarVariables.right.minDate ||\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.minDate.isBefore(\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.calendar.firstDay\n\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t!this.linkedCalendars\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t\t(!calendarVariables.right.minDate ||\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.minDate.isBefore(\n\t\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.calendar.firstDay\n\t\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t\t!this.linkedCalendars\n\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month\">\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentMonth\"\n\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\n\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t!calendarVariables.right.maxDate ||\n\t\t\t\t\t\t\t\t\t(calendarVariables.right.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.calendar.lastDay\n\t\t\t\t\t\t\t\t\t) &&\n\t\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker || true))\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t!(\n\t\t\t\t\t\t\t\t\t\t!calendarVariables.right.maxDate ||\n\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.right.calendar.lastDay\n\t\t\t\t\t\t\t\t\t\t) &&\n\t\t\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker || true))\n\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<tr\n\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.right.calRows; let rowIndex = index;\"\n\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row].classList\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.right.calCols; let colIndex = index;\"\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row][col]\"\n\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.right, row, col)\"\n\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\tclass=\"select-item hourselect\"\n\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedHour\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.hours\"\n\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t\t>\n\t\t\t\t\t</select>\n\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedMinute\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.minutes; let index = index\"\n\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t\t>{{ timepickerVariables.right.minutesLabel[index] }}</option\n\t\t\t\t\t\t>\n\t\t\t\t\t</select>\n\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedSecond\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.seconds; let index = index\"\n\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t\t>{{ timepickerVariables.right.secondsLabel[index] }}</option\n\t\t\t\t\t\t>\n\t\t\t\t\t</select>\n\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"select\">\n\t\t\t\t\t<select\n\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.ampmModel\"\n\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\n\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"dp-footer\" *ngIf=\"!autoApply && (!ranges.length || (showCalInRanges && !singleDatePicker))\">\n\t\t<div class=\"range-buttons\">\n\t\t\t<div class=\"custom-range-label\" *ngIf=\"showCustomRangeLabel\">\n\t\t\t\t<strong>{{ _locale.customRangeLabel }}:</strong>\n\t\t\t</div>\n\t\t\t<button\n\t\t\t\t*ngFor=\"let range of ranges\"\n\t\t\t\tmat-stroked-button\n\t\t\t\tcolor=\"primary\"\n\t\t\t\tclass=\"{{ buttonClassRange }}\"\n\t\t\t\t(click)=\"clickRange($event, range)\"\n\t\t\t\t[disabled]=\"disableRange(range)\"\n\t\t\t\t[ngClass]=\"{ active: range.label === chosenLabel }\"\n\t\t\t\t[attr.data-cy]=\"'date-range-picker-range-' + range.key + '__button'\"\n\t\t\t>\n\t\t\t\t{{ range.label }}\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"control-buttons\">\n\t\t\t<button mat-flat-button color=\"primary\" (click)=\"clickApply($event)\" data-cy=\"date-range-picker-apply__button\">\n\t\t\t\t{{ _locale.applyLabel }}\n\t\t\t</button>\n\t\t</div>\n\t</div>\n</div>\n",
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
            styles: [":host{position:absolute;top:0;left:0}td.hidden span,tr.hidden{display:none;cursor:default}td.available:not(.off):hover{border:2px solid #42a5f5}.ranges li{display:inline-block}button.available.prev{display:block;opacity:1;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);left:-20px;background-color:#fff;color:#000}button.available.prev mat-icon{transform:rotateY(180deg)}button.available.next{display:block;opacity:1;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);right:-20px;background-color:#fff;color:#000}.md-drppicker{display:flex;flex-direction:column;justify-content:space-between;position:absolute;height:555px;padding:0;margin:0;color:inherit;background-color:#fff;width:420px;z-index:1000}.md-drppicker .dp-header{display:flex;flex-direction:row;justify-content:flex-end;align-items:center;padding:16px;border-bottom:1px solid #eee}.md-drppicker .dp-header .mat-form-field{max-width:214px}.md-drppicker .dp-header .cal-reset-btn,.md-drppicker .dp-header .cal-start-date{margin-right:16px}.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex::after,.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex::before{margin-top:0}.md-drppicker .dp-header .mat-form-field-prefix,.md-drppicker .dp-header .mat-form-field-suffix{top:0}.md-drppicker .dp-body{display:flex;flex-direction:row;margin-bottom:auto}.md-drppicker .dp-footer{display:flex;flex-direction:row;justify-content:space-between;padding:16px;border-top:1px solid #eee}.md-drppicker.single{height:395px}.md-drppicker.single .calendar.right{margin:0}.md-drppicker *,.md-drppicker :after,.md-drppicker :before{box-sizing:border-box}.md-drppicker .mat-form-field-flex::before{margin-top:0!important}.md-drppicker .mat-form-field-appearance-standard .mat-form-field-flex,.md-drppicker .mat-form-field-flex{align-items:center;padding:0}.md-drppicker .mat-form-field-infix,.md-drppicker .mat-form-field-wrapper{border-top:none;margin:0;padding:0;line-height:44px}.md-drppicker .mat-select{border:none}.md-drppicker .mat-select .mat-select-trigger{margin:0}.md-drppicker .mat-select-value{font-weight:500;font-size:16px}.md-drppicker .year{max-width:88px}.md-drppicker .year mat-form-field{width:100%}.md-drppicker .mat-form-field-appearance-legacy .mat-form-field-infix{padding:.4375em 0}.md-drppicker .custom-range-label{display:inline-flex}.md-drppicker .range-buttons{display:flex;flex-direction:row;justify-content:flex-start;width:100%}.md-drppicker .range-buttons button:not(:last-child){margin-right:15px}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:''}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{transform:scale(1);transition:.1s ease-in-out;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{display:flex;align-self:start}.md-drppicker.hidden{transition:.1s;transform:scale(0);transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:NaN}.md-drppicker.hidden.drops-up-center{transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:390px;margin:0 15px}.md-drppicker .calendar .week-days th{height:28px;width:15px;color:#424242;font-size:16px;letter-spacing:.44px;line-height:28px;text-align:center;font-weight:500}.md-drppicker .calendar .month{height:28px;width:103px;color:#000;font-size:16px;letter-spacing:.44px;line-height:48px;text-align:center;font-weight:500}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;min-width:44px;height:44px}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border:1px solid #fff;padding:15px;border-radius:25px;background-color:#fff}.md-drppicker table{width:100%;margin:0;border-collapse:separate}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:25px;border:2px solid transparent;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.week,.md-drppicker th.week{font-size:80%;color:#ccc}.md-drppicker td{margin:.25em 0;opacity:.8;transition:background-color .2s;border-radius:2em;transform:scale(1)}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#e3f2fd;border-color:#e3f2fd;color:#000;opacity:1;border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:25px}.md-drppicker td.active{transition:background .3s ease-out;color:#fff;box-sizing:border-box;height:44px;width:44px;background-color:#42a5f5;border-color:#42a5f5}.md-drppicker td.active:hover{border-color:#e3f2fd}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-repeat:no-repeat;background-size:10px;background-position-y:center;background-position-x:right;width:108px;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.md-drppicker .dropdowns select{display:inline-block;background-color:rgba(255,255,255,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{width:50px;margin:0 auto;background:#eee;border:1px solid #eee;padding:2px;outline:0;font-size:12px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{font-size:12px;height:auto;cursor:pointer;opacity:0;position:absolute;top:0;left:0;margin:0;padding:0}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{display:inline-block;width:auto;position:relative;font-family:inherit;background-color:transparent;padding:10px 10px 10px 0;font-size:18px;border-radius:0;border:none;border-bottom:1px solid rgba(0,0,0,.12)}.md-drppicker .calendar-time .select .select-item:after{position:absolute;top:18px;right:10px;width:0;height:0;padding:0;content:'';border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);pointer-events:none}.md-drppicker .calendar-time .select .select-item:focus{outline:0}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:25px;color:#555;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border:1px solid #42a5f5;border-radius:25px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px;margin-right:20px}.md-drppicker .ranges ul li button{padding:8px 12px;width:100%;background:0 0;border:none;text-align:left;cursor:pointer}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}.md-drppicker .btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);background-color:#3f51b5;color:#ecf0f1;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.md-drppicker .btn:focus,.md-drppicker .btn:hover{background-color:#3f51b5}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{content:'';position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(236,240,241,.3);transform:translate(-50%,-50%)}.md-drppicker .btn:active:before{width:120%;padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{color:#000;background-color:#dcdcdc}.md-drppicker .clear{box-shadow:none;background-color:#fff!important}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}.md-drppicker.mobile:not(.inline){position:fixed;top:0;left:0;right:auto;width:100vw;height:100vh;z-index:9999}.md-drppicker.mobile:not(.inline) .dp-header{background-color:#1565c0;justify-content:flex-start}.md-drppicker.mobile:not(.inline) .dp-body{flex-direction:column}.md-drppicker.mobile:not(.inline) .calendar{-ms-grid-row-align:center;align-self:center;margin:0 auto}.field-row{width:100%;height:65px;border-bottom:1px solid #eee}.field-row mat-form-field{float:right;margin-right:15px}.field-row .mat-form-field-flex{height:55px;padding-top:10px}.cal-reset-btn{margin-right:15px}td.available:hover{border:2px solid #42a5f5}"]
        })
    ], DateRangePickerComponent);
    return DateRangePickerComponent;
}());
export { DateRangePickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ04saUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5RCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUdsQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFFekQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBRXZCLE1BQU0sQ0FBTixJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDbkIseUJBQWEsQ0FBQTtJQUNiLDJCQUFlLENBQUE7QUFDaEIsQ0FBQyxFQUhXLFFBQVEsS0FBUixRQUFRLFFBR25CO0FBb0JEO0lBc0hDLGtDQUFvQixFQUFjLEVBQVUsSUFBdUIsRUFBVSxjQUE2QjtRQUF0RixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQXJIbEcsU0FBSSxHQUE2QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1FBRXBFLHNCQUFpQixHQUE4QixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3ZFLHdCQUFtQixHQUE4QixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUs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RUFBNkI7SUFpYjVFO1FBREMsS0FBSyxFQUFFO2lFQUdQO0lBRUQ7UUFEQyxLQUFLLEVBQUU7Z0VBR1A7SUExaUJXLHdCQUF3QjtRQWxCcEMsU0FBUyxDQUFDO1lBQ1YsOENBQThDO1lBQzlDLFFBQVEsRUFBRSw4QkFBOEI7WUFFeEMsMGdvQkFBaUQ7WUFDakQscURBQXFEO1lBQ3JELElBQUksRUFBRTtnQkFDTCxTQUFTLEVBQUUsNkJBQTZCO2FBQ3hDO1lBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7WUFDckMsU0FBUyxFQUFFO2dCQUNWO29CQUNDLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLDBCQUF3QixFQUF4QixDQUF3QixDQUFDO29CQUN2RCxLQUFLLEVBQUUsSUFBSTtpQkFDWDthQUNEOztTQUNELENBQUM7T0FDVyx3QkFBd0IsQ0F5dkNwQztJQUFELCtCQUFDO0NBQUEsQUF6dkNELElBeXZDQztTQXp2Q1ksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudCxcblx0RWxlbWVudFJlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRJbnB1dCxcblx0T25Jbml0LFxuXHRPdXRwdXQsXG5cdFZpZXdDaGlsZCxcblx0Vmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VQcmVzZXQgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5tb2RlbHMnO1xuaW1wb3J0IHtMb2NhbGVDb25maWd9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyLmNvbmZpZyc7XG5pbXBvcnQge0xvY2FsZVNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsZS5zZXJ2aWNlJztcblxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcblxuZXhwb3J0IGVudW0gU2lkZUVudW0ge1xuXHRsZWZ0ID0gJ2xlZnQnLFxuXHRyaWdodCA9ICdyaWdodCdcbn1cblxuQENvbXBvbmVudCh7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3Jcblx0c2VsZWN0b3I6ICduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJyxcblx0c3R5bGVVcmxzOiBbJy4vZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LnNjc3MnXSxcblx0dGVtcGxhdGVVcmw6ICcuL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtbWV0YWRhdGEtcHJvcGVydHlcblx0aG9zdDoge1xuXHRcdCcoY2xpY2spJzogJ2hhbmRsZUludGVybmFsQ2xpY2soJGV2ZW50KSdcblx0fSxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQpLFxuXHRcdFx0bXVsdGk6IHRydWVcblx0XHR9XG5cdF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblx0cHJpdmF0ZSBfb2xkOiB7IHN0YXJ0OiBhbnk7IGVuZDogYW55IH0gPSB7IHN0YXJ0OiBudWxsLCBlbmQ6IG51bGwgfTtcblx0Y2hvc2VuTGFiZWw6IHN0cmluZztcblx0Y2FsZW5kYXJWYXJpYWJsZXM6IHsgbGVmdDogYW55OyByaWdodDogYW55IH0gPSB7IGxlZnQ6IHt9LCByaWdodDoge30gfTtcblx0dGltZXBpY2tlclZhcmlhYmxlczogeyBsZWZ0OiBhbnk7IHJpZ2h0OiBhbnkgfSA9IHsgbGVmdDoge30sIHJpZ2h0OiB7fSB9O1xuXHRkYXRlcmFuZ2VwaWNrZXI6IHsgc3RhcnQ6IEZvcm1Db250cm9sOyBlbmQ6IEZvcm1Db250cm9sIH0gPSB7IHN0YXJ0OiBuZXcgRm9ybUNvbnRyb2woKSwgZW5kOiBuZXcgRm9ybUNvbnRyb2woKSB9O1xuXHRhcHBseUJ0bjogeyBkaXNhYmxlZDogYm9vbGVhbiB9ID0geyBkaXNhYmxlZDogZmFsc2UgfTtcblx0QElucHV0KClcblx0c3RhcnREYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG5cdEBJbnB1dCgpXG5cdGVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG5cblx0QElucHV0KClcblx0ZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xuXHQvLyB1c2VkIGluIHRlbXBsYXRlIGZvciBjb21waWxlIHRpbWUgc3VwcG9ydCBvZiBlbnVtIHZhbHVlcy5cblx0c2lkZUVudW0gPSBTaWRlRW51bTtcblx0Ly8gQElucHV0KClcblx0Ly8gaXNNb2JpbGUgPSBmYWxzZTtcblx0QElucHV0KClcblx0bWluRGF0ZTogX21vbWVudC5Nb21lbnQgPSBudWxsO1xuXHRASW5wdXQoKVxuXHRtYXhEYXRlOiBfbW9tZW50Lk1vbWVudCA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdGF1dG9BcHBseTogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRzaW5nbGVEYXRlUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHNob3dEcm9wZG93bnM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0c2hvd1dlZWtOdW1iZXJzOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHNob3dJU09XZWVrTnVtYmVyczogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRsaW5rZWRDYWxlbmRhcnM6IEJvb2xlYW4gPSAhdGhpcy5zaW5nbGVEYXRlUGlja2VyO1xuXHRASW5wdXQoKVxuXHRhdXRvVXBkYXRlSW5wdXQ6IEJvb2xlYW4gPSB0cnVlO1xuXHRASW5wdXQoKVxuXHRhbHdheXNTaG93Q2FsZW5kYXJzOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGxvY2tTdGFydERhdGU6IEJvb2xlYW4gPSBmYWxzZTtcblx0Ly8gdGltZXBpY2tlciB2YXJpYWJsZXNcblx0QElucHV0KClcblx0dGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyMjRIb3VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXJJbmNyZW1lbnQgPSAxO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xuXHQvLyBlbmQgb2YgdGltZXBpY2tlciB2YXJpYWJsZXNcblx0QElucHV0KClcblx0c2hvd0NsZWFyQnV0dG9uOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0bGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmcgPSBudWxsO1xuXHRASW5wdXQoKVxuXHRmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZyA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NBcHBseTogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSZXNldDogc3RyaW5nID0gbnVsbDtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSYW5nZTogc3RyaW5nID0gbnVsbDtcblx0X2xvY2FsZTogTG9jYWxlQ29uZmlnID0ge307XG5cdEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcblx0XHR0aGlzLl9sb2NhbGUgPSB7IC4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZSB9O1xuXHR9XG5cdGdldCBsb2NhbGUoKTogTG9jYWxlQ29uZmlnIHtcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxlO1xuXHR9XG5cdC8vIGN1c3RvbSByYW5nZXNcblx0X3JhbmdlczogRGF0ZVJhbmdlUHJlc2V0W10gPSBbXTtcblxuXHRASW5wdXQoKSBzZXQgcmFuZ2VzKHZhbHVlOiBEYXRlUmFuZ2VQcmVzZXRbXSkge1xuXHRcdHRoaXMuX3JhbmdlcyA9IHZhbHVlO1xuXHRcdHRoaXMucmVuZGVyUmFuZ2VzKCk7XG5cdH1cblx0Z2V0IHJhbmdlcygpOiBEYXRlUmFuZ2VQcmVzZXRbXSB7XG5cdFx0cmV0dXJuIHRoaXMuX3Jhbmdlcztcblx0fVxuXG5cdEBJbnB1dCgpXG5cdHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93Q2FuY2VsID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UgPSBmYWxzZTtcblx0QElucHV0KClcblx0c2hvd1JhbmdlTGFiZWxPbklucHV0ID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGN1c3RvbVJhbmdlRGlyZWN0aW9uID0gZmFsc2U7XG5cdGNob3NlblJhbmdlOiBEYXRlUmFuZ2VQcmVzZXQ7XG5cblx0Ly8gc29tZSBzdGF0ZSBpbmZvcm1hdGlvblxuXHRpc1Nob3duOiBCb29sZWFuID0gZmFsc2U7XG5cdGlubGluZSA9IHRydWU7XG5cdGxlZnRDYWxlbmRhcjogYW55ID0geyBtb250aDogbW9tZW50KCkgfTtcblx0cmlnaHRDYWxlbmRhcjogYW55ID0geyBtb250aDogbW9tZW50KCkuYWRkKDEsICdtb250aCcpIH07XG5cdHNob3dDYWxJblJhbmdlczogQm9vbGVhbiA9IGZhbHNlO1xuXG5cdG9wdGlvbnM6IGFueSA9IHt9OyAvLyBzaG91bGQgZ2V0IHNvbWUgb3B0IGZyb20gdXNlclxuXHRASW5wdXQoKSBkcm9wczogc3RyaW5nO1xuXHRASW5wdXQoKSBvcGVuczogc3RyaW5nO1xuXHRASW5wdXQoKSBjbG9zZU9uQXV0b0FwcGx5ID0gdHJ1ZTtcblx0QE91dHB1dCgpIGNob29zZWREYXRlOiBFdmVudEVtaXR0ZXI8T2JqZWN0Pjtcblx0QE91dHB1dCgpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XG5cdEBPdXRwdXQoKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuXHRAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XG5cdEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XG5cdC8vIEB0cy1pZ25vcmVcblx0QFZpZXdDaGlsZCgncGlja2VyQ29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSkgcGlja2VyQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuXHQkZXZlbnQ6IGFueTtcblxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIF9yZWY6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlKSB7XG5cdFx0dGhpcy5jaG9vc2VkRGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0XHR0aGlzLnJhbmdlQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0XHR0aGlzLmRhdGVzVXBkYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0XHR0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5lbmREYXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMuX2J1aWxkTG9jYWxlKCk7XG5cdFx0Y29uc3QgZGF5c09mV2VlayA9IFsuLi50aGlzLmxvY2FsZS5kYXlzT2ZXZWVrXTtcblx0XHRpZiAodGhpcy5sb2NhbGUuZmlyc3REYXkgIT09IDApIHtcblx0XHRcdGxldCBpdGVyYXRvciA9IHRoaXMubG9jYWxlLmZpcnN0RGF5O1xuXG5cdFx0XHR3aGlsZSAoaXRlcmF0b3IgPiAwKSB7XG5cdFx0XHRcdGRheXNPZldlZWsucHVzaChkYXlzT2ZXZWVrLnNoaWZ0KCkpO1xuXHRcdFx0XHRpdGVyYXRvci0tO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmxvY2FsZS5kYXlzT2ZXZWVrID0gZGF5c09mV2Vlaztcblx0XHRpZiAodGhpcy5pbmxpbmUpIHtcblx0XHRcdHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0XHR0aGlzLl9vbGQuZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0dGhpcy5zZXRTdGFydERhdGUodGhpcy5zdGFydERhdGUpO1xuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmVuZERhdGUgJiYgdGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHR0aGlzLnNldEVuZERhdGUodGhpcy5lbmREYXRlKTtcblx0XHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XG5cdFx0dGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5sZWZ0KTtcblx0XHR0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcblx0XHR0aGlzLnJlbmRlclJhbmdlcygpO1xuXHR9XG5cdHJlbmRlclJhbmdlcygpIHtcblx0XHRsZXQgc3RhcnQsIGVuZDtcblx0XHR0aGlzLnJhbmdlcy5mb3JFYWNoKHByZXNldCA9PiB7XG5cdFx0XHRzdGFydCA9IHByZXNldC5yYW5nZS5zdGFydDtcblx0XHRcdGVuZCA9IHByZXNldC5yYW5nZS5lbmQ7XG5cdFx0XHQvLyBJZiB0aGUgc3RhcnQgb3IgZW5kIGRhdGUgZXhjZWVkIHRob3NlIGFsbG93ZWQgYnkgdGhlIG1pbkRhdGVcblx0XHRcdC8vIG9wdGlvbiwgc2hvcnRlbiB0aGUgcmFuZ2UgdG8gdGhlIGFsbG93YWJsZSBwZXJpb2QuXG5cdFx0XHRpZiAodGhpcy5taW5EYXRlICYmIHN0YXJ0LmlzQmVmb3JlKHRoaXMubWluRGF0ZSkpIHtcblx0XHRcdFx0c3RhcnQgPSB0aGlzLm1pbkRhdGUuY2xvbmUoKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IG1heERhdGUgPSB0aGlzLm1heERhdGU7XG5cdFx0XHRpZiAobWF4RGF0ZSAmJiBlbmQuaXNBZnRlcihtYXhEYXRlKSkge1xuXHRcdFx0XHRlbmQgPSBtYXhEYXRlLmNsb25lKCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBJZiB0aGUgZW5kIG9mIHRoZSByYW5nZSBpcyBiZWZvcmUgdGhlIG1pbmltdW0gb3IgdGhlIHN0YXJ0IG9mIHRoZSByYW5nZSBpc1xuXHRcdFx0Ly8gYWZ0ZXIgdGhlIG1heGltdW0sIGRvbid0IGRpc3BsYXkgdGhpcyByYW5nZSBvcHRpb24gYXQgYWxsLlxuXHRcdFx0aWYgKFxuXHRcdFx0XHQodGhpcy5taW5EYXRlICYmIGVuZC5pc0JlZm9yZSh0aGlzLm1pbkRhdGUsIHRoaXMudGltZVBpY2tlciA/ICdtaW51dGUnIDogJ2RheScpKSB8fFxuXHRcdFx0XHQobWF4RGF0ZSAmJiBlbmQuaXNBZnRlcihtYXhEYXRlLCB0aGlzLnRpbWVQaWNrZXIgPyAnbWludXRlJyA6ICdkYXknKSlcblx0XHRcdCkge1xuXHRcdFx0XHQvLyBjb250aW51ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFN1cHBvcnQgdW5pY29kZSBjaGFycyBpbiB0aGUgcmFuZ2UgbmFtZXMuXG5cdFx0XHRcdGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuXHRcdFx0XHRlbGVtLmlubmVySFRNTCA9IHByZXNldC5sYWJlbDtcblx0XHRcdFx0cHJlc2V0LmxhYmVsID0gIGVsZW0udmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLnNob3dDYWxJblJhbmdlcyA9IHRydWU7XG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XG5cdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLmVuZERhdGUuZW5kT2YoJ2RheScpO1xuXHRcdH1cblx0fVxuXG5cdHJlbmRlclRpbWVQaWNrZXIoc2lkZTogU2lkZUVudW0pIHtcblx0XHRpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQgJiYgIXRoaXMuZW5kRGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgc2VsZWN0ZWQsIG1pbkRhdGU7XG5cdFx0Y29uc3QgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcblx0XHRpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuXHRcdFx0KHNlbGVjdGVkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKSksIChtaW5EYXRlID0gdGhpcy5taW5EYXRlKTtcblx0XHR9IGVsc2UgaWYgKHNpZGUgPT09IFNpZGVFbnVtLnJpZ2h0KSB7XG5cdFx0XHQoc2VsZWN0ZWQgPSB0aGlzLmVuZERhdGUuY2xvbmUoKSksIChtaW5EYXRlID0gdGhpcy5zdGFydERhdGUpO1xuXHRcdH1cblx0XHRjb25zdCBzdGFydCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/IDAgOiAxO1xuXHRcdGNvbnN0IGVuZCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/IDIzIDogMTI7XG5cdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdID0ge1xuXHRcdFx0aG91cnM6IFtdLFxuXHRcdFx0bWludXRlczogW10sXG5cdFx0XHRtaW51dGVzTGFiZWw6IFtdLFxuXHRcdFx0c2Vjb25kczogW10sXG5cdFx0XHRzZWNvbmRzTGFiZWw6IFtdLFxuXHRcdFx0ZGlzYWJsZWRIb3VyczogW10sXG5cdFx0XHRkaXNhYmxlZE1pbnV0ZXM6IFtdLFxuXHRcdFx0ZGlzYWJsZWRTZWNvbmRzOiBbXSxcblx0XHRcdHNlbGVjdGVkSG91cjogMCxcblx0XHRcdHNlbGVjdGVkTWludXRlOiAwLFxuXHRcdFx0c2VsZWN0ZWRTZWNvbmQ6IDBcblx0XHR9O1xuXHRcdC8vIGdlbmVyYXRlIGhvdXJzXG5cdFx0Zm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG5cdFx0XHRsZXQgaV9pbl8yNCA9IGk7XG5cdFx0XHRpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xuXHRcdFx0XHRpX2luXzI0ID0gc2VsZWN0ZWQuaG91cigpID49IDEyID8gKGkgPT09IDEyID8gMTIgOiBpICsgMTIpIDogaSA9PT0gMTIgPyAwIDogaTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuaG91cihpX2luXzI0KTtcblx0XHRcdGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0aWYgKG1pbkRhdGUgJiYgdGltZS5taW51dGUoNTkpLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG5cdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChtYXhEYXRlICYmIHRpbWUubWludXRlKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcblx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uaG91cnMucHVzaChpKTtcblx0XHRcdGlmIChpX2luXzI0ID09PSBzZWxlY3RlZC5ob3VyKCkgJiYgIWRpc2FibGVkKSB7XG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIgPSBpO1xuXHRcdFx0fSBlbHNlIGlmIChkaXNhYmxlZCkge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uZGlzYWJsZWRIb3Vycy5wdXNoKGkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBnZW5lcmF0ZSBtaW51dGVzXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSArPSB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcblx0XHRcdGNvbnN0IHBhZGRlZCA9IGkgPCAxMCA/ICcwJyArIGkgOiBpO1xuXHRcdFx0Y29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkubWludXRlKGkpO1xuXG5cdFx0XHRsZXQgZGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdGlmIChtaW5EYXRlICYmIHRpbWUuc2Vjb25kKDU5KS5pc0JlZm9yZShtaW5EYXRlKSkge1xuXHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAobWF4RGF0ZSAmJiB0aW1lLnNlY29uZCgwKS5pc0FmdGVyKG1heERhdGUpKSB7XG5cdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzLnB1c2goaSk7XG5cdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0ubWludXRlc0xhYmVsLnB1c2gocGFkZGVkKTtcblx0XHRcdGlmIChzZWxlY3RlZC5taW51dGUoKSA9PT0gaSAmJiAhZGlzYWJsZWQpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlID0gaTtcblx0XHRcdH0gZWxzZSBpZiAoZGlzYWJsZWQpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkTWludXRlcy5wdXNoKGkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBnZW5lcmF0ZSBzZWNvbmRzXG5cdFx0aWYgKHRoaXMudGltZVBpY2tlclNlY29uZHMpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xuXHRcdFx0XHRjb25zdCBwYWRkZWQgPSBpIDwgMTAgPyAnMCcgKyBpIDogaTtcblx0XHRcdFx0Y29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuc2Vjb25kKGkpO1xuXG5cdFx0XHRcdGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZiAobWluRGF0ZSAmJiB0aW1lLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChtYXhEYXRlICYmIHRpbWUuaXNBZnRlcihtYXhEYXRlKSkge1xuXHRcdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWNvbmRzLnB1c2goaSk7XG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWNvbmRzTGFiZWwucHVzaChwYWRkZWQpO1xuXHRcdFx0XHRpZiAoc2VsZWN0ZWQuc2Vjb25kKCkgPT09IGkgJiYgIWRpc2FibGVkKSB7XG5cdFx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kID0gaTtcblx0XHRcdFx0fSBlbHNlIGlmIChkaXNhYmxlZCkge1xuXHRcdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZFNlY29uZHMucHVzaChpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBnZW5lcmF0ZSBBTS9QTVxuXHRcdGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG1pbkRhdGUgJiZcblx0XHRcdFx0c2VsZWN0ZWRcblx0XHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHRcdC5ob3VyKDEyKVxuXHRcdFx0XHRcdC5taW51dGUoMClcblx0XHRcdFx0XHQuc2Vjb25kKDApXG5cdFx0XHRcdFx0LmlzQmVmb3JlKG1pbkRhdGUpXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtRGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdG1heERhdGUgJiZcblx0XHRcdFx0c2VsZWN0ZWRcblx0XHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHRcdC5ob3VyKDApXG5cdFx0XHRcdFx0Lm1pbnV0ZSgwKVxuXHRcdFx0XHRcdC5zZWNvbmQoMClcblx0XHRcdFx0XHQuaXNBZnRlcihtYXhEYXRlKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5wbURpc2FibGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChzZWxlY3RlZC5ob3VyKCkgPj0gMTIpIHtcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbCA9ICdQTSc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsID0gJ0FNJztcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cdH1cblx0cmVuZGVyQ2FsZW5kYXIoc2lkZTogU2lkZUVudW0pIHtcblx0XHRjb25zdCBtYWluQ2FsZW5kYXI6IGFueSA9IHNpZGUgPT09IFNpZGVFbnVtLmxlZnQgPyB0aGlzLmxlZnRDYWxlbmRhciA6IHRoaXMucmlnaHRDYWxlbmRhcjtcblx0XHRjb25zdCBtb250aCA9IG1haW5DYWxlbmRhci5tb250aC5tb250aCgpO1xuXHRcdGNvbnN0IHllYXIgPSBtYWluQ2FsZW5kYXIubW9udGgueWVhcigpO1xuXHRcdGNvbnN0IGhvdXIgPSBtYWluQ2FsZW5kYXIubW9udGguaG91cigpO1xuXHRcdGNvbnN0IG1pbnV0ZSA9IG1haW5DYWxlbmRhci5tb250aC5taW51dGUoKTtcblx0XHRjb25zdCBzZWNvbmQgPSBtYWluQ2FsZW5kYXIubW9udGguc2Vjb25kKCk7XG5cdFx0Y29uc3QgZGF5c0luTW9udGggPSBtb21lbnQoW3llYXIsIG1vbnRoXSkuZGF5c0luTW9udGgoKTtcblx0XHRjb25zdCBmaXJzdERheSA9IG1vbWVudChbeWVhciwgbW9udGgsIDFdKTtcblx0XHRjb25zdCBsYXN0RGF5ID0gbW9tZW50KFt5ZWFyLCBtb250aCwgZGF5c0luTW9udGhdKTtcblx0XHRjb25zdCBsYXN0TW9udGggPSBtb21lbnQoZmlyc3REYXkpXG5cdFx0XHQuc3VidHJhY3QoMSwgJ21vbnRoJylcblx0XHRcdC5tb250aCgpO1xuXHRcdGNvbnN0IGxhc3RZZWFyID0gbW9tZW50KGZpcnN0RGF5KVxuXHRcdFx0LnN1YnRyYWN0KDEsICdtb250aCcpXG5cdFx0XHQueWVhcigpO1xuXHRcdGNvbnN0IGRheXNJbkxhc3RNb250aCA9IG1vbWVudChbbGFzdFllYXIsIGxhc3RNb250aF0pLmRheXNJbk1vbnRoKCk7XG5cdFx0Y29uc3QgZGF5T2ZXZWVrID0gZmlyc3REYXkuZGF5KCk7XG5cdFx0Ly8gaW5pdGlhbGl6ZSBhIDYgcm93cyB4IDcgY29sdW1ucyBhcnJheSBmb3IgdGhlIGNhbGVuZGFyXG5cdFx0Y29uc3QgY2FsZW5kYXI6IGFueSA9IFtdO1xuXHRcdGNhbGVuZGFyLmZpcnN0RGF5ID0gZmlyc3REYXk7XG5cdFx0Y2FsZW5kYXIubGFzdERheSA9IGxhc3REYXk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuXHRcdFx0Y2FsZW5kYXJbaV0gPSBbXTtcblx0XHR9XG5cblx0XHQvLyBwb3B1bGF0ZSB0aGUgY2FsZW5kYXIgd2l0aCBkYXRlIG9iamVjdHNcblx0XHRsZXQgc3RhcnREYXkgPSBkYXlzSW5MYXN0TW9udGggLSBkYXlPZldlZWsgKyB0aGlzLmxvY2FsZS5maXJzdERheSArIDE7XG5cdFx0aWYgKHN0YXJ0RGF5ID4gZGF5c0luTGFzdE1vbnRoKSB7XG5cdFx0XHRzdGFydERheSAtPSA3O1xuXHRcdH1cblxuXHRcdGlmIChkYXlPZldlZWsgPT09IHRoaXMubG9jYWxlLmZpcnN0RGF5KSB7XG5cdFx0XHRzdGFydERheSA9IGRheXNJbkxhc3RNb250aCAtIDY7XG5cdFx0fVxuXG5cdFx0bGV0IGN1ckRhdGUgPSBtb21lbnQoW2xhc3RZZWFyLCBsYXN0TW9udGgsIHN0YXJ0RGF5LCAxMiwgbWludXRlLCBzZWNvbmRdKTtcblxuXHRcdGZvciAobGV0IGkgPSAwLCBjb2wgPSAwLCByb3cgPSAwOyBpIDwgNDI7IGkrKywgY29sKyssIGN1ckRhdGUgPSBtb21lbnQoY3VyRGF0ZSkuYWRkKDI0LCAnaG91cicpKSB7XG5cdFx0XHRpZiAoaSA+IDAgJiYgY29sICUgNyA9PT0gMCkge1xuXHRcdFx0XHRjb2wgPSAwO1xuXHRcdFx0XHRyb3crKztcblx0XHRcdH1cblx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXSA9IGN1ckRhdGVcblx0XHRcdFx0LmNsb25lKClcblx0XHRcdFx0LmhvdXIoaG91cilcblx0XHRcdFx0Lm1pbnV0ZShtaW51dGUpXG5cdFx0XHRcdC5zZWNvbmQoc2Vjb25kKTtcblx0XHRcdGN1ckRhdGUuaG91cigxMik7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0dGhpcy5taW5EYXRlICYmXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5taW5EYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpICYmXG5cdFx0XHRcdHNpZGUgPT09ICdsZWZ0J1xuXHRcdFx0KSB7XG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXSA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdHRoaXMubWF4RGF0ZSAmJlxuXHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMubWF4RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSAmJlxuXHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uaXNBZnRlcih0aGlzLm1heERhdGUpICYmXG5cdFx0XHRcdHNpZGUgPT09ICdyaWdodCdcblx0XHRcdCkge1xuXHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0gPSB0aGlzLm1heERhdGUuY2xvbmUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBtYWtlIHRoZSBjYWxlbmRhciBvYmplY3QgYXZhaWxhYmxlIHRvIGhvdmVyRGF0ZS9jbGlja0RhdGVcblx0XHRpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuXHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyID0gY2FsZW5kYXI7XG5cdFx0fVxuXHRcdC8vXG5cdFx0Ly8gRGlzcGxheSB0aGUgY2FsZW5kYXJcblx0XHQvL1xuXHRcdGNvbnN0IG1pbkRhdGUgPSBzaWRlID09PSAnbGVmdCcgPyB0aGlzLm1pbkRhdGUgOiB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdGlmICh0aGlzLmxlZnRDYWxlbmRhci5tb250aCAmJiBtaW5EYXRlICYmIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnllYXIoKSA8IG1pbkRhdGUueWVhcigpKSB7XG5cdFx0XHRtaW5EYXRlLnllYXIodGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgueWVhcigpKTtcblx0XHR9XG5cdFx0bGV0IG1heERhdGUgPSB0aGlzLm1heERhdGU7XG5cdFx0Ly8gYWRqdXN0IG1heERhdGUgdG8gcmVmbGVjdCB0aGUgZGF0ZUxpbWl0IHNldHRpbmcgaW4gb3JkZXIgdG9cblx0XHQvLyBncmV5IG91dCBlbmQgZGF0ZXMgYmV5b25kIHRoZSBkYXRlTGltaXRcblx0XHRpZiAodGhpcy5lbmREYXRlID09PSBudWxsICYmIHRoaXMuZGF0ZUxpbWl0KSB7XG5cdFx0XHRjb25zdCBtYXhMaW1pdCA9IHRoaXMuc3RhcnREYXRlXG5cdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdC5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKVxuXHRcdFx0XHQuZW5kT2YoJ2RheScpO1xuXHRcdFx0aWYgKCFtYXhEYXRlIHx8IG1heExpbWl0LmlzQmVmb3JlKG1heERhdGUpKSB7XG5cdFx0XHRcdG1heERhdGUgPSBtYXhMaW1pdDtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXSA9IHtcblx0XHRcdG1vbnRoOiBtb250aCxcblx0XHRcdHllYXI6IHllYXIsXG5cdFx0XHRob3VyOiBob3VyLFxuXHRcdFx0bWludXRlOiBtaW51dGUsXG5cdFx0XHRzZWNvbmQ6IHNlY29uZCxcblx0XHRcdGRheXNJbk1vbnRoOiBkYXlzSW5Nb250aCxcblx0XHRcdGZpcnN0RGF5OiBmaXJzdERheSxcblx0XHRcdGxhc3REYXk6IGxhc3REYXksXG5cdFx0XHRsYXN0TW9udGg6IGxhc3RNb250aCxcblx0XHRcdGxhc3RZZWFyOiBsYXN0WWVhcixcblx0XHRcdGRheXNJbkxhc3RNb250aDogZGF5c0luTGFzdE1vbnRoLFxuXHRcdFx0ZGF5T2ZXZWVrOiBkYXlPZldlZWssXG5cdFx0XHQvLyBvdGhlciB2YXJzXG5cdFx0XHRjYWxSb3dzOiBBcnJheS5mcm9tKEFycmF5KDYpLmtleXMoKSksXG5cdFx0XHRjYWxDb2xzOiBBcnJheS5mcm9tKEFycmF5KDcpLmtleXMoKSksXG5cdFx0XHRjbGFzc2VzOiB7fSxcblx0XHRcdG1pbkRhdGU6IG1pbkRhdGUsXG5cdFx0XHRtYXhEYXRlOiBtYXhEYXRlLFxuXHRcdFx0Y2FsZW5kYXI6IGNhbGVuZGFyXG5cdFx0fTtcblx0XHRpZiAodGhpcy5zaG93RHJvcGRvd25zKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50TW9udGggPSBjYWxlbmRhclsxXVsxXS5tb250aCgpO1xuXHRcdFx0Y29uc3QgY3VycmVudFllYXIgPSBjYWxlbmRhclsxXVsxXS55ZWFyKCk7XG5cdFx0XHRjb25zdCByZWFsQ3VycmVudFllYXIgPSBtb21lbnQoKS55ZWFyKCk7XG5cdFx0XHRjb25zdCBtYXhZZWFyID0gKG1heERhdGUgJiYgbWF4RGF0ZS55ZWFyKCkpIHx8IHJlYWxDdXJyZW50WWVhciArIDU7XG5cdFx0XHRjb25zdCBtaW5ZZWFyID0gKG1pbkRhdGUgJiYgbWluRGF0ZS55ZWFyKCkpIHx8IHJlYWxDdXJyZW50WWVhciAtIDEwMDtcblx0XHRcdGNvbnN0IGluTWluWWVhciA9IGN1cnJlbnRZZWFyID09PSBtaW5ZZWFyO1xuXHRcdFx0Y29uc3QgaW5NYXhZZWFyID0gY3VycmVudFllYXIgPT09IG1heFllYXI7XG5cdFx0XHRjb25zdCB5ZWFycyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgeSA9IG1pblllYXI7IHkgPD0gbWF4WWVhcjsgeSsrKSB7XG5cdFx0XHRcdHllYXJzLnB1c2goeSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducyA9IHtcblx0XHRcdFx0Y3VycmVudE1vbnRoOiBjdXJyZW50TW9udGgsXG5cdFx0XHRcdGN1cnJlbnRZZWFyOiBjdXJyZW50WWVhcixcblx0XHRcdFx0bWF4WWVhcjogbWF4WWVhcixcblx0XHRcdFx0bWluWWVhcjogbWluWWVhcixcblx0XHRcdFx0aW5NaW5ZZWFyOiBpbk1pblllYXIsXG5cdFx0XHRcdGluTWF4WWVhcjogaW5NYXhZZWFyLFxuXHRcdFx0XHRtb250aEFycmF5czogQXJyYXkuZnJvbShBcnJheSgxMikua2V5cygpKSxcblx0XHRcdFx0eWVhckFycmF5czogeWVhcnNcblx0XHRcdH07XG5cdFx0fVxuXHRcdHRoaXMuX2J1aWxkQ2VsbHMoY2FsZW5kYXIsIHNpZGUpO1xuXHR9XG5cdHNldFN0YXJ0RGF0ZShzdGFydERhdGUpIHtcblx0XHRpZiAodHlwZW9mIHN0YXJ0RGF0ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHN0YXJ0RGF0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnREYXRlLnN0YXJ0T2YoJ2RheScpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZS5taW51dGUoXG5cdFx0XHRcdE1hdGgucm91bmQodGhpcy5zdGFydERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1pbkRhdGUgJiYgdGhpcy5zdGFydERhdGUuaXNCZWZvcmUodGhpcy5taW5EYXRlKSkge1xuXHRcdFx0dGhpcy5zdGFydERhdGUgPSB0aGlzLm1pbkRhdGUuY2xvbmUoKTtcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XG5cdFx0XHRcdHRoaXMuc3RhcnREYXRlLm1pbnV0ZShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5zdGFydERhdGUuaXNBZnRlcih0aGlzLm1heERhdGUpKSB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcblx0XHRcdFx0dGhpcy5zdGFydERhdGUubWludXRlKFxuXHRcdFx0XHRcdE1hdGguZmxvb3IodGhpcy5zdGFydERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmlzU2hvd24pIHtcblx0XHRcdHRoaXMudXBkYXRlRWxlbWVudCgpO1xuXHRcdH1cblx0XHR0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQuZW1pdCh7IHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUgfSk7XG5cdFx0dGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcblx0fVxuXG5cdHNldEVuZERhdGUoZW5kRGF0ZSkge1xuXHRcdGlmICh0eXBlb2YgZW5kRGF0ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IG1vbWVudChlbmREYXRlLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgZW5kRGF0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IG1vbWVudChlbmREYXRlKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMuZW5kRGF0ZVxuXHRcdFx0XHQuYWRkKDEsICdkJylcblx0XHRcdFx0LnN0YXJ0T2YoJ2RheScpXG5cdFx0XHRcdC5zdWJ0cmFjdCgxLCAnc2Vjb25kJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcblx0XHRcdHRoaXMuZW5kRGF0ZS5taW51dGUoXG5cdFx0XHRcdE1hdGgucm91bmQodGhpcy5lbmREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5lbmREYXRlLmlzQmVmb3JlKHRoaXMuc3RhcnREYXRlKSkge1xuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMuZW5kRGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdHRoaXMuZGF0ZUxpbWl0ICYmXG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZVxuXHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHQuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5Jylcblx0XHRcdFx0LmlzQmVmb3JlKHRoaXMuZW5kRGF0ZSlcblx0XHQpIHtcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmlzU2hvd24pIHtcblx0XHRcdC8vIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuXHRcdH1cblx0XHR0aGlzLmVuZERhdGVDaGFuZ2VkLmVtaXQoeyBlbmREYXRlOiB0aGlzLmVuZERhdGUgfSk7XG5cdFx0dGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcblx0fVxuXHRASW5wdXQoKVxuXHRpc0ludmFsaWREYXRlKGRhdGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0QElucHV0KClcblx0aXNDdXN0b21EYXRlKGRhdGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR1cGRhdGVWaWV3KCkge1xuXHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcblx0XHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcblx0XHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XG5cdFx0dGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcblx0fVxuXG5cdHVwZGF0ZU1vbnRoc0luVmlldygpIHtcblx0XHRpZiAodGhpcy5lbmREYXRlKSB7XG5cdFx0XHQvLyBpZiBib3RoIGRhdGVzIGFyZSB2aXNpYmxlIGFscmVhZHksIGRvIG5vdGhpbmdcblx0XHRcdGlmIChcblx0XHRcdFx0IXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJlxuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aCAmJlxuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggJiZcblx0XHRcdFx0KCh0aGlzLnN0YXJ0RGF0ZSAmJlxuXHRcdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyICYmXG5cdFx0XHRcdFx0dGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSB8fFxuXHRcdFx0XHRcdCh0aGlzLnN0YXJ0RGF0ZSAmJlxuXHRcdFx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyICYmXG5cdFx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSkgJiZcblx0XHRcdFx0KHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgfHxcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSlcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5zdGFydERhdGUpIHtcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHQhdGhpcy5saW5rZWRDYWxlbmRhcnMgJiZcblx0XHRcdFx0XHQodGhpcy5lbmREYXRlLm1vbnRoKCkgIT09IHRoaXMuc3RhcnREYXRlLm1vbnRoKCkgfHwgdGhpcy5lbmREYXRlLnllYXIoKSAhPT0gdGhpcy5zdGFydERhdGUueWVhcigpKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLmVuZERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlXG5cdFx0XHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHRcdFx0LmRhdGUoMilcblx0XHRcdFx0XHRcdC5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSAhPT0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgJiZcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpICE9PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZVxuXHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0LmRhdGUoMilcblx0XHRcdFx0XHQuYWRkKDEsICdtb250aCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMubGlua2VkQ2FsZW5kYXJzICYmICF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID4gdGhpcy5tYXhEYXRlKSB7XG5cdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLm1heERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuXHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLm1heERhdGVcblx0XHRcdFx0LmNsb25lKClcblx0XHRcdFx0LmRhdGUoMilcblx0XHRcdFx0LnN1YnRyYWN0KDEsICdtb250aCcpO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogIFRoaXMgaXMgcmVzcG9uc2libGUgZm9yIHVwZGF0aW5nIHRoZSBjYWxlbmRhcnNcblx0ICovXG5cdHVwZGF0ZUNhbGVuZGFycygpIHtcblx0XHR0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ucmlnaHQpO1xuXG5cdFx0aWYgKHRoaXMuZW5kRGF0ZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG5cdH1cblx0dXBkYXRlRWxlbWVudCgpIHtcblx0XHRjb25zdCBmb3JtYXQgPSB0aGlzLmxvY2FsZS5kaXNwbGF5Rm9ybWF0ID8gdGhpcy5sb2NhbGUuZGlzcGxheUZvcm1hdCA6IHRoaXMubG9jYWxlLmZvcm1hdDtcblxuXHRcdGlmICghdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XG5cdFx0XHRpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG5cdFx0XHRcdC8vIGlmIHdlIHVzZSByYW5nZXMgYW5kIHNob3VsZCBzaG93IHJhbmdlIGxhYmVsIG9uIGlucHV0XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLnJhbmdlcy5sZW5ndGggJiZcblx0XHRcdFx0XHR0aGlzLnNob3dSYW5nZUxhYmVsT25JbnB1dCA9PT0gdHJ1ZSAmJlxuXHRcdFx0XHRcdHRoaXMuY2hvc2VuUmFuZ2UgLyomJlxuXHRcdFx0XHRcdHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWwgIT09IHRoaXMuY2hvc2VuUmFuZ2UubGFiZWwqL1xuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLmNob3NlbkxhYmVsID0gdGhpcy5jaG9zZW5SYW5nZS5sYWJlbDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmNob3NlbkxhYmVsID1cblx0XHRcdFx0XHRcdHRoaXMuc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpICtcblx0XHRcdFx0XHRcdHRoaXMubG9jYWxlLnNlcGFyYXRvciArXG5cdFx0XHRcdFx0XHR0aGlzLmVuZERhdGUuZm9ybWF0KGZvcm1hdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XG5cdFx0XHR0aGlzLmNob3NlbkxhYmVsID0gdGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCk7XG5cdFx0fVxuXHR9XG5cblx0cmVtb3ZlKCkge1xuXHRcdHRoaXMuaXNTaG93biA9IGZhbHNlO1xuXHR9XG5cdC8qKlxuXHQgKiB0aGlzIHNob3VsZCBjYWxjdWxhdGUgdGhlIGxhYmVsXG5cdCAqL1xuXHRjYWxjdWxhdGVDaG9zZW5MYWJlbCgpIHtcblx0XHRpZiAoIXRoaXMubG9jYWxlIHx8ICF0aGlzLmxvY2FsZS5zZXBhcmF0b3IpIHtcblx0XHRcdHRoaXMuX2J1aWxkTG9jYWxlKCk7XG5cdFx0fVxuXHRcdGxldCBjdXN0b21SYW5nZSA9IHRydWU7XG5cdFx0bGV0IGkgPSAwO1xuXG5cdFx0dGhpcy5yYW5nZXMuZm9yRWFjaChwcmVzZXQgPT4ge1xuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0XHRjb25zdCBmb3JtYXQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gJ1lZWVktTU0tREQgSEg6bW06c3MnIDogJ1lZWVktTU0tREQgSEg6bW0nO1xuXHRcdFx0XHQvLyBpZ25vcmUgdGltZXMgd2hlbiBjb21wYXJpbmcgZGF0ZXMgaWYgdGltZSBwaWNrZXIgc2Vjb25kcyBpcyBub3QgZW5hYmxlZFxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCkgPT09IHByZXNldC5yYW5nZS5zdGFydC5mb3JtYXQoZm9ybWF0KSAmJlxuXHRcdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoZm9ybWF0KSA9PT0gcHJlc2V0LnJhbmdlLmVuZC5mb3JtYXQoZm9ybWF0KVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjdXN0b21SYW5nZSA9IGZhbHNlO1xuXHRcdFx0XHRcdHRoaXMuY2hvc2VuUmFuZ2UgPSBwcmVzZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGlnbm9yZSB0aW1lcyB3aGVuIGNvbXBhcmluZyBkYXRlcyBpZiB0aW1lIHBpY2tlciBpcyBub3QgZW5hYmxlZFxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHByZXNldC5yYW5nZS5zdGFydC5mb3JtYXQoJ1lZWVktTU0tREQnKSAmJlxuXHRcdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gcHJlc2V0LnJhbmdlLmVuZC5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjdXN0b21SYW5nZSA9IGZhbHNlO1xuXHRcdFx0XHRcdHRoaXMuY2hvc2VuUmFuZ2UgPSBwcmVzZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGkrKztcblx0XHR9KTtcblxuXHRcdGlmIChjdXN0b21SYW5nZSkge1xuXHRcdFx0aWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcblx0XHRcdFx0Ly8gdGhpcy5jaG9zZW5SYW5nZS5sYWJlbCA9IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmNob3NlblJhbmdlID0gbnVsbDtcblx0XHRcdH1cblx0XHRcdC8vIGlmIGN1c3RvbSBsYWJlbDogc2hvdyBjYWxlbmRhclxuXHRcdFx0dGhpcy5zaG93Q2FsSW5SYW5nZXMgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlRWxlbWVudCgpO1xuXHR9XG5cblx0Y2xpY2tBcHBseShlPykge1xuXHRcdGlmICghdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMuc3RhcnREYXRlICYmICF0aGlzLmVuZERhdGUpIHtcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0XHR0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLmlzSW52YWxpZERhdGUgJiYgdGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG5cdFx0XHQvLyBnZXQgaWYgdGhlcmUgYXJlIGludmFsaWQgZGF0ZSBiZXR3ZWVuIHJhbmdlXG5cdFx0XHRjb25zdCBkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcblx0XHRcdHdoaWxlIChkLmlzQmVmb3JlKHRoaXMuZW5kRGF0ZSkpIHtcblx0XHRcdFx0aWYgKHRoaXMuaXNJbnZhbGlkRGF0ZShkKSkge1xuXHRcdFx0XHRcdHRoaXMuZW5kRGF0ZSA9IGQuc3VidHJhY3QoMSwgJ2RheXMnKTtcblx0XHRcdFx0XHR0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZC5hZGQoMSwgJ2RheXMnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHRoaXMuY2hvc2VuTGFiZWwpIHtcblx0XHRcdHRoaXMuY2hvb3NlZERhdGUuZW1pdCh7IGNob3NlbkxhYmVsOiB0aGlzLmNob3NlbkxhYmVsLCBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLCBlbmREYXRlOiB0aGlzLmVuZERhdGUgfSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5kYXRlc1VwZGF0ZWQuZW1pdCh7IHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsIGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcblx0XHRpZiAoZSB8fCAodGhpcy5jbG9zZU9uQXV0b0FwcGx5ICYmICFlKSkge1xuXHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0Y2xpY2tDYW5jZWwoZSkge1xuXHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5fb2xkLnN0YXJ0O1xuXHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMuX29sZC5lbmQ7XG5cdFx0aWYgKHRoaXMuaW5saW5lKSB7XG5cdFx0XHR0aGlzLnVwZGF0ZVZpZXcoKTtcblx0XHR9XG5cdFx0dGhpcy5oaWRlKCk7XG5cdH1cblx0LyoqXG5cdCAqIGNhbGxlZCB3aGVuIG1vbnRoIGlzIGNoYW5nZWRcblx0ICogQHBhcmFtIG1vbnRoRXZlbnQgZ2V0IHZhbHVlIGluIGV2ZW50LnRhcmdldC52YWx1ZVxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG5cdCAqL1xuXHRtb250aENoYW5nZWQobW9udGhFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuXHRcdGNvbnN0IHllYXIgPSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50WWVhcjtcblx0XHRjb25zdCBtb250aCA9IHBhcnNlSW50KG1vbnRoRXZlbnQudmFsdWUsIDEwKTtcblx0XHR0aGlzLm1vbnRoT3JZZWFyQ2hhbmdlZChtb250aCwgeWVhciwgc2lkZSk7XG5cdH1cblx0LyoqXG5cdCAqIGNhbGxlZCB3aGVuIHllYXIgaXMgY2hhbmdlZFxuXHQgKiBAcGFyYW0geWVhckV2ZW50IGdldCB2YWx1ZSBpbiBldmVudC50YXJnZXQudmFsdWVcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuXHQgKi9cblx0eWVhckNoYW5nZWQoeWVhckV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0Y29uc3QgbW9udGggPSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50TW9udGg7XG5cdFx0Y29uc3QgeWVhciA9IHBhcnNlSW50KHllYXJFdmVudC52YWx1ZSwgMTApO1xuXHRcdHRoaXMubW9udGhPclllYXJDaGFuZ2VkKG1vbnRoLCB5ZWFyLCBzaWRlKTtcblx0fVxuXHQvKipcblx0ICogY2FsbGVkIHdoZW4gdGltZSBpcyBjaGFuZ2VkXG5cdCAqIEBwYXJhbSB0aW1lRXZlbnQgIGFuIGV2ZW50XG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcblx0ICovXG5cdHRpbWVDaGFuZ2VkKHRpbWVFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuXHRcdGxldCBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xuXHRcdGNvbnN0IG1pbnV0ZSA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZE1pbnV0ZSwgMTApO1xuXHRcdGNvbnN0IHNlY29uZCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQsIDEwKSA6IDA7XG5cblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xuXHRcdFx0Y29uc3QgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XG5cdFx0XHRpZiAoYW1wbSA9PT0gJ1BNJyAmJiBob3VyIDwgMTIpIHtcblx0XHRcdFx0aG91ciArPSAxMjtcblx0XHRcdH1cblx0XHRcdGlmIChhbXBtID09PSAnQU0nICYmIGhvdXIgPT09IDEyKSB7XG5cdFx0XHRcdGhvdXIgPSAwO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHRjb25zdCBzdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG5cdFx0XHRzdGFydC5ob3VyKGhvdXIpO1xuXHRcdFx0c3RhcnQubWludXRlKG1pbnV0ZSk7XG5cdFx0XHRzdGFydC5zZWNvbmQoc2Vjb25kKTtcblx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKHN0YXJ0KTtcblx0XHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcblx0XHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcblx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdHRoaXMuZW5kRGF0ZSAmJlxuXHRcdFx0XHR0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG5cdFx0XHRcdHRoaXMuZW5kRGF0ZS5pc0JlZm9yZShzdGFydClcblx0XHRcdCkge1xuXHRcdFx0XHR0aGlzLnNldEVuZERhdGUoc3RhcnQuY2xvbmUoKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0aGlzLmVuZERhdGUpIHtcblx0XHRcdGNvbnN0IGVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuXHRcdFx0ZW5kLmhvdXIoaG91cik7XG5cdFx0XHRlbmQubWludXRlKG1pbnV0ZSk7XG5cdFx0XHRlbmQuc2Vjb25kKHNlY29uZCk7XG5cdFx0XHR0aGlzLnNldEVuZERhdGUoZW5kKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG5cblx0XHQvLyByZS1yZW5kZXIgdGhlIHRpbWUgcGlja2VycyBiZWNhdXNlIGNoYW5naW5nIG9uZSBzZWxlY3Rpb24gY2FuIGFmZmVjdCB3aGF0J3MgZW5hYmxlZCBpbiBhbm90aGVyXG5cdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuXHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG5cblx0XHRpZiAodGhpcy5hdXRvQXBwbHkpIHtcblx0XHRcdHRoaXMuY2xpY2tBcHBseSgpO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogIGNhbGwgd2hlbiBtb250aCBvciB5ZWFyIGNoYW5nZWRcblx0ICogQHBhcmFtIG1vbnRoIG1vbnRoIG51bWJlciAwIC0xMVxuXHQgKiBAcGFyYW0geWVhciB5ZWFyIGVnOiAxOTk1XG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcblx0ICovXG5cdG1vbnRoT3JZZWFyQ2hhbmdlZChtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIsIHNpZGU6IFNpZGVFbnVtKSB7XG5cdFx0Y29uc3QgaXNMZWZ0ID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdDtcblxuXHRcdGlmICghaXNMZWZ0KSB7XG5cdFx0XHRpZiAoeWVhciA8IHRoaXMuc3RhcnREYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5zdGFydERhdGUueWVhcigpICYmIG1vbnRoIDwgdGhpcy5zdGFydERhdGUubW9udGgoKSkpIHtcblx0XHRcdFx0bW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5tb250aCgpO1xuXHRcdFx0XHR5ZWFyID0gdGhpcy5zdGFydERhdGUueWVhcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1pbkRhdGUpIHtcblx0XHRcdGlmICh5ZWFyIDwgdGhpcy5taW5EYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5taW5EYXRlLnllYXIoKSAmJiBtb250aCA8IHRoaXMubWluRGF0ZS5tb250aCgpKSkge1xuXHRcdFx0XHRtb250aCA9IHRoaXMubWluRGF0ZS5tb250aCgpO1xuXHRcdFx0XHR5ZWFyID0gdGhpcy5taW5EYXRlLnllYXIoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5tYXhEYXRlKSB7XG5cdFx0XHRpZiAoeWVhciA+IHRoaXMubWF4RGF0ZS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMubWF4RGF0ZS55ZWFyKCkgJiYgbW9udGggPiB0aGlzLm1heERhdGUubW9udGgoKSkpIHtcblx0XHRcdFx0bW9udGggPSB0aGlzLm1heERhdGUubW9udGgoKTtcblx0XHRcdFx0eWVhciA9IHRoaXMubWF4RGF0ZS55ZWFyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXIgPSB5ZWFyO1xuXHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRNb250aCA9IG1vbnRoO1xuXG5cdFx0aWYgKGlzTGVmdCkge1xuXHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgubW9udGgobW9udGgpLnllYXIoeWVhcik7XG5cdFx0XHRpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChtb250aCkueWVhcih5ZWFyKTtcblx0XHRcdGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5jbG9uZSgpLnN1YnRyYWN0KDEsICdtb250aCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsaWNrIG9uIHByZXZpb3VzIG1vbnRoXG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHQgY2FsZW5kYXJcblx0ICovXG5cdGNsaWNrUHJldihzaWRlOiBTaWRlRW51bSkge1xuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcblx0XHRcdGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcblx0fVxuXHQvKipcblx0ICogQ2xpY2sgb24gbmV4dCBtb250aFxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0IGNhbGVuZGFyXG5cdCAqL1xuXHRjbGlja05leHQoc2lkZTogU2lkZUVudW0pIHtcblx0XHRpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuXHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguYWRkKDEsICdtb250aCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguYWRkKDEsICdtb250aCcpO1xuXHRcdFx0aWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcblx0fVxuXHQvKipcblx0ICogV2hlbiBzZWxlY3RpbmcgYSBkYXRlXG5cdCAqIEBwYXJhbSBlIGV2ZW50OiBnZXQgdmFsdWUgYnkgZS50YXJnZXQudmFsdWVcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuXHQgKiBAcGFyYW0gcm93IHJvdyBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcblx0ICogQHBhcmFtIGNvbCBjb2wgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgZGF0ZSBjbGlja2VkXG5cdCAqL1xuXHRjbGlja0RhdGUoZSwgc2lkZTogU2lkZUVudW0sIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcikge1xuXHRcdGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnVEQnKSB7XG5cdFx0XHRpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYXZhaWxhYmxlJykpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1NQQU4nKSB7XG5cdFx0XHRpZiAoIWUudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhdmFpbGFibGUnKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGUgPVxuXHRcdFx0c2lkZSA9PT0gU2lkZUVudW0ubGVmdCA/IHRoaXMubGVmdENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXSA6IHRoaXMucmlnaHRDYWxlbmRhci5jYWxlbmRhcltyb3ddW2NvbF07XG5cblx0XHRpZiAoXG5cdFx0XHQodGhpcy5lbmREYXRlIHx8IChkYXRlLmlzQmVmb3JlKHRoaXMuc3RhcnREYXRlLCAnZGF5JykgJiYgdGhpcy5jdXN0b21SYW5nZURpcmVjdGlvbiA9PT0gZmFsc2UpKSAmJlxuXHRcdFx0dGhpcy5sb2NrU3RhcnREYXRlID09PSBmYWxzZVxuXHRcdCkge1xuXHRcdFx0Ly8gcGlja2luZyBzdGFydFxuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0XHRkYXRlID0gdGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIFNpZGVFbnVtLmxlZnQpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5lbmREYXRlID0gbnVsbDtcblx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKGRhdGUuY2xvbmUoKSk7XG5cdFx0fSBlbHNlIGlmICghdGhpcy5lbmREYXRlICYmIGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUpICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IGZhbHNlKSB7XG5cdFx0XHQvLyBzcGVjaWFsIGNhc2U6IGNsaWNraW5nIHRoZSBzYW1lIGRhdGUgZm9yIHN0YXJ0L2VuZCxcblx0XHRcdC8vIGJ1dCB0aGUgdGltZSBvZiB0aGUgZW5kIGRhdGUgaXMgYmVmb3JlIHRoZSBzdGFydCBkYXRlXG5cdFx0XHR0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUuY2xvbmUoKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBpY2tpbmcgZW5kXG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHRcdGRhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgU2lkZUVudW0ucmlnaHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUsICdkYXknKSA9PT0gdHJ1ZSAmJiB0aGlzLmN1c3RvbVJhbmdlRGlyZWN0aW9uID09PSB0cnVlKSB7XG5cdFx0XHRcdHRoaXMuc2V0RW5kRGF0ZSh0aGlzLnN0YXJ0RGF0ZSk7XG5cdFx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKGRhdGUuY2xvbmUoKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnNldEVuZERhdGUoZGF0ZS5jbG9uZSgpKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuYXV0b0FwcGx5KSB7XG5cdFx0XHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0XHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xuXHRcdFx0dGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcblx0XHRcdHRoaXMudXBkYXRlRWxlbWVudCgpO1xuXHRcdFx0aWYgKHRoaXMuYXV0b0FwcGx5KSB7XG5cdFx0XHRcdHRoaXMuY2xpY2tBcHBseSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlVmlldygpO1xuXG5cdFx0aWYgKHRoaXMuYXV0b0FwcGx5ICYmIHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xuXHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGhpcyBpcyB0byBjYW5jZWwgdGhlIGJsdXIgZXZlbnQgaGFuZGxlciBpZiB0aGUgbW91c2Ugd2FzIGluIG9uZSBvZiB0aGUgaW5wdXRzXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXHQvKipcblx0ICogIENsaWNrIG9uIHRoZSBjdXN0b20gcmFuZ2Vcblx0ICogQHBhcmFtIGU6IEV2ZW50XG5cdCAqIEBwYXJhbSBwcmVzZXRcblx0ICovXG5cdGNsaWNrUmFuZ2UoZSwgcHJlc2V0OiBEYXRlUmFuZ2VQcmVzZXQpIHtcblx0XHR0aGlzLmNob3NlblJhbmdlID0gcHJlc2V0O1xuXHRcdHRoaXMuc3RhcnREYXRlID0gcHJlc2V0LnJhbmdlLnN0YXJ0LmNsb25lKCk7XG5cdFx0dGhpcy5lbmREYXRlID0gcHJlc2V0LnJhbmdlLmVuZC5jbG9uZSgpO1xuXG5cdFx0aWYgKHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0KSB7XG5cdFx0XHR0aGlzLmNob3NlbkxhYmVsID0gcHJlc2V0LmxhYmVsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG5cdFx0fVxuXHRcdHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcblxuXHRcdGlmICghdGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcblx0XHRcdHRoaXMuZW5kRGF0ZS5lbmRPZignZGF5Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnMpIHtcblx0XHRcdHRoaXMuaXNTaG93biA9IGZhbHNlOyAvLyBoaWRlIGNhbGVuZGFyc1xuXHRcdH1cblx0XHR0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHsgbGFiZWw6IHByZXNldC5sYWJlbCwgZGF0ZXM6IHByZXNldC5yYW5nZSB9KTtcblx0XHRpZiAoIXRoaXMua2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSkge1xuXHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNsaWNrQXBwbHkoKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5tYXhEYXRlLmlzU2FtZShwcmVzZXQucmFuZ2Uuc3RhcnQsICdtb250aCcpKSB7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChwcmVzZXQucmFuZ2Uuc3RhcnQubW9udGgoKSk7XG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC55ZWFyKHByZXNldC5yYW5nZS5zdGFydC55ZWFyKCkpO1xuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChwcmVzZXQucmFuZ2Uuc3RhcnQubW9udGgoKSAtIDEpO1xuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKHByZXNldC5yYW5nZS5lbmQueWVhcigpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKHByZXNldC5yYW5nZS5zdGFydC5tb250aCgpKTtcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgueWVhcihwcmVzZXQucmFuZ2Uuc3RhcnQueWVhcigpKTtcblx0XHRcdFx0Ly8gZ2V0IHRoZSBuZXh0IHllYXJcblx0XHRcdFx0Y29uc3QgbmV4dE1vbnRoID0gcHJlc2V0LnJhbmdlLnN0YXJ0LmNsb25lKCkuYWRkKDEsICdtb250aCcpO1xuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgubW9udGgobmV4dE1vbnRoLm1vbnRoKCkpO1xuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgueWVhcihuZXh0TW9udGgueWVhcigpKTtcblx0XHRcdH1cblx0XHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyKSB7XG5cdFx0XHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcblx0XHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRzaG93KGU/KSB7XG5cdFx0aWYgKHRoaXMuaXNTaG93bikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLl9vbGQuc3RhcnQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuXHRcdHRoaXMuX29sZC5lbmQgPSB0aGlzLmVuZERhdGUuY2xvbmUoKTtcblx0XHR0aGlzLmlzU2hvd24gPSB0cnVlO1xuXHRcdHRoaXMudXBkYXRlVmlldygpO1xuXHR9XG5cblx0aGlkZShlPykge1xuXHRcdGlmICghdGhpcy5pc1Nob3duKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIGluY29tcGxldGUgZGF0ZSBzZWxlY3Rpb24sIHJldmVydCB0byBsYXN0IHZhbHVlc1xuXHRcdGlmICghdGhpcy5lbmREYXRlKSB7XG5cdFx0XHRpZiAodGhpcy5fb2xkLnN0YXJ0KSB7XG5cdFx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5fb2xkLnN0YXJ0LmNsb25lKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fb2xkLmVuZCkge1xuXHRcdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLl9vbGQuZW5kLmNsb25lKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaWYgYSBuZXcgZGF0ZSByYW5nZSB3YXMgc2VsZWN0ZWQsIGludm9rZSB0aGUgdXNlciBjYWxsYmFjayBmdW5jdGlvblxuXHRcdGlmICghdGhpcy5zdGFydERhdGUuaXNTYW1lKHRoaXMuX29sZC5zdGFydCkgfHwgIXRoaXMuZW5kRGF0ZS5pc1NhbWUodGhpcy5fb2xkLmVuZCkpIHtcblx0XHRcdC8vIHRoaXMuY2FsbGJhY2sodGhpcy5zdGFydERhdGUsIHRoaXMuZW5kRGF0ZSwgdGhpcy5jaG9zZW5MYWJlbCk7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgcGlja2VyIGlzIGF0dGFjaGVkIHRvIGEgdGV4dCBpbnB1dCwgdXBkYXRlIGl0XG5cdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XG5cdFx0dGhpcy5pc1Nob3duID0gZmFsc2U7XG5cdFx0dGhpcy5fcmVmLmRldGVjdENoYW5nZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBoYW5kbGUgY2xpY2sgb24gYWxsIGVsZW1lbnQgaW4gdGhlIGNvbXBvbmVudCwgdXNlZnVsIGZvciBvdXRzaWRlIG9mIGNsaWNrXG5cdCAqIEBwYXJhbSBlIGV2ZW50XG5cdCAqL1xuXHRoYW5kbGVJbnRlcm5hbENsaWNrKGUpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG5cdC8qKlxuXHQgKiB1cGRhdGUgdGhlIGxvY2FsZSBvcHRpb25zXG5cdCAqIEBwYXJhbSBsb2NhbGVcblx0ICovXG5cdHVwZGF0ZUxvY2FsZShsb2NhbGUpIHtcblx0XHRmb3IgKGNvbnN0IGtleSBpbiBsb2NhbGUpIHtcblx0XHRcdGlmIChsb2NhbGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHR0aGlzLmxvY2FsZVtrZXldID0gbG9jYWxlW2tleV07XG5cdFx0XHRcdGlmIChrZXkgPT09ICdjdXN0b21SYW5nZUxhYmVsJykge1xuXHRcdFx0XHRcdHRoaXMucmVuZGVyUmFuZ2VzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqICBjbGVhciB0aGUgZGF0ZXJhbmdlIHBpY2tlclxuXHQgKi9cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5zdGFydERhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcblx0XHR0aGlzLmVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG5cdFx0dGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcblx0XHR0aGlzLnVwZGF0ZVZpZXcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kIG91dCBpZiB0aGUgc2VsZWN0ZWQgcmFuZ2Ugc2hvdWxkIGJlIGRpc2FibGVkIGlmIGl0IGRvZXNuJ3Rcblx0ICogZml0IGludG8gbWluRGF0ZSBhbmQgbWF4RGF0ZSBsaW1pdGF0aW9ucy5cblx0ICovXG5cdGRpc2FibGVSYW5nZShwcmVzZXQpIHtcblx0XHRpZiAocHJlc2V0LmxhYmVsID09PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYXJlQm90aEJlZm9yZSA9IHRoaXMubWluRGF0ZVxuXHRcdFx0JiYgcHJlc2V0LnJhbmdlLnN0YXJ0LmlzQmVmb3JlKHRoaXMubWluRGF0ZSlcblx0XHRcdCYmIHByZXNldC5yYW5nZS5lbmQuaXNCZWZvcmUodGhpcy5taW5EYXRlKTtcblxuXHRcdGNvbnN0IGFyZUJvdGhBZnRlciA9IHRoaXMubWF4RGF0ZVxuXHRcdFx0JiYgcHJlc2V0LnJhbmdlLnN0YXJ0LmlzQWZ0ZXIodGhpcy5tYXhEYXRlKVxuXHRcdFx0JiYgcHJlc2V0LnJhbmdlLmVuZC5pc0FmdGVyKHRoaXMubWF4RGF0ZSk7XG5cblx0XHRyZXR1cm4gYXJlQm90aEJlZm9yZSB8fCBhcmVCb3RoQWZ0ZXI7XG5cdH1cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRlIHRoZSBkYXRlIHRvIGFkZCB0aW1lXG5cdCAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcblx0ICovXG5cdHByaXZhdGUgX2dldERhdGVXaXRoVGltZShkYXRlLCBzaWRlOiBTaWRlRW51bSk6IF9tb21lbnQuTW9tZW50IHtcblx0XHRsZXQgaG91ciA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIsIDEwKTtcblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xuXHRcdFx0Y29uc3QgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XG5cdFx0XHRpZiAoYW1wbSA9PT0gJ1BNJyAmJiBob3VyIDwgMTIpIHtcblx0XHRcdFx0aG91ciArPSAxMjtcblx0XHRcdH1cblx0XHRcdGlmIChhbXBtID09PSAnQU0nICYmIGhvdXIgPT09IDEyKSB7XG5cdFx0XHRcdGhvdXIgPSAwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zdCBtaW51dGUgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUsIDEwKTtcblx0XHRjb25zdCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xuXHRcdHJldHVybiBkYXRlXG5cdFx0XHQuY2xvbmUoKVxuXHRcdFx0LmhvdXIoaG91cilcblx0XHRcdC5taW51dGUobWludXRlKVxuXHRcdFx0LnNlY29uZChzZWNvbmQpO1xuXHR9XG5cdC8qKlxuXHQgKiAgYnVpbGQgdGhlIGxvY2FsZSBjb25maWdcblx0ICovXG5cdHByaXZhdGUgX2J1aWxkTG9jYWxlKCkge1xuXHRcdHRoaXMubG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udGhpcy5sb2NhbGUgfTtcblx0XHRpZiAoIXRoaXMubG9jYWxlLmZvcm1hdCkge1xuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xuXHRcdFx0XHR0aGlzLmxvY2FsZS5mb3JtYXQgPSBtb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdsbGwnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubG9jYWxlLmZvcm1hdCA9IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ0wnKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cHJpdmF0ZSBfYnVpbGRDZWxscyhjYWxlbmRhciwgc2lkZTogU2lkZUVudW0pIHtcblx0XHRmb3IgKGxldCByb3cgPSAwOyByb3cgPCA2OyByb3crKykge1xuXHRcdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd10gPSB7fTtcblx0XHRcdGxldCBjb2xPZmZDb3VudCA9IDA7XG5cdFx0XHRjb25zdCByb3dDbGFzc2VzID0gW107XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHRoaXMuZW1wdHlXZWVrUm93Q2xhc3MgJiZcblx0XHRcdFx0IXRoaXMuaGFzQ3VycmVudE1vbnRoRGF5cyh0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1vbnRoLCBjYWxlbmRhcltyb3ddKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJvd0NsYXNzZXMucHVzaCh0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDc7IGNvbCsrKSB7XG5cdFx0XHRcdGNvbnN0IGNsYXNzZXMgPSBbXTtcblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IHRvZGF5J3MgZGF0ZVxuXHRcdFx0XHRpZiAoY2FsZW5kYXJbcm93XVtjb2xdLmlzU2FtZShuZXcgRGF0ZSgpLCAnZGF5JykpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ3RvZGF5Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IHdlZWtlbmRzXG5cdFx0XHRcdGlmIChjYWxlbmRhcltyb3ddW2NvbF0uaXNvV2Vla2RheSgpID4gNSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnd2Vla2VuZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGdyZXkgb3V0IHRoZSBkYXRlcyBpbiBvdGhlciBtb250aHMgZGlzcGxheWVkIGF0IGJlZ2lubmluZyBhbmQgZW5kIG9mIHRoaXMgY2FsZW5kYXJcblx0XHRcdFx0aWYgKGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpICE9PSBjYWxlbmRhclsxXVsxXS5tb250aCgpKSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnLCAnaGlkZGVuJyk7XG5cdFx0XHRcdFx0Y29sT2ZmQ291bnQrKztcblxuXHRcdFx0XHRcdC8vIG1hcmsgdGhlIGxhc3QgZGF5IG9mIHRoZSBwcmV2aW91cyBtb250aCBpbiB0aGlzIGNhbGVuZGFyXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0dGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgJiZcblx0XHRcdFx0XHRcdChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA8IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHwgY2FsZW5kYXJbMV1bMV0ubW9udGgoKSA9PT0gMCkgJiZcblx0XHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZGF5c0luTGFzdE1vbnRoXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2godGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgbmV4dCBtb250aCBpbiB0aGlzIGNhbGVuZGFyXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgJiZcblx0XHRcdFx0XHRcdChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA+IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHwgY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IDApICYmXG5cdFx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSAxXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2godGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBtYXJrIHRoZSBmaXJzdCBkYXkgb2YgdGhlIGN1cnJlbnQgbW9udGggd2l0aCBhIGN1c3RvbSBjbGFzc1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSAmJlxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmZpcnN0RGF5LmRhdGUoKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2godGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIG1hcmsgdGhlIGxhc3QgZGF5IG9mIHRoZSBjdXJyZW50IG1vbnRoIHdpdGggYSBjdXN0b20gY2xhc3Ncblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSAmJlxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmxhc3REYXkuZGF0ZSgpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCh0aGlzLmxhc3RNb250aERheUNsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZXMgYmVmb3JlIHRoZSBtaW5pbXVtIGRhdGVcblx0XHRcdFx0aWYgKHRoaXMubWluRGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uaXNCZWZvcmUodGhpcy5taW5EYXRlLCAnZGF5JykpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlcyBhZnRlciB0aGUgbWF4aW11bSBkYXRlXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1heERhdGUgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uaXNBZnRlcih0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1heERhdGUsICdkYXknKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlIGlmIGEgY3VzdG9tIGZ1bmN0aW9uIGRlY2lkZXMgaXQncyBpbnZhbGlkXG5cdFx0XHRcdGlmICh0aGlzLmlzSW52YWxpZERhdGUoY2FsZW5kYXJbcm93XVtjb2xdKSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJywgJ2ludmFsaWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBoaWdobGlnaHQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBzdGFydCBkYXRlXG5cdFx0XHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdhY3RpdmUnLCAnc3RhcnQtZGF0ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGhpZ2hsaWdodCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGVuZCBkYXRlXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUgIT0gbnVsbCAmJlxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ2VuZC1kYXRlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IGRhdGVzIGluLWJldHdlZW4gdGhlIHNlbGVjdGVkIGRhdGVzXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUgIT0gbnVsbCAmJlxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMuc3RhcnREYXRlLCAnZGF5JykgJiZcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uaXNCZWZvcmUodGhpcy5lbmREYXRlLCAnZGF5Jylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdpbi1yYW5nZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGFwcGx5IGN1c3RvbSBjbGFzc2VzIGZvciB0aGlzIGRhdGVcblx0XHRcdFx0Y29uc3QgaXNDdXN0b20gPSB0aGlzLmlzQ3VzdG9tRGF0ZShjYWxlbmRhcltyb3ddW2NvbF0pO1xuXHRcdFx0XHRpZiAoaXNDdXN0b20gIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBpc0N1c3RvbSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChpc0N1c3RvbSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGNsYXNzZXMsIGlzQ3VzdG9tKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gc3RvcmUgY2xhc3NlcyB2YXJcblx0XHRcdFx0bGV0IGNuYW1lID0gJycsXG5cdFx0XHRcdFx0ZGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y25hbWUgKz0gY2xhc3Nlc1tpXSArICcgJztcblx0XHRcdFx0XHRpZiAoY2xhc3Nlc1tpXSA9PT0gJ2Rpc2FibGVkJykge1xuXHRcdFx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWRpc2FibGVkKSB7XG5cdFx0XHRcdFx0Y25hbWUgKz0gJ2F2YWlsYWJsZSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd11bY29sXSA9IGNuYW1lLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcblx0XHRcdH1cblx0XHRcdGlmIChjb2xPZmZDb3VudCA9PT0gNykge1xuXHRcdFx0XHRyb3dDbGFzc2VzLnB1c2goJ29mZicpO1xuXHRcdFx0XHRyb3dDbGFzc2VzLnB1c2goJ2Rpc2FibGVkJyk7XG5cdFx0XHRcdHJvd0NsYXNzZXMucHVzaCgnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XS5jbGFzc0xpc3QgPSByb3dDbGFzc2VzLmpvaW4oJyAnKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRmluZCBvdXQgaWYgdGhlIGN1cnJlbnQgY2FsZW5kYXIgcm93IGhhcyBjdXJyZW50IG1vbnRoIGRheXNcblx0ICogKGFzIG9wcG9zZWQgdG8gY29uc2lzdGluZyBvZiBvbmx5IHByZXZpb3VzL25leHQgbW9udGggZGF5cylcblx0ICovXG5cdGhhc0N1cnJlbnRNb250aERheXMoY3VycmVudE1vbnRoLCByb3cpIHtcblx0XHRmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCA3OyBkYXkrKykge1xuXHRcdFx0aWYgKHJvd1tkYXldLm1vbnRoKCkgPT09IGN1cnJlbnRNb250aCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4iXX0=