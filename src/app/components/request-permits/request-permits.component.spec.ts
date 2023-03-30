import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPermitsComponent } from './request-permits.component';

describe('RequestPermitsComponent', () => {
  let component: RequestPermitsComponent;
  let fixture: ComponentFixture<RequestPermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPermitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
