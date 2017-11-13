import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Auth } from '../auth-service/auth.service';

import { lang_en_trans, lang_en_name } from '../translate-lib/lang-en';
import { lang_ru_trans, lang_ru_name } from '../translate-lib/lang-ru';

@Injectable()
export class TranslateService {

  constructor (public auth0: Auth) {}

  translateLibrary = null;

  public changeLanguage(lang) {
    if (lang_en_name == lang) {
        this.translateLibrary = lang_en_trans;
    } else {
        this.translateLibrary = lang_ru_trans;
    }
    this.auth0.changeLang(this.translateLibrary);
  }

  public getActualLang() {
    return this.translateLibrary;
  }

  ngOnInit() { }
}
