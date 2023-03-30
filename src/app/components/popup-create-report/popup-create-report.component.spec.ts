import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCreateReportComponent } from './popup-create-report.component';

describe('PopupCreateReportComponent', () => {
  let component: PopupCreateReportComponent;
  let fixture: ComponentFixture<PopupCreateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupCreateReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCreateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
