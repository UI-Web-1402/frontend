'use strict';

function show_favorite_restaurants(){
    let restaurant_part = document.getElementsByClassName("restaurants-favorite")[0];
    let dishes_part = document.getElementsByClassName("dishes-favorite")[0];

    let restaurant_btn = document.getElementById("restaurants-btn");
    let dishes_btn = document.getElementById("dishes-btn");

    restaurant_part.style.display = "grid";
    restaurant_btn.classList.add("status-selected");
    dishes_part.style.display = "none";
    dishes_btn.classList.remove("status-selected");
}

function show_favorite_dishes(){
    let restaurant_part = document.getElementsByClassName("restaurants-favorite")[0];
    let dishes_part = document.getElementsByClassName("dishes-favorite")[0];

    let restaurant_btn = document.getElementById("restaurants-btn");
    let dishes_btn = document.getElementById("dishes-btn");

    dishes_part.style.display = "grid";
    dishes_btn.classList.add("status-selected");
    restaurant_part.style.display = "none";
    restaurant_btn.classList.remove("status-selected");
}


function close_cart_part(){
    let cart_part = document.getElementsByClassName('cart-part')[0];
    cart_part.style.display = "none";
}

function show_cart_part(){
    let cart_part = document.getElementsByClassName('cart-part')[0];
    cart_part.style.display = "flex";
}

function close_confirm_part(){
    let cart_part = document.getElementsByClassName('confirm-address')[0];
    cart_part.style.display = "none";
}

function show_confirm_part(){
    let cart_part = document.getElementsByClassName('confirm-address')[0];
    cart_part.style.display = "flex";
}