import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SviRacuni } from './svi-racuni';

describe('SviRacuni', () => {
  let component: SviRacuni;
  let fixture: ComponentFixture<SviRacuni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SviRacuni],
    }).compileComponents();

    fixture = TestBed.createComponent(SviRacuni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
