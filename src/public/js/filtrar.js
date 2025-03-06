function cambiarCantidad() {

    const seleccion = document.getElementById("cantidadPorPagina").value;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("limit", seleccion); // Cambia el valor de limit en la URL
    urlParams.set("page", 1); // Reinicia a la página 1
    window.location.search = urlParams.toString();
    }


    document.getElementById("resetFiltros").addEventListener("click", function () {
        window.location.href = "/buscar"; // Redirige a la versión sin filtros
    });

