let authLogin = null;
let authToken = null;

async function doLogin(login, password) {
  const response = await fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseData = await response.json();
  return responseData;
}

async function doRegister(login, password) {
  const response = await fetch('/register', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseData = await response.json();
  return responseData;
}

$(function () {
  var socket = io();

  var messages = document.getElementById('messages');
  var form = document.getElementById('form');
  var input = document.getElementById('input');
  
  socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });


  $('#login-form').submit(function (event) {
    event.preventDefault();

    const login = $('#login-form input[name=login]').val();
    const password = $('#login-form input[name=password]').val();

    doLogin(login, password).then((response) => {
      if (response.success) {
        authLogin = response.login;
        authToken = response.token;
        $('#chat-form').removeClass('hide');
        $('#login-form').addClass('hide');
        socket.emit('login', {
          token: authToken,
        });
      } else {
        alert(response.message);
      }
    }).catch((error) => {
      alert(`Error: ${error.message}`);
    });
  });

  $('#chat-form').submit(function (event) {
    event.preventDefault();

    const message = $('#chat-form input[name=message]').val();
    socket.emit('chat message', message);
    $('#chat-form input[name=message]').val('');
  });
});
