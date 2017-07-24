/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('shaka.polyfill.InputEvent');

goog.require('shaka.log');
goog.require('shaka.polyfill.register');


/**
 * @namespace shaka.polyfill.InputEvent
 *
 * @summary A polyfill to patch 'input' event support in IE11.
 */


/**
 * Install the polyfill if needed.
 */
shaka.polyfill.InputEvent.install = function() {
  shaka.log.debug('InputEvent.install');

  // IE11 doesn't treat the 'input' event correctly.
  // https://connect.microsoft.com/IE/Feedback/Details/856998
  // If you know a better way than a userAgent check to detect this, please
  // send a patch.

  // This matches IE11, but not Edge.  Edge does not have this problem.
  if (navigator.userAgent.indexOf('Trident/') < 0) {
    // Not IE, so don't patch anything.
    return;
  }

  if (HTMLInputElement.prototype.addEventListener ==
      shaka.polyfill.InputEvent.addEventListener_) {
    // The polyfill was already installed.
    return;
  }

  shaka.log.info('Patching input event support on IE.');

  shaka.polyfill.InputEvent.originalAddEventListener_ =
      HTMLInputElement.prototype.addEventListener;

  HTMLInputElement.prototype['addEventListener'] =
      shaka.polyfill.InputEvent.addEventListener_;
};


/**
 * The original addEventListener from HTMLInputElement.
 * @private Function
 */
shaka.polyfill.InputEvent.originalAddEventListener_;


/**
 * Add an event listener to this object and translate the event types to those
 * that work on IE11.
 *
 * @param {string} type
 * @param {EventListener|function(!Event):(boolean|undefined)} listener
 * @param {(!AddEventListenerOptions|boolean)=} opt_options
 * @this {HTMLInputElement}
 * @private
 */
shaka.polyfill.InputEvent.addEventListener_ =
    function(type, listener, opt_options) {
  if (type == 'input') {
    // Based on the type of input element, translate the HTML5 'input' event to
    // one that IE11 will actually dispatch.

    switch (this.type) {
      // For range inputs, we use the 'change' event.
      case 'range':
        type = 'change';
        break;
    }
  }

  shaka.polyfill.InputEvent.originalAddEventListener_.call(
      this, type, listener, opt_options);
};


shaka.polyfill.register(shaka.polyfill.InputEvent.install);