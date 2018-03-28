import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import {WizardFormModalComponent} from '../wizardform/modals/wizard-form-modal.component';
import {DemoBuildProfileWizardComponent} from './build-profile-wizard.component';


@Component({
  selector: 'app-demo-build-profile-modal',
  templateUrl: './build-profile-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoBuildProfileWizardModalComponent extends WizardFormModalComponent {
  @ViewChild(DemoBuildProfileWizardComponent) demoBuildProfileWizardComponent: DemoBuildProfileWizardComponent;

  @Output() success: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(NgZone) zone,
              @Inject(ChangeDetectorRef) cd) {
    super(zone, cd);
  }

  protected onShown() {
    super.onShown();
    this.demoBuildProfileWizardComponent.onResize();
  }

  onHidden() {
    super.onHidden();
    this.demoBuildProfileWizardComponent.reset();
  }

  onSubmit() {
    this.hide();
    this.success.emit();
  }
}
