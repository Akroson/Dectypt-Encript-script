(function() {
		//----DOM ELEENT----//
	var cipherBtn = document.querySelector('.fields__cipher-button'),
		inputArea = document.getElementById('fields-input'),
		outputArae = document.getElementById('fields-output'),
		firstKey = document.querySelector('.fields__first-key'),
		secondKey = document.querySelector('.fields__second-key'),
		connector = document.querySelector('.fields__connector-value');

	//----------------INREFACE----------------//

	document.onwheel = function(e) {
		if (e.target.tagName != 'TEXTAREA') return;
		var area = e.target;

		var delta = e.deltaY || e.detail || e.wheelDelta;

		if (delta < 0 && area.scrollTop == 0) {
			return false;
		}

		if (delta > 0 && area.scrollHeight - area.clientHeight - area.scrollTop <= 1) {
			return false;
		}
	};

	//------Open/Close outputArae------//
	var expandBtn = document.querySelector('.expand-button');

	function fixedButton() {
		var coordTop = outputArae.getBoundingClientRect().top;

		if (coordTop < 0) {
			expandBtn.classList.add('fixed');
		} else if (coordTop > 0) {
			expandBtn.classList.remove('fixed');
		}
	};

	outputArae.oninput = checkScroll

	function checkScroll() {

		if(outputArae.scrollHeight >= 200) {
			visibleButton();
		} else {
			hiddenButton();
		}
	};

	outputArae.onkeyup = function(e) {
		if(e.keyCode != 8) {
			return;
		} else if (this.clientHeight > 200 && !this.value.length) {
			openArea();
			hiddenButton();
		}
	};

	function visibleButton()  {
		expandBtn.style.display = 'inline-block';

		window.addEventListener('scroll', fixedButton);
		expandBtn.addEventListener('click', openArea)
	};

	function hiddenButton() {
		expandBtn.style.display = 'none';

		window.removeEventListener('scroll', fixedButton);
		expandBtn.removeEventListener('click', openArea);
	};

	function openArea() {
		if (outputArae.classList.contains('open-area') || !outputArae.value){
			outputArae.classList.remove('open-area');
			outputArae.style.height = 200 + 'px';
		} else {
			outputArae.classList.add('open-area');
			outputArae.style.height = outputArae.scrollHeight + 'px';
			outputArae.scrollIntoView(false);
		}
	};

	//------Validation Fields Value------//

	function getChar(event) {
		if (event.which == null) { 
			if (event.keyCode < 32) return null; 
			return String.fromCharCode(event.keyCode)
		}

		if (event.which != 0 && event.charCode != 0) { 
		if (event.which < 32) return null; 
			return String.fromCharCode(event.which); 
		}

		return null;
	};

	connector.onkeypress = function(e) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;

		var char = getChar(e);

		if(!isNaN(char)) return false;
		if (!char) return;

		this.value = char.toUpperCase();

		return false;
	};


	function checkKey(e) {
		var target = e.target;

		if(e.ctrlkey || e.shiftKey || e.altKey) return false;
		  
		var char = +getChar(e);
		  
		if(isNaN(char)) return false;

		if(target.value.length >= 14) return false;
	};

	firstKey.onkeypress = secondKey.onkeypress = checkKey;

	function addWidthInput(e) {
		var valueLength = this.value.length;

		this.style.width = 23 + (valueLength * 10) + 'px';
	};

	firstKey.addEventListener('keyup', addWidthInput);
	secondKey.addEventListener('keyup', addWidthInput);

	firstKey.addEventListener('keydown', addWidthInput);
	secondKey.addEventListener('keydown', addWidthInput);

	//----------COUNTER----------//

	var isDown = false;
	var iteration = 1;
	var timerId;

	var fieldsWrapper = document.querySelector('.fields__set-value');

	fieldsWrapper.onmousedown = function(e) {
		var target = e.target;
		var inputElem = target.parentNode.querySelector('input');	

		if(target.className == 'down') {
			inputElem.value--
			addWidthInput.call(inputElem);
			autoCounter(inputElem, doDecrease);
		};

		if(target.className == 'up') {
			inputElem.value++
			addWidthInput.call(inputElem);
			autoCounter(inputElem, doIncrease);
		};
	};

	fieldsWrapper.onmouseup = function() {
		isDown = false;
		iteration = 1;
		clearTimeout(timerId);
	};

	function autoCounter(obj, func) {
		isDown = true;
		timerId = setTimeout( function(){
			func.call(obj)
		}, 1000);
	};

	function doIncrease() {
		if(isDown) {
			var increement = getIncrement(iteration);
			/*var valueCount = function() {
				var result = +this.value + increement;	//<-----Limiter
				if( result > 999999 ) result = 999999;
				return result;
			};
			this.value = valueCount.call(this)*/

			this.value = +this.value + increement;
			iteration++

			addWidthInput.call(this);

			setTimeout(doIncrease.bind(this), 50);
		} else {
			clearTimeout(timerId);
		};	
	};

	function doDecrease() {
		if(isDown) {
			var increement = getIncrement(iteration);
	/*		var valueCount = function() {
				var result = +this.value - increement;	//<-----Limiter
				if( result < 1 ) result = 1;
				return result;
			};
			this.value = valueCount.call(this);*/

			this.value = +this.value - increement;
			iteration++

			addWidthInput.call(this);

			setTimeout(doDecrease.bind(this), 50);
		} else {
			clearTimeout(timerId);
		};
	};

	function getIncrement(iteration){
		var increement = 1;

		if(iteration >= 40){
			increement = 11;
		};

		if(iteration >= 70){
			increement = 111;
		};

		if(iteration >= 150){
			increement = 1111;
		};

		if(iteration >= 250){
			increement = 10111;
		};

		if(iteration >= 350){
			increement = 101111;
		};

		return increement;
	};

	//--------Do Encrypt/Decrypt--------//

	cipherBtn.onclick = function(e) {
		if(!checkFields()) return;

		var checkbox = document.getElementById('checkbox');

		if(checkbox.checked) {
			doDecrypt(inputArea.value)
		} else {
			doEncrypt(inputArea.value)
		}
	};

	function checkFields() {
		var confirmation = true;

		if(!inputArea.value){
			showError(inputArea, 'error-area')
			confirmation = false;
		}
		if(!firstKey.value || isNaN(firstKey.value) || firstKey.value.length >= 14){
			showError(firstKey, 'error-input')
			confirmation = false;
		}
		if(!secondKey.value || isNaN(secondKey.value) || secondKey.value.length >= 14){
			showError(secondKey, 'error-input')
			confirmation = false;
		}
		if(!connector.value || connector.value.length > 1){
			showError(connector, 'error-input')
			confirmation = false;
		}

		if(confirmation) return true;
		else return false;
	};

	function showError(obj, classError) {
		obj.classList.add(classError);

		setTimeout(function() {
				obj.classList.remove(classError)
		}, 2000);
	};

	//----------------ENCRUPTING----------------//

	function doEncrypt(value) {
		var arr = value.split(' ');

		for (var i = 0; i < arr.length; i++){
			arr[i] = cipherWords(arr[i]);
		};

		outputArae.value = arr.join('%');
		checkScroll();
	};

	function cipherWords(item) {
		return item.split('').map(function(i) {
			return arrCipher(i.charCodeAt(0))
		}).join(connector.value);
	};

	function arrCipher(numb) {
		var chipr = (numb ^ +firstKey.value) - +secondKey.value;
		return chipr.toString(36).split('').reverse().join('');
	};

	//----------------DECRYPTION----------------//

	function doDecrypt(value) {
		var arr = value.split('%')

		for(var i = 0; i < arr.length; i++){
			arr[i] = decryptWords(arr[i])
		}

		outputArae.value = arr.join(' ')
		checkScroll();
	};

	function decryptWords(item){
		return item.split(connector.value).map(function(i) {
			return arrDecrypt(i);
		}).join('');
	};

	function arrDecrypt(value) {
		var newVal = value.split('').reverse().join('');
		var numb = parseInt(newVal, 36) + +secondKey.value;
		return String.fromCharCode(+firstKey.value ^ numb);
	};
})()