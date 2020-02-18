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
        console.log('trying to open');
        this.picker.show(event);
        setTimeout(() => {
            console.log('set position');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNOLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxPQUFPLEVBQ1AsVUFBVSxFQUNWLGVBQWUsRUFDZixZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixRQUFRLEVBQ1IsS0FBSyxFQUNMLGNBQWMsRUFDZCxlQUFlLEVBQ2YsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFDbEMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTNELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQW9CdkIsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBb0lwQyxZQUNRLGNBQThCLEVBQzlCLGdCQUFrQyxFQUNsQyxRQUFrQixFQUNsQixrQkFBcUMsRUFDcEMseUJBQW1ELEVBQ25ELEdBQWUsRUFDZixTQUFvQixFQUNwQixPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQjtRQVR2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLHVCQUFrQixHQUFsQixrQkFBa0Is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QU0sRUFBRTtrRUFBNkQ7QUFDNUQ7SUFBVCxNQUFNLEVBQUU7Z0VBQTJEO0FBaVBwRTtJQURDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzREQWdCMUM7QUFqWVcsd0JBQXdCO0lBbEJwQyxTQUFTLENBQUM7UUFDViw4Q0FBOEM7UUFDOUMsUUFBUSxFQUFFLHlCQUF5QjtRQUNuQyxxREFBcUQ7UUFDckQsSUFBSSxFQUFFO1lBQ0wsYUFBYSxFQUFFLFFBQVE7WUFDdkIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFFBQVE7WUFDbkIsU0FBUyxFQUFFLHNCQUFzQjtTQUNqQztRQUNELFNBQVMsRUFBRTtZQUNWO2dCQUNDLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQXdCLENBQUM7Z0JBQ3ZELEtBQUssRUFBRSxJQUFJO2FBQ1g7U0FDRDtLQUNELENBQUM7R0FDVyx3QkFBd0IsQ0FrWXBDO1NBbFlZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFwcGxpY2F0aW9uUmVmLFxuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuXHREaXJlY3RpdmUsXG5cdERvQ2hlY2ssXG5cdEVsZW1lbnRSZWYsXG5cdEVtYmVkZGVkVmlld1JlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRIb3N0TGlzdGVuZXIsXG5cdEluamVjdG9yLFxuXHRJbnB1dCxcblx0S2V5VmFsdWVEaWZmZXIsXG5cdEtleVZhbHVlRGlmZmVycyxcblx0T25DaGFuZ2VzLFxuXHRPbkluaXQsXG5cdE91dHB1dCxcblx0UmVuZGVyZXIyLFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VQcmVzZXQgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5tb2RlbHMnO1xuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9kYXRlLXJhbmdlLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XG5cbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG5cdHNlbGVjdG9yOiAnKltuZ3hEYXRlUmFuZ2VQaWNrZXJNZF0nLFxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuXHRob3N0OiB7XG5cdFx0JyhrZXl1cC5lc2MpJzogJ2hpZGUoKScsXG5cdFx0JyhibHVyKSc6ICdvbkJsdXIoKScsXG5cdFx0JyhjbGljayknOiAnb3BlbigpJyxcblx0XHQnKGtleXVwKSc6ICdpbnB1dENoYW5nZWQoJGV2ZW50KSdcblx0fSxcblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUmFuZ2VQaWNrZXJEaXJlY3RpdmUpLFxuXHRcdFx0bXVsdGk6IHRydWVcblx0XHR9XG5cdF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIERvQ2hlY2sge1xuXHRwdWJsaWMgcGlja2VyOiBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ7XG5cdHByaXZhdGUgX29uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRwcml2YXRlIF9vblRvdWNoZWQgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0cHJpdmF0ZSBfdmFsdWU6IGFueTtcblx0cHJpdmF0ZSBsb2NhbGVEaWZmZXI6IEtleVZhbHVlRGlmZmVyPHN0cmluZywgYW55Pjtcblx0QElucHV0KClcblx0bWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XG5cdEBJbnB1dCgpXG5cdG1heERhdGU6IF9tb21lbnQuTW9tZW50O1xuXHRASW5wdXQoKVxuXHRhdXRvQXBwbHk6IGJvb2xlYW47XG5cblx0Ly8gQElucHV0KClcblx0Ly8gaXNNb2JpbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRASW5wdXQoKVxuXHR0YXJnZXRFbGVtZW50SWQ6IHN0cmluZztcblx0QElucHV0KClcblx0dG9wQWRqdXN0bWVudDogbnVtYmVyO1xuXHRASW5wdXQoKVxuXHRsZWZ0QWRqdXN0bWVudDogbnVtYmVyO1xuXG5cdEBJbnB1dCgpXG5cdGFsd2F5c1Nob3dDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGJ1dHRvbkNsYXNzQXBwbHk6IHN0cmluZztcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSZXNldDogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRidXR0b25DbGFzc1JhbmdlOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcblx0QElucHV0KClcblx0c2luZ2xlRGF0ZVBpY2tlcjogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93SVNPV2Vla051bWJlcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dEcm9wZG93bnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGlzSW52YWxpZERhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRpc0N1c3RvbURhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRzaG93Q2xlYXJCdXR0b246IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGN1c3RvbVJhbmdlRGlyZWN0aW9uOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRyYW5nZXM6IERhdGVSYW5nZVByZXNldFtdO1xuXHRASW5wdXQoKVxuXHRvcGVuczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRkcm9wczogc3RyaW5nO1xuXHRmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0bGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0ZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0Zmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRrZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDYW5jZWw6IGJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0bG9ja1N0YXJ0RGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXHQvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0dGltZVBpY2tlckluY3JlbWVudDogbnVtYmVyID0gMTtcblx0QElucHV0KClcblx0dGltZVBpY2tlclNlY29uZHM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XG5cdF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuXHRASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XG5cdFx0dGhpcy5fbG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWUgfTtcblx0fVxuXHRnZXQgbG9jYWxlKCk6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsZTtcblx0fVxuXHRASW5wdXQoKVxuXHRwcml2YXRlIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcblx0cHJpdmF0ZSBfc3RhcnRLZXk6IHN0cmluZyA9ICdzdGFydERhdGUnO1xuXHRASW5wdXQoKSBzZXQgc3RhcnRLZXkodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IG51bGwpIHtcblx0XHRcdHRoaXMuX3N0YXJ0S2V5ID0gdmFsdWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3N0YXJ0S2V5ID0gJ3N0YXJ0RGF0ZSc7XG5cdFx0fVxuXHR9XG5cdEBJbnB1dCgpIHNldCBlbmRLZXkodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IG51bGwpIHtcblx0XHRcdHRoaXMuX2VuZEtleSA9IHZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9lbmRLZXkgPSAnZW5kRGF0ZSc7XG5cdFx0fVxuXHR9XG5cdG5vdEZvckNoYW5nZXNQcm9wZXJ0eTogQXJyYXk8c3RyaW5nPiA9IFsnbG9jYWxlJywgJ2VuZEtleScsICdzdGFydEtleSddO1xuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fdmFsdWUgfHwgbnVsbDtcblx0fVxuXHRzZXQgdmFsdWUodmFsKSB7XG5cdFx0dGhpcy5fdmFsdWUgPSB2YWw7XG5cdFx0dGhpcy5fb25DaGFuZ2UodmFsKTtcblx0XHR0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblx0fVxuXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4IG5vLW91dHB1dC1yZW5hbWVcblx0QE91dHB1dCgnY2hhbmdlJykgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdyYW5nZUNsaWNrZWQnKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdkYXRlc1VwZGF0ZWQnKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdCRldmVudDogYW55O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHB1YmxpYyBhcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXG5cdFx0cHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG5cdFx0cHVibGljIGluamVjdG9yOiBJbmplY3Rvcixcblx0XHRwdWJsaWMgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcblx0XHRwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcblx0XHRwcml2YXRlIF9lbDogRWxlbWVudFJlZixcblx0XHRwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuXHRcdHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuXHRcdHByaXZhdGUgX2xvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2UsXG5cdFx0cHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmXG5cdCkge1xuXHRcdHRoaXMuZHJvcHMgPSAnZG93bic7XG5cdFx0dGhpcy5vcGVucyA9ICdhdXRvJztcblx0XHRjb25zdCBhcHBsaWNhdGlvblJvb3QgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJypbbmctdmVyc2lvbl0nKSBhcyBIVE1MRWxlbWVudDtcblx0XHRjb25zdCBkYXRlUmFuZ2VQaWNrZXJFbGVtZW50ID0gYXBwbGljYXRpb25Sb290LnF1ZXJ5U2VsZWN0b3IoJ25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwnKTtcblx0XHRjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCk7XG5cdFx0Y29uc3QgY29tcG9uZW50UmVmID0gY29tcG9uZW50RmFjdG9yeS5jcmVhdGUoaW5qZWN0b3IpO1xuXHRcdHRoaXMuYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuXHRcdGNvbnN0IGNvbXBvbmVudEVsZW0gPSAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRpZiAoZGF0ZVJhbmdlUGlja2VyRWxlbWVudCkge1xuXHRcdFx0YXBwbGljYXRpb25Sb290LnJlbW92ZUNoaWxkKGRhdGVSYW5nZVBpY2tlckVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdGFwcGxpY2F0aW9uUm9vdC5hcHBlbmRDaGlsZChjb21wb25lbnRFbGVtKTtcblxuXHRcdHRoaXMucGlja2VyID0gPERhdGVSYW5nZVBpY2tlckNvbXBvbmVudD5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG5cdFx0dGhpcy5waWNrZXIuaW5saW5lID0gZmFsc2U7XG5cdH1cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLnBpY2tlci5zdGFydERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmVuZERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5lbmREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5yYW5nZUNsaWNrZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG5cdFx0XHR0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHJhbmdlKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5kYXRlc1VwZGF0ZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG5cdFx0XHR0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHJhbmdlKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5jaG9vc2VkRGF0ZS5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGNoYW5nZTogYW55KSA9PiB7XG5cdFx0XHRpZiAoY2hhbmdlKSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0ge307XG5cdFx0XHRcdHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSA9IGNoYW5nZS5zdGFydERhdGU7XG5cdFx0XHRcdHZhbHVlW3RoaXMuX2VuZEtleV0gPSBjaGFuZ2UuZW5kRGF0ZTtcblx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlLmVtaXQodmFsdWUpO1xuXHRcdFx0XHRpZiAodHlwZW9mIGNoYW5nZS5jaG9zZW5MYWJlbCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHR0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gY2hhbmdlLmNob3NlbkxhYmVsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuZmlyc3RNb250aERheUNsYXNzID0gdGhpcy5maXJzdE1vbnRoRGF5Q2xhc3M7XG5cdFx0dGhpcy5waWNrZXIubGFzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmxhc3RNb250aERheUNsYXNzO1xuXHRcdHRoaXMucGlja2VyLmVtcHR5V2Vla1Jvd0NsYXNzID0gdGhpcy5lbXB0eVdlZWtSb3dDbGFzcztcblx0XHR0aGlzLnBpY2tlci5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgPSB0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcztcblx0XHR0aGlzLnBpY2tlci5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgPSB0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcztcblx0XHR0aGlzLnBpY2tlci5kcm9wcyA9IHRoaXMuZHJvcHM7XG5cdFx0dGhpcy5waWNrZXIub3BlbnMgPSB0aGlzLm9wZW5zO1xuXHRcdHRoaXMubG9jYWxlRGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5sb2NhbGUpLmNyZWF0ZSgpO1xuXHRcdHRoaXMucGlja2VyLmNsb3NlT25BdXRvQXBwbHkgPSB0aGlzLmNsb3NlT25BdXRvQXBwbHk7XG5cdH1cblxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG5cdFx0Zm9yIChjb25zdCBjaGFuZ2UgaW4gY2hhbmdlcykge1xuXHRcdFx0aWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoY2hhbmdlKSkge1xuXHRcdFx0XHRpZiAodGhpcy5ub3RGb3JDaGFuZ2VzUHJvcGVydHkuaW5kZXhPZihjaGFuZ2UpID09PSAtMSkge1xuXHRcdFx0XHRcdHRoaXMucGlja2VyW2NoYW5nZV0gPSBjaGFuZ2VzW2NoYW5nZV0uY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0bmdEb0NoZWNrKCkge1xuXHRcdGlmICh0aGlzLmxvY2FsZURpZmZlcikge1xuXHRcdFx0Y29uc3QgY2hhbmdlcyA9IHRoaXMubG9jYWxlRGlmZmVyLmRpZmYodGhpcy5sb2NhbGUpO1xuXHRcdFx0aWYgKGNoYW5nZXMpIHtcblx0XHRcdFx0dGhpcy5waWNrZXIudXBkYXRlTG9jYWxlKHRoaXMubG9jYWxlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRvbkJsdXIoKSB7XG5cdFx0dGhpcy5fb25Ub3VjaGVkKCk7XG5cdH1cblxuXHRvcGVuKGV2ZW50PzogYW55KSB7XG5cdFx0Y29uc29sZS5sb2coJ3RyeWluZyB0byBvcGVuJyk7XG5cdFx0dGhpcy5waWNrZXIuc2hvdyhldmVudCk7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnc2V0IHBvc2l0aW9uJyk7XG5cdFx0XHR0aGlzLnNldFBvc2l0aW9uKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRoaWRlKGU/KSB7XG5cdFx0dGhpcy5waWNrZXIuaGlkZShlKTtcblx0fVxuXHR0b2dnbGUoZT8pIHtcblx0XHRpZiAodGhpcy5waWNrZXIuaXNTaG93bikge1xuXHRcdFx0dGhpcy5oaWRlKGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9wZW4oZSk7XG5cdFx0fVxuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5waWNrZXIuY2xlYXIoKTtcblx0fVxuXG5cdHdyaXRlVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXHRyZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG5cdFx0dGhpcy5fb25DaGFuZ2UgPSBmbjtcblx0fVxuXHRyZWdpc3Rlck9uVG91Y2hlZChmbikge1xuXHRcdHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuXHR9XG5cdHByaXZhdGUgc2V0VmFsdWUodmFsOiBhbnkpIHtcblx0XHRpZiAodmFsKSB7XG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0aWYgKHZhbFt0aGlzLl9zdGFydEtleV0pIHtcblx0XHRcdFx0dGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHZhbFt0aGlzLl9zdGFydEtleV0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbFt0aGlzLl9lbmRLZXldKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnNldEVuZERhdGUodmFsW3RoaXMuX2VuZEtleV0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5waWNrZXIuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0XHRcdGlmICh0aGlzLnBpY2tlci5jaG9zZW5MYWJlbCkge1xuXHRcdFx0XHR0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5waWNrZXIuY2hvc2VuTGFiZWw7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGlja2VyLmNsZWFyKCk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiBTZXQgcG9zaXRpb24gb2YgdGhlIGNhbGVuZGFyXG5cdCAqL1xuXHRzZXRQb3NpdGlvbigpIHtcblx0XHRsZXQgc3R5bGU7XG5cdFx0bGV0IGNvbnRhaW5lclRvcDtcblx0XHR0aGlzLnRvcEFkanVzdG1lbnQgPSB0aGlzLnRvcEFkanVzdG1lbnQgPyArdGhpcy50b3BBZGp1c3RtZW50IDogMDtcblx0XHR0aGlzLmxlZnRBZGp1c3RtZW50ID0gdGhpcy5sZWZ0QWRqdXN0bWVudCA/ICt0aGlzLmxlZnRBZGp1c3RtZW50IDogMDtcblxuXHRcdC8vIHRvZG86IHJldmlzaXQgdGhlIG9mZnNldHMgd2hlcmUgd2hlbiBib3RoIHRoZSBzaGFyZWQgY29tcG9uZW50cyBhcmUgZG9uZSBhbmQgdGhlIG9yZGVyIHNlYXJjaCByZXdvcmsgaXMgZmluaXNoZWRcblx0XHRjb25zdCBjb250YWluZXIgPSB0aGlzLnBpY2tlci5waWNrZXJDb250YWluZXIubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblx0XHRsZXQgZWxlbWVudCA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRpZiAodGhpcy50YXJnZXRFbGVtZW50SWQpIHtcblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldEVsZW1lbnRJZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZWxlbWVudExvY2F0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdGlmICh0aGlzLmRyb3BzICYmIHRoaXMuZHJvcHMgPT09ICd1cCcpIHtcblx0XHRcdGNvbnRhaW5lclRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wIC0gY29udGFpbmVyLmNsaWVudEhlaWdodCArIHRoaXMudG9wQWRqdXN0bWVudCArICdweCc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lclRvcCA9IGVsZW1lbnRMb2NhdGlvbi50b3AgKyB0aGlzLnRvcEFkanVzdG1lbnQgKyAncHgnO1xuXHRcdH1cblx0XHRpZiAodGhpcy5vcGVucyA9PT0gJ2xlZnQnKSB7XG5cdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdGxlZnQ6ICgoZWxlbWVudExvY2F0aW9uLmxlZnQgLSBjb250YWluZXIuY2xpZW50V2lkdGggKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLSAxMDApICArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdjZW50ZXInKSB7XG5cdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdGxlZnQ6ICgoZWxlbWVudExvY2F0aW9uLmxlZnQgKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLyAyIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMikgICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ3JpZ2h0Jykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoZWxlbWVudExvY2F0aW9uLmxlZnQgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHBvc2l0aW9uID0gZWxlbWVudExvY2F0aW9uLmxlZnQgKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLyAyIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMjtcblxuXHRcdFx0aWYgKHBvc2l0aW9uIDwgMCkge1xuXHRcdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0XHRsZWZ0OiAoZWxlbWVudExvY2F0aW9uLmxlZnQgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdFx0bGVmdDogKHBvc2l0aW9uICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc3R5bGUgLyomJiAhdGhpcy5pc01vYmlsZSovKSB7XG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd0b3AnLCBzdHlsZS50b3ApO1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHN0eWxlLmxlZnQpO1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAncmlnaHQnLCBzdHlsZS5yaWdodCk7XG5cdFx0fVxuXHR9XG5cdGlucHV0Q2hhbmdlZChlKSB7XG5cdFx0aWYgKGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2lucHV0Jykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIWUudGFyZ2V0LnZhbHVlLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBkYXRlU3RyaW5nID0gZS50YXJnZXQudmFsdWUuc3BsaXQodGhpcy5waWNrZXIubG9jYWxlLnNlcGFyYXRvcik7XG5cdFx0bGV0IHN0YXJ0ID0gbnVsbCxcblx0XHRcdGVuZCA9IG51bGw7XG5cdFx0aWYgKGRhdGVTdHJpbmcubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRzdGFydCA9IG1vbWVudChkYXRlU3RyaW5nWzBdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcblx0XHRcdGVuZCA9IG1vbWVudChkYXRlU3RyaW5nWzFdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlciB8fCBzdGFydCA9PT0gbnVsbCB8fCBlbmQgPT09IG51bGwpIHtcblx0XHRcdHN0YXJ0ID0gbW9tZW50KGUudGFyZ2V0LnZhbHVlLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcblx0XHRcdGVuZCA9IHN0YXJ0O1xuXHRcdH1cblx0XHRpZiAoIXN0YXJ0LmlzVmFsaWQoKSB8fCAhZW5kLmlzVmFsaWQoKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnBpY2tlci5zZXRTdGFydERhdGUoc3RhcnQpO1xuXHRcdHRoaXMucGlja2VyLnNldEVuZERhdGUoZW5kKTtcblx0XHR0aGlzLnBpY2tlci51cGRhdGVWaWV3KCk7XG5cdH1cblx0LyoqXG5cdCAqIEZvciBjbGljayBvdXRzaWRlIG9mIHRoZSBjYWxlbmRhcidzIGNvbnRhaW5lclxuXHQgKiBAcGFyYW0gZXZlbnQgZXZlbnQgb2JqZWN0XG5cdCAqL1xuXHRASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycsIFsnJGV2ZW50J10pXG5cdG91dHNpZGVDbGljayhldmVudCk6IHZvaWQge1xuXHRcdGlmICghZXZlbnQudGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25neC1kYXRlcmFuZ2VwaWNrZXItYWN0aW9uJykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQhdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJlxuXHRcdFx0KGV2ZW50LnRhcmdldCBhcyBIVE1MU3BhbkVsZW1lbnQpLmNsYXNzTmFtZS5pbmRleE9mKCdtYXQtb3B0aW9uJykgPT09IC0xXG5cdFx0KSB7XG5cdFx0XHR0aGlzLmhpZGUoKTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==