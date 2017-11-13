import { Component, Input, Output, EventEmitter, style, state, animate, transition, trigger } from '@angular/core';
import { SendService } from '../send-service/send.service';
import { MarkerService } from '../marker-service/marker.service';
import { Auth } from '../auth-service/auth.service';
import { ValidateService } from '../validate-service/validate.service';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';
import { ComplainService } from '../complain-service/complain.service';
import { TranslateService } from '../translate-service/translate.service';
import { Http, Headers, RequestOptions } from '@angular/http';

declare var $: any; // I don't want to use Jquery :(
declare var Clipboard: any;
declare var emailjs: any;

@Component({
    providers: [SendService, MarkerService, ValidateService, TranslateService],
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
        private _sendService: SendService,
        private auth0: Auth,
        private authHttp: AuthHttp,
        private _markerService: MarkerService,
        private validateService: ValidateService,
        private sanitizer: DomSanitizer,
        private complainService: ComplainService,
        private translateService: TranslateService,
        private http: Http
    ) {
        let _this = this;
        _sendService.eventReloadMap.subscribe(value => { _this.sendEventReloadMap(value) });
        _sendService.showSuccessWindow.subscribe(value => { _this.showSuccessAddMarker(value) });
        _markerService.sendAccountMarkers.subscribe(value => {_this.getUserMarkers_success(value)})
        complainService.complainSuccess.subscribe(value => { _this.handlingSuccess([value[0], value[1]]) });
    }

    @Output() _sendFilteringArrayToComp = new EventEmitter(); // This output send filtering array to map comp
    @Output() _sendEventReloadMap = new EventEmitter(); // This output call function in map component when add marker
    @Output() _changeCursorMap = new EventEmitter(); // This output change cursor in map (in map.component)
    @Output() _sendUserMarker = new EventEmitter();
    @Output() _resetUserMarkers = new EventEmitter();
    @Output() _openUserMarker = new EventEmitter();

    resolutionAddTag: boolean = false; // Variable which allows open the modal windows
    MarkerDataForFilter: any[] = []; // Array which sending to filter
    finalFilterArray: any[] = []; // Array which will sent to map component
    btnResetMarkers: boolean = false;
    translateLibrary: any;
    changeAvatar: string = '';
    changePasswordResponse: boolean = false;
    accountMarkers = [];
    handleError: any = {
      status: false,
      errorHead: null,
      errorBody: null
    };
    handleSuccess: any = {
      status: false,
      successHead: null,
      successBody: null
    };
    notHaveAccountMarkers: string;
    dimmerAccountMarkers: boolean = true;
    changeAvatarResponse = {
      loading: false,
      disabled: false
    };
    formsHidden = {
      loginFormHidden: true,
      signupFormHidden: false,
      resetpassFormHidden: false
    };
    filterExpression: string = '';
    filterExpressionAccount: string = '';
    flagsForNotification: any = {
        failedGetMarkers: {
          forButton: false,
          forClose: false
        },
        successAddedMarker: false,
        addingMarkerOnMap: false
    };

    state: string = '';
    error: any;
    user: any;

    checkForm = { // The object which contains boolean var. for check
        name: { // For input 'Species'
            message: <boolean>false, // For red windows. If filled incorrect, show window with tip
            filled: <boolean>false // If the field filled, true
        },
        genus: {
          message: <boolean>false,
          filled: <boolean>false
        },
        comment: { // For input 'Comment'
            message: <boolean>false,
            filled: <boolean>false
        },
        filledAll: <boolean>false // If both the fields filled, true
    };

    data = { // the data to send
        genus: <string>null,
        name: <string>null,
        comment: <string>null,
        coordinateX: <number>null,
        coordinateY: <number>null,
        time: <string>null,
        user: <string>this.auth0.userProfile ? this.auth0.userProfile.user_id : null
    };

    accountUser =  {
        email_verified: "",
        email: "",
        user_metadata: {
            markers: "[]",
            nickname: "",
            img: "fdf"
        },
        updated_at: "",
        name: "",
        'picture': '',
        'user_id': '',
        'nickname': '',
        'identities': [
            {
                'user_id': '',
                'provider': '',
                'connection': '',
                'isSocial': ''
            }
        ],
        'created_at': '',
        'blocked': '',
        'last_password_reset': '',
        'last_ip': '',
        'last_login': '',
        'logins_count': '',
        'blocked_for': [],
        'guardian_enrollments': []
    };
    selectGenus = [];
    contactForm = {
      contactName: null,
      contactMessage: null,
      contactLoading: false,
      errorWindow: false
    };
    verifyEmailForm = {
      verifyLoading: false,
      verifySent: false
    };

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

    protected openUserMarker(link) {
      this._openUserMarker.emit({link: link, closeModal: true});
    }

    protected openAccount(data) {
      if (this.auth0.isAuthenticated() && data.user_id == this.auth0.userProfile.user_id) {
        this.getUserMarkers();
      } else {
        $('#modalAccount').modal({
          blurring: false,
          observeChanges: false,
          autofocus: true,
          onShow: () => {
            $('.ui.accordion').accordion();
          },
          onHide: () => {
            window.history.replaceState(null, null, "/");
          }
        }).modal('show');
        this.accountUser = data;
        $('.custom_segment-markers').css({'z-index': '0 !important'});
        this._markerService.getAccountMarkers(JSON.parse(this.accountUser.user_metadata.markers));
      }
    }

    protected bootstrapDataForSend(data: any[]) { // order function in the service
        if (this.checkForm.filledAll) {
            this.data.user = this.auth0.userProfile ? this.auth0.userProfile.user_id : null;
            if (this.data.genus.charAt(0) === ' ') {
              this.data.genus = this.data.genus.slice(1);
            }
            this.data.name = this.data.genus + ' ' + this.data.name;
            this._sendService.send(data); //a function which sends data to the server
        }
    }

    protected modalAddTag(bool: boolean): void { //1 step, user click on the button "add tag", so allow open a modal window
        this.flagsForNotification.addingMarkerOnMap = bool;
        this.resolutionAddTag = bool;
        this._changeCursorMap.emit(bool)
    }

    protected sendUserMarker(data) {
      $('.modal').modal('hide');
      this.getMarkerForFilter(data);
      this._sendUserMarker.emit(data);

      this.btnResetMarkers = true;
    }

    protected resetUserMarkers() {
      this._resetUserMarkers.emit('some');
    }

    protected resetUserMarkersMobile() {
      this._resetUserMarkers.emit('some');
      $('.ui.sidebar').sidebar('toggle');
    }

    protected modalHelp() {
        $('#modalHelp').modal(this.modalBlurring).modal('show');
    }

    protected modalContact() {
        $('#modalContact').modal(this.modalBlurring).modal('show');
    }

    protected modalAbout() {
      $('#modalAbout').modal(this.modalBlurring).modal('show');
    }

    modalBlurring: Object = {
      blurring: false
    }

    protected modalLogin() {
      $('#modalLogin')
        .modal({
          observeChanges: true
        })
        .modal(this.modalBlurring)
        .modal('show');
    }

    protected modalLoginMobile() {
      $('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('hide', () => {
        this.modalLogin();
      });
    }

    protected modalSignup() {
      $('#modalSignup').modal(this.modalBlurring).modal('show');
    }

    protected modalUser() {
      this.changeAvatar = this.sanitize(this.auth0.userProfile.user_metadata.img);
      window.history.replaceState(null, null, "/");
      window.history.replaceState(null, null, `?user=${this.auth0.userProfile.identities[0].user_id}`);
      $('#modalUser')
        .modal({
          blurring: false,
          observeChanges: false,
          autofocus: true,
          onShow: () => {
            $('#modalUser').parent().addClass('changeBgDimmer');
            $('.ui.accordion').accordion();
          },
          onHide: () => {
            window.history.replaceState(null, null, "/");
          }
        })
        .modal('show')
    }

    protected takeCoor(e): void { //2 step, user click on the map, and open modal window
        let _this = this;
        $('.selection_genus .default').text(this.translateService.translateLibrary.modalTag.set6)
        if (this.resolutionAddTag) {
            $('#modalAddTag').modal({ // open window
                observeChanges: true,
                autofocus: false,
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
        // if (lang_en_name == data) {
        //     this.translateLibrary = lang_en_trans;
        // } else {
        //     this.translateLibrary = lang_ru_trans;
        // }
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
        if (this.checkForm.genus.filled && this.checkForm.name.filled && this.checkForm.comment.filled) {
            this.checkForm.filledAll = true; // For final verification
        }
    }

    protected checkFormGenus() {
      if (this.data.genus && /^[a-zA-Z()-.\s]+$/i.test(this.data.genus) ||
          $('.selection_genus').dropdown('get value')) {
       this.checkForm.genus.filled = true;
       this.checkForm.genus.message = false;
     } else {
       this.checkForm.genus.filled = false;
       this.checkForm.genus.message = true;
       this.checkForm.filledAll = false;
     }
     if (this.checkForm.genus.filled && this.checkForm.name.filled && this.checkForm.comment.filled) {
         this.checkForm.filledAll = true;
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
        if (this.checkForm.genus.filled && this.checkForm.name.filled && this.checkForm.comment.filled) {
            this.checkForm.filledAll = true;
        }
    }

    protected getMarkerForFilter(markers) {
      this.btnResetMarkers = false;
      this.MarkerDataForFilter = markers;
    }

    protected closeMessage(e) { // For closing message (semantic-ui)
    }

    protected showSuccessAddMarker(value) {
      $('.selection_genus').dropdown('restore defaults');
      $('.selection_genus input').val('');
      for (var item in this.data) {
        this.data[item] = null;
      }
      this.flagsForNotification.successAddedMarker = true;
      this.checkForm.genus.message = false;
      setTimeout(() => {
        this.flagsForNotification.successAddedMarker = false;
      }, 5000);
    }

    protected openSidebar() { // Function opened a sidebar
      $('.ui.sidebar').sidebar('toggle');
    }

    protected openAccountFromLink() {
      let thereUser = this.auth0.getHrefProperty('user');
      if (thereUser) { // Check, if link have the user for tag
        let userId = 'auth0|' + thereUser;

        this.auth0.getTokenForManage(userId).subscribe(data => {
          this.auth0.getAccountInfo(data.access_token, userId).subscribe(data => {
            this.openAccount(data);
          },
          err => {
            this.handlingError([JSON.parse(err._body).error, JSON.parse(err._body).message]);
          })
        })

      }
    }

    protected handlingError([head, body]) {
      const _arguments = arguments[0];
      this.handleError.status = true;
      this.handleError.errorHead = _arguments[0];
      this.handleError.errorBody = _arguments[1];
      setTimeout(() => {this.handleError.status = false}, 5000)
    }

    protected handlingSuccess([head, body]) {
      const _arguments = arguments[0];
      this.handleSuccess.status = true;
      this.handleSuccess.successHead = _arguments[0];
      this.handleSuccess.successBody = _arguments[1];
      setTimeout(() => {this.handleSuccess.status = false}, 5000)
    }

    getUserMarkers() {
      $('.ui.sidebar').sidebar('hide')
      this.modalUser();
      this._markerService.getAccountMarkers(JSON.parse(this.auth0.userProfile.user_metadata.markers));
    }

    // tester() {
    //
    // }

    protected getUserMarkers_success(data) {
      this.notHaveAccountMarkers = '';
      this.accountMarkers = [];
      if (data[0]) {
        this.accountMarkers = data[0];
        this.dimmerAccountMarkers = false;
        $('#modalAccount').click();
      } else {
        this.notHaveAccountMarkers = data[1];
        this.dimmerAccountMarkers = false;
        $('#modalAccount').click();
      }
    }

    protected clearErrorWindow() {
      this.validateService.resultValidateForm = [];
      this.auth0.validationFromAuth0 = null;
    }

    protected openLoginForm() {
      this.clearErrorWindow();
      $('.custom_divider, .signup_login-button').hide();
      $('#hFormLogin, #fFormSignup').show();
      $('#signup_form').transition('scale', () => {
        $('#login_form').transition('scale');
      })
    }

    protected openSignupForm() {
      !this.validateService.busyNickname ? this.validateService.checkNickname() : true;
      this.clearErrorWindow();
      $('.custom_divider, .signup_login-button').hide();
      $('#hFormSignup, #fFormLogin').show();
      $('#login_form').transition('scale', () => {
        $('#signup_form').transition('scale');
      })
    }

    protected openResetForm() {
      this.clearErrorWindow();
      $('.custom_divider, .signup_login-button').hide();
      $('#hFormReset, #fFormReset').show();
      $('#login_form').transition('scale', () => {
        $('#reset_form').transition('scale');
      })
    }

    protected closeResetForm() {
      this.clearErrorWindow();
      $('.custom_divider, .signup_login-button').hide();
      $('#hFormLogin, #fFormSignup').show();
      $('#reset_form').transition('scale', () => {
        $('#login_form').transition('scale');
      })
    }

    protected closeUserModal() {
      $('#modalUser').modal('hide');
    }

    protected closeAccountModal() {
      $('#modalAccount').modal('hide');
    }

    protected onFocusSearchBox() {
      $('.fadeOut').fadeOut(200, () => {
        $('#custom_input').addClass('widthSearch')
      });
    }

    protected onBlurSearchBox() {
      $('#custom_input').removeClass('widthSearch');
      setTimeout(() => {$('.fadeOut').fadeIn(200)}, 200)
    }

    protected openSettingsUser() {
      $('#modalUser').addClass('posAbs');
      $('#marker_block').transition('scale', () => {
        $('#settings_block').transition('scale')
      })
      $('#setting-icon').transition('scale', () => {
        $('#setting-icon').hide();
        $('#marker-icon').transition('scale')
      })
    }

    protected openMarkersUser() {
      $('#modalUser').addClass('posAbs');
      $('#settings_block').transition('scale', () => {
        $('#marker_block').transition('scale');
      })
      $('#marker-icon').transition('scale', () => {
        $('#setting-icon').transition('scale')
      })
    }

    protected sanitize(url){
      if (this.auth0.userProfile.user_metadata.img) {
        let link = this.sanitizer.bypassSecurityTrustUrl(url)
        return JSON.parse(link['changingThisBreaksApplicationSecurity']);
      } else {
        return this.auth0.userProfile.picture;
      }
    }

    protected sanitizeForAccount(url) {
      if (this.accountUser.user_metadata.img) {
        let link = this.sanitizer.bypassSecurityTrustUrl(url)
        return link['changingThisBreaksApplicationSecurity'];
      } else {
        return this.accountUser.picture;
      }
    }

    protected changePassword() {
      this.auth0.changePassword().subscribe(res => {
        this.changePasswordResponse = true;
      }, err => {
        console.log("FAILED IN SENDIN TO MAIL. error=", err);
        this.handlingError([this.translateService.translateLibrary.userModal.changePswdSendErrTitle,
                           this.translateService.translateLibrary.userModal.changePswdSendErrText])
      })
    }

    protected checkImgLink(link) {
      this.changeAvatarResponse.loading = true;
      let image = document.getElementById('change-avatar');
      image.onerror = () => {
        this.changeAvatarResponse.disabled = true;
        this.changeAvatarResponse.loading = false;
      };
      image.onload = () => {
        this.changeAvatarResponse.disabled = false;
        this.changeAvatarResponse.loading = false;
      }
    }

    protected getGenus() {
      this.http.get('./assets/genus-select/genus.json')
               .map(res => res.json())
               .subscribe(res => {
                 this.selectGenus = res;
               })
    }

    protected sendContactForm() {
      let resultValidation = this.validateService.checkContactForm(this.contactForm.contactName, this.contactForm.contactMessage);
      if (resultValidation) {
        this.contactForm.contactLoading = true;
        this.contactForm.errorWindow = false;
        emailjs.send('mailgun', 'contact', {
            name: this.contactForm.contactName,
            message: this.contactForm.contactMessage
        })
        .then(response => {
           this.contactForm.contactName = null;
           this.contactForm.contactMessage = null;
           this.contactForm.contactLoading = false;
           $('.ui.modal').modal('hide');
           this.handlingSuccess([this.translateService.translateLibrary.modalContact.respHead,
                                this.translateService.translateLibrary.modalContact.respBody])
        }, err => {
           console.log("FAILED. error=", err);
           this.contactForm.contactName = null;
           this.contactForm.contactMessage = null;
           this.contactForm.contactLoading = false;
           $('.ui.modal').modal('hide');
           this.handlingError([this.translateService.translateLibrary.modalContact.respErrHead,
                              this.translateService.translateLibrary.modalContact.respErrBody])
        });
      } else {
        this.contactForm.errorWindow = true;
      }
    }

    protected verifyEmail() {
      this.verifyEmailForm.verifyLoading = true;
      this.auth0.getTokenForManage('sample').subscribe(res => {
        let url = 'https://antsgeo.eu.auth0.com/api/v2/jobs/verification-email';
        let data: any = {
          "client_id": 'q1MZP2p1lpAiMnoP4jdf5RsveUf13r8x',
          "user_id": this.auth0.userProfile.user_id,
        };

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', `Bearer ${res.access_token}`);

        let options = new RequestOptions({ headers: headers });
        this.http
            .post(url, data, options)
            .map(response => response.json())
            .subscribe(response => {
              this.verifyEmailForm.verifyLoading = false;
              this.verifyEmailForm.verifySent = true;
            }, err => {
              this.verifyEmailForm.verifyLoading = false;
              this.verifyEmailForm.verifySent = false;
              $('.ui.modal').modal('hide');
              this.handlingError(['Error send verify email', 'we write to you'])
            })
      })
    }

    protected matchUp(selected, toselect) {
      let idx = selected.prop('selectedIndex');
      toselect.prop('selectedIndex', idx);
    }

    protected openPrivacy() {
      $('#modalAddTag').modal({onHidden: () => {
        $('#modalPrivacy').modal('show');
      }}).modal('hide');
    }

    protected privacyToAdd() {
      $('#modalPrivacy').modal({onHidden: () => {
        $('#modalAddTag').modal({autofocus: false}).modal('show');
      }}).modal('hide');
    }

    ngOnInit() {
      this.translateService.changeLanguage('en');

      $('#langSelect').dropdown();
      $('#langSelectMobile').dropdown();

        $('.selection_genus').dropdown({
          forceSelection: false,
          placeholder: 'Genus',
          onChange: (value, text) => {
            this.data.genus = value;
            this.checkFormGenus();
          },
          onShow: () => {
            $('.selection_genus input').focus(() => {
              $('.genus_icon').addClass('genus_icon-bef')
            })
            $('.selection_genus input').blur(() => {
              $('.genus_icon').removeClass('genus_icon-bef')
            })
            $('.selection_genus input').keyup((e) => {
              if (e.keyCode == 13) return false;
              this.data.genus = e.currentTarget.value;
              this.checkFormGenus();
            })
          }
        });

        $('#moreSelect').dropdown({
          action: 'hide',
          transition: 'scale'
        });

        $('.custom_title_linkbtn').popup({
          on: 'click',
          html: 'dfdfdf'
        });

        new Clipboard('.btn');

        $('.login_content .form, .custom_divider, .signup_login-button').hide();
        $('#login_form, #hFormLogin, #fFormSignup').show();

        $("#langSelect").change(() => {
          $('#langSelectMobile').dropdown("set selected", $("#langSelect").val());
        });

        $("#langSelectMobile").change(() => {
          $('#langSelect').dropdown("set selected", $("#langSelectMobile").val());
        });

        this.getGenus();

        $('.ui.sidebar a').click(() => {
          $('.ui.sidebar').sidebar('toggle');
        })

        new Clipboard('.link-account');

        $('.ui.sidebar').sidebar('setting', 'transition', 'overlay');

        this.openAccountFromLink();
    }
}
