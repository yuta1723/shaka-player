// myapp.js

// var manifestUri =
    // 'https://storage.googleapis.com/shaka-demo-assets/angel-one-clearkey/dash.mpd';

// var manifestUri = 'https://tsg01.uliza.jp/ulizahtml5/content/dash/customer01/bbb_2M_100sec.mpd';
var manifestUri = 'https://storage.googleapis.com/wvmedia/cenc/h264/tears/tears_sd.mpd';

var ULIZA_ERROR_CODE = 10000;

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

function initPlayer() {
  // Create a Player instance.
  var video = document.getElementById('video');
  var player = new shaka.Player(video);


  // 0 : Clear Contents
  // 1 : for Google Widevine Contents.
  // 2 : for PLAY Packaged Widevine Contents (hybrid)
  // 3 : for PLAY Packaged Widevine Contents (widevine)
  var playbackContentType = 7;


  var configration = null;
  var widevineServiceCertificate = 'CsECCAMSEBcFuRfMEgSGiwYzOi93KowYgrSCkgUijgIwggEKAoIBAQCZ7Vs7Mn2rXiTvw7YqlbWYUgrVvMs3UD4GRbgU2Ha430BRBEGtjOOtsRu4jE5yWl5KngeVKR1YWEAjp+GvDjipEnk5MAhhC28VjIeMfiG/+/7qd+EBnh5XgeikX0YmPRTmDoBYqGB63OBPrIRXsTeo1nzN6zNwXZg6IftO7L1KEMpHSQykfqpdQ4IY3brxyt4zkvE9b/tkQv0x4b9AsMYE0cS6TJUgpL+X7r1gkpr87vVbuvVk4tDnbNfFXHOggrmWEguDWe3OJHBwgmgNb2fG2CxKxfMTRJCnTuw3r0svAQxZ6ChD4lgvC2ufXbD8Xm7fZPvTCLRxG88SUAGcn1oJAgMBAAE6FGxpY2Vuc2Uud2lkZXZpbmUuY29tEoADrjRzFLWoNSl/JxOI+3u4y1J30kmCPN3R2jC5MzlRHrPMveoEuUS5J8EhNG79verJ1BORfm7BdqEEOEYKUDvBlSubpOTOD8S/wgqYCKqvS/zRnB3PzfV0zKwo0bQQQWz53ogEMBy9szTK/NDUCXhCOmQuVGE98K/PlspKkknYVeQrOnA+8XZ/apvTbWv4K+drvwy6T95Z0qvMdv62Qke4XEMfvKUiZrYZ/DaXlUP8qcu9u/r6DhpV51Wjx7zmVflkb1gquc9wqgi5efhn9joLK3/bNixbxOzVVdhbyqnFk8ODyFfUnaq3fkC3hR3f0kmYgI41sljnXXjqwMoW9wRzBMINk+3k6P8cbxfmJD4/Paj8FwmHDsRfuoI6Jj8M76H3CTsZCZKDJjM3BQQ6Kb2m+bQ0LMjfVDyxoRgvfF//M/EEkPrKWyU2C3YBXpxaBquO4C8A0ujVmGEEqsxN1HX9lu6c5OMm8huDxwWFd7OHMs3avGpr7RP7DUnTikXrh6X0';
  var addedLicenseStatusFlag = false;
  var addedLicenseRequestFilterFlag = false;


  if (playbackContentType === 0) {



  } else if (playbackContentType === 1) {
    // clearKey content provided cwip
    manifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one-clearkey/dash.mpd';
    configration = {
      drm : {
        servers : {
          'org.w3.clearkey' :'https://cwip-shaka-proxy.appspot.com/clearkey?_u3wDe7erb7v8Lqt8A3QDQ=ABEiM0RVZneImaq7zN3u_w'
        }
      }
    }
  } else if (playbackContentType === 2) {
    // drm content with widevine provided cwip
    manifestUri = 'https://storage.googleapis.com/wvmedia/cenc/h264/tears/tears_sd.mpd';
    configration = {
      drm : {
        servers : {
          'com.widevine.alpha' :'https://proxy.staging.widevine.com/proxy'
        }
      }
    }
  } else if (playbackContentType === 3) {
    // drm widevine content packaged play, inc.
    manifestUri = 'https://d1pw4oisbnjibh.cloudfront.net/contents/dash/widevine/bbb_2M_100sec.mpd';
    configration = {
      drm : {
        servers : {
          'com.widevine.alpha' :'https://tsg01.uliza.jp/ulizahtml5/dash_api/rights_issuer.php?streamid=bbb_2M_100sec&pssh=AAAAWHBzc2gAAAAA7e%2BLqXnWSs6jyCfc1R0h7QAAADgIARIQxXcyfkNpsb3dz3hYVXtRrxoMc2tpbGx1cHZpZGVvIg1iYmJfMk1fMTAwc2VjKgVTRF9IRA%3D%3D'
        },
        advanced: {
          'com.widevine.alpha': {
          'serverCertificate': base64ToUint8Array(widevineServiceCertificate),
            'videoRobustness': 'SW_SECURE_CRYPTO',
            'audioRobustness': 'SW_SECURE_CRYPTO'
          }
        }
      }
    }
    addedLicenseStatusFlag = true; //nop
  } else if (playbackContentType === 4) {
    // drm hybrid content packaged play, inc.
    manifestUri = 'https://tsg01.uliza.jp/ulizahtml5/content/dash/customer01/bbb_2M_100sec.mpd';
    configration = {
      drm : {
        servers : {
          'com.widevine.alpha' :'https://tsg01.uliza.jp/ulizahtml5/dash_api/rights_issuer.php?streamid=bbb_2M_100sec&pssh=AAAAWHBzc2gAAAAA7e%2BLqXnWSs6jyCfc1R0h7QAAADgIARIQxXcyfkNpsb3dz3hYVXtRrxoMc2tpbGx1cHZpZGVvIg1iYmJfMk1fMTAwc2VjKgVTRF9IRA%3D%3D'
        },
        advanced: {
          'com.widevine.alpha': {
            'serverCertificate': base64ToUint8Array(widevineServiceCertificate),
            'videoRobustness': 'SW_SECURE_CRYPTO',
            'audioRobustness': 'SW_SECURE_CRYPTO'
          }
        }
      }
    }
    addedLicenseStatusFlag = true;
  } else if (playbackContentType === 5) {
    // drm widevine content packaged play, inc.
    manifestUri = 'https://d1pw4oisbnjibh.cloudfront.net/contents/dash/widevine/bbb_2M_100sec.mpd';
    configration = {
      drm : {
        servers : {
          'com.widevine.alpha' :'https://tsg01.uliza.jp/ulizahtml5/dash_api/rights_issuer.php?streamid=bbb_2M_100sec'
        },
        advanced: {
          'com.widevine.alpha': {
          'serverCertificate': base64ToUint8Array(widevineServiceCertificate),
            'videoRobustness': 'SW_SECURE_CRYPTO',
            'audioRobustness': 'SW_SECURE_CRYPTO'
          }
        }
      }
    }
    addedLicenseStatusFlag = true;
    addedLicenseRequestFilterFlag = true;
  } else if (playbackContentType === 6) {
    // drm hybrid content packaged play, inc.
    manifestUri = 'https://tsg01.uliza.jp/ulizahtml5/content/dash/customer01/bbb_2M_100sec.mpd';
    configration = {
      drm : {
        servers : {
          'com.widevine.alpha' :'https://tsg01.uliza.jp/ulizahtml5/dash_api/rights_issuer.php?streamid=bbb_2M_100sec'
        },
        advanced: {
          'com.widevine.alpha': {
            'serverCertificate': base64ToUint8Array(widevineServiceCertificate),
            'videoRobustness': 'SW_SECURE_CRYPTO',
            'audioRobustness': 'SW_SECURE_CRYPTO'
          }
        }
      }
    }
    addedLicenseStatusFlag = true;
    addedLicenseRequestFilterFlag = true;
  } else if (playbackContentType === 7) {
    // drm hybrid content packaged play, inc.
    manifestUri = 'https://tsg01.uliza.jp/dash/contents/customer01/wv_sample.mpd';
    configration = {
      drm : {
        servers : {
          'com.widevine.alpha' :'https://wvlp02.uliza.jp/lp/customer01/GetEMMs2.php?serverid=skillup&streamid=sample_episode&pssh=AAAAW3Bzc2gAAAAA7e%2BLqXnWSs6jyCfc1R0h7QAAADsIARIQQNDa0Kz7m%2BknpQMkJ9yUwBoMc2tpbGx1cHZpZGVvIg5zYW1wbGVfZXBpc29kZSoFU0RfSEQyAA%3D%3D'
        },
        advanced: {
          'com.widevine.alpha': {
            'serverCertificate': base64ToUint8Array(widevineServiceCertificate),
            'videoRobustness': 'SW_SECURE_CRYPTO',
            'audioRobustness': 'SW_SECURE_CRYPTO'
          }
        }
      }
    }
    addedLicenseStatusFlag = true;
    addedLicenseRequestFilterFlag = true;
  }

  var licenseRequestFilter = function(request, drmInfo) {
    // Log.enter(Log.t, TAG, 'updateWidevineLicenseRequest');
    if (!drmInfo || !drmInfo.initData) {
      return;
    }
    var initDataAry = drmInfo.initData;
    if (initDataAry.length < 1 || initDataAry[0].initData.length < 1) {
      return;
    }
    var psshStr = btoa(String.fromCharCode.apply(null, initDataAry[0].initData));
    var psshQueryParam = 'pssh=' + encodeURIComponent(psshStr);
    var uriCount = request.uris.length;
    for (var i = 0; i < uriCount; i++) {
      var uri = request.uris[i];
      if (uri.indexOf('&') === -1) {
        if (uri.indexOf('?') === -1) {
          uri = uri + '?' + psshQueryParam;
        } else {
          uri = uri + '&' + psshQueryParam;
        }
      } else {
        uri = uri + '&' + psshQueryParam;
      }
      request.uris[i] = uri;
    }
  };

  var licenseResponseFilter = function(type, response) {
    //Log.enter(Log.t, TAG, 'licenseResponseFilter');
    if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
      return;
    }

    console.log('Remove license flag.');

    var drmInfo = player.drmInfo();
    // var drmInfo = this.mediaPlayer_.drmInfo();
    if (! drmInfo) {
      return;
    }
    // widevine
    if (drmInfo.keySystem === 'com.widevine.alpha') {
      // Only manipulate license responses for Widevine
      var licResponse = new Uint8Array(response.data);
      if (licResponse.byteLength < 4) {
          throw new shaka.util.Error(shaka.util.Error.Category.DRM, ULIZA_ERROR_CODE, 'License response is in illegal format');
      }
      // Status code of License Request is 4bytes in the beginning of license response data
      var licStatusCode = licResponse[3]
                          | (licResponse[2] << 8)
                          | (licResponse[1] << 16)
                          | (licResponse[0] << 24);
      if (licStatusCode === 1) {
        if (licResponse.byteLength == 4) {
          throw new shaka.util.Error(shaka.util.Error.Category.DRM,ULIZA_ERROR_CODE,'No license data was obtained');
        }
        response.data = licResponse.subarray(4);
      } else {
        throw new shaka.util.Error(shaka.util.Error.Category.DRM,
                                             ULIZA_ERROR_CODE,
                                             'License request was failed: licenseStatus=' + licStatusCode);
      }
    }
    // playready
    else if (drmInfo.keySystem === 'com.microsoft.playready') {
        // NOP
    }
    // otherwise
    else {
        // NOP
    }
  };//.bind(this);



  if (addedLicenseRequestFilterFlag)  {
    player.getNetworkingEngine().registerRequestFilter(licenseRequestFilter);
  }

  if (addedLicenseStatusFlag) {
    player.getNetworkingEngine().registerResponseFilter(licenseResponseFilter);
  }


  player.configure(configration);


  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  player.load(manifestUri).then(function() {
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  }).catch(onError);  // onError is executed if the asynchronous load fails.
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

function base64ToUint8Array(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes
}


document.addEventListener('DOMContentLoaded', initApp);
