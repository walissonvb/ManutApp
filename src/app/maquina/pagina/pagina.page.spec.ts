import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaPage } from './pagina.page';

describe('PaginaPage', () => {
  let component: PaginaPage;
  let fixture: ComponentFixture<PaginaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaginaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
