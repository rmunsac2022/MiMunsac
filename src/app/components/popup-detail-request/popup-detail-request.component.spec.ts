import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDetailRequestComponent } from './popup-detail-request.component';

describe('PopupDetailRequestComponent', () => {
  let component: PopupDetailRequestComponent;
  let fixture: ComponentFixture<PopupDetailRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupDetailRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupDetailRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
