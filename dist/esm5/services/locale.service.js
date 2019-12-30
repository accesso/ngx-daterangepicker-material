import * as tslib_1 from "tslib";
import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from '../daterangepicker.config';
var LocaleService = /** @class */ (function () {
    function LocaleService(_config) {
        this._config = _config;
    }
    Object.defineProperty(LocaleService.prototype, "config", {
        get: function () {
            return tslib_1.__assign({}, DefaultLocaleConfig, this._config);
        },
        enumerable: true,
        configurable: true
    });
    LocaleService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(LOCALE_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], LocaleService);
    return LocaleService;
}());
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsLyIsInNvdXJjZXMiOlsic2VydmljZXMvbG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sMkJBQTJCLENBQUM7QUFHN0Y7SUFDQyx1QkFBMkMsT0FBcUI7UUFBckIsWUFBTyxHQUFQLE9BQU8sQ0FBYztJQUFHLENBQUM7SUFFcEUsc0JBQUksaUNBQU07YUFBVjtZQUNDLDRCQUFZLG1CQUFtQixFQUFLLElBQUksQ0FBQyxPQUFPLEVBQUc7UUFDcEQsQ0FBQzs7O09BQUE7SUFMVyxhQUFhO1FBRHpCLFVBQVUsRUFBRTtRQUVDLG1CQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTs7T0FEdEIsYUFBYSxDQU16QjtJQUFELG9CQUFDO0NBQUEsQUFORCxJQU1DO1NBTlksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTE9DQUxFX0NPTkZJRywgRGVmYXVsdExvY2FsZUNvbmZpZywgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi4vZGF0ZXJhbmdlcGlja2VyLmNvbmZpZyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcblx0Y29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExvY2FsZUNvbmZpZykge31cblxuXHRnZXQgY29uZmlnKCkge1xuXHRcdHJldHVybiB7IC4uLkRlZmF1bHRMb2NhbGVDb25maWcsIC4uLnRoaXMuX2NvbmZpZyB9O1xuXHR9XG59XG4iXX0=