import { BrowserModule   } from '@angular/platform-browser';
import { NgModule        } from '@angular/core';
import { HttpModule      } from '@angular/http';
import { FormsModule     } from '@angular/forms';
import { AppComponent    } from './app.component';
import { MapComponent    } from './map/map.component';
import { MenuComponent   } from './menu/menu.component';
import { provideAuth     } from 'angular2-jwt';
import { AuthHttp        } from 'angular2-jwt';
import { ComplainService } from './complain-service/complain.service';
import { FilterMarkersProfilePipe } from './filter-markers-profile/filter-markers-profile.pipe';

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule],
  providers:    [  provideAuth({
                                headerName: 'Authorization',
                                headerPrefix: 'bearer',
                                tokenName: 'token',
                                tokenGetter: (() => localStorage.getItem('id_token')),
                                globalHeaders: [{ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }],
                                noJwtError: true
                               }) ],
  declarations: [ AppComponent, MapComponent, MenuComponent, FilterMarkersProfilePipe ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
