const chatbot = require("../chatbot/chatbot");
module.exports = (app) => {
  app.post("/text_query", async (req, res) => {
    console.log(req);
    const { text, userId } = req.body;
    const uery = await chatbot.textQuery(text, userId);
    console.log(uery);
    const resObj = {
      intentName: uery.intent.displayName,
      userQuery: uery.queryText,
      fulfillmentText: uery.fulfillmentText,
    };

    res.send(resObj);
  });

  // app.post('/event_query', (req, res)=>{
  //     console.log(req)
  //     res.send("Event Query")
  // })
};
