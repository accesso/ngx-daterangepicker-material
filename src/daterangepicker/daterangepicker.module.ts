import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatCardModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule
} from '@angular/material';

import { DaterangepickerComponent } from './components/daterangepicker.component';
import { DaterangepickerDirective } from './directives/daterangepicker.directive';
import { LOCALE_CONFIG, LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './services/locale.service';

@NgModule({
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
export class NgxDaterangepickerMd {
	constructor() {}
	static forRoot(config: LocaleConfig = {}): ModuleWithProviders {
		return {
			ngModule: NgxDaterangepickerMd,
			providers: [
				{ provide: LOCALE_CONFIG, useValue: config },
				{ provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
			]
		};
	}
}
