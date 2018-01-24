import {Component, forwardRef, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';

export interface Data {
  'class': string;
  value: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'wi-radio-icon-list',
  templateUrl: 'radio-icon-list.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WizardFormRadioIconListInputComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => WizardFormRadioIconListInputComponent),
      multi: true,
    }
  ]
})
export class WizardFormRadioIconListInputComponent implements ControlValueAccessor, Validator {

  private _choice: any = '';
  private propagateValidator: (value: any) => void;
  private propagateChange: (value: any) => void;
  private propagateTouch: (value: any) => void;

  @Input() data: Data;

  private _disabled: boolean | null;
  @Input('attr.disabled') set disabled(value: boolean) {
    this._disabled = value ? value : null;
  }

  get disabled() {
    return this._disabled;
  }


  get choice(): any {
    return this._choice;
  }

  set choice(value: any) {
    if (this._choice !== value) {
      this._choice = value;
      this.propagateChange(this.choice);
    }
  }


  constructor() {
  }

  public writeValue(value: any): void {
    if (value) {
      this.choice = value;
    }
  }

  public registerOnChange(fn: (value: any) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: (value: any) => void) {
    this.propagateTouch = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.propagateValidator = fn;
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return this.choice && this.choice === 'Unknown' ?
      {
        'valid': true, // not passed test
      } : null;
  }

  selectChoice(choice: any) {
    this.choice = choice;
  }
}
