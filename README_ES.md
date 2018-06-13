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

# Cargar

```html
<script src="js/voice/voice.js"></script>
<script src="js/voice/voiceBrowser.js"></script>
```

# Crear objeto Voice

El primer paso es crear el objeto Vocie. Como parámetro recibe el lenguaje que con el que va trabajar. Si no se le pasa este parámetro usara el de navegador.

```js
var voice = new Voice();//uses language from browser
var voice = new Voice("es");//spanish
var voice = new Voice("en");//english
```

# Reconocimiento del habla

## VoiceCommand

Para el reconocmiento del habla necesitar crear un objeto VoiceCommad

```js
function VoiceCommand() {
	this.name; //string
	this.expressions; //array of string
	this.execute; //function
}
```

Cada VoiceCommand tiene tres campos:

* _name_: nombre de la expresión

* _expressions_: Es un array de expresiones, si el texto coincide con alguna lanzará la función en el campo _execute_

* _execute_: función que se lanzará. Recibe tres parámetros:

  * _exp_: el indice de la expresión que ha coincidido

  * _m_: array con la coincidencia de texto de cada token de la expresión. m[0] incluye todo el texto

  * _voice_: referencia al al objeto Voice

Ejemplo:

```js
var vc1 = new VoiceCommand();
vc1.name="hi";
vc1.expressions[0] = "bot# hello";
vc1.execute = function(exp, m, voice) {
	voice.talk("hi person");
};
```

Tras crear un _VoiceCommand_ tienes que añadirlo con  _addVoiceCommand_

```js
voice.addVoiceCommand(vcmd, topic);
```

_vcmd_: VoiceCommand que se añadirá  
_topic_: No obligatorio. Tópico de la conversación. El VoiceCommand será usado solo cuando ese topico este activo. su valor por defecto es _"default"_

```js
voice.addVoiceCommand(vc1);
```

## Expressions

"Expressions" son expresiones regulares. El agnete con las expresiones en el objeto VoiceCommand, si coincide alguna ejecuta la función correspondiente.

No se usan expresiones regulares directamente, se crean token que permiten a base de frgamentos componer expresiones que coincidan con el texto

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
Los tokens se usan para componer la expresión:

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

_text_: Texto para analizar
_topics_: No es olbigatorio. Array de uno o mas tópicos. su valor por defecto es el de _voice.topics_.

# Resumen de la API 

* new Voice(lang);
* voice.init();
* voice.addVoiceCommand(vcmd, topic);
* voice.analyze(text, topics);
* voice.talk(text, topics); 
* voice.addDictionary(english_dictionary);
* voice.data = [];
* voice.topics = ["default"];

# Ejemplo
[Demo](https://cubiwan.github.io/jsBotVoice/voice.html)

