import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHorariosComponent } from './list-horarios.component';

describe('ListHorariosComponent', () => {
  let component: ListHorariosComponent;
  let fixture: ComponentFixture<ListHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHorariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
