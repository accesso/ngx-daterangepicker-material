import * as tslib_1 from "tslib";
var DateRangePickerDirective_1;
import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, DoCheck, ElementRef, EmbeddedViewRef, EventEmitter, forwardRef, Host, HostListener, Injector, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { DateRangePickerComponent } from '../components/date-range-picker.component';
import { LocaleService } from '../services/locale.service';
const moment = _moment;
let DateRangePickerDirective = DateRangePickerDirective_1 = class DateRangePickerDirective {
    constructor(applicationRef, viewContainerRef, injector, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs, _localeService, elementRef) {
        this.applicationRef = applicationRef;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this._changeDetectorRef = _changeDetectorRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._el = _el;
        this._renderer = _renderer;
        this.differs = differs;
        this._localeService = _localeService;
        this.elementRef = elementRef;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._validatorChange = Function.prototype;
        this.dateLimit = null;
        this.showCancel = false;
        this.lockStartDate = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.closeOnAutoApply = true;
        this._locale = {};
        this._endKey = 'endDate';
        this._startKey = 'startDate';
        this.notForChangesProperty = ['locale', 'endKey', 'startKey'];
        // tslint:disable-next-line:no-output-on-prefix no-output-rename
        this.onChange = new EventEmitter();
        // tslint:disable-next-line:no-output-rename
        this.rangeClicked = new EventEmitter();
        // tslint:disable-next-line:no-output-rename
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
        this.drops = 'down';
        this.opens = 'auto';
        const applicationRoot = document.body.querySelector('*[ng-version]');
        const dateRangePickerElement = applicationRoot.querySelector('ngx-daterangepicker-material');
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(DateRangePickerComponent);
        const componentRef = componentFactory.create(injector);
        this.applicationRef.attachView(componentRef.hostView);
        const componentElem = componentRef.hostView.rootNodes[0];
        if (dateRangePickerElement) {
            applicationRoot.removeChild(dateRangePickerElement);
        }
        applicationRoot.appendChild(componentElem);
        this.picker = componentRef.instance;
        this.picker.inline = false;
    }
    set locale(value) {
        this._locale = Object.assign({}, this._localeService.config, value);
    }
    get locale() {
        return this._locale;
    }
    set startKey(value) {
        if (value !== null) {
            this._startKey = value;
        }
        else {
            this._startKey = 'startDate';
        }
    }
    set endKey(value) {
        if (value !== null) {
            this._endKey = value;
        }
        else {
            this._endKey = 'endDate';
        }
    }
    get value() {
        return this._value || null;
    }
    set value(val) {
        this._value = val;
        this._onChange(val);
        this._changeDetectorRef.markForCheck();
    }
    ngOnInit() {
        this.picker.startDateChanged.asObservable().subscribe((itemChanged) => {
            this.startDateChanged.emit(itemChanged);
        });
        this.picker.endDateChanged.asObservable().subscribe((itemChanged) => {
            this.endDateChanged.emit(itemChanged);
        });
        this.picker.rangeClicked.asObservable().subscribe((range) => {
            this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().subscribe((range) => {
            this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().subscribe((change) => {
            if (change) {
                const value = {};
                value[this._startKey] = change.startDate;
                value[this._endKey] = change.endDate;
                this.value = value;
                this.onChange.emit(value);
                if (typeof change.chosenLabel === 'string') {
                    this._el.nativeElement.value = change.chosenLabel;
                }
            }
        });
        this.picker.firstMonthDayClass = this.firstMonthDayClass;
        this.picker.lastMonthDayClass = this.lastMonthDayClass;
        this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
        this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.picker.drops = this.drops;
        this.picker.opens = this.opens;
        this.localeDiffer = this.differs.find(this.locale).create();
        this.picker.closeOnAutoApply = this.closeOnAutoApply;
    }
    ngOnChanges(changes) {
        for (const change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.notForChangesProperty.indexOf(change) === -1) {
                    this.picker[change] = changes[change].currentValue;
                }
            }
        }
    }
    ngDoCheck() {
        if (this.localeDiffer) {
            const changes = this.localeDiffer.diff(this.locale);
            if (changes) {
                this.picker.updateLocale(this.locale);
            }
        }
    }
    onBlur() {
        this._onTouched();
    }
    open(event) {
        this.picker.show(event);
        setTimeout(() => {
            this.setPosition();
        });
    }
    hide(e) {
        this.picker.hide(e);
    }
    toggle(e) {
        if (this.picker.isShown) {
            this.hide(e);
        }
        else {
            this.open(e);
        }
    }
    clear() {
        this.picker.clear();
    }
    writeValue(value) {
        this.setValue(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setValue(val) {
        if (val) {
            this.value = val;
            if (val[this._startKey]) {
                this.picker.setStartDate(val[this._startKey]);
            }
            if (val[this._endKey]) {
                this.picker.setEndDate(val[this._endKey]);
            }
            this.picker.calculateChosenLabel();
            if (this.picker.chosenLabel) {
                this._el.nativeElement.value = this.picker.chosenLabel;
            }
        }
        else {
            this.picker.clear();
        }
    }
    /**
     * Set position of the calendar
     */
    setPosition() {
        let style;
        let containerTop;
        this.topAdjustment = this.topAdjustment ? +this.topAdjustment : 0;
        this.leftAdjustment = this.leftAdjustment ? +this.leftAdjustment : 0;
        // todo: revisit the offsets where when both the shared components are done and the order search rework is finished
        const container = this.picker.pickerContainer.nativeElement;
        let element = this._el.nativeElement;
        if (this.targetElementId) {
            element = document.getElementById(this.targetElementId);
        }
        else {
            element = element.parentElement;
        }
        const elementLocation = element.getBoundingClientRect();
        if (this.drops && this.drops === 'up') {
            containerTop = element.offsetTop - container.clientHeight + this.topAdjustment + 'px';
        }
        else {
            containerTop = elementLocation.top + this.topAdjustment + 'px';
        }
        if (this.opens === 'left') {
            style = {
                top: containerTop,
                left: ((elementLocation.left - container.clientWidth + elementLocation.width - 100) + this.leftAdjustment) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'center') {
            style = {
                top: containerTop,
                left: ((elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2) + this.leftAdjustment) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'right') {
            style = {
                top: containerTop,
                left: (elementLocation.left + this.leftAdjustment) + 'px',
                right: 'auto'
            };
        }
        else {
            const position = elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2;
            if (position < 0) {
                style = {
                    top: containerTop,
                    left: (elementLocation.left + this.leftAdjustment) + 'px',
                    right: 'auto'
                };
            }
            else {
                style = {
                    top: containerTop,
                    left: (position + this.leftAdjustment) + 'px',
                    right: 'auto'
                };
            }
        }
        if (style /*&& !this.isMobile*/) {
            this._renderer.setStyle(container, 'top', style.top);
            this._renderer.setStyle(container, 'left', style.left);
            this._renderer.setStyle(container, 'right', style.right);
        }
    }
    inputChanged(e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }
        if (!e.target.value.length) {
            return;
        }
        const dateString = e.target.value.split(this.picker.locale.separator);
        let start = null, end = null;
        if (dateString.length === 2) {
            start = moment(dateString[0], this.picker.locale.format);
            end = moment(dateString[1], this.picker.locale.format);
        }
        if (this.singleDatePicker || start === null || end === null) {
            start = moment(e.target.value, this.picker.locale.format);
            end = start;
        }
        if (!start.isValid() || !end.isValid()) {
            return;
        }
        this.picker.setStartDate(start);
        this.picker.setEndDate(end);
        this.picker.updateView();
    }
    /**
     * For click outside of the calendar's container
     * @param event event object
     */
    outsideClick(event) {
        if (!event.target) {
            return;
        }
        if (event.target.classList.contains('ngx-daterangepicker-action')) {
            return;
        }
        const targetElement = document.getElementById(this.targetElementId);
        if (targetElement.contains(event.target)) {
            this.open(event);
        }
        if (!this.elementRef.nativeElement.contains(event.target) &&
            event.target.className.indexOf('mat-option') === -1) {
            this.hide();
        }
    }
};
DateRangePickerDirective.ctorParameters = () => [
    { type: ApplicationRef },
    { type: ViewContainerRef },
    { type: Injector },
    { type: ChangeDetectorRef },
    { type: ComponentFactoryResolver },
    { type: ElementRef },
    { type: Renderer2 },
    { type: KeyValueDiffers },
    { type: LocaleService },
    { type: ElementRef }
];
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "minDate", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "maxDate", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "autoApply", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "targetElementId", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "topAdjustment", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "leftAdjustment", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "alwaysShowCalendars", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "showCustomRangeLabel", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "linkedCalendars", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "buttonClassApply", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "buttonClassReset", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "buttonClassRange", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "dateLimit", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "singleDatePicker", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "showWeekNumbers", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "showISOWeekNumbers", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "showDropdowns", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "isInvalidDate", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "isCustomDate", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "showClearButton", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "customRangeDirection", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "ranges", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "opens", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "drops", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "lastMonthDayClass", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "emptyWeekRowClass", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "firstDayOfNextMonthClass", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "lastDayOfPreviousMonthClass", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "keepCalendarOpeningWithRange", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "showRangeLabelOnInput", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "showCancel", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "lockStartDate", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "timePicker", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "timePicker24Hour", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "timePickerIncrement", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "timePickerSeconds", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "closeOnAutoApply", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "locale", null);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "_endKey", void 0);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "startKey", null);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "endKey", null);
tslib_1.__decorate([
    Output('change')
], DateRangePickerDirective.prototype, "onChange", void 0);
tslib_1.__decorate([
    Output('rangeClicked')
], DateRangePickerDirective.prototype, "rangeClicked", void 0);
tslib_1.__decorate([
    Output('datesUpdated')
], DateRangePickerDirective.prototype, "datesUpdated", void 0);
tslib_1.__decorate([
    Output()
], DateRangePickerDirective.prototype, "startDateChanged", void 0);
tslib_1.__decorate([
    Output()
], DateRangePickerDirective.prototype, "endDateChanged", void 0);
tslib_1.__decorate([
    HostListener('document:click', ['$event'])
], DateRangePickerDirective.prototype, "outsideClick", null);
DateRangePickerDirective = DateRangePickerDirective_1 = tslib_1.__decorate([
    Directive({
        // tslint:disable-next-line:directive-selector
        selector: '*[ngxDateRangePickerMd]',
        // tslint:disable-next-line:no-host-metadata-property
        host: {
            '(keyup.esc)': 'hide()',
            '(blur)': 'onBlur()',
            '(click)': 'open()',
            '(keyup)': 'inputChanged($event)'
        },
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DateRangePickerDirective_1),
                multi: true
            }
        ]
    })
], DateRangePickerDirective);
export { DateRangePickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNOLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxPQUFPLEVBQ1AsVUFBVSxFQUNWLGVBQWUsRUFDZixZQUFZLEVBQ1osVUFBVSxFQUFFLElBQUksRUFDaEIsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUdyRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFM0QsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBb0J2QixJQUFhLHdCQUF3QixnQ0FBckMsTUFBYSx3QkFBd0I7SUFvSXBDLFlBQ1EsY0FBOEIsRUFDOUIsZ0JBQWtDLEVBQ2xDLFFBQWtCLEVBQ2xCLGtCQUFxQyxFQUNwQyx5QkFBbUQsRUFDbkQsR0FBZSxFQUNmLFNBQW9CLEVBQ3BCLE9BQXdCLEVBQ3hCLGNBQTZCLEVBQzdCLFVBQXNCO1FBVHZCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsdUJBQWtCLEdB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QXFEO0FBRTlDO0lBQXZCLE1BQU0sQ0FBQyxjQUFjLENBQUM7OERBQXlEO0FBRXhEO0lBQXZCLE1BQU0sQ0FBQyxjQUFjLENBQUM7OERBQXlEO0FBQ3RFO0lBQVQsTUFBTSxFQUFFO2tFQUE2RDtBQUM1RDtJQUFULE1BQU0sRUFBRTtnRUFBMkQ7QUFpUHBFO0lBREMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7NERBcUIxQztBQXRZVyx3QkFBd0I7SUFsQnBDLFNBQVMsQ0FBQztRQUNWLDhDQUE4QztRQUM5QyxRQUFRLEVBQUUseUJBQXlCO1FBQ25DLHFEQUFxRDtRQUNyRCxJQUFJLEVBQUU7WUFDTCxhQUFhLEVBQUUsUUFBUTtZQUN2QixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsUUFBUTtZQUNuQixTQUFTLEVBQUUsc0JBQXNCO1NBQ2pDO1FBQ0QsU0FBUyxFQUFFO1lBQ1Y7Z0JBQ0MsT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQywwQkFBd0IsQ0FBQztnQkFDdkQsS0FBSyxFQUFFLElBQUk7YUFDWDtTQUNEO0tBQ0QsQ0FBQztHQUNXLHdCQUF3QixDQXVZcEM7U0F2WVksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QXBwbGljYXRpb25SZWYsXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG5cdERpcmVjdGl2ZSxcblx0RG9DaGVjayxcblx0RWxlbWVudFJlZixcblx0RW1iZWRkZWRWaWV3UmVmLFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsIEhvc3QsXG5cdEhvc3RMaXN0ZW5lcixcblx0SW5qZWN0b3IsXG5cdElucHV0LFxuXHRLZXlWYWx1ZURpZmZlcixcblx0S2V5VmFsdWVEaWZmZXJzLFxuXHRPbkNoYW5nZXMsXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRSZW5kZXJlcjIsXG5cdFNpbXBsZUNoYW5nZXMsXG5cdFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIF9tb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IExvY2FsZUNvbmZpZyB9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyLmNvbmZpZyc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VQcmVzZXQgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5tb2RlbHMnO1xuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsZS5zZXJ2aWNlJztcblxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcblxuQERpcmVjdGl2ZSh7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3Jcblx0c2VsZWN0b3I6ICcqW25neERhdGVSYW5nZVBpY2tlck1kXScsXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LW1ldGFkYXRhLXByb3BlcnR5XG5cdGhvc3Q6IHtcblx0XHQnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcblx0XHQnKGJsdXIpJzogJ29uQmx1cigpJyxcblx0XHQnKGNsaWNrKSc6ICdvcGVuKCknLFxuXHRcdCcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xuXHR9LFxuXHRwcm92aWRlcnM6IFtcblx0XHR7XG5cdFx0XHRwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVSYW5nZVBpY2tlckRpcmVjdGl2ZSksXG5cdFx0XHRtdWx0aTogdHJ1ZVxuXHRcdH1cblx0XVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlUmFuZ2VQaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG5cdHB1YmxpYyBwaWNrZXI6IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudDtcblx0cHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0cHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRwcml2YXRlIF92YWx1ZTogYW55O1xuXHRwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuXHRASW5wdXQoKVxuXHRtaW5EYXRlOiBfbW9tZW50Lk1vbWVudDtcblx0QElucHV0KClcblx0bWF4RGF0ZTogX21vbWVudC5Nb21lbnQ7XG5cdEBJbnB1dCgpXG5cdGF1dG9BcHBseTogYm9vbGVhbjtcblxuXHQvLyBASW5wdXQoKVxuXHQvLyBpc01vYmlsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdEBJbnB1dCgpXG5cdHRhcmdldEVsZW1lbnRJZDogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHR0b3BBZGp1c3RtZW50OiBudW1iZXI7XG5cdEBJbnB1dCgpXG5cdGxlZnRBZGp1c3RtZW50OiBudW1iZXI7XG5cblx0QElucHV0KClcblx0YWx3YXlzU2hvd0NhbGVuZGFyczogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGxpbmtlZENhbGVuZGFyczogYm9vbGVhbjtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NBcHBseTogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRidXR0b25DbGFzc1Jlc2V0OiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGJ1dHRvbkNsYXNzUmFuZ2U6IHN0cmluZztcblx0QElucHV0KClcblx0ZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xuXHRASW5wdXQoKVxuXHRzaW5nbGVEYXRlUGlja2VyOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dJU09XZWVrTnVtYmVyczogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd0Ryb3Bkb3duczogYm9vbGVhbjtcblx0QElucHV0KClcblx0aXNJbnZhbGlkRGF0ZTogRnVuY3Rpb247XG5cdEBJbnB1dCgpXG5cdGlzQ3VzdG9tRGF0ZTogRnVuY3Rpb247XG5cdEBJbnB1dCgpXG5cdHNob3dDbGVhckJ1dHRvbjogYm9vbGVhbjtcblx0QElucHV0KClcblx0Y3VzdG9tUmFuZ2VEaXJlY3Rpb246IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHJhbmdlczogRGF0ZVJhbmdlUHJlc2V0W107XG5cdEBJbnB1dCgpXG5cdG9wZW5zOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGRyb3BzOiBzdHJpbmc7XG5cdGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0bGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dSYW5nZUxhYmVsT25JbnB1dDogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd0NhbmNlbDogYm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRsb2NrU3RhcnREYXRlOiBib29sZWFuID0gZmFsc2U7XG5cdC8vIHRpbWVwaWNrZXIgdmFyaWFibGVzXG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0dGltZVBpY2tlcjI0SG91cjogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VySW5jcmVtZW50OiBudW1iZXIgPSAxO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKSBjbG9zZU9uQXV0b0FwcGx5ID0gdHJ1ZTtcblx0X2xvY2FsZTogTG9jYWxlQ29uZmlnID0ge307XG5cdEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcblx0XHR0aGlzLl9sb2NhbGUgPSB7IC4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZSB9O1xuXHR9XG5cdGdldCBsb2NhbGUoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxlO1xuXHR9XG5cdEBJbnB1dCgpXG5cdHByaXZhdGUgX2VuZEtleTogc3RyaW5nID0gJ2VuZERhdGUnO1xuXHRwcml2YXRlIF9zdGFydEtleTogc3RyaW5nID0gJ3N0YXJ0RGF0ZSc7XG5cdEBJbnB1dCgpIHNldCBzdGFydEtleSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fc3RhcnRLZXkgPSB2YWx1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcblx0XHR9XG5cdH1cblx0QElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fZW5kS2V5ID0gdmFsdWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2VuZEtleSA9ICdlbmREYXRlJztcblx0XHR9XG5cdH1cblx0bm90Rm9yQ2hhbmdlc1Byb3BlcnR5OiBBcnJheTxzdHJpbmc+ID0gWydsb2NhbGUnLCAnZW5kS2V5JywgJ3N0YXJ0S2V5J107XG5cblx0Z2V0IHZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzLl92YWx1ZSB8fCBudWxsO1xuXHR9XG5cdHNldCB2YWx1ZSh2YWwpIHtcblx0XHR0aGlzLl92YWx1ZSA9IHZhbDtcblx0XHR0aGlzLl9vbkNoYW5nZSh2YWwpO1xuXHRcdHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXHR9XG5cblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXggbm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdjaGFuZ2UnKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtcmVuYW1lXG5cdEBPdXRwdXQoJ3JhbmdlQ2xpY2tlZCcpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtcmVuYW1lXG5cdEBPdXRwdXQoJ2RhdGVzVXBkYXRlZCcpIGRhdGVzVXBkYXRlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBzdGFydERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0QE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0JGV2ZW50OiBhbnk7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHVibGljIGFwcGxpY2F0aW9uUmVmOiBBcHBsaWNhdGlvblJlZixcblx0XHRwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcblx0XHRwdWJsaWMgaW5qZWN0b3I6IEluamVjdG9yLFxuXHRcdHB1YmxpYyBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuXHRcdHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuXHRcdHByaXZhdGUgX2VsOiBFbGVtZW50UmVmLFxuXHRcdHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG5cdFx0cHJpdmF0ZSBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXG5cdFx0cHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSxcblx0XHRwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG5cdCkge1xuXHRcdHRoaXMuZHJvcHMgPSAnZG93bic7XG5cdFx0dGhpcy5vcGVucyA9ICdhdXRvJztcblxuXHRcdGNvbnN0IGFwcGxpY2F0aW9uUm9vdCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignKltuZy12ZXJzaW9uXScpIGFzIEhUTUxFbGVtZW50O1xuXHRcdGNvbnN0IGRhdGVSYW5nZVBpY2tlckVsZW1lbnQgPSBhcHBsaWNhdGlvblJvb3QucXVlcnlTZWxlY3Rvcignbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbCcpO1xuXHRcdGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50KTtcblx0XHRjb25zdCBjb21wb25lbnRSZWYgPSBjb21wb25lbnRGYWN0b3J5LmNyZWF0ZShpbmplY3Rvcik7XG5cdFx0dGhpcy5hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG5cdFx0Y29uc3QgY29tcG9uZW50RWxlbSA9IChjb21wb25lbnRSZWYuaG9zdFZpZXcgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXSBhcyBIVE1MRWxlbWVudDtcblxuXHRcdGlmIChkYXRlUmFuZ2VQaWNrZXJFbGVtZW50KSB7XG5cdFx0XHRhcHBsaWNhdGlvblJvb3QucmVtb3ZlQ2hpbGQoZGF0ZVJhbmdlUGlja2VyRWxlbWVudCk7XG5cdFx0fVxuXG5cdFx0YXBwbGljYXRpb25Sb290LmFwcGVuZENoaWxkKGNvbXBvbmVudEVsZW0pO1xuXG5cdFx0dGhpcy5waWNrZXIgPSA8RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50PmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcblx0XHR0aGlzLnBpY2tlci5pbmxpbmUgPSBmYWxzZTtcblx0fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMucGlja2VyLnN0YXJ0RGF0ZUNoYW5nZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChpdGVtQ2hhbmdlZDogYW55KSA9PiB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuZW5kRGF0ZUNoYW5nZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChpdGVtQ2hhbmdlZDogYW55KSA9PiB7XG5cdFx0XHR0aGlzLmVuZERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLnJhbmdlQ2xpY2tlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcblx0XHRcdHRoaXMucmFuZ2VDbGlja2VkLmVtaXQocmFuZ2UpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmRhdGVzVXBkYXRlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQocmFuZ2UpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmNob29zZWREYXRlLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoY2hhbmdlOiBhbnkpID0+IHtcblx0XHRcdGlmIChjaGFuZ2UpIHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSB7fTtcblx0XHRcdFx0dmFsdWVbdGhpcy5fc3RhcnRLZXldID0gY2hhbmdlLnN0YXJ0RGF0ZTtcblx0XHRcdFx0dmFsdWVbdGhpcy5fZW5kS2V5XSA9IGNoYW5nZS5lbmREYXRlO1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMub25DaGFuZ2UuZW1pdCh2YWx1ZSk7XG5cdFx0XHRcdGlmICh0eXBlb2YgY2hhbmdlLmNob3NlbkxhYmVsID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaGFuZ2UuY2hvc2VuTGFiZWw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5maXJzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmZpcnN0TW9udGhEYXlDbGFzcztcblx0XHR0aGlzLnBpY2tlci5sYXN0TW9udGhEYXlDbGFzcyA9IHRoaXMubGFzdE1vbnRoRGF5Q2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZW1wdHlXZWVrUm93Q2xhc3MgPSB0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzO1xuXHRcdHRoaXMucGlja2VyLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyA9IHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzO1xuXHRcdHRoaXMucGlja2VyLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyA9IHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzO1xuXHRcdHRoaXMucGlja2VyLmRyb3BzID0gdGhpcy5kcm9wcztcblx0XHR0aGlzLnBpY2tlci5vcGVucyA9IHRoaXMub3BlbnM7XG5cdFx0dGhpcy5sb2NhbGVEaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmxvY2FsZSkuY3JlYXRlKCk7XG5cdFx0dGhpcy5waWNrZXIuY2xvc2VPbkF1dG9BcHBseSA9IHRoaXMuY2xvc2VPbkF1dG9BcHBseTtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcblx0XHRmb3IgKGNvbnN0IGNoYW5nZSBpbiBjaGFuZ2VzKSB7XG5cdFx0XHRpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShjaGFuZ2UpKSB7XG5cdFx0XHRcdGlmICh0aGlzLm5vdEZvckNoYW5nZXNQcm9wZXJ0eS5pbmRleE9mKGNoYW5nZSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0dGhpcy5waWNrZXJbY2hhbmdlXSA9IGNoYW5nZXNbY2hhbmdlXS5jdXJyZW50VmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRuZ0RvQ2hlY2soKSB7XG5cdFx0aWYgKHRoaXMubG9jYWxlRGlmZmVyKSB7XG5cdFx0XHRjb25zdCBjaGFuZ2VzID0gdGhpcy5sb2NhbGVEaWZmZXIuZGlmZih0aGlzLmxvY2FsZSk7XG5cdFx0XHRpZiAoY2hhbmdlcykge1xuXHRcdFx0XHR0aGlzLnBpY2tlci51cGRhdGVMb2NhbGUodGhpcy5sb2NhbGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG9uQmx1cigpIHtcblx0XHR0aGlzLl9vblRvdWNoZWQoKTtcblx0fVxuXG5cdG9wZW4oZXZlbnQ/OiBhbnkpIHtcblx0XHR0aGlzLnBpY2tlci5zaG93KGV2ZW50KTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuc2V0UG9zaXRpb24oKTtcblx0XHR9KTtcblx0fVxuXG5cdGhpZGUoZT8pIHtcblx0XHR0aGlzLnBpY2tlci5oaWRlKGUpO1xuXHR9XG5cdHRvZ2dsZShlPykge1xuXHRcdGlmICh0aGlzLnBpY2tlci5pc1Nob3duKSB7XG5cdFx0XHR0aGlzLmhpZGUoZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3BlbihlKTtcblx0XHR9XG5cdH1cblxuXHRjbGVhcigpIHtcblx0XHR0aGlzLnBpY2tlci5jbGVhcigpO1xuXHR9XG5cblx0d3JpdGVWYWx1ZSh2YWx1ZSkge1xuXHRcdHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cdHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcblx0XHR0aGlzLl9vbkNoYW5nZSA9IGZuO1xuXHR9XG5cdHJlZ2lzdGVyT25Ub3VjaGVkKGZuKSB7XG5cdFx0dGhpcy5fb25Ub3VjaGVkID0gZm47XG5cdH1cblx0cHJpdmF0ZSBzZXRWYWx1ZSh2YWw6IGFueSkge1xuXHRcdGlmICh2YWwpIHtcblx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRpZiAodmFsW3RoaXMuX3N0YXJ0S2V5XSkge1xuXHRcdFx0XHR0aGlzLnBpY2tlci5zZXRTdGFydERhdGUodmFsW3RoaXMuX3N0YXJ0S2V5XSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsW3RoaXMuX2VuZEtleV0pIHtcblx0XHRcdFx0dGhpcy5waWNrZXIuc2V0RW5kRGF0ZSh2YWxbdGhpcy5fZW5kS2V5XSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnBpY2tlci5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuXHRcdFx0aWYgKHRoaXMucGlja2VyLmNob3NlbkxhYmVsKSB7XG5cdFx0XHRcdHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLnBpY2tlci5jaG9zZW5MYWJlbDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5waWNrZXIuY2xlYXIoKTtcblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIFNldCBwb3NpdGlvbiBvZiB0aGUgY2FsZW5kYXJcblx0ICovXG5cdHNldFBvc2l0aW9uKCkge1xuXHRcdGxldCBzdHlsZTtcblx0XHRsZXQgY29udGFpbmVyVG9wO1xuXHRcdHRoaXMudG9wQWRqdXN0bWVudCA9IHRoaXMudG9wQWRqdXN0bWVudCA/ICt0aGlzLnRvcEFkanVzdG1lbnQgOiAwO1xuXHRcdHRoaXMubGVmdEFkanVzdG1lbnQgPSB0aGlzLmxlZnRBZGp1c3RtZW50ID8gK3RoaXMubGVmdEFkanVzdG1lbnQgOiAwO1xuXG5cdFx0Ly8gdG9kbzogcmV2aXNpdCB0aGUgb2Zmc2V0cyB3aGVyZSB3aGVuIGJvdGggdGhlIHNoYXJlZCBjb21wb25lbnRzIGFyZSBkb25lIGFuZCB0aGUgb3JkZXIgc2VhcmNoIHJld29yayBpcyBmaW5pc2hlZFxuXHRcdGNvbnN0IGNvbnRhaW5lciA9IHRoaXMucGlja2VyLnBpY2tlckNvbnRhaW5lci5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXHRcdGxldCBlbGVtZW50ID0gdGhpcy5fZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdGlmICh0aGlzLnRhcmdldEVsZW1lbnRJZCkge1xuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0RWxlbWVudElkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHR9XG5cblx0XHRjb25zdCBlbGVtZW50TG9jYXRpb24gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0aWYgKHRoaXMuZHJvcHMgJiYgdGhpcy5kcm9wcyA9PT0gJ3VwJykge1xuXHRcdFx0Y29udGFpbmVyVG9wID0gZWxlbWVudC5vZmZzZXRUb3AgLSBjb250YWluZXIuY2xpZW50SGVpZ2h0ICsgdGhpcy50b3BBZGp1c3RtZW50ICsgJ3B4Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyVG9wID0gZWxlbWVudExvY2F0aW9uLnRvcCArIHRoaXMudG9wQWRqdXN0bWVudCArICdweCc7XG5cdFx0fVxuXHRcdGlmICh0aGlzLm9wZW5zID09PSAnbGVmdCcpIHtcblx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0bGVmdDogKChlbGVtZW50TG9jYXRpb24ubGVmdCAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAtIDEwMCkgICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ2NlbnRlcicpIHtcblx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0bGVmdDogKChlbGVtZW50TG9jYXRpb24ubGVmdCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAvIDIgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyKSAgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAncmlnaHQnKSB7XG5cdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdGxlZnQ6IChlbGVtZW50TG9jYXRpb24ubGVmdCArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcG9zaXRpb24gPSBlbGVtZW50TG9jYXRpb24ubGVmdCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAvIDIgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyO1xuXG5cdFx0XHRpZiAocG9zaXRpb24gPCAwKSB7XG5cdFx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRcdGxlZnQ6IChlbGVtZW50TG9jYXRpb24ubGVmdCArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0XHRsZWZ0OiAocG9zaXRpb24gKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzdHlsZSAvKiYmICF0aGlzLmlzTW9iaWxlKi8pIHtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHN0eWxlLnRvcCk7XG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdsZWZ0Jywgc3R5bGUubGVmdCk7XG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdyaWdodCcsIHN0eWxlLnJpZ2h0KTtcblx0XHR9XG5cdH1cblx0aW5wdXRDaGFuZ2VkKGUpIHtcblx0XHRpZiAoZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnaW5wdXQnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICghZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGRhdGVTdHJpbmcgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCh0aGlzLnBpY2tlci5sb2NhbGUuc2VwYXJhdG9yKTtcblx0XHRsZXQgc3RhcnQgPSBudWxsLFxuXHRcdFx0ZW5kID0gbnVsbDtcblx0XHRpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDIpIHtcblx0XHRcdHN0YXJ0ID0gbW9tZW50KGRhdGVTdHJpbmdbMF0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuXHRcdFx0ZW5kID0gbW9tZW50KGRhdGVTdHJpbmdbMV0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyIHx8IHN0YXJ0ID09PSBudWxsIHx8IGVuZCA9PT0gbnVsbCkge1xuXHRcdFx0c3RhcnQgPSBtb21lbnQoZS50YXJnZXQudmFsdWUsIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuXHRcdFx0ZW5kID0gc3RhcnQ7XG5cdFx0fVxuXHRcdGlmICghc3RhcnQuaXNWYWxpZCgpIHx8ICFlbmQuaXNWYWxpZCgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZShzdGFydCk7XG5cdFx0dGhpcy5waWNrZXIuc2V0RW5kRGF0ZShlbmQpO1xuXHRcdHRoaXMucGlja2VyLnVwZGF0ZVZpZXcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3IgY2xpY2sgb3V0c2lkZSBvZiB0aGUgY2FsZW5kYXIncyBjb250YWluZXJcblx0ICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxuXHQgKi9cblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxuXHRvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIWV2ZW50LnRhcmdldCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZ3gtZGF0ZXJhbmdlcGlja2VyLWFjdGlvbicpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0RWxlbWVudElkKTtcblx0XHRpZiAodGFyZ2V0RWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG5cdFx0XHR0aGlzLm9wZW4oZXZlbnQpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCF0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpICYmXG5cdFx0XHQoZXZlbnQudGFyZ2V0IGFzIEhUTUxTcGFuRWxlbWVudCkuY2xhc3NOYW1lLmluZGV4T2YoJ21hdC1vcHRpb24nKSA9PT0gLTFcblx0XHQpIHtcblx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdH1cblx0fVxufVxuIl19