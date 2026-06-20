document.addEventListener('DOMContentLoaded', function() {
    let pdvs = [];
    let departamentos = [];
    let ciudades = [];
    let localidades = [];
    let jerarquiasN2 = [];
    let jerarquiasN2_2 = [];
    let canales = [];
    let alcances = [];
    let tipoActual = '';
    let map = null;
    let marker = null;

    // Cargar datos iniciales
    cargarPDVs();
    cargarListasDesplegables();

    // Event listeners
    document.getElementById('btnNuevoPDV').addEventListener('click', abrirModalNuevo);
    document.getElementById('btnGuardarPDV').addEventListener('click', guardarPDV);

    // Botones para agregar nuevos valores
    document.getElementById('btnNuevoDepartamento').addEventListener('click', () => abrirModalNuevoValor('departamento'));
    document.getElementById('btnNuevaCiudad').addEventListener('click', () => abrirModalNuevoValor('ciudad'));
    document.getElementById('btnNuevoCanal').addEventListener('click', () => abrirModalNuevoValor('canal'));
    document.getElementById('btnNuevoAlcance').addEventListener('click', () => abrirModalNuevoValor('alcance'));
    document.getElementById('btnNuevaLocalidad').addEventListener('click', () => abrirModalNuevoValor('localidad'));
    document.getElementById('btnNuevaJerarquiaN2').addEventListener('click', () => abrirModalNuevoValor('jerarquia_n2'));
    document.getElementById('btnNuevaJerarquiaN2_2').addEventListener('click', () => abrirModalNuevoValor('jerarquia_n2_2'));
    document.getElementById('btnAgregarNuevoValorPDV').addEventListener('click', agregarNuevoValorPDV);

    // Filtros
    document.getElementById('filtroDepartamento').addEventListener('change', filtrarPorDepartamento);
    document.getElementById('filtroCiudad').addEventListener('change', filtrarPorCiudad);
    document.getElementById('filtroLocalidad').addEventListener('change', filtrarPDVs);
    document.getElementById('filtroJerarquia').addEventListener('change', filtrarPorJerarquia);
    document.getElementById('filtroJerarquiaN2_2').addEventListener('change', filtrarPDVs);
    document.getElementById('filtroAlcance').addEventListener('change', filtrarPDVs);
    document.getElementById('filtroCanal').addEventListener('change', filtrarPDVs);
    let _buscarTimer = null;
    document.getElementById('buscarPDV').addEventListener('input', () => {
        clearTimeout(_buscarTimer);
        _buscarTimer = setTimeout(filtrarPDVs, 400);  // debounce: evita 1 fetch por tecla
    });

    // Eventos para coordenadas
    document.getElementById('latitud').addEventListener('change', actualizarMapaDesdeCoordenadas);
    document.getElementById('longitud').addEventListener('change', actualizarMapaDesdeCoordenadas);

    // Eventos para filtros en cascada en el modal
    document.getElementById('departamento').addEventListener('change', cargarCiudadesPorDepartamento);
    document.getElementById('jerarquia_n2').addEventListener('change', cargarJerarquiasN2_2PorN2);
    document.getElementById('jerarquia_n2_2').addEventListener('change', generarIdentificadorAutomatico);

    function construirQueryFiltros() {
        const params = new URLSearchParams();
        const val = id => (document.getElementById(id)?.value || '').trim();
        const dep  = val('filtroDepartamento');
        const ciu  = val('filtroCiudad');
        const loc  = val('filtroLocalidad');
        const jn2  = val('filtroJerarquia');
        const jn22 = val('filtroJerarquiaN2_2');
        const alc  = val('filtroAlcance');
        const can  = val('filtroCanal');
        const q    = val('buscarPDV');
        if (dep)  params.set('departamento', dep);
        if (ciu)  params.set('ciudad', ciu);
        if (loc)  params.set('localidad', loc);
        if (jn2)  params.set('jerarquia_n2', jn2);
        if (jn22) params.set('jerarquia_n2_2', jn22);
        if (alc)  params.set('alcance', alc);
        if (can)  params.set('canal', can);
        if (q)    params.set('q', q);
        return params.toString();
    }

    // Filtrado en el servidor: re-consulta /api/pdv con los filtros actuales,
    // así filtra sobre TODA la tabla y no solo sobre los 1000 ya cargados.
    function cargarPDVs() {
        const qs = construirQueryFiltros();
        fetch('/atencion-cliente/api/pdv' + (qs ? `?${qs}` : ''))
            .then(response => response.json())
            .then(data => {
                pdvs = Array.isArray(data) ? data : [];
                renderizarPDVs();
            })
            .catch(error => {
                console.error('Error cargando PDVs:', error);
                Swal.fire('Error', 'No se pudieron cargar los puntos de interés', 'error');
            });
    }

    function cargarListasDesplegables() {
        // Cargar departamentos
        fetch('/atencion-cliente/api/pdv/departamentos')
            .then(response => response.json())
            .then(data => {
                departamentos = data;
                actualizarSelect('filtroDepartamento', data);
                actualizarSelect('departamento', data);
            });

        // Cargar ciudades
        fetch('/atencion-cliente/api/pdv/ciudades')
            .then(response => response.json())
            .then(data => {
                ciudades = data;
                actualizarSelect('filtroCiudad', data);
                actualizarSelect('ciudad', data);
            });

        // Cargar localidades
        fetch('/atencion-cliente/api/pdv/localidades')
            .then(response => response.json())
            .then(data => {
                localidades = data;
                actualizarSelect('filtroLocalidad', data);
                actualizarSelect('localidad', data);
            });

        // Cargar jerarquías N2
        fetch('/atencion-cliente/api/pdv/jerarquias-n2')
            .then(response => response.json())
            .then(data => {
                jerarquiasN2 = data;
                actualizarSelect('filtroJerarquia', data);
                actualizarSelect('jerarquia_n2', data);
            });

        // Cargar jerarquías N2_2
        fetch('/atencion-cliente/api/pdv/jerarquias-n2-2')
            .then(response => response.json())
            .then(data => {
                jerarquiasN2_2 = data;
                actualizarSelect('jerarquia_n2_2', data);
                actualizarSelect('filtroJerarquiaN2_2', data);
            });

        // Cargar canales
        fetch('/atencion-cliente/api/pdv/canales')
            .then(response => response.json())
            .then(data => {
                canales = data;
                actualizarSelect('clasificacion_canal', data);
                actualizarSelect('filtroCanal', data);
            });

        // Cargar alcances
        fetch('/atencion-cliente/api/pdv/alcances')
            .then(response => response.json())
            .then(data => {
                alcances = data;
                actualizarSelect('nivel_alcance', data);
                actualizarSelect('filtroAlcance', data);
            });
    }

    function cargarCiudadesPorDepartamento() {
        const departamento = document.getElementById('departamento').value;
        if (!departamento) {
            actualizarSelect('ciudad', []);
            return;
        }
        fetch(`/atencion-cliente/api/pdv/ciudades-por-departamento/${encodeURIComponent(departamento)}`)
            .then(response => response.json())
            .then(data => {
                actualizarSelect('ciudad', data);
            })
            .catch(error => {
                console.error('Error cargando ciudades:', error);
                actualizarSelect('ciudad', []);
            });
    }

    function cargarJerarquiasN2_2PorN2() {
        const jerarquiaN2 = document.getElementById('jerarquia_n2').value;
        if (!jerarquiaN2) {
            actualizarSelect('jerarquia_n2_2', []);
            return;
        }
        fetch(`/atencion-cliente/api/pdv/jerarquias-n2_2-por-n2/${encodeURIComponent(jerarquiaN2)}`)
            .then(response => response.json())
            .then(data => {
                actualizarSelect('jerarquia_n2_2', data);
            })
            .catch(error => {
                console.error('Error cargando jerarquías N2_2:', error);
                actualizarSelect('jerarquia_n2_2', []);
            });
    }

    function generarIdentificadorAutomatico() {
        const jerarquiaN2_2 = document.getElementById('jerarquia_n2_2').value;
        const pdvId = document.getElementById('pdvId').value;
        
        // Solo generar si estamos creando nuevo (no editando) y hay una jerarquía seleccionada
        if (!pdvId && jerarquiaN2_2) {
            // Mostrar mensaje de carga
            document.getElementById('identificador').value = 'Generando...';
            fetch(`/atencion-cliente/api/pdv/next-identificador/${encodeURIComponent(jerarquiaN2_2)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('identificador').value = data.identificador;
                    } else {
                        document.getElementById('identificador').value = '';
                        Swal.fire('Error', 'No se pudo generar el identificador', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error generando identificador:', error);
                    document.getElementById('identificador').value = '';
                    Swal.fire('Error', 'Error al generar identificador', 'error');
                });
        } else if (pdvId) {
            // En modo edición, permitir editar el identificador
            document.getElementById('identificador').removeAttribute('readonly');
        }
    }

    function actualizarSelect(selectId, opciones) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const valorActual = select.value;
        const esFiltro = selectId.startsWith('filtro');
        
        // Guardar todas las opciones actuales para filtros
        if (esFiltro && opciones.length > 0) {
            const todasOpciones = ['', ...opciones];
            select.innerHTML = '';
            todasOpciones.forEach(opcion => {
                const option = document.createElement('option');
                option.value = opcion;
                option.textContent = opcion || 'Todos';
                select.appendChild(option);
            });
            // Restaurar el valor actual si existe en las nuevas opciones
            if (valorActual && todasOpciones.includes(valorActual)) {
                select.value = valorActual;
            }
        } else {
            // Para selects normales en el modal
            select.innerHTML = '<option value="">Seleccione...</option>';
            opciones.forEach(opcion => {
                const option = document.createElement('option');
                option.value = opcion;
                option.textContent = opcion;
                select.appendChild(option);
            });
            // Restaurar el valor actual si existe
            if (valorActual && opciones.includes(valorActual)) {
                select.value = valorActual;
            }
        }
    }

    function renderizarPDVs() {
        const tbody = document.getElementById('tbodyPDV');
        tbody.innerHTML = '';
        
        if (pdvs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="14" class="text-center">No hay puntos de interés</td></tr>';
            return;
        }

        pdvs.forEach(pdv => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pdv.id || '-'}</td>
                <td><strong>${pdv.identificador}</strong></td>
                <td>${pdv.punto_de_interes}</td>
                <td>${pdv.direccion || '-'}</td>
                <td>${pdv.departamento || '-'}</td>
                <td>${pdv.ciudad || '-'}</td>
                <td>${pdv.localidad || '-'}</td>
                <td>${pdv.jerarquia_nivel_2 || '-'}</td>
                <td>${pdv.jerarquia_nivel_2_2 || '-'}</td>
                <td>${pdv.clasificacion_de_canal || '-'}</td>
                <td>
                    <small>${pdv.latitud ? parseFloat(pdv.latitud).toFixed(6) : '-'}, ${pdv.longitud ? parseFloat(pdv.longitud).toFixed(6) : '-'}</small>
                </td>
                <td>${pdv.fecha_creado || '-'}</td>
                <td>${pdv.creado_por || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarPDV('${pdv.identificador}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarPDV('${pdv.identificador}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function filtrarPorDepartamento() {
        const departamento = document.getElementById('filtroDepartamento').value;
        const filtroCiudad = document.getElementById('filtroCiudad');
        // Resetear filtros dependientes
        filtroCiudad.value = '';
        document.getElementById('filtroJerarquia').value = '';
        // Filtrar PDVs
        filtrarPDVs();
    }

    function filtrarPorCiudad() {
        const ciudad = document.getElementById('filtroCiudad').value;
        // Resetar filtros dependientes
        document.getElementById('filtroJerarquia').value = '';
        // Filtrar PDVs
        filtrarPDVs();
    }

    function filtrarPorJerarquia() {
        const jerarquia = document.getElementById('filtroJerarquia').value;
        // Filtrar PDVs
        filtrarPDVs();
    }

    // El filtrado ahora ocurre en el servidor: simplemente re-consultamos.
    function filtrarPDVs() {
        cargarPDVs();
    }

    window.editarPDV = function(identificador) {
        fetch(`/atencion-cliente/api/pdv/${identificador}`)
            .then(response => response.json())
            .then(pdv => {
                document.getElementById('pdvId').value = pdv.id || '';
                document.getElementById('identificador').value = pdv.identificador;
                document.getElementById('punto_interes').value = pdv.punto_de_interes;
                document.getElementById('direccion').value = pdv.direccion || '';
                document.getElementById('departamento').value = pdv.departamento || '';
                document.getElementById('identificador').removeAttribute('readonly');
                
                // Cargar ciudades para este departamento
                if (pdv.departamento) {
                    fetch(`/atencion-cliente/api/pdv/ciudades-por-departamento/${encodeURIComponent(pdv.departamento)}`)
                        .then(response => response.json())
                        .then(ciudades => {
                            actualizarSelect('ciudad', ciudades);
                            document.getElementById('ciudad').value = pdv.ciudad || '';
                        });
                }
                
                document.getElementById('jerarquia_n2').value = pdv.jerarquia_nivel_2 || '';
                
                // Cargar jerarquías N2_2 para esta N2
                if (pdv.jerarquia_nivel_2) {
                    fetch(`/atencion-cliente/api/pdv/jerarquias-n2_2-por-n2/${encodeURIComponent(pdv.jerarquia_nivel_2)}`)
                        .then(response => response.json())
                        .then(jerarquias => {
                            actualizarSelect('jerarquia_n2_2', jerarquias);
                            document.getElementById('jerarquia_n2_2').value = pdv.jerarquia_nivel_2_2 || '';
                        });
                }
                
                actualizarSelect('clasificacion_canal', canales);
                document.getElementById('clasificacion_canal').value = pdv.clasificacion_de_canal || '';
                actualizarSelect('nivel_alcance', alcances);
                document.getElementById('nivel_alcance').value = pdv.nivel_de_alcance || '';
                actualizarSelect('localidad', localidades);
                document.getElementById('localidad').value = pdv.localidad || '';
                document.getElementById('latitud').value = pdv.latitud || '10.489724567310043';
                document.getElementById('longitud').value = pdv.longitud || '-66.82832787116511';
                document.getElementById('rif').value = pdv.rif || '';
                document.getElementById('radio').value = pdv.radio || '100';
                document.getElementById('modalPDVTitulo').textContent = 'Editar Punto de Interés';
                
                // Inicializar mapa después de llenar los datos
                const modal = new bootstrap.Modal(document.getElementById('modalPDV'));
                modal.show();
                // Esperar a que el modal se muestre completamente
                setTimeout(initMap, 300);
            })
            .catch(error => {
                console.error('Error obteniendo PDV:', error);
                Swal.fire('Error', 'No se pudo obtener el punto de interés', 'error');
            });
    };

    // Eventos para filtros en cascada en el modal
    document.getElementById('jerarquia_n2_2').addEventListener('change', function() {
        const pdvId = document.getElementById('pdvId').value;
        // Solo generar identificador automático si estamos creando nuevo PDV
        if (!pdvId) {
            generarIdentificadorAutomatico();
        }
    });

    window.eliminarPDV = function(identificador) {
        Swal.fire({
            title: '¿Está seguro?',
            text: 'Esta acción eliminará permanentemente el punto de interés',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/atencion-cliente/api/pdv/${identificador}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Éxito', 'Punto de interés eliminado correctamente', 'success');
                        cargarPDVs();
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo eliminar el punto de interés', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error eliminando PDV:', error);
                    Swal.fire('Error', 'Error al eliminar el punto de interés', 'error');
                });
            }
        });
    };

    function abrirModalNuevo() {
        document.getElementById('formPDV').reset();
        document.getElementById('pdvId').value = '';
        document.getElementById('identificador').value = 'Generando...';
        document.getElementById('latitud').value = '10.489724567310043';
        document.getElementById('longitud').value = '-66.82832787116511';
        document.getElementById('radio').value = '100';
        document.getElementById('modalPDVTitulo').textContent = 'Nuevo Punto de Interés';
        
        // Resetear selects y limpiar identificador
        actualizarSelect('departamento', departamentos);
        actualizarSelect('ciudad', []);
        actualizarSelect('clasificacion_canal', canales);
        actualizarSelect('nivel_alcance', alcances);
        actualizarSelect('localidad', localidades);
        actualizarSelect('jerarquia_n2', jerarquiasN2);
        actualizarSelect('jerarquia_n2_2', []);
        document.getElementById('identificador').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalPDV'));
        modal.show();
        setTimeout(initMap, 300);
    }

    function initMap() {
        // Obtener valores de latitud y longitud del formulario
        const lat = parseFloat(document.getElementById('latitud').value) || 10.489724567310043;
        const lng = parseFloat(document.getElementById('longitud').value) || -66.82832787116511;
        
        // Si el mapa ya existe, removerlo
        if (map) {
            map.remove();
        }
        
        // Inicializar mapa
        map = L.map('map').setView([lat, lng], 13);
        
        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Añadir marcador inicial
        marker = L.marker([lat, lng], {
            draggable: true
        }).addTo(map);
        
        // Actualizar coordenadas al arrastrar el marcador
        marker.on('dragend', function(event) {
            const position = marker.getLatLng();
            document.getElementById('latitud').value = position.lat.toFixed(10);
            document.getElementById('longitud').value = position.lng.toFixed(10);
        });
        
        // Actualizar coordenadas al hacer clic en el mapa
        map.on('click', function(event) {
            marker.setLatLng(event.latlng);
            document.getElementById('latitud').value = event.latlng.lat.toFixed(10);
            document.getElementById('longitud').value = event.latlng.lng.toFixed(10);
        });
    }

    function actualizarMapaDesdeCoordenadas() {
        if (!map || !marker) return;
        
        const lat = parseFloat(document.getElementById('latitud').value);
        const lng = parseFloat(document.getElementById('longitud').value);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            marker.setLatLng([lat, lng]);
            map.setView([lat, lng], map.getZoom());
        }
    }

    function guardarPDV() {
        const pdvId = document.getElementById('pdvId').value;
        const identificador = document.getElementById('identificador').value.trim();
        const punto_interes = document.getElementById('punto_interes').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const latitud = document.getElementById('latitud').value.trim();
        const longitud = document.getElementById('longitud').value.trim();
        
        // Validaciones básicas
        if (!identificador) {
            Swal.fire('Error', 'El identificador es requerido', 'error');
            return;
        }
        if (!punto_interes) {
            Swal.fire('Error', 'El nombre del punto es requerido', 'error');
            return;
        }
        if (!direccion) {
            Swal.fire('Error', 'La dirección es requerida', 'error');
            return;
        }
        if (!latitud || !longitud) {
            Swal.fire('Error', 'Las coordenadas son requeridas', 'error');
            return;
        }
        
        const data = {
            identificador: identificador,
            punto_de_interes: punto_interes,
            direccion: direccion,
            departamento: document.getElementById('departamento').value,
            ciudad: document.getElementById('ciudad').value,
            jerarquia_nivel_2: document.getElementById('jerarquia_n2').value,
            jerarquia_nivel_2_2: document.getElementById('jerarquia_n2_2').value,
            latitud: latitud,
            longitud: longitud,
            clasificacion_de_canal: document.getElementById('clasificacion_canal').value,
            nivel_de_alcance: document.getElementById('nivel_alcance').value,
            localidad: document.getElementById('localidad').value,
            rif: document.getElementById('rif').value,
            radio: document.getElementById('radio').value || 100
        };
        
        const url = pdvId ? `/atencion-cliente/api/pdv/${identificador}` : '/atencion-cliente/api/pdv';
        const method = pdvId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                Swal.fire('Éxito', result.message, 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalPDV'));
                modal.hide();
                cargarPDVs();
            } else {
                // Si hay un punto existente cercano, mostrar opción para editarlo
                if (result.punto_existente) {
                    Swal.fire({
                        title: 'Punto de interés cercano encontrado',
                        html: result.message,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Editar punto existente',
                        cancelButtonText: 'Cancelar',
                        showDenyButton: true,
                        denyButtonText: 'Crear de todos modos'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Editar el punto existente
                            window.editarPDV(result.punto_existente.identificador);
                        } else if (result.isDenied) {
                            // Crear de todos modos (requiere implementación adicional)
                            crearPDVFuerza(data, url, method);
                        }
                    });
                } else {
                    Swal.fire('Error', result.message || 'Error al guardar el punto de interés', 'error');
                }
            }
        })
        .catch(error => {
            console.error('Error guardando PDV:', error);
            Swal.fire('Error', 'Error al guardar el punto de interés', 'error');
        });
    }

    function crearPDVFuerza(data, url, method) {
        // Función para forzar la creación ignorando la advertencia de coordenadas cercanas
        data.ignorar_duplicado = true;
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                Swal.fire('Éxito', 'Punto de interés creado a pesar de la advertencia', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalPDV'));
                modal.hide();
                cargarPDVs();
            } else {
                Swal.fire('Error', result.message || 'Error al guardar el punto de interés', 'error');
            }
        })
        .catch(error => {
            console.error('Error forzando creación de PDV:', error);
            Swal.fire('Error', 'Error al guardar el punto de interés', 'error');
        });
    }

    function abrirModalNuevoValor(tipo) {
        tipoActual = tipo;
        let titulo = '';
        let label = '';
        
        switch(tipo) {
            case 'departamento':
                titulo = 'Nuevo Departamento';
                label = 'Departamento';
                break;
            case 'ciudad':
                titulo = 'Nueva Ciudad';
                label = 'Ciudad';
                break;
            case 'canal':
                titulo = 'Nueva Clasificación de Canal';
                label = 'Clasificación de Canal';
                break;
            case 'alcance':
                titulo = 'Nuevo Nivel de Alcance';
                label = 'Nivel de Alcance';
                break;
            case 'localidad':
                titulo = 'Nueva Localidad';
                label = 'Localidad';
                break;
            case 'jerarquia_n2':
                titulo = 'Nueva Jerarquía Nivel 2';
                label = 'Jerarquía Nivel 2';
                break;
            case 'jerarquia_n2_2':
                titulo = 'Nueva Jerarquía Nivel 2_2';
                label = 'Jerarquía Nivel 2_2';
                break;
        }
        
        document.getElementById('modalNuevoValorPDVTitulo').textContent = titulo;
        document.getElementById('labelNuevoValorPDV').textContent = label;
        document.getElementById('nuevoValorPDV').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoValorPDV'));
        modal.show();
    }

    function agregarNuevoValorPDV() {
        const valor = document.getElementById('nuevoValorPDV').value.trim();
        if (!valor) {
            Swal.fire('Error', 'El valor es requerido', 'error');
            return;
        }
 
        // Configuración unificada para la creación inline con persistencia en base de datos.
        const config = {
            departamento:   { selectId: 'departamento',   array: departamentos,   url: '/atencion-cliente/api/pdv/departamentos', body: { valor: valor } },
            ciudad:         { selectId: 'ciudad',         array: ciudades,         url: '/atencion-cliente/api/pdv/ciudades',       body: { valor: valor, departamento: document.getElementById('departamento').value } },
            canal:          { selectId: 'clasificacion_canal', array: canales,    url: '/atencion-cliente/api/pdv/canales',        body: { valor: valor } },
            alcance:        { selectId: 'nivel_alcance',  array: alcances,        url: '/atencion-cliente/api/pdv/alcances',       body: { valor: valor } },
            jerarquia_n2:   { selectId: 'jerarquia_n2',   array: jerarquiasN2,   url: '/atencion-cliente/api/pdv/jerarquias-n2',  body: { valor: valor } },
            jerarquia_n2_2: { selectId: 'jerarquia_n2_2', array: jerarquiasN2_2, url: '/atencion-cliente/api/pdv/jerarquias-n2-2', body: { valor: valor, jerarquia_n2: document.getElementById('jerarquia_n2').value } },
            localidad:      { selectId: 'localidad',      array: localidades,      url: '/atencion-cliente/api/pdv/localidades',    body: { valor: valor } }
        };
 
        const cfg = config[tipoActual];
        if (!cfg) {
            Swal.fire('Error', 'Tipo de valor no válido', 'error');
            return;
        }
 
        // Validar dependencias para cascadas
        if (tipoActual === 'ciudad' && !cfg.body.departamento) {
            Swal.fire('Atención', 'Debe seleccionar un Departamento antes de agregar una Ciudad', 'warning');
            return;
        }
        if (tipoActual === 'jerarquia_n2_2' && !cfg.body.jerarquia_n2) {
            Swal.fire('Atención', 'Debe seleccionar una Jerarquía Nivel 2 antes de agregar una Jerarquía Nivel 2_2', 'warning');
            return;
        }
 
        Swal.fire({
            title: 'Guardando...',
            text: 'Registrando el nuevo valor en la base de datos',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
 
        fetch(cfg.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cfg.body)
        })
        .then(response => response.json())
        .then(result => {
            Swal.close();
            if (result.success) {
                bootstrap.Modal.getInstance(document.getElementById('modalNuevoValorPDV')).hide();
                
                // Agregar al array en memoria y ordenar
                if (!cfg.array.includes(valor)) {
                    cfg.array.push(valor);
                    cfg.array.sort();
                }
                
                // Actualizar el selector HTML correspondiente
                actualizarSelect(cfg.selectId, cfg.array);
                document.getElementById(cfg.selectId).value = valor;
                
                // Si agregamos una jerarquía de nivel 2_2, actualizar identificador
                if (tipoActual === 'jerarquia_n2_2') {
                    generarIdentificadorAutomatico();
                }
                
                Swal.fire('Éxito', result.message || 'Valor registrado correctamente', 'success');
            } else {
                Swal.fire('Error', result.message || 'No se pudo registrar el valor', 'error');
            }
        })
        .catch(error => {
            Swal.close();
            console.error('Error guardando valor inline:', error);
            Swal.fire('Error', 'Error al guardar el valor en el servidor', 'error');
        });
    }
});