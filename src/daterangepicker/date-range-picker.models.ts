import * as moment from 'moment';

export interface DateRangePreset {
	key: string;
	label: string;
	range: {
		start: moment.Moment,
		end: moment.Moment
	};
}
