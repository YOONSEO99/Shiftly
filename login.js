document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();

    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent='';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username.length<6||password.length<6){
        errorElement.textContent = 'Username and password are too short.';
        return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/;
    if(!passwordRegex.test(password)){
        errorElement.textContent='A password must contain letters, numbers and a character that is neither a letter nor a number.'
        return;
    }

    const users = JSON.parse(localStorage.getItem('shiftly_users')) || [];
    const matchedUser = users.find(u=>u.username===username&&u.password===password);

    if(!matchedUser){
        errorElement.textContent = 'Invalid username or password.';
        return;
    }

    const loginData = {
        username: username,
        password: password,
        expiry: new Date().getTime()+3600000
    };

    localStorage.setItem('shiftly_login_data',JSON.stringify(loginData));
    window.location.href='index.html';
});