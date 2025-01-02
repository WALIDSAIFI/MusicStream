import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrakUpdatformComponent } from './trak-updatform.component';

describe('TrakUpdatformComponent', () => {
  let component: TrakUpdatformComponent;
  let fixture: ComponentFixture<TrakUpdatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrakUpdatformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrakUpdatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
