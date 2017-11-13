import { Http } from '@angular/http';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Auth } from '../auth-service/auth.service';

@Injectable()
export class SendService {
    constructor(private http: Http, private auth0: Auth) {
        this.http = http;
        this.auth0 = auth0;
    }

    public eventReloadMap = new Subject();
    public showSuccessWindow = new Subject();

    url = 'https://api.mongolab.com/api/1/databases/ant_map/collections/tasks?apiKey=qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';
    //https://api.mongolab.com/api/1/databases/ant_map_test/collections/tasks/5852a7bcbd966f37329f0a13?apiKey=qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9

    public send(data) { // function which sends data to the server
        this.http.post(this.url, data)
            .subscribe(data => {
                this.auth0.updateUser(data);
                this.eventReloadMap.next('someValue'); // Reloading map
                this.showSuccessWindow.next('soneValue'); // Show a message
            });
    }
}
