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
var http_1 = require('@angular/http');
var core_1 = require("@angular/core");
var Subject_1 = require('rxjs/Subject');
var SendService = (function () {
    function SendService(http) {
        this.http = http;
        this.eventReloadMap = new Subject_1.Subject();
        this.showSuccessWindow = new Subject_1.Subject();
        this.url = 'https://api.mongolab.com/api/1/databases/ant_map_test/collections/tasks?apiKey=qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9';
        this.http = http;
    }
    SendService.prototype.send = function (data) {
        var _this = this;
        this.http.post(this.url, data)
            .subscribe(function (data) {
            console.log(data);
            _this.eventReloadMap.next('someValue'); // Reloading map
            _this.showSuccessWindow.next('soneValue'); // Show a message
        });
    };
    SendService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SendService);
    return SendService;
}());
exports.SendService = SendService;
//# sourceMappingURL=send.service.js.map