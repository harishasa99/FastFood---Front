import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Racuni } from './racuni';

describe('Racuni', () => {
  let component: Racuni;
  let fixture: ComponentFixture<Racuni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Racuni],
    }).compileComponents();

    fixture = TestBed.createComponent(Racuni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
