import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meni } from './meni';

describe('Meni', () => {
  let component: Meni;
  let fixture: ComponentFixture<Meni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Meni],
    }).compileComponents();

    fixture = TestBed.createComponent(Meni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
