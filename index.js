window.onload = function () {

// создаем переменные для работы с ДОМ-деревом (анкетой)
var field_phone = document.getElementById("phone")
var field_fio = document.getElementById("fio")
var field_mail = document.getElementById("email")
var form = document.getElementById("myForm")
var button = document.getElementById('submitButton')

// чтобы страница при сабмите не перезагружалась, убираем дефолтную функкции
function handleForm(event) { 
	event.preventDefault(); 
} 
form.addEventListener('submit', handleForm);

//создаем прототип объекта для работы с формой
function myForm(fio, email, phone) { // при создании новой формы передаем значения полей
	this.fio = fio,
	this.email = email,
	this.phone = phone,
	this.error_fields = [], // массив, куда добавляются неправильно заполненные поля //
	this.isValid = false,
	this.fio_pattern = RegExp, // регулярное выражение для проверки заполнения формы//
	this.email_pattern = RegExp,
	this.phone_pattern = RegExp
};

// добавляем к прототипу объекта формы метод для валидации поля формы. ей передается регулярное выражение, и 
// при неуспешной  валидации добавляем в массив с ошибочными полями данное поле и 
// ставим ему класс еррор
myForm.prototype.testinput = function(re, field){
	console.log(re, field)
   if (!re.test(field.value)) {
	   console.log('field test failed')
	   this.error_fields.push(field);
	   field.classList.add("error");		
   } else {return true}
}
// добавляем к прототипу объекта формы метод для валидации телефона (сумма чисел < 30), она принимает поле
myForm.prototype.check_sum = function(field){
	if (this.testinput(this.phone_pattern, field_phone)) {
		var field_value = field.value;
		var i = 0;
		var sum = 0;
		while (i < field_value.length) { // перебираем все значения строки
			if (Number.isInteger(Number(field_value[i]))) { // значения строки превращаем в цифры и проверяем целое ли это число
					sum = sum + Number(field_value[i]) // складываем все целые числа
				} 	i++
				console.log(sum)
		} 	if (sum > 30) {
				this.error_fields.push(field);
			  alert("Sum of the phone's digits is more than 30. It is: " + sum);
			  return false
		} 	else {return true}
	} else {return false}
}
// добавляем к прототипу объекта формы метод для  общей валидации формы, исходя из результата валидации полей
myForm.prototype.validate = function()  {	
	this.testinput(this.fio_pattern, field_fio);
	this.testinput(this.email_pattern, field_mail);
	this.check_sum(field_phone);
	console.log(this.error_fields);	
	if (this.error_fields.length !== 0){ // проверяем, все ли поля заполнены правильно
		var error_fields_names = [] // создаем новый массив для передачи туда названий неправильно заполненных полей полей
		for (var i = 0; i < this.error_fields.length; i++) { // перебираем все неправильно заполненные поля
		error_fields_names.push(this.error_fields[i].getAttribute('name'));
		} 			
		alert('Поле заполнено неправильно:' + error_fields_names.join() +'!');
		this.isValid = false;
		return this.isValid, this.error_fields
	} else { 
		this.isValid = true;
		return this.isValid 
}}
 
 // добавляем к прототипу объекта формы метод,который собирает значения полей в объект и делает из него джейсон для передачи на сервер
 myForm.prototype.getData = function() {
	var formData = {
	fio: this.fio,
	email: this.email,
	phone: this.phone
	 } 
	newFormToJson = JSON.stringify(formData)
	return newFormToJson
 }

// добавляем к прототипу объекта формы метод,который принимает объект с данными како-то формы и вставлять ее в ДОМ
myForm.prototype.setData = function(someForm){
	field_fio.value = someForm["email"],
	field_mail.value = someForm["phone"],
	field_phone.value = someForm["email"]
}
var someForm = new myForm(0,0,0) // какая-то форма для теста

// добавляем к прототипу объекта формы метод, который делает аякс запрос на сервер
	myForm.prototype.submit = function(){
			this.validate();
			if(this.isValid) {
	        button.disabled = true; 
			console.log('validation successfull')	
			newFormToJson = this.getData(); // получаем джейсон с данными формы
			 ajaxGet('success.json', newFormToJson, function(data){		// сервер обращается к джейсону сексес и ему передаются данные формы	
				//response = JSON.parse(data);
				document.querySelector('#resultContainer').classList.add('success');
				document.querySelector('#resultContainer').innerHTML = data.status;	
				console.log(myForm)		
				form.style.display= 'none';		//прячем форму		
				console.log(this)	
			 });
			} else { 	// при неуспешной валидации обращение идет к джейсону еррор
			  console.log('error.json should open')
			  	  ajaxGet('error.json', 0, function(data){
			 	 //response = JSON.parse(data);			 
			 	document.querySelector('#resultContainer').classList.add('error');
			 	document.querySelector('#resultContainer').innerHTML = data.reason;				
			  });

			  //ajaxGet('progress.json', function(data){
			//	document.querySelector('#resultContainer').classList.add('progress');
			 //	setTimeout(function(){
			//		 ajaxGet(url)
			//	}, data.Number);
			//  });
	} }

	// при нажатии на кнопку создается новый объект формы, и у нее запускается функция сабмит
	button.onclick = function(){
		var newForm = new myForm(field_fio.value, field_mail.value, field_phone.value);
		newForm.fio_pattern = /\S+\s+\S+\s+\S+/;
		newForm.email_pattern = /.+@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)/;
		newForm.phone_pattern = /\+7\(\d{3}\)\d{3}[\-]\d{2}[\-]\d{2}/;
		console.log(newForm)
		console.log(myForm)
		newForm.submit();	
		}

// аякс запрос передает параметры формы и получает ответ из джейсона
function ajaxGet(url, params, callback){
	var f = callback || function(data){};
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
			f(request.response)
		}
	} 
	request.open('POST', url);
	request.setRequestHeader('Content-Type', 'application/json'); //x-www-form-urlencoded
	request.responseType = 'json';
	request.send(params);
	console.log(params)
}
}