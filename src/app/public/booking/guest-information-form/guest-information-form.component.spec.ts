import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInformationFormComponent } from './guest-information-form.component';

describe('GuestInformationFormComponent', () => {
  let component: GuestInformationFormComponent;
  let fixture: ComponentFixture<GuestInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestInformationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
