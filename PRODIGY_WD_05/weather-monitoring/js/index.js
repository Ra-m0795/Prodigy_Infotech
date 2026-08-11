function onUserLogin(event) {
    event.preventDefault();
    document.getElementById("button-container").classList.toggle("button-loading");
    document.getElementById("submit-button").value = "";
    
    // Goto forecast.html after animation
    setTimeout(function() {
        window.location.href = "./forecast.html";  /* document.getElementById("userLogin").submit(); */
    }, 2000);
}

function colorInputField(field) {
    if (field.value.trim() !== "") {
        field.classList.add("input-filled");
        field.classList.remove("input-default");
    } else {
        field.classList.remove("input-filled");
        field.classList.add("input-default");
    }
}

/* GEOLOCATION */
function getLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
           /* SAVE TO STORAGE */
            sessionStorage.setItem('latitude', latitude);
            sessionStorage.setItem('longitude', longitude);
        }
    );
}

getLocation();



//------------ Event Listeners ------------//

// Color input fields when not empty
document.getElementById("username").addEventListener("input", function() {
    colorInputField(this);
});

document.getElementById("password").addEventListener("input", function() {
    colorInputField(this);
});
