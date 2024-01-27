function GetAccessToken() {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }
    return accessToken;
}

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

                document.querySelector('#street-name-input').value = data.delivery_address.street_name
                document.querySelector('#city-name-input').value = data.delivery_address.city
                document.querySelector('#state-name-input').value = data.delivery_address.state
                document.querySelector('#zip-code-input').value = data.delivery_address.zip_code

            }
            else {
                document.querySelector('#delivery-address').innerText = ''

                document.querySelector('#street-name-input').value = ''
                document.querySelector('#city-name-input').value = ''
                document.querySelector('#state-name-input').value = ''
                document.querySelector('#zip-code-input').value = ''
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
                    document.querySelector('#promo-code-input').value = data.promo_code.code;

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

    const street = document.querySelector('#street-name-input').value;
    const city = document.querySelector('#city-name-input').value;
    const state = document.querySelector('#state-name-input').value;
    const zipcode = document.querySelector('#zip-code-input').value;

    const requestBody = {
        street_name: street,
        city: city,
        state: state,
        zip_code: zipcode,
        type: "home"
    }

    const CartDetailUrl = `http://127.0.0.1:8000/api/restaurants/cart/pay/`;

    fetch(CartDetailUrl, {
        headers: {
            'Authorization': `Bearer ${GetAccessToken()}`,
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify(requestBody)
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


function ApplyPromoCode() {
    const promo_code = document.getElementById('promo-code-input').value;
    fetch(`http://127.0.0.1:8000/api/restaurants/cart/promo/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GetAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({promo_code: promo_code})
    })
      .then(response => {
        if (response.status === 400) {
          alert("Invalid promo code!")
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
