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
        this.id = data.__x_id;
        /**
         * From
         * @type {string}
         */
        this.from = data.__x_peerJid;
        /**
         * Unix timestamp for when the call was created
         * @type {number}
         */
        this.timestamp = data.__x_offerTime;
        /**
         * Is video
         * @type {boolean}
         */
        this.isVideo = data.__x_isVideo;
        /**
         * Is Group
         * @type {boolean}
         */
        this.isGroup = data.__x_isGroup;
        /**
         * Indicates if the call was sent by the current user
         * @type {boolean}
         */
        this.fromMe = data.__x_outgoing;
        /**
         * Indicates if the call can be handled in waweb
         * @type {boolean}
         */
        this.canHandleLocally = data.__x_canHandleLocally;
        /**
         * Indicates if the call Should be handled in waweb
         * @type {boolean}
         */
        this.webClientShouldHandle = data.__x_webClientShouldHandle;
        /**
         * 
         * @type {string}
         */
        this.state = data.__x__state;
        /**
         * Object with participants
         * @type {object}
         */
        this.participants = data.__x_participants;

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
