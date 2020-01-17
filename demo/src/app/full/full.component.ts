import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DateRangePickerDirective } from '../../../../src/daterangepicker/directives/date-range-picker.directive';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'full',
	templateUrl: './full.component.html',
	styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
	constructor() {
		this.timePicker = false;
		this.opens = 'right';
		this.drops = 'down';
		this.dateLimit = 30;
	}
	title = 'Pure angular daterangepicker';
	options: any = {
		autoApply: false,
		alwaysShowCalendars: false,
		showCancel: false,
		showClearButton: false,
		linkedCalendars: true,
		singleDatePicker: false,
		showWeekNumbers: false,
		showISOWeekNumbers: false,
		customRangeDirection: false,
		lockStartDate: false,
		closeOnAutoApply: true
	};
	minDate: moment.Moment = moment().subtract(5, 'days');
	maxDate: moment.Moment = moment().add(2, 'month');
	locale: any = {
		format: 'DD MMMM YYYY HH:mm',
		separator: ' To ',
		cancelLabel: 'Cancel',
		applyLabel: 'Okay'
	};
	opens: string;
	drops: string;
	timePicker: boolean;
	dateLimit: number;
	selected = { start: moment().subtract(3, 'days'), end: moment().add(3, 'days') };
	@ViewChild(DateRangePickerDirective, { static: true }) daterangepicker: DateRangePickerDirective;
	click() {}

	clear(): void {
		this.daterangepicker.clear();
	}
	ngOnInit() {}

	eventClicked(e): void {
		console.log(e);
	}
}
