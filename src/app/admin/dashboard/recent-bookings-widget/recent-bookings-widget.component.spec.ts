import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBookingsWidgetComponent } from './recent-bookings-widget.component';

describe('RecentBookingsWidgetComponent', () => {
  let component: RecentBookingsWidgetComponent;
  let fixture: ComponentFixture<RecentBookingsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentBookingsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentBookingsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
