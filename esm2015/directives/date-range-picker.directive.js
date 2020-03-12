import * as tslib_1 from "tslib";
var DateRangePickerDirective_1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNOLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxPQUFPLEVBQ1AsVUFBVSxFQUNWLGVBQWUsRUFDZixZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixRQUFRLEVBQ1IsS0FBSyxFQUNMLGNBQWMsRUFDZCxlQUFlLEVBQ2YsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFDbEMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHckYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTNELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQW9CdkIsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBbUlwQyxZQUNRLGNBQThCLEVBQzlCLGdCQUFrQyxFQUNsQyxRQUFrQixFQUNsQixrQkFBcUMsRUFDcEMseUJBQW1ELEVBQ25ELEdBQWUsRUFDZixTQUFvQixFQUNwQixPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQjtRQVR2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLHVCQUFrQixHQUFsQixrQkFBa0Is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eEI7SUFBUixLQUFLLEVBQUU7c0RBRVA7QUFLRDtJQURDLEtBQUssRUFBRTt5REFDNEI7QUFFM0I7SUFBUixLQUFLLEVBQUU7d0RBTVA7QUFDUTtJQUFSLEtBQUssRUFBRTtzREFNUDtBQWFpQjtJQUFqQixNQUFNLENBQUMsUUFBUSxDQUFDOzBEQUFxRDtBQUU5QztJQUF2QixNQUFNLENBQUMsY0FBYyxDQUFDOzhEQUF5RDtBQUV4RDtJQUF2QixNQUFNLENBQUMsY0FBYyxDQUFDOzhEQUF5RDtBQUN0RTtJQUFULE1BQU0sRUFBRTtrRUFBNkQ7QUFDNUQ7SUFBVCxNQUFNLEVBQUU7Z0VBQTJEO0FBa1BwRTtJQURDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzREQXFCMUM7QUF0WVcsd0JBQXdCO0lBbEJwQyxTQUFTLENBQUM7UUFDViw4Q0FBOEM7UUFDOUMsUUFBUSxFQUFFLHlCQUF5QjtRQUNuQyxxREFBcUQ7UUFDckQsSUFBSSxFQUFFO1lBQ0wsYUFBYSxFQUFFLFFBQVE7WUFDdkIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFFBQVE7WUFDbkIsU0FBUyxFQUFFLHNCQUFzQjtTQUNqQztRQUNELFNBQVMsRUFBRTtZQUNWO2dCQUNDLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQXdCLENBQUM7Z0JBQ3ZELEtBQUssRUFBRSxJQUFJO2FBQ1g7U0FDRDtLQUNELENBQUM7R0FDVyx3QkFBd0IsQ0F1WXBDO1NBdllZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFwcGxpY2F0aW9uUmVmLFxuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuXHREaXJlY3RpdmUsXG5cdERvQ2hlY2ssXG5cdEVsZW1lbnRSZWYsXG5cdEVtYmVkZGVkVmlld1JlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRIb3N0TGlzdGVuZXIsXG5cdEluamVjdG9yLFxuXHRJbnB1dCxcblx0S2V5VmFsdWVEaWZmZXIsXG5cdEtleVZhbHVlRGlmZmVycyxcblx0T25DaGFuZ2VzLFxuXHRPbkluaXQsXG5cdE91dHB1dCxcblx0UmVuZGVyZXIyLFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5jb25maWcnO1xuaW1wb3J0IHsgRGF0ZVJhbmdlUHJlc2V0IH0gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIubW9kZWxzJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XG5cbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG5cdHNlbGVjdG9yOiAnKltuZ3hEYXRlUmFuZ2VQaWNrZXJNZF0nLFxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuXHRob3N0OiB7XG5cdFx0JyhrZXl1cC5lc2MpJzogJ2hpZGUoKScsXG5cdFx0JyhibHVyKSc6ICdvbkJsdXIoKScsXG5cdFx0JyhjbGljayknOiAnb3BlbigpJyxcblx0XHQnKGtleXVwKSc6ICdpbnB1dENoYW5nZWQoJGV2ZW50KSdcblx0fSxcblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUmFuZ2VQaWNrZXJEaXJlY3RpdmUpLFxuXHRcdFx0bXVsdGk6IHRydWVcblx0XHR9XG5cdF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIERvQ2hlY2sge1xuXHRwdWJsaWMgcGlja2VyOiBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ7XG5cdHByaXZhdGUgX29uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRwcml2YXRlIF9vblRvdWNoZWQgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0cHJpdmF0ZSBfdmFsdWU6IGFueTtcblx0cHJpdmF0ZSBsb2NhbGVEaWZmZXI6IEtleVZhbHVlRGlmZmVyPHN0cmluZywgYW55Pjtcblx0QElucHV0KClcblx0bWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XG5cdEBJbnB1dCgpXG5cdG1heERhdGU6IF9tb21lbnQuTW9tZW50O1xuXHRASW5wdXQoKVxuXHRhdXRvQXBwbHk6IGJvb2xlYW47XG5cblx0QElucHV0KClcblx0dGFyZ2V0RWxlbWVudElkOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdHRvcEFkanVzdG1lbnQ6IG51bWJlcjtcblx0QElucHV0KClcblx0bGVmdEFkanVzdG1lbnQ6IG51bWJlcjtcblx0QElucHV0KClcblx0aXNGdWxsU2NyZWVuUGlja2VyOiBib29sZWFuO1xuXG5cdEBJbnB1dCgpXG5cdGFsd2F5c1Nob3dDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGJ1dHRvbkNsYXNzQXBwbHk6IHN0cmluZztcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSZXNldDogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRidXR0b25DbGFzc1JhbmdlOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcblx0QElucHV0KClcblx0c2luZ2xlRGF0ZVBpY2tlcjogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93SVNPV2Vla051bWJlcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dEcm9wZG93bnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGlzSW52YWxpZERhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRpc0N1c3RvbURhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRzaG93Q2xlYXJCdXR0b246IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGN1c3RvbVJhbmdlRGlyZWN0aW9uOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRyYW5nZXM6IERhdGVSYW5nZVByZXNldFtdO1xuXHRASW5wdXQoKVxuXHRvcGVuczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRkcm9wczogc3RyaW5nO1xuXHRmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0bGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0ZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0Zmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRrZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDYW5jZWw6IGJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0bG9ja1N0YXJ0RGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXHQvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0dGltZVBpY2tlckluY3JlbWVudDogbnVtYmVyID0gMTtcblx0QElucHV0KClcblx0dGltZVBpY2tlclNlY29uZHM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XG5cdF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuXHRASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XG5cdFx0dGhpcy5fbG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWUgfTtcblx0fVxuXHRnZXQgbG9jYWxlKCk6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsZTtcblx0fVxuXHRASW5wdXQoKVxuXHRwcml2YXRlIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcblx0cHJpdmF0ZSBfc3RhcnRLZXk6IHN0cmluZyA9ICdzdGFydERhdGUnO1xuXHRASW5wdXQoKSBzZXQgc3RhcnRLZXkodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IG51bGwpIHtcblx0XHRcdHRoaXMuX3N0YXJ0S2V5ID0gdmFsdWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3N0YXJ0S2V5ID0gJ3N0YXJ0RGF0ZSc7XG5cdFx0fVxuXHR9XG5cdEBJbnB1dCgpIHNldCBlbmRLZXkodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IG51bGwpIHtcblx0XHRcdHRoaXMuX2VuZEtleSA9IHZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9lbmRLZXkgPSAnZW5kRGF0ZSc7XG5cdFx0fVxuXHR9XG5cdG5vdEZvckNoYW5nZXNQcm9wZXJ0eTogQXJyYXk8c3RyaW5nPiA9IFsnbG9jYWxlJywgJ2VuZEtleScsICdzdGFydEtleSddO1xuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fdmFsdWUgfHwgbnVsbDtcblx0fVxuXHRzZXQgdmFsdWUodmFsKSB7XG5cdFx0dGhpcy5fdmFsdWUgPSB2YWw7XG5cdFx0dGhpcy5fb25DaGFuZ2UodmFsKTtcblx0XHR0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblx0fVxuXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4IG5vLW91dHB1dC1yZW5hbWVcblx0QE91dHB1dCgnY2hhbmdlJykgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdyYW5nZUNsaWNrZWQnKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdkYXRlc1VwZGF0ZWQnKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdCRldmVudDogYW55O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHB1YmxpYyBhcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXG5cdFx0cHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG5cdFx0cHVibGljIGluamVjdG9yOiBJbmplY3Rvcixcblx0XHRwdWJsaWMgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcblx0XHRwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcblx0XHRwcml2YXRlIF9lbDogRWxlbWVudFJlZixcblx0XHRwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuXHRcdHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuXHRcdHByaXZhdGUgX2xvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2UsXG5cdFx0cHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuXHQpIHtcblx0XHR0aGlzLmRyb3BzID0gJ2Rvd24nO1xuXHRcdHRoaXMub3BlbnMgPSAnYXV0byc7XG5cblx0XHRjb25zdCBhcHBsaWNhdGlvblJvb3QgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJypbbmctdmVyc2lvbl0nKSBhcyBIVE1MRWxlbWVudDtcblx0XHRjb25zdCBkYXRlUmFuZ2VQaWNrZXJFbGVtZW50ID0gYXBwbGljYXRpb25Sb290LnF1ZXJ5U2VsZWN0b3IoJ25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwnKTtcblx0XHRjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCk7XG5cdFx0Y29uc3QgY29tcG9uZW50UmVmID0gY29tcG9uZW50RmFjdG9yeS5jcmVhdGUoaW5qZWN0b3IpO1xuXHRcdHRoaXMuYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuXHRcdGNvbnN0IGNvbXBvbmVudEVsZW0gPSAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRpZiAoZGF0ZVJhbmdlUGlja2VyRWxlbWVudCAmJiBhcHBsaWNhdGlvblJvb3QuY29udGFpbnMoZGF0ZVJhbmdlUGlja2VyRWxlbWVudCkpIHtcblx0XHRcdGFwcGxpY2F0aW9uUm9vdC5yZW1vdmVDaGlsZChkYXRlUmFuZ2VQaWNrZXJFbGVtZW50KTtcblx0XHR9XG5cblx0XHRhcHBsaWNhdGlvblJvb3QuYXBwZW5kQ2hpbGQoY29tcG9uZW50RWxlbSk7XG5cblx0XHR0aGlzLnBpY2tlciA9IDxEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ+Y29tcG9uZW50UmVmLmluc3RhbmNlO1xuXHRcdHRoaXMucGlja2VyLmlubGluZSA9IGZhbHNlO1xuXHR9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5waWNrZXIuc3RhcnREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5lbmREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIucmFuZ2VDbGlja2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5yYW5nZUNsaWNrZWQuZW1pdChyYW5nZSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuZGF0ZXNVcGRhdGVkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5kYXRlc1VwZGF0ZWQuZW1pdChyYW5nZSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuY2hvb3NlZERhdGUuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0aWYgKGNoYW5nZSkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHt9O1xuXHRcdFx0XHR2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBjaGFuZ2Uuc3RhcnREYXRlO1xuXHRcdFx0XHR2YWx1ZVt0aGlzLl9lbmRLZXldID0gY2hhbmdlLmVuZERhdGU7XG5cdFx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy5vbkNoYW5nZS5lbWl0KHZhbHVlKTtcblx0XHRcdFx0aWYgKHR5cGVvZiBjaGFuZ2UuY2hvc2VuTGFiZWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IGNoYW5nZS5jaG9zZW5MYWJlbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmZpcnN0TW9udGhEYXlDbGFzcyA9IHRoaXMuZmlyc3RNb250aERheUNsYXNzO1xuXHRcdHRoaXMucGlja2VyLmxhc3RNb250aERheUNsYXNzID0gdGhpcy5sYXN0TW9udGhEYXlDbGFzcztcblx0XHR0aGlzLnBpY2tlci5lbXB0eVdlZWtSb3dDbGFzcyA9IHRoaXMuZW1wdHlXZWVrUm93Q2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZmlyc3REYXlPZk5leHRNb250aENsYXNzID0gdGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3M7XG5cdFx0dGhpcy5waWNrZXIubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzID0gdGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZHJvcHMgPSB0aGlzLmRyb3BzO1xuXHRcdHRoaXMucGlja2VyLm9wZW5zID0gdGhpcy5vcGVucztcblx0XHR0aGlzLmxvY2FsZURpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMubG9jYWxlKS5jcmVhdGUoKTtcblx0XHR0aGlzLnBpY2tlci5jbG9zZU9uQXV0b0FwcGx5ID0gdGhpcy5jbG9zZU9uQXV0b0FwcGx5O1xuXHRcdHRoaXMucGlja2VyLmlzRnVsbFNjcmVlblBpY2tlciA9IHRoaXMuaXNGdWxsU2NyZWVuUGlja2VyO1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuXHRcdGZvciAoY29uc3QgY2hhbmdlIGluIGNoYW5nZXMpIHtcblx0XHRcdGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcblx0XHRcdFx0aWYgKHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcblx0XHRcdFx0XHR0aGlzLnBpY2tlcltjaGFuZ2VdID0gY2hhbmdlc1tjaGFuZ2VdLmN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG5nRG9DaGVjaygpIHtcblx0XHRpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcblx0XHRcdGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxvY2FsZURpZmZlci5kaWZmKHRoaXMubG9jYWxlKTtcblx0XHRcdGlmIChjaGFuZ2VzKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0b25CbHVyKCkge1xuXHRcdHRoaXMuX29uVG91Y2hlZCgpO1xuXHR9XG5cblx0b3BlbihldmVudD86IGFueSkge1xuXHRcdHRoaXMucGlja2VyLnNob3coZXZlbnQpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5zZXRQb3NpdGlvbigpO1xuXHRcdH0pO1xuXHR9XG5cblx0aGlkZShlPykge1xuXHRcdHRoaXMucGlja2VyLmhpZGUoZSk7XG5cdH1cblx0dG9nZ2xlKGU/KSB7XG5cdFx0aWYgKHRoaXMucGlja2VyLmlzU2hvd24pIHtcblx0XHRcdHRoaXMuaGlkZShlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vcGVuKGUpO1xuXHRcdH1cblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdHRoaXMucGlja2VyLmNsZWFyKCk7XG5cdH1cblxuXHR3cml0ZVZhbHVlKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblx0cmVnaXN0ZXJPbkNoYW5nZShmbikge1xuXHRcdHRoaXMuX29uQ2hhbmdlID0gZm47XG5cdH1cblx0cmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcblx0XHR0aGlzLl9vblRvdWNoZWQgPSBmbjtcblx0fVxuXHRwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XG5cdFx0aWYgKHZhbCkge1xuXHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdGlmICh2YWxbdGhpcy5fc3RhcnRLZXldKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZSh2YWxbdGhpcy5fc3RhcnRLZXldKTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWxbdGhpcy5fZW5kS2V5XSkge1xuXHRcdFx0XHR0aGlzLnBpY2tlci5zZXRFbmREYXRlKHZhbFt0aGlzLl9lbmRLZXldKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucGlja2VyLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG5cdFx0XHRpZiAodGhpcy5waWNrZXIuY2hvc2VuTGFiZWwpIHtcblx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMucGlja2VyLmNob3NlbkxhYmVsO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBpY2tlci5jbGVhcigpO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxuXHQgKi9cblx0c2V0UG9zaXRpb24oKSB7XG5cdFx0bGV0IHN0eWxlO1xuXHRcdGxldCBjb250YWluZXJUb3A7XG5cdFx0dGhpcy50b3BBZGp1c3RtZW50ID0gdGhpcy50b3BBZGp1c3RtZW50ID8gK3RoaXMudG9wQWRqdXN0bWVudCA6IDA7XG5cdFx0dGhpcy5sZWZ0QWRqdXN0bWVudCA9IHRoaXMubGVmdEFkanVzdG1lbnQgPyArdGhpcy5sZWZ0QWRqdXN0bWVudCA6IDA7XG5cblx0XHQvLyB0b2RvOiByZXZpc2l0IHRoZSBvZmZzZXRzIHdoZXJlIHdoZW4gYm90aCB0aGUgc2hhcmVkIGNvbXBvbmVudHMgYXJlIGRvbmUgYW5kIHRoZSBvcmRlciBzZWFyY2ggcmV3b3JrIGlzIGZpbmlzaGVkXG5cdFx0Y29uc3QgY29udGFpbmVyID0gdGhpcy5waWNrZXIucGlja2VyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0bGV0IGVsZW1lbnQgPSB0aGlzLl9lbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudElkKSB7XG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRFbGVtZW50SWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0IGVsZW1lbnRMb2NhdGlvbiA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRpZiAodGhpcy5kcm9wcyAmJiB0aGlzLmRyb3BzID09PSAndXAnKSB7XG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50Lm9mZnNldFRvcCAtIGNvbnRhaW5lci5jbGllbnRIZWlnaHQgKyB0aGlzLnRvcEFkanVzdG1lbnQgKyAncHgnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50TG9jYXRpb24udG9wICsgdGhpcy50b3BBZGp1c3RtZW50ICsgJ3B4Jztcblx0XHR9XG5cdFx0aWYgKHRoaXMub3BlbnMgPT09ICdsZWZ0Jykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoKGVsZW1lbnRMb2NhdGlvbi5sZWZ0IC0gY29udGFpbmVyLmNsaWVudFdpZHRoICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC0gMTAwKSAgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAnY2VudGVyJykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDIpICArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdyaWdodCcpIHtcblx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0bGVmdDogKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBwb3NpdGlvbiA9IGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDI7XG5cblx0XHRcdGlmIChwb3NpdGlvbiA8IDApIHtcblx0XHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdFx0bGVmdDogKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRcdGxlZnQ6IChwb3NpdGlvbiArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmlzRnVsbFNjcmVlblBpY2tlciAmJiBzdHlsZSkge1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgc3R5bGUudG9wKTtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCBzdHlsZS5sZWZ0KTtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3JpZ2h0Jywgc3R5bGUucmlnaHQpO1xuXHRcdH1cblx0fVxuXHRpbnB1dENoYW5nZWQoZSkge1xuXHRcdGlmIChlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdpbnB1dCcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCFlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZGF0ZVN0cmluZyA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KHRoaXMucGlja2VyLmxvY2FsZS5zZXBhcmF0b3IpO1xuXHRcdGxldCBzdGFydCA9IG51bGwsXG5cdFx0XHRlbmQgPSBudWxsO1xuXHRcdGlmIChkYXRlU3RyaW5nLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0c3RhcnQgPSBtb21lbnQoZGF0ZVN0cmluZ1swXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0XHRlbmQgPSBtb21lbnQoZGF0ZVN0cmluZ1sxXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIgfHwgc3RhcnQgPT09IG51bGwgfHwgZW5kID09PSBudWxsKSB7XG5cdFx0XHRzdGFydCA9IG1vbWVudChlLnRhcmdldC52YWx1ZSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0XHRlbmQgPSBzdGFydDtcblx0XHR9XG5cdFx0aWYgKCFzdGFydC5pc1ZhbGlkKCkgfHwgIWVuZC5pc1ZhbGlkKCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHN0YXJ0KTtcblx0XHR0aGlzLnBpY2tlci5zZXRFbmREYXRlKGVuZCk7XG5cdFx0dGhpcy5waWNrZXIudXBkYXRlVmlldygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvciBjbGljayBvdXRzaWRlIG9mIHRoZSBjYWxlbmRhcidzIGNvbnRhaW5lclxuXHQgKiBAcGFyYW0gZXZlbnQgZXZlbnQgb2JqZWN0XG5cdCAqL1xuXHRASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycsIFsnJGV2ZW50J10pXG5cdG91dHNpZGVDbGljayhldmVudCk6IHZvaWQge1xuXHRcdGlmICghZXZlbnQudGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25neC1kYXRlcmFuZ2VwaWNrZXItYWN0aW9uJykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRFbGVtZW50SWQpO1xuXHRcdGlmICh0YXJnZXRFbGVtZW50ICYmIHRhcmdldEVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuXHRcdFx0dGhpcy5vcGVuKGV2ZW50KTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQhdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJlxuXHRcdFx0KGV2ZW50LnRhcmdldCBhcyBIVE1MU3BhbkVsZW1lbnQpLmNsYXNzTmFtZS5pbmRleE9mKCdtYXQtb3B0aW9uJykgPT09IC0xXG5cdFx0KSB7XG5cdFx0XHR0aGlzLmhpZGUoKTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==