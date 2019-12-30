import { LocaleConfig } from '../daterangepicker.config';
export declare class LocaleService {
    private _config;
    constructor(_config: LocaleConfig);
    readonly config: {
        direction?: string;
        separator?: string;
        weekLabel?: string;
        applyLabel?: string;
        cancelLabel?: string;
        clearLabel?: string;
        customRangeLabel?: string;
        daysOfWeek?: string[];
        monthNames?: string[];
        firstDay?: number;
        format?: string;
    };
}
