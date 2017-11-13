import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MarkerService } from '../marker-service/marker.service';
import { Auth } from '../auth-service/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MakeMarkerService } from '../make-marker/make-marker.service';
import { ComplainService } from '../complain-service/complain.service';
import { TranslateService } from '../translate-service/translate.service';
import 'rxjs/add/operator/do';

declare var L: any;
declare var Clipboard: any;
declare var markersCluster: any;
declare var $: any; // I don't want to use Jquery :(
declare var emailjs: any;

@Component({
    providers: [MarkerService, TranslateService],
    selector: 'my-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent {
    constructor(private _markerService: MarkerService,
                private auth0: Auth,
                private authHttp: AuthHttp,
                private http: Http,
                private makeMarkerService: MakeMarkerService,
                private complainService: ComplainService,
                private translateService: TranslateService
                )
                {
                  this.auth0.updateMarkerEvent.subscribe(value => { this.reloadMap(value) })
                }

    @Output() eventMapComponent = new EventEmitter();
    @Output() _sendMarkersToFilter = new EventEmitter();
    @Output() _failedGetMarkers = new EventEmitter();
    @Output() _openAccount = new EventEmitter();
    @Output() _handlingError = new EventEmitter();

    arrayMarkers: any[] = []; // Start array markers
    backupMarkers: any[] = [];
    globalDeclareVarForMapbox: any = L; // Global variable for mapbox
    globalMap: any = null; // Variable for mapbox
    markersCluster: any = new L.MarkerClusterGroup(); // Init cluster markers
    changeCursorVar: boolean; // The boolean which permits change cursor on the map
    markerArr: any[] = []; // Array markers
    executedForLink: boolean = true;
    loaderMap: boolean = true;
    dateForFooter: any = new Date().getFullYear();
    currentPopupUser: any = null;
    currentAccountInfo: any;
    popupMobileProps: any = {
      name: null,
      comment: null,
      coordinateX: null,
      coordinateY: null,
      time: null,
      user: null
    }
    currentMarker = {
      user: null,
      link: null,
    }

    protected sendCoor(data) { // Sending coordinate for menu component
        this.eventMapComponent.emit(data);
    }

    public reloadMap(val) { // Reload the map when added new marker
      this.getMarkerFunction();
    }

    protected changeCursor(data: boolean) { // Take value for changeCursorVar variable
      this.changeCursorVar = data;
    }

    protected takeUserMarker(data) {
      this.arrayMarkers = data;
      this.deleteLayerMap(data);
    }

    protected resettingUSerMarkers(val) {
      this.arrayMarkers = this.backupMarkers;
      this.deleteLayerMap(this.arrayMarkers);
      this._sendMarkersToFilter.emit(this.backupMarkers);
    }

    protected takeFilteringArr(data) { // Gets filtering array and from nenu component
        if (data[0]) { // If filtering array have the markers, send his
            this.deleteLayerMap(data);
        } else { // Else send full array
            this.deleteLayerMap(this.arrayMarkers);
        }
    }

    private initMap() { // Init map
        const tokenForMap = 'pk.eyJ1IjoianNjb2RlciIsImEiOiJjaXE4Y2gweHIwM' +
            'DNuaHhuc3A5eWxkc25tIn0.Frbvg0IRwj__jG2Pz7-e5w'

        L.mapbox.accessToken = tokenForMap;
        this.globalMap = this.globalDeclareVarForMapbox.mapbox.map('map') //, 'mapbox.streets'
            .setView([20, 40], 2);

        this.getMarkerFunction();

        L.control.layers({
            'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(this.globalMap),
            'Satellite': L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-streets-v9')
        }).addTo(this.globalMap);

        this.globalMap.on('click', (e) => {
            this.sendCoor(e.latlng);
        });
    }

    protected getMarkerFunction () {
      this.globalMap.removeLayer(this.markersCluster);
      this._markerService.getMarker() // Gets markers from service
          .subscribe(
            res => {
              this.createMarkers(res); this.arrayMarkers = res;
              this.backupMarkers = res;
              this._sendMarkersToFilter.emit(res);
            },
            err => { // If severs with markers not answer, loading local json file
              this._markerService.getMarkerLocal().subscribe(
                res => {
                  this.createMarkers(res);
                  this.arrayMarkers = res;
                  this.backupMarkers = res;
                  this._sendMarkersToFilter.emit(res);
                  this._failedGetMarkers.emit(true);
                },
                err => {
                  console.log(err)
                }
              )
            });
    }

    protected deleteLayerMap(data) {
        this.globalMap.removeLayer(this.markersCluster); // Delete the old array
        this.createMarkers(data); // Send data to create-markers function
    }

    protected openPopupLink(data) { // Function, which open the tag from the link
      if(data.closeModal) $('.modal').modal('hide');
      let localLink = data.link;
      if (localLink) {
        for (let i = 0; i < this.markerArr.length; i++) {
          if(this.markerArr[i].mapId == localLink) {
            if ($(window).width() < 767) {
              this.openPopupMobile(this.markerArr[i].markerData, localLink);
            } else {
              this.globalMap.setView(this.markerArr[i]._latlng, 20);
            }
            break;
          }
        }
      }
    }

    protected getDataFromLink () { // This function must called only once
      if (this.executedForLink) {
          this.executedForLink = false;
          let filterUrl = window.location.search;
          let thereId = this.auth0.getHrefProperty('id');
          if (thereId) { // Check, if link have the id for tag
            this.openPopupLink({link: thereId, closeModal: false})
          }
      }
    }

    protected passUserIdUrl(data) {
      window.history.replaceState(null, null, "/");
      window.history.replaceState(null, null, `?user=${data.identities[0].user_id}`);
      $(".link-account").attr("data-clipboard-text", `antsgeo.github.io/?user=${data.identities[0].user_id}`);
      this._openAccount.emit(data);
    }

    protected closePopupMobile() {
      $('#popup_modal').modal('hide');
    }

    protected clearPopupMobileProps(prop) {
      this.popupMobileProps = {
        name: prop,
        comment: prop,
        coordinateX: prop,
        coordinateY: prop,
        time: prop,
        user: prop
      }
    }

    protected openPopupMobile(marker, link) {
      this.popupMobileProps = marker;
      this.currentMarker.user = this.auth0.userProfile;
      this.currentMarker.link = link;
      this.popupMobileProps.stringLink = `https://antsgeo.github.io/?id=${link}`;

      if (marker.user) {
        this.auth0.getTokenForManage(marker.user).subscribe(data => {
          this.auth0.getAccountInfo(data.access_token, marker.user).subscribe(data => {
            this.popupMobileProps.userData = data;
            this.popupMobileProps.userData.user_metadata.img = data.user_metadata.img ? JSON.parse(data.user_metadata.img) : data.picture;
          },
          err => {
            console.log('Not found user')
          })
        })
      }

      $('#popup_modal').modal({transition: 'fade up'}).modal('show');
    }

    protected sendComplainPopupMobile($event) {
      this.complainService.sendComplain(
        this.currentMarker.link,
        this.currentMarker.user,
        $event.value);
    }

    protected createMarkers(markers) { // Function which create markers on the map
        this.markersCluster = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          maxClusterRadius: 70,
          disableClusteringAtZoom: 17,
          polygonOptions: {
             fillColor: '#3887be',
             color: '#3887be',
             weight: 1.5,
             opacity: 1,
             fillOpacity: 0.4
           }
        });

        let markerOptions = {
          closeButton: false,
          minWidth: 310
        }

        for (let i in markers) {
            let marker = L.marker([Number(markers[i].coordinateX), Number(markers[i].coordinateY)], {
                icon:
                L.divIcon({
                    className: 'lableClass',
                    html: this.makeMarkerService.labelMarker(markers[i])
                })
            });

          let localLink = markers[i]._id.$oid;
          marker.mapId = localLink;
          marker.markerData = markers[i];

          let customPopup = this.makeMarkerService.usuallyMarker(markers[i], localLink);

          if(!markers[i].user) {
            marker.bindPopup(customPopup, markerOptions);
          } else {
            marker.bindPopup('<div class="ui active centered inline loader"></div>', markerOptions);
          }

          let savedData: any = false;
          let catchedError: boolean = false;

          marker.on('click', (e) => {
            let currentUser = markers[i].user;
            let customPopupWithUser: string;

            if ($(window).width() < 767) {
              marker.closePopup();
              if (markers[i].user) {
                this.openPopupMobile(markers[i], localLink)
              } else {
                this.openPopupMobile(markers[i], localLink)
              }
            } else {

              if(markers[i].user) {

                if (!savedData && !catchedError) {
                  this.auth0.getTokenForManage(currentUser).subscribe(data => {
                    this.auth0.getAccountInfo(data.access_token, currentUser).subscribe(data => {
                      savedData = data;
                      this.currentAccountInfo = data;
                      customPopupWithUser = this.makeMarkerService.userMarker(markers[i], localLink, data);

                      marker._popup.setContent(customPopupWithUser);
                      this.makeMarkerService.jqueryManipulate(localLink, this.auth0.userProfile);

                      $('.leaflet-popup-content').on('click', '.labelClass_user-nickname', () => {
                        this.passUserIdUrl(savedData);
                      });
                    },
                    err => {
                      catchedError = true;
                      marker._popup.setContent(customPopup);
                      this.makeMarkerService.jqueryManipulate(localLink);
                    })
                  })
                } else if(catchedError) {
                  marker._popup.setContent(customPopup);
                } else {
                  marker._popup.setContent(customPopupWithUser);
                }
              }

            }

            setTimeout(() => {
              let PopupCoor = this.globalMap.project(e.target._popup._latlng);
              PopupCoor.y -= e.target._popup._container.clientHeight / 2;
              this.globalMap.setView(this.globalMap.unproject(PopupCoor));
            }, 0);

            this.makeMarkerService.jqueryManipulate(localLink, this.auth0.userProfile);

            $('.leaflet-popup-content').on('click', '.labelClass_user-nickname', () => {
              this.passUserIdUrl(savedData);
            });
          })

          this.markersCluster.addLayer(marker);
          this.markerArr.push(marker);
        }
        this.globalMap.addLayer(this.markersCluster);
        this.getDataFromLink();
        this.loaderMap = false;
    }

    ngOnInit() { // function init
      this.translateService.changeLanguage('en');
        this.initMap();
        $('#popup_modal').modal({
          observeChanges: true,
          onHidden: () => {
            this.clearPopupMobileProps(null);
          }
        })

        L.control.locate().addTo(this.globalMap);

        $('.coupled.modal').modal({
            allowMultiple: false,
            autofocus: false
        });

        $('#popup_modal_complain').modal({transition: 'fade up'}).modal('attach events', '#popup_modal .btnComplain');
        $('#popup_modal').modal({transition: 'fade up'}).modal('attach events', '#popup_modal_complain .btnCloseComplain');

        emailjs.init("user_kOtOjrqShPzf0m5hG2p38");
        new Clipboard('.btn');
    }
}
