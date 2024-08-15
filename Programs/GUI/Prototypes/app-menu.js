document.addEventListener('DOMContentLoaded', function() {
    const opcionesBtn = document.getElementById('opciones-btn');

    opcionesBtn.addEventListener('click', function() {
        const isExpanded = opcionesBtn.getAttribute('aria-expanded') === 'true' || false;
        opcionesBtn.setAttribute('aria-expanded', !isExpanded);
        console.log(`Botón de opciones expandido: ${!isExpanded}`);
    });
});
