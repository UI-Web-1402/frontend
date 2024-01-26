'use strict';

function show_order_trac(){

    let order_trac = document.getElementsByClassName('order-trac-detail')[0];
    let page = document.getElementsByClassName("all-page")[0];
    page.style.backgroundColor = "#00000029";
    order_trac.style.display = 'flex';
}


function close_order_trac(){

    let order_trac = document.getElementsByClassName('order-trac-detail')[0];
    let page = document.getElementsByClassName("all-page")[0];
    page.style.backgroundColor = "#FFFFFF";
    order_trac.style.display = 'none';
}


function show_previous_order_detail(){
    let previous_order_trac = document.getElementsByClassName('previous-order-detail')[0];
    let page = document.getElementsByClassName("all-page")[0];
    page.style.backgroundColor = "#00000029";
    previous_order_trac.style.display = 'flex';

}


function close_previous_order_detail(){
    let previous_order_trac = document.getElementsByClassName('previous-order-detail')[0];
    let page = document.getElementsByClassName("all-page")[0];
    page.style.backgroundColor = "#FFFFFF";
    previous_order_trac.style.display = 'none';
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