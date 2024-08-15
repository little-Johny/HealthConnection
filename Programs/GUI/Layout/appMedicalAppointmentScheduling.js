document.addEventListener('DOMContentLoaded', () => {
    const navbarDiv = document.getElementById('navbar');
    /* Creamos la condicion de que si navbar existe entonces haremos una solicitud al navbar.html */
    if (navbarDiv) {
        fetch('navbar-prototype.html')
           //convertimos la respuesta en un archivo de texto
            .then(response => response.text())
            .then(data => {
                //luego modifivamos el contenido html de navbarDiv
                navbarDiv.innerHTML = data;
                
            })
            //ponemos el cathc en caso de que la solicitud no funcione
            .catch(error => console.error('Error cargando el navbar:', error));
    }
});
/* 
1. Solicitamos elementos del DOM a través del querySelectorAll: Seleccionamos todos los elementos input que tienen el atributo name="specific-doctor".

2. Como es más de un elemento, usamos forEach para hacer una función por cada elemento que pertenece al conjunto seleccionado por querySelectorAll: El forEach se usa para iterar sobre la NodeList de elementos y aplicarles una función a cada uno.

3. La función añade un addEventListener de change, y crea otra función que tendrá como parámetro el evento: La función escuchadora (addEventListener) se activará cada vez que haya un cambio en cualquiera de los elementos input seleccionados.

4. Esta función crea una variable llamada preferredDoctorSelect la cual tendrá el valor de un elemento del DOM con el id "preferred-doctor": Se define una variable que almacena una referencia al elemento select en el DOM con el id preferred-doctor.

5. Creamos una validación para saber si el valor del target es igual a "si". Si esto se cumple, la deshabilitación de preferredDoctorSelect se anulará, ya que será false. Pero si esto no es cierto, la deshabilitación será efectiva, ya que será true: El objetivo de esta validación es habilitar o deshabilitar el menú desplegable (select) según la opción seleccionada por el usuario en el input. Si el valor del input es "si", el select se habilita (disabled = false), de lo contrario, se deshabilita (disabled = true).
 */

document.querySelectorAll('input[name="specific-doctor"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        var preferredDoctorSelect = document.getElementById("preferred-doctor");
        if (event.target.value === "si") {
            preferredDoctorSelect.disabled = false;
        } else {
            preferredDoctorSelect.disabled = true;
        }
    });
});E