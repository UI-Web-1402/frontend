
function GetChangePasswordToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    return token;
}



function changePassword() {
    const new_password = document.querySelector('#password-input').value.trim()
    const repeat_password = document.querySelector('#repeat-password-input').value.trim()

    if (!new_password) {
        alert("Invalid Password")
    }

    if (new_password != repeat_password) {
        alert("Passwords are not match.")
    }

    const requestBody = {
        token: GetChangePasswordToken(),
        new_password: new_password
    }

    fetch('http://127.0.0.1:8000/api/user/account/change-password/',
        {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            method: "POST"
        })
        .then(response => {

            if (response.ok) {
                window.location.href = "http://127.0.0.1:5051/signin/";

            }
            else {
                alert("Can not change the password.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const createAccountButton = document.getElementById('change-password-button');
    createAccountButton.addEventListener('click', function (event) {
        event.preventDefault()
        changePassword()
    });
})