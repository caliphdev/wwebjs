'use strict';

import Base from './Base.js';

/**
 * Represents a Call on WhatsApp
 * @extends {Base}
 */
class Call extends Base {
    constructor(client, data) {
        super(client);

        if (data) this._patch(data);
    }

    _patch(data) {
        /**
         * Call ID
         * @type {string}
         */
        this.id = (data.__x_id || data.id);
        /**
         * From
         * @type {string}
         */
        this.from = (data.__x_peerJid?._serialized || data.peerJid);
        /**
         * Unix timestamp for when the call was created
         * @type {number}
         */
        this.timestamp = (data.__x_offerTime || data.offerTime);
        /**
         * Is video
         * @type {boolean}
         */
        this.isVideo = data.__x_isVideo || data.isVideo;
        /**
         * Is Group
         * @type {boolean}
         */
        this.isGroup = Boolean(data.__x_isGroup || data.isGroup);
        /**
         * Indicates if the call was sent by the current user
         * @type {boolean}
         */
        this.fromMe = Boolean(data.__x_outgoing || data.outgoing);
        /**
         * Indicates if the call can be handled in waweb
         * @type {boolean}
         */
        this.canHandleLocally = (data.__x_canHandleLocally || data.canHandleLocally);
        /**
         * Indicates if the call Should be handled in waweb
         * @type {boolean}
         */
        this.webClientShouldHandle = Boolean(data.webClientShouldHandle);
        /**
         * 
         * @type {string}
         */
        this.state = (data.__x__state || data._state);
        /**
         * Object with participants
         * @type {object}
         */
        this.participants = data.participants;

        return super._patch(data);
    }

    /**
     * Reject the call
    */
    async reject() {
        return this.client.pupPage.evaluate(({ peerJid, id }) => {
            return window.WWebJS.rejectCall(peerJid, id);
        }, { peerJid: this.from, id: this.id });
    }
}

export default Call;
