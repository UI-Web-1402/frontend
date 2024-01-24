
function CreateRestaurantItem(id,name, score, rating_counts, category, image_src){
    item = `          
    <div class="restaurant-snapshot">
    <div class="rest-img">
      <img src="http://127.0.0.1:8000${image_src}" alt="${name} restaurant" />
    </div>
    <div class="rest-name"><a href="#">${name}</a></div>
    <div class="rest-info">
      <img src="icons/star.svg" alt="restaurant score" />
      <p>&nbsp;${score} (${rating_counts})</p>

      <p>&nbsp;&nbsp;&nbsp;</p>

      <img src="icons/food-icon.svg" alt="food name" />
      <p>&nbsp;${category}</p>

      <p>&nbsp;&nbsp;&nbsp;</p>

      <img src="icons/money.svg" alt="price group" />
      <p>&nbsp;$</p>
    </div>
    <div class="rest-status">
      <img src="icons/second-location.svg" alt="restaurant distance" />
      <p>&nbsp;18,6 km</p>
    </div>
  </div>
  `
  return item;
}




function CreateFoodItem(id,name, delivery_pirce, image_src){
    if (delivery_pirce == 0){
        delivery_pirce = "Free";
    }
    else{
        delivery_pirce = `$${delivery_pirce}`;
    }

    item = `          
    <div class="food-snapshot">
    <div class="food-image">
      <img src="http://127.0.0.1:8000${image_src}" alt="${name} image" />
    </div>
    <div class="food-status">
      <a href="#">${name}</a>

      <div class="recommend">
        <p>${delivery_pirce} delivery</p>
      </div>
    </div>
  </div>
  `
  return item;
}



document.addEventListener('DOMContentLoaded', function () {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    console.error('Access token not found in local storage');
    return;
  }

  const RestaurantListUrl = 'http://127.0.0.1:8000/api/restaurants/list/?ord=-score&skip=0&limit=6';

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
      if (data && data.length > 0) {
        data.forEach(item => {
          const htmlItem = CreateRestaurantItem(
            item.id,
            item.name,
            item.score,
            item.ratings_count,
            item.category.name,
            item.logo
          );
          document.querySelector('.featured-restaurant').innerHTML += htmlItem;
        });
      }
    })
    .catch(error => console.error('Error fetching data:', error));




  const AsianListUrl = 'http://127.0.0.1:8000/api/restaurants/foods/list?sort_by_score=-1&category_name=Asian&skip=0&limit=3';

  fetch(AsianListUrl, {
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
          const htmlItem = CreateFoodItem(
            item.id,
            item.name,
            item.delivery_price,
            item.image
          );
          document.querySelector('.food-show').innerHTML += htmlItem;
        });
      }
    })
    .catch(error => console.error('Error fetching data:', error));


  }
  );