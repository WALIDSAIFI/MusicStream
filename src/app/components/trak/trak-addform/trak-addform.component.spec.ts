import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrakAddformComponent } from './trak-addform.component';

describe('TrakAddformComponent', () => {
  let component: TrakAddformComponent;
  let fixture: ComponentFixture<TrakAddformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrakAddformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrakAddformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
