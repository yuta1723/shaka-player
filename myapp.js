// myapp.js

// var manifestUri =
    'https://storage.googleapis.com/shaka-demo-assets/angel-one-clearkey/dash.mpd';

var manifestUri = 'https://tsg01.uliza.jp/ulizahtml5/content/dash/customer01/bbb_2M_100sec.mpd';

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

  // var configration = {
  //   drm : {
  //     servers : {
  //       org.w3.clearkey :
  //     }
  //   }
  // }
  // player.configure('drm.servers.org\.w3\.clearkey','https://cwip-shaka-proxy.appspot.com/clearkey?_u3wDe7erb7v8Lqt8A3QDQ=ABEiM0RVZneImaq7zN3u_w');

  var widevineServiceCertificate = 'CsECCAMSEBcFuRfMEgSGiwYzOi93KowYgrSCkgUijgIwggEKAoIBAQCZ7Vs7Mn2rXiTvw7YqlbWYUgrVvMs3UD4GRbgU2Ha430BRBEGtjOOtsRu4jE5yWl5KngeVKR1YWEAjp+GvDjipEnk5MAhhC28VjIeMfiG/+/7qd+EBnh5XgeikX0YmPRTmDoBYqGB63OBPrIRXsTeo1nzN6zNwXZg6IftO7L1KEMpHSQykfqpdQ4IY3brxyt4zkvE9b/tkQv0x4b9AsMYE0cS6TJUgpL+X7r1gkpr87vVbuvVk4tDnbNfFXHOggrmWEguDWe3OJHBwgmgNb2fG2CxKxfMTRJCnTuw3r0svAQxZ6ChD4lgvC2ufXbD8Xm7fZPvTCLRxG88SUAGcn1oJAgMBAAE6FGxpY2Vuc2Uud2lkZXZpbmUuY29tEoADrjRzFLWoNSl/JxOI+3u4y1J30kmCPN3R2jC5MzlRHrPMveoEuUS5J8EhNG79verJ1BORfm7BdqEEOEYKUDvBlSubpOTOD8S/wgqYCKqvS/zRnB3PzfV0zKwo0bQQQWz53ogEMBy9szTK/NDUCXhCOmQuVGE98K/PlspKkknYVeQrOnA+8XZ/apvTbWv4K+drvwy6T95Z0qvMdv62Qke4XEMfvKUiZrYZ/DaXlUP8qcu9u/r6DhpV51Wjx7zmVflkb1gquc9wqgi5efhn9joLK3/bNixbxOzVVdhbyqnFk8ODyFfUnaq3fkC3hR3f0kmYgI41sljnXXjqwMoW9wRzBMINk+3k6P8cbxfmJD4/Paj8FwmHDsRfuoI6Jj8M76H3CTsZCZKDJjM3BQQ6Kb2m+bQ0LMjfVDyxoRgvfF//M/EEkPrKWyU2C3YBXpxaBquO4C8A0ujVmGEEqsxN1HX9lu6c5OMm8huDxwWFd7OHMs3avGpr7RP7DUnTikXrh6X0';


  var licenseRequestFilter = function(type, request) {
    // Alias some utilities provided by the library.
    var StringUtils = shaka.util.StringUtils;
    var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;

    // Only manipulate license requests:
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      // Create the wrapped request structure.
      var wrapped = {};

      // Encode the raw license request in base64.
      // The server we are using in this tutorial expects this field and this
      // encoding for the raw request.
      wrapped.rawLicenseRequestBase64 =
          Uint8ArrayUtils.toBase64(new Uint8Array(request.body));

      // Add whatever else we want to communicate to the server.
      // None of these values are read by the server we are using in this
      // tutorial.
      // In practice, you would send what the server needs and the server would
      // react to it.
      wrapped.favoriteColor = 'blue';
      wrapped.Beatles = ['John', 'Paul', 'George', 'Ringo'];
      wrapped.bestBeatleIndex = 1;  // Paul, of course.
      wrapped.pEqualsNP = false;  // maybe?

      // Encode the wrapped request as JSON.
      var wrappedJson = JSON.stringify(wrapped);
      // Convert the JSON string back into an ArrayBuffer to replace the request
      // body.
      request.body = StringUtils.toUTF8(wrappedJson);
    }
  };

  var licenseResposeFilter = function(type, response) {
    // Alias some utilities provided by the library.
    var StringUtils = shaka.util.StringUtils;
    var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;

    // Only manipulate license responses:
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      // This is the wrapped license, which is a JSON string.
      var wrappedString = StringUtils.fromUTF8(response.data);
      // Parse the JSON string into an object.
      var wrapped = JSON.parse(wrappedString);

      // This is a base64-encoded version of the raw license.
      var rawLicenseBase64 = wrapped.rawLicenseBase64;
      // Decode that base64 string into a Uint8Array and replace the response
      // data.  The raw license will be fed to the Widevine CDM.
      response.data = Uint8ArrayUtils.fromBase64(rawLicenseBase64);

      // Read additional fields from the server.
      // The server we are using in this tutorial does not send anything useful.
      // In practice, you could send any license metadata the client might need.
      // Here we log what the server sent to the JavaScript console for
      // inspection.
      console.log(wrapped);
    }
  };

  player.getNetworkingEngine().registerResponseFilter(licenseRequestFilter);
  player.getNetworkingEngine().registerResponseFilter(licenseResponseFilter);


  player.configure({
    drm: {
      servers: {
        // Android/iOS は wvstreamidだが、HTML5は streamid .
        // PSSH はdash manifest に記載されている
        // またURL encode を行わないと、 php の POSTの際に pssh に + が入っていたら空白になってしまい問題になる。
        'com.widevine.alpha': 'https://tsg01.uliza.jp/ulizahtml5/dash_api/rights_issuer.php?streamid=bbb_2M_100sec&pssh=AAAAWHBzc2gAAAAA7e%2BLqXnWSs6jyCfc1R0h7QAAADgIARIQxXcyfkNpsb3dz3hYVXtRrxoMc2tpbGx1cHZpZGVvIg1iYmJfMk1fMTAwc2VjKgVTRF9IRA%3D%3D'
      },
      advanced: {
        'com.widevine.alpha': {
          'serverCertificate': base64ToUint8Array(widevineServiceCertificate),
          'videoRobustness': 'SW_SECURE_CRYPTO',
          'audioRobustness': 'SW_SECURE_CRYPTO'
        }
      }
    }
  });

  // https://shaka-player-demo.appspot.com/docs/api/tutorial-license-wrapping.html
  // 再生できないヒントはここにあるかも。

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
