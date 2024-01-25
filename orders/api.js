function createUpcomingOrderItem(id, code, restaurant, finish_time, total_finish_time) {
    item =
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
            console.log(createOrderTracHTML(data));
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

}
);


