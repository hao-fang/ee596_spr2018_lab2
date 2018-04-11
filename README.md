# EE596 Lab 2 -- Intent Schema

Course Webpage: [EE596 -- Conversational Artificial Intelligence](https://hao-fang.github.io/ee596_spr2018/)


## Taks 1: Create a Lambda Function that tells you the Intent and Slots

In this task, we will re-use the same Alexa Skill you created in Lab 1 and
replace the AWS Lambda function.
This new Lambda function will tell you the recognized intent and slots in the request.

### Steps
* Clone the repository
  ```
  $ git clone https://github.com/hao-fang/ee596_spr2018_lab2.git
  ```
* Create a new Alexa Lambda function `ee596_spr2018_lab2` and upload the zip
	file to this Lambda function. (see Lab 1 -- Task 2 for steps).
  ```
  $ cd lambdaFunc
  $ zip -r ../lambdaFunc.zip *
  ```
	You may also use the script `upload_lambda_func.sh`.
* Change your Alexa Skill's Endpoint ARN to this new Lambda Function.
* Try to talk with your Alexa Skill. Here are a few sample utterances.
	```
	what's my favorite color
	my favorite color is red
	how are you
	help
	cancel
	stop
	```
* Study the `Unhandled` handler in `lambdaFunc/index.js`.
	* You can read [this document](https://developer.amazon.com/docs/custom-skills/handle-requests-sent-by-alexa.html) from Amazon.

## Task 2: Create an Interaction Model to obtain the recognized user utterances

In this task, we will create a custom slot to obtain the full recognized user
utterance.
The overall idea is to train a slot that learns to capture a variety of user utterances.
In this task, we use conversational data from the [Switchboard Dialog Act Corpus](http://compprag.christopherpotts.net/swda.html).
For your own project, you can improve the slot by adding "expected" user utterances to the slot value.

### Steps:
* Install nltk==2.0.5
	* You may get the following error if you directly use `pip install nltk==2.0.5`.
	```
	urllib2.HTTPError: HTTP Error 403: SSL is required
	```
	* Please download the package from [here](https://pypi.python.org/packages/source/d/nltk/nltk-2.0.5.tar.gz).
	Untar the package, and edit `distribute_setup.py`.
		* Change `http` to `https` in line 50 
		```
		DEFAULT_URL = "https://pypi.python.org/packages/source/d/distribute/"
		```
	* Install the package using pip. You may consider install your package in an
		isolated virtual environment ([virtualenv](https://virtualenv.pypa.io/en/stable/)).
		```
		$ source ee596/bin/activate
		$ pip install ./nltk-2.0.5
		```
* Download [swda.zip](http://compprag.christopherpotts.net/code-data/swda.zip) and unzip the file. 
* Run the script `./interactionModel/tools/build_interaction_model.py`
	```
	$ ./build_interaction_model.py --swda_basedir ${SWDA_BASEDIR} --model_json ${MODEL_JSON}
	```
* Create an new Alexa Skill, and upload the `MODEL_JSON` to your Alexa Skill.
* Set the Endpoint of your Alexa Skill to the AWS Lambda function you created in Task 1.
* Try to talk with your Alexa Skill. 
	* You should use your Echo Dot and try something to fool Alexa's speech recognition.
	* You can check the recognition result in your Alexa App.


## Task 3: (Optional) Design an interaction model for your project

In this task, you will design an interaction model for your project based on
what you learned from Task 1 and Task 2.
There are two major directions.
* Design intents and slots in Alexa Skill Kits.
* Create a custom slot to obtain the recognized user utterance and process user
	utterances in your AWS Lambda function.

For the second option, you may consider the following services for deploying
your spoken language understanding module.
* [Amazon Lex](https://aws.amazon.com/lex/) ([pricing](https://aws.amazon.com/lex/pricing/))
* [Dialogflow](https://dialogflow.com) ([pricing](https://dialogflow.com/pricing/))
* [Microsoft LUIS](https://www.luis.ai/home) ([pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/language-understanding-intelligent-services/))
* [Wit.ai](https://wit.ai) ([pricing](https://wit.ai/faq))

## Lab Checkoff
* Task 1:
  * Illustrate your sample dialog in Task 1 using the Alexa Simulator.
	* Explain the Lambda function. 
* Task 2:
	* Illustrate your sample dialog in Task 2 using an Echo dot and the Alexa App
		on your phone.
	* Can you fool Alexa's speech recognition system?
* Task 3 (Optional):
	* Explain your plan about interaction model for your project.
  * Deploy an initial interaction model.

## Lab Report
* Briefly explain the Lambda function in Task 1.
* Discuss the speech recognition error if you are able to find any.
* Briefly discuss the interaction model you plan to use for your project.
