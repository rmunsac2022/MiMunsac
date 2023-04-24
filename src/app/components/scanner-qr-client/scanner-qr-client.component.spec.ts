import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerQrClientComponent } from './scanner-qr-client.component';

describe('ScannerQrClientComponent', () => {
  let component: ScannerQrClientComponent;
  let fixture: ComponentFixture<ScannerQrClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScannerQrClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScannerQrClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
