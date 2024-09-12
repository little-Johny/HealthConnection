function callNavbar() {
    const navbarDiv = document.getElementById('navbar');
    if (navbarDiv) {
        fetch('navbar-prototype.html')
            .then(response => response.text())
            .then(data => {
                navbarDiv.innerHTML = data;
            })
            .catch(error => console.error('Error cargando el navbar:', error));
    }
}
callNavbar();

/* function PreLoadSection() {
    document.addEventListener('DOMContentLoaded', () => {
        const currentPath = window.location.pathname;
        let pageStatus;  // Declaramos la variable

        if (currentPath === 'historialSolicitudes.html') {
            showSection('citas');
        } else if (currentPath === '/ConsultaRegistros.html') {
            showSection('usuarios');
        } else {
            pageStatus = 'unknown';
        }

        console.log(`Current page status: ${pageStatus}`);
    });
}

PreLoadSection(); */

document.querySelectorAll('input[name="specific-doctor"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        var preferredDoctorSelect = document.getElementById("preferred-doctor");
        if (event.target.value === "si") {
            preferredDoctorSelect.disabled = false;
        } else {
            preferredDoctorSelect.disabled = true;
        }
    });
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    const buttons = document.querySelectorAll('.nav-menu button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.nav-menu button[onclick="showSection('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function redirectToPage(url) {
    window.location.href = url;
}

const buttons = document.querySelectorAll('#cita-edit');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        redirectToPage('./modifyCitas.html');
    });
});


// Abrir el menú
/* document.getElementById("menuButton").onclick = function() {
    document.getElementById("sideMenu").style.width = "250px";
}; */

// Cerrar el menú
/* document.querySelector(".closeBtn").onclick = function() {
document.getElementById("sideMenu").style.width = "0";
}; */