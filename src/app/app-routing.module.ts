import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { ServicePageComponent } from './service-page.component';
import { DataPageComponent } from './data-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'services/:type', component: ServicePageComponent },
  { path: 'data/:type', component: DataPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
