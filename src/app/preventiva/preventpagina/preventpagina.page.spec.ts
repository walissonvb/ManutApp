import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventpaginaPage } from './preventpagina.page';

describe('PreventpaginaPage', () => {
  let component: PreventpaginaPage;
  let fixture: ComponentFixture<PreventpaginaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PreventpaginaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
