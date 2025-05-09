import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueReportsComponent } from './revenue-reports.component';

describe('RevenueReportsComponent', () => {
  let component: RevenueReportsComponent;
  let fixture: ComponentFixture<RevenueReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
