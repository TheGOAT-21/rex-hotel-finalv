import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceSelectionComponent } from './space-selection.component';

describe('SpaceSelectionComponent', () => {
  let component: SpaceSelectionComponent;
  let fixture: ComponentFixture<SpaceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
