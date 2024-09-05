//Funcion para llamar el navbar :
function callNavbar(){
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
}


function ValidationOfPath(){
    let path = window.location.pathname;

    if(path === '/index.html'){   
        console.log('Estas en el index');
    }else if(path === '/ConsultaRegistros.html'){  
        console.log('Estas en la consulta de los registros');
    }


}

ValidationOfPath(window.location.pathname);

// Función que identifica en qué sección se encuentra el usuario
function getCurrentSection() {
    const pathname = window.location.pathname;

    if (pathname.includes('index.html')) {
        return 'home';
    } else if (pathname.includes('about')) {
        return 'about';
    } else if (pathname.includes('contact')) {
        return 'contact';
    }
    // Agrega más condiciones según tus secciones
    return 'unknown';
}

// Función que activa la lógica específica de cada sección
function initializeSectionLogic() {
    const section = getCurrentSection();

    switch (section) {
        case 'home':
            initializeHome();
            break;
        case 'about':
            initializeAbout();
            break;
        case 'contact':
            initializeContact();
            break;
        default:
            console.warn('Sección no identificada');
            break;
    }
}

// Funciones específicas para cada sección
function initializeHome() {
    // Lógica específica para la página de inicio
    console.log('Inicializando la lógica de la página de inicio');
}

function initializeAbout() {
    // Lógica específica para la página de "Acerca de"
    console.log('Inicializando la lógica de la página Acerca de');
}

function initializeContact() {
    // Lógica específica para la página de contacto
    console.log('Inicializando la lógica de la página de contacto');
}

// Ejecutar la lógica en función de la sección actual
document.addEventListener('DOMContentLoaded', initializeSectionLogic);
