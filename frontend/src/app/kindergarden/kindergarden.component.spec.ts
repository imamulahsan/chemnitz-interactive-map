import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KindergardenComponent } from './kindergarden.component';

describe('KindergardenComponent', () => {
  let component: KindergardenComponent;
  let fixture: ComponentFixture<KindergardenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KindergardenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KindergardenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
