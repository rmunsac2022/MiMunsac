import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTickQrComponent } from './popup-tick-qr.component';

describe('PopupTickQrComponent', () => {
  let component: PopupTickQrComponent;
  let fixture: ComponentFixture<PopupTickQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTickQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTickQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
