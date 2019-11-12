'use strict';
/**
 * index.js
 * package main entry point
 */
const request = require('request-promise-native'),
      parseString = require('xml2js').parseString,
      stripNS = require('xml2js').processors.stripPrefix;

 /**
  * The main class that will allow access to the RDG Knowledgbase Real Time Incident feeds and return the data in a JSON format
  * This is a 2 step porcess where you first eed to log in to opbtain a token and then use that token to access the RTF's.
  * To create an account for access register here:  https://opendata.nationalrail.co.uk/
  * For more information on the RTF's - https://wiki.openraildata.com/index.php/KnowledgeBase#RDG_Knowledgebase_APIs
  */
 class RDGKnowledgebaseAPI {

  /**
   * Create an instance of the service by passing in a valid username and password that has been set up 
   * You will need to register here for an account - https://opendata.nationalrail.co.uk/
   * @param {String} username a valid account username   
   * @param {*} password a valid account password
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.authURL = " https://opendata.nationalrail.co.uk/authenticate";
    this.apiURL = " https://opendata.nationalrail.co.uk/api/staticfeeds/4.0";
  }

  /**
   * This function will be available of logon was successful AND the time elpased since last logon was less that 1 hour
   * as the tokens issued currently only have 1 hour of validity then  you will need to re-login again
   * @param {NRDPMethod} method The API method to call
   */
  async callAPI(method) {
    const body = await request({
      simple: false,
      method: 'GET',
      url: `${this.apiURL}/${method}`,
      headers: {
          'X-Auth-Token' : this.result.token
      }
    });
    return await this._parseResult(body);
  }


  /**
   * This is the first step that MUST be carried out before accessing ANY of the RTF's
   * Logging in generates an access token that is used for all the oter calls - if successful then the token will be valid for 1 hour
   * @returns {Boolean} true or false to indicate if logon succeeds
   */
  async logon() {
    const body = await request({
      simple: false,
      method: 'POST',
      url: this.authURL,
      headers: {
          'content-type' : "application/x-www-form-urlencoded"
      },
      form: {
        username: this.username,
        password: this.password
      }
    });
    const result = JSON.parse(body);
    if(result.error != null) {
      this.result = null;
      this.error = result.error;
      return false;
    }
    this.error = null;
    this.result = result;
    return true;
  }


  // Private method to parse result to JSON
  _parseResult(body) {
    return new Promise((resolve, reject) => {
      parseString(body, {
        tagNameProcessors: [stripNS],
        explicitArray : false,
        ignoreAttrs : true
      }, function(err, result){
        if(!err){
          const data = result;
          resolve(data);
        } else {
          reject(err);
        }
      });        
    });
  }

 }

 module.exports = RDGKnowledgebaseAPI;