function GetAccessToken() {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }
    return accessToken;
}


function GetRestaurantID() {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurant_id = urlParams.get('id');
    return restaurant_id;
}


function UpdateRestaurantInfo(restaurant_id) {
    const RestaurantDetailUrl = `http://127.0.0.1:8000/api/restaurants/detail/${restaurant_id}`;

    fetch(RestaurantDetailUrl, {
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
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

            var time = new Date('2000-01-01T' + data.open_time);
            var formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });



            document.querySelector('#restaurant-logo').src = `http://127.0.0.1:8000${data.logo}`;
            document.querySelector('#restaurant-header').src = `http://127.0.0.1:8000${data.profile_header}`;
            document.querySelector('#restaurant-name').innerText = data.name;
            if (parseFloat(data.delivery_price)) {
                document.querySelector('#delivery-price').innerText = `$${data.delivery_price} delivery`;
            }
            else {
                document.querySelector('#delivery-price').innerText = `Free delivery`;
            }

            data.options.forEach(item => {
                let new_option = `
                <div class="recommend buy-recomend">
                    <p>${item.name}</p>
                </div>
                `

                document.querySelector('.open-recommend').insertAdjacentHTML('beforebegin', new_option);
            });

            document.querySelector('#open-time').innerText = `Opens at ${formattedTime}`;
            document.querySelector('#restaurat-info').innerText = data.description;
            document.querySelector('#restaurant-score').innerHTML = `&nbsp;<span class="rest-score">${data.score}</span> (${data.ratings_count})`;
            document.querySelector('#restaurant-category').innerHTML = `&nbsp;${data.category.name}`;
            document.querySelector('#restaurant-address').innerHTML = `&nbsp;18,6 km 4,3 km (${data.address.street_name}, ${data.address.city}, ${data.address.state})`;


            data.food_categories.forEach(item => {
                let new_option = `<button type="button" class="filter-button" onclick="UpdateFoodList(this)">${item.name}</button>`

                document.querySelector('#all-categories').insertAdjacentHTML('afterend', new_option);
            });



        })
        .catch(error => console.error('Error fetching data:', error));
}



function addFoodToFavorties(id) {


    const FavoriteFoodAddUrl = `http://127.0.0.1:8000/api/restaurants/favorite/food/`;
    const request_data = {
        food_id: id
    }
    fetch(FavoriteFoodAddUrl, {
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(request_data)
    })
        .catch(error => console.error('Error fetching data:', error));
}


function createFoodItem(data) {
    let delivery_price = '';
    if (data.delivery_price == 0) {
        delivery_price = "Free";
    }
    else {
        delivery_price = `$${data.delivery_price}`;
    }

    let delivery_time = data.max_delivery_time - data.min_delivery_time;
    item = `
    
    <div class="food-snapshot">
        <div class="food-image">
        <img src="http://127.0.0.1:8000${data.image}" alt="food image" />
        </div>

        <div class="food-status">
        <a href="#" onclick="addFoodToCart(${data.id}); event.preventDefault();">${data.name}</a>

        <div class="recommend">
            <p>${delivery_price} delivery</p>
        </div>
        </div>

        <div class="food-info">
        <div>
            <img src="icons/star.svg" alt="restaurant score" />
            <p>&nbsp;${data.score} (${data.ratings_count})</p>
        </div>
        <div>
            <img src="icons/food-icon.svg" alt="food name" />
            <p>&nbsp;${data.category.name}</p>
        </div>
        <div>
            <img src="icons/delivery.svg" alt="price group" />
            <p>&nbsp;${delivery_time} min</p>
        </div>

        <div class="food-favorite-btn">
            <button type="button" onclick="addFoodToFavorties(${data.id});">
            <img
                src="icons/favorite-heart-button.png"
                alt="favorite food btn"
            />like
            </button>
        </div>
        </div>
    </div>
    `
    return item;
}


function UpdateFoodList(element) {
    const restaurant_id = GetRestaurantID();
    const category_name = element.innerText;
    const activeCategory = document.querySelector('.selected-filter').className = 'filter-button';
    element.className = "filter-button selected-filter"


    let food_snapshots = document.getElementsByClassName('food-snapshot');
    console.log(food_snapshots);
    let elementsArray = Array.from(food_snapshots);
    elementsArray.forEach(function (element) {
        element.parentNode.removeChild(element);
    });

    let foodListUrl = "";
    if (category_name == "All") {
        foodListUrl = `http://127.0.0.1:8000/api/restaurants/foods/list?sort_by_score=-1&restaurant_id=${restaurant_id}`;
    }
    else {
        foodListUrl = `http://127.0.0.1:8000/api/restaurants/foods/list?sort_by_score=-1&category_name=${category_name}&restaurant_id=${restaurant_id}`;
    }



    fetch(foodListUrl, {
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
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

            if (data && data.length > 0) {
                data.forEach(item => {
                    const htmlItem = createFoodItem(item);
                    document.querySelector('.rest-foods').insertAdjacentHTML('beforeend', htmlItem);
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));

}


function addRestaurantToFavoriteList() {
    fetch('http://127.0.0.1:8000/api/restaurants/favorite/',
        {
            headers: {
                'Authorization': `Bearer ${GetAccessToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ restaurant_id: GetRestaurantID() }),
            method: "POST"
        })
        .then(response => {
            if (response.status === 400) {
                RemoveRestaurantFromFavoriteList();
            } else {
                console.log('Response status:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function RemoveRestaurantFromFavoriteList() {
    fetch(`http://127.0.0.1:8000/api/restaurants/favorite/${GetRestaurantID()}`,
        {
            headers: {
                'Authorization': `Bearer ${GetAccessToken()}`,
                'Content-Type': 'application/json',
            },
            method: "DELETE"
        })
        .then(response => {
            console.log('Response from second endpoint:', response.status);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// ------------------------------------------------------------------

function getAcitveAddress(){
    fetch(`http://127.0.0.1:8000/api/user/account/address/active/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
        }
    })
        .then(response => {
            if (response.status === 400) {
                document.querySelector('#active-address').innerText = "Does not have active address";
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('#active-address').innerText = `${data.street_name} ${data.city}, ${data.state}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function changeActiveAddress(){
    fetch(`http://127.0.0.1:8000/api/user/account/address/active/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
        }
    })
        .then(response => {
            if (response.status === 400) {
                document.querySelector('#active-address').innerText = "Does not have active address";
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('#active-address').innerText = `${data.street_name} ${data.city}, ${data.state}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.addEventListener('DOMContentLoaded', function () {
    getAcitveAddress()
    const restaurant_id = GetRestaurantID();
    UpdateRestaurantInfo(restaurant_id);
    UpdateFoodList(document.querySelector('#all-categories'));
});