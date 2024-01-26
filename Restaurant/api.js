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


function removeFoodFromCart(food_id) {


    const CartDetailUrl = `http://127.0.0.1:8000/api/restaurants/cart/`;

    const requestBody = [
        {
          food: food_id,
          count: 0
        }
      ]

    fetch(CartDetailUrl, {
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
            'Content-Type': 'application/json',
        },
        method: "PUT",
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.status !== 200) {
                alert("Invalid food for current cart.")
            }
            else {
                updateCartInfo();
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}



function createOrderItem(data) {

    const price = parseFloat(data.food.price);
    const count = data.count;
    const total = count * price;
    const rounded_value = total.toFixed(2);

    let item = `
    
    <div class="order-item">
        <div class="item-count"><p>${count}</p></div>
        <div class="item-info">
        <h5>${data.food.name}</h5>
        <p>${rounded_value}$</p>
        </div>

        <div class="delete-btn">
        <button onclick="removeFoodFromCart(${data.food.id})">
            <img src="icons/delete-order-btn.svg" alt="delete button" />
        </button>
        </div>
    </div>
    
    `
    return item;
}


function updateCartInfo() {


    let order_items = document.getElementsByClassName('order-item');
    let elementsArray = Array.from(order_items);
    elementsArray.forEach(function (element) {
        element.parentNode.removeChild(element);
    });

    const CartDetailUrl = `http://127.0.0.1:8000/api/restaurants/cart/`;

    fetch(CartDetailUrl, {
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
            if (data.delivery_address) {
                document.querySelector('#delivery-address').innerText = `${data.delivery_address.street_name} ${data.delivery_address.city}, ${data.delivery_address.state}`

                document.querySelector('#cart-address-street').innerText = data.delivery_address.street_name
                document.querySelector('#cart-address-city').innerText = data.delivery_address.city
                document.querySelector('#cart-address-state').innerText = data.delivery_address.state
                document.querySelector('#cart-address-zipcode').innerText = data.delivery_address.zip_code

            }
            else {
                document.querySelector('#delivery-address').innerText = ''
                document.querySelector('#cart-address-street').innerText = ''
                document.querySelector('#cart-address-city').innerText = ''
                document.querySelector('#cart-address-state').innerText = ''
                document.querySelector('#cart-address-zipcode').innerText = ''
            }

            if (data.restaurant) {
                document.querySelector('#cart-restaurant-name').innerText = data.restaurant.name



                let total_price = 0;

                data.foods.forEach(food => {
                    total_price += parseFloat(food.food.price) * food.count;
                });

                let total_price_with_delivery = total_price + parseFloat(data.restaurant.delivery_price);

                let final_price = 0;
                if (data.promo_code) {
                    final_price = total_price_with_delivery - (total_price_with_delivery * (data.promo_code.discount_percentage / 100));
                    final_price = final_price.toFixed(2);
                }
                else {
                    final_price = total_price_with_delivery.toFixed(2)
                }

                total_price = total_price.toFixed(2);



                document.querySelector('#cart-food-price').innerText = `$${total_price}`
                document.querySelector('#cart-delivery-price').innerText = `$${data.restaurant.delivery_price}`
                document.querySelector('#cart-total-price').innerText = `$${final_price}`

            }
            else {
                document.querySelector('#cart-restaurant-name').innerText = ''
            }

            data.foods.forEach(item => {
                let new_item = createOrderItem(item);

                document.querySelector('.order-part').insertAdjacentHTML('beforeend', new_item);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

}



function cartCheckout() {
    const CartDetailUrl = `http://127.0.0.1:8000/api/restaurants/cart/pay/`;

    fetch(CartDetailUrl, {
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
            'Content-Type': 'application/json',
        },
        method: "POST"
    })
        .then(response => {
            if (response.status !== 200) {
                alert("Please select an address or add a food to your cart.")
            }
            else {
                updateCartInfo();
            }
        })
        .catch(error => console.error('Error fetching data:', error));

}



function addFoodToCart(food_id) {
    const CartDetailUrl = `http://127.0.0.1:8000/api/restaurants/cart/add/${food_id}/`;



    fetch(CartDetailUrl, {
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
            'Content-Type': 'application/json',
        },
        method: "POST"
    })
        .then(response => {
            if (response.status !== 200) {
                alert("Invalid food for current cart.")
            }
            else {
                updateCartInfo();
            }
        })
        .catch(error => console.error('Error fetching data:', error));

}





document.addEventListener('DOMContentLoaded', function () {
    const restaurant_id = GetRestaurantID();
    UpdateRestaurantInfo(restaurant_id);
    UpdateFoodList(document.querySelector('#all-categories'));
});