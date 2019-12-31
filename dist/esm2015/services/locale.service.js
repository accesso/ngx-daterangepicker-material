import * as tslib_1 from "tslib";
import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from '../daterangepicker.config';
let LocaleService = class LocaleService {
    constructor(_config) {
        this._config = _config;
    }
    get config() {
        return Object.assign({}, DefaultLocaleConfig, this._config);
    }
};
LocaleService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_CONFIG,] }] }
];
LocaleService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__param(0, Inject(LOCALE_CONFIG))
], LocaleService);
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsLyIsInNvdXJjZXMiOlsic2VydmljZXMvbG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sMkJBQTJCLENBQUM7QUFHN0YsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUN6QixZQUEyQyxPQUFxQjtRQUFyQixZQUFPLEdBQVAsT0FBTyxDQUFjO0lBQUcsQ0FBQztJQUVwRSxJQUFJLE1BQU07UUFDVCx5QkFBWSxtQkFBbUIsRUFBSyxJQUFJLENBQUMsT0FBTyxFQUFHO0lBQ3BELENBQUM7Q0FDRCxDQUFBOzs0Q0FMYSxNQUFNLFNBQUMsYUFBYTs7QUFEckIsYUFBYTtJQUR6QixVQUFVLEVBQUU7SUFFQyxtQkFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7R0FEdEIsYUFBYSxDQU16QjtTQU5ZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExPQ0FMRV9DT05GSUcsIERlZmF1bHRMb2NhbGVDb25maWcsIExvY2FsZUNvbmZpZyB9IGZyb20gJy4uL2RhdGVyYW5nZXBpY2tlci5jb25maWcnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9jYWxlU2VydmljZSB7XG5cdGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0NPTkZJRykgcHJpdmF0ZSBfY29uZmlnOiBMb2NhbGVDb25maWcpIHt9XG5cblx0Z2V0IGNvbmZpZygpIHtcblx0XHRyZXR1cm4geyAuLi5EZWZhdWx0TG9jYWxlQ29uZmlnLCAuLi50aGlzLl9jb25maWcgfTtcblx0fVxufVxuIl19