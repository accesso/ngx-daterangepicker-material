import * as moment from 'moment';
export interface DateRangePreset {
    label: string;
    range: {
        start: moment.Moment;
        end: moment.Moment;
    };
}
