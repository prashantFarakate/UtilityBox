import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RoiComponent } from './create-template/roi/roi.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'create-template', component: CreateTemplateComponent},
  {path: 'navbar', component: NavbarComponent},
  {path: 'create-template/roi', component: RoiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
