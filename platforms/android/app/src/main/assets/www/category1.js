// const db=firebase.firestore();

const wholeNavigationPcHTML = document.querySelector("#whole-navigation-pc");

const extractChildCat = (data, subId, docId) => {
  let childLi = "";
  data.childCategories.map((doc) => {
    // let docData = doc.data();
    childLi += `
      <li><a href="./Products/products.html?cat=${docId}&&sub=${subId}&&child=${doc.id}">${doc.name}</a></li>
    `;
  });
  // console.log(childLi);
  return childLi;
};

const extractSubCat = (data, docId) => {
  let subLi = "";
  data.subCategory.map((doc) => {
    // let docData = doc.data();
    let childCat = extractChildCat(doc, doc.id, docId);

    subLi += `
    <li >
      <a style="top:0;padding:5px !important;position:sticky;z-index:999 !important;background:white !important" href="./Products/products.html?cat=${docId}&&sub=${doc.id}">${doc.name}</a>
      <ul style="z-index:0 !important" > ${childCat}</ul>
    </li>
    `;
  });
  return subLi;
};

db.collection("categories").onSnapshot(async (snapshots) => {
  let snapshotDocs = snapshots.docs;
  let li = "";
  let liMob = "";
  let tempArr = [];
  for (let doc of snapshotDocs) {
    let docData = doc.data();
    // console.log(docData);
    tempArr.push({ d: docData, dId: doc.id });
  }

  tempArr.sort(function (a, b) {
    return +b.d.priority - +a.d.priority;
  });

  for (let data of tempArr) {
    // console.log(data);
    let subCat = extractSubCat(data.d, data.dId);
    li += `
      <li >
        <a href="./Products/products.html?cat=${data.dId}">${data.d.name}</a>
        <ul>
          ${subCat}
          <li>
            <ul>
              <li><img class="navimage" src="${data.d.imgUrl}"></li>
            </ul>
          </li>
        </ul>
      </li>
      `;
    liMob += `
      <li >
        <a href="#!" ><span onclick="navigateTo('./Products/products.html?cat=${data.dId}')">${data.d.name}</span><i class="fa fa-chevron-down" style="margin-left: 10%;float: right;"></i></a>
        <ul>
          ${subCat}
          <li>
            <ul>
              <li><img class="navimage" src="${data.d.imgUrl}"></li>
            </ul>
          </li>
        </ul>
      </li>`;
  }
  const wholeNavigationPcHTML = document.querySelector("#whole-navigation-pc");
  wholeNavigationPcHTML.innerHTML = li;
  const wholeNavigationMobile = document.querySelector(
    "#whole-navigation-mobile"
  );
  wholeNavigationMobile.innerHTML = liMob;
  $(".menu > ul > li").hover(function (e) {
    $('.menu > ul > li > a').css('z-index', 1000);
    if ($(window).width() > 943) {
      $(this).children("ul").stop(true, false).fadeToggle(150);
      e.preventDefault();
    }
  });
  $(".menu > ul > li").click(function () {
    $('.menu > ul > li > a').css('z-index', 1000);
    if ($(window).width() <= 943) {
      $(this).children("ul").fadeToggle(150);
    }
  });
  $(".menu-mobile").click(function (e) {
    $(".menu > ul").toggleClass("show-on-mobile");
    e.preventDefault();
  });

  $(window).resize(function () {
    $(".menu > ul > li").children("ul").hide();
    $(".menu > ul").removeClass("show-on-mobile");
  });
});
function navigateTo(location) {
  window.location = location;
}

const easyAddToCart = () => {
  // console.log('addToCart');
};

let cartModalHTML = document.querySelector("#cart-modal");
let flag = 0;
let cartModalProds = "";
if (localStorage.getItem("locLoggedInUser")) {
  // let a = localStorage.getItem("locLoggedInUser")
  let uId = localStorage.getItem("locLoggedInUser");
  db.collection("Customers")
    .doc(uId)
    .onSnapshot(async (userDoc) => {
      if (userDoc.exists) {
        let userData = userDoc.data();
        // console.log(userData);
        if (userData.cart) {
          flag = 1;
          var cartSize = userData.cart.length;
          // console.log(cartSize);
          cartModalProds = `
          <a href="#cart" class="cart carticon">
            <div class="icon" onclick="redirectToCart()">
              <i onclick="redirectToCart()" class="fa fa-shopping-cart"></i>
              <span onclick="redirectToCart()" class="cart-quantity" id="cart-count">${cartSize}</span>
            </div>
          </a>
          <div class="my-dropdown-menu" id="cart-items" style="max-height:500px;overflow-y:scroll;width:350px">
          <h5 style="padding:10px;font-weight:700;font-size:13px;">${cartSize} Items In Your Bag</h5>
          `;
          for (cartProd of userData.cart) {
            // console.log(cartProd);
            await db
              .collection(cartProd.cat)
              .doc(cartProd.prodId)
              .get()
              .then((pDoc) => {
                let pData = pDoc.data();
                if (pData) {
                  cartModalProds += `
                <div class="dropdownmenu-wrapper">
                <ul class="dropdown-cart-products">
                  <li class="product cremove3461">
                    <figure class="product-image-container">
                      <a href="./UserDash/cart.html" class="product-image">
                        <img src="${pData.mainImgUrl}"
                          style="width: 70px; object-fit:cover;" alt="Lake of Cakes">
                      </a>
                    </figure>
                    <div class="product-details">
                      <div class="co">
                        <a href="#!">
                          <h4 class="product-title" style="text-align:left;padding:5px;font-size:14px !important;margin-left:10% !important;width:200px">${pData.name}</h4>
                        </a>
                        <span class="cart-product-info">
                          <span class="cart-product-qty" id="cqt3461"><span style="margin-left:11%;font-size:12px">Qty - </span>${cartProd.qty}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                </div>
              
                `
                
                ;
                }
              });
          }
          cartModalProds += `
      <div onclick="redirectToCart()" class="dropdown-cart-action" style="padding:15px !important">
            <a  onclick="redirectToCart()" class="mybtn1" style=";margin-left:auto;margin-right:auto;cursor:pointer">View In Cart</a>
          </div>
        </div>
      </div>
      `;
        }
        cartModalHTML.innerHTML = cartModalProds;
      }
    });
}