import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DateRangePickerComponent } from './components/date-range-picker.component';
import { LOCALE_CONFIG, LocaleConfig } from './date-range-picker.config';
import { DateRangePickerDirective } from './directives/date-range-picker.directive';
import { LocaleService } from './services/locale.service';

@NgModule({
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
export class NgxDateRangePickerMd {
	constructor() {}
	static forRoot(config: LocaleConfig = {}): ModuleWithProviders<NgxDateRangePickerMd> {
		return {
			ngModule: NgxDateRangePickerMd,
			providers: [
				{ provide: LOCALE_CONFIG, useValue: config },
				{ provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
			]
		};
	}
}
