import * as tslib_1 from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { DaterangepickerComponent } from './components/daterangepicker.component';
import { DaterangepickerDirective } from './directives/daterangepicker.directive';
import { LOCALE_CONFIG } from './daterangepicker.config';
import { LocaleService } from './services/locale.service';
var NgxDaterangepickerMd = /** @class */ (function () {
    function NgxDaterangepickerMd() {
    }
    NgxDaterangepickerMd_1 = NgxDaterangepickerMd;
    NgxDaterangepickerMd.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: NgxDaterangepickerMd_1,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
            ]
        };
    };
    var NgxDaterangepickerMd_1;
    NgxDaterangepickerMd = NgxDaterangepickerMd_1 = tslib_1.__decorate([
        NgModule({
            declarations: [DaterangepickerComponent, DaterangepickerDirective],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatDatepickerModule,
                MatIconModule
            ],
            providers: [],
            exports: [DaterangepickerComponent, DaterangepickerDirective],
            entryComponents: [DaterangepickerComponent]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], NgxDaterangepickerMd);
    return NgxDaterangepickerMd;
}());
export { NgxDaterangepickerMd };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFekcsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDaEYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDaEYsT0FBTyxFQUFDLGFBQWEsRUFBZSxNQUFNLDBCQUEwQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQWlCeEQ7SUFDQztJQUFlLENBQUM7NkJBREosb0JBQW9CO0lBRXpCLDRCQUFPLEdBQWQsVUFBZSxNQUF5QjtRQUF6Qix1QkFBQSxFQUFBLFdBQXlCO1FBQ3ZDLE9BQU87WUFDTixRQUFRLEVBQUUsc0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtnQkFDNUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUU7YUFDMUU7U0FDRCxDQUFDO0lBQ0gsQ0FBQzs7SUFWVyxvQkFBb0I7UUFmaEMsUUFBUSxDQUFDO1lBQ1QsWUFBWSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUM7WUFDbEUsT0FBTyxFQUFFO2dCQUNSLFlBQVk7Z0JBQ1osV0FBVztnQkFDWCxtQkFBbUI7Z0JBQ25CLGtCQUFrQjtnQkFDbEIsY0FBYztnQkFDZCxtQkFBbUI7Z0JBQ25CLGFBQWE7YUFDYjtZQUNELFNBQVMsRUFBRSxFQUFFO1lBQ2IsT0FBTyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUM7WUFDN0QsZUFBZSxFQUFFLENBQUMsd0JBQXdCLENBQUM7U0FDM0MsQ0FBQzs7T0FDVyxvQkFBb0IsQ0FXaEM7SUFBRCwyQkFBQztDQUFBLEFBWEQsSUFXQztTQVhZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJNb2R1bGUsIE1hdEZvcm1GaWVsZE1vZHVsZSwgTWF0SWNvbk1vZHVsZSwgTWF0SW5wdXRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHtEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7RGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlfSBmcm9tICcuL2RpcmVjdGl2ZXMvZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZSc7XG5pbXBvcnQge0xPQ0FMRV9DT05GSUcsIExvY2FsZUNvbmZpZ30gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcbmltcG9ydCB7TG9jYWxlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG5cdGRlY2xhcmF0aW9uczogW0RhdGVyYW5nZXBpY2tlckNvbXBvbmVudCwgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlXSxcblx0aW1wb3J0czogW1xuXHRcdENvbW1vbk1vZHVsZSxcblx0XHRGb3Jtc01vZHVsZSxcblx0XHRSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuXHRcdE1hdEZvcm1GaWVsZE1vZHVsZSxcblx0XHRNYXRJbnB1dE1vZHVsZSxcblx0XHRNYXREYXRlcGlja2VyTW9kdWxlLFxuXHRcdE1hdEljb25Nb2R1bGVcblx0XSxcblx0cHJvdmlkZXJzOiBbXSxcblx0ZXhwb3J0czogW0RhdGVyYW5nZXBpY2tlckNvbXBvbmVudCwgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlXSxcblx0ZW50cnlDb21wb25lbnRzOiBbRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hEYXRlcmFuZ2VwaWNrZXJNZCB7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0c3RhdGljIGZvclJvb3QoY29uZmlnOiBMb2NhbGVDb25maWcgPSB7fSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuXHRcdHJldHVybiB7XG5cdFx0XHRuZ01vZHVsZTogTmd4RGF0ZXJhbmdlcGlja2VyTWQsXG5cdFx0XHRwcm92aWRlcnM6IFtcblx0XHRcdFx0eyBwcm92aWRlOiBMT0NBTEVfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH0sXG5cdFx0XHRcdHsgcHJvdmlkZTogTG9jYWxlU2VydmljZSwgdXNlQ2xhc3M6IExvY2FsZVNlcnZpY2UsIGRlcHM6IFtMT0NBTEVfQ09ORklHXSB9XG5cdFx0XHRdXG5cdFx0fTtcblx0fVxufVxuIl19