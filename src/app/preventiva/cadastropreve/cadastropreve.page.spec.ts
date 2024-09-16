import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroprevePage } from './cadastropreve.page';

describe('CadastroprevePage', () => {
  let component: CadastroprevePage;
  let fixture: ComponentFixture<CadastroprevePage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(CadastroprevePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
