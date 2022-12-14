/////////////////////////////////////////////
// MAJ PANIER NAVBAR
/////////////////////////////////////////////

function diplayBasketTop() {
    // Appel le panier depuis le localStorage
    let basket = localStorage.getItem("basket");
    // si le panier n'est pas vide... (true)
    if (basket) {
        // transforme le panier en format JSON en javascript
        basket = JSON.parse(basket);
        // initialisation de la variable quantityTotal
        let quantityTotal = 0;
        // boucle forEach pour chaque élément du panier
        basket.forEach((element) => {
            // A chaque élément on vient ajouté la valeur de sa quantité
            quantityTotal += element.quantity;
        });
        // on récupère la nav bar constitué de deux "li"
        let productsInBasket = document.querySelectorAll("nav a li");
        //Affiche la quantité d'article dans le panier à droite de "panier"
        productsInBasket[1].innerHTML = `Panier (${quantityTotal})`;
    }
}
// appel la fonction
diplayBasketTop();

// Retourne le tableau du localStorage
function getBasket() {
    // variable qui stock ce que l'on appel dans le localStorage
    let basket = localStorage.getItem("basket");
    // si le panier est false (vide)
    if (!basket) {
        // retourne un tableau vide
        return [];
    } else {
        // retourne le tableau stocké dans le localStorage
        return JSON.parse(basket);
    }
}
// Sauvegarde le panier dans le localStorage
function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

//appel de l'api avec méthode fetch
fetch("https://kanap-back.vercel.app/api/products")
    // transformer la réponse en json.
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    // ce qui a été traité en json sera appelé objetProduits
    .then((objetProduits) => {
        //console.table(objetProduits)
        displayProductsCart(objetProduits);
    })

    // dans le cas d'une erreur remplace le contenu de titre par un h1
    // au contenu de erreur 404 et renvoit en console l'erreur.
    .catch((err) => {
        document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api:" + err);
    });

//Afficher les produits depuis le localStorage
function displayProductsCart(kanaps) {
    let basket = JSON.parse(localStorage.getItem("basket"));
    let displayProducts = document.getElementById("cart__items");
    if (basket && basket.length != 0) {
        for (let product of basket) {
            for (let g = 0, h = kanaps.length; g < h; g++) {
                if (product._id === kanaps[g]._id) {
                    // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
                    product.name = kanaps[g].name;
                    product.prix = kanaps[g].price;
                    product.image = kanaps[g].imageUrl;
                    product.alt = kanaps[g].altTxt;
                }
            }

            // insértion des éléments dans le dom
            displayProducts.insertAdjacentHTML(
                "afterbegin",
                `<article class="cart__item" data-id="${
                    product._id
                }" data-color="${product.color}" data-quantité="${
                    product.quantity
                }" data-prix="${product.prix}">
      <div class="cart__item__img">
        <img src="${product.image}" alt="${product.alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <a href="./product.html?id=${product._id}" class="link-product"><h2>${
                    product.name
                }</h2></a>
          <p>${product.color}</p>
          <p>${lisibilite_nombre(product.prix)} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                product.quantity
            }">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
      </article>`
            );
            // supression du style des liens ajoutés
            document.querySelector(".link-product").style.textDecoration =
                "none";
            document.querySelector(".link-product").style.color = "white";
        }
    } else {
        // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML =
            "Vous n'avez pas d'article dans votre panier";
    }
    //appel des différentes fonctions pour qu'elles soit dans le fetch (async)
    getBasket();
    totalProduit();
    updateQuantity();
    deleteProduct();
}

function totalProduit() {
    // déclaration variable en tant que nombre
    let totalArticle = 0;
    let totalPrix = 0;
    // on pointe l'élément
    const cart = document.querySelectorAll(".cart__item");
    // pour chaque élément cart
    cart.forEach((cart) => {
        //je récupère les quantités des produits grâce au dataset
        totalArticle += parseInt(cart.querySelector(".itemQuantity").value);
        //console.log(totalArticle);
        // je créais un opérateur pour le total produit grâce au dataset
        let productPrice = parseInt(
            cart
                .querySelector(".cart__item__content__description")
                .lastElementChild.textContent.slice(0, -1)
                .split(" ")
                .join("")
        );
        totalPrix +=
            parseInt(cart.querySelector(".itemQuantity").value) * productPrice;
    });
    // je pointe l'endroit d'affichage nombre d'article
    document.getElementById("totalQuantity").textContent = totalArticle;
    // je pointe l'endroit d'affichage du prix total
    document.getElementById("totalPrice").textContent =
        lisibilite_nombre(totalPrix);
}

// fonction qui gère les changements de quantité de les inputs
function updateQuantity() {
    let basket = JSON.parse(localStorage.getItem("basket"));
    const quantity = document.querySelectorAll(".itemQuantity");
    for (let updateQuantity of quantity) {
        updateQuantity.addEventListener("change", (eq) => {
            for (product of basket) {
                let article = updateQuantity.closest("article");
                if (
                    product._id === article.dataset.id &&
                    article.dataset.color === product.color &&
                    eq.target.value >= 1 &&
                    eq.target.value <= 100
                ) {
                    product.quantity = parseInt(eq.target.value);
                    localStorage.basket = JSON.stringify(basket);
                    article.dataset.quantité = parseInt(eq.target.value);
                    totalProduit();
                    diplayBasketTop();
                } else if (eq.target.value < 1 || eq.target.value > 100) {
                    alert(
                        "Indiquez des quantités Valide SVP [comprises entre 1 et 100]"
                    );
                    updateQuantity.value = article.dataset.quantité;
                }
            }
        });
    }
}

// fonction qui gère la suppremier des produits
function deleteProduct() {
    //appel du panier (localStorage)
    let basket = JSON.parse(localStorage.getItem("basket"));
    // creation variable pour stocker le boutton supprimé
    const deleteButton = document.querySelectorAll(".deleteItem");
    console.log(typeof deleteButton);
    // Pour chaque click sur un bouton delete
    for (let click of deleteButton) {
        // Ecoute du clique sur un bouton supprimé
        click.addEventListener("click", (ec) => {
            if (window.confirm("Voulez vous supprimer cet article?")) {
                let article = click.closest("article");
                // supression de l'article dans le dom
                article.remove();
                for (let i = 0, b = basket.length; i < b; i++) {
                    let foundProduct = basket.find(
                        (p) =>
                            p._id == article.dataset.id &&
                            p.color == article.dataset.color
                    );
                    // filtre sur le panier, pour ne garder que les produits où l'on a pas cliqué sur supprimer
                    basket = basket.filter((p) => p != foundProduct);
                    localStorage.basket = JSON.stringify(basket);
                    totalProduit();
                    diplayBasketTop();
                }
            }
        });
    }
}

/////////////////////////////////////////////
// FONCTION SEPARATEUR DE MILIER
/////////////////////////////////////////////

function lisibilite_nombre(nbr) {
    var nombre = "" + nbr;
    var retour = "";
    var count = 0;
    for (var i = nombre.length - 1; i >= 0; i--) {
        if (count != 0 && count % 3 == 0) retour = nombre[i] + " " + retour;
        else retour = nombre[i] + retour;
        count++;
    }
    return retour;
}

/**************
FORM
***************/

// initialisation de l'objet contact
let contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
};

// Stock si les inputs sont valides ou non
let isValidInputs = {
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    email: false,
};
// définitions des différentes RegExp dans une constante
const regExpList = {
    firstName: new RegExp("(^[a-zA-Zéè -]{2,20}$)"),
    lastName: new RegExp("(^[a-zA-Z -]{2,30}$)"),
    address: new RegExp("(^[a-zA-Zéè 0-9,-]{4,50}$)"),
    city: new RegExp("(^[a-zA-Zàéè -]{4,30}$)"),
    email: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
};

// Vérifier les inputs et les stocker
function checkUserInformations(input, regex, id) {
    if (regex.test(input.value)) {
        input.style.border = "2px solid Green";
        document.getElementById(`${id}ErrorMsg`).innerText = "";
        contact[id] = input.value;
        isValidInputs[id] = true;
    } else {
        input.style.border = "2px solid Red";
        isValidInputs[id] = false;
        if (id == "firstName" || id == "lastName") {
            document.getElementById(`${id}ErrorMsg`).innerText =
                'Le format renseignée n\'est pas valide (ex : "Julien")';
        } else if (id == "email") {
            document.getElementById(`${id}ErrorMsg`).innerText =
                'Le format renseignée n\'est pas valide (ex: " johndoe@aol.com ") ';
        } else {
            document.getElementById(`${id}ErrorMsg`).innerText =
                "L'information renseignée n'est pas valide";
        }
    }
}

// Appel la fonction de validité et de stockage des inputs à l'aide d'une boucle
for (let input of document.querySelector(".cart__order__form")) {
    if (input.type == "text" || input.type == "email") {
        input.addEventListener("change", (e) => {
            checkUserInformations(
                e.target,
                regExpList[e.target.id],
                e.target.id
            );
        });
    }
}

/////////////////////////////////////////////
// fetch post
/////////////////////////////////////////////

// Ecoute du bouton "commander" au click
// vérification du formulaire et du panier
document.getElementById("order").addEventListener("click", (e) => {
    e.preventDefault();
    let formValidity = Object.values(isValidInputs).includes(false);
    let basket = JSON.parse(localStorage.getItem("basket"));
    getBasket();
    if ((formValidity === true) && ((basket === [] || basket === null))) {
        alert(
            "Les données renseignées dans le formulaire ne sont pas valides ou ne sont pas remplies et votre panier est vide"
        );
        return;
    } else if ((formValidity === true) && (basket.length != 0)) {
        alert(
            "Les données renseignées dans le formulaire ne sont pas valides ou ne sont pas remplies"
        );
        return;
    } else if ((formValidity === false) && (basket === [] || basket === null)) {
        alert("Le panier est vide");
        return;
    } else {
        //appel de la fonction d'envoi de la commande
        postOrder();
    }
});

// Fonction d'envoi de la commande
// initialisation d'un tableau à 0 pour stocker les ID des produits
function postOrder() {
    let basket = JSON.parse(localStorage.getItem("basket"));
    let products = [];
    // ajout de chaque id par produit dans un tableau produit
    for (let i = 0; i < basket.length; i++) {
        products.push(basket[i]._id);
    }

    // déclaration de data, l'object que nous envoyé lors de la commande,
    // avec les données du formaulaire et l'id de chaque produit.
    let data = {
        contact,
        products,
    };

    // Fonction fetch avec methode post "envoi"
    fetch("https://kanap-back.vercel.app/api/products/order", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.status == 201) {
                alert("Votre commande a bien été validée");
                return res.json();
            } else if (res.status !== 201) {
                alert(
                    "une erreur est survenue lors de l'envoi du formulaire, veuillez réessayer"
                );
            }
        })
        .then((res) => {
            // Vide le localStorage
            localStorage.clear();
            // Ouvre la page de confirmation avec le numéro de commande dans l'URL
            window.location.href = `../html/confirmation.html?order_id=${res.orderId}`;
        })
        .catch((error) => console.log("Erreur : " + error));
}
