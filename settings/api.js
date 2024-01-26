function GetAccessToken() {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }
    return accessToken;
}


function getProfileData() {
    const accessToken = GetAccessToken()


    const profileDetailUrl = 'http://127.0.0.1:8000/api/user/account/detail/';

    fetch(profileDetailUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('#email-input').value = data.email;
            document.querySelector('#phone-input').value = data.phone_number;
            document.querySelector('#text-input').value = data.full_name;
            if (data.profile_photo) {
                document.querySelector('#profile-image').src = `http://127.0.0.1:8000${data.profile_photo}`
            }
            else {
                document.querySelector('#profile-image').src = `icons/user-default-image.svg`
            }

        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateAccount(event) {
    event.preventDefault();

    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }

    const phoneNumber = document.querySelector('#phone-input').value;
    const fullName = document.querySelector('#text-input').value;

    const userData = {
        full_name: fullName,
        phone_number: phoneNumber
    };

    fetch('http://127.0.0.1:8000/api/user/account/detail/', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (response.status === 200) {
                alert('Account updated successfully!');
            } else {
                alert('Account update failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error creating account:', error);
            alert('An error occurred. Please try again later.');
        });
}

document.addEventListener('DOMContentLoaded', function () {


    getProfileData()



    const UpdateAccountButton = document.getElementById('Update-profile-button');
    UpdateAccountButton.addEventListener('click', updateAccount);




    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }


    const uploadButton = document.getElementById('upload-btn');
    uploadButton.addEventListener('click', function () {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        fileInput.click();

        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];

            const formData = new FormData();

            formData.append('profile_photo', file);

            fetch('http://127.0.0.1:8000/api/user/account/detail/photo/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        console.log('File uploaded successfully.');
                        getProfileData();
                    } else {
                        console.error('Failed to upload file.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });






    const deleteButton = document.getElementById('delete-btn');
    deleteButton.addEventListener('click', function () {





        fetch('http://127.0.0.1:8000/api/user/account/detail/photo/', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                if (response.ok) {
                    console.log('File deleted successfully.');
                    getProfileData();
                } else {
                    console.error('Failed to delete file.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    });

}
);




// --------------------------------------------------------------------------------


function updateAddressesFromServer() {
    const accessToken = GetAccessToken()


    const profileDetailUrl = 'http://127.0.0.1:8000/api/user/account/address/';

    fetch(profileDetailUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            data.forEach(item => {
                if (item.type === 'home') {
                    document.querySelector('#home-address').value = `${item.street_name} // ${item.city} // ${item.state} // ${item.zip_code}`;
                    document.querySelector('#home-address').AId = item.id;
                }
                if (item.type === 'work') {
                    document.querySelector('#work-address').value = `${item.street_name} // ${item.city} // ${item.state} // ${item.zip_code}`;
                    document.querySelector('#work-address').AId = item.id;
                }

            });
        })
        .catch(error => console.error('Error fetching data:', error));
}


function parseAddressInputValues(value) {

    let splitText = value.split(" // ");

    if (splitText.length !== 4) {
        alert("The address should be in the format 'street // city // state // zipcode'. Please enter a valid address.");
        return false;
    } else {
        return {
            street_name: splitText[0],
            city: splitText[1],
            state: splitText[2],
            zip_code: splitText[3]
        }
    }


}


function sendUpdateOrCreateAddressRequest(data) {
    fetch('http://127.0.0.1:8000/api/user/account/address/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                console.error('Save new addresses failed.');
            }
            else{
                updateAddressesFromServer()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}



function removeAddress(address_id) {
    fetch(`http://127.0.0.1:8000/api/user/account/address/detail/${address_id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
        }
    })
        .then(response => {
            if (!response.ok) {
                console.error('Remove address failed.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function saveAddresses() {
    let home_address_input = document.querySelector('#home-address').value.trim();
    let work_address_input = document.querySelector('#work-address').value.trim();

    if (home_address_input) {
        let data = parseAddressInputValues(home_address_input);
        if (data) {
            data.type = 'home';
            sendUpdateOrCreateAddressRequest(data);
        }
    }
    else {
        let address_id = document.querySelector('#home-address').AId;
        if (address_id) {
            removeAddress(address_id);
        }
    }


    setTimeout(

        function () {
            if (work_address_input) {
                let data = parseAddressInputValues(work_address_input);
                if (data) {
                    data.type = 'work';
                    sendUpdateOrCreateAddressRequest(data);
                }
            }
            else {
                let address_id = document.querySelector('#work-address').AId;
                if (address_id) {
                    removeAddress(address_id);
                }
            }
            
        },
        300
    )
}
