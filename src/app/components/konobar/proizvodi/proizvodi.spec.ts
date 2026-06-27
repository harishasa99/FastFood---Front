import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proizvodi } from './proizvodi';

describe('Proizvodi', () => {
  let component: Proizvodi;
  let fixture: ComponentFixture<Proizvodi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proizvodi],
    }).compileComponents();

    fixture = TestBed.createComponent(Proizvodi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
