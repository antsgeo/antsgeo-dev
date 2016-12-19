export const lang_en_name = 'en';

export const lang_en_trans = {
  'modalTag': {
    'title': 'Add tag',
    'set1': 'Species',
    'set2': 'Comment',
    'set3': 'coordinates and time',
    'set4': 'Cancel',
    'set5': 'Send'
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
                    <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg1.png">
                  </div>
                  <div class="item"> After click on the button, move the cursor on the map, cursor will look like how a cross. </div>
                  <div class="item"> Click on the place, where live the ants. </div>
                  <div class="item">
                    Appear a modal window, in him necessary fill a two input field. The first field,
                    it is species of ant. The second field, it is comment for landmark,
                    by which to you can find a colony of ants.
                    <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg2.png">
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
                  <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg4.png">
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
                  <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg7.png">
                </div>
                <div class="item">
                  Then just click on the this button, the link copied in clipboard.
                  <img class="ui rounded image modalHelpImg" src="../../assets/img/modalImg8.png">
                </div>
              </div>
              `
    },
    'button': 'Cancel'
  },
  'modalContact': {
    'title': 'Contacts',
    'p1': `If you have some suggestions or comments about working this a service, write on this mail: `,
    'button': 'Cancel'
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
  'addingMarkerOnMap': 'Click on the point where located the ants'
}
