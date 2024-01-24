document.addEventListener('DOMContentLoaded', function () {
    const createAccountButton = document.getElementById('create-account-button');
    createAccountButton.addEventListener('click', createAccount);
  
    function createAccount(event) {
      event.preventDefault();
  
      const fullName = document.getElementById('text-input').value;
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
  
      const userData = {
        full_name: fullName,
        email: email,
        password: password
      };
  
      fetch('http://127.0.0.1:8000/api/user/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then(response => {
          if (response.status === 201) {
            alert('Account created successfully! Please Check your email inbox.');
          } else {
            alert('Account creation failed. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error creating account:', error);
          alert('An error occurred. Please try again later.');
        });
    }
  });
  