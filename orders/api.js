function createUpcomingOrderItem(id, code, restaurant, finish_time, total_finish_time) {
    let item =
        `
        <div class="order-box">
        <div class="restaurant-name">
        <h4>${restaurant}</h4>
        </div>

        <div class="food-status">
        <img src="icons/clock.svg" alt="clock icon" />
        <div class="food-time">
            <p>Estimated arrival</p>
            <h3>${finish_time} min</h3>
        </div>

        <div class="food-button">
            <form action="#">
            <input
                type="submit"
                value="Track"
                onclick="update_order_trac(${id});show_order_trac()"
            />
            </form>
        </div>

        <div class="progress-food">
            <progress value="${finish_time}" max="${total_finish_time}"></progress>
        </div>
        </div>
    </div>
    `
    return item;
}

function createReadyItemHTML(string_date, item_title) {
    const date = new Date(string_date);
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    content =
        `
        <div class="delivery-step">
        <img src="icons/delivered-step-tic.svg" alt="#" />

        <div class="status">
        <h4 class="delivered-subject">${item_title}</h4>
        <p class="delivered-time">${formattedTime}</p>
        </div>
    </div>
    `
    return content;
}


function createNotReadyItemHTML(item_title) {

    content =
        `
    <div class="delivery-step">
    <img src="icons/delivered-icon.svg" alt="#" />

    <div class="status">
      <h4 class="delivered-subject">${item_title}</h4>
    </div>
  </div>
    `
    return content;
}

function createOrderTracHTML(data) {
    content =
        `
    <div class="upper-part">
    <button type="button" onclick="close_order_trac()">
      <img src="icons/close-btn.svg" alt="" />
    </button>
  </div>

  <div class="bottom-part">
    <div class="delivery">
      <div class="time-delivery">
        <div class="time-delivery-img">
          <img src="icons/clock-delivery.svg" alt="clock delivery icon" />
        </div>
        <div class="time-delivery-exp">
          <p>Estimated arrival</p>
          <h3>${data.finish_time} min</h3>
        </div>
      </div>

      <div class="distance-delivery">
        <div class="distance-delivery-img">
          <img
            src="icons/distance-delivery.svg"
            alt="clock delivery icon"
          />
        </div>
        <div class="distance-delivery-exp">
          <p>Estimated Distance</p>
          <h3>4 Km</h3>
        </div>
      </div>
    </div>
    <div class="delivery-steps-info">

      <div class="delivery-all-status">
    `
    if (data.food_ready_time) {
        content += createReadyItemHTML(data.food_ready_time, 'Food is ready')
    }
    else {
        content += createNotReadyItemHTML('Food is ready')
    }


    if (data.delivery_ready_time) {
        content += createReadyItemHTML(data.delivery_ready_time, 'On the way')
    }
    else {
        content += createNotReadyItemHTML('On the way')
    }

    content += `
    </div>
    </div>

    <div class="call-button">
        <button type="button">Call</button>
    </div>
    </div>
    `
    return content;
}

function update_order_trac(cart_id) {

    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }

    const RestaurantListUrl = `http://127.0.0.1:8000/api/restaurants/orders/detail/${cart_id}`;

    fetch(RestaurantListUrl, {
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
            document.querySelector('.order-trac-detail').innerHTML = createOrderTracHTML(data);
        })
        .catch(error => console.error('Error fetching data:', error));

}

// ========================================================================================================================

function createFoodParticleItem(data) {

    let item =
        `
    <div class="food-particle">
        <div class="number-of-foods"><p>${data.count}</p></div>
        <div class="food-title"><p>${data.food.name}</p></div>
    </div>
    
    `
    return item;

}

function createPreviousOrdersItem(data) {


    const date = new Date(data.finish_time);

    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    let item =
        `
        <div class="previous-order-box">
        <div class="food-title-status">
        <h3>${data.restaurant}</h3>`


    if (data.is_canceled) {
        item +=
            `
            <div class="food-status closed-status">
                <p>Canceled</p>
            </div>
            `
    }
    else {
        item +=
            `
        <div class="food-status completed-status">
            <p>Completed</p>
        </div>
        `
    }

    item += `
        </div>
        <div class="food-time">
        <div class="date">
            <img src="icons/calender.svg" alt="calender" />
            <p>${formattedDate}</p>
        </div>

        <div class="hour">
            <img src="icons/mini-clock.svg" alt="clock icon" />
            <p>${formattedTime}</p>
        </div>
        </div>

        <div class="food-particles">`



    data.foods.slice(0, 2).forEach(food => {
        const htmlItem = createFoodParticleItem(food);
        item += htmlItem;
    });


    item += `

        </div>

        <div class="buttons">
        <form action="#">
            <input
            type="submit"
            value="Details"
            class="details-btn"
            onclick="update_previous_order_detail(${data.id});show_previous_order_detail()"
            />
            <input type="submit" value="Get help" class="get-help-btn" />
        </form>
        </div>
    </div>
    
    `

    return item;
}


function createPreviousOrderDetailsOrderItemHTML(data) {
    const price = parseFloat(data.food.price);
    const count = data.count;
    const total = count * price;
    const rounded_value = total.toFixed(2);

    console.log(price)
    console.log(count)
    console.log(total)
    console.log(rounded_value)
    console.log(data)

    const item =
        `
    <div class="order-item">
    <div class="item-count"><p>${count}</p></div>
    <div class="item-info">
        <h5>${data.food.name}</h5>
        <p>${rounded_value}$</p>
    </div>
    </div>
    `
    return item;
}

function createPreviousOrderDetailsHTML(data) {

    let total_price = 0;

    data.foods.forEach(food => {
        total_price += parseFloat(food.food.price) * food.count;
    });

    total_price += parseFloat(data.restaurant.delivery_price);

    let final_price = 0;
    if (data.promo_code) {
        final_price = total_price - (total_price * (data.promo_code.discount_percentage / 100));
        final_price = final_price.toFixed(2);
    }
    else {
        final_price = total_price.toFixed(2)
    }

    total_price = total_price.toFixed(2);
    console.log(data)

    let item =
        `
    <div class="upper-part">
        <h3>Order details</h3>
        <button type="button" onclick="close_previous_order_detail()">
        <img src="icons/close-btn.svg" alt="close button" />
        </button>
    </div>

    <div class="delivered-location">
        <p>Delivered to</p>
        <h4>${data.delivery_address.street_name} ${data.delivery_address.city}, ${data.delivery_address.state}</h4>
    </div>

    <div class="order-part">
        <div class="order-name">${data.restaurant.name}</div>
    `


    data.foods.forEach(food => {
        const htmlItem = createPreviousOrderDetailsOrderItemHTML(food);
        item += htmlItem;
    });

    item += `

    </div>

    <div class="all-prices">
        <div class="price">
        <div class="subject">Subtotal</div>
        <div class="money">$${total_price}</div>
        </div>
        <div class="price">
        <div class="subject">Delivery fee</div>
        <div class="money">$${data.restaurant.delivery_price}</div>
        </div>
        <div class="price">
        <div class="subject">Total</div>
        <div class="money">$${final_price}</div>
        </div>
    </div>

    <form action="#">
        <input type="submit" value="Place New Order" />
    </form>
    `

    return item;
}



function update_previous_order_detail(cart_id) {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }

    const RestaurantListUrl = `http://127.0.0.1:8000/api/restaurants/orders/detail/${cart_id}`;

    fetch(RestaurantListUrl, {
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
            document.querySelector('.previous-order-detail').innerHTML = createPreviousOrderDetailsHTML(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
    }



    const InProgressOrders = 'http://127.0.0.1:8000/api/restaurants/orders/inprogress/';

    fetch(InProgressOrders, {
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
            if (data && data.length > 0) {
                data.forEach(item => {
                    const htmlItem = createUpcomingOrderItem(
                        item.id,
                        item.code,
                        item.restaurant,
                        item.finish_time,
                        item.total_finish_time,
                    );
                    document.querySelector('.orders-bar').innerHTML += htmlItem;
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));





    
    const CompletedOrders = 'http://127.0.0.1:8000/api/restaurants/orders/completed/';

    fetch(CompletedOrders, {
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
            if (data && data.length > 0) {
                data.forEach(item => {
                    const htmlItem = createPreviousOrdersItem(item);
                    document.querySelector('.previous-orders-list').innerHTML += htmlItem;
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}
);


