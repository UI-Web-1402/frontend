'use strict';


function close_personal_settings(){
    let p_settings = document.getElementsByClassName('personal-edit')[0];
    p_settings.style.display = 'none';
}


function show_personal_settings(){
    let p_settings = document.getElementsByClassName('personal-edit')[0];
    p_settings.style.display = 'flex';
}

function close_saved_address_settings(){
    let saved_address_settings = document.getElementsByClassName('saved-address-edit')[0];
    saved_address_settings.style.display = 'none';
}

function show_saved_address_settings(){
    let saved_address_settings = document.getElementsByClassName('saved-address-edit')[0];
    saved_address_settings.style.display = 'flex';
}