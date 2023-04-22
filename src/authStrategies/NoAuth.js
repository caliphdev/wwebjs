'use strict';

import BaseAuthStrategy from './BaseAuthStrategy.js';
/**
 * No session restoring functionality
 * Will need to authenticate via QR code every time
*/
class NoAuth extends BaseAuthStrategy { }

export default NoAuth;