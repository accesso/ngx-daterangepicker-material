import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as localization from 'moment/locale/fr';
import { LocaleConfig } from '../../../../src/daterangepicker';

@Component({
	selector: 'single-datepicker',
	templateUrl: './single-datepicker.component.html',
	styleUrls: ['./single-datepicker.component.scss']
})
export class SingleDatepickerComponent implements OnInit {
	selected = moment();

	constructor() {}
	ngOnInit() {}
	isInvalidDate(date) {
		return date.weekday() === 0;
	}
	isCustomDate(date) {
		return date.weekday() === 0 || date.weekday() === 6 ? 'mycustomdate' : false;
	}
}
