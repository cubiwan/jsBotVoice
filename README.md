# jsBotVoice
Library to help you to create voice bots in the browser

## Load

```html
<script src="js/voice/voice.js"></script>
<script src="js/voice/voiceBrowser.js"></script>
```

## Voice

First you need to create a Voice object. That object can receive as parameter the language. If you don't pass it uses the browser language.

```js
var voice = new Voice();//uses language from browser
var voice = new Voice("es");//spanish
var voice = new Voice("en");//english
```

You need initialize object

```js
voice.init();
```

## Voice Recognition

### VoiceCommand

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

### Expressions

"Expressions" are regular expressions. Agent compare any thing you say with all exoresions in a VoiceCommand if any match execute the function in the VoiceCommand field.

Expressions doesn't uses regular expressions directly, you need create tokens. Tokens are regular expressions that match with a part of text.

```js
var useful_tokens = {
	"bot#": "chispa|chispas",
	"word#": "[a-bA-B]*",
	"number#": "[0-9]*",
	"any#": ".*"
}
```
After you can use tokens to create a expression:

```js
vc1.expressions[0] = "bot# hello";

vc2.expressions[0] = "bot# sayhello any#?";

var exp = "bot# sing";
vc3.expressions[0] = exp+" bachata";
vc3.expressions[1] = exp+" salsa";
```

You can add modifiers to tokens:

* _*_: repeat token one or more times
* _?_: repeat token zero or one time
* _|_: token1|token2 means that one of tokens must be

Maybe you prefer create you own regular expresion, no problem you only need put _*_ as first character in expression.


## Speech Synthesis

To use speech text you must use _talk_ command

```js
voice.talk("hi person"); ```

But that is so simple.

First, you need create a dictionary of tokens with many options for token.
When you generates and expresion token will be remplace randomly by one of options.

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
_addDictionary_ have two params
* _dictionary_ : dictionay of tokens to words
* _topic_ : no obligatory, dictionary only will be used when generateExpression recive the same topic.


```js
this.generateExpression = function(text, dataMap, topics){
```
_text_: 
* _*_ - Any phrase start with _*_ is translate literaly
* _#text_ - Any word start with _#_ is translate literaly
* _$data_ - Remplace $data by dataMap[data]
dataMap

