"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var marker_service_1 = require('../marker-service/marker.service');
var MapComponent = (function () {
    function MapComponent(_markerService) {
        this._markerService = _markerService;
        this.eventMapComponent = new core_1.EventEmitter();
        this._sendMarkersToFilter = new core_1.EventEmitter();
        this._failedGetMarkers = new core_1.EventEmitter();
        this.arrayMarkers = []; // Start array markers
        this.globalDeclareVarForMapbox = L; // Global variable for mapbox
        this.globalMap = null; // Variable for mapbox
        this.markersCluster = new L.MarkerClusterGroup(); // Init cluster markers
        this.markerArr = []; // Array markers
        this.executedForLink = true;
        this.loaderMap = true;
        this.dateForFooter = new Date().getFullYear();
    }
    MapComponent.prototype.sendCoor = function (data) {
        this.eventMapComponent.emit(data);
    };
    MapComponent.prototype.reloadMap = function (val) {
        console.log(val);
        this.getMarkerFunction();
    };
    MapComponent.prototype.changeCursor = function (data) {
        this.changeCursorVar = data;
    };
    MapComponent.prototype.takeFilteringArr = function (data) {
        console.log(data);
        if (data[0]) {
            this.deleteLayerMap(data);
        }
        else {
            this.deleteLayerMap(this.arrayMarkers);
        }
    };
    MapComponent.prototype.initMap = function () {
        var _this = this;
        var tokenForMap = 'pk.eyJ1IjoianNjb2RlciIsImEiOiJjaXE4Y2gweHIwM' +
            'DNuaHhuc3A5eWxkc25tIn0.Frbvg0IRwj__jG2Pz7-e5w';
        L.mapbox.accessToken = tokenForMap;
        this.globalMap = this.globalDeclareVarForMapbox.mapbox.map('map') //, 'mapbox.streets'
            .setView([20, 40], 2);
        this.getMarkerFunction();
        L.control.layers({
            'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(_this.globalMap),
            'Satellite': L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-streets-v9')
        }).addTo(_this.globalMap);
        this.globalMap.on('click', function (e) {
            _this.sendCoor(e.latlng);
        });
    };
    MapComponent.prototype.getMarkerFunction = function () {
        var _this = this;
        this.globalMap.removeLayer(this.markersCluster);
        this._markerService.getMarker() // Gets markers from service
            .subscribe(function (res) {
            console.log(res);
            _this.createMarkers(res);
            _this.arrayMarkers = res;
            _this._sendMarkersToFilter.emit(res);
        }, function (err) {
            console.log('Local markers');
            _this._markerService.getMarkerLocal().subscribe(function (res) {
                _this.createMarkers(res);
                _this.arrayMarkers = res;
                _this._sendMarkersToFilter.emit(res);
                _this._failedGetMarkers.emit(true);
            });
        });
    };
    MapComponent.prototype.deleteLayerMap = function (data) {
        this.globalMap.removeLayer(this.markersCluster); // Delete the old array
        this.createMarkers(data); // Send data to create-markers function
    };
    MapComponent.prototype.openPopupLink = function (local) {
        var localLink = Number(local);
        if (localLink && typeof localLink === 'number' && localLink <= this.markerArr.length && localLink > -1) {
            var localMarker = this.markerArr[localLink];
            this.globalMap.setView(localMarker._latlng, 20);
            localMarker.openPopup();
        }
    };
    MapComponent.prototype.getDataFromLink = function () {
        if (this.executedForLink) {
            this.executedForLink = false;
            if (window.location.search) {
                var locat = window.location.search;
                this.openPopupLink(locat.replace(/[\\=?]|id/g, ''));
            }
        }
    };
    MapComponent.prototype.createMarkers = function (markers) {
        this.markersCluster = new L.MarkerClusterGroup({
            spiderfyOnMaxZoom: true,
            maxClusterRadius: 70,
            disableClusteringAtZoom: 17
        });
        for (var i in markers) {
            var marker = L.marker([Number(markers[i].coordinateX), Number(markers[i].coordinateY)], {
                icon: L.divIcon({
                    className: 'lableClass',
                    html: "\n                    <div class=\"labelClass_point\">\n                      <img src=\"../../assets/img/map-marker-2.png\">\n                    </div>\n                    <div class=\"lableClass_label\">\n                      " + (markers[i].name.split(' ')[0].slice(0, 1).toUpperCase() + '. ' + markers[i].name.split(' ')[1]) + "\n                    </div>\n                    "
                })
            });
            var customPopup = "\n              <div class=\"labelClass_specie\">\n                " + markers[i].name + "\n              </div>\n              <div class=\"labelClass_comment\">\n                " + markers[i].comment + "\n              </div>\n              <hr class=\"labelClass_hr\"/>\n              <button class=\"ui basic button btn labelClass_copyLink\" data-tooltip=\"https://antgeo.github.io/?id=" + i + "\"\n              data-clipboard-text=\"https://antgeo.github.io/?id=" + i + "\" data-position=\"top center\">\n                <i class=\"icon copy\"></i>\n                Click for copy link tag\n              </button>\n              <hr class=\"labelClass_hr\"/>\n              <div class=\"labelClass_coor\">\n                " + markers[i].coordinateX + ", " + markers[i].coordinateY + "\n              </div>\n              <div class=\"labelClass_time\">\n                " + markers[i].time + "\n              </div>\n              <div class=\"labelClass_clear\"> </div>\n            ";
            marker.bindPopup(customPopup, {
                closeButton: false,
                minWidth: 290
            });
            this.markersCluster.addLayer(marker);
            this.markerArr.push(marker);
        }
        this.globalMap.addLayer(this.markersCluster);
        this.getDataFromLink();
        this.loaderMap = false;
    };
    MapComponent.prototype.ngOnInit = function () {
        this.initMap();
        new Clipboard('.btn');
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "eventMapComponent", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "_sendMarkersToFilter", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "_failedGetMarkers", void 0);
    MapComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            providers: [marker_service_1.MarkerService],
            selector: 'my-map',
            templateUrl: './map.component.html',
            styleUrls: ['./map.component.css']
        }), 
        __metadata('design:paramtypes', [marker_service_1.MarkerService])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map