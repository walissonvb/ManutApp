import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreventmodalPage } from './preventmodal.page';

const routes: Routes = [
  {
    path: '',
    component: PreventmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreventmodalPageRoutingModule {}
