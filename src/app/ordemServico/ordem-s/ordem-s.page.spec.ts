import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdemSPage } from './ordem-s.page';

describe('OrdemSPage', () => {
  let component: OrdemSPage;
  let fixture: ComponentFixture<OrdemSPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrdemSPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
