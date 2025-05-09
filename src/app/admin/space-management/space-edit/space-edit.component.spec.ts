import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEditComponent } from './space-edit.component';

describe('SpaceEditComponent', () => {
  let component: SpaceEditComponent;
  let fixture: ComponentFixture<SpaceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
