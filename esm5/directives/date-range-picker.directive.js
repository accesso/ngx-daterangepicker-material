import * as tslib_1 from "tslib";
import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, DoCheck, ElementRef, EmbeddedViewRef, EventEmitter, forwardRef, Host, HostListener, Injector, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { DateRangePickerComponent } from '../components/date-range-picker.component';
import { LocaleService } from '../services/locale.service';
var moment = _moment;
var DateRangePickerDirective = /** @class */ (function () {
    function DateRangePickerDirective(applicationRef, viewContainerRef, injector, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs, _localeService, elementRef) {
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
        var applicationRoot = document.body.querySelector('*[ng-version]');
        var dateRangePickerElement = applicationRoot.querySelector('ngx-daterangepicker-material');
        var componentFactory = this._componentFactoryResolver.resolveComponentFactory(DateRangePickerComponent);
        var componentRef = componentFactory.create(injector);
        this.applicationRef.attachView(componentRef.hostView);
        var componentElem = componentRef.hostView.rootNodes[0];
        if (dateRangePickerElement) {
            applicationRoot.removeChild(dateRangePickerElement);
        }
        applicationRoot.appendChild(componentElem);
        this.picker = componentRef.instance;
        this.picker.inline = false;
    }
    DateRangePickerDirective_1 = DateRangePickerDirective;
    Object.defineProperty(DateRangePickerDirective.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            this._locale = tslib_1.__assign({}, this._localeService.config, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateRangePickerDirective.prototype, "startKey", {
        set: function (value) {
            if (value !== null) {
                this._startKey = value;
            }
            else {
                this._startKey = 'startDate';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateRangePickerDirective.prototype, "endKey", {
        set: function (value) {
            if (value !== null) {
                this._endKey = value;
            }
            else {
                this._endKey = 'endDate';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateRangePickerDirective.prototype, "value", {
        get: function () {
            return this._value || null;
        },
        set: function (val) {
            this._value = val;
            this._onChange(val);
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    DateRangePickerDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.picker.startDateChanged.asObservable().subscribe(function (itemChanged) {
            _this.startDateChanged.emit(itemChanged);
        });
        this.picker.endDateChanged.asObservable().subscribe(function (itemChanged) {
            _this.endDateChanged.emit(itemChanged);
        });
        this.picker.rangeClicked.asObservable().subscribe(function (range) {
            _this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().subscribe(function (range) {
            _this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().subscribe(function (change) {
            if (change) {
                var value = {};
                value[_this._startKey] = change.startDate;
                value[_this._endKey] = change.endDate;
                _this.value = value;
                _this.onChange.emit(value);
                if (typeof change.chosenLabel === 'string') {
                    _this._el.nativeElement.value = change.chosenLabel;
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
    };
    DateRangePickerDirective.prototype.ngOnChanges = function (changes) {
        for (var change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.notForChangesProperty.indexOf(change) === -1) {
                    this.picker[change] = changes[change].currentValue;
                }
            }
        }
    };
    DateRangePickerDirective.prototype.ngDoCheck = function () {
        if (this.localeDiffer) {
            var changes = this.localeDiffer.diff(this.locale);
            if (changes) {
                this.picker.updateLocale(this.locale);
            }
        }
    };
    DateRangePickerDirective.prototype.onBlur = function () {
        this._onTouched();
    };
    DateRangePickerDirective.prototype.open = function (event) {
        var _this = this;
        this.picker.show(event);
        setTimeout(function () {
            _this.setPosition();
        });
    };
    DateRangePickerDirective.prototype.hide = function (e) {
        this.picker.hide(e);
    };
    DateRangePickerDirective.prototype.toggle = function (e) {
        if (this.picker.isShown) {
            this.hide(e);
        }
        else {
            this.open(e);
        }
    };
    DateRangePickerDirective.prototype.clear = function () {
        this.picker.clear();
    };
    DateRangePickerDirective.prototype.writeValue = function (value) {
        this.setValue(value);
    };
    DateRangePickerDirective.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    DateRangePickerDirective.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    DateRangePickerDirective.prototype.setValue = function (val) {
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
    };
    /**
     * Set position of the calendar
     */
    DateRangePickerDirective.prototype.setPosition = function () {
        var style;
        var containerTop;
        this.topAdjustment = this.topAdjustment ? +this.topAdjustment : 0;
        this.leftAdjustment = this.leftAdjustment ? +this.leftAdjustment : 0;
        // todo: revisit the offsets where when both the shared components are done and the order search rework is finished
        var container = this.picker.pickerContainer.nativeElement;
        var element = this._el.nativeElement;
        if (this.targetElementId) {
            element = document.getElementById(this.targetElementId);
        }
        else {
            element = element.parentElement;
        }
        var elementLocation = element.getBoundingClientRect();
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
            var position = elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2;
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
    };
    DateRangePickerDirective.prototype.inputChanged = function (e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }
        if (!e.target.value.length) {
            return;
        }
        var dateString = e.target.value.split(this.picker.locale.separator);
        var start = null, end = null;
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
    };
    /**
     * For click outside of the calendar's container
     * @param event event object
     */
    DateRangePickerDirective.prototype.outsideClick = function (event) {
        if (!event.target) {
            return;
        }
        if (event.target.classList.contains('ngx-daterangepicker-action')) {
            return;
        }
        var targetElement = document.getElementById(this.targetElementId);
        if (targetElement.contains(event.target)) {
            this.open(event);
        }
        if (!this.elementRef.nativeElement.contains(event.target) &&
            event.target.className.indexOf('mat-option') === -1) {
            this.hide();
        }
    };
    var DateRangePickerDirective_1;
    DateRangePickerDirective.ctorParameters = function () { return [
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
    ]; };
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
                    useExisting: forwardRef(function () { return DateRangePickerDirective_1; }),
                    multi: true
                }
            ]
        })
    ], DateRangePickerDirective);
    return DateRangePickerDirective;
}());
export { DateRangePickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ04sY0FBYyxFQUNkLGlCQUFpQixFQUNqQix3QkFBd0IsRUFDeEIsU0FBUyxFQUNULE9BQU8sRUFDUCxVQUFVLEVBQ1YsZUFBZSxFQUNmLFlBQVksRUFDWixVQUFVLEVBQUUsSUFBSSxFQUNoQixZQUFZLEVBQ1osUUFBUSxFQUNSLEtBQUssRUFDTCxjQUFjLEVBQ2QsZUFBZSxFQUNmLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBR3JGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUzRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFvQnZCO0lBb0lDLGtDQUNRLGNBQThCLEVBQzlCLGdCQUFrQyxFQUNsQyxRQUFrQixFQUNsQixrQkFBcUMsRUFDcEMseUJBQW1ELEVBQ25ELEdBQWUsRUFDZixTQUFvQixFQUNwQixPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQjtRQVR2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDcEMsOEJBQXlCLEdB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RTNCO1FBQVIsS0FBSyxFQUFFOzREQU1QO0lBQ1E7UUFBUixLQUFLLEVBQUU7MERBTVA7SUFhaUI7UUFBakIsTUFBTSxDQUFDLFFBQVEsQ0FBQzs4REFBcUQ7SUFFOUM7UUFBdkIsTUFBTSxDQUFDLGNBQWMsQ0FBQztrRUFBeUQ7SUFFeEQ7UUFBdkIsTUFBTSxDQUFDLGNBQWMsQ0FBQztrRUFBeUQ7SUFDdEU7UUFBVCxNQUFNLEVBQUU7c0VBQTZEO0lBQzVEO1FBQVQsTUFBTSxFQUFFO29FQUEyRDtJQWlQcEU7UUFEQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnRUFxQjFDO0lBdFlXLHdCQUF3QjtRQWxCcEMsU0FBUyxDQUFDO1lBQ1YsOENBQThDO1lBQzlDLFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMscURBQXFEO1lBQ3JELElBQUksRUFBRTtnQkFDTCxhQUFhLEVBQUUsUUFBUTtnQkFDdkIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixTQUFTLEVBQUUsc0JBQXNCO2FBQ2pDO1lBQ0QsU0FBUyxFQUFFO2dCQUNWO29CQUNDLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLDBCQUF3QixFQUF4QixDQUF3QixDQUFDO29CQUN2RCxLQUFLLEVBQUUsSUFBSTtpQkFDWDthQUNEO1NBQ0QsQ0FBQztPQUNXLHdCQUF3QixDQXVZcEM7SUFBRCwrQkFBQztDQUFBLEFBdllELElBdVlDO1NBdllZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFwcGxpY2F0aW9uUmVmLFxuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuXHREaXJlY3RpdmUsXG5cdERvQ2hlY2ssXG5cdEVsZW1lbnRSZWYsXG5cdEVtYmVkZGVkVmlld1JlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLCBIb3N0LFxuXHRIb3N0TGlzdGVuZXIsXG5cdEluamVjdG9yLFxuXHRJbnB1dCxcblx0S2V5VmFsdWVEaWZmZXIsXG5cdEtleVZhbHVlRGlmZmVycyxcblx0T25DaGFuZ2VzLFxuXHRPbkluaXQsXG5cdE91dHB1dCxcblx0UmVuZGVyZXIyLFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5jb25maWcnO1xuaW1wb3J0IHsgRGF0ZVJhbmdlUHJlc2V0IH0gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIubW9kZWxzJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XG5cbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG5cdHNlbGVjdG9yOiAnKltuZ3hEYXRlUmFuZ2VQaWNrZXJNZF0nLFxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuXHRob3N0OiB7XG5cdFx0JyhrZXl1cC5lc2MpJzogJ2hpZGUoKScsXG5cdFx0JyhibHVyKSc6ICdvbkJsdXIoKScsXG5cdFx0JyhjbGljayknOiAnb3BlbigpJyxcblx0XHQnKGtleXVwKSc6ICdpbnB1dENoYW5nZWQoJGV2ZW50KSdcblx0fSxcblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUmFuZ2VQaWNrZXJEaXJlY3RpdmUpLFxuXHRcdFx0bXVsdGk6IHRydWVcblx0XHR9XG5cdF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIERvQ2hlY2sge1xuXHRwdWJsaWMgcGlja2VyOiBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ7XG5cdHByaXZhdGUgX29uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRwcml2YXRlIF9vblRvdWNoZWQgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0cHJpdmF0ZSBfdmFsdWU6IGFueTtcblx0cHJpdmF0ZSBsb2NhbGVEaWZmZXI6IEtleVZhbHVlRGlmZmVyPHN0cmluZywgYW55Pjtcblx0QElucHV0KClcblx0bWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XG5cdEBJbnB1dCgpXG5cdG1heERhdGU6IF9tb21lbnQuTW9tZW50O1xuXHRASW5wdXQoKVxuXHRhdXRvQXBwbHk6IGJvb2xlYW47XG5cblx0Ly8gQElucHV0KClcblx0Ly8gaXNNb2JpbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRASW5wdXQoKVxuXHR0YXJnZXRFbGVtZW50SWQ6IHN0cmluZztcblx0QElucHV0KClcblx0dG9wQWRqdXN0bWVudDogbnVtYmVyO1xuXHRASW5wdXQoKVxuXHRsZWZ0QWRqdXN0bWVudDogbnVtYmVyO1xuXG5cdEBJbnB1dCgpXG5cdGFsd2F5c1Nob3dDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGJ1dHRvbkNsYXNzQXBwbHk6IHN0cmluZztcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSZXNldDogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRidXR0b25DbGFzc1JhbmdlOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcblx0QElucHV0KClcblx0c2luZ2xlRGF0ZVBpY2tlcjogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93SVNPV2Vla051bWJlcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dEcm9wZG93bnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGlzSW52YWxpZERhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRpc0N1c3RvbURhdGU6IEZ1bmN0aW9uO1xuXHRASW5wdXQoKVxuXHRzaG93Q2xlYXJCdXR0b246IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGN1c3RvbVJhbmdlRGlyZWN0aW9uOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRyYW5nZXM6IERhdGVSYW5nZVByZXNldFtdO1xuXHRASW5wdXQoKVxuXHRvcGVuczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRkcm9wczogc3RyaW5nO1xuXHRmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0bGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0ZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0Zmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRrZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dDYW5jZWw6IGJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0bG9ja1N0YXJ0RGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXHQvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0dGltZVBpY2tlckluY3JlbWVudDogbnVtYmVyID0gMTtcblx0QElucHV0KClcblx0dGltZVBpY2tlclNlY29uZHM6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XG5cdF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuXHRASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XG5cdFx0dGhpcy5fbG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWUgfTtcblx0fVxuXHRnZXQgbG9jYWxlKCk6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsZTtcblx0fVxuXHRASW5wdXQoKVxuXHRwcml2YXRlIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcblx0cHJpdmF0ZSBfc3RhcnRLZXk6IHN0cmluZyA9ICdzdGFydERhdGUnO1xuXHRASW5wdXQoKSBzZXQgc3RhcnRLZXkodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IG51bGwpIHtcblx0XHRcdHRoaXMuX3N0YXJ0S2V5ID0gdmFsdWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3N0YXJ0S2V5ID0gJ3N0YXJ0RGF0ZSc7XG5cdFx0fVxuXHR9XG5cdEBJbnB1dCgpIHNldCBlbmRLZXkodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IG51bGwpIHtcblx0XHRcdHRoaXMuX2VuZEtleSA9IHZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9lbmRLZXkgPSAnZW5kRGF0ZSc7XG5cdFx0fVxuXHR9XG5cdG5vdEZvckNoYW5nZXNQcm9wZXJ0eTogQXJyYXk8c3RyaW5nPiA9IFsnbG9jYWxlJywgJ2VuZEtleScsICdzdGFydEtleSddO1xuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fdmFsdWUgfHwgbnVsbDtcblx0fVxuXHRzZXQgdmFsdWUodmFsKSB7XG5cdFx0dGhpcy5fdmFsdWUgPSB2YWw7XG5cdFx0dGhpcy5fb25DaGFuZ2UodmFsKTtcblx0XHR0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblx0fVxuXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4IG5vLW91dHB1dC1yZW5hbWVcblx0QE91dHB1dCgnY2hhbmdlJykgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdyYW5nZUNsaWNrZWQnKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdkYXRlc1VwZGF0ZWQnKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdCRldmVudDogYW55O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHB1YmxpYyBhcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXG5cdFx0cHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG5cdFx0cHVibGljIGluamVjdG9yOiBJbmplY3Rvcixcblx0XHRwdWJsaWMgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcblx0XHRwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcblx0XHRwcml2YXRlIF9lbDogRWxlbWVudFJlZixcblx0XHRwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuXHRcdHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuXHRcdHByaXZhdGUgX2xvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2UsXG5cdFx0cHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuXHQpIHtcblx0XHR0aGlzLmRyb3BzID0gJ2Rvd24nO1xuXHRcdHRoaXMub3BlbnMgPSAnYXV0byc7XG5cblx0XHRjb25zdCBhcHBsaWNhdGlvblJvb3QgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJypbbmctdmVyc2lvbl0nKSBhcyBIVE1MRWxlbWVudDtcblx0XHRjb25zdCBkYXRlUmFuZ2VQaWNrZXJFbGVtZW50ID0gYXBwbGljYXRpb25Sb290LnF1ZXJ5U2VsZWN0b3IoJ25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwnKTtcblx0XHRjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCk7XG5cdFx0Y29uc3QgY29tcG9uZW50UmVmID0gY29tcG9uZW50RmFjdG9yeS5jcmVhdGUoaW5qZWN0b3IpO1xuXHRcdHRoaXMuYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuXHRcdGNvbnN0IGNvbXBvbmVudEVsZW0gPSAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRpZiAoZGF0ZVJhbmdlUGlja2VyRWxlbWVudCkge1xuXHRcdFx0YXBwbGljYXRpb25Sb290LnJlbW92ZUNoaWxkKGRhdGVSYW5nZVBpY2tlckVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdGFwcGxpY2F0aW9uUm9vdC5hcHBlbmRDaGlsZChjb21wb25lbnRFbGVtKTtcblxuXHRcdHRoaXMucGlja2VyID0gPERhdGVSYW5nZVBpY2tlckNvbXBvbmVudD5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG5cdFx0dGhpcy5waWNrZXIuaW5saW5lID0gZmFsc2U7XG5cdH1cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLnBpY2tlci5zdGFydERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmVuZERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5lbmREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5yYW5nZUNsaWNrZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG5cdFx0XHR0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHJhbmdlKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5kYXRlc1VwZGF0ZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG5cdFx0XHR0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHJhbmdlKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5jaG9vc2VkRGF0ZS5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGNoYW5nZTogYW55KSA9PiB7XG5cdFx0XHRpZiAoY2hhbmdlKSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0ge307XG5cdFx0XHRcdHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSA9IGNoYW5nZS5zdGFydERhdGU7XG5cdFx0XHRcdHZhbHVlW3RoaXMuX2VuZEtleV0gPSBjaGFuZ2UuZW5kRGF0ZTtcblx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlLmVtaXQodmFsdWUpO1xuXHRcdFx0XHRpZiAodHlwZW9mIGNoYW5nZS5jaG9zZW5MYWJlbCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHR0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gY2hhbmdlLmNob3NlbkxhYmVsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuZmlyc3RNb250aERheUNsYXNzID0gdGhpcy5maXJzdE1vbnRoRGF5Q2xhc3M7XG5cdFx0dGhpcy5waWNrZXIubGFzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmxhc3RNb250aERheUNsYXNzO1xuXHRcdHRoaXMucGlja2VyLmVtcHR5V2Vla1Jvd0NsYXNzID0gdGhpcy5lbXB0eVdlZWtSb3dDbGFzcztcblx0XHR0aGlzLnBpY2tlci5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgPSB0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcztcblx0XHR0aGlzLnBpY2tlci5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgPSB0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcztcblx0XHR0aGlzLnBpY2tlci5kcm9wcyA9IHRoaXMuZHJvcHM7XG5cdFx0dGhpcy5waWNrZXIub3BlbnMgPSB0aGlzLm9wZW5zO1xuXHRcdHRoaXMubG9jYWxlRGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5sb2NhbGUpLmNyZWF0ZSgpO1xuXHRcdHRoaXMucGlja2VyLmNsb3NlT25BdXRvQXBwbHkgPSB0aGlzLmNsb3NlT25BdXRvQXBwbHk7XG5cdH1cblxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG5cdFx0Zm9yIChjb25zdCBjaGFuZ2UgaW4gY2hhbmdlcykge1xuXHRcdFx0aWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoY2hhbmdlKSkge1xuXHRcdFx0XHRpZiAodGhpcy5ub3RGb3JDaGFuZ2VzUHJvcGVydHkuaW5kZXhPZihjaGFuZ2UpID09PSAtMSkge1xuXHRcdFx0XHRcdHRoaXMucGlja2VyW2NoYW5nZV0gPSBjaGFuZ2VzW2NoYW5nZV0uY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0bmdEb0NoZWNrKCkge1xuXHRcdGlmICh0aGlzLmxvY2FsZURpZmZlcikge1xuXHRcdFx0Y29uc3QgY2hhbmdlcyA9IHRoaXMubG9jYWxlRGlmZmVyLmRpZmYodGhpcy5sb2NhbGUpO1xuXHRcdFx0aWYgKGNoYW5nZXMpIHtcblx0XHRcdFx0dGhpcy5waWNrZXIudXBkYXRlTG9jYWxlKHRoaXMubG9jYWxlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRvbkJsdXIoKSB7XG5cdFx0dGhpcy5fb25Ub3VjaGVkKCk7XG5cdH1cblxuXHRvcGVuKGV2ZW50PzogYW55KSB7XG5cdFx0dGhpcy5waWNrZXIuc2hvdyhldmVudCk7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0aGlzLnNldFBvc2l0aW9uKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRoaWRlKGU/KSB7XG5cdFx0dGhpcy5waWNrZXIuaGlkZShlKTtcblx0fVxuXHR0b2dnbGUoZT8pIHtcblx0XHRpZiAodGhpcy5waWNrZXIuaXNTaG93bikge1xuXHRcdFx0dGhpcy5oaWRlKGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9wZW4oZSk7XG5cdFx0fVxuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5waWNrZXIuY2xlYXIoKTtcblx0fVxuXG5cdHdyaXRlVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXHRyZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG5cdFx0dGhpcy5fb25DaGFuZ2UgPSBmbjtcblx0fVxuXHRyZWdpc3Rlck9uVG91Y2hlZChmbikge1xuXHRcdHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuXHR9XG5cdHByaXZhdGUgc2V0VmFsdWUodmFsOiBhbnkpIHtcblx0XHRpZiAodmFsKSB7XG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0aWYgKHZhbFt0aGlzLl9zdGFydEtleV0pIHtcblx0XHRcdFx0dGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHZhbFt0aGlzLl9zdGFydEtleV0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbFt0aGlzLl9lbmRLZXldKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnNldEVuZERhdGUodmFsW3RoaXMuX2VuZEtleV0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5waWNrZXIuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcblx0XHRcdGlmICh0aGlzLnBpY2tlci5jaG9zZW5MYWJlbCkge1xuXHRcdFx0XHR0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5waWNrZXIuY2hvc2VuTGFiZWw7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGlja2VyLmNsZWFyKCk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiBTZXQgcG9zaXRpb24gb2YgdGhlIGNhbGVuZGFyXG5cdCAqL1xuXHRzZXRQb3NpdGlvbigpIHtcblx0XHRsZXQgc3R5bGU7XG5cdFx0bGV0IGNvbnRhaW5lclRvcDtcblx0XHR0aGlzLnRvcEFkanVzdG1lbnQgPSB0aGlzLnRvcEFkanVzdG1lbnQgPyArdGhpcy50b3BBZGp1c3RtZW50IDogMDtcblx0XHR0aGlzLmxlZnRBZGp1c3RtZW50ID0gdGhpcy5sZWZ0QWRqdXN0bWVudCA/ICt0aGlzLmxlZnRBZGp1c3RtZW50IDogMDtcblxuXHRcdC8vIHRvZG86IHJldmlzaXQgdGhlIG9mZnNldHMgd2hlcmUgd2hlbiBib3RoIHRoZSBzaGFyZWQgY29tcG9uZW50cyBhcmUgZG9uZSBhbmQgdGhlIG9yZGVyIHNlYXJjaCByZXdvcmsgaXMgZmluaXNoZWRcblx0XHRjb25zdCBjb250YWluZXIgPSB0aGlzLnBpY2tlci5waWNrZXJDb250YWluZXIubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblx0XHRsZXQgZWxlbWVudCA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRpZiAodGhpcy50YXJnZXRFbGVtZW50SWQpIHtcblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldEVsZW1lbnRJZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZWxlbWVudExvY2F0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdGlmICh0aGlzLmRyb3BzICYmIHRoaXMuZHJvcHMgPT09ICd1cCcpIHtcblx0XHRcdGNvbnRhaW5lclRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wIC0gY29udGFpbmVyLmNsaWVudEhlaWdodCArIHRoaXMudG9wQWRqdXN0bWVudCArICdweCc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lclRvcCA9IGVsZW1lbnRMb2NhdGlvbi50b3AgKyB0aGlzLnRvcEFkanVzdG1lbnQgKyAncHgnO1xuXHRcdH1cblx0XHRpZiAodGhpcy5vcGVucyA9PT0gJ2xlZnQnKSB7XG5cdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdGxlZnQ6ICgoZWxlbWVudExvY2F0aW9uLmxlZnQgLSBjb250YWluZXIuY2xpZW50V2lkdGggKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLSAxMDApICArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdjZW50ZXInKSB7XG5cdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdGxlZnQ6ICgoZWxlbWVudExvY2F0aW9uLmxlZnQgKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLyAyIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMikgICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ3JpZ2h0Jykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoZWxlbWVudExvY2F0aW9uLmxlZnQgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHBvc2l0aW9uID0gZWxlbWVudExvY2F0aW9uLmxlZnQgKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLyAyIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMjtcblxuXHRcdFx0aWYgKHBvc2l0aW9uIDwgMCkge1xuXHRcdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0XHRsZWZ0OiAoZWxlbWVudExvY2F0aW9uLmxlZnQgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdFx0bGVmdDogKHBvc2l0aW9uICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc3R5bGUgLyomJiAhdGhpcy5pc01vYmlsZSovKSB7XG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd0b3AnLCBzdHlsZS50b3ApO1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHN0eWxlLmxlZnQpO1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAncmlnaHQnLCBzdHlsZS5yaWdodCk7XG5cdFx0fVxuXHR9XG5cdGlucHV0Q2hhbmdlZChlKSB7XG5cdFx0aWYgKGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2lucHV0Jykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIWUudGFyZ2V0LnZhbHVlLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBkYXRlU3RyaW5nID0gZS50YXJnZXQudmFsdWUuc3BsaXQodGhpcy5waWNrZXIubG9jYWxlLnNlcGFyYXRvcik7XG5cdFx0bGV0IHN0YXJ0ID0gbnVsbCxcblx0XHRcdGVuZCA9IG51bGw7XG5cdFx0aWYgKGRhdGVTdHJpbmcubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRzdGFydCA9IG1vbWVudChkYXRlU3RyaW5nWzBdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcblx0XHRcdGVuZCA9IG1vbWVudChkYXRlU3RyaW5nWzFdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlciB8fCBzdGFydCA9PT0gbnVsbCB8fCBlbmQgPT09IG51bGwpIHtcblx0XHRcdHN0YXJ0ID0gbW9tZW50KGUudGFyZ2V0LnZhbHVlLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcblx0XHRcdGVuZCA9IHN0YXJ0O1xuXHRcdH1cblx0XHRpZiAoIXN0YXJ0LmlzVmFsaWQoKSB8fCAhZW5kLmlzVmFsaWQoKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnBpY2tlci5zZXRTdGFydERhdGUoc3RhcnQpO1xuXHRcdHRoaXMucGlja2VyLnNldEVuZERhdGUoZW5kKTtcblx0XHR0aGlzLnBpY2tlci51cGRhdGVWaWV3KCk7XG5cdH1cblxuXHQvKipcblx0ICogRm9yIGNsaWNrIG91dHNpZGUgb2YgdGhlIGNhbGVuZGFyJ3MgY29udGFpbmVyXG5cdCAqIEBwYXJhbSBldmVudCBldmVudCBvYmplY3Rcblx0ICovXG5cdEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQnXSlcblx0b3V0c2lkZUNsaWNrKGV2ZW50KTogdm9pZCB7XG5cdFx0aWYgKCFldmVudC50YXJnZXQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbmd4LWRhdGVyYW5nZXBpY2tlci1hY3Rpb24nKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldEVsZW1lbnRJZCk7XG5cdFx0aWYgKHRhcmdldEVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuXHRcdFx0dGhpcy5vcGVuKGV2ZW50KTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQhdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJlxuXHRcdFx0KGV2ZW50LnRhcmdldCBhcyBIVE1MU3BhbkVsZW1lbnQpLmNsYXNzTmFtZS5pbmRleE9mKCdtYXQtb3B0aW9uJykgPT09IC0xXG5cdFx0KSB7XG5cdFx0XHR0aGlzLmhpZGUoKTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==