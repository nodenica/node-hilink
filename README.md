# HiLink

[![NPM](https://nodei.co/npm/hilink.png)](https://nodei.co/npm/hilink/)

![Imgur](http://i.imgur.com/LE7czSz.jpg)

## Compatible models
* [E303](http://goo.gl/J63aa6)

### Installation
	
	npm install hilink
	
### Include

	var hilink = require('hilink');
	
#### Set other IP address (default 192.168.1.1)

	hilink.setIp('192.168.1.x')

#### Send a SMS ( number, text, callback )

	hilink.send( '88888888', 'Hello world', function( response ){
		console.log( response );
	});
	
**Response:**

	{ response: 'OK' }
	
#### Send and Delete SMS ( number, text, callback )

This method don't store a message.

	hilink.sendAndDelete( '88888888', 'Hello world', function( sendResponse, deleteResponse ){
		console.log( sendResponse );
		console.log( deleteResponse );
	});
	
**Response:**

	{ response: 'OK' }
	{ response: 'OK' }

#### List Outbox messages (callback)

	hilink.listOutbox(function( response ){
 		console.log( JSON.stringify( response, null, 2 ) );
	});
	
**Response:**

    {
      "response": {
        "Count": [
          "1"
        ],
        "Messages": [
          {
            "Message": [
              {
                "Smstat": [
                  "3"
                ],
                "Index": [
                  "20000"
                ],
                "Phone": [
                  "88888888"
                ],
                "Content": [
                  "Hello world"
                ],
                "Date": [
                  "2014-04-03 05:03:26"
                ],
                "Sca": [
                  ""
                ],
                "SaveType": [
                  "3"
                ],
                "Priority": [
                  "4"
                ],
                "SmsType": [
                  "1"
                ]
              }
            ]
          }
        ]
      }
    }
    
#### List Inbox messages (callback)

	hilink.listInbox(function( response ){
 		console.log( JSON.stringify( response, null, 2 ) );
	});
	
**Response:**

    {
      "response": {
        "Count": [
          "1"
        ],
        "Messages": [
          {
            "Message": [
              {
                "Smstat": [
                  "0"
                ],
                "Index": [
                  "20001"
                ],
                "Phone": [
                  "+50588888888"
                ],
                "Content": [
                  "Hello McNally"
                ],
                "Date": [
                  "2014-03-03 17:49:16"
                ],
                "Sca": [
                  ""
                ],
                "SaveType": [
                  "4"
                ],
                "Priority": [
                  "0"
                ],
                "SmsType": [
                  "1"
                ]
              }
            ]
          }
        ]
      }
    }
    
#### Clear Inbox

	hilink.clearInbox();
	
#### Clear Outbox

	hilink.clearOutbox();