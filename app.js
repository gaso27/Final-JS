//AJAX - STOCK PRODUCTOS
let stockProductos = [];

$.getJSON('data/stock.json', function(data){
    console.log(data)
       // Storage

    localStorage.setItem('stock', JSON.stringify(data));
    mostrar(data)   
    recuperar()
    
});

//--------------------------------------------------------------------------------

//CONSTANTES

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

//--------------------------------------------------------------------------------

//Crear CARDS
mostrar(stockProductos)
//RECORRO EL ARRAY PARA CREAR UN NODO POR VALOR EN EL ARRAY

function mostrar(array) {
    contenedorProductos.innerHTML= '';
    for (const producto of array) {
        let divProducto= document.createElement('div');//CREO EL NODO
        
        divProducto.innerHTML= `<div class="card" style="width: 18rem;">
                                    <img src=${producto.img} class="card-img-top" alt="...">
                                    <div class="card-body">
                                    <h5 class="card-title">Producto: ${producto.nombre}</h5>
                                    <h6 class="card-title">Precio: $${producto.precio}</h6>
                                    <p class="card-text">${producto.desc}</p>
                                    <a href="#" class="btn btn-primary" id='${producto.id}'>Comprar</a>
                                    </div>
                                </div>`
        contenedorProductos.appendChild(divProducto);//AGREGO UN NUEVO HIJO A BODY PARA QUE LO MUESTRE EN EL HTML
        
    } 

//BOTON AGREGAR
let botones= document.getElementsByClassName('btn');
 
for (const boton of botones) {
    boton.addEventListener('click', function (e) {
        e.preventDefault()
        Toastify({
            text: "Producto agregado🛒",
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
              background: "green",
            }
          }).showToast();
        agregarAlCarrito(this.id)
    })
}
}

//--------------------------------------------------------------------------------

// CARRITO DE COMPRAS
let carritoDeCompras = [];

//AGREGAR AL CARRITO
function agregarAlCarrito(id) {
    $('#btnConfirmar').css("display","flex")
    $('#modalPrecio').css('display', 'block')
    //Acumular mismos productos
    let repetido = carritoDeCompras.find(productoR => productoR.id == id);
    if(repetido){
        repetido.cantidad = repetido.cantidad + 1
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id=cantidad${repetido.id}>Cantidad:${repetido.cantidad}</p>`
        actualizarCarrito()
    }else {
        let productoAgregar = stockProductos.find((el) => el.id == id);
        console.log(stockProductos);
    console.log(productoAgregar);
    carritoDeCompras.push(productoAgregar)
    mostrarCarrito (productoAgregar);
    actualizarCarrito()
    }

     //STORAGE LOCAL
     localStorage.setItem('tienda' , JSON.stringify(carritoDeCompras)) 

}
//--------------------------------------------------------------------------------

// ACTUALIZAR EL CARRITO DE COMPRAS
function actualizarCarrito() {
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el) => acc + el.cantidad,0);
    precioTotal.innerText = carritoDeCompras.reduce((acc, el) => acc + (el.precio * el.cantidad), 0)
 }

 //Guardado en el carrito
function recuperar () {
    let guardado = JSON.parse (localStorage.getItem ('tienda'))
    let recuperoStock = JSON.parse(localStorage.getItem('stock'));
    if(recuperoStock){
        if(stockProductos.length < 10)
        recuperoStock.forEach(el=>{
            stockProductos.push(el)
        })
    }

    if(guardado){
        $(document).ready(function () {
             guardado.forEach(el => {
                 carritoDeCompras.push(el)
            mostrarCarrito(el)
            actualizarCarrito()

            if(carritoDeCompras.length > 0){
            $('#btnConfirmar').css("display","flex")
            $('#modalPrecio').css('display', 'block')
            }
        });
          })
       
    }
   
}

//--------------------------------------------------------------------------------

//MOSTRAR CARRITO
function mostrarCarrito (productoAgregar) { 
    let div = document.createElement('div')
     div.innerHTML = `<div class="card">
                        <div class="card-body carrito-body">
                            <div>
                                <img class="img-cart" src=${productoAgregar.img}>
                            </div>
                            <div>
                                <h5 class="card-title">Producto: ${productoAgregar.nombre}</h5>
                                <h6 class="card-title">Precio: $${productoAgregar.precio}</h6>
                                <p id=cantidad${productoAgregar.id}>Cantidad:${productoAgregar.cantidad}</p>
                                <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                            </div>  
                        </div>
                    </div>`
        contenedorCarrito.appendChild(div)   
        actualizarCarrito()
        
        //eliminar del carrito y su guardado
        let  botonEliminar= document.getElementById(`eliminar${productoAgregar.id}`)

        botonEliminar.addEventListener('click', ()=>{
            if(productoAgregar.cantidad>1){
                productoAgregar.cantidad = productoAgregar.cantidad-1
                document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id=cantidad${productoAgregar.id}>Cantidad:${productoAgregar.cantidad}</p>`
                Toastify({
                    text: "Cantidad descontada❌",
                    className: "info",
                    position: "center",
                    gravity: "bottom",
                    style: {
                      background: "red",
                    }
                  }).showToast();

                localStorage.setItem('tienda' , JSON.stringify(carritoDeCompras)) 
                actualizarCarrito()
            }else{
                botonEliminar.parentElement.parentElement.parentElement.remove()
                carritoDeCompras = carritoDeCompras.filter(el => el.id != productoAgregar.id)
                Toastify({
                    text: "Producto eliminado❌",
                    className: "info",
                    position: "center",
                    gravity: "bottom",
                    style: {
                      background: "red",
                    }
                  }).showToast();
            
                localStorage.setItem('tienda' , JSON.stringify(carritoDeCompras)) 
                actualizarCarrito()
                if(carritoDeCompras.length == 0){
                    $('#btnConfirmar').css("display","none")
                    $('#modalPrecio').css('display', 'none')
                }
            }
           
        })
}

//--------------------------------------------------------------------------------

//Terminar compra
$('#botonConfirmar').html(`<button class="btn-primary" id="btnConfirmar" style="display:none">Confirmar Compra</button>`);
$("#btnConfirmar").on("click",function () {
    $.post("https://jsonplaceholder.typicode.com/posts",JSON.stringify(carritoDeCompras),function(respuesta,estado) {
      console.log(respuesta)
      console.log(estado)
      if(estado){
          $('#btnConfirmar').css("display","none")
          $('#modalPrecio').css('display', 'none')
          contenedorCarrito.innerHTML= `<h6>Su pedido ha sido procesado orden N°: 6545s6df4dsfsf4654sdf</h6>`;

          setTimeout(()=>{
              contenedorCarrito.innerHTML='';
          },2000)

          carritoDeCompras= []
          localStorage.clear()
          actualizarCarrito()

      }
    })
  })

//--------------------------------------------------------------------------------


