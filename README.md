# RDG Knowledgebase APIs (rdgkb-json)
This is a node module that will interface to RDG's Knowledgebase static data API's, see the link below for more details

 * [RDG Knowledgebase Wiki](https://wiki.openraildata.com/index.php/KnowledgeBase#On_Demand_Data_Feeds)


 It is designed to deliver the XML data returned by the API in JSON format.


A compressed PDF for the various feed specs is available [here](https://wiki.openraildata.com/images/7/7e/RSPS5050_KnowledgeBase_Data_Feeds_01-00.pdf.gz)

**NB: This is pre-release software**

 # Using the module
 The first step is to install the module into your node project
  - **npm install -s rdgkb-json**

Then to test just do the following
```
/**
 * Simple example code for accessing the RDG incidents API
 * NB: You will need a valid username and password
 */
const RDGKnowledgebaseAPI = require('./index');
const username = "abc@123.a"; // put a valid username here
const password = "invalidpassword" // put a valid password here


// Create the API
const api = new RDGKnowledgebaseAPI(username, password);

// validate the credentials used
api.logon().then(result => {
  if(!result) {
    console.log(api.error);
  } else {
    api.callAPI(api.methods.INCIDENTS).then(data => {
      console.log(data);
    });
  }
});

```

