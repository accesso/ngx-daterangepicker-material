import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateRangePreset } from '../../../../src/daterangepicker/date-range-picker.models';

@Component({
	selector: 'custom-ranges',
	templateUrl: './custom-ranges.component.html',
	styleUrls: ['./custom-ranges.component.scss']
})
export class CustomRangesComponent implements OnInit {
	selected: any;
	alwaysShowCalendars: boolean;
	showRangeLabelOnInput: boolean;
	keepCalendarOpeningWithRange: boolean;
	maxDate: moment.Moment;
	minDate: moment.Moment;
	invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
	ranges: DateRangePreset[] = [
		{
			key: 'today',
			label: 'Today',
			range: {start: moment(), end: moment()}
		},
		{
			key: 'yesterday',
			label: 'Yesterday!',
			range: {start: moment().subtract(1, 'days'), end: moment().subtract(1, 'days')}
		},
		{
			key: 'lastWeek',
			label: 'Last 7 Days',
			range: {start: moment().subtract(6, 'days'), end: moment()}
		},
		{
			key: 'lastMonth',
			label: 'Last 30 Days',
			range: {start: moment().subtract(29, 'days'), end: moment()}
		}
	];

	isInvalidDate = (m: moment.Moment) => {
		return this.invalidDates.some(d => d.isSame(m, 'day'));
	}

	constructor() {
		this.maxDate = moment().add(2, 'weeks');
		this.minDate = moment().subtract(3, 'days');

		this.alwaysShowCalendars = true;
		this.keepCalendarOpeningWithRange = true;
		this.showRangeLabelOnInput = true;
		this.selected = { startDate: moment().subtract(1, 'days'), endDate: moment().subtract(1, 'days') };
	}
	rangeClicked(range) {
		console.log('[rangeClicked] range is : ', range);
	}
	datesUpdated(range) {
		console.log('[datesUpdated] range is : ', range);
	}

	ngOnInit() {}
}
