import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyReportsComponent } from './occupancy-reports.component';

describe('OccupancyReportsComponent', () => {
  let component: OccupancyReportsComponent;
  let fixture: ComponentFixture<OccupancyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OccupancyReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OccupancyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
