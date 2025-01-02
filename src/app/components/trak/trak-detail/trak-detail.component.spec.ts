import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrakDetailComponent } from './trak-detail.component';

describe('TrakDetailComponent', () => {
  let component: TrakDetailComponent;
  let fixture: ComponentFixture<TrakDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrakDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrakDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
