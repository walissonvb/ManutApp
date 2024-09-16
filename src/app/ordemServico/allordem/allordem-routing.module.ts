import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllordemPage } from './allordem.page';

const routes: Routes = [
  {
    path: '',
    component: AllordemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllordemPageRoutingModule {}
