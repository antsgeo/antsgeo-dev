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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var MarkerService = (function () {
    function MarkerService(http) {
        this.http = http;
        this.apiKey = 'qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';
        this.url = "https://api.mongolab.com/api/1/databases/ant_map_test/collections/tasks?apiKey=" + this.apiKey;
        this.local_url = './app/local-markers/local.json';
        this.http = http;
    }
    //'https://api.mongolab.com/api/1/databases/ant_map/collections/tasks?apiKey=qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';
    MarkerService.prototype.getMarker = function () {
        return this.http.get(this.url)
            .map(function (res) { return res.json(); });
    };
    MarkerService.prototype.getMarkerLocal = function () {
        return this.http.get(this.local_url)
            .map(function (res) { return res.json(); });
    };
    MarkerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MarkerService);
    return MarkerService;
}());
exports.MarkerService = MarkerService;
//# sourceMappingURL=marker.service.js.map