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
    LocaleService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_CONFIG,] }] }
    ]; };
    LocaleService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(LOCALE_CONFIG))
    ], LocaleService);
    return LocaleService;
}());
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsLyIsInNvdXJjZXMiOlsic2VydmljZXMvbG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sMkJBQTJCLENBQUM7QUFHN0Y7SUFDQyx1QkFBMkMsT0FBcUI7UUFBckIsWUFBTyxHQUFQLE9BQU8sQ0FBYztJQUFHLENBQUM7SUFFcEUsc0JBQUksaUNBQU07YUFBVjtZQUNDLDRCQUFZLG1CQUFtQixFQUFLLElBQUksQ0FBQyxPQUFPLEVBQUc7UUFDcEQsQ0FBQzs7O09BQUE7O2dEQUpZLE1BQU0sU0FBQyxhQUFhOztJQURyQixhQUFhO1FBRHpCLFVBQVUsRUFBRTtRQUVDLG1CQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTtPQUR0QixhQUFhLENBTXpCO0lBQUQsb0JBQUM7Q0FBQSxBQU5ELElBTUM7U0FOWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMT0NBTEVfQ09ORklHLCBEZWZhdWx0TG9jYWxlQ29uZmlnLCBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2FsZVNlcnZpY2Uge1xuXHRjb25zdHJ1Y3RvcihASW5qZWN0KExPQ0FMRV9DT05GSUcpIHByaXZhdGUgX2NvbmZpZzogTG9jYWxlQ29uZmlnKSB7fVxuXG5cdGdldCBjb25maWcoKSB7XG5cdFx0cmV0dXJuIHsgLi4uRGVmYXVsdExvY2FsZUNvbmZpZywgLi4udGhpcy5fY29uZmlnIH07XG5cdH1cbn1cbiJdfQ==