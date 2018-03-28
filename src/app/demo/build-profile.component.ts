import {Component, ViewChild} from '@angular/core';
import {DemoBuildProfileWizardModalComponent} from './build-profile-modal.component';

@Component({
  selector: 'app-demo-build-profile',
  templateUrl: './build-profile.component.html',
})
export class DemoBuildProfileComponent {
  @ViewChild(DemoBuildProfileWizardModalComponent) wizardModal: DemoBuildProfileWizardModalComponent;

  constructor() {
  }

  openModal() {
    this.wizardModal.show();
  }
}
