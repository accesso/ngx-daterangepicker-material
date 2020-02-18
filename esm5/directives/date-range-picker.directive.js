import * as tslib_1 from "tslib";
import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, DoCheck, ElementRef, EmbeddedViewRef, EventEmitter, forwardRef, HostListener, Injector, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
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
        console.log('trying to open');
        this.picker.show(event);
        setTimeout(function () {
            console.log('set position');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ04sY0FBYyxFQUNkLGlCQUFpQixFQUNqQix3QkFBd0IsRUFDeEIsU0FBUyxFQUNULE9BQU8sRUFDUCxVQUFVLEVBQ1YsZUFBZSxFQUNmLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUVyRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFM0QsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBb0J2QjtJQW9JQyxrQ0FDUSxjQUE4QixFQUM5QixnQkFBa0MsRUFDbEMsUUFBa0IsRUFDbEIsa0JBQXFDLEVBQ3BDLHlCQUFtRCxFQUNuRCxHQUFlLEVBQ2YsU0FBb0IsRUFDcEIsT0FBd0IsRUFDeEIsY0FBNkIsRUFDN0IsVUFBc0I7UUFUdkIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3BDLDhCQUF5QixHQUF6Qix5QkFBeUIs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O1FBQXZCLE1BQU0sQ0FBQyxjQUFjLENBQUM7a0VBQXlEO0lBRXhEO1FBQXZCLE1BQU0sQ0FBQyxjQUFjLENBQUM7a0VBQXlEO0lBQ3RFO1FBQVQsTUFBTSxFQUFFO3NFQUE2RDtJQUM1RDtRQUFULE1BQU0sRUFBRTtvRUFBMkQ7SUFpUHBFO1FBREMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Z0VBZ0IxQztJQWpZVyx3QkFBd0I7UUFsQnBDLFNBQVMsQ0FBQztZQUNWLDhDQUE4QztZQUM5QyxRQUFRLEVBQUUseUJBQXlCO1lBQ25DLHFEQUFxRDtZQUNyRCxJQUFJLEVBQUU7Z0JBQ0wsYUFBYSxFQUFFLFFBQVE7Z0JBQ3ZCLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLHNCQUFzQjthQUNqQztZQUNELFNBQVMsRUFBRTtnQkFDVjtvQkFDQyxPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSwwQkFBd0IsRUFBeEIsQ0FBd0IsQ0FBQztvQkFDdkQsS0FBSyxFQUFFLElBQUk7aUJBQ1g7YUFDRDtTQUNELENBQUM7T0FDVyx3QkFBd0IsQ0FrWXBDO0lBQUQsK0JBQUM7Q0FBQSxBQWxZRCxJQWtZQztTQWxZWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBcHBsaWNhdGlvblJlZixcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcblx0RGlyZWN0aXZlLFxuXHREb0NoZWNrLFxuXHRFbGVtZW50UmVmLFxuXHRFbWJlZGRlZFZpZXdSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0Zm9yd2FyZFJlZixcblx0SG9zdExpc3RlbmVyLFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdEtleVZhbHVlRGlmZmVyLFxuXHRLZXlWYWx1ZURpZmZlcnMsXG5cdE9uQ2hhbmdlcyxcblx0T25Jbml0LFxuXHRPdXRwdXQsXG5cdFJlbmRlcmVyMixcblx0U2ltcGxlQ2hhbmdlcyxcblx0Vmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRGF0ZVJhbmdlUHJlc2V0IH0gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIubW9kZWxzJztcbmltcG9ydCAqIGFzIF9tb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IExvY2FsZUNvbmZpZyB9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyLmNvbmZpZyc7XG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbG9jYWxlLnNlcnZpY2UnO1xuXG5jb25zdCBtb21lbnQgPSBfbW9tZW50O1xuXG5ARGlyZWN0aXZlKHtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvclxuXHRzZWxlY3RvcjogJypbbmd4RGF0ZVJhbmdlUGlja2VyTWRdJyxcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtbWV0YWRhdGEtcHJvcGVydHlcblx0aG9zdDoge1xuXHRcdCcoa2V5dXAuZXNjKSc6ICdoaWRlKCknLFxuXHRcdCcoYmx1ciknOiAnb25CbHVyKCknLFxuXHRcdCcoY2xpY2spJzogJ29wZW4oKScsXG5cdFx0JyhrZXl1cCknOiAnaW5wdXRDaGFuZ2VkKCRldmVudCknXG5cdH0sXG5cdHByb3ZpZGVyczogW1xuXHRcdHtcblx0XHRcdHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuXHRcdFx0dXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlKSxcblx0XHRcdG11bHRpOiB0cnVlXG5cdFx0fVxuXHRdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVSYW5nZVBpY2tlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBEb0NoZWNrIHtcblx0cHVibGljIHBpY2tlcjogRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50O1xuXHRwcml2YXRlIF9vbkNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0cHJpdmF0ZSBfb25Ub3VjaGVkID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRwcml2YXRlIF92YWxpZGF0b3JDaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cdHByaXZhdGUgbG9jYWxlRGlmZmVyOiBLZXlWYWx1ZURpZmZlcjxzdHJpbmcsIGFueT47XG5cdEBJbnB1dCgpXG5cdG1pbkRhdGU6IF9tb21lbnQuTW9tZW50O1xuXHRASW5wdXQoKVxuXHRtYXhEYXRlOiBfbW9tZW50Lk1vbWVudDtcblx0QElucHV0KClcblx0YXV0b0FwcGx5OiBib29sZWFuO1xuXG5cdC8vIEBJbnB1dCgpXG5cdC8vIGlzTW9iaWxlOiBib29sZWFuID0gZmFsc2U7XG5cblx0QElucHV0KClcblx0dGFyZ2V0RWxlbWVudElkOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdHRvcEFkanVzdG1lbnQ6IG51bWJlcjtcblx0QElucHV0KClcblx0bGVmdEFkanVzdG1lbnQ6IG51bWJlcjtcblxuXHRASW5wdXQoKVxuXHRhbHdheXNTaG93Q2FsZW5kYXJzOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93Q3VzdG9tUmFuZ2VMYWJlbDogYm9vbGVhbjtcblx0QElucHV0KClcblx0bGlua2VkQ2FsZW5kYXJzOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRidXR0b25DbGFzc0FwcGx5OiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGJ1dHRvbkNsYXNzUmVzZXQ6IHN0cmluZztcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NSYW5nZTogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XG5cdEBJbnB1dCgpXG5cdHNpbmdsZURhdGVQaWNrZXI6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd0lTT1dlZWtOdW1iZXJzOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93RHJvcGRvd25zOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRpc0ludmFsaWREYXRlOiBGdW5jdGlvbjtcblx0QElucHV0KClcblx0aXNDdXN0b21EYXRlOiBGdW5jdGlvbjtcblx0QElucHV0KClcblx0c2hvd0NsZWFyQnV0dG9uOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRjdXN0b21SYW5nZURpcmVjdGlvbjogYm9vbGVhbjtcblx0QElucHV0KClcblx0cmFuZ2VzOiBEYXRlUmFuZ2VQcmVzZXRbXTtcblx0QElucHV0KClcblx0b3BlbnM6IHN0cmluZztcblx0QElucHV0KClcblx0ZHJvcHM6IHN0cmluZztcblx0Zmlyc3RNb250aERheUNsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGxhc3RNb250aERheUNsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRsYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0a2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZTogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd1JhbmdlTGFiZWxPbklucHV0OiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93Q2FuY2VsOiBib29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdGxvY2tTdGFydERhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblx0Ly8gdGltZXBpY2tlciB2YXJpYWJsZXNcblx0QElucHV0KClcblx0dGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyMjRIb3VyOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXJJbmNyZW1lbnQ6IG51bWJlciA9IDE7XG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXJTZWNvbmRzOiBCb29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpIGNsb3NlT25BdXRvQXBwbHkgPSB0cnVlO1xuXHRfbG9jYWxlOiBMb2NhbGVDb25maWcgPSB7fTtcblx0QElucHV0KCkgc2V0IGxvY2FsZSh2YWx1ZSkge1xuXHRcdHRoaXMuX2xvY2FsZSA9IHsgLi4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnZhbHVlIH07XG5cdH1cblx0Z2V0IGxvY2FsZSgpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLl9sb2NhbGU7XG5cdH1cblx0QElucHV0KClcblx0cHJpdmF0ZSBfZW5kS2V5OiBzdHJpbmcgPSAnZW5kRGF0ZSc7XG5cdHByaXZhdGUgX3N0YXJ0S2V5OiBzdHJpbmcgPSAnc3RhcnREYXRlJztcblx0QElucHV0KCkgc2V0IHN0YXJ0S2V5KHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9PSBudWxsKSB7XG5cdFx0XHR0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9zdGFydEtleSA9ICdzdGFydERhdGUnO1xuXHRcdH1cblx0fVxuXHRASW5wdXQoKSBzZXQgZW5kS2V5KHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9PSBudWxsKSB7XG5cdFx0XHR0aGlzLl9lbmRLZXkgPSB2YWx1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fZW5kS2V5ID0gJ2VuZERhdGUnO1xuXHRcdH1cblx0fVxuXHRub3RGb3JDaGFuZ2VzUHJvcGVydHk6IEFycmF5PHN0cmluZz4gPSBbJ2xvY2FsZScsICdlbmRLZXknLCAnc3RhcnRLZXknXTtcblxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlIHx8IG51bGw7XG5cdH1cblx0c2V0IHZhbHVlKHZhbCkge1xuXHRcdHRoaXMuX3ZhbHVlID0gdmFsO1xuXHRcdHRoaXMuX29uQ2hhbmdlKHZhbCk7XG5cdFx0dGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cdH1cblxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeCBuby1vdXRwdXQtcmVuYW1lXG5cdEBPdXRwdXQoJ2NoYW5nZScpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1yZW5hbWVcblx0QE91dHB1dCgncmFuZ2VDbGlja2VkJykgcmFuZ2VDbGlja2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1yZW5hbWVcblx0QE91dHB1dCgnZGF0ZXNVcGRhdGVkJykgZGF0ZXNVcGRhdGVkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0QE91dHB1dCgpIHN0YXJ0RGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgZW5kRGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHQkZXZlbnQ6IGFueTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwdWJsaWMgYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLFxuXHRcdHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuXHRcdHB1YmxpYyBpbmplY3RvcjogSW5qZWN0b3IsXG5cdFx0cHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG5cdFx0cHJpdmF0ZSBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG5cdFx0cHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWYsXG5cdFx0cHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcblx0XHRwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcblx0XHRwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlLFxuXHRcdHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZlxuXHQpIHtcblx0XHR0aGlzLmRyb3BzID0gJ2Rvd24nO1xuXHRcdHRoaXMub3BlbnMgPSAnYXV0byc7XG5cdFx0Y29uc3QgYXBwbGljYXRpb25Sb290ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcqW25nLXZlcnNpb25dJykgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0Y29uc3QgZGF0ZVJhbmdlUGlja2VyRWxlbWVudCA9IGFwcGxpY2F0aW9uUm9vdC5xdWVyeVNlbGVjdG9yKCduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJyk7XG5cdFx0Y29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQpO1xuXHRcdGNvbnN0IGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKGluamVjdG9yKTtcblx0XHR0aGlzLmFwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcblx0XHRjb25zdCBjb21wb25lbnRFbGVtID0gKGNvbXBvbmVudFJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdIGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0aWYgKGRhdGVSYW5nZVBpY2tlckVsZW1lbnQpIHtcblx0XHRcdGFwcGxpY2F0aW9uUm9vdC5yZW1vdmVDaGlsZChkYXRlUmFuZ2VQaWNrZXJFbGVtZW50KTtcblx0XHR9XG5cblx0XHRhcHBsaWNhdGlvblJvb3QuYXBwZW5kQ2hpbGQoY29tcG9uZW50RWxlbSk7XG5cblx0XHR0aGlzLnBpY2tlciA9IDxEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ+Y29tcG9uZW50UmVmLmluc3RhbmNlO1xuXHRcdHRoaXMucGlja2VyLmlubGluZSA9IGZhbHNlO1xuXHR9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5waWNrZXIuc3RhcnREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5lbmREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIucmFuZ2VDbGlja2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5yYW5nZUNsaWNrZWQuZW1pdChyYW5nZSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuZGF0ZXNVcGRhdGVkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5kYXRlc1VwZGF0ZWQuZW1pdChyYW5nZSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuY2hvb3NlZERhdGUuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0aWYgKGNoYW5nZSkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHt9O1xuXHRcdFx0XHR2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBjaGFuZ2Uuc3RhcnREYXRlO1xuXHRcdFx0XHR2YWx1ZVt0aGlzLl9lbmRLZXldID0gY2hhbmdlLmVuZERhdGU7XG5cdFx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy5vbkNoYW5nZS5lbWl0KHZhbHVlKTtcblx0XHRcdFx0aWYgKHR5cGVvZiBjaGFuZ2UuY2hvc2VuTGFiZWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IGNoYW5nZS5jaG9zZW5MYWJlbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmZpcnN0TW9udGhEYXlDbGFzcyA9IHRoaXMuZmlyc3RNb250aERheUNsYXNzO1xuXHRcdHRoaXMucGlja2VyLmxhc3RNb250aERheUNsYXNzID0gdGhpcy5sYXN0TW9udGhEYXlDbGFzcztcblx0XHR0aGlzLnBpY2tlci5lbXB0eVdlZWtSb3dDbGFzcyA9IHRoaXMuZW1wdHlXZWVrUm93Q2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZmlyc3REYXlPZk5leHRNb250aENsYXNzID0gdGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3M7XG5cdFx0dGhpcy5waWNrZXIubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzID0gdGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZHJvcHMgPSB0aGlzLmRyb3BzO1xuXHRcdHRoaXMucGlja2VyLm9wZW5zID0gdGhpcy5vcGVucztcblx0XHR0aGlzLmxvY2FsZURpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMubG9jYWxlKS5jcmVhdGUoKTtcblx0XHR0aGlzLnBpY2tlci5jbG9zZU9uQXV0b0FwcGx5ID0gdGhpcy5jbG9zZU9uQXV0b0FwcGx5O1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuXHRcdGZvciAoY29uc3QgY2hhbmdlIGluIGNoYW5nZXMpIHtcblx0XHRcdGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcblx0XHRcdFx0aWYgKHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcblx0XHRcdFx0XHR0aGlzLnBpY2tlcltjaGFuZ2VdID0gY2hhbmdlc1tjaGFuZ2VdLmN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG5nRG9DaGVjaygpIHtcblx0XHRpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcblx0XHRcdGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxvY2FsZURpZmZlci5kaWZmKHRoaXMubG9jYWxlKTtcblx0XHRcdGlmIChjaGFuZ2VzKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0b25CbHVyKCkge1xuXHRcdHRoaXMuX29uVG91Y2hlZCgpO1xuXHR9XG5cblx0b3BlbihldmVudD86IGFueSkge1xuXHRcdGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gb3BlbicpO1xuXHRcdHRoaXMucGlja2VyLnNob3coZXZlbnQpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ3NldCBwb3NpdGlvbicpO1xuXHRcdFx0dGhpcy5zZXRQb3NpdGlvbigpO1xuXHRcdH0pO1xuXHR9XG5cblx0aGlkZShlPykge1xuXHRcdHRoaXMucGlja2VyLmhpZGUoZSk7XG5cdH1cblx0dG9nZ2xlKGU/KSB7XG5cdFx0aWYgKHRoaXMucGlja2VyLmlzU2hvd24pIHtcblx0XHRcdHRoaXMuaGlkZShlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vcGVuKGUpO1xuXHRcdH1cblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdHRoaXMucGlja2VyLmNsZWFyKCk7XG5cdH1cblxuXHR3cml0ZVZhbHVlKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblx0cmVnaXN0ZXJPbkNoYW5nZShmbikge1xuXHRcdHRoaXMuX29uQ2hhbmdlID0gZm47XG5cdH1cblx0cmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcblx0XHR0aGlzLl9vblRvdWNoZWQgPSBmbjtcblx0fVxuXHRwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XG5cdFx0aWYgKHZhbCkge1xuXHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdGlmICh2YWxbdGhpcy5fc3RhcnRLZXldKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZSh2YWxbdGhpcy5fc3RhcnRLZXldKTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWxbdGhpcy5fZW5kS2V5XSkge1xuXHRcdFx0XHR0aGlzLnBpY2tlci5zZXRFbmREYXRlKHZhbFt0aGlzLl9lbmRLZXldKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucGlja2VyLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG5cdFx0XHRpZiAodGhpcy5waWNrZXIuY2hvc2VuTGFiZWwpIHtcblx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMucGlja2VyLmNob3NlbkxhYmVsO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBpY2tlci5jbGVhcigpO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxuXHQgKi9cblx0c2V0UG9zaXRpb24oKSB7XG5cdFx0bGV0IHN0eWxlO1xuXHRcdGxldCBjb250YWluZXJUb3A7XG5cdFx0dGhpcy50b3BBZGp1c3RtZW50ID0gdGhpcy50b3BBZGp1c3RtZW50ID8gK3RoaXMudG9wQWRqdXN0bWVudCA6IDA7XG5cdFx0dGhpcy5sZWZ0QWRqdXN0bWVudCA9IHRoaXMubGVmdEFkanVzdG1lbnQgPyArdGhpcy5sZWZ0QWRqdXN0bWVudCA6IDA7XG5cblx0XHQvLyB0b2RvOiByZXZpc2l0IHRoZSBvZmZzZXRzIHdoZXJlIHdoZW4gYm90aCB0aGUgc2hhcmVkIGNvbXBvbmVudHMgYXJlIGRvbmUgYW5kIHRoZSBvcmRlciBzZWFyY2ggcmV3b3JrIGlzIGZpbmlzaGVkXG5cdFx0Y29uc3QgY29udGFpbmVyID0gdGhpcy5waWNrZXIucGlja2VyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0bGV0IGVsZW1lbnQgPSB0aGlzLl9lbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudElkKSB7XG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRFbGVtZW50SWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0IGVsZW1lbnRMb2NhdGlvbiA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRpZiAodGhpcy5kcm9wcyAmJiB0aGlzLmRyb3BzID09PSAndXAnKSB7XG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50Lm9mZnNldFRvcCAtIGNvbnRhaW5lci5jbGllbnRIZWlnaHQgKyB0aGlzLnRvcEFkanVzdG1lbnQgKyAncHgnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50TG9jYXRpb24udG9wICsgdGhpcy50b3BBZGp1c3RtZW50ICsgJ3B4Jztcblx0XHR9XG5cdFx0aWYgKHRoaXMub3BlbnMgPT09ICdsZWZ0Jykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoKGVsZW1lbnRMb2NhdGlvbi5sZWZ0IC0gY29udGFpbmVyLmNsaWVudFdpZHRoICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC0gMTAwKSAgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAnY2VudGVyJykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDIpICArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdyaWdodCcpIHtcblx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0bGVmdDogKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBwb3NpdGlvbiA9IGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDI7XG5cblx0XHRcdGlmIChwb3NpdGlvbiA8IDApIHtcblx0XHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdFx0bGVmdDogKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRcdGxlZnQ6IChwb3NpdGlvbiArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHN0eWxlIC8qJiYgIXRoaXMuaXNNb2JpbGUqLykge1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgc3R5bGUudG9wKTtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCBzdHlsZS5sZWZ0KTtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3JpZ2h0Jywgc3R5bGUucmlnaHQpO1xuXHRcdH1cblx0fVxuXHRpbnB1dENoYW5nZWQoZSkge1xuXHRcdGlmIChlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdpbnB1dCcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCFlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZGF0ZVN0cmluZyA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KHRoaXMucGlja2VyLmxvY2FsZS5zZXBhcmF0b3IpO1xuXHRcdGxldCBzdGFydCA9IG51bGwsXG5cdFx0XHRlbmQgPSBudWxsO1xuXHRcdGlmIChkYXRlU3RyaW5nLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0c3RhcnQgPSBtb21lbnQoZGF0ZVN0cmluZ1swXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0XHRlbmQgPSBtb21lbnQoZGF0ZVN0cmluZ1sxXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIgfHwgc3RhcnQgPT09IG51bGwgfHwgZW5kID09PSBudWxsKSB7XG5cdFx0XHRzdGFydCA9IG1vbWVudChlLnRhcmdldC52YWx1ZSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0XHRlbmQgPSBzdGFydDtcblx0XHR9XG5cdFx0aWYgKCFzdGFydC5pc1ZhbGlkKCkgfHwgIWVuZC5pc1ZhbGlkKCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHN0YXJ0KTtcblx0XHR0aGlzLnBpY2tlci5zZXRFbmREYXRlKGVuZCk7XG5cdFx0dGhpcy5waWNrZXIudXBkYXRlVmlldygpO1xuXHR9XG5cdC8qKlxuXHQgKiBGb3IgY2xpY2sgb3V0c2lkZSBvZiB0aGUgY2FsZW5kYXIncyBjb250YWluZXJcblx0ICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxuXHQgKi9cblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxuXHRvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIWV2ZW50LnRhcmdldCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZ3gtZGF0ZXJhbmdlcGlja2VyLWFjdGlvbicpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0IXRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiZcblx0XHRcdChldmVudC50YXJnZXQgYXMgSFRNTFNwYW5FbGVtZW50KS5jbGFzc05hbWUuaW5kZXhPZignbWF0LW9wdGlvbicpID09PSAtMVxuXHRcdCkge1xuXHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=