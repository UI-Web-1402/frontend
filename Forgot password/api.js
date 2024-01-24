document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
    
        var userEmail = document.getElementById('email-input').value;
    
        var data = {
          email: userEmail
        };
    
        fetch('http://127.0.0.1:8000/api/user/account/forget-password/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(responseData => {
            console.log(responseData);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
})