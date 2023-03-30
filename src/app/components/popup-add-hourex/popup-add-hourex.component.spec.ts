import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddHourexComponent } from './popup-add-hourex.component';

describe('PopupAddHourexComponent', () => {
  let component: PopupAddHourexComponent;
  let fixture: ComponentFixture<PopupAddHourexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupAddHourexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAddHourexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
