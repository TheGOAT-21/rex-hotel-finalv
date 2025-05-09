import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithOverlayComponent } from './image-with-overlay.component';

describe('ImageWithOverlayComponent', () => {
  let component: ImageWithOverlayComponent;
  let fixture: ComponentFixture<ImageWithOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageWithOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageWithOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
