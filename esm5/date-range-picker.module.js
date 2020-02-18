import * as tslib_1 from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule, MatSelectModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DateRangePickerComponent } from './components/date-range-picker.component';
import { LOCALE_CONFIG } from './date-range-picker.config';
import { DateRangePickerDirective } from './directives/date-range-picker.directive';
import { LocaleService } from './services/locale.service';
var NgxDateRangePickerMd = /** @class */ (function () {
    function NgxDateRangePickerMd() {
    }
    NgxDateRangePickerMd_1 = NgxDateRangePickerMd;
    NgxDateRangePickerMd.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: NgxDateRangePickerMd_1,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
            ]
        };
    };
    var NgxDateRangePickerMd_1;
    NgxDateRangePickerMd = NgxDateRangePickerMd_1 = tslib_1.__decorate([
        NgModule({
            declarations: [DateRangePickerComponent, DateRangePickerDirective],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatDatepickerModule,
                MatIconModule,
                MatButtonModule,
                MatCardModule,
                MatDividerModule,
                MatSelectModule
            ],
            providers: [],
            exports: [DateRangePickerComponent, DateRangePickerDirective],
            entryComponents: [DateRangePickerComponent]
        })
    ], NgxDateRangePickerMd);
    return NgxDateRangePickerMd;
}());
export { NgxDateRangePickerMd };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRhdGUtcmFuZ2UtcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXpELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxhQUFhLEVBQWdCLE1BQU0sNEJBQTRCLENBQUM7QUFDekUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBcUIxRDtJQUNDO0lBQWUsQ0FBQzs2QkFESixvQkFBb0I7SUFFekIsNEJBQU8sR0FBZCxVQUFlLE1BQXlCO1FBQXpCLHVCQUFBLEVBQUEsV0FBeUI7UUFDdkMsT0FBTztZQUNOLFFBQVEsRUFBRSxzQkFBb0I7WUFDOUIsU0FBUyxFQUFFO2dCQUNWLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUM1QyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRTthQUMxRTtTQUNELENBQUM7SUFDSCxDQUFDOztJQVZXLG9CQUFvQjtRQW5CaEMsUUFBUSxDQUFDO1lBQ1QsWUFBWSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUM7WUFDbEUsT0FBTyxFQUFFO2dCQUNSLFlBQVk7Z0JBQ1osV0FBVztnQkFDWCxtQkFBbUI7Z0JBQ25CLGtCQUFrQjtnQkFDbEIsY0FBYztnQkFDZCxtQkFBbUI7Z0JBQ25CLGFBQWE7Z0JBQ2IsZUFBZTtnQkFDZixhQUFhO2dCQUNiLGdCQUFnQjtnQkFDaEIsZUFBZTthQUNmO1lBQ0QsU0FBUyxFQUFFLEVBQUU7WUFDYixPQUFPLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBQztZQUM3RCxlQUFlLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUMzQyxDQUFDO09BQ1csb0JBQW9CLENBV2hDO0lBQUQsMkJBQUM7Q0FBQSxBQVhELElBV0M7U0FYWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0RGl2aWRlck1vZHVsZSwgTWF0U2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7IE1hdENhcmRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jYXJkJztcbmltcG9ydCB7IE1hdERhdGVwaWNrZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kYXRlcGlja2VyJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0SW5wdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5cbmltcG9ydCB7IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kYXRlLXJhbmdlLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTE9DQUxFX0NPTkZJRywgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlLXJhbmdlLXBpY2tlci5jb25maWcnO1xuaW1wb3J0IHsgRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2RhdGUtcmFuZ2UtcGlja2VyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG5cdGRlY2xhcmF0aW9uczogW0RhdGVSYW5nZVBpY2tlckNvbXBvbmVudCwgRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlXSxcblx0aW1wb3J0czogW1xuXHRcdENvbW1vbk1vZHVsZSxcblx0XHRGb3Jtc01vZHVsZSxcblx0XHRSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuXHRcdE1hdEZvcm1GaWVsZE1vZHVsZSxcblx0XHRNYXRJbnB1dE1vZHVsZSxcblx0XHRNYXREYXRlcGlja2VyTW9kdWxlLFxuXHRcdE1hdEljb25Nb2R1bGUsXG5cdFx0TWF0QnV0dG9uTW9kdWxlLFxuXHRcdE1hdENhcmRNb2R1bGUsXG5cdFx0TWF0RGl2aWRlck1vZHVsZSxcblx0XHRNYXRTZWxlY3RNb2R1bGVcblx0XSxcblx0cHJvdmlkZXJzOiBbXSxcblx0ZXhwb3J0czogW0RhdGVSYW5nZVBpY2tlckNvbXBvbmVudCwgRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlXSxcblx0ZW50cnlDb21wb25lbnRzOiBbRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hEYXRlUmFuZ2VQaWNrZXJNZCB7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0c3RhdGljIGZvclJvb3QoY29uZmlnOiBMb2NhbGVDb25maWcgPSB7fSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuXHRcdHJldHVybiB7XG5cdFx0XHRuZ01vZHVsZTogTmd4RGF0ZVJhbmdlUGlja2VyTWQsXG5cdFx0XHRwcm92aWRlcnM6IFtcblx0XHRcdFx0eyBwcm92aWRlOiBMT0NBTEVfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH0sXG5cdFx0XHRcdHsgcHJvdmlkZTogTG9jYWxlU2VydmljZSwgdXNlQ2xhc3M6IExvY2FsZVNlcnZpY2UsIGRlcHM6IFtMT0NBTEVfQ09ORklHXSB9XG5cdFx0XHRdXG5cdFx0fTtcblx0fVxufVxuIl19