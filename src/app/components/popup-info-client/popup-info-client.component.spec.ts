import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInfoClientComponent } from './popup-info-client.component';

describe('PopupInfoClientComponent', () => {
  let component: PopupInfoClientComponent;
  let fixture: ComponentFixture<PopupInfoClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupInfoClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupInfoClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
