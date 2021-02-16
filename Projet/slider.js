var slide = new Array("images/page001.jpg", "images/page002.jpg", "images/page003.jpg", "images/page004.jpg","images/page005.jpg","images/page006.jpg","images/page007.jpg","images/page008.jpg","images/page009.jpg","images/page010.jpg","images/page011.jpg","images/page012.jpg","images/page013.jpg","images/page014.jpg","images/page016.jpg","images/page017.jpg","images/page018.jpg","images/page019.jpg","images/page020.jpg","images/page021.jpg","images/page022.jpg","images/page023.jpg");
var numero = 0;

function ChangeSlide(sens) {
    numero = numero + sens;
    if (numero < 0)
        numero = slide.length - 1;
    if (numero > slide.length - 1)
        numero = 0;
    document.getElementById("slide").src = slide[numero];
    setInterval("ChangeSlide(1)", 30000);
    // 4 SECONDES SOIT 4000 MILLISECONDES
}
