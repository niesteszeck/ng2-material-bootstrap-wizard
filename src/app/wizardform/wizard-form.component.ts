import {
  AfterContentInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {WizardFormStepComponent} from './components/wizard-step.component';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'wi-form',
  exportAs: 'wiForm',
  templateUrl: 'wizard-form.component.html',
  styleUrls: ['wizard-form.component.scss']
})
export class WizardFormComponent
  implements AfterContentInit,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {

  @ContentChildren(WizardFormStepComponent) wizardSteps: QueryList<WizardFormStepComponent>;
  private _steps: Array<WizardFormStepComponent> = [];

  @Input() title: string;
  @Input() subTitle: string;
  @Input() doneBtnText = 'Done';
  @Input() nextBtnText = 'Next';
  @Input() previousBtnText = 'Previous';
  @Input() dataColor: string;
  @Input() formGroup: FormGroup;

  @Output() onStepChanged: EventEmitter<WizardFormStepComponent> = new EventEmitter<WizardFormStepComponent>();
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  // moving tab related variables
  private liWidth: string;
  private moveDistance: number;
  private stepHeight: number;
  private stepWidth: number;
  private movingTabTitle: string;
  private verticalLevel: number;
  private _liElements = [];
  private onStepHideSubscription: Subscription = new Subscription();
  @ViewChild('navPillsContainer') navPillsContainer: ElementRef;
  @ViewChildren('liElements') liElements;


  // region utils
  public static displayBootstrapClass(form: FormGroup, field: string) {
    return {
      'has-error': this.fieldHasError(form, field),
      'has-feedback': this.fieldHasError(form, field),
      'is-empty': this.fieldIsEmpty(form, field)
    };
  }

  private static fieldHasError(form: FormGroup, field: string) {
    const component = form.get(field);
    return component ? !component.valid && component.touched : false;
  }

  private static fieldIsEmpty(form: FormGroup, field: string) {
    const component = form.get(field);
    return component ? component.value === '' : false;
  }

  public static updatePicturePreview(event: any, previewElement: any): Promise<File> {
    const reader: FileReader = new FileReader();
    const fileList: FileList = event.target.files;
    const loadPromise = new Promise((resolve, reject) => {
      if (fileList.length > 0) {
        const file: File = fileList[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          previewElement.src = reader.result;
          resolve(file);
        };
      } else {
        reject();
      }
    });
    return loadPromise;
  }

  // endregion

  constructor(private cdr: ChangeDetectorRef,
              private el: ElementRef) {
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => {
      this._steps.push(step);
    });
    this.steps[0].isActive = true;
  }

  ngAfterViewChecked() {

  }

  ngAfterViewInit() {
    this.wizardSteps.forEach(step => {
      this.onStepHideSubscription.add(step.hide.subscribe(
        () => {
          this.updateMovingTab(this.activeStep);
        }));

    });
    // get li elements
    this._liElements = [];
    this.liElements.toArray().map(li => {
      this._liElements.push(li);
    });

    this.updateMovingTab(this.activeStep);
    // this.onResize();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.onStepHideSubscription.unsubscribe();
  }

  get steps(): Array<WizardFormStepComponent> {
    return this._steps.filter(step => !step.isHidden);
  }

  getAllSteps(): Array<WizardFormStepComponent> {
    return this._steps;
  }

  get activeStep(): WizardFormStepComponent {
    return this.steps.find(step => step.isActive);
  }

  public get activeStepIndex(): number {
    return this.getStepIndex(this.activeStep);
  }

  private getStepIndex(step: WizardFormStepComponent): number {
    return this.steps.indexOf(step);
  }

  set activeStep(step: WizardFormStepComponent) {
    if (step !== this.activeStep) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.updateMovingTab(step);
      this.onStepChanged.emit(step);
    }
  }

  // region state
  get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  // endregion

  // region navigation
  public next(): void {
    if (this.hasNextStep && this.activeStep.isValid) {
      const nextStep: WizardFormStepComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep = nextStep;
      this.activeStep.onNext.emit();
    } else if (!this.activeStep.isValid) {
      this.activeStep.touchInnerComponents();
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      const prevStep: WizardFormStepComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep = prevStep;
      this.activeStep.onPrev.emit();
    }
  }

  public goToStep(step: WizardFormStepComponent): void {
    const firstInvalidPreviousStep =
      this.getInvalidPreviousSteps(this.getStepIndex(step))[0];

    if (!firstInvalidPreviousStep) {
      this.activeStep = step;
    } else {
      this.goToStep(firstInvalidPreviousStep);
      this.activeStep.touchInnerComponents();
    }
  }

  private getValidPreviousSteps(index: number): WizardFormStepComponent[] {
    return this.steps
      .slice(0, index)
      .filter(step => step.isValid);
  }

  private getInvalidPreviousSteps(index: number): WizardFormStepComponent[] {
    return this.steps
      .slice(0, index)
      .filter(step => !step.isValid);
  }

  public onComplete() {
    if (this.formGroup.valid) {
      this.submit.emit();
    } else {
      this.goToStep(this.activeStep);
      this.activeStep.touchInnerComponents();
    }
  }

  // endregion

  // region navigation pill tab

  private updateMovingTab(step: WizardFormStepComponent) {
    const stepIndex = this.steps.indexOf(step);
    const steps = this.steps;
    const total = steps.length;
    const wizardWidth = this.navPillsContainer.nativeElement.offsetWidth;

    this.movingTabTitle = steps[stepIndex].title;
    this.moveDistance = (wizardWidth / total);
    this.liWidth = 100 / steps.length + '%';
    this.verticalLevel = 0;

    // let mobileDevice = wizardWidth < 600 && this.wizardSteps.length > 3;
    const mobileDevice = wizardWidth < 400;
    const isMobileLeftIndex = (stepIndex % 2 === 0);

    // reset li  height to initial state
    this.navPillsContainer.nativeElement.style.height = 'initial';
    this._liElements.forEach(li => {
      li.nativeElement.style.height = 'initial';
    });

    let realIndex = stepIndex; // Temp stepIndex
    let liHeight = 0;
    if (mobileDevice) {

      this.moveDistance = wizardWidth / 2;
      realIndex = stepIndex % 2;
      this.liWidth = '50%';
      this.verticalLevel = isMobileLeftIndex ? stepIndex * 38 / 2 : this.verticalLevel;

      this.cdr.detectChanges();
      // find the tallest li element in the line
      this._liElements.forEach((li, index) => {
        if (liHeight < li.nativeElement.offsetHeight) {
          liHeight = li.nativeElement.offsetHeight;
        }
      });
      // apply tallest height to all elements in line
      this._liElements.forEach((li, index) => {
        li.nativeElement.style.height = liHeight + 'px';
      });
    } else {
      this.cdr.detectChanges();
      liHeight = this.navPillsContainer.nativeElement.offsetHeight;
    }

    this.stepWidth = this.moveDistance;
    this.moveDistance = this.moveDistance * realIndex;

    if (stepIndex === 0 || (mobileDevice && isMobileLeftIndex)) {
      this.moveDistance -= 8;
    } else {
      this.moveDistance += 8;
    }

    // last for assure that all others are ready
    this.stepHeight = liHeight + 7;
  }

  getMovingTabStyle(): any {
    if (this.stepHeight) {
      const style = {
        width: this.stepWidth + 'px',
        height: this.stepHeight + 'px',
        transform: 'translate3d(' + this.moveDistance + 'px, ' + this.verticalLevel + 'px, 0)',
        transition: 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
      };
      return style;
    }
    return {};
  }

  @HostListener('window:resize')
  onResize() {
    this.updateMovingTab(this.activeStep);
  }

  // endregion
}
