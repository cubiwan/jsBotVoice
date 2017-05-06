function VoiceCommand() {
	this.name;
	this.expressions = [];
	this.execute;
}

function Recognition(){
	this.keys = {};

	this.addTokens = function(tokens){
			this.keys =	Object.assign({},this.keys, tokens);
	}

	this.processToken = function(tk){
		var result = "";
		if(tk.indexOf("|") > -1){
			var tokens = tk.split("|");
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				result += this.processToken(token)+"|";
			}
			result = result .substring(0, result.length-1);
		} else {
			result = this.keys[tk];
			if(result == null){
				console.error("Token "+tk+" is undefined");
				result = "";
			}
		}
		return result;
	}

	this.generateExpression = function(text){
		var expression = "";

		if(text.charAt(0)=='*') { //when fisrt chars is * indicates that is a regular expresion
        expression = text.substr(1);
    }else{
			var tokens = text.split(" ");
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];

				if(token.charAt(token.length-1) == '?'){
					token = token.substring(0, token.length-1);
					expression += "("+this.processToken(token)+")?[ ]?";
					continue;
				}else if(token.charAt(token.length-1) == '*') {
					token = token.substring(0, token.length-1);
					expression += "("+this.processToken(token)+")*[ ]?";
					continue;
				}else{
					expression +=  "("+this.processToken(token)+")[ ]?";
				}
			}
		}
		console.log("Generating regexp: "+text+" -> "+expression);
		return new RegExp(expression);
	};
};


function Synthesis(){
	this.dictionaryMap = {};

	this.addDictionary = function(dictionary, topic){
		var dicArray = this.dictionaryMap[topic];
		if(dicArray == undefined){
			this.dictionaryMap[topic] = dictionary;
		} else {
			this.dictionaryMap[topic] =	Object.assign({},dicArray, dictionary);
		}
	}

	this.generateExpression = function(text, data, topics){
		topics = topics || this.topics;

		if(typeof topics == "string"){
			topics = [topics];
		}

    var result = "";
    if(text.charAt(0)=='*') {
        result = text.substr(1);
    } else {
        var tokens = text.split(" ");
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if(token.charAt(0)=='$') {
                result += " " + data[token.substr(1)];
            } else if(token.charAt(0)=='#'){
                result += " " + token.substr(1);
            } else {
								for(topic of topics){
									var dictionary = this.dictionaryMap[topic];
									if(dictionary != undefined){
										var words = dictionary[token];
										if(words != undefined){
	                		var index= Math.floor(Math.random()*words.length);
	                		result += " " + dictionary[token][index];
										} else {
											result += " " + token;
										}
									}
							 }
            }
        }
    }
		return result;
	}

}

function Voice(lang) {
	this.lang = (lang|| navigator.language || navigator.userLanguage).substring(0,2); //if lang is empty uses navigator.language
	this.synthesis = new Synthesis();
	this.recognition = new Recognition();
	this.voiceCommandsMap = {};
	this.topics = ["default"];
	this.data = {};
	this.depth = 0;
	this.maxDepth = 3;

	this.addVoiceCommand = function(vcmd, topic) {
		topic = topic||"default";
		for(var i = 0; i < vcmd.expressions.length; i++){
			vcmd.expressions[i] = this.recognition.generateExpression(vcmd.expressions[i]);
		}
		var vcArray = this.voiceCommandsMap[topic];
		if(vcArray == undefined){
			this.voiceCommandsMap[topic] = [];
		}
		this.voiceCommandsMap[topic].push(vcmd);
	}

	this.addDictionary = function(dictionary, topic){
		topic = topic||"default";
		this.synthesis.addDictionary(dictionary, topic);
	}

	this.addRecognitionTokens = function(tokens){
		this.recognition.addTokens(tokens);
	}

	//text - text to be analized
	//topics - topics to be selected (if null use this.topics)
	this.analyze = function(text, topics) {
		if(this.depth > this.maxDepth) return;

		this.depth++;

		topics = topics || this.topics;

		if(typeof topics == "string"){
			topics = [topics];
		}

		text = text.trim();
		text = text.toLowerCase();

		console.log("Analyzing text: "+text);
		console.log("Analyzing topics: "+topics);
		for(topic of topics){
			var voiceCommands = this.voiceCommandsMap[topic];
			for(voiceCommand of voiceCommands){
				var i = 0;
				for(expression of voiceCommand.expressions){
					console.log("Analyzing expression: "+expression);
					var m = text.match(expression);
					if(m != null){
						console.log("Command Coincidence: "+voiceCommand.name);
						for(var j = 0; j < m.length; j++){
							m[j] = m[j].trim();
						}
						voiceCommand.execute(i, m, this);
					 }
					 i++;
				}
			}
		}
		this.depth--;
		console.log("Analyzed");
	}

	this.resultRecognition = function(sentence, score) {
		console.log(sentence + ': ' + score);
		this.analyze(sentence);
	};

	this.talk;
	this.init;

};
