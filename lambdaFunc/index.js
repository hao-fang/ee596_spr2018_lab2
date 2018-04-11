'use strict';

const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  //! Replace the appId with your Skill ID only if you
  //! want to validate that the request origated from your skill.
  alexa.appId = null;
  alexa.registerHandlers(handlers);
  alexa.execute();
};


// --------------- handlers ------------------

const handlers = {
  'NewSession': function () {
    // Called when the session starts
    console.log('NewSession requestId=' + this.event.request.requestId
      + ', sessionId=' + this.event.session['sessionId']);

    this.emit('LaunchRequest');
  },

  'LaunchRequest': function () {
    // Called when the user launches the skill without specifying what they want
    console.log('LaunchRequest requestId=' + this.event.request.requestId
      + ', sessionId=' + this.event.session['sessionId']);

    let cardTitle = 'Welcome';
    let speechOutput = 'Welcome to EE596 Lab 2.'
      + ' You can say anything and'
      + ' I\'ll tell you my language understanding results.';
    let repromptText = ' You can say <prosody rate="slow">stop</prosody> to exit the skill.';

    this.response.speak(speechOutput)
      .listen(repromptText)
      .cardRenderer(cardTitle, speechOutput);
    this.emit(':responseReady');
  },

  'SessionEndedRequest': function () {
    console.log('SessionEndedRequest requestId=' + this.event.request.requestId
      + ', sessionId=' + this.event.session['sessionId']);
    // add cleanup logic here

    let cardTitle = 'Goodbye';
    let speechOutput = 'It\'s been nice talking with you. Goodbye!';
    this.response.speak(speechOutput)
      .cardRenderer(cardTitle, speechOutput);
    this.emit(':responseReady');
  },

  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest');
  },

  'Unhandled': function () {
    //! Intents without an registered handler
    console.log('Unhandled requestId=' + this.event.request.requestId
      + ', sessionId=' + this.event.session['sessionId']);

    let intent = this.event.request.intent;
    let numSlots;
    let cardTitle;
    let speechOutput;
    let repromptText = 'You can say "exit" to end the conversation.';

    //! Default response.
    cardTitle = 'Sorry :(';
    speechOutput = 'Sorry, I didn\'t recognize any intent.';

    //! Replaces the default response.
    if (intent) {
      //! Adds intent information.
      cardTitle = 'Recognized Intent: ';
      speechOutput = 'The recognized intent is ';
      if (intent.name) {
        cardTitle += intent.name;
        speechOutput += intent.name;
      } else {
        cardTitle += ' null';
        speechOutput += ' null';
      }
      //! Adds a period.
      speechOutput += ' .';
      //! Adds slot information.
      if (intent.slots) {
        numSlots = Object.keys(intent.slots).length;
        speechOutput += ' There are ' + numSlots;
        if (numSlots == 1) {
          speechOutput += ' recognized slot.';
        } else {
          speechOutput += ' recognized slots.';
        }
        for (let slotName in intent.slots) {
          if (intent.slots.hasOwnProperty(slotName)) {
            speechOutput += ' The value of slot';
            speechOutput += ' <prosody rate="slow">' + slotName + '</prosody>';
            if (intent.slots[slotName]) {
              speechOutput += ' is <break strength="strong"/> ';
              speechOutput += intent.slots[slotName].value;
            } else {
              speechOutput += ' unrecognized.';
            }
            speechOutput += ' <break strength="strong"/>';
          }
        }
      }
    }

    //! Builds the response.
    this.response.speak(speechOutput)
      .listen(repromptText)
      .cardRenderer(cardTitle, speechOutput);
    this.emit(':responseReady');
  }

};
