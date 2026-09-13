document.addEventListener('DOMContentLoaded', function(){
    const sessionData = JSON.parse(localStorage.getItem('shiftly_session'));
    if(!sessionData){
        window.location.href = 'login.html';
        return;
    }  

    let users = JSON.parse(localStorage.getItem('shiftly_users')) || [];
    const currentUserIndex = users.findIndex(u=>u.username === sessionData.username);

    if(currentUserIndex === -1){
        alert('User data not found.');
        window.location.href='login.html';
        return;
    }

    const currentUser = users[currentUserIndex];

    document.getElementById('email').value = currentUser.email;
    document.getElementById('username').value = currentUser.username;
    document.getElementById('firstName').value = currentUser.firstName;
    document.getElementById('lastName').value = currentUser.lastName;
    document.getElementById('birthDate').value = currentUser.birthDate;
    document.getElementById('password').value = currentUser.password;
    document.getElementById('confirmPassword').value = currentUser.password;

    document.getElementById('editProfileForm').addEventListener('submit', function(e){
        e.preventDefault();

        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = '';

        const newEmail = document.getElementById('email').value.trim();
        const newUsername = document.getElementById('username').value.trim();
        const newFirstName = document.getElementById('firstName').value.trim();
        const newLastName = document.getElementById('lastName').value.trim();
        const newBirthDate = document.getElementById('birthDate').value;
        const newPassword = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if(newUsername.length<6) return showError('Username must be at least 6 characters long.');
        if(newPassword.length<6) return showError('Password must be at least 6 characters long.');

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/;
        if(!passwordRegex.test(newPassword)){
            return showError('A password must contain letters, numbers and a special character.');
        }

        if(newPassword!==confirmPassword){
            return showError('Password Confirmation must be the same as the password.')
        }

        if(newFirstName.length<2 || newLastName.length<2){
            return showError('First name and Last name must be at least 2 characters long.');
        }

        const age = calculateAge(newBirthDate);
        if (age < 18 || age > 65) return showError('Age must be between 18 and 65.');

        if(newUsername !== currentUser.username){
            const userExists = users.some(u=>u.username === newUsername);
            if(userExists){
                return showError('Username already exists. Choose another one.');
            }

            let shifts = JSON.parse(localStorage.getItem('shiftly_shifts')) || [];
            shifts = shifts.map(shift=>{
                if(shift.username === currentUser.username) shift.username = newUsername;
                return shift;
            });
            localStorage.setItem('shiftly_shifts', JSON.stringify(shifts));
        }

        users[currentUserIndex] = {
            email: newEmail,
            username: newUsername,
            firstName: newFirstName,
            lastName: newLastName,
            birthDate: newBirthDate,
            password: newPassword
        };
        localStorage.setItem('shiftly_users', JSON.stringify(users));

        sessionData.username = newUsername;
        sessionData.firstName = newFirstName;
        localStorage.setItem('shiftly_session',JSON.stringify(sessionData));

        alert('Profile updated successfully!');
        window.location.href='index.html';
    });
});

function calculateAge(birthdayString) {
    const birthday = new Date(birthdayString);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
}