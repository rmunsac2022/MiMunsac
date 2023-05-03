import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupShortcutsComponent } from './popup-shortcuts.component';

describe('PopupShortcutsComponent', () => {
  let component: PopupShortcutsComponent;
  let fixture: ComponentFixture<PopupShortcutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupShortcutsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupShortcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
