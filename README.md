# jsVoice
Library to help you to create voice agents in browser

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

You need initialize object to start to heard user. Probably browser ask user for permission to use microphone.

```js
voice.init();
```

## Speech Recognition

### VoiceComand

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

* _expressions_: if any expression match whit the recognized text the voice command will be execute

* _execute_: function to call. It recives three parameters

  * _exp_: number of expresion that matched
          
  * _m_: array of parts of text that match whit each token in expression. m[0] includes all text
          
  * _voice_:reference to voice object

Example:

```js
var vc1 = new VoiceCommand();
vc1.name="hi";
vc1.expressions[0] = "bot# hello";
vc1.execute = function(exp, m, voice) {
		voice.talk("hi person");
};

var vc4 = new VoiceCommand();
vc4.name="search";
vc4.expressions[0] = "bot# search any#";
vc4.execute = function(exp, m, voice) {
    //m[3] - any#
		openWeb("https://www.google.com/webhp?ie=UTF-8#safe=off&q="+m[3]+"&*");
	};

var vc5 = new VoiceCommand();
vc5.name = "my name";
vc5.expressions[0] = "bot# mynameis any#";
vc5.execute = function(exp, m, voice) {
		voice.data["name"] = m[3];//m[3] - any#
		voice.talk("hi "+"$name");
	};
```

You need adds VoiceCommands to voice object:

```js
voice.addVoiceCommand(vc1);
voice.addVoiceCommand(vc2);
voice.addVoiceCommand(vc3);
voice.addVoiceCommand(vc4);
voice.addVoiceCommand(vc5);
voice.addVoiceCommand(vc6);
```

### Expressions

"Expressions" are a string whit a regular expressions. Agent compare any thing you say whit all exoresions in a VoiceCommand if any match execute the function in the VoiceCommand field.

Expressions doesn't uses regular expressions directly, you need create tokens. Tokens are regular expressions that match whit a part of text.

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

Maybe you prefer create you own regular expresion, no problem you only need put _*_ as first character in expression.


## Speech Synthesis

