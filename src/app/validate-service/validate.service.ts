import { Injectable } from '@angular/core';
import { Auth } from '../auth-service/auth.service';
import { TranslateService } from '../translate-service/translate.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ValidateService {
  constructor(private auth0: Auth, private translateService: TranslateService) {}

  resultValidateForm = [];
  busyNickname: any = null;
  regexPass = /^(?=.*[a-z0-9])[a-z0-9!@#$%&*.]{6,}$/i;
  regexNick = /^(?=.*[a-z0-9])[a-z0-9!@_,^)(=+/|#$%&\-*.]{4,}$/i;
  regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  nickIsBusy: boolean = false;
  resetPassSuccess: boolean = false;

  public checkNickname() {
    this.auth0.getTokenForManage('some').subscribe(data => {
      this.auth0.getAccountsMetadata(data.access_token).subscribe(data => {
        this.busyNickname = data;
      })
    })
  }

  public checkLoginForm(email, pass): void {
    this.resultValidateForm = [];
    if (this.checkFormEmail(email)) {
      this.auth0.login(email, pass)
    } else {
      this.checkFormEmail(email) ? null : this.resultValidateForm.push(this.translateService.translateLibrary.validate.ivdEmail);
    }
  }

  public checkSignupForm(email, pass, confirmPass, nick) {
    this.resultValidateForm = [];

    if(this.checkFormEmail(email) && this.checkFormPass(pass)
       && this.checkFormNickname(nick) && this.checkSimilarPass(pass, confirmPass)) {
      this.auth0.signUp(email, pass, nick);
    } else {
      this.checkFormEmail(email) ? null : this.resultValidateForm.push(this.translateService.translateLibrary.validate.ivdEmail);
      this.checkFormPass(pass) ? null : this.resultValidateForm.push(this.translateService.translateLibrary.validate.pswdLessSix);
      this.checkSimilarPass(pass, confirmPass) ? null : this.resultValidateForm.push(this.translateService.translateLibrary.validate.pswdSimilar);
      this.checkFormNickname(nick) ? null : this.resultValidateForm.push(this.translateService.translateLibrary.validate.nicknameLessFour);
    }
  }

  public checkResetForm(email) {
    this.resultValidateForm = [];
    if (this.checkFormEmail(email)) {
      this.auth0.resetPassword(email).subscribe(response => {
        this.auth0.responseToForm = false;
        this.resetPassSuccess = true;
      }, err => {
        this.auth0.validationFromAuth0 = err.description;
      })
    } else {
      this.checkFormEmail(email) ? null : this.resultValidateForm.push(this.translateService.translateLibrary.validate.ivdEmail);
    }
  }

  public checkFormEmail(email) {
    return this.regexEmail.test(email);
  }

  public checkFormPass(pass) {
    if (this.regexPass.test(pass)) return true;
    else return false;
  }

  public checkSimilarPass(pass, confirmPass) {
    if (pass && pass == confirmPass) return true;
    else return false;
  }

  public checkFormNickname(nick) {
    this.nickIsBusy = false;
    if (this.regexNick.test(nick)) {
      for (var k in this.busyNickname) {
        if (this.busyNickname[k].user_metadata.nickname === nick) {
          this.nickIsBusy = true;
          return false;
        }
      }
      return true;
    }
    else return false;
  }

  public checkContactForm(name, message) {
    let inValid = /\S/;
    if (inValid.test(name) && inValid.test(message)
        && name && message) {
      return true;
    } else {
      return false;
    }
  }

}
