export const lang_en_name = 'en';

export const lang_en_trans = {
  'modalTag': {
    'title': 'Add tag',
    'set1': 'Specie',
    'set2': 'Comment',
    'set3': 'coordinates and time',
    'set4': 'Cancel',
    'set5': 'Send',
    'set6': 'Genus',
    'privacy': 'I agree with ',
    'privacyLink': 'privacy policy'
  },
  'placeholder': 'Search...',
  'modalHelp': {
    'title': 'Help',
    'p1': {
      'title': 'How to add tag?',
      'text': `
                <div class="ui celled ordered list">
                  <div class="item">
                    Click on the button "Add tag"
                    <img class="ui rounded image modalHelpImg" src="../../assets/img/1-en.png">
                  </div>
                  <div class="item"> After click on the button, move the cursor on the map, cursor will look like how a cross. </div>
                  <div class="item"> Click on the place, where live the ants. </div>
                  <div class="item">
                    Appear a modal window, in him necessary fill a two input field. The first field,
                    it is species of ant. The second field, it is comment for landmark,
                    by which to you can find a colony of ants.
                    <img class="ui rounded image modalHelpImg" src="../../assets/img/2-en.png">
                  </div>
                  <div class="item">
                    When all of the input fields will filled, click on the button "Send" for add the tag on the map.
                    <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg3.png">
                  </div>
                </div>
                `
    },
    'p2': {
      'title': 'How to filter the tags?',
      'text': `
              <div class="ui celled ordered list">
                <div class="item">
                  To filter the tags, enter species ant in the input field "search".
                  <img class="ui rounded image modalHelpImg" src="../../assets/img/3-en.png">
                </div>
              </div>
              `
    },
    'p3': {
      'title': 'How to change style the map?',
      'text':  `
               <div class="ui celled ordered list">
                 <div class="item">
                   To change a style of the map, move the cursor on the icon "layers" .
                   <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg5.png">
                 </div>
                 <div class="item">
                   Select the style of the map.
                   <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg6.png">
                 </div>
               </div>
               `
    },
    'p4': {
      'title': 'How to get the link on the tag?',
      'text': `
              <div class="ui celled ordered list">
                <div class="item">
                  To get the link on the tag, click on the marker to show the pop-up window.
                  <img class="ui rounded image modalHelpImg" src="../../assets/img/4-en.png">
                </div>
                <div class="item">
                  Then just click on the this button, the link copied in clipboard.
                  <img class="ui rounded image modalHelpImg" src="../../assets/img/5-en.png">
                </div>
              </div>
              `
    },
    'button': 'Cancel'
  },
  'modalContact': {
    'title': 'Contacts',
    'p1': `If you have some suggestions or comments about working this a service, write on this mail: `,
    'button': 'Cancel',
    'name': 'Your name',
    'comment': 'Comment',
    'sendBtn': 'Send!',
    'error': 'Field name or comment not filled',
    'respHead': 'Your message has been sent!',
    'respBody': 'Thanks',
    'respErrHead': 'An error has occurred, your email has not been sent',
    'respErrBody': 'Try again or send an email: contact.antgeo@gmail.com',
    'divider': 'OR',
    'mailHead': 'Or write to this mail'
  },
  'modalAbout': {
    'title': 'About',
    'p1': `Antsgeo - it is web application, which visualizes information provided from myrmecologists. <br />
           The mission antsgeo to obtain the location data about of ants  colonies from myrmecologists,
           and to depict as accurate a map of distribution the ants. <br />
           The main advantage is possibility add of information to all myrmecologists.`,
    'button': 'Cancel'
  },
  'copyLinkButton': 'Copy link tag',
  'errorWindow': {
    'p1': {
      'title': 'The field "Species" is not filled or filled incorrectly',
      'text': `Writing ant species is allowed only the Latin alphabet, also allowed next symbols:
              (); -; .;`
    },
    'p2': {
      'title': 'The field "Comment" is not filled',
      'text': 'Please, fill this field. Example: the colony is near a large stone.'
    }
  },
  'errorGetMarkersWindow': {
    'title': 'Server not responding',
    'text': `Unfortunately, the server with data about tags is not responding.
             You can only view the map, adding new tags is currently not possible.`
  },
  'successAddMarker': 'Your tag is added!',
  'addingMarkerOnMap': 'Click on the point where located the ants',
  'menu': {
    'reset': 'Reset markers',
    'login': 'Login',
    'logout': 'Log-out',
    'categories': {
      'title': 'More categories',
      'subtitle1': 'Categories',
      'subtitle2': 'Languages'
    }
  },
  'userModal': {
    'header': 'Your markers',
    'numberMrks': 'Markers',
    'viewBtn': 'show on the map',
    'viewBtnTitle': 'Only my markers',
    'searchMrk': 'Filter...',
    'editMrk': 'Edit marker',
    'nameMrk': 'Name',
    'commentMrk': 'Comment',
    'updBtnMrk': 'Update',
    'updBtnMrkLoading': 'Loading',
    'notMrks': 'You have not yet markers',
    'copyLinkMrk': 'Copy the link on the marker',
    'stnHeader': 'Your settings',
    'changePswdHeader': 'Change password',
    'changePswd': 'Change password',
    'changePswdSend': 'Sent',
    'changePswdSendErrTitle': 'Error when sending emails',
    'changePswdSendErrText': 'Unfortunately, the letter could not be sent, try again or contact us via email.',
    'changePswdText': 'A letter with a unique link will be sent to your email. <br /> The link in the email will activate once.',
    'changePswdSentText': 'An email with a link was sent to your e-mail. <br />',
    'changeAvatar': 'Change avatar',
    'changeAvatarBtn': 'Change',
    'changeAvatarInput': 'Url...',
    'verifyHeader': 'Verify your email',
    'verifyText': 'We sent an email for confirmation of Your account. If the letter is not reached,',
    'verifySend': 'send again',
    'verifyLoading': 'sending...',
    'verifySent': 'email sent!'
  },
  'accountModal': {
    'onlyMrk': 'Only',
    'onlyMrks': 'markers',
    'notMrks': 'Have not yet markers',
    'infoMrk': 'Marker information',
    'userMrks': 'Markers'
  },
  'loginModal': {
    'login': 'Login',
    'signup': 'Sign-up',
    'rstPswd': 'Reset password',
    'forgotPswd': 'Forgot your password?',
    'forgotPswdLink': 'reset password!',
    'nickBusy': 'Nickname is taken',
    'newRegister': 'New to us?',
    'newRegisterLink': 'Join!',
    'newLogin': 'Already registered?',
    'newLoginLink': 'Login!',

    'placeholderEmail': 'Your email...',
    'placeholderPswd': 'Your password...',
    'placeholderPswdConfirm': 'Confirm password...',
    'placeholderNick': 'Your nickname...',
    'loginBtn': 'Login!',
    'registerBtn': 'Sign-up!',
    'resetBtn': 'Send!',
    'resetSuc': 'The letter was sent!'
  },
  'validate': {
    'ivdEmail': 'Invalid email',
    'pswdLessSix': 'Password less than 6 characters',
    'pswdSimilar': 'Passwords do not match',
    'nicknameLessFour': 'Nickname less than 4 characters or already taken',
    'wrongPswd': 'Wrong email or password',
    'onlyRegister': 'Only for register users',
    'copyLinkBtn': 'Click for copy link tag'
  },
  'complain': {
    'complainBtn': 'Complain to this marker',
    'back': 'back',
    'head': 'Complain',
    'comment': 'Comment',
    'placeholder': 'Not requaired',
    'sendBtn': 'Send!',
    'respHead': 'Your complaint has been sent',
    'respBody': 'Thank you for your cooperation! We will review your application soon.'
  },
  'errorAuth': {
    'blocked': 'Your account has been blocked after multiple consecutive login attempts. We’ve sent you an email with instructions on how to unblock it.',
    'access': 'Wrong email or password.'
  },
  'modalPrivacy': {
    'title': 'Privacy Policy',
    'content': `Antsgeo operates the <a href="https://antsgeo.github.io">https://antsgeo.github.io</a> website & service.
                This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service.
                We will not use or share your information with anyone except as described in this Privacy Policy.
                We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at <a href="https://antsgeo.github.io">https://antsgeo.github.io</a>
                <br>
                <h3> Information Collection And Use </h3>
                While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your email address, name, postal address & Personal Information.
                The purpose for which we collect personal information is to provide you with the best service experience possible on the Service and for our internal business purposes that form part of normal business practices. Some provision of personal information is optional. However, if you do not provide us with certain types of personal information, you may be unable to enjoy the full functionality of the Service.
                <h3> Log Data </h3>
                We may also collect information that your browser sends whenever you visit our Service & Log Data. This Log Data may include information such as your computer's Internet Protocol & IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.
                <h3> Cookies </h3>
                Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.
                We use cookies; to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                We send a session cookie to your computer when you log in to your User account. This type of cookie helps if you visit multiple pages on the Service during the same session, so that you don't need to enter your password on each page. Once you log out or close your browser, this cookie expires.
                We also use longer-lasting cookies for other purposes such as to display your Content and account information. We encode our cookie so that only we can interpret the information stored in them. Users always have the option of disabling cookies via their browser preferences. If you disable cookies on your browser, please note that some parts of our Service may not function as effectively or may be considerably slower.
                <h3> Service Providers </h3>
                We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
                These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                <h3> Communications </h3>
                We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.
                <h3> Security </h3>
                The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                <h3> International Transfer </h3>
                Your information, including Personal Information, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
                If you are located outside Australia and choose to provide information to us, please note that we transfer the information, including Personal Information, to Australia and process it there.
                Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
                <h3> Access and Correction </h3>
                Australian Privacy Principle 6 of the Privacy Act 1988 (Cth) allows you to get access to, and correct, the personal information we hold about you in certain circumstances. If you would like to obtain such access, please contact us on the details set out above.
                Please note that the access and correction requirements under this Privacy Policy operates alongside and do not replace other informal or legal procedures by which an individual can be provided access to, or correction of, their personal information, including the requirements under the Freedom of Information Act 1982 (Cth).
                <h3> Complaints </h3>
                Australian Privacy Principle 1 of the Privacy Act 1988 (Cth) allows you to make a complaint about any alleged breaches of privacy. In order to lodge a complaint with us, please contact us using the details above with the following information:
                <br> <br>
                Your name and address; <br>
                Details of the alleged breach of privacy; and <br>
                URL link to the alleged breach of privacy (if applicable). <br>
                Please allow us 30 days to investigate your complaint, after which we will contact you immediately to resolve the issue.
                <br>
                <h3> Retention of Information </h3>
                We retain information for as long as required, allowed or we believe it useful, but do not undertake retention obligations. We may dispose of information in our discretion without notice, subject to applicable law that specifically requires the handling or retention of information. You must keep your own, separate back-up records.
                <h3> Links To Other Sites </h3>
                Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
                We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                <h3> Children's Privacy </h3>
                Our Service does not address anyone under the age of 18.
                We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from children under 18 without verification of parental consent, we take steps to remove that information from our servers or replace it with the Personal Information of the Children’s parent or guardian.
                <h3> Changes To This Privacy Policy </h3>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.
                <h3> Consent </h3>
                You warrant that you are able to give consents under Australian Law or, in the event that you do not have the capacity to give consent, you warrant that your guardian or attorney is able to give any consent required under this Privacy Policy on your behalf.
                You hereby expressly and voluntarily grant your informed consent to us to deal with your personal information in accordance with the terms and conditions of this Privacy Policy. Should you retract your consent, please contact us. If you retract your consent, you acknowledge and agree that failure to provide certain types of personal information may not give you access to the full functionality of the Service.
                <h3> Contact Us </h3>
                If you have any questions about this Privacy Policy, please contact us.`,
    'btnClose': 'Back'
  }
}
