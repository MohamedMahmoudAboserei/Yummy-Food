/// <reference types="../@types/jquery" />
let rowData = document.getElementById('rowData');
let searchContainer = document.getElementById('searchContainer');
let submitBtn;
// ==========================
$(function () {
    searchByName('').then(() => {
        $('.loading-screen').fadeOut(500)
        $('body').css('overflow', 'visible')
    })
    closeNav()
});
function openNav() {
    const $navbar = $('#navbar');
    const $openIcon = $('#open-icon');
    const $tabLinks = $('.tab-links .links-tag li');

    $navbar.animate({ left: 0 }, 700);
    $openIcon.removeClass('fa-bars').addClass('fa-x');

    $tabLinks.each(function (index) {
        $(this).animate({ top: 0 }, (index + 5) * 100);
    });
}
function closeNav() {
    const $navbar = $('#navbar');
    const $openIcon = $('#open-icon');
    const $tabLinks = $('.tab-links .links-tag li');
    const navTabWidth = $('.nav-tab').outerWidth();

    $navbar.animate({ left: -navTabWidth }, 700);
    $openIcon.removeClass('fa-x').addClass('fa-align-justify');

    $tabLinks.animate({ top: 300 }, 400);
}
$('#open-icon').on('click', function () {
    const $navbar = $('#navbar');
    const navLeftPosition = $navbar.css('left');

    if (navLeftPosition === '0px') {
        closeNav();
    } else {
        openNav();
    }
})
/*
function displayMeals(arr) {
    const mealDisplay = arr.map(meal => `
        <div class="col-md-3">
            <div id="mealDetails" onclick="getDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2">
                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-title position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `).join('');

    rowData.innerHTML = mealDisplay;
}
*/
function displayMeals(arr) {
    let mealDisplay = "";

    for (let i = 0; i < arr.length; i++) {
        mealDisplay += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" id="mealDetails" class="meal position-relative overflow-hidden rounded-2 cursorPointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}" srcset="">
                    <div class="meal-title position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `
    }

    rowData.innerHTML = mealDisplay
}

async function getCategories() {
    try {
        rowData.innerHTML = "";

        $(".inner-loading-screen").fadeIn(300);

        searchContainer.innerHTML = "";

        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        displayCategories(data.categories);

    } catch (error) {
        console.error('Failed to fetch categories:', error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

function displayCategories(arr) {
    const categoriesDisplay = arr.map(category => `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursorPointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="${category.strCategory}">
                <div class="meal-title position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
    `).join('');

    rowData.innerHTML = categoriesDisplay;
}

async function getArea() {
    try {
        rowData.innerHTML = "";

        $(".inner-loading-screen").fadeIn(300);

        searchContainer.innerHTML = "";

        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        displayArea(data.meals);

    } catch (error) {
        console.error('Failed to fetch area list:', error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

function displayArea(arr) {
    const displayAreaHTML = arr.map(area => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursorPointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>
    `).join('');

    rowData.innerHTML = displayAreaHTML;
}

async function getIngredients() {
    try {
        rowData.innerHTML = "";
        $(".inner-loading-screen").fadeIn(300);
        searchContainer.innerHTML = "";

        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();

        displayIngredients(data.meals.slice(0, 20));
    } catch (error) {
        console.error("Error fetching ingredients:", error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

function displayIngredients(arr) {
    let ingredientsDisplay = arr.map(ingredient => {
        let description = ingredient.strDescription ? ingredient.strDescription.split(" ").slice(0, 20).join(" ") : "";
        return `
            <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursorPointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${ingredient.strIngredient}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
    }).join("");

    rowData.innerHTML = ingredientsDisplay;
}

async function getCategoryMeals(category) {
    try {
        rowData.innerHTML = "";
        $(".inner-loading-screen").fadeIn(300);

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();

        displayMeals(data.meals.slice(0, 20));
    } catch (error) {
        console.error("Error fetching category meals:", error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

async function getAreaMeals(area) {
    try {
        rowData.innerHTML = "";
        $(".inner-loading-screen").fadeIn(300);

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await response.json();

        displayMeals(data.meals.slice(0, 20));
    } catch (error) {
        console.error("Error fetching area meals:", error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

async function getIngredientsMeals(ingredients) {
    try {
        rowData.innerHTML = "";
        $(".inner-loading-screen").fadeIn(300);

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
        const data = await response.json();

        displayMeals(data.meals.slice(0, 20));
    } catch (error) {
        console.error("Error fetching ingredient meals:", error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

async function getMealDetails(mealID) {
    try {
        closeNav();
        rowData.innerHTML = "";
        $(".inner-loading-screen").fadeIn(300);
        searchContainer.innerHTML = "";

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
        const data = await response.json();

        displayMealDetails(data.meals[0]);
    } catch (error) {
        console.error("Error fetching meal details:", error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

function displayMealDetails(meal) {
    searchContainer.innerHTML = "";

    const ingredients = Array.from({ length: 20 }, (_, i) => {
        const ingredient = meal[`strIngredient${i + 1}`];
        const measure = meal[`strMeasure${i + 1}`];
        return ingredient ? `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>` : '';
    }).join('');

    const tags = meal.strTags ? meal.strTags.split(",").map(tag =>
        `<li class="alert alert-danger m-2 p-1">${tag}</li>`
    ).join('') : '';

    const mealDetails = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tags}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    `;
    rowData.innerHTML = mealDetails;
}

function showSearchInputs() {
    const searchInputs = `
        <div class="row py-4">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>
    `;

    searchContainer.innerHTML = searchInputs;
    rowData.innerHTML = '';
}

async function searchByName(term) {
    try {
        closeNav();
        rowData.innerHTML = "";
        $(".inner-loading-screen").fadeIn(300);

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();

        displayMeals(data.meals || []);
    } catch (error) {
        console.error("Error searching meals by name:", error);
        displayMeals([]);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

async function searchByFLetter(term) {
    try {
        closeNav();
        rowData.innerHTML = "";
        $(".inner-loading-screen").fadeIn(300);

        term = term.trim() || "a";
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
        const data = await response.json();

        displayMeals(data.meals || []);
    } catch (error) {
        console.error("Error searching meals by first letter:", error);
        displayMeals([]);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

function showContacts() {
    searchContainer.innerHTML = "";

    rowData.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" oninput="validateInput('name')" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" oninput="validateInput('email')" type="email" class="form-control " placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *example@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" oninput="validateInput('phone')" type="tel" class="form-control " placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" oninput="validateInput('age')" type="number" class="form-control " placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input  id="passwordInput" oninput="validateInput('password')" type="password" class="form-control " placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password *Minimum eight characters, at least one letter and one number*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input  id="rePasswordInput" oninput="validateInput('rePassword')" type="password" class="form-control " placeholder="Re-enter Password">
                        <div id="rePasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Passwords must match
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        </div>
    `;

    let nameInputTouched = false;
    let emailInputTouched = false;
    let phoneInputTouched = false;
    let ageInputTouched = false;
    let passwordInputTouched = false;
    let rePasswordInputTouched = false;

    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true;
    });
    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true;
    });
    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true;
    });
    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true;
    });
    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true;
    });
    document.getElementById("rePasswordInput").addEventListener("focus", () => {
        rePasswordInputTouched = true;
    });
}

function inputsValidation() {
    validateInputAndUpdateUI("name", "nameAlert", nameInputTouched, nameValidation);
    validateInputAndUpdateUI("email", "emailAlert", emailInputTouched, emailValidation);
    validateInputAndUpdateUI("phone", "phoneAlert", phoneInputTouched, phoneValidation);
    validateInputAndUpdateUI("age", "ageAlert", ageInputTouched, ageValidation);
    validateInputAndUpdateUI("password", "passwordAlert", passwordInputTouched, passwordValidation);
    validateInputAndUpdateUI("rePassword", "rePasswordAlert", rePasswordInputTouched, rePasswordValidation);

    const isFormValid =
        nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        rePasswordValidation();

    submitBtn.disabled = !isFormValid;
}

function validateInputAndUpdateUI(inputName, alertId, isTouched, validationFunction) {
    if (isTouched) {
        const isValid = validationFunction();
        const alertElement = document.getElementById(alertId);
        if (isValid) {
            alertElement.classList.replace("d-block", "d-none");
        } else {
            alertElement.classList.replace("d-none", "d-block");
        }
    }
}

function nameValidation() {
    const nameInputValue = document.getElementById("nameInput").value;
    return /^[a-zA-Z ]+$/.test(nameInputValue);
}

function emailValidation() {
    const emailInputValue = document.getElementById("emailInput").value;
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInputValue);
}

function phoneValidation() {
    const phoneInputValue = document.getElementById("phoneInput").value;
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInputValue);
}

function ageValidation() {
    const ageInputValue = document.getElementById("ageInput").value;
    return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(ageInputValue);
}

function passwordValidation() {
    const passwordInputValue = document.getElementById("passwordInput").value;
    return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(passwordInputValue);
}

function rePasswordValidation() {
    const rePasswordInputValue = document.getElementById("rePasswordInput").value;
    const passwordInputValue = document.getElementById("passwordInput").value;
    return rePasswordInputValue === passwordInputValue;
}