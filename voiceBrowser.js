/*Voice.prototype.init = function(){
		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

		this.speechSynthesisUtterance = new SpeechSynthesisUtterance();
		this.speechSynthesisUtterance.lang = this.lang;

		this.speechRecognition = new SpeechRecognition();
		this.speechRecognition.continuous = true;
		this.speechRecognition.interimResults = false;
		this.speechRecognition.lang = this.lang;
		var that = this;

		this.speechRecognition.onresult = function(event){
			var resultIndex = event.results.length -1;
			var result = event.results[resultIndex];

			that.resultRecognition(result[0].transcript, result[0].confidence)
		};

		this.speechRecognition.onend = function(){
			that.speechRecognition.start();
		};

		this.speechRecognition.start();
	};*/

Voice.prototype.init = function(){
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

	this.speechSynthesisUtterance = new SpeechSynthesisUtterance();
	this.speechSynthesisUtterance.lang = this.lang;

	this.speechRecognition = new SpeechRecognition();
	this.speechRecognition.continuous = true;
	this.speechRecognition.interimResults = false;
	this.speechRecognition.lang = this.lang;
	var that = this;

	this.speechRecognition.onresult = function(event){
		var resultIndex = event.results.length -1;
		var result = event.results[resultIndex];

		that.resultRecognition(result[0].transcript, result[0].confidence)
	};

	this.speechRecognition.onend = function(){
		that.speechRecognition.start();
	};

	this.speechRecognition.start();
}

Voice.prototype.talk = function(text, topics){
		topics = topics || this.topics;
		text = this.synthesis.generateExpression(text, this.data, topics);

		this.speechSynthesisUtterance.text = text;
		speechSynthesis.speak(this.speechSynthesisUtterance);
		console.log("Talk: "+text);
	}

Voice.prototype.speechRecognition;
Voice.prototype.speechSynthesisUtterance;
