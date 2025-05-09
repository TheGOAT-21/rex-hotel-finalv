import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingReportsComponent } from './booking-reports.component';

describe('BookingReportsComponent', () => {
  let component: BookingReportsComponent;
  let fixture: ComponentFixture<BookingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
