import {Component, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {trigger, state, transition, style, animate} from '@angular/animations';

import {WizardFormComponent} from '../wizardform/wizard-form.component';

@Component({
  selector: 'app-demo-build-profile-wizard',
  templateUrl: './build-profile-wizard.component.html',
  animations: [
    trigger('pictureChange', [
      state('shown', style({opacity: 1})),
      state('hidden', style({opacity: 0})),
      transition('shown => hidden', animate('100ms')),
      transition('hidden => shown', animate('3000ms')),
    ])
  ]
})
export class DemoBuildProfileWizardComponent {
  @ViewChild(WizardFormComponent) wizard: WizardFormComponent;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  private profileForm: FormGroup;
  private wizardPictureUrl = 'assets/img/default-avatar.png';
  private wizardPictureUrlState = 'shown';

  private profileTypeOptions: any = [{
    'class': 'col-sm-6',
    value: 'Person',
    label: 'Personal',
    icon: 'person',
  }, {
    'class': 'col-sm-6',
    value: 'Business',
    label: 'Business',
    icon: 'business',
  }];

  private legalRepresentatives: any = [
    'Juan Rodriguez',
    'Pedro Garcia',
    'Rodrigo Gutierrez'
  ];

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  private createForm() {
    this.profileForm = this.fb.group({
      type: this.fb.group({
        type: ['', Validators.required],
      }),
      aboutPerson: this.fb.group({
        profilePicture: '',
        name: ['', [Validators.minLength(3), Validators.required]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [
          Validators.email,
          Validators.required
        ]],
      }),
      aboutBusiness: this.fb.group({
        name: ['', [Validators.minLength(3), Validators.required]],
        legalRepresentative: ['', Validators.required],
      }),
      aboutDummy: null, // Dummy step to maintain an about title visible
      // before select a type of profile
      address: this.fb.group({
        street: ['', [Validators.required]],
        number: ['', [Validators.required, Validators.min(1)]],
        extension: '',
        city: ['', Validators.required],
      })
    });
  }

  private displayBootstrapClass(field: string) {
    return WizardFormComponent.displayBootstrapClass(this.profileForm, field);
  }

  private profilePictureRead(event, imgElement) {
    const uploadPromise = WizardFormComponent.updatePicturePreview(event, imgElement);
    uploadPromise.then((file) => {
      // file will contain the event.target.files[0] data
      // Here you can post the file to the server or whatever you need to do
      // with it
      console.log('build-profile.component, file "uploaded"', file);
    }).catch(() => {
      console.log('build-profile.component, file "upload" FAIL');
    });
  }

  onResize() {
    this.wizard.onResize();
  }

  reset() {
    this.wizard.resetActive();
  }

  onSubmit(ev: Event) {
    this.submit.emit();
  }
}
