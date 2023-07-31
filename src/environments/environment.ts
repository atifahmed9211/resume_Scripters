// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl:"https://resumescripters.com/apis/api",
  mediaUrl:"https://resumescripters.com/apis/public/",
  webUrl:"http://localhost:4200/",
  // baseUrl: "http://127.0.0.1:8000/api",
  // mediaUrl: "http://127.0.0.1:8000/public/",

  pusher: {
    key: 'eb822e2261f4f9a0b85d',
  },
  //for firebase connectivity
  config: {
    apiKey: "AIzaSyBTbnaYDbMR_8ZKCP15C4j8qyXWJL3W1Kk",
    authDomain: "careerscriptchat.firebaseapp.com",
    databaseURL: "https://careerscriptchat-default-rtdb.firebaseio.com",
    projectId: "careerscriptchat",
    storageBucket: "careerscriptchat.appspot.com",
    messagingSenderId: "630796181433",
    appId: "1:630796181433:web:4730750032d1f42d63a068",
    //measurementId: "config data from general tab",
    vapidKey: "BGUquutQgdWdbdUkaQMy4YlW5I2RheFldCGuJ76yrlJZm9Rn5IQRQN2gIO9wiHADUzRWgqUWyAw14pnwfrtaio0"
  },
  //order status
  user_status: {
    "1": "In process",           
    "2": "Order placed",     
    "3": "First Draft Received",  
    "4": "Approved",            
    "5": "In Revision",        
    "6": "Order completed",
  },
  admin_status: {
    "1": "In process",
    "2": "Questionaire Submitted",
    "3": "First Draft Sent",
    "4": "Approved",
    "5": "In Revision",
    "6": "Order completed",
  },
  //order percentage
  order_percentage:{
    "1":"10",
    "2":"30",
    "3":"50%",
    "4":"60%",
    "5":"80%",
    "6":"100%"
  }
}
