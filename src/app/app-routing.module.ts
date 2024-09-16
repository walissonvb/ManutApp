import { AllordemPageModule } from './ordemServico/allordem/allordem.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'modal',
    loadChildren: () => import('./almoxarife/modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'pagina',
    loadChildren: () => import('./almoxarife/pagina/pagina.module').then( m => m.PaginaPageModule)
  },
  {
    path: 'pagina',
    loadChildren: () => import('./maquina/pagina/pagina.module').then( m => m.PaginaPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./maquina/modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'preventpagina',
    loadChildren: () => import('./preventiva/preventpagina/preventpagina.module').then( m => m.PreventpaginaPageModule)
  },
  {
    path: 'preventmodal',
    loadChildren: () => import('./preventiva/preventmodal/preventmodal.module').then( m => m.PreventmodalPageModule)
  },

  {
    path: 'cadastropreve',
    loadChildren: () => import('./preventiva/cadastropreve/cadastropreve.module').then( m => m.CadastroprevePageModule)
  },
  {
    path: 'modalformprev',
    loadChildren: () => import('./preventiva/modalformprev/modalformprev.module').then( m => m.ModalformprevPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'arvorepeca',
    loadChildren: () => import('./maquina/arvorepeca/arvorepeca.module').then( m => m.ArvorepecaPageModule)
  },
  {
    path: 'maquina/listpeca',
    loadChildren: () => import('./maquina/listpeca/listpeca.module').then(m => m.ListpecaPageModule)
  },

  {
    path: 'relatorio',
    loadChildren: () => import('./preventiva/relatorio/relatorio.module').then( m => m.RelatorioPageModule)
  },
  {
    path: 'whatson',
    loadChildren: () => import('./whatson/whatson.module').then( m => m.WhatsonPageModule)
  },
  {
    path: 'allordem',
    loadChildren: () => import('./ordemServico/allordem/allordem.module').then( m => m.AllordemPageModule)
  },
  {
    path: 'ordem-s',
    loadChildren: () => import('./ordemServico/ordem-s/ordem-s.module').then( m => m.OrdemSPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
