import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserCreateComponent } from './admin-user-create.component';

describe('AdminUserCreateComponent', () => {
  let component: AdminUserCreateComponent;
  let fixture: ComponentFixture<AdminUserCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
