'use strict';

import PrivateContact from '../structures/PrivateContact.js';
import BusinessContact from '../structures/BusinessContact.js';

class ContactFactory {
    static create(client, data) {
        if(data.isBusiness) {
            return new BusinessContact(client, data);
        }

        return new PrivateContact(client, data);
    }
}

export default ContactFactory;