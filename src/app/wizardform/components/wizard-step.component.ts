import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormGroup, ValidationErrors} from '@angular/forms';

@Component({
  selector: '[formGroup] wi-step, [formGroupName] wi-step',
  templateUrl: 'wizard-step.component.html',
})
export class WizardFormStepComponent implements OnInit {
  private _hidden = false;
  @Input() title: string;
  @Input() showNext = true;
  @Input() showPrev = true;

  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output() hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _isActive = false;
  private stepFormGroup: FormGroup;

  constructor(private controlContainer: ControlContainer) {
  }

  ngOnInit() {
    this.stepFormGroup = <FormGroup> this.controlContainer.control;
    if (this.isHidden) {
      this.stepFormGroup.disable();
    } else {
      this.stepFormGroup.enable();
    }
  }

  @Input('isActive')
  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  @Input('hidden')
  set isHidden(value: boolean) {
    this._hidden = value;
    this.hide.emit(value);
    if (!this.stepFormGroup) {
      return;
    }
    if (value) {
      this.stepFormGroup.disable();
    } else {
      this.stepFormGroup.enable();
    }
  }

  get isHidden(): boolean {
    return this._hidden;
  }

  get isValid() {
    return this.stepFormGroup && !this.isHidden ? this.stepFormGroup.valid : true;
  }

  get isTouched() {
    return this.stepFormGroup && !this.isHidden ? this.stepFormGroup.touched : false;
  }

  get isDirty() {
    return this.stepFormGroup && !this.isHidden ? this.stepFormGroup.dirty : false;
  }

  private touchComponents(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      if (control != null) {
        control.markAsTouched({onlySelf: true});
        control.markAsDirty();
        // const controlErrors: ValidationErrors = control.errors;
        // if (controlErrors != null) {
        //   Object.keys(controlErrors).forEach(keyError => {
        //     console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        //   });
        // }
        const abstractControls = (control as FormGroup);
        if (abstractControls.controls) {
          // console.log(key, abstractControls.controls);
          this.touchComponents(abstractControls);
        }
      }
    });
  }

  public touchInnerComponents() {
    this.touchComponents(this.stepFormGroup);
  }

  private hasError() {
    return this.stepFormGroup ?
      !this.isValid && (this.isTouched || this.isDirty)
      : false;
  }
}
