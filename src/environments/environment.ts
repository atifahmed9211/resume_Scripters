// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // baseUrl:"http://api.resumescripters.com/api",
  // mediaUrl:"http://api.resumescripters.com/public/",
  baseUrl:"http://127.0.0.1:8000/api",
  mediaUrl:"http://127.0.0.1:8000/public/",
  
  pusher: {
    key: 'eb822e2261f4f9a0b85d',
  },
  //for firebase connectivity
  config :{
    apiKey: 'AIzaSyBTbnaYDbMR_8ZKCP15C4j8qyXWJL3W1Kk',
    databaseURL: 'https://careerscriptchat-default-rtdb.firebaseio.com',
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
    admin_status:{
        "1": "In process",
        "2": "Questionaire Submitted",
        "3": "First Draft Sent",
        "4": "Approved",
        "5": "In Revision",
        "6": "Order completed",
    }
}
