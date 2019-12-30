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
LocaleService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__param(0, Inject(LOCALE_CONFIG)),
    tslib_1.__metadata("design:paramtypes", [Object])
], LocaleService);
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsLyIsInNvdXJjZXMiOlsic2VydmljZXMvbG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sMkJBQTJCLENBQUM7QUFHN0YsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUN6QixZQUEyQyxPQUFxQjtRQUFyQixZQUFPLEdBQVAsT0FBTyxDQUFjO0lBQUcsQ0FBQztJQUVwRSxJQUFJLE1BQU07UUFDVCx5QkFBWSxtQkFBbUIsRUFBSyxJQUFJLENBQUMsT0FBTyxFQUFHO0lBQ3BELENBQUM7Q0FDRCxDQUFBO0FBTlksYUFBYTtJQUR6QixVQUFVLEVBQUU7SUFFQyxtQkFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7O0dBRHRCLGFBQWEsQ0FNekI7U0FOWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMT0NBTEVfQ09ORklHLCBEZWZhdWx0TG9jYWxlQ29uZmlnLCBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2FsZVNlcnZpY2Uge1xuXHRjb25zdHJ1Y3RvcihASW5qZWN0KExPQ0FMRV9DT05GSUcpIHByaXZhdGUgX2NvbmZpZzogTG9jYWxlQ29uZmlnKSB7fVxuXG5cdGdldCBjb25maWcoKSB7XG5cdFx0cmV0dXJuIHsgLi4uRGVmYXVsdExvY2FsZUNvbmZpZywgLi4udGhpcy5fY29uZmlnIH07XG5cdH1cbn1cbiJdfQ==