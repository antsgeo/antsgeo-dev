import { Component, Input, Output, EventEmitter, style, state, animate, transition, trigger } from '@angular/core';
import { SendService } from '../send-service/send.service';
declare var $: any; // I don't want to use Jquery :(

import { lang_en_trans, lang_en_name } from '../translate-lib/lang-en';
import { lang_ru_trans, lang_ru_name } from '../translate-lib/lang-ru';

@Component({
    providers: [SendService],
    selector: 'my-menu',
    templateUrl: './menu.component.html',
    animations: [ // Animation for show\hide error widnow in form ("add marker" modal)
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(200, style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate(200, style({ opacity: 0 }))
            ])
        ]),
        trigger('scale', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(200, style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate(200, style({ opacity: 0 }))
            ])
        ])
    ]
})

export class MenuComponent {
    constructor(
        private _sendService: SendService
    ) {
        let _this = this;
        _sendService.eventReloadMap.subscribe(value => { _this.sendEventReloadMap(value) });
        _sendService.showSuccessWindow.subscribe(value => { _this.showSuccessAddMarker(value) });
    }

    @Output() _sendFilteringArrayToComp = new EventEmitter(); // This output send filtering array to map comp
    @Output() _sendEventReloadMap = new EventEmitter(); // This output call function in map component when add marker
    @Output() _changeCursorMap = new EventEmitter(); // This output change cursor in map (in map.component)

    resolutionAddTag: boolean = false; // Variable which allows open the modal windows
    MarkerDataForFilter: any[] = []; // Array which sending to filter
    finalFilterArray: any[] = []; // Array which will sent to map component
    translateLibrary: any;
    flagsForNotification: any = {
        failedGetMarkers: {
          forButton: false,
          forClose: false
        },
        successAddedMarker: false,
        addingMarkerOnMap: false
    }

    checkForm = { // The object which contains boolean var. for check
        name: { // For input 'Species'
            message: <boolean>false, // For red windows. If filled incorrect, show window with tip
            filled: <boolean>false // If the field filled, true
        },
        comment: { // For input 'Comment'
            message: <boolean>false,
            filled: <boolean>false
        },
        filledAll: <boolean>false // If both the fields filled, true
    }

    data = { // the data to send
        name: <string>null,
        comment: <string>null,
        coordinateX: <number>null,
        coordinateY: <number>null,
        time: <string>null
    }

    protected sendDataToFilter(e) { // sending array to filter function
        this.filteringArray(e, this.MarkerDataForFilter);
    }

    protected sendFilteringArrayToComp(data) { // sending filtering array to map component
        this._sendFilteringArrayToComp.emit(data);
    }

    protected sendEventReloadMap(data) { // When adding the marker, need to reload a function, which add markers on the map
        this._sendEventReloadMap.emit(data);
    }

    protected filteringArray(args, data) { // filter function
        this.finalFilterArray.length = 0;
        let _this = this;
        return this.sendFilteringArrayToComp(
            data.filter(item => {
                let nameLower = item.name.toLowerCase();
                let argumentLower = args.toLowerCase();
                if (argumentLower.length >= 2 && nameLower.indexOf(argumentLower) + 1) {
                    return _this.finalFilterArray.push(item);
                } else { }
            }
            ));
    }

    protected failedGetMarkers(data) {
      this.flagsForNotification.failedGetMarkers.forButton = true;
      this.flagsForNotification.failedGetMarkers.forClose = true;
    }

    protected bootstrapDataForSend(data: any[]) { // order function in the service
        if (this.checkForm.filledAll) {
            this._sendService.send(data); //a function which sends data to the server
        }
    }

    protected modalAddTag(bool: boolean): void { //1 step, user click on the button "add tag", so allow open a modal window
        this.flagsForNotification.addingMarkerOnMap = bool;
        this.resolutionAddTag = bool;
        this._changeCursorMap.emit(bool)
    }

    protected modalHelp() {
        $('#modalHelp').modal('show');
    }

    protected modalContact() {
        $('#modalContact').modal('show');
    }

    protected modalAbout() {
      $('#modalAbout').modal('show');
    }

    protected takeCoor(e): void { //2 step, user click on the map, and open modal window
        let _this = this;
        if (this.resolutionAddTag) {
            $('#modalAddTag').modal({ // open window
                observeChanges: true,
                onHide: function() { // callback close window
                    _this.modalAddTag(false);
                }
            }).modal('show');
            _this.data.coordinateX = e.lat;
            _this.data.coordinateY = e.lng;
            _this.data.time = _this.setDate();
        }
    }

    protected setDate() { // this function return the date
        let date = new Date();

        let options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };

        return date.toLocaleString("en-US", options);
    }

    protected changeLang(data) {
        if (lang_en_name == data) {
            this.translateLibrary = lang_en_trans;
        } else {
            this.translateLibrary = lang_ru_trans;
        }
    }

    protected checkFormName() { // Checking input "Species"...
        if (this.data.name && /^[a-zA-Z()-.\s]+$/i.test(this.data.name)) { // If the field have text, and text written latin language, true
            this.checkForm.name.filled = true; // Field filled!
            this.checkForm.name.message = false; // Hide red window
        } else { // Else the field wrong
            this.checkForm.name.filled = false; // Field is not filled
            this.checkForm.name.message = true; // Show the red window
            this.checkForm.filledAll = false; // All fields is not filled
        }
        if (this.checkForm.name.filled && this.checkForm.comment.filled) {
            this.checkForm.filledAll = true; // For final verification
        }
    }

    protected checkFormComment() { // Checking input "Comment"...
        if (this.data.comment) { // All similarly like checkFormName()
            this.checkForm.comment.filled = true;
            this.checkForm.comment.message = false;
        } else {
            this.checkForm.comment.filled = false;
            this.checkForm.comment.message = true;
            this.checkForm.filledAll = false;
        }
        if (this.checkForm.name.filled && this.checkForm.comment.filled) {
            this.checkForm.filledAll = true;
        }
    }

    protected getMarkerForFilter(markers) {
        this.MarkerDataForFilter = markers;
    }

    protected closeMessage(e) { // For closing message (semantic-ui)
    }

    protected showSuccessAddMarker(value) {
      this.flagsForNotification.successAddedMarker = true;
      setTimeout(() => {
        this.flagsForNotification.successAddedMarker = false;
      }, 5000);
    }

    protected openSidebar() { // Function opened a sidebar
      $('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    }

    ngOnInit() {
        var _this = this;
        $('.ui.dropdown').dropdown();
        this.changeLang('en');

        $('.ui.sidebar a').click(function () {
          $('.ui.sidebar').sidebar('toggle');
        })
    }
}

/*
  О Проекте antgeo

  Цель сервиса antgeo
*/
