import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KreirajRacun } from './kreiraj-racun';

describe('KreirajRacun', () => {
  let component: KreirajRacun;
  let fixture: ComponentFixture<KreirajRacun>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KreirajRacun],
    }).compileComponents();

    fixture = TestBed.createComponent(KreirajRacun);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
