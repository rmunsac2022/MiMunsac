import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupActionSuccessComponent } from './popup-action-success.component';

describe('PopupActionSuccessComponent', () => {
  let component: PopupActionSuccessComponent;
  let fixture: ComponentFixture<PopupActionSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupActionSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupActionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
