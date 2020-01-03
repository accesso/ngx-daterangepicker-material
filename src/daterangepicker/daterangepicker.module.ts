import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DaterangepickerComponent } from './components/daterangepicker.component';
import { DaterangepickerDirective } from './directives/daterangepicker.directive';
import { LOCALE_CONFIG, LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './services/locale.service';
import { MatDividerModule, MatSelectModule } from '@angular/material';

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
		MatCardModule,
		MatDividerModule,
		MatSelectModule
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
