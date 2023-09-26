import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { RoiComponent } from './create-template/roi/roi.component';

import {MatDialogModule} from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReComponent } from './create-template/re/re.component';
// import { PdfViewerModule } from 'ng2-pdf-viewer';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateTemplateComponent,
    NavbarComponent,
    RoiComponent,
    ReComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    FlexLayoutModule,
    
    PdfViewerModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
