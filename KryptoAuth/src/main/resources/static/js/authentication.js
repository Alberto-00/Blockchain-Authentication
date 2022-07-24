import {closePopupError, closePopupSuccess, openPopupError, openPopupSuccess, openPopupPrivateKey, closePopupPrivateKey} from './popup.js'
import {sendAddressToBackend} from './metamask.js'

window.timer = function(event){
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);

    document.getElementById('days-count').innerHTML = day + '';

    if (now.getHours() >= 0 && now.getHours() < 10)
        document.getElementById('hours-count').innerHTML = '0' + now.getHours();
    else
        document.getElementById('hours-count').innerHTML = now.getHours() + '';

    document.getElementById('minutes-count').innerHTML = now.getMinutes() + '';

    if (now.getSeconds() >= 0 && now.getSeconds() < 10)
        document.getElementById('seconds-count').innerHTML = '0' + now.getSeconds();
    else
        document.getElementById('seconds-count').innerHTML = now.getSeconds() + '';

    setTimeout('timer()', 1000);
}
timer()

$(document).ready(function (){

    ethereum.on('accountsChanged', function (accounts) {
        sendAddressToBackend();
        $('input[name="privateKey"]').val(undefined)
    })

    $.validator.addMethod("username_email", function (value){
        return /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,}[a-zA-Z0-9]$/.test(value) | /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    }, "Email or Username field wrong.");

    $.validator.addMethod("username_email_lenght", function (value){
        return /^.{3,}$/.test(value);
    }, "Email or Username must have at last 3 characters.");

    $.validator.addMethod("strong_password", function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=^ ì{}()£/+çò°àù§èé#@$!%€*?&:,;'._<>|-])[A-Za-z\d=^ ì{}()£/+çò°àù§èé#@$!%€*?&:,;'._<>|-]{8,}$/.test(value)
    }, "Password wrong.");

    $.validator.addMethod("checklenght", function (value) {
        return /^.{8,}$/.test(value)
    }, "Password must have at last 8 characters.");

    $.validator.addMethod("checklower", function (value){
        $('#repeat-pass').empty();
        return /^(?=.*[a-z])/.test(value);
    }, "Password must have at last one lower character.");

    $.validator.addMethod("checkupper", function (value){
        $('#repeat-pass').empty();
        return /^(?=.*[A-Z])/.test(value);
    }, "Password must have at last one upper character.");

    $.validator.addMethod("checkdigit", function (value){
        $('#repeat-pass').empty();
        return /^(?=.*[0-9])/.test(value);
    },"Password must have at last one digit.");

    $.validator.addMethod("checkspecial", function (value){
        $('#repeat-pass').empty();
        return /^(?=.*[={}()£/+çò°àù§èé#@$!%€*?&:,;'._<>|-])/.test(value);
    }, "Password must have at last one special character.");

    $.validator.addMethod("isEqual", function (value){
        $('#repeat-pass').empty();
        return $('input[name="password"]').val().localeCompare($('input[name="repeatPassword"]').val()) === 0
    }, "Repeat Password and Password are not equals.");

    $.validator.addMethod("lenght", function (value){
        const field = $('input[name="privateKey"]').val();
        return field.length > 63 && field.length < 65;
    }, "Private key is incorrect.");

    $("form[name='login-form']").validate({
        rules: {
            email: {
                required: true,
                email: false,
                username_email_lenght: true,
                username_email: true,
            },
            password: {
                required: true,
                strong_password: true,
            }
        },
        messages: {
            password: {
                required: "Password field is empty.",
            },
            email: {
                required: "Email or Username field is empty.",
            }
        },
        submitHandler: function(form) {
            if (sendAddressToBackend().localeCompare("ok") === 0){
                const $userAddress = $("input[name='userAddress']")

                if (typeof $userAddress.val() === "undefined" || $userAddress.val() === ''){
                    openPopupError()
                    $('div.error-p').children('p').eq(1)
                        .html("Nessun account rilevato. <br>Accedere a Metamask.");
                }

                const $password = $("input[name='password']")
                const $email = $("input[name='email']")
                $.ajax({
                    type: "POST",
                    url: "/kryptoauth/register",
                    data: {
                        email: $email.val(),
                        password: $password.val(),
                        repeatPassword: $password.val(),
                        userAddress: $userAddress.val(),
                    },
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        const $emailInput = $('#email-error')
                        const $passwordInput = $('#password-error')

                        if (data.msgError['email'] != null){
                            if ($emailInput.length)
                                $emailInput.remove()
                            $('input[name="email"]').after('<label id="email-error" class="error" for="email">' + data.msgError['email'] + '</label>')
                        }

                        if (data.msgError['password'] != null){
                            if ($passwordInput.length)
                                $passwordInput.remove()
                            $('input[name="password"]').after('<label id="password-error" class="error" for="password">' + data.msgError['password'] + '</label>')
                        }

                        if (data.msgError['userAddress'] != null){
                            openPopupError()
                            $('div.error-p').children('p').eq(1)
                                .html("Nessun account rilevato. <br>Accedere a Metamask.");
                        }
                    },
                    error: function (e) {
                        console.log(e)
                    }
                });
            }
            return false;
        }
    });

    $("form[name='register-form']").validate({
        rules: {
            email: {
                required: true,
                email: false,
                username_email_lenght: true,
                username_email: true,
            },
            password: {
                required: true,
                checklower: true,
                checkupper: true,
                checkdigit: true,
                checkspecial: true,
                checklenght: true,
            },
            repeatPassword: {
                required: true,
                checklower: true,
                checkupper: true,
                checkdigit: true,
                checkspecial: true,
                checklenght: true,
                isEqual: true,
            },
            privateKey: {
                required: true,
                lenght: true
            }
        },
        messages: {
            password: {
                required: "Password field is empty.",
            },
            email: {
                required: "Email or Username field is empty.",
            },
            repeatPassword: {
                required: "Repeat Password field is empty.",
            },
            privateKey: {
                required: "Private key field is empty.",
            }
        },
        submitHandler: function(form) {
            if (sendAddressToBackend().localeCompare("ok") === 0){
                const $userAddress = $("input[name='userAddress']")
                const $divSuccess = $('div.success-p')
                const $privateKey = $('input[name="privateKey"]').val(undefined)

                if (typeof $userAddress.val() === "undefined" || $userAddress.val() === ''){
                    openPopupError()
                    $('div.error-p').children('p').eq(1)
                        .html("Nessun account rilevato. <br>Accedere a Metamask.");
                } else
                    ajaxRegister($privateKey, $userAddress, $divSuccess);
            }
            return false;
        }
    });

    $('#confirmPopupSuccess').on('click', function (){
        const $privateKey = $('input[name="privateKey"]')
        const $userAddress = $("input[name='userAddress']")
        const $divSuccess = $('div.success-p')

        if (($privateKey.val() != null && $privateKey.val() !== '') &&
            $privateKey.val().length > 63 && $privateKey.val().length < 65) {
            closePopupSuccess()
            ajaxRegister($privateKey, $userAddress, $divSuccess)
        } else {
            openPopupError()
            $('div.error-p').children('p').eq(1)
                .html("Chiave privata non corretta. <br>Riprovare.");
        }
    })

    $(".shadow").click(function () {
        closePopupError()
        closePopupSuccess()
    });

    $('#confirmPopupError').click(function () {
        closePopupError()
        closePopupSuccess()
    });

    $().click(function (){
        
    })
})

function ajaxRegister($privateKey, $userAddress, $divSuccess){
    $.ajax({
        type: "POST",
        url: "/kryptoauth/register",
        data: {
            email: $("input[name='email']").val(),
            password: $("input[name='password']").val(),
            repeatPassword: $("input[name='repeatPassword']").val(),
            userAddress: $userAddress.val(),
            privateKey: $privateKey.val(),
        },
        dataType: 'json',
        success: function (data) {
            const $emailInput = $('#email-error')
            const $passwordInput = $('#password-error')
            const $repeatPasswordInput = $('#repeatPassword-error')

            if (data.msgError['email'] != null) {
                if ($emailInput.length)
                    $emailInput.remove()
                $('input[name="email"]').after('<label id="email-error" class="error" for="email">' + data.msgError['email'] + '</label>')
            }

            if (data.msgError['password'] != null) {
                if ($passwordInput.length)
                    $passwordInput.remove()
                $('input[name="password"]').after('<label id="password-error" class="error" for="password">' + data.msgError['password'] + '</label>')
            }

            if (data.msgError['repeatPassword'] != null) {
                if ($repeatPasswordInput.length)
                    $repeatPasswordInput.remove()
                $('input[name="repeatPassword"]').after('<label id="repeatPassword-error" class="error" for="email">' + data.msgError['repeatPassword'] + '</label>')
            }

            if (data.msgError['userAddress'] != null) {
                openPopupError()
                $('div.error-p').children('p').eq(1)
                    .html("Nessun account rilevato. <br>Accedere a Metamask.");
            }

            if (data.msgError['contract'] != null){
                openPopupPrivateKey()
            }

            if (data.msgError['privateKey'] != null){
                openPopupError()
                $('div.error-p').children('p').eq(1)
                    .html("Chiave privata non corretta. <br>Riprovare.");
            }

            else if (data.msgError['success'] != null){
                openPopupSuccess();
            }
        },
        error: function (e) {
            console.log(e)
        }
    });
}