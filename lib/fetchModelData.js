//  var Promise = require("Promise");


  /**
    * FetchModel - Fetch a model from the web server.
    *     url - string - The URL to issue the GET request.
    * Returns: a Promise that should be filled
    * with the response of the GET request parsed
    * as a JSON object and returned in the property
    * named "data" of an object.
    * If the requests has an error the promise should be
    * rejected with an object contain the properties:
    *    status:  The HTTP response status
    *    statusText:  The statusText from the xhr request
    *
  */

/** 
  function fetchModel(url) {
    return new Promise(function(resolve, reject) {
        function xhrHandler() {
            if (this.readyState !== 4) { // DONE
                return;
            }
            if (this.status !== 200) { // OK
                const error = {status: this.status, statusText: this.statusText};
                reject(new Error(error.toString()));
            }
            resolve({data: JSON.parse(this.responseText)});
        }
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = xhrHandler;
        xhr.open("GET", url);
        xhr.send();
    });
  }

  export default fetchModel;
*/