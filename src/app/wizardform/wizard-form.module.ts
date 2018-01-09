import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {WizardFormComponent} from './wizard-form.component';
import {WizardFormStepComponent} from './components/wizard-step.component';
import {WizardFormRadioIconListInputComponent} from './components/radio-icon-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    WizardFormComponent,
    WizardFormStepComponent,
    WizardFormRadioIconListInputComponent,
  ],
  exports: [
    WizardFormComponent,
    WizardFormStepComponent,
    WizardFormRadioIconListInputComponent,
  ]
})
export class WizardFormModule {
}
