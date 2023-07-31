export const environment = {
  production: true,
  baseUrl:"https://resumescripters.com/apis/api",
  mediaUrl:"https://resumescripters.com/apis/public/",
  webUrl:"https://resumescripters.com",
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
};
