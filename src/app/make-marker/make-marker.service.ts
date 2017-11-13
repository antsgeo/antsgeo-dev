import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ComplainService } from '../complain-service/complain.service';
import { Auth } from '../auth-service/auth.service';
import { TranslateService } from '../translate-service/translate.service';

declare var $: any;

@Injectable()
export class MakeMarkerService {
  constructor(private complainService: ComplainService,
              private auth0: Auth,
              private translateService: TranslateService) { }

  public labelMarker(marker) {
    let together = '';
    let markerName = marker.name.split(/(\s+)/).filter((e) => {
      return e.trim().length > 0;
    });

    if (markerName.length >= 3) {
      let genus = markerName[0].slice(0, 1).toUpperCase();
      let specie = markerName[1] + ' ' + markerName[2];
      together = genus + '. ' + specie;
    } else {
      let genus = markerName[0].slice(0, 1).toUpperCase();
      let specie = markerName[1];
      together = genus + '. ' + specie;
    }

    return `
      <div class="labelClass_point">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 490 490" style="enable-background:new 0 0 490 490;" xml:space="preserve" width="512px" height="512px">
        <g>
        	<polygon points="244.716,321.219 187.707,384.129 245.001,490 302.082,384.508  " fill="#e74c3c"/>
        	<path d="M245.001,0C157.687,0,86.905,70.781,86.905,158.094c0,14.641,1.999,28.812,5.724,42.266   c1.491,5.388,3.252,10.663,5.283,15.803l4.793,10.894l77.277,142.8l64.733-71.428l65.089,71.806l77.676-143.552l4.321-9.818   c2.149-5.363,4.011-10.871,5.57-16.505c3.724-13.455,5.723-27.626,5.723-42.266C403.095,70.781,332.314,0,245.001,0z    M245.001,234.271c-42.797,0-77.609-34.812-77.609-77.609c0-42.79,34.812-77.602,77.609-77.602   c42.797,0,77.609,34.812,77.609,77.602C322.61,199.459,287.798,234.271,245.001,234.271z" fill="#e74c3c"/>
        </g>
        </svg>
      </div>
      <div class="lableClass_label">
        ${together}
      </div>
    `
  }

  public usuallyMarker(marker, localLink) {
    return `
      <div class="labelClass_complain-window">
        <i class="icon remove labelClass_complain-window-close"> </i>
        <div class="labelClass_complain-window-head"></div>
        <div class="ui form">
          <div class="field">
            <label class="labelClass_complain-window-label"></label>
            <div class="ui left icon input">
              <textarea rows="2" class="labelClass_complain-window-comment" placeholder='Not requaired'></textarea>
              <i class="align left icon"></i>
            </div>
            <button class="ui yellow basic fluid button labelClass_complain-window-send labelClass_complain-window-send-btn"><i class="icon send"></i><span></span></button>
          </div>
        </div>
      </div>

      <div class="labelClass_specie labelClass_specie-usually">
        ${marker.name}
      </div>

      <div class="labelClass_complain labelClass_complain-usually">
        <div class="ui right pointing label">That name is taken! </div>
        <i class="warning sign orange icon"> </i>
      </div>
      <div class="labelClass_comment">
        ${marker.comment}
      </div>
      <hr class="labelClass_hr"/>
      <button class="ui basic button btn labelClass_copyLink" data-tooltip="https://antsgeo.github.io/?id=${localLink}"
      data-clipboard-text="https://antsgeo.github.io/?id=${localLink}" data-position="top center">
        <i class="icon copy"></i>
        <span></span>
      </button>
      <hr class="labelClass_hr"/>
      <div class="labelClass_coor">
        ${marker.coordinateX}, ${marker.coordinateY}
      </div>
      <div class="labelClass_time">
        ${marker.time}
      </div>
      <div class="labelClass_clear"> </div>
    `
  }

  public userMarker(marker, localLink, dataUser) {
    let img = dataUser.user_metadata.img ? JSON.parse(dataUser.user_metadata.img) : dataUser.picture;

    return `
      <div class="labelClass_complain-window">
        <i class="icon remove labelClass_complain-window-close"> </i>
        <div class="labelClass_complain-window-head"></div>
        <div class="ui form">
          <div class="field">
            <label class="labelClass_complain-window-label"></label>
            <div class="ui left icon input">
              <textarea rows="2" class="labelClass_complain-window-comment" placeholder='Not requaired'></textarea>
              <i class="align left icon"></i>
            </div>
            <button class="ui yellow basic fluid button labelClass_complain-window-send-btn labelClass_complain-window-send"><i class="icon send"></i><span></span></button>
          </div>
        </div>
      </div>

      <div class="labelClass_specie labelClass_specie-margin labelClass_specie-user">
        ${marker.name}
      </div>
      <div class="labelClass_user">
        <div class="labelClass_complain labelClass_complain-user">
          <div class="ui right pointing pointing-user label">That name is taken! </div>
          <i class="warning sign orange icon" > </i>
        </div>

        <div class="labelClass_user-avatar" style="background-image: url(${img})"></div>
        <div class="labelClass_user-nickname" ><a href="#" >${dataUser.user_metadata.nickname}</a></div>
      </div>
      <div class="labelClass_comment">
        ${marker.comment}
      </div>
      <hr class="labelClass_hr"/>
      <button class="ui basic button btn labelClass_copyLink" data-tooltip="https://antsgeo.github.io/?id=${localLink}"
      data-clipboard-text="https://antsgeo.github.io/?id=${localLink}" data-position="top center">
        <i class="icon copy"></i>
        <span></span>
      </button>
      <hr class="labelClass_hr"/>
      <div class="labelClass_coor">
        ${marker.coordinateX}, ${marker.coordinateY}
      </div>
      <div class="labelClass_time">
        ${marker.time}
      </div>
      <div class="labelClass_clear"> </div>
    `
  }

  public jqueryManipulate(linkMarker, user = this.auth0.userProfile) {
    this.translateService.changeLanguage($('#langSelect').val());

    $( ".leaflet-popup-content").unbind("click");
    $('.labelClass_complain-window').removeClass('visible');
    $('.labelClass_complain-window').addClass('hidden');
    $('.labelClass_complain-window-head').text(this.translateService.translateLibrary.complain.head);
    $('.labelClass_complain-window-label').text(this.translateService.translateLibrary.complain.comment)
    $('.labelClass_complain-window-comment').attr('placeholder', this.translateService.translateLibrary.complain.placeholder);
    $('.labelClass_complain-window-send span').text(this.translateService.translateLibrary.complain.sendBtn);

    $('.leaflet-popup-content').on('click', '.labelClass_complain', () => {
      if (this.auth0.isAuthenticated()) {
        $('.labelClass_complain-window').transition({animation: 'vertical flip', duration: 300});
      }
    });

    $('.labelClass_copyLink span').text(this.translateService.translateLibrary.validate.copyLinkBtn);

    $('.labelClass_complain').hover(() => {
      if (!this.auth0.isAuthenticated()) {
        $('.labelClass_complain > .pointing').text(this.translateService.translateLibrary.validate.onlyRegister);
        $('.labelClass_complain > .pointing').css({'right': '32px', 'opacity': '1', 'visibility': 'visible'});
      }
    }, () => {
      $('.labelClass_complain > .pointing').css({'right': '50px', 'opacity': '0', 'visibility': 'hidden'});
    })

    $('.leaflet-popup-content').on('click', '.labelClass_complain-window-close', () => {
      $('.labelClass_complain-window').transition({animation: 'vertical flip', duration: 300});
    });

    $('.leaflet-popup-content').on('click', '.labelClass_complain-window-send-btn', () => {
      let commentComplain = $('.labelClass_complain-window-comment').val();
      this.complainService.sendComplain(linkMarker, user, commentComplain);
    });
  }

  ngOnInit() {}
}
