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
import { MatDividerModule, MatSelectModule } from '@angular/material';
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
            MatCardModule,
            MatDividerModule,
            MatSelectModule
        ],
        providers: [],
        exports: [DaterangepickerComponent, DaterangepickerDirective],
        entryComponents: [DaterangepickerComponent]
    })
], NgxDaterangepickerMd);
export { NgxDaterangepickerMd };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFekQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGFBQWEsRUFBZ0IsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBcUJwRSxJQUFhLG9CQUFvQiw0QkFBakMsTUFBYSxvQkFBb0I7SUFDaEMsZ0JBQWUsQ0FBQztJQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQXVCLEVBQUU7UUFDdkMsT0FBTztZQUNOLFFBQVEsRUFBRSxzQkFBb0I7WUFDOUIsU0FBUyxFQUFFO2dCQUNWLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUM1QyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRTthQUMxRTtTQUNELENBQUM7SUFDSCxDQUFDO0NBQ0QsQ0FBQTtBQVhZLG9CQUFvQjtJQW5CaEMsUUFBUSxDQUFDO1FBQ1QsWUFBWSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUM7UUFDakUsT0FBTyxFQUFFO1lBQ1AsWUFBWTtZQUNaLFdBQVc7WUFDWCxtQkFBbUI7WUFDbkIsa0JBQWtCO1lBQ2xCLGNBQWM7WUFDZCxtQkFBbUI7WUFDbkIsYUFBYTtZQUNiLGVBQWU7WUFDZixhQUFhO1lBQ2IsZ0JBQWdCO1lBQ2hCLGVBQWU7U0FDaEI7UUFDRixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxDQUFDLHdCQUF3QixFQUFFLHdCQUF3QixDQUFDO1FBQzdELGVBQWUsRUFBRSxDQUFDLHdCQUF3QixDQUFDO0tBQzNDLENBQUM7R0FDVyxvQkFBb0IsQ0FXaEM7U0FYWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7IE1hdENhcmRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jYXJkJztcbmltcG9ydCB7IE1hdERhdGVwaWNrZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kYXRlcGlja2VyJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0SW5wdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5cbmltcG9ydCB7IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9kYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IExPQ0FMRV9DT05GSUcsIExvY2FsZUNvbmZpZyB9IGZyb20gJy4vZGF0ZXJhbmdlcGlja2VyLmNvbmZpZyc7XG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XG5pbXBvcnQge01hdERpdmlkZXJNb2R1bGUsIE1hdFNlbGVjdE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5ATmdNb2R1bGUoe1xuXHRkZWNsYXJhdGlvbnM6IFtEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQsIERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZV0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0SW5wdXRNb2R1bGUsXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLFxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICBNYXRDYXJkTW9kdWxlLFxuICAgIE1hdERpdmlkZXJNb2R1bGUsXG4gICAgTWF0U2VsZWN0TW9kdWxlXG4gIF0sXG5cdHByb3ZpZGVyczogW10sXG5cdGV4cG9ydHM6IFtEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQsIERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZV0sXG5cdGVudHJ5Q29tcG9uZW50czogW0RhdGVyYW5nZXBpY2tlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4RGF0ZXJhbmdlcGlja2VyTWQge1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdHN0YXRpYyBmb3JSb290KGNvbmZpZzogTG9jYWxlQ29uZmlnID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bmdNb2R1bGU6IE5neERhdGVyYW5nZXBpY2tlck1kLFxuXHRcdFx0cHJvdmlkZXJzOiBbXG5cdFx0XHRcdHsgcHJvdmlkZTogTE9DQUxFX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuXHRcdFx0XHR7IHByb3ZpZGU6IExvY2FsZVNlcnZpY2UsIHVzZUNsYXNzOiBMb2NhbGVTZXJ2aWNlLCBkZXBzOiBbTE9DQUxFX0NPTkZJR10gfVxuXHRcdFx0XVxuXHRcdH07XG5cdH1cbn1cbiJdfQ==