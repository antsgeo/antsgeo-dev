import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import { TranslateService } from '../translate-service/translate.service';
import { Observable } from 'rxjs/Observable';

declare var emailjs: any;
declare var $: any;

@Injectable()
export class ComplainService {

  constructor(private http: Http, private translateService: TranslateService) {}

  public complainSuccess = new Subject();

  public sendComplain(linkMarker, user, commentComplain) {
    $('.labelClass_complain-window-send').addClass('loading');
    this.translateService.changeLanguage($('#langSelect').val());
    emailjs.send('mailgun', 'complain', {
        linkToMarker: 'https://antsgeo.github.io/?id=' + linkMarker,
        from_mail: user.email,
        name: user.user_metadata.nickname,
        message: commentComplain
    })
    .then(response => {
       this.complainSuccess.next([this.translateService.translateLibrary.complain.respHead,
                                 this.translateService.translateLibrary.complain.respBody])
       $('.labelClass_complain-window-send').removeClass('loading');
       $('.labelClass_complain-window-comment').val('');
    }, err => {
       console.log("COMPLAIN ERROR: ", err);
    });
  }

}
