var NgxDaterangepickerMd_1;
import * as tslib_1 from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DaterangepickerComponent } from './components/daterangepicker.component';
import { DaterangepickerDirective } from './directives/daterangepicker.directive';
import { LOCALE_CONFIG } from './daterangepicker.config';
import { LocaleService } from './services/locale.service';
let NgxDaterangepickerMd = NgxDaterangepickerMd_1 = class NgxDaterangepickerMd {
    constructor() { }
    static forRoot(config = {}) {
        return {
            ngModule: NgxDaterangepickerMd_1,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
            ]
        };
    }
};
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
            MatIconModule,
            MatButtonModule,
            MatCardModule
        ],
        providers: [],
        exports: [DaterangepickerComponent, DaterangepickerDirective],
        entryComponents: [DaterangepickerComponent]
    })
], NgxDaterangepickerMd);
export { NgxDaterangepickerMd };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFekQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGFBQWEsRUFBZ0IsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFtQjFELElBQWEsb0JBQW9CLDRCQUFqQyxNQUFhLG9CQUFvQjtJQUNoQyxnQkFBZSxDQUFDO0lBQ2hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBdUIsRUFBRTtRQUN2QyxPQUFPO1lBQ04sUUFBUSxFQUFFLHNCQUFvQjtZQUM5QixTQUFTLEVBQUU7Z0JBQ1YsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7Z0JBQzVDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2FBQzFFO1NBQ0QsQ0FBQztJQUNILENBQUM7Q0FDRCxDQUFBO0FBWFksb0JBQW9CO0lBakJoQyxRQUFRLENBQUM7UUFDVCxZQUFZLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBQztRQUNsRSxPQUFPLEVBQUU7WUFDUixZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtZQUNuQixrQkFBa0I7WUFDbEIsY0FBYztZQUNkLG1CQUFtQjtZQUNuQixhQUFhO1lBQ2IsZUFBZTtZQUNmLGFBQWE7U0FDYjtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUM7UUFDN0QsZUFBZSxFQUFFLENBQUMsd0JBQXdCLENBQUM7S0FDM0MsQ0FBQztHQUNXLG9CQUFvQixDQVdoQztTQVhZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHsgTWF0Q2FyZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NhcmQnO1xuaW1wb3J0IHsgTWF0RGF0ZXBpY2tlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RhdGVwaWNrZXInO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQgeyBNYXRJY29uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XG5pbXBvcnQgeyBNYXRJbnB1dE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0JztcblxuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RhdGVyYW5nZXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2RhdGVyYW5nZXBpY2tlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTE9DQUxFX0NPTkZJRywgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2xvY2FsZS5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcblx0ZGVjbGFyYXRpb25zOiBbRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50LCBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmVdLFxuXHRpbXBvcnRzOiBbXG5cdFx0Q29tbW9uTW9kdWxlLFxuXHRcdEZvcm1zTW9kdWxlLFxuXHRcdFJlYWN0aXZlRm9ybXNNb2R1bGUsXG5cdFx0TWF0Rm9ybUZpZWxkTW9kdWxlLFxuXHRcdE1hdElucHV0TW9kdWxlLFxuXHRcdE1hdERhdGVwaWNrZXJNb2R1bGUsXG5cdFx0TWF0SWNvbk1vZHVsZSxcblx0XHRNYXRCdXR0b25Nb2R1bGUsXG5cdFx0TWF0Q2FyZE1vZHVsZVxuXHRdLFxuXHRwcm92aWRlcnM6IFtdLFxuXHRleHBvcnRzOiBbRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50LCBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmVdLFxuXHRlbnRyeUNvbXBvbmVudHM6IFtEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neERhdGVyYW5nZXBpY2tlck1kIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRzdGF0aWMgZm9yUm9vdChjb25maWc6IExvY2FsZUNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5nTW9kdWxlOiBOZ3hEYXRlcmFuZ2VwaWNrZXJNZCxcblx0XHRcdHByb3ZpZGVyczogW1xuXHRcdFx0XHR7IHByb3ZpZGU6IExPQ0FMRV9DT05GSUcsIHVzZVZhbHVlOiBjb25maWcgfSxcblx0XHRcdFx0eyBwcm92aWRlOiBMb2NhbGVTZXJ2aWNlLCB1c2VDbGFzczogTG9jYWxlU2VydmljZSwgZGVwczogW0xPQ0FMRV9DT05GSUddIH1cblx0XHRcdF1cblx0XHR9O1xuXHR9XG59XG4iXX0=