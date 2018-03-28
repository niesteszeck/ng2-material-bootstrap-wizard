import {
  ElementRef,
  NgZone,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';

declare const $: any;

export abstract class WizardFormModalComponent implements AfterViewInit {

  @ViewChild('modal') modal: ElementRef;

  @Output() shown: EventEmitter<any> = new EventEmitter<any>();
  @Output() hidden: EventEmitter<any> = new EventEmitter<any>();

  constructor(private zone: NgZone,
              private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    $(this.modal.nativeElement)
      .on('shown.bs.modal', () => {
        this.zone.run(() => {
          this.onShown();
          this.shown.emit();
        });
      });
    $(this.modal.nativeElement)
      .on('hidden.bs.modal', () => {
        this.zone.run(() => {
          this.onHidden();
          this.hidden.emit();
        });
      });
  }

  public show() {
    $(this.modal.nativeElement).modal('show');
  }

  public hide() {
    $(this.modal.nativeElement).modal('hide');
  }

  protected onShown() {
    this.cd.markForCheck();
  }

  protected onHidden() {
    this.cd.markForCheck();
  }
}
