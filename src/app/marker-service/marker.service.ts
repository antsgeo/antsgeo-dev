import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class MarkerService {
  constructor(private http: Http) {
    this.http = http;
  }

  sendAccountMarkers = new Subject();
  apiKey: string = 'qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';
  url: string = `https://api.mongolab.com/api/1/databases/ant_map/collections/tasks?apiKey=${this.apiKey}`;
  local_url: string = '../../assets/failload-lib/local-markers/local.json';
  //'https://api.mongolab.com/api/1/databases/ant_map/collections/tasks?apiKey=qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';

  public getMarker() { // Get markers
    return this.http.get(this.url)
               .map(res => res.json())
  }

  public getMarkerLocal() { // If server(mongoDB) with markers not answer, loading local json file
    return this.http.get(this.local_url)
               .map(res => res.json())
  }

  public getAccountMarkers(data) {
     if (data.length) {
       Observable.forkJoin(
         data.map(i => this.http.get(`https://api.mongolab.com/api/1/databases/ant_map/collections/tasks/${i}?apiKey=${this.apiKey}`)
             .map(response => response.json()))
             .map(response => response))
             .subscribe(response => {
                this.sendAccountMarkers.next([response, null]);
             });
     } else {
       this.sendAccountMarkers.next([undefined, 'You not has markers']);
     }
  }
}
