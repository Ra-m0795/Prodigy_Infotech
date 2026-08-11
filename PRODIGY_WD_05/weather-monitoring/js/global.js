// Dark/Light mode toggle switch(s) 
const toggleSwitches = document.querySelectorAll(".theme-toggle-button");
const toggleSlider = document.querySelectorAll(".slider");
const toggleIcon = document.querySelectorAll(".theme-icon");



//------------ Color Theme ------------//

function windownOnLoad() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme, false);
        return;
    }

    setTheme("dark", false);
}

function setTheme(theme, btnAnimation = true) {
    localStorage.setItem("theme", theme);
    
    setColorTheme(theme);
    setThemeButtonState(theme, btnAnimation);
}

function setColorTheme(theme) {
    const page = document.querySelector("body");
    
    if (theme === "light") {
        page.classList.add("light-mode");
        page.classList.remove("dark-mode");
    } else {
        page.classList.add("dark-mode");
        page.classList.remove("light-mode");
    }
}

function setThemeButtonState(theme, btnAnimation) {
    const isLightTheme = (theme === "light");

    if (btnAnimation) {
        toggleSlider.forEach(button => {
            button.classList.add("slider-animation");
        });
    }
    // Sync both buttons (desktop + mobile header)
    toggleSlider.forEach(slider => { slider.checked = isLightTheme; });
    toggleSwitches.forEach(button => { button.checked = isLightTheme; });
}



//------------ Dropdown menu ------------//

function toggleDropdownMenu() {
    const menu = document.getElementById("dropdown-menu");
    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}

function closeDropdownMenu() {
    const menu = document.getElementById("dropdown-menu");
    menu.style.display = "none";
}


//------------ Event Listeners ------------//

// On window load
window.addEventListener("load", windownOnLoad);

// On theme button press
toggleSwitches.forEach((toggleSwitch) => {
    toggleSwitch.addEventListener("change", () => {
        const isLightTheme = toggleSwitch.checked;

        // Sync both buttons
        toggleSwitches.forEach(button => button.checked = isLightTheme);

        let theme = isLightTheme ? "light" : "dark";
        setTheme(theme);
    });
});

// Close dropdown menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1000) {
        closeDropdownMenu();
    }
});
