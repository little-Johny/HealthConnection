document.addEventListener('DOMContentLoaded', () => {
    function callingLayouts(targetId, source) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            fetch(source)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(data => {
                    targetElement.innerHTML = data;
                })
                .catch(error => {
                    console.error('No podemos encontrar tu layout.', error);
                });
        }
    }

    callingLayouts('navbar', '../src/views/layouts/navbar.html');
    callingLayouts('footer', '../src/views/layouts/footer.html');
});
