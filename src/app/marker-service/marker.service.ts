import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MarkerService {
  constructor(private http: Http) {
    this.http = http;
  }

  apiKey: string = 'qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';
  url: string = `https://api.mongolab.com/api/1/databases/ant_map/collections/tasks?apiKey=${this.apiKey}`;
  local_url: string = './app/local-markers/local.json';
  //'https://api.mongolab.com/api/1/databases/ant_map/collections/tasks?apiKey=qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';

  public getMarker() { // Get markers
    return this.http.get(this.url)
               .map(res => res.json())
  }

  public getMarkerLocal() { // If server(mongoDB) with markers not answer, loading local json file
    return this.http.get(this.local_url)
               .map(res => res.json())
  }
}
