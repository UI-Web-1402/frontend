

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

