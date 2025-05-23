import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceCardComponent } from './space-card.component';

describe('SpaceCardComponent', () => {
  let component: SpaceCardComponent;
  let fixture: ComponentFixture<SpaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
