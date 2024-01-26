'use strict';

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

