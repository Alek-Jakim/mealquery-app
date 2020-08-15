//DOM SELECTORS
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
let resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal')


//Search Meal and fetch from API
const searchMeal = (e) => {

    //Clear Single Meal
    single_mealEl.innerHTML = '';

    //Get Search term
    const term = search.value;


    //Check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>Sorry, My Dear Foodie! No Search Results, Try Again!</p>`
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                     <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                     </div>   
                    `)
                        .join('');
                }
            });
        //Clear search text
        search.value = '';

    } else {
        alert('Please enter a search value')
    }

    e.preventDefault();
}

//Fetch meal by id
const getMealById = (mealID) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
}

//Fetch Random Meal from the fricking API
const getRandomMeal = () => {
    //Clear the meals and the heading
    mealsEl.innerHTML = ''
    resultHeading = ''

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal)
        })

}

//Add meal to DOM
const addMealToDOM = (meal) => {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `)
        } else {
            break
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}            
            </ul>
        </div>
    </div>
    `
}
//Event Listeners - note to self: put them on the bottom

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    })

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }
})
