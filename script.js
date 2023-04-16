let search_box=document.getElementById("search_box");
let main=document.getElementById("main");
let container=document.getElementById("container");
let favourite_btn=document.getElementById("favourite_btn");
let fav_exit=document.getElementById("exit");
let fav_body=document.getElementById("fav_body");
let heart=[];
let view=0;
let btn_array=[];
if(localStorage.getItem("meals_id_array")===null)
{
    let meals_id=[];
    localStorage.setItem("meals_id_array",JSON.stringify(meals_id));
}
let object_array=[];
function show_notification(text){
    alert(text);
}
search_box.addEventListener("keyup",find_meals);
function find_meals(){
    let search_value=search_box.value;

    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+search_value)
    .then (function (response){
        return response.json();
    })
    .then(function(data){
        object_array=data;
        render_cards(object_array);
    })
    .catch(function(){
        main.innerHTML=`<div id="notfound">
        <p>There are no matching meals</p>
        </div>`;
    })
}
function render_cards(object_array){
    main.innerHTML="";
    let length=object_array.meals.length;
    for(i=0;i<length;i++){
        append_cards(object_array.meals[i]);
    }
}
let card_btn_array=[];
let index=0;
function append_cards(object){
    let mealCard=document.createElement("div");
    mealCard.classList.add("food_card");
    mealCard.innerHTML=`<div class="card_img_div">
    <img class="card_img" src = "${object.strMealThumb}"/>
</div >
<p class="card_text_para">${object.strMeal}</p>
<div class="card_side_div">
    <button id="${object.idMeal}" class="btn">View Recipe</button>
    <button  class="material-symbols-sharp"> <i id="${object.idMeal}1" class="fa-regular fa-heart"></i> </button> 
</div>`
main.append(mealCard);
let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
for (let i = 0; i < mls_id.length; i++) {
    if (mls_id[i].idMeal === object.idMeal) {
        let HEART_ID = `${object.idMeal}1`;
        let element = document.getElementById(HEART_ID);
        element.style.color = "red";
    }
}
    card_btn_array[index] = document.getElementById(`${object.idMeal}`);
    card_btn_array[index].addEventListener("click", Recipe_container);
    heart[index] = document.getElementById(`${object.idMeal}1`);
    heart[index].addEventListener("click", add_to_fav);
    index++;
}
function add_to_fav(event){
   console.log(event.target);
    let mls_id=JSON.parse(localStorage.getItem("meals_id_array"));
    for(let i=0;i<mls_id.length;i++){
        if((event.target.id).slice(0,-1)=== mls_id[i].idMeal){
            show_notification("meal already added in favourites");
            return;
        }
    }
    mls_id=mls_id.concat(object_array.meals.filter(function (object){
        return object.idMeal===(event.target.id).slice(0,-1);
    }));
    localStorage.setItem("meals_id_array",JSON.stringify(mls_id)) ;
    localStorage_fetch();
    show_notification("your meal added to favourites");
    (event.target).style.color="red";
}
function Recipe_container(event){
    if(btn_array.includes(event.target.id)===true)
       show_notification("meal already open");
    else{
        btn_array.push(event.target.id);
        view++;
        main.style.visibility="hidden";
        let array2=object_array.meals.filter(function(object){
            return object.idMeal===event.target.id;
        });
        let recipe_div=document.createElement("div");
        recipe_div.classList.add("Recipe_card");
        recipe_div.innerHTML=`
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img" src="${array2[0].strMealThumb}" alt="error">
                <p>${array2[0].strMeal}</p>
                <p>${array2[0].strArea}</p>
        </div>
        <div id="left_lower">
            <a href="${array2[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
        </div>
        </div>
        <div id="right">
            <span id="${(event.target.id)}5" class="cross"><i class="fa-regular fa-circle-xmark"></i></span>
            <h3 id="right_inst">Instructions</h3>
            <p id="right_p">${array2[0].strInstructions}</p>
        </div>
    </div>`;
    container.append(recipe_div);
    let cross=document.getElementsByClassName("cross");
    cross[0].addEventListener("click",exit_instructions);
    }
}
    function exit_instructions(event){
    const index = btn_array.indexOf(event.target.id.slice(0, -1));
    btn_array.splice(index, 1);
    view--;
    let recipes_container_div = document.getElementsByClassName("Recipe_card");
   
    recipes_container_div[recipes_container_div.length - 1].remove();

    if (view === 0) {
        main.style.visibility = "visible";
    }

    }
favourite_btn.addEventListener("click",fav_page);
function fav_page(){
    
    let fav_cont=document.getElementById("favourites_container");
    fav_cont.style.right="0px";
    fav_exit.addEventListener("click",exit);
    function exit(){
        fav_cont.style.right="-360px";
    }
    localStorage_fetch();
}
function localStorage_fetch(){
    let localStorage_length=JSON.parse(localStorage.getItem("meals_id_array")).length;
    let meals_id_array=JSON.parse(localStorage.getItem("meals_id_array"));
    if(localStorage_length===0){
        fav_body.innerHTML="<h2>No meals present in favourites</h2>"
    }
    else{
        fav_body.innerHTML = "";
        for (let i = 0; i < localStorage_length; i++) {
            //set card in fav div
            let mealCard = document.createElement("div");
            mealCard.classList.add("food_card2");
            mealCard.innerHTML = `
            <div class="card_img_div">
                <img class="card_img" src = "${meals_id_array[i].strMealThumb}"/>
            </div>

            <p class="card_text_para">${meals_id_array[i].strMeal}</p>
            <div class="card_lower_div_fav">
                <button id="${meals_id_array[i].idMeal}2" class="btn1">View</button>
                <button id="${meals_id_array[i].idMeal}3" class="btn1">Remove</button>
            </div>`;

            //add 1 in id = ${object.idMeal} becuse i want to make all id unique for heart
            fav_body.append(mealCard);

            // for card view btn
            card_btn_array[index] = document.getElementById(`${meals_id_array[i].idMeal}2`);
            // add event listner for evry card button
            card_btn_array[index].addEventListener("click", Recipe_container1);

            // for card remove
            heart[index] = document.getElementById(`${meals_id_array[i].idMeal}3`);
            // add event listner for evry remove button
            heart[index].addEventListener("click", remove_from_fav);
            index++;
        }
    }
}
function Recipe_container1(event) {

    if (btn_array.includes((event.target.id).slice(0, -1)) === true) {
        show_notification(" Your Meal Recipe is already open\nOR\nClose the Recipes INSTRUCTIONS Page for reaching to your desired page");
    }
    else {
        btn_array.push((event.target.id).slice(0, -1));
        view++;
        // main.innerHTML = ""; // option1
        main.style.visibility = "hidden"; // alternate option 2
        // filter_array have 1 object whose meal id match with button target id
        let filter_array = JSON.parse(localStorage.getItem("meals_id_array")).filter(function (object) {
            return object.idMeal === (event.target.id).slice(0, -1);
        });

        let Recipe_div = document.createElement("div");
        Recipe_div.classList.add("Recipe_card");
        Recipe_div.innerHTML = `    
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img"src="${filter_array[0].strMealThumb}" alt="error">
                <p id="left_upper_p1">${filter_array[0].strMeal}</p>
                <p id="left_upper_p2"> ${filter_array[0].strArea}</p>
            </div>
            <div id="left_lower">
                <a href="${filter_array[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
            </div>
        </div>

        <div id="right">
            <span id="${(event.target.id).slice(0, -1)}4" class="cross"> <i class="fa-regular fa-circle-xmark"></i></span>
            <h3 id="right_inst">INSTRUCTIONS</h3>
            <p id="right_p">${filter_array[0].strInstructions}</p>
        </div>`;

        container.append(Recipe_div);
        let cross = document.getElementsByClassName("cross");
        for (let i = cross.length - 1; i >= 0; i--) {
            cross[i].addEventListener("click", exit_instructions);
        }
    }
}

    function remove_from_fav(event) {
        // search in local storage for card is in fav section or not
        let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
        for (let i = 0; i < mls_id.length; i++) {
            if (mls_id[i].idMeal === event.target.id.slice(0, -1)) {
                mls_id.splice(i, 1);
            }
        }
        localStorage.setItem("meals_id_array", JSON.stringify(mls_id));
        localStorage_fetch();
        show_notification("Meal removed from your favourites list");
    
        // Remove red color from heart
        //fetch or find hert element by their id
        let HEART_ID = event.target.id.slice(0, -1) + 1; // add 1 because heart id is same as target id + 1.
        let element = document.getElementById(HEART_ID);
        // checking here because if browser is refresh and main div doesn't have any card so, it not set a id in heart so it through error in console that in element there is null.  
        if (element !== null) {
            element.style.color = "black";
        }
    
        // else we normaly remove card from fav div and it dirctly set black color on heart. it is because when main container render card on serach btn id is not present in local storage
    }
    
