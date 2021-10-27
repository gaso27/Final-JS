//Scroll a Contacto
$("#contacto").click(function (e) {
    e.preventDefault ($("#contacto"));
    $('html, body').animate({
        scrollTop: $("#contenidoContacto").offset().top
    },2000);
})

//Animacion Fade "Bienvenido"
$("#botonFade").click(function () {
    $("#animacionFade").slideToggle(2000);
})

$("#ejemploAnimacion").animate({fontSize: "40px",},2000)
                      .delay(1000)


//-------------------------------------------

// SELECT = FILTRO

let selectP= document.getElementById('select')

selectP.addEventListener('change',()=>{
    $('#contenedor-productos').fadeOut(1000, function() {

        if(selectP.value == 'all'){
            mostrar(stockProductos)
        }else{
        mostrar(stockProductos.filter(x => x.tipo == selectP.value))
        
        }
    }).fadeIn(1000)
    
})