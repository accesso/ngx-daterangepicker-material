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
        if (!dateRangePickerElement) {
            var componentFactory = this._componentFactoryResolver.resolveComponentFactory(DateRangePickerComponent);
            var componentRef = componentFactory.create(injector);
            this.applicationRef.attachView(componentRef.hostView);
            var componentElem = componentRef.hostView.rootNodes[0];
            applicationRoot.appendChild(componentElem);
            this.picker = componentRef.instance;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ04sY0FBYyxFQUNkLGlCQUFpQixFQUNqQix3QkFBd0IsRUFDeEIsU0FBUyxFQUNULE9BQU8sRUFDUCxVQUFVLEVBQ1YsZUFBZSxFQUNmLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUVyRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFM0QsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBb0J2QjtJQW9JQyxrQ0FDUSxjQUE4QixFQUM5QixnQkFBa0MsRUFDbEMsUUFBa0IsRUFDbEIsa0JBQXFDLEVBQ3BDLHlCQUFtRCxFQUNuRCxHQUFlLEVBQ2YsU0FBb0IsRUFDcEIsT0FBd0IsRUFDeEIsY0FBNkIsRUFDN0IsVUFBc0I7UUFUdkIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3BDLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMEI7UUFDbkQsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUNmLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDeEIsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQTVJdkIsY0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDL0IsZUFBVSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDaEMscUJBQWdCLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQWlDOUMsY0FBUyxHQUFXLElBQUksQ0FBQztRQXFDekIsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUU1QixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQix1QkFBdUI7UUFFdkIsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUU1QixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFFbEMsd0JBQW1CLEdBQVcsQ0FBQyxDQUFDO1FBRWhDLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUMxQixxQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDakMsWUFBTyxHQUFpQixFQUFFLENBQUM7UUFRbkIsWUFBTyxHQUFXLFNBQVMsQ0FBQztRQUM1QixjQUFTLEdBQVcsV0FBVyxDQUFDO1FBZXhDLDBCQUFxQixHQUFrQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFXeEUsZ0VBQWdFO1FBQzlDLGFBQVEsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RSw0Q0FBNEM7UUFDcEIsaUJBQVksR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRiw0Q0FBNEM7UUFDcEIsaUJBQVksR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RSxxQkFBZ0IsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1RCxtQkFBYyxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBZW5FLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBZ0IsQ0FBQztRQUNwRixJQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUU3RixJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDNUIsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsdUJBQXVCLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUMxRyxJQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELElBQU0sYUFBYSxHQUFJLFlBQVksQ0FBQyxRQUFpQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQWdCLENBQUM7WUFDbEcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsTUFBTSxHQUE2QixZQUFZLENBQUMsUUFBUSxDQUFDO1NBQzlEO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7aUNBL0pXLHdCQUF3QjtJQXdGM0Isc0JBQUksNENBQU07YUFHbkI7WUFDQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDckIsQ0FBQzthQUxRLFVBQVcsS0FBSztZQUN4QixJQUFJLENBQUMsT0FBTyx3QkFBUSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBSyxLQUFLLENBQUUsQ0FBQztRQUM1RCxDQUFDOzs7T0FBQTtJQU9RLHNCQUFJLDhDQUFRO2FBQVosVUFBYSxLQUFLO1lBQzFCLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7YUFDdkI7aUJBQU07Z0JBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7YUFDN0I7UUFDRixDQUFDOzs7T0FBQTtJQUNRLHNCQUFJLDRDQUFNO2FBQVYsVUFBVyxLQUFLO1lBQ3hCLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtnQkFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7YUFDckI7aUJBQU07Z0JBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7YUFDekI7UUFDRixDQUFDOzs7T0FBQTtJQUdELHNCQUFJLDJDQUFLO2FBQVQ7WUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1FBQzVCLENBQUM7YUFDRCxVQUFVLEdBQUc7WUFDWixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QyxDQUFDOzs7T0FMQTtJQThDRCwyQ0FBUSxHQUFSO1FBQUEsaUJBa0NDO1FBakNBLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUMsV0FBZ0I7WUFDdEUsS0FBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFDLFdBQWdCO1lBQ3BFLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUMsS0FBVTtZQUM1RCxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFDLEtBQVU7WUFDNUQsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFXO1lBQzVELElBQUksTUFBTSxFQUFFO2dCQUNYLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDakIsS0FBSyxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUN6QyxLQUFLLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ3JDLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO29CQUMzQyxLQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztpQkFDbEQ7YUFDRDtRQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7UUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUM7UUFDM0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ3RELENBQUM7SUFFRCw4Q0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDakMsS0FBSyxJQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDN0IsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQztpQkFDbkQ7YUFDRDtTQUNEO0lBQ0YsQ0FBQztJQUVELDRDQUFTLEdBQVQ7UUFDQyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELElBQUksT0FBTyxFQUFFO2dCQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN0QztTQUNEO0lBQ0YsQ0FBQztJQUVELHlDQUFNLEdBQU47UUFDQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELHVDQUFJLEdBQUosVUFBSyxLQUFXO1FBQWhCLGlCQUtDO1FBSkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsVUFBVSxDQUFDO1lBQ1YsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELHVDQUFJLEdBQUosVUFBSyxDQUFFO1FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELHlDQUFNLEdBQU4sVUFBTyxDQUFFO1FBQ1IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7YUFBTTtZQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDYjtJQUNGLENBQUM7SUFFRCx3Q0FBSyxHQUFMO1FBQ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsNkNBQVUsR0FBVixVQUFXLEtBQUs7UUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFDRCxtREFBZ0IsR0FBaEIsVUFBaUIsRUFBRTtRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBQ0Qsb0RBQWlCLEdBQWpCLFVBQWtCLEVBQUU7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNPLDJDQUFRLEdBQWhCLFVBQWlCLEdBQVE7UUFDeEIsSUFBSSxHQUFHLEVBQUU7WUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNqQixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUM5QztZQUNELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ25DLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUN2RDtTQUNEO2FBQU07WUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3BCO0lBQ0YsQ0FBQztJQUNEOztPQUVHO0lBQ0gsOENBQVcsR0FBWDtRQUNDLElBQUksS0FBSyxDQUFDO1FBQ1YsSUFBSSxZQUFZLENBQUM7UUFDakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJFLG1IQUFtSDtRQUNuSCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxhQUE0QixDQUFDO1FBQzNFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBNEIsQ0FBQztRQUVwRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3hEO2FBQU07WUFDTixPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUNoQztRQUVELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRXhELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtZQUN0QyxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQ3RGO2FBQU07WUFDTixZQUFZLEdBQUcsZUFBZSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUMvRDtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7WUFDMUIsS0FBSyxHQUFHO2dCQUNQLEdBQUcsRUFBRSxZQUFZO2dCQUNqQixJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJO2dCQUNsSCxLQUFLLEVBQUUsTUFBTTthQUNiLENBQUM7U0FDRjthQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDbkMsS0FBSyxHQUFHO2dCQUNQLEdBQUcsRUFBRSxZQUFZO2dCQUNqQixJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSTtnQkFDcEgsS0FBSyxFQUFFLE1BQU07YUFDYixDQUFDO1NBQ0Y7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxFQUFFO1lBQ2xDLEtBQUssR0FBRztnQkFDUCxHQUFHLEVBQUUsWUFBWTtnQkFDakIsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSTtnQkFDekQsS0FBSyxFQUFFLE1BQU07YUFDYixDQUFDO1NBQ0Y7YUFBTTtZQUNOLElBQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFFOUYsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQixLQUFLLEdBQUc7b0JBQ1AsR0FBRyxFQUFFLFlBQVk7b0JBQ2pCLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUk7b0JBQ3pELEtBQUssRUFBRSxNQUFNO2lCQUNiLENBQUM7YUFDRjtpQkFBTTtnQkFDTixLQUFLLEdBQUc7b0JBQ1AsR0FBRyxFQUFFLFlBQVk7b0JBQ2pCLElBQUksRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSTtvQkFDN0MsS0FBSyxFQUFFLE1BQU07aUJBQ2IsQ0FBQzthQUNGO1NBQ0Q7UUFFRCxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsRUFBRTtZQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6RDtJQUNGLENBQUM7SUFDRCwrQ0FBWSxHQUFaLFVBQWEsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxFQUFFO1lBQy9DLE9BQU87U0FDUDtRQUNELElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDM0IsT0FBTztTQUNQO1FBQ0QsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksS0FBSyxHQUFHLElBQUksRUFDZixHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ1osSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1QixLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6RCxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2RDtRQUNELElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtZQUM1RCxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELEdBQUcsR0FBRyxLQUFLLENBQUM7U0FDWjtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDdkMsT0FBTztTQUNQO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBQ0Q7OztPQUdHO0lBRUgsK0NBQVksR0FBWixVQUFhLEtBQUs7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbEIsT0FBTztTQUNQO1FBRUQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsRUFBRTtZQUNsRSxPQUFPO1NBQ1A7UUFFRCxJQUNDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDcEQsS0FBSyxDQUFDLE1BQTBCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDdkU7WUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtJQUNGLENBQUM7OztnQkF4UHVCLGNBQWM7Z0JBQ1osZ0JBQWdCO2dCQUN4QixRQUFRO2dCQUNFLGlCQUFpQjtnQkFDVCx3QkFBd0I7Z0JBQzlDLFVBQVU7Z0JBQ0osU0FBUztnQkFDWCxlQUFlO2dCQUNSLGFBQWE7Z0JBQ2pCLFVBQVU7O0lBdEkvQjtRQURDLEtBQUssRUFBRTs2REFDZ0I7SUFFeEI7UUFEQyxLQUFLLEVBQUU7NkRBQ2dCO0lBRXhCO1FBREMsS0FBSyxFQUFFOytEQUNXO0lBTW5CO1FBREMsS0FBSyxFQUFFO3FFQUNnQjtJQUV4QjtRQURDLEtBQUssRUFBRTttRUFDYztJQUV0QjtRQURDLEtBQUssRUFBRTtvRUFDZTtJQUd2QjtRQURDLEtBQUssRUFBRTt5RUFDcUI7SUFFN0I7UUFEQyxLQUFLLEVBQUU7MEVBQ3NCO0lBRTlCO1FBREMsS0FBSyxFQUFFO3FFQUNpQjtJQUV6QjtRQURDLEtBQUssRUFBRTtzRUFDaUI7SUFFekI7UUFEQyxLQUFLLEVBQUU7c0VBQ2lCO0lBRXpCO1FBREMsS0FBSyxFQUFFO3NFQUNpQjtJQUV6QjtRQURDLEtBQUssRUFBRTsrREFDaUI7SUFFekI7UUFEQyxLQUFLLEVBQUU7c0VBQ2tCO0lBRTFCO1FBREMsS0FBSyxFQUFFO3FFQUNpQjtJQUV6QjtRQURDLEtBQUssRUFBRTt3RUFDb0I7SUFFNUI7UUFEQyxLQUFLLEVBQUU7bUVBQ2U7SUFFdkI7UUFEQyxLQUFLLEVBQUU7bUVBQ2dCO0lBRXhCO1FBREMsS0FBSyxFQUFFO2tFQUNlO0lBRXZCO1FBREMsS0FBSyxFQUFFO3FFQUNpQjtJQUV6QjtRQURDLEtBQUssRUFBRTswRUFDc0I7SUFFOUI7UUFEQyxLQUFLLEVBQUU7NERBQ2tCO0lBRTFCO1FBREMsS0FBSyxFQUFFOzJEQUNNO0lBRWQ7UUFEQyxLQUFLLEVBQUU7MkRBQ007SUFHZDtRQURDLEtBQUssRUFBRTt1RUFDa0I7SUFFMUI7UUFEQyxLQUFLLEVBQUU7dUVBQ2tCO0lBRTFCO1FBREMsS0FBSyxFQUFFOzhFQUN5QjtJQUVqQztRQURDLEtBQUssRUFBRTtpRkFDNEI7SUFFcEM7UUFEQyxLQUFLLEVBQUU7a0ZBQzhCO0lBRXRDO1FBREMsS0FBSyxFQUFFOzJFQUN1QjtJQUUvQjtRQURDLEtBQUssRUFBRTtnRUFDb0I7SUFFNUI7UUFEQyxLQUFLLEVBQUU7bUVBQ3VCO0lBRy9CO1FBREMsS0FBSyxFQUFFO2dFQUNvQjtJQUU1QjtRQURDLEtBQUssRUFBRTtzRUFDMEI7SUFFbEM7UUFEQyxLQUFLLEVBQUU7eUVBQ3dCO0lBRWhDO1FBREMsS0FBSyxFQUFFO3VFQUMyQjtJQUMxQjtRQUFSLEtBQUssRUFBRTtzRUFBeUI7SUFFeEI7UUFBUixLQUFLLEVBQUU7MERBRVA7SUFLRDtRQURDLEtBQUssRUFBRTs2REFDNEI7SUFFM0I7UUFBUixLQUFLLEVBQUU7NERBTVA7SUFDUTtRQUFSLEtBQUssRUFBRTswREFNUDtJQWFpQjtRQUFqQixNQUFNLENBQUMsUUFBUSxDQUFDOzhEQUFxRDtJQUU5QztRQUF2QixNQUFNLENBQUMsY0FBYyxDQUFDO2tFQUF5RDtJQUV4RDtRQUF2QixNQUFNLENBQUMsY0FBYyxDQUFDO2tFQUF5RDtJQUN0RTtRQUFULE1BQU0sRUFBRTtzRUFBNkQ7SUFDNUQ7UUFBVCxNQUFNLEVBQUU7b0VBQTJEO0lBNk9wRTtRQURDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dFQWdCMUM7SUE3WFcsd0JBQXdCO1FBbEJwQyxTQUFTLENBQUM7WUFDViw4Q0FBOEM7WUFDOUMsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxxREFBcUQ7WUFDckQsSUFBSSxFQUFFO2dCQUNMLGFBQWEsRUFBRSxRQUFRO2dCQUN2QixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFNBQVMsRUFBRSxzQkFBc0I7YUFDakM7WUFDRCxTQUFTLEVBQUU7Z0JBQ1Y7b0JBQ0MsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsMEJBQXdCLEVBQXhCLENBQXdCLENBQUM7b0JBQ3ZELEtBQUssRUFBRSxJQUFJO2lCQUNYO2FBQ0Q7U0FDRCxDQUFDO09BQ1csd0JBQXdCLENBOFhwQztJQUFELCtCQUFDO0NBQUEsQUE5WEQsSUE4WEM7U0E5WFksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QXBwbGljYXRpb25SZWYsXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG5cdERpcmVjdGl2ZSxcblx0RG9DaGVjayxcblx0RWxlbWVudFJlZixcblx0RW1iZWRkZWRWaWV3UmVmLFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEhvc3RMaXN0ZW5lcixcblx0SW5qZWN0b3IsXG5cdElucHV0LFxuXHRLZXlWYWx1ZURpZmZlcixcblx0S2V5VmFsdWVEaWZmZXJzLFxuXHRPbkNoYW5nZXMsXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRSZW5kZXJlcjIsXG5cdFNpbXBsZUNoYW5nZXMsXG5cdFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERhdGVSYW5nZVByZXNldCB9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyLm1vZGVscyc7XG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5jb25maWcnO1xuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsZS5zZXJ2aWNlJztcblxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcblxuQERpcmVjdGl2ZSh7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3Jcblx0c2VsZWN0b3I6ICcqW25neERhdGVSYW5nZVBpY2tlck1kXScsXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LW1ldGFkYXRhLXByb3BlcnR5XG5cdGhvc3Q6IHtcblx0XHQnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcblx0XHQnKGJsdXIpJzogJ29uQmx1cigpJyxcblx0XHQnKGNsaWNrKSc6ICdvcGVuKCknLFxuXHRcdCcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xuXHR9LFxuXHRwcm92aWRlcnM6IFtcblx0XHR7XG5cdFx0XHRwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVSYW5nZVBpY2tlckRpcmVjdGl2ZSksXG5cdFx0XHRtdWx0aTogdHJ1ZVxuXHRcdH1cblx0XVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlUmFuZ2VQaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG5cdHB1YmxpYyBwaWNrZXI6IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudDtcblx0cHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0cHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRwcml2YXRlIF92YWx1ZTogYW55O1xuXHRwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuXHRASW5wdXQoKVxuXHRtaW5EYXRlOiBfbW9tZW50Lk1vbWVudDtcblx0QElucHV0KClcblx0bWF4RGF0ZTogX21vbWVudC5Nb21lbnQ7XG5cdEBJbnB1dCgpXG5cdGF1dG9BcHBseTogYm9vbGVhbjtcblxuXHQvLyBASW5wdXQoKVxuXHQvLyBpc01vYmlsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdEBJbnB1dCgpXG5cdHRhcmdldEVsZW1lbnRJZDogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHR0b3BBZGp1c3RtZW50OiBudW1iZXI7XG5cdEBJbnB1dCgpXG5cdGxlZnRBZGp1c3RtZW50OiBudW1iZXI7XG5cblx0QElucHV0KClcblx0YWx3YXlzU2hvd0NhbGVuZGFyczogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdGxpbmtlZENhbGVuZGFyczogYm9vbGVhbjtcblx0QElucHV0KClcblx0YnV0dG9uQ2xhc3NBcHBseTogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRidXR0b25DbGFzc1Jlc2V0OiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGJ1dHRvbkNsYXNzUmFuZ2U6IHN0cmluZztcblx0QElucHV0KClcblx0ZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xuXHRASW5wdXQoKVxuXHRzaW5nbGVEYXRlUGlja2VyOiBib29sZWFuO1xuXHRASW5wdXQoKVxuXHRzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dJU09XZWVrTnVtYmVyczogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd0Ryb3Bkb3duczogYm9vbGVhbjtcblx0QElucHV0KClcblx0aXNJbnZhbGlkRGF0ZTogRnVuY3Rpb247XG5cdEBJbnB1dCgpXG5cdGlzQ3VzdG9tRGF0ZTogRnVuY3Rpb247XG5cdEBJbnB1dCgpXG5cdHNob3dDbGVhckJ1dHRvbjogYm9vbGVhbjtcblx0QElucHV0KClcblx0Y3VzdG9tUmFuZ2VEaXJlY3Rpb246IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHJhbmdlczogRGF0ZVJhbmdlUHJlc2V0W107XG5cdEBJbnB1dCgpXG5cdG9wZW5zOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGRyb3BzOiBzdHJpbmc7XG5cdGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKVxuXHRmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZztcblx0QElucHV0KClcblx0bGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpXG5cdGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHNob3dSYW5nZUxhYmVsT25JbnB1dDogYm9vbGVhbjtcblx0QElucHV0KClcblx0c2hvd0NhbmNlbDogYm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHRsb2NrU3RhcnREYXRlOiBib29sZWFuID0gZmFsc2U7XG5cdC8vIHRpbWVwaWNrZXIgdmFyaWFibGVzXG5cdEBJbnB1dCgpXG5cdHRpbWVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcblx0QElucHV0KClcblx0dGltZVBpY2tlcjI0SG91cjogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VySW5jcmVtZW50OiBudW1iZXIgPSAxO1xuXHRASW5wdXQoKVxuXHR0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xuXHRASW5wdXQoKSBjbG9zZU9uQXV0b0FwcGx5ID0gdHJ1ZTtcblx0X2xvY2FsZTogTG9jYWxlQ29uZmlnID0ge307XG5cdEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcblx0XHR0aGlzLl9sb2NhbGUgPSB7IC4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZSB9O1xuXHR9XG5cdGdldCBsb2NhbGUoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxlO1xuXHR9XG5cdEBJbnB1dCgpXG5cdHByaXZhdGUgX2VuZEtleTogc3RyaW5nID0gJ2VuZERhdGUnO1xuXHRwcml2YXRlIF9zdGFydEtleTogc3RyaW5nID0gJ3N0YXJ0RGF0ZSc7XG5cdEBJbnB1dCgpIHNldCBzdGFydEtleSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fc3RhcnRLZXkgPSB2YWx1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcblx0XHR9XG5cdH1cblx0QElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fZW5kS2V5ID0gdmFsdWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2VuZEtleSA9ICdlbmREYXRlJztcblx0XHR9XG5cdH1cblx0bm90Rm9yQ2hhbmdlc1Byb3BlcnR5OiBBcnJheTxzdHJpbmc+ID0gWydsb2NhbGUnLCAnZW5kS2V5JywgJ3N0YXJ0S2V5J107XG5cblx0Z2V0IHZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzLl92YWx1ZSB8fCBudWxsO1xuXHR9XG5cdHNldCB2YWx1ZSh2YWwpIHtcblx0XHR0aGlzLl92YWx1ZSA9IHZhbDtcblx0XHR0aGlzLl9vbkNoYW5nZSh2YWwpO1xuXHRcdHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXHR9XG5cblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXggbm8tb3V0cHV0LXJlbmFtZVxuXHRAT3V0cHV0KCdjaGFuZ2UnKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtcmVuYW1lXG5cdEBPdXRwdXQoJ3JhbmdlQ2xpY2tlZCcpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtcmVuYW1lXG5cdEBPdXRwdXQoJ2RhdGVzVXBkYXRlZCcpIGRhdGVzVXBkYXRlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBzdGFydERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0QE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0JGV2ZW50OiBhbnk7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHVibGljIGFwcGxpY2F0aW9uUmVmOiBBcHBsaWNhdGlvblJlZixcblx0XHRwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcblx0XHRwdWJsaWMgaW5qZWN0b3I6IEluamVjdG9yLFxuXHRcdHB1YmxpYyBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuXHRcdHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuXHRcdHByaXZhdGUgX2VsOiBFbGVtZW50UmVmLFxuXHRcdHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG5cdFx0cHJpdmF0ZSBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXG5cdFx0cHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSxcblx0XHRwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWZcblx0KSB7XG5cdFx0dGhpcy5kcm9wcyA9ICdkb3duJztcblx0XHR0aGlzLm9wZW5zID0gJ2F1dG8nO1xuXHRcdGNvbnN0IGFwcGxpY2F0aW9uUm9vdCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignKltuZy12ZXJzaW9uXScpIGFzIEhUTUxFbGVtZW50O1xuXHRcdGNvbnN0IGRhdGVSYW5nZVBpY2tlckVsZW1lbnQgPSBhcHBsaWNhdGlvblJvb3QucXVlcnlTZWxlY3Rvcignbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbCcpO1xuXG5cdFx0aWYgKCFkYXRlUmFuZ2VQaWNrZXJFbGVtZW50KSB7XG5cdFx0XHRjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCk7XG5cdFx0XHRjb25zdCBjb21wb25lbnRSZWYgPSBjb21wb25lbnRGYWN0b3J5LmNyZWF0ZShpbmplY3Rvcik7XG5cdFx0XHR0aGlzLmFwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcblx0XHRcdGNvbnN0IGNvbXBvbmVudEVsZW0gPSAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG5cdFx0XHRhcHBsaWNhdGlvblJvb3QuYXBwZW5kQ2hpbGQoY29tcG9uZW50RWxlbSk7XG5cdFx0XHR0aGlzLnBpY2tlciA9IDxEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ+Y29tcG9uZW50UmVmLmluc3RhbmNlO1xuXHRcdH1cblxuXHRcdHRoaXMucGlja2VyLmlubGluZSA9IGZhbHNlO1xuXHR9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5waWNrZXIuc3RhcnREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcblx0XHR9KTtcblx0XHR0aGlzLnBpY2tlci5lbmREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIucmFuZ2VDbGlja2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5yYW5nZUNsaWNrZWQuZW1pdChyYW5nZSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuZGF0ZXNVcGRhdGVkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5kYXRlc1VwZGF0ZWQuZW1pdChyYW5nZSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5waWNrZXIuY2hvb3NlZERhdGUuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0aWYgKGNoYW5nZSkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHt9O1xuXHRcdFx0XHR2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBjaGFuZ2Uuc3RhcnREYXRlO1xuXHRcdFx0XHR2YWx1ZVt0aGlzLl9lbmRLZXldID0gY2hhbmdlLmVuZERhdGU7XG5cdFx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy5vbkNoYW5nZS5lbWl0KHZhbHVlKTtcblx0XHRcdFx0aWYgKHR5cGVvZiBjaGFuZ2UuY2hvc2VuTGFiZWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IGNoYW5nZS5jaG9zZW5MYWJlbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMucGlja2VyLmZpcnN0TW9udGhEYXlDbGFzcyA9IHRoaXMuZmlyc3RNb250aERheUNsYXNzO1xuXHRcdHRoaXMucGlja2VyLmxhc3RNb250aERheUNsYXNzID0gdGhpcy5sYXN0TW9udGhEYXlDbGFzcztcblx0XHR0aGlzLnBpY2tlci5lbXB0eVdlZWtSb3dDbGFzcyA9IHRoaXMuZW1wdHlXZWVrUm93Q2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZmlyc3REYXlPZk5leHRNb250aENsYXNzID0gdGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3M7XG5cdFx0dGhpcy5waWNrZXIubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzID0gdGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M7XG5cdFx0dGhpcy5waWNrZXIuZHJvcHMgPSB0aGlzLmRyb3BzO1xuXHRcdHRoaXMucGlja2VyLm9wZW5zID0gdGhpcy5vcGVucztcblx0XHR0aGlzLmxvY2FsZURpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMubG9jYWxlKS5jcmVhdGUoKTtcblx0XHR0aGlzLnBpY2tlci5jbG9zZU9uQXV0b0FwcGx5ID0gdGhpcy5jbG9zZU9uQXV0b0FwcGx5O1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuXHRcdGZvciAoY29uc3QgY2hhbmdlIGluIGNoYW5nZXMpIHtcblx0XHRcdGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcblx0XHRcdFx0aWYgKHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcblx0XHRcdFx0XHR0aGlzLnBpY2tlcltjaGFuZ2VdID0gY2hhbmdlc1tjaGFuZ2VdLmN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG5nRG9DaGVjaygpIHtcblx0XHRpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcblx0XHRcdGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxvY2FsZURpZmZlci5kaWZmKHRoaXMubG9jYWxlKTtcblx0XHRcdGlmIChjaGFuZ2VzKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0b25CbHVyKCkge1xuXHRcdHRoaXMuX29uVG91Y2hlZCgpO1xuXHR9XG5cblx0b3BlbihldmVudD86IGFueSkge1xuXHRcdHRoaXMucGlja2VyLnNob3coZXZlbnQpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5zZXRQb3NpdGlvbigpO1xuXHRcdH0pO1xuXHR9XG5cblx0aGlkZShlPykge1xuXHRcdHRoaXMucGlja2VyLmhpZGUoZSk7XG5cdH1cblx0dG9nZ2xlKGU/KSB7XG5cdFx0aWYgKHRoaXMucGlja2VyLmlzU2hvd24pIHtcblx0XHRcdHRoaXMuaGlkZShlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vcGVuKGUpO1xuXHRcdH1cblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdHRoaXMucGlja2VyLmNsZWFyKCk7XG5cdH1cblxuXHR3cml0ZVZhbHVlKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblx0cmVnaXN0ZXJPbkNoYW5nZShmbikge1xuXHRcdHRoaXMuX29uQ2hhbmdlID0gZm47XG5cdH1cblx0cmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcblx0XHR0aGlzLl9vblRvdWNoZWQgPSBmbjtcblx0fVxuXHRwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XG5cdFx0aWYgKHZhbCkge1xuXHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdGlmICh2YWxbdGhpcy5fc3RhcnRLZXldKSB7XG5cdFx0XHRcdHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZSh2YWxbdGhpcy5fc3RhcnRLZXldKTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWxbdGhpcy5fZW5kS2V5XSkge1xuXHRcdFx0XHR0aGlzLnBpY2tlci5zZXRFbmREYXRlKHZhbFt0aGlzLl9lbmRLZXldKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucGlja2VyLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG5cdFx0XHRpZiAodGhpcy5waWNrZXIuY2hvc2VuTGFiZWwpIHtcblx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMucGlja2VyLmNob3NlbkxhYmVsO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBpY2tlci5jbGVhcigpO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxuXHQgKi9cblx0c2V0UG9zaXRpb24oKSB7XG5cdFx0bGV0IHN0eWxlO1xuXHRcdGxldCBjb250YWluZXJUb3A7XG5cdFx0dGhpcy50b3BBZGp1c3RtZW50ID0gdGhpcy50b3BBZGp1c3RtZW50ID8gK3RoaXMudG9wQWRqdXN0bWVudCA6IDA7XG5cdFx0dGhpcy5sZWZ0QWRqdXN0bWVudCA9IHRoaXMubGVmdEFkanVzdG1lbnQgPyArdGhpcy5sZWZ0QWRqdXN0bWVudCA6IDA7XG5cblx0XHQvLyB0b2RvOiByZXZpc2l0IHRoZSBvZmZzZXRzIHdoZXJlIHdoZW4gYm90aCB0aGUgc2hhcmVkIGNvbXBvbmVudHMgYXJlIGRvbmUgYW5kIHRoZSBvcmRlciBzZWFyY2ggcmV3b3JrIGlzIGZpbmlzaGVkXG5cdFx0Y29uc3QgY29udGFpbmVyID0gdGhpcy5waWNrZXIucGlja2VyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0bGV0IGVsZW1lbnQgPSB0aGlzLl9lbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudElkKSB7XG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRFbGVtZW50SWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0IGVsZW1lbnRMb2NhdGlvbiA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRpZiAodGhpcy5kcm9wcyAmJiB0aGlzLmRyb3BzID09PSAndXAnKSB7XG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50Lm9mZnNldFRvcCAtIGNvbnRhaW5lci5jbGllbnRIZWlnaHQgKyB0aGlzLnRvcEFkanVzdG1lbnQgKyAncHgnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50TG9jYXRpb24udG9wICsgdGhpcy50b3BBZGp1c3RtZW50ICsgJ3B4Jztcblx0XHR9XG5cdFx0aWYgKHRoaXMub3BlbnMgPT09ICdsZWZ0Jykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoKGVsZW1lbnRMb2NhdGlvbi5sZWZ0IC0gY29udGFpbmVyLmNsaWVudFdpZHRoICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC0gMTAwKSAgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAnY2VudGVyJykge1xuXHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRsZWZ0OiAoKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDIpICArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdyaWdodCcpIHtcblx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcblx0XHRcdFx0bGVmdDogKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBwb3NpdGlvbiA9IGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDI7XG5cblx0XHRcdGlmIChwb3NpdGlvbiA8IDApIHtcblx0XHRcdFx0c3R5bGUgPSB7XG5cdFx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXG5cdFx0XHRcdFx0bGVmdDogKGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxuXHRcdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0eWxlID0ge1xuXHRcdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxuXHRcdFx0XHRcdGxlZnQ6IChwb3NpdGlvbiArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4Jyxcblx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHN0eWxlIC8qJiYgIXRoaXMuaXNNb2JpbGUqLykge1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgc3R5bGUudG9wKTtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCBzdHlsZS5sZWZ0KTtcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3JpZ2h0Jywgc3R5bGUucmlnaHQpO1xuXHRcdH1cblx0fVxuXHRpbnB1dENoYW5nZWQoZSkge1xuXHRcdGlmIChlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdpbnB1dCcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCFlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZGF0ZVN0cmluZyA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KHRoaXMucGlja2VyLmxvY2FsZS5zZXBhcmF0b3IpO1xuXHRcdGxldCBzdGFydCA9IG51bGwsXG5cdFx0XHRlbmQgPSBudWxsO1xuXHRcdGlmIChkYXRlU3RyaW5nLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0c3RhcnQgPSBtb21lbnQoZGF0ZVN0cmluZ1swXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0XHRlbmQgPSBtb21lbnQoZGF0ZVN0cmluZ1sxXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIgfHwgc3RhcnQgPT09IG51bGwgfHwgZW5kID09PSBudWxsKSB7XG5cdFx0XHRzdGFydCA9IG1vbWVudChlLnRhcmdldC52YWx1ZSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG5cdFx0XHRlbmQgPSBzdGFydDtcblx0XHR9XG5cdFx0aWYgKCFzdGFydC5pc1ZhbGlkKCkgfHwgIWVuZC5pc1ZhbGlkKCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHN0YXJ0KTtcblx0XHR0aGlzLnBpY2tlci5zZXRFbmREYXRlKGVuZCk7XG5cdFx0dGhpcy5waWNrZXIudXBkYXRlVmlldygpO1xuXHR9XG5cdC8qKlxuXHQgKiBGb3IgY2xpY2sgb3V0c2lkZSBvZiB0aGUgY2FsZW5kYXIncyBjb250YWluZXJcblx0ICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxuXHQgKi9cblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxuXHRvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIWV2ZW50LnRhcmdldCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZ3gtZGF0ZXJhbmdlcGlja2VyLWFjdGlvbicpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0IXRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiZcblx0XHRcdChldmVudC50YXJnZXQgYXMgSFRNTFNwYW5FbGVtZW50KS5jbGFzc05hbWUuaW5kZXhPZignbWF0LW9wdGlvbicpID09PSAtMVxuXHRcdCkge1xuXHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=