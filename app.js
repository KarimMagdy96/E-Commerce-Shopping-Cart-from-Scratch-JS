const cartbtn =document.querySelector('.cart-btn');
const closeCartBtn =document.querySelector('.close-cart')
const clearCartBtn =document.querySelector('.clear-cart')
const cardDom =document.querySelector('.cart')
const cartOverlay =document.querySelector('.cart-overlay')
const cartItems =document.querySelector('.cart-items')
const cartTotal =document.querySelector('.cart-total')
const cartContent =document.querySelector('.cart-content')
const productsDom =document.querySelector('.products-center')
//my cart
let cart=[];
let buttonsDom=[]

//get prodacts

class prodacts{
 async getProdacts(){
    try {
       let data= await fetch("products.json")
       let result =await data.json()
       let finalresult= result.items;
      finalresult=finalresult.map(prodact=>{
        const {title,price}=prodact.fields;
        const{id}= prodact.sys
        let imge = prodact.fields.image.fields.file.url
        return {title,price,id,imge}
      })
        return finalresult
    } catch (error) {

        console.log(error)
    }
 }
}

 //display prodacts

 class display{
showdata(prodacts){
    let showpro='';
    console.log(prodacts)
    prodacts.forEach(element => {
    showpro += `
    
    
        <article class="product">
           <div class="img-container">
            <img src=${element.imge} class="product-img">
            <button class="bag-btn" data-id=${element.id}>
                <i class="fa fa-shopping-cart"></i>
                add to bag
            </button>
           </div> 
           <h3>${element.title}</h3>
           <h4>${element.price}</h4>
        </article> 
    
    `;        
    });
    productsDom.innerHTML=showpro;
}
getbtn(){
    let btns = [...document.querySelectorAll('.bag-btn')]
    buttonsDom=btns;
    btns=btns.forEach(btn=>{
    let id =btn.dataset.id
    let inCart = cart.find(prodact=>prodact.id==id)
    if(inCart){
        btn.innerHTML='In Cart'
        btn.disabled= true
    }
    btn.addEventListener('click',event=>{
        event.target.innerHTML='In Cart';
        event.target.disabled=true;
        let cartitems={...storge.selectProdact(id),amount:1}
        cart=[...cart,cartitems]
        storge.saveCart(cart)
        display.cartValues(cart)
        display.addCartDom(cartitems)
        display.showCart()
    })
})
}
static cartValues(cart){
    console.log(cart)
 let totalAmount=0;
 let itemsCount=0
 cart.map(item=>{
    totalAmount += item.price * item.amount;
    itemsCount+=item.amount
})
cartItems.innerText=itemsCount;
cartTotal.innerText= parseFloat(totalAmount.toFixed(2));
}
 static addCartDom(item){
  let div=  document.createElement('div');
  div.classList.add('cart-item')
  div.innerHTML =`
  
  <img src=${item.imge} alt="prodact">
  <div>
  <h4>${item.title}</h4>
  <h5>${item.price}$</h5>
  <span class="remove-item" data-id=${item.id}>remove</span>
  </div>
  <div>
  <i class="fa fa-chevron-up" data-id=${item.id}></i>
  <p class="item-amount">${item.amount}</p>
  <i class="fa fa-chevron-down" data-id=${item.id}></i>
  </div>
  `
  cartContent.appendChild(div)
  console.log(cartContent)
}
static showCart(){
    cartOverlay.classList.add('transparentBcg')
    cardDom.classList.add('showCart')   
}
 static setupApp(){
 cart = storge.cheakcart();
 this.cartValues(cart);
 this.populate(cart)
 cartbtn.addEventListener('click',display.showCart)
 closeCartBtn.addEventListener('click',display.hideCart)

}
static populate(cart){
    cart.forEach(item=>this.addCartDom(item))
}
static hideCart(){
    cartOverlay.classList.remove('transparentBcg')
    cardDom.classList.remove('showCart')
}
 static cartLogic(){
clearCartBtn.addEventListener('click',display.clearCart)

cartContent.addEventListener('click',event=>{
    if(event.target.classList.contains('remove-item')){
        let removeItem=event.target;
        let itemId= removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement)
        this.removeItems(itemId);
    }
    else if(event.target.classList.contains('fa-chevron-up')){
        let add= event.target
        let addId= add.dataset.id
        let tempItem=cart.find(item=>item.id===addId );
        tempItem.amount=tempItem.amount+1
        storge.saveCart(cart)
        display.cartValues(cart)
        add.nextElementSibling.innerHTML=tempItem.amount
    }
    else if(event.target.classList.contains('fa-chevron-down')){
           let down= event.target
        let downId= down.dataset.id
        let tempItem=cart.find(item=>item.id===downId);
        tempItem.amount=tempItem.amount-1
        if(tempItem.amount>0){
        storge.saveCart(cart)
        display.cartValues(cart)
        down.previousElementSibling.innerHTML=tempItem.amount
        }else{
            cartContent.removeChild(down.parentElement.parentElement)
            this.removeItems(downId) 
        }
       
    }
}
)
}

static clearCart(){
    let cartItem= cart.map(item=>item.id)
    cartItem.forEach(id=>display.removeItems(id))
    while(cartContent.children.length>0){
    cartContent.removeChild(cartContent.children[0])
    }
    display.hideCart()
}
static removeItems(id){
    cart= cart.filter(items=>items.id !== id)
    display.cartValues(cart);
    storge.saveCart(cart)
      let buttons = display.getSinagleButton(id);
      buttons.disabled=false;
      buttons.innerHTML=`<li class='fa fa-shopping-cart'></li> add to cart`;

}
static getSinagleButton(id){
    return buttonsDom.find(button=>button.dataset.id ===id)
}
 }

 //local storge 

 class storge{
    static saveProdact(prodact){
        localStorage.setItem('prodact',JSON.stringify(prodact))
    }
    static selectProdact(id){
        let prodacts= JSON.parse(localStorage.getItem("prodact"));
        return prodacts.find(prodact=>prodact.id==id)

    }
    static saveCart(cart){
       localStorage.setItem('cart',JSON.stringify(cart)) 
    }
    static cheakcart(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.cart):[];
    }
 }

 document.addEventListener('DOMContentLoaded',()=>{
    const myprodacts= new prodacts()

    const showmyProdacts = new display()

    display.setupApp();

    //get prodats
    myprodacts.getProdacts().then(results=>{
        showmyProdacts.showdata(results);
        storge.saveProdact(results);
    }).then(()=>{
        showmyProdacts.getbtn()
        display.cartLogic()
    })

 })

//regex to capitalize all letters after spaces in string?