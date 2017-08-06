var xhr = new XMLHttpRequest();

var body = 'fio=' + encodeURIComponent(fio) +
  '&email=' + encodeURIComponent(email) +
  '&phone=' + encodeURIComponent(phone);

xhr.open("POST", '/submit', true)
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')


// xhr.send(body);