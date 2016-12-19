import { BrowserModule   } from '@angular/platform-browser';
import { NgModule        } from '@angular/core';
import { HttpModule      } from '@angular/http';
import { FormsModule     } from '@angular/forms';
import { AppComponent    } from './app.component';
import { MapComponent    } from './map/map.component';
import { MenuComponent   } from './menu/menu.component';

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule],
  declarations: [ AppComponent, MapComponent, MenuComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
