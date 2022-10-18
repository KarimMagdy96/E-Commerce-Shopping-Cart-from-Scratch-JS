const cartbtn =document.querySelector('.cart-btn');
const closeCartBtn =document.querySelector('.closer-cart')
const clearCartBtn =document.querySelector('.clear-cart')
const cardDom =document.querySelector('.cart')
const cartOverlay =document.querySelector('.cart-overlay')
const cartItems =document.querySelector('.cart-items')
const cartTotal =document.querySelector('.cart-total')
const cartContent =document.querySelector('.cart-content')
const productsDom =document.querySelector('.products-center')
//my cart
let cart=[];

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
    showpro+=`
    
    
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
    
    
    
    `        
    });
    productsDom.innerHTML=showpro;
}
getbtn(){
    let btns = [...document.querySelectorAll('.bag-btn')]
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
    })
    storge.selectProdact(id)
})
}
 }

 //local storge 

 class storge{
    static saveProdact(prodact){
        localStorage.setItem('prodact',JSON.stringify(prodact))
    }
    static selectProdact(id){
        let prodact= localStorage.getItem('prodact')
    }
 }

 document.addEventListener('DOMContentLoaded',()=>{
    const myprodacts= new prodacts()

    const showmyProdacts = new display()

    //get prodats
    myprodacts.getProdacts().then(results=>{
        showmyProdacts.showdata(results);
        storge.saveProdact(results);
    }).then(()=>{
        showmyProdacts.getbtn()
    })

 })
 
