document.getElementById('registerForm').addEventListener('submit',function(e){
    e.preventDefault();

    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent='';

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(username.length<6){
        return showError('Username must be at least 6 characters long.');
    }
    if(password.length<6){
        return showError('Password must be at least 6 characters long .');
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/;
    if(!passwordRegex.test(password)){
        return showError('A password must contain letters, numbers and a character that is neither a letter nor a number.')
    }

    if(password!==confirmPassword){
        return showError('Password Confirmation must be the same as the password');
    }
    if(firstName.length<2 || lastName.length<2){
        return showError('First name and Last name must be at least 2 characters long.');
    }
    
    const age = calculateAge(birthDate)
    if(age<18 || age>65){
        return showError('Age must be between 18 and 65.');
    }

    const newUser = {
        email:email,
        username: username,
        firstName : firstName,
        lastName : lastName,
        birthDate: birthDate,
        password: password
    };

    let users = JSON.parse(localStorage.getItem('shiftly_users')) || [];

    const userExist = users.some(u=>u.username===targetUsername);
    if(userExist){
        return showError('Username already exists.');
    }

    users.push(newUser);
    localStorage.setItem('shiftly_users',JSON.stringify(users));

    alert('Registration successful!');
    window.location.href='index.html';
});

document.getElementById('resetPasswordBtn').addEventListener('click', function(e){
    e.preventDefault();

    const targetUsername = prompt("Enter your username to reset your account and delete your data:")
    
    if(!targetUsername) return;

    let users = JSON.parse(localStorage.getItem('shiftly_users')) || [];

    const userExist = users.some(u=>u.username===targetUsername);
    if(!userExist){
        alert('User not found. Please check your username.');
        return;
    }

    const confirmReset = confirm(`Are you sure? Resetting your password will delete All data for the user "${targetUsername}".`);

    if(confirmReset){
        users = users.filter(u=>u.username!==targetUsername);
        localStorage.setItem('shiftly_users', JSON.stringify(users));

        const currentSession = JSON.parse(localStorage.getItem('shiftly_session'));
        if(currentSession&&currentSession.username===targetUsername){
            localStorage.removeItem('shiftly_session');
        }

        alert('All user data has been deleted. You can now register a new account with a new password.');
        
        const registerForm = document.getElementById('registerForm');
        const errorMessage = document.getElementById('errorMessage');

        if(registerForm) registerForm.reset();
        if(errorMessage) errorMessage.textContent='';
    }
});

function calculateAge(birthdayString){
    const birthday = new Date(birthdayString);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();

    if(m<0||(m===0&&today.getDate()<birthday.getDate())){
        age--;
    }

    return age;
}

function showError(message){
    document.getElementById('errorMessage').textContent = message;
}
