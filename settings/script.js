'use strict';


function close_personal_settings(){
    let p_settings = document.getElementsByClassName('personal-edit')[0];
    p_settings.style.display = 'none';
}


function show_personal_settings(){
    let p_settings = document.getElementsByClassName('personal-edit')[0];
    p_settings.style.display = 'flex';
}