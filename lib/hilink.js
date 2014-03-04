var http = require('http');
var builder = require('xmlbuilder');
var dateFormat = require('dateformat');
var parseString = require('xml2js').parseString;

var hilink = function(){
    var self = this;

    /**
     * Default Port
     * @type {number}
     */
    self.port = 80;

    /**
     * Default IP
     * @type {string}
     */
    self.ip = '192.168.1.1';

    /**
     * Default Path
     * @type {string}
     */
    self.path = '/api/sms/';

    /**
     * Set a IP
     * @param ip
     */
    self.setIp = function( ip ){
        self.ip = ip;
    }

    /**
     * Simple HTTP Request
     * @param path
     * @param xml
     * @param callback
     */
    self.request = function( path, xml, callback ){
        var postRequest = {
            host: self.ip,
            path: self.path + path,
            port: self.port,
            method: "POST",
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Cookie': "cookie",
                'Content-Type': 'text/xml',
                'Content-Length': Buffer.byteLength(xml)
            }
        };

        var buffer = "";

        var req = http.request( postRequest, function( res )    {
            var buffer = "";
            res.on( "data", function( data ) {
                buffer = buffer + data;
            });
            res.on( "end", function( data ) {
                parseString( buffer, function (err, result) {
                    callback( result );
                });
            });
        });

        req.write( xml );
        req.end();
    }

    /**
     * Send a SMS
     * @param number
     * @param text
     */
    self.send = function( number, text, callback ){
        var xml = builder.create({
            request: {

                Index: {
                    '#text': '1'
                },
                Phones: {
                    Phone: {
                        '#text': number
                    }
                },
                Sca: {
                    '#text': ''
                },
                Content: {
                    '#text': text
                },
                Length: {
                    '#text': text.length
                },
                Reserved: {
                    '#text': '1'
                },
                Date: {
                    '#text': dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            }
        }).end({ pretty: true});

        self.request( 'send-sms', xml, function( response ){
            callback( response );
        });

    }

    /**
     * List inbox or outbox messages
     * @param type {int} 1|2
     * @param callback
     */
    self.list = function(type, callback){
        var xml = builder.create({
            request: {

                PageIndex: {
                    '#text': '1'
                },
                ReadCount: {
                    '#text': '20'
                },
                BoxType: {
                    '#text': type
                },
                SortType: {
                    '#text': '2'
                },
                Ascending: {
                    '#text': '0'
                },
                UnreadPreferred: {
                    '#text': '0'
                }

            }
        }).end({ pretty: true});

        self.request( 'sms-list', xml, function( response ){
            callback( response );
        });
    }

    /**
     * List Inbox Messages
     * @param callback
     */
    self.listInbox = function(callback){
        self.list( 1,function( response ){
            callback(response);
        });
    }

    /**
     * List Outbox Messages
     * @param callback
     */
    self.listOutbox = function(callback){
        self.list( 2,function( response ){
            callback(response);
        });
    }

    /**
     * Delete a Message based on index
     * @param index
     * @param callback
     */
    self.delete = function( index, callback ){
        var xml = builder.create({
            request: {
                Index: {
                    '#text': index
                }

            }
        }).end({ pretty: true});

        self.request( 'delete-sms', xml, function( response ){
            callback( response );
        });
    }

    /**
     * Delete all messages ( inbox or outbox )
     * @param type {int} 1|2
     */
    self.deleteAll = function(type){
        self.list( type, function(results){
            if( results["response"]["Count"][0] > 0 ){
                results["response"]["Messages"][0]["Message"].forEach(function(message){
                    self.delete( message.Index[0], function( response ){
                        console.log( response );
                    });
                });
            }
            else{
                console.log( results["response"]["Count"][0] );
            }
        });
    }

    /**
     * Delete all Inbox Messages
     */
    self.clearInbox = function(){
        self.deleteAll( 1 );
    }

    /**
     * Delete all Outbox Messages
     */
    self.clearOutbox = function(){
        self.deleteAll( 2 );
    }

    /**
     * Send and Delete Message
     * Don't store message
     * @param number
     * @param text
     * @param callback
     */
    self.sendAndDelete = function(number, text, callback){
        self.send(number, text, function(sendResponse){
            if( sendResponse.response === 'OK' ){
                self.listOutbox( function( listResponse ){
                    self.delete( listResponse["response"]["Messages"][0]["Message"][0].Index[0], function( deleteResponse ){
                        callback( sendResponse, deleteResponse );
                    });
                });
            }
            else{
                console.log(sendResponse);
            }
        });
    }

}

module.exports =  new hilink();