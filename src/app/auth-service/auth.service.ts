  import { Injectable } from '@angular/core';
  import { Subject } from 'rxjs/Subject';
  import { tokenNotExpired } from 'angular2-jwt';
  import { Http, Headers, RequestOptions } from '@angular/http';
  import { AuthHttp } from 'angular2-jwt';
  import { TranslateService } from '../translate-service/translate.service';

  declare var auth0: any;
  declare var $: any; // I don't want to use Jquery :(
  declare var translateLibrary: any

  @Injectable()
  export class Auth {

    constructor(
        private authHttp: AuthHttp,
        private http: Http
    ) {
    }

    auth0 = new auth0.WebAuth({
      domain: 'antsgeo.eu.auth0.com',
      clientID: 'q1MZP2p1lpAiMnoP4jdf5RsveUf13r8x',
      callbackURL: 'http://localhost:4200',
      responseType: 'token id_token'
    });

    auth0Manage = new auth0.Management({
      domain: 'antsgeo.eu.auth0.com',
      token: "zhdpdRibaSzNkM3N2OV8Q2qNLhIKjMSHkk5iGoYwpHpCt56AAR5NaBHYUuxK5Qsq"
    });

    localLang = null;
    userProfile: any;
    validationFromAuth0: string = null;
    tokenForManage: string = null;
    responseToForm: boolean = false;
    btnUpdateLoading: boolean = false;

    public updateMarkerEvent = new Subject();

    public handleAuthentication(): void {
      if(localStorage['profile'] && this.isAuthenticated()) {
        this.setUser(localStorage);
      }
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          localStorage.setItem('access_token', authResult.accessToken);
          localStorage.setItem('id_token', authResult.idToken);
        } else if (authResult && authResult.error) {
          alert('Error: ' + authResult.error);
        }
      });
    }

    public login(username: string, password: string): void {
      this.validationFromAuth0 = null;
      this.responseToForm = true;
        this.auth0.client.login({
          realm: 'Username-Password-Authentication',
          responseType: 'token',
          username,
          password,
          scope: 'openid profile'
        }, (err, authResult) => {
          if (err) {
            this.validationFromAuth0 = err.description;
            this.responseToForm = false;
            return;
          }
          if (authResult && authResult.idToken && authResult.accessToken) {
            $('#modalLogin').modal('hide', () => {
              $('.ui.accordion').accordion();
            });

            this.setUser(authResult);
            this.responseToForm = false;
          }
        });
    }

    public signUp(email, password, nickname): void {
      this.responseToForm = true;
      this.validationFromAuth0 = null;
      this.auth0.redirect.signupAndLogin({
        connection: 'Username-Password-Authentication',
        auto_login: false,
        email: email,
        password: password,
        user_metadata: {
          markers: JSON.stringify([]),
          nickname: nickname,
          img: ''
        }
      }, (err) => {
        if (err) {
          this.responseToForm = false;
          this.validationFromAuth0 = err.description;
          return;
        }
      });
    }

    public isAuthenticated(): boolean {
      return tokenNotExpired();
    }

    public logout(): void {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      $('#login_form input[type=password]').val('');

      this.userProfile = undefined;
    }

    private setUser(authResult): void {
      localStorage.setItem('access_token', authResult.accessToken ? authResult.accessToken : authResult.access_token);
      localStorage.setItem('id_token', authResult.idToken ? authResult.idToken : authResult.id_token);

      this.auth0.client.userInfo(authResult.accessToken ? authResult.accessToken : authResult.access_token, (err, user) => {
        this.getUserProfile(user)
      });

    }

    private getUserProfile(user) {
      this.authHttp
          .get(`https://antsgeo.eu.auth0.com/api/v2/users/${user.sub}`)
          .map(response => response)
          .subscribe( response => {
            localStorage.setItem('profile', response['_body']);
            this.initUserProfile();
          },
            error => alert(error.json().message)
          );
    }

    private getUserProfileMarkers(userId) {
      return this.authHttp
                 .get(`https://antsgeo.eu.auth0.com/api/v2/users/${userId}`)
                 .map(response => response.json())
    }

    private headersForRequest() {
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');

      return headers;
    }

    public getTokenForManage(userId) {
      let data = `{\"client_id\":\"MYtQnsPbCD2G9x5cpmX2w8lSm5qIS5Lw\",
                   \"client_secret\":\"tlVpIGdvArPSDrVegOUJ-ZzLRiw37shPPKOMiM4TTLDPMDQLw8GuRoRRCarO-FN0\",
                   \"audience\":\"https://antsgeo.eu.auth0.com/api/v2/\",
                   \"grant_type\":\"client_credentials\"}`;

      return this.authHttp
             .post(`https://antsgeo.eu.auth0.com/oauth/token`, data, {headers: this.headersForRequest()})
             .map(response => response.json())
    }

    public getAccountInfo(token, userId) {
      let headers = new Headers({ 'Accept': 'application/json' });
      headers.append('Authorization', `Bearer ${token}`);

      let options = new RequestOptions({ headers: headers });
      return this.http.get(`https://antsgeo.eu.auth0.com/api/v2/users/${userId}`, options)
                 .map(response => response.json())
    }

    initUserProfile() {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
    }

    public getAccountsMetadata(token) {
      let headers = new Headers({ 'Accept': 'application/json' });
      headers.append('Authorization', `Bearer ${token}`);

      let options = new RequestOptions({ headers: headers });
      return this.http.get(`https://antsgeo.eu.auth0.com/api/v2/users?fields=user_metadata.nickname`, options)
          .map(response => response.json())
    }

    // testBut() {
    // }

    public changeLang(lang): void {
      this.localLang = lang;
    }

    public updateMarker(data) {
      this.btnUpdateLoading = true;
      let url = `https://api.mongolab.com/api/1/databases/ant_map_test/collections/tasks/${data._id.$oid}?apiKey=qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9`

      let body: any = JSON.stringify(data);

      return this.authHttp
                 .put(url, body, {headers: this.headersForRequest()})
                 .map(response => response.json())
                 .subscribe(res => {
                   this.btnUpdateLoading = false;
                   this.updateMarkerEvent.next('value')
                 })
    }

    public resetPassword(email) {
      this.responseToForm = true;
      let url = 'https://antsgeo.eu.auth0.com/dbconnections/change_password';
      let data: any = JSON.stringify({
        client_id: 'q1MZP2p1lpAiMnoP4jdf5RsveUf13r8x',
        email: email,
        connection: 'Username-Password-Authentication'
      });

      return this.authHttp
             .post(url, data, {headers: this.headersForRequest()})
    }

    public changeImg(link) {
      if (this.userProfile) {
        let body: any = JSON.stringify({
          user_metadata: {
            img: JSON.stringify(link)
          }
        });

        this.authHttp
          .patch(`https://antsgeo.eu.auth0.com/api/v2/users/${this.userProfile.user_id}`, body, {headers: this.headersForRequest()})
          .map(response => response.json())
          .subscribe(
            response => {
              localStorage.setItem('profile', JSON.stringify(response))
              this.userProfile = response;
            },
            error => alert(error.json().message)
          );
      }
    }

    public changePassword() {
      this.responseToForm = true;
      let url = 'https://antsgeo.eu.auth0.com/dbconnections/change_password';
      let data: any = JSON.stringify({
        client_id: 'q1MZP2p1lpAiMnoP4jdf5RsveUf13r8x',
        email: this.userProfile.email,
        connection: 'Username-Password-Authentication'
      });

      return this.authHttp
             .post(url, data, {headers: this.headersForRequest()})
    }

    public getHrefProperty(property): any {
        let query = window.location.search.substring(1);
        let numberProp = query.split("&");
        for(let i=0; i < numberProp.length; i++) {
             let pair = numberProp[i].split("=");
             if(pair[0] == property) return pair[1];
        }
        return false;
    }

    public updateUser(data) {
      if (this.userProfile) {

        this.getUserProfileMarkers(this.userProfile.user_id).subscribe(response => {

          let currentMarkers = JSON.parse(response.user_metadata.markers);
          let newMarker = JSON.parse(data._body)._id.$oid;
          currentMarkers.push(newMarker);

          let body: any = JSON.stringify({
            user_metadata: {
              markers: JSON.stringify(currentMarkers)
            }
          });

          this.authHttp
            .patch(`https://antsgeo.eu.auth0.com/api/v2/users/${this.userProfile.user_id}`, body, {headers: this.headersForRequest()})
            .map(response => response.json())
            .subscribe(
              response => {
                localStorage.setItem('profile', JSON.stringify(response))
                this.userProfile = response;
              },
              error => alert(error.json().message)
            );
          });
        }

      }
  }
