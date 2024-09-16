import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArvorepecaPage } from './arvorepeca.page';

describe('ArvorepecaPage', () => {
  let component: ArvorepecaPage;
  let fixture: ComponentFixture<ArvorepecaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ArvorepecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
