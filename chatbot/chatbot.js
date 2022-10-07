const dialogflow = require('dialogflow');
const config = require('../config/devkey');

const projectId = config.googleProjectId;
const sessionId = config.dialogFlowSessionID;

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
}
const sessionClient = new dialogflow.SessionsClient({projectId, credentials});

const textQuery = async(userText, userId)=>{
    const sessionPath = sessionClient.sessionPath(projectId, sessionId+userId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userText,
                languageCode: config.dialogFlowSessionLanguageCode
            }
        }
    }

    try{
        const respone= await sessionClient.detectIntent(request)
        return respone[0].queryResult
    }catch(err){
        console.log(err)
        return err
    }
}

module.exports = {
    textQuery
}