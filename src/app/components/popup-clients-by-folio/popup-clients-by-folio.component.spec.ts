import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupClientsByFolioComponent } from './popup-clients-by-folio.component';

describe('PopupClientsByFolioComponent', () => {
  let component: PopupClientsByFolioComponent;
  let fixture: ComponentFixture<PopupClientsByFolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupClientsByFolioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupClientsByFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
