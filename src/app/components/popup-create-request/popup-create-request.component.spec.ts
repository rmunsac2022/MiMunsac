import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCreateRequestComponent } from './popup-create-request.component';

describe('PopupCreateRequestComponent', () => {
  let component: PopupCreateRequestComponent;
  let fixture: ComponentFixture<PopupCreateRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupCreateRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCreateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
