# whatsapp-web.js
A WhatsApp API client that connects through the WhatsApp Web browser app

It uses Puppeteer to run a real instance of Whatsapp Web to avoid getting blocked.

**NOTE:** I can't guarantee you will not be blocked by using this method, although it has worked for me. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.


# install
```bash
npm install github:DikaArdnt/whatsapp-web.js
```

Then import your code using:
```javascript
import { Client } from 'whatsapp-web.js'
```

# create client
```javascript
import { Client, LocalAuth } from 'whatsapp-web.js'

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'session',
        clientId: 'new session'
    }),
    puppeteer: {
        headless: false,
        args: ['--no-sandbox']
    },
    markOnlineAvailable: false,
    qrMaxRetries: 3
})

client.initialize()
```

# qrcode 
Installation

```bash
npm install qrcode-terminal
```

after install `qrcode-terminal` you can add your code like :
```javascript
import qrcode from 'qrcode-terminal'

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
})
```


# received new message
```javascript
// to hide messages from yourself
client.on('message', async(m) => {
    console.log(m)
})

// to display messages from yourself
client.on('message_create', async(m) => {
    console.log(m)
})
```

# function from client
```javascript
import { MessageMedia, Buttons, List } from 'whatsapp-web.js'

const chatId = '1234567890@c.us'

// send text message
client.sendMessage(chatId, 'Hello')

// send text message with mentions
client.sendMessage(chatId, 'Hello @1234567890', { mentions: ['1234567890@c.us'] })

// send text message with replying
client.sendMessage(chatId, 'Hello', { quoted: m })

// send media message from url
const media = await MessageMedia.fromUrl('https://example.jpg', { unsafeMime: true })
client.sendMessage(chatId, media)

// send media message from file path
const media = await MessageMedia.fromFilePath('./example.jpg')
client.sendMessage(chatId, media)

// send media message manual
const media = new MessageMedia('image/jpeg', '/9j/XXX, 'filename.jpeg', 1099) // (mimetype, base64, filename, filesize)
client.sendMessage(chatId, media)

// send button message
let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer')
client.sendMessage(chatId, button)

// send list message
let sections = [{ title: 'sectionTitle', rows: [{ title: 'ListItem1', description: 'desc' }, { title: 'ListItem2' }] }]
let list = new List('List body', 'btnText', sections, 'Title', 'footer')
client.sendMessage(chatId, list)

// search message
let options = {
    page: 1, // no give no problem
    limit: 100,
    chatId: '1234567890@c.us' // no give no problem
}
client.searchMessages('Apalah', options)

// get all chat
client.getChats()

// get information chat
client.getChatById('1234567890@c.us') // change to your chat id

// get group metadata
client.groupMetadata('1234567890@g.us') // change to your group id

// get all contact
client.getContacts()

// to check the number has been saved or not
client.saveContact('1234567890@c.us') // change to contact id

// get information contact
client.getContactById('1234567890@c.us') // change to your contact id

// get information group from invite info
client.getInviteInfo('XXX') // change your invite code

// accept invite from invite code
client.acceptInvite('XXX') // change your invite code

// accept invite from invite group v4
client.acceptGroupV4Invite('XXX') // change your invite code v4

// change your info (bio)
client.setStatus('Ikodane')

// change your display name
client.setDisplayName('Hisoka')

// get state, connection status
client.getState()

// archive chat
client.archiveChat('1234567890@c.us')

// unarchive chat
client.unarchiveChat('1234567890@c.us')

// pin chat
client.pinChat('1234567890@c.us')

// unpin chat
client.unpinChat('1234567890@c.us')

// mute chat, use seconds for duration
client.muteChat('1234567890@c.us', 86400)

// unmute chat
client.unmuteChat('1234567890@c.us')

// set ephemeral, temporary message
// use seconds for duration and set 0 for disable
client.setEphemeral('1234567890@c.us', 8600)

// mark message as unread
client.markChatUnread('1234567890@c.us')

// get profile picture as url
client.getProfilePicUrl('1234567890@c.us')

// view the same group from contact
client.getCommonGroups('1234567890@c.us')

// reset state, reset status connection
client.resetState()

// Check if a given ID is registered in whatsapp
client.isRegisteredUser('1234567890@c.us')

// Get the registered WhatsApp ID for a number. 
client.getNumberId('1234567890@c.us')

// Get the formatted number of a WhatsApp ID.
client.getFormattedNumber('1234567890@c.us')

// get country code from contact id
client.getCountryCode('621234567890@c.us')

// create a new group
client.createGroup('Hisoka', ['xxx@c.us', 'xxx@c.us'])

// get labels
client.getLabels()

// Get Label instance by ID
client.getLabelById('id label')

// Get all Labels assigned to a chat 
client.getChatLabels('1234567890@c.us')

// Get all Chats for a specific Label
client.getChatsByLabelId('label id')

// Gets all blocked contacts by host account
client.getBlockedContacts()

// Sets the current user's profile picture.
const media = new MessageMedia(mimetype, base64, '', filesize)
client.setProfilePicture(media)

// Deletes the current user's profile picture.
client.deleteProfilePicture()

// send call to contact id
const options = {
    isGroup: true // set true, if for a group
}
client.sendCall('1234567890@c.us', options)

// end call from chat id
client.endCall('1234567890@c.us')

// Receive call, when call from chat id
client.acceptCall('1234567890@c.us')

// get last seen chat id
client.getLastSeen('1234567890@c.us')

// archive all chat, group or private chat
/**
 * type, select 'chat' for private chat or select 'group' for group chat
 * status, true for archive and falsefor unarchive
*/
client.archiveAll('group', true)

// mute all chat, group or private chat
/**
 * type, select 'chat' for private chat or select 'group' for group chat
 * duration, seconds 
*/
client.archiveAll('group', 86400)

// get host client
client.getHost()

// set theme, dark or light
client.setTheme('dark') // default from whatsapp web is light

// get theme WhatsApp Web
client.getTheme()

// clear all message from chat id
client.clearMessage('1234567890@c.us')

// read status message
client.sendReadStatus('1234567890@c.us', 'false_status@broadcas_3A16xxx_1234567890@c.us')

// read message
client.sendSeen('1234567890@c.us')

// get WhatsApp Web Version
client.getWWebVersion()

// Logs out the client, closing the current session
client.logout()

// Closes the client
client.destroy()
```


* Take a look at [`example.js`](https://github.com/DikaArdnt/whatsapp-web.js/blob/master/example.js) for another example with more use cases.
* or use my script [`Hisoka-Morou`](https://github.com/DikaArdnt/Hisoka-Morou) which i personally use


# Thanks To
---------

 [![Pedro S. Lopez](https://github.com/pedroslopez.png?size=100)](https://github.com/pedroslopez) | [![Edgard Lorraine Messias](https://github.com/edgardmessias.png?size=100)](https://github.com/edgardmessias)
----|----
[Pedro S. Lopez](https://github.com/pedroslopez) | [Edgard Lorraine Messias](https://github.com/edgardmessias)
 Author whatsapp-web.js | Author wa-js
