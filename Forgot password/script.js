'use strict';

function show_resend_email(){
    let page = document.getElementsByClassName('all-forget-password')[0];
    let resend_form = document.getElementsByClassName('resend-form')[0];

    page.style.backgroundColor = "#00000029";
    resend_form.style.display = "inline";
}

function close_resend_email(){
    let page = document.getElementsByClassName('all-forget-password')[0];
    let resend_form = document.getElementsByClassName('resend-form')[0];

    page.style.backgroundColor = "#fff";
    resend_form.style.display = "none";
}
