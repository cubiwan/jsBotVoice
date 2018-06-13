<!-- TOC -->

<!-- TOC -->

- [Load](#load)
- [Create new object Voice](#create-new-object-voice)
- [Voice Recognition](#voice-recognition)
    - [VoiceCommand](#voicecommand)
    - [Expressions](#expressions)
- [Speech Synthesis](#speech-synthesis)  
    - [Dictionaries](#dictionaries)
- [Data](#data)
- [Topics](#topics)
- [voice.analyze](#voiceanalyze)
- [API Summary](#api-summary)
- [Example](#example)

<!-- /TOC -->

# Load

```html
<script src="js/voice/voice.js"></script>
<script src="js/voice/voiceBrowser.js"></script>
```

# Create new object Voice

First you need to create a Voice object. That object can receive as parameter the language. If you don't pass it uses the browser language.

```js
var voice = new Voice();//uses language from browser
var voice = new Voice("es");//spanish
var voice = new Voice("en");//english
```

# Voice Recognition

## VoiceCommand

For voice recognition you need use VoiceComand object.

```js
function VoiceCommand() {
	this.name; //string
	this.expressions; //array of string
	this.execute; //function
}
```

Each VoiceCommand includes three fields:

* _name_: name of expresion

* _expressions_: if any expression match with the recognized text the voice command will be execute

* _execute_: function to call. It recives three parameters

  * _exp_: number of expresion that matched

  * _m_: array of parts of text that match with each token in expression. m[0] includes all text

  * _voice_:reference to voice object

Example:

```js
var vc1 = new VoiceCommand();
vc1.name="hi";
vc1.expressions[0] = "bot# hello";
vc1.execute = function(exp, m, voice) {
	voice.talk("hi person");
};
```

After create voice command you need add this with _addVoiceCommand_

```js
voice.addVoiceCommand(vcmd, topic);
```

_vcmd_: VoiceCommand to be added   
_topic_: No obligatory. Conversation topic, voiceCommand will be used only with this topic. Default value is _"default"_

```js
voice.addVoiceCommand(vc1);
```

## Expressions

"Expressions" are regular expressions. Agent compare any thing you say with all exoresions in a VoiceCommand if any match execute the function in the VoiceCommand field.

Expressions doesn't uses regular expressions directly, you need create tokens. Tokens are regular expressions that match with a part of text.

```js
var useful_tokens = {
	"bot#": "chispa|chispas",
	"word#": "[a-bA-B]*",
	"number#": "[0-9]*",
	"any#": ".*"
}


var english_tokens = {
	"hello": "hi|hello",
	"sayhelloto": "say hello to",
	"sayhello": "say hello",
	"sing": "sing",
	"salsa": "salsa|salsita",
	"bachata": "bachata",
	"mynameis": "my name is|i am",
	"search": "search",
	"repeat": "say|repeat"
}
```
After you can use tokens to create a expression:

```js
var vc1 = new VoiceCommand();
vc1.name="hi";
vc1.expressions[0] = "bot# hello";
vc1.execute = function(exp, m, voice) {
	voice.talk("hi person");
};


var vc2 = new VoiceCommand();
vc2.name="say hello to";
vc2.expressions[0] = "bot# sayhelloto any#?";
vc2.expressions[1] = "bot# sayhello";
vc2.execute = function(exp, m, voice) {
	if(exp == 0 && m.length > 3)
		voice.talk("hi "+"#"+m[3]);//m[3] - any#
	else
		voice.talk("hi");
};
```

You can add modifiers to tokens:

* _*_: Repeat token one or more times
* _?_: Repeat token zero or one time
* _|_: Token1|token2 one of tokens must be in the expresion

Maybe you prefer create you own regular expresion, no problem, you only need put _*_ as first character in expression.

# Speech Synthesis

To use speech text you must use _talk_ command

```js
voice.talk(text, topics); 
```

_text_: 
* _*_: Any phrase start with _*_ is translate literaly
* _#text_: Any word start with _#_ is translate literaly
* _$name_: Remplace $data by voice.data[name]  

_topics_: No obligatory. Array of one or more topics. Default value is _voice.topics_ value.

```js
voice.talk("hi person"); 

voice.data["name"] = "Cubiwan";
voice.talk("hi $name"); //hello cubiwan

voice.talk("*hello my friend");
```

### Dictionaries

You need create a dictionary of tokens. you could use few options for token. When you generates an expresion token will be remplace randomly by one of options.

```js
var english_dictionary =  {
	"hi": ["hi", "hello"],
	"person": ["person","human"],
	"yes": ["yes","afirmative"],
	"no": ["no","negative"],
	"ok": ["ok", "right"]
};
```
Now you can add dictionaries to generate expresions

```js
voice.addDictionary(english_dictionary);
```
_addDictionary_: Have two params
* _dictionary_: Dictionay of tokens to words
* _topic_: No obligatory, dictionary only will be used when generateExpression recive the same topic. Default value is _"default"_


# Data

Is used to save datas to be used in Speech Synthesis with command _talk_ remplacing $data tokens.

```js
voice.data["name"] = "Cubiwan";
voice.talk("hi $name"); //hello cubiwan
```

# Topics

Array of topics use as default value of param _topics_ . By default value is _["default"]_

```js
voice.topics.push("sing");
```

# voice.analyze

If you don't need use voice recognition but you can use expresions to analyze texts you can use function analyze.

```js
voice.analyze(text, topics);
```

_text_: Text to analyze  
_topics_: No obligatory. Array of one or more topics. Default value is _voice.topics_ value.

# API Summary

* new Voice(lang);
* voice.init();
* voice.addVoiceCommand(vcmd, topic);
* voice.analyze(text, topics);
* voice.talk(text, topics); 
* voice.addDictionary(english_dictionary);
* voice.data = [];
* voice.topics = ["default"];

# Example
[Demo](https://cubiwan.github.io/jsBotVoice/voice.html)
