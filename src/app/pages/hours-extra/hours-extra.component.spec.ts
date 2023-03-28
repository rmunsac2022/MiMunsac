import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursExtraComponent } from './hours-extra.component';

describe('HoursExtraComponent', () => {
  let component: HoursExtraComponent;
  let fixture: ComponentFixture<HoursExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursExtraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
