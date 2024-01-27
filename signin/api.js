document.addEventListener("DOMContentLoaded", function () {
    const signinButton = document.getElementById("signin-button");
    signinButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("email-input").value;
        const passwordInput = document.getElementById("password-input").value;

        const requestData = {
            email: emailInput,
            password: passwordInput,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                // Save access token to browser (you may use localStorage or sessionStorage)
                localStorage.setItem("access_token", responseData.access);

                // Redirect the user to Google after successful login
                // window.location.href = "https://www.google.com";
                window.location.href = "../main%20page/index.html";

            } else if (response.status === 403) {
                alert("Invalid email or password. Please try again.");
            } else if (response.status === 450) {
                const responseData = await response.json();
                const confirmResend = confirm("Do you want to resend activation?");
                if (confirmResend) {
                    // Send request to resend activation
                    const resendToken = responseData.resend_token;
                    const resendUrl = `http://127.0.0.1:8000/api/user/account/activate/resend/${resendToken}/`;
                    await fetch(resendUrl, {
                        method: "GET",
                    });
                } else {
                    // Reload the page
                    location.reload();
                }
            } else {
                // Handle other status codes or errors
                console.error("Unexpected status code:", response.status);
            }
        } catch (error) {
            console.error("Error during API request:", error);
        }
    });


    const newAccountButton = document.getElementById("create-account-button");
    newAccountButton.addEventListener('click', function(){
        let link = document.createElement('a');
        link.href = "../create account/index.html";
        link.target = '_blank'
        link.click();
    });
});
