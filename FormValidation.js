 function checkData() {
        //regex expression:
        var phoneRegex = /^[0-9]*$/;
        var nameRegex = /^[a-zA-Z]*$/;
        var name = document.signup.NAME.value;
        var phone = document.signup.PHONE.value;


        var phoneResult = phoneRegex.test(phone);
        var nameResult = nameRegex.test(name);


        if (!phoneResult) {
            alert("Please fill in your Phone Number with numbers only.")
            document.signup.PHONE.focus()
            document.getElementById("Button").disabled = true;
            return false;
        }
        if (!nameResult) {
            alert("Please fill in your Name with letters only.")
            document.signup.NAME.focus()
            document.getElementById("Button").disabled = true;
            return false;
        }

        if (document.signup.NAME.value == "") {
            alert("Please fill in your name.")
            document.signup.NAME.focus()
            return false;
        }
        if (document.signup.NAME.value.length < 5) {
            alert("Please fill in your name with at least 5 letters.")
            document.signup.NAME.focus()
            return false;
        }
        if (document.signup.PHONE.value == "") {
            alert("Please fill in your PHONE.")
            document.signup.PHONE.focus()
            return false;
        }
        if (document.signup.PHONE.value.length < 5) {
            alert("Please fill in your phone with at least 11 numbers.")
            document.signup.PHONE.focus()
            return false;
        } else {
            document.getElementById("Button").disabled = false;
            return true;
        }
    }