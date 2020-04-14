var DateRangePickerDirective_1;
import * as tslib_1 from "tslib";
import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, DoCheck, ElementRef, EmbeddedViewRef, EventEmitter, forwardRef, HostListener, Injector, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
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
        this.scrollPos = 0;
        this.drops = 'down';
        this.opens = 'auto';
        const applicationRoot = document.body.querySelector('*[ng-version]');
        const dateRangePickerElement = applicationRoot.querySelector('ngx-daterangepicker-material');
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(DateRangePickerComponent);
        const componentRef = componentFactory.create(injector);
        this.applicationRef.attachView(componentRef.hostView);
        const componentElem = componentRef.hostView.rootNodes[0];
        if (dateRangePickerElement && applicationRoot.contains(dateRangePickerElement)) {
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
        this.picker.isFullScreenPicker = this.isFullScreenPicker;
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
        if (!this.isFullScreenPicker && style) {
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
        if (targetElement && targetElement.contains(event.target)) {
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
], DateRangePickerDirective.prototype, "locale", null);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "startKey", null);
tslib_1.__decorate([
    Input()
], DateRangePickerDirective.prototype, "endKey", null);
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
], DateRangePickerDirective.prototype, "isFullScreenPicker", void 0);
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
], DateRangePickerDirective.prototype, "_endKey", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNOLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxPQUFPLEVBQ1AsVUFBVSxFQUNWLGVBQWUsRUFDZixZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixRQUFRLEVBQ1IsS0FBSyxFQUNMLGNBQWMsRUFDZCxlQUFlLEVBQ2YsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFDbEMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHckYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTNELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQW9CdkIsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBK0JwQyxZQUNRLGNBQThCLEVBQzlCLGdCQUFrQyxFQUNsQyxRQUFrQixFQUNsQixrQkFBcUMsRUFDcEMseUJBQW1ELEVBQ25ELEdBQWUsRUFDZixTQUFvQixFQUNwQixPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQjtRQVR2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLHVCQUFrQixHQUFsQixrQkFBa0Is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LEtBQUssRUFBRTtrRUFDMEI7QUFFbEM7SUFEQyxLQUFLLEVBQUU7cUVBQ3dCO0FBRWhDO0lBREMsS0FBSyxFQUFFO21FQUMyQjtBQUMxQjtJQUFSLEtBQUssRUFBRTtrRUFBeUI7QUFHakM7SUFEQyxLQUFLLEVBQUU7eURBQzRCO0FBS2xCO0lBQWpCLE1BQU0sQ0FBQyxRQUFRLENBQUM7MERBQXFEO0FBRTlDO0lBQXZCLE1BQU0sQ0FBQyxjQUFjLENBQUM7OERBQXlEO0FBRXhEO0lBQXZCLE1BQU0sQ0FBQyxjQUFjLENBQUM7OERBQXlEO0FBQ3RFO0lBQVQsTUFBTSxFQUFFO2tFQUE2RDtBQUM1RDtJQUFULE1BQU0sRUFBRTtnRUFBMkQ7QUFvTnBFO0lBREMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7NERBcUIxQztBQXhZVyx3QkFBd0I7SUFsQnBDLFNBQVMsQ0FBQztRQUNWLDhDQUE4QztRQUM5QyxRQUFRLEVBQUUseUJBQXlCO1FBQ25DLHFEQUFxRDtRQUNyRCxJQUFJLEVBQUU7WUFDTCxhQUFhLEVBQUUsUUFBUTtZQUN2QixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsUUFBUTtZQUNuQixTQUFTLEVBQUUsc0JBQXNCO1NBQ2pDO1FBQ0QsU0FBUyxFQUFFO1lBQ1Y7Z0JBQ0MsT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQywwQkFBd0IsQ0FBQztnQkFDdkQsS0FBSyxFQUFFLElBQUk7YUFDWDtTQUNEO0tBQ0QsQ0FBQztHQUNXLHdCQUF3QixDQXlZcEM7U0F6WVksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QXBwbGljYXRpb25SZWYsXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG5cdERpcmVjdGl2ZSxcblx0RG9DaGVjayxcblx0RWxlbWVudFJlZixcblx0RW1iZWRkZWRWaWV3UmVmLFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEhvc3RMaXN0ZW5lcixcblx0SW5qZWN0b3IsXG5cdElucHV0LFxuXHRLZXlWYWx1ZURpZmZlcixcblx0S2V5VmFsdWVEaWZmZXJzLFxuXHRPbkNoYW5nZXMsXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRSZW5kZXJlcjIsXG5cdFNpbXBsZUNoYW5nZXMsXG5cdFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIF9tb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IExvY2FsZUNvbmZpZyB9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyLmNvbmZpZyc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VQcmVzZXQgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5tb2RlbHMnO1xuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsZS5zZXJ2aWNlJztcblxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcblxuQERpcmVjdGl2ZSh7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3Jcblx0c2VsZWN0b3I6ICcqW25neERhdGVSYW5nZVBpY2tlck1kXScsXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LW1ldGFkYXRhLXByb3BlcnR5XG5cdGhvc3Q6IHtcblx0XHQnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcblx0XHQnKGJsdXIpJzogJ29uQmx1cigpJyxcblx0XHQnKGNsaWNrKSc6ICdvcGVuKCknLFxuXHRcdCcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xuXHR9LFxuXHRwcm92aWRlcnM6IFtcblx0XHR7XG5cdFx0XHRwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVSYW5nZVBpY2tlckRpcmVjdGl2ZSksXG5cdFx0XHRtdWx0aTogdHJ1ZVxuXHRcdH1cblx0XVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlUmFuZ2VQaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG5cdEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcblx0XHR0aGlzLl9sb2NhbGUgPSB7IC4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZSB9O1xuXHR9XG5cdGdldCBsb2NhbGUoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxlO1xuXHR9XG5cdEBJbnB1dCgpIHNldCBzdGFydEtleSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fc3RhcnRLZXkgPSB2YWx1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcblx0XHR9XG5cdH1cblx0QElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fZW5kS2V5ID0gdmFsdWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2VuZEtleSA9ICdlbmREYXRlJztcblx0XHR9XG5cdH1cblxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlIHx8IG51bGw7XG5cdH1cblx0c2V0IHZhbHVlKHZhbCkge1xuXHRcdHRoaXMuX3ZhbHVlID0gdmFsO1xuXHRcdHRoaXMuX29uQ2hhbmdlKHZhbCk7XG5cdFx0dGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwdWJsaWMgYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLFxuXHRcdHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuXHRcdHB1YmxpYyBpbmplY3RvcjogSW5qZWN0b3IsXG5cdFx0cHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG5cdFx0cHJpdmF0ZSBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG5cdFx0cHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWYsXG5cdFx0cHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcblx0XHRwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcblx0XHRwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlLFxuXHRcdHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcblx0KSB7XG5cdFx0dGhpcy5kcm9wcyA9ICdkb3duJztcblx0XHR0aGlzLm9wZW5zID0gJ2F1dG8nO1xuXG5cdFx0Y29uc3QgYXBwbGljYXRpb25Sb290ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcqW25nLXZlcnNpb25dJykgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0Y29uc3QgZGF0ZVJhbmdlUGlja2VyRWxlbWVudCA9IGFwcGxpY2F0aW9uUm9vdC5xdWVyeVNlbGVjdG9yKCduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJyk7XG5cdFx0Y29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQpO1xuXHRcdGNvbnN0IGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKGluamVjdG9yKTtcblx0XHR0aGlzLmFwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcblx0XHRjb25zdCBjb21wb25lbnRFbGVtID0gKGNvbXBvbmVudFJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdIGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0aWYgKGRhdGVSYW5nZVBpY2tlckVsZW1lbnQgJiYgYXBwbGljYXRpb25Sb290LmNvbnRhaW5zKGRhdGVSYW5nZVBpY2tlckVsZW1lbnQpKSB7XG5cdFx0XHRhcHBsaWNhdGlvblJvb3QucmVtb3ZlQ2hpbGQoZGF0ZVJhbmdlUGlja2VyRWxlbWVudCk7XG5cdFx0fVxuXG5cdFx0YXBwbGljYXRpb25Sb290LmFwcGVuZENoaWxkKGNvbXBvbmVudEVsZW0pO1xuXG5cdFx0dGhpcy5waWNrZXIgPSA8RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50PmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcblx0XHR0aGlzLnBpY2tlci5pbmxpbmUgPSBmYWxzZTtcblx0fVxuXHRwdWJsaWMgcGlja2VyOiBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ7XG5cdHByaXZhdGUgX29uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRwcml2YXRlIF9vblRvdWNoZWQgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0cHJpdmF0ZSBfdmFsdWU6IGFueTtcblx0cHJpdmF0ZSBsb2NhbGVEaWZmZXI6IEtleVZhbHVlRGlmZmVyPHN0cmluZywgYW55Pjtcblx0QElucHV0KClcblx0bWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XG5cdEBJbnB1dCgpXG5cdG1heERhdGU6IF9tb21lbnQuTW9tZW50O1xuXHRASW5wdXQoKVxuXHRhdXRvQXBwbHk6IGJvb2xlYW47XG5cblx0QElucHV0KClcblx0dGFyZ2V0RWxlbWVudElkOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdHRvcEFkanVzdG1lbnQ6IG51bWJlcjtcblx0QElucHV0KClcblx0bGVmdEFkanVzdG1lbnQ6IG51bWJlcjtcblx0QElucHV0KClcblx0aXNGdWxsU2NyZWVuUGlja2VyOiBib29sZWFuO1xuXG5cdEBJbnB1dCgpXG5cdGFsd2F5c1Nob3dDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGJ1dHRvbkNsYXNzQXBwbHk6IHN0cmluZztcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSZXNldDogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRidXR0b25DbGFzc1JhbmdlOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcblx0QElucHV0KClcblx0c2luZ2xlRGF0ZVBpY2tlcjogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93SVNPV2Vla051bWJlcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dEcm9wZG93bnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGlzSW52YWxpZERhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRpc0N1c3RvbURhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRzaG93Q2xlYXJCdXR0b246IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGN1c3RvbVJhbmdlRGlyZWN0aW9uOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRyYW5nZXM6IERhdGVSYW5nZVByZXNldFtdO1xuXHRASW5wdXQoKVxuXHRvcGVuczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRkcm9wczogc3RyaW5nO1xuXHRmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0bGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0ZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0Zmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRrZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDYW5jZWw6IGJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0bG9ja1N0YXJ0RGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXHQvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0dGltZVBpY2tlckluY3JlbWVudDogbnVtYmVyID0gMTtcblx0QElucHV0KClcblx0dGltZVBpY2tlclNlY29uZHM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XG5cdF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuXHRASW5wdXQoKVxuXHRwcml2YXRlIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcblx0cHJpdmF0ZSBfc3RhcnRLZXk6IHN0cmluZyA9ICdzdGFydERhdGUnO1xuXHRub3RGb3JDaGFuZ2VzUHJvcGVydHk6IEFycmF5PHN0cmluZz4gPSBbJ2xvY2FsZScsICdlbmRLZXknLCAnc3RhcnRLZXknXTtcblxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeCBuby1vdXRwdXQtcmVuYW1lXG5cdEBPdXRwdXQoJ2NoYW5nZScpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1yZW5hbWVcblx0QE91dHB1dCgncmFuZ2VDbGlja2VkJykgcmFuZ2VDbGlja2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1yZW5hbWVcblx0QE91dHB1dCgnZGF0ZXNVcGRhdGVkJykgZGF0ZXNVcGRhdGVkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0QE91dHB1dCgpIHN0YXJ0RGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgZW5kRGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQkZXZlbnQ6IGFueTtcblxuXHRzY3JvbGxQb3MgPSAwO1xuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMucGlja2VyLnN0YXJ0RGF0ZUNoYW5nZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChpdGVtQ2hhbmdlZDogYW55KSA9PiB7XG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuZW5kRGF0ZUNoYW5nZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChpdGVtQ2hhbmdlZDogYW55KSA9PiB7XG5cdFx0XHR0aGlzLmVuZERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLnJhbmdlQ2xpY2tlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcblx0XHRcdHRoaXMucmFuZ2VDbGlja2VkLmVtaXQocmFuZ2UpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmRhdGVzVXBkYXRlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQocmFuZ2UpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmNob29zZWREYXRlLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoY2hhbmdlOiBhbnkpID0+IHtcblx0XHRcdGlmIChjaGFuZ2UpIHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSB7fTtcblx0XHRcdFx0dmFsdWVbdGhpcy5fc3RhcnRLZXldID0gY2hhbmdlLnN0YXJ0RGF0ZTtcblx0XHRcdFx0dmFsdWVbdGhpcy5fZW5kS2V5XSA9IGNoYW5nZS5lbmREYXRlO1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMub25DaGFuZ2UuZW1pdCh2YWx1ZSk7XG5cdFx0XHRcdGlmICh0eXBlb2YgY2hhbmdlLmNob3NlbkxhYmVsID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaGFuZ2UuY2hvc2VuTGFiZWw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5maXJzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmZpcnN0TW9udGhEYXlDbGFzcztcblx0XHR0aGlzLnBpY2tlci5sYXN0TW9udGhEYXlDbGFzcyA9IHRoaXMubGFzdE1vbnRoRGF5Q2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZW1wdHlXZWVrUm93Q2xhc3MgPSB0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzO1xuXHRcdHRoaXMucGlja2VyLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyA9IHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzO1xuXHRcdHRoaXMucGlja2VyLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyA9IHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzO1xuXHRcdHRoaXMucGlja2VyLmRyb3BzID0gdGhpcy5kcm9wcztcblx0XHR0aGlzLnBpY2tlci5vcGVucyA9IHRoaXMub3BlbnM7XG5cdFx0dGhpcy5sb2NhbGVEaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmxvY2FsZSkuY3JlYXRlKCk7XG5cdFx0dGhpcy5waWNrZXIuY2xvc2VPbkF1dG9BcHBseSA9IHRoaXMuY2xvc2VPbkF1dG9BcHBseTtcblx0XHR0aGlzLnBpY2tlci5pc0Z1bGxTY3JlZW5QaWNrZXIgPSB0aGlzLmlzRnVsbFNjcmVlblBpY2tlcjtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcblx0XHRmb3IgKGNvbnN0IGNoYW5nZSBpbiBjaGFuZ2VzKSB7XG5cdFx0XHRpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShjaGFuZ2UpKSB7XG5cdFx0XHRcdGlmICh0aGlzLm5vdEZvckNoYW5nZXNQcm9wZXJ0eS5pbmRleE9mKGNoYW5nZSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0dGhpcy5waWNrZXJbY2hhbmdlXSA9IGNoYW5nZXNbY2hhbmdlXS5jdXJyZW50VmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRuZ0RvQ2hlY2soKSB7XG5cdFx0aWYgKHRoaXMubG9jYWxlRGlmZmVyKSB7XG5cdFx0XHRjb25zdCBjaGFuZ2VzID0gdGhpcy5sb2NhbGVEaWZmZXIuZGlmZih0aGlzLmxvY2FsZSk7XG5cdFx0XHRpZiAoY2hhbmdlcykge1xuXHRcdFx0XHR0aGlzLnBpY2tlci51cGRhdGVMb2NhbGUodGhpcy5sb2NhbGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG9uQmx1cigpIHtcblx0XHR0aGlzLl9vblRvdWNoZWQoKTtcblx0fVxuXG5cdG9wZW4oZXZlbnQ/OiBhbnkpIHtcblx0XHR0aGlzLnBpY2tlci5zaG93KGV2ZW50KTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuc2V0UG9zaXRpb24oKTtcblx0XHR9KTtcblx0fVxuXG5cdGhpZGUoZT8pIHtcblx0XHR0aGlzLnBpY2tlci5oaWRlKGUpO1xuXHR9XG5cdHRvZ2dsZShlPykge1xuXHRcdGlmICh0aGlzLnBpY2tlci5pc1Nob3duKSB7XG5cdFx0XHR0aGlzLmhpZGUoZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3BlbihlKTtcblx0XHR9XG5cdH1cblxuXHRjbGVhcigpIHtcblx0XHR0aGlzLnBpY2tlci5jbGVhcigpO1xuXHR9XG5cblx0d3JpdGVWYWx1ZSh2YWx1ZSkge1xuXHRcdHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cdHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcblx0XHR0aGlzLl9vbkNoYW5nZSA9IGZuO1xuXHR9XG5cdHJlZ2lzdGVyT25Ub3VjaGVkKGZuKSB7XG5cdFx0dGhpcy5fb25Ub3VjaGVkID0gZm47XG5cdH1cblx0cHJpdmF0ZSBzZXRWYWx1ZSh2YWw6IGFueSkge1xuXHRcdGlmICh2YWwpIHtcblx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHRpZiAodmFsW3RoaXMuX3N0YXJ0S2V5XSkge1xuXHRcdFx0XHR0aGlzLnBpY2tlci5zZXRTdGFydERhdGUodmFsW3RoaXMuX3N0YXJ0S2V5XSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsW3RoaXMuX2VuZEtleV0pIHtcblx0XHRcdFx0dGhpcy5waWNrZXIuc2V0RW5kRGF0ZSh2YWxbdGhpcy5fZW5kS2V5XSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnBpY2tlci5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuXHRcdFx0aWYgKHRoaXMucGlja2VyLmNob3NlbkxhYmVsKSB7XG5cdFx0XHRcdHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLnBpY2tlci5jaG9zZW5MYWJlbDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5waWNrZXIuY2xlYXIoKTtcblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIFNldCBwb3NpdGlvbiBvZiB0aGUgY2FsZW5kYXJcblx0ICovXG5cdHNldFBvc2l0aW9uKCkge1xuXHRcdGxldCBzdHlsZTtcblx0XHRsZXQgY29udGFpbmVyVG9wO1xuXHRcdHRoaXMudG9wQWRqdXN0bWVudCA9IHRoaXMudG9wQWRqdXN0bWVudCA/ICt0aGlzLnRvcEFkanVzdG1lbnQgOiAwO1xuXHRcdHRoaXMubGVmdEFkanVzdG1lbnQgPSB0aGlzLmxlZnRBZGp1c3RtZW50ID8gK3RoaXMubGVmdEFkanVzdG1lbnQgOiAwO1xuXG5cdFx0Ly8gdG9kbzogcmV2aXNpdCB0aGUgb2Zmc2V0cyB3aGVyZSB3aGVuIGJvdGggdGhlIHNoYXJlZCBjb21wb25lbnRzIGFyZSBkb25lIGFuZCB0aGUgb3JkZXIgc2VhcmNoIHJld29yayBpcyBmaW5pc2hlZFxuXHRcdGNvbnN0IGNvbnRhaW5lciA9IHRoaXMucGlja2VyLnBpY2tlckNvbnRhaW5lci5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXHRcdGxldCBlbGVtZW50ID0gdGhpcy5fZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdGlmICh0aGlzLnRhcmdldEVsZW1lbnRJZCkge1xuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0RWxlbWVudElkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHR9XG5cblx0XHRjb25zdCBlbGVtZW50TG9jYXRpb24gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0aWYgKHRoaXMuZHJvcHMgJiYgdGhpcy5kcm9wcyA9PT0gJ3VwJykge1xuXHRcdFx0Y29udGFpbmVyVG9wID0gZWxlbWVudC5vZmZzZXRUb3AgLSBjb250YWluZXIuY2xpZW50SGVpZ2h0ICsgdGhpcy50b3BBZGp1c3RtZW50ICsgJ3B4Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyVG9wID0gZWxlbWVudExvY2F0aW9uLnRvcCArIHRoaXMudG9wQWRqdXN0bWVudCArICdweCc7XG5cdFx0fVxuXHRcdGlmICh0aGlzLm9wZW5zID09PSAnbGVmdCcpIHtcblx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0bGVmdDogKChlbGVtZW50TG9jYXRpb24ubGVmdCAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAtIDEwMCkgICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ2NlbnRlcicpIHtcblx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0bGVmdDogKChlbGVtZW50TG9jYXRpb24ubGVmdCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAvIDIgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyKSAgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAncmlnaHQnKSB7XG5cdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdGxlZnQ6IChlbGVtZW50TG9jYXRpb24ubGVmdCArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcG9zaXRpb24gPSBlbGVtZW50TG9jYXRpb24ubGVmdCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAvIDIgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyO1xuXG5cdFx0XHRpZiAocG9zaXRpb24gPCAwKSB7XG5cdFx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRcdGxlZnQ6IChlbGVtZW50TG9jYXRpb24ubGVmdCArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0XHRsZWZ0OiAocG9zaXRpb24gKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5pc0Z1bGxTY3JlZW5QaWNrZXIgJiYgc3R5bGUpIHtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHN0eWxlLnRvcCk7XG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdsZWZ0Jywgc3R5bGUubGVmdCk7XG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdyaWdodCcsIHN0eWxlLnJpZ2h0KTtcblx0XHR9XG5cdH1cblx0aW5wdXRDaGFuZ2VkKGUpIHtcblx0XHRpZiAoZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnaW5wdXQnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICghZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGRhdGVTdHJpbmcgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCh0aGlzLnBpY2tlci5sb2NhbGUuc2VwYXJhdG9yKTtcblx0XHRsZXQgc3RhcnQgPSBudWxsLFxuXHRcdFx0ZW5kID0gbnVsbDtcblx0XHRpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDIpIHtcblx0XHRcdHN0YXJ0ID0gbW9tZW50KGRhdGVTdHJpbmdbMF0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuXHRcdFx0ZW5kID0gbW9tZW50KGRhdGVTdHJpbmdbMV0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyIHx8IHN0YXJ0ID09PSBudWxsIHx8IGVuZCA9PT0gbnVsbCkge1xuXHRcdFx0c3RhcnQgPSBtb21lbnQoZS50YXJnZXQudmFsdWUsIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuXHRcdFx0ZW5kID0gc3RhcnQ7XG5cdFx0fVxuXHRcdGlmICghc3RhcnQuaXNWYWxpZCgpIHx8ICFlbmQuaXNWYWxpZCgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZShzdGFydCk7XG5cdFx0dGhpcy5waWNrZXIuc2V0RW5kRGF0ZShlbmQpO1xuXHRcdHRoaXMucGlja2VyLnVwZGF0ZVZpZXcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3IgY2xpY2sgb3V0c2lkZSBvZiB0aGUgY2FsZW5kYXIncyBjb250YWluZXJcblx0ICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxuXHQgKi9cblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxuXHRvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIWV2ZW50LnRhcmdldCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZ3gtZGF0ZXJhbmdlcGlja2VyLWFjdGlvbicpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0RWxlbWVudElkKTtcblx0XHRpZiAodGFyZ2V0RWxlbWVudCAmJiB0YXJnZXRFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcblx0XHRcdHRoaXMub3BlbihldmVudCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0IXRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiZcblx0XHRcdChldmVudC50YXJnZXQgYXMgSFRNTFNwYW5FbGVtZW50KS5jbGFzc05hbWUuaW5kZXhPZignbWF0LW9wdGlvbicpID09PSAtMVxuXHRcdCkge1xuXHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=