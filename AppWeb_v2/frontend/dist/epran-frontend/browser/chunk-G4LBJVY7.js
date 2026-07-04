import {
  environment
} from "./chunk-NRWDSKQC.js";
import {
  HttpClient,
  HttpParams,
  __spreadValues,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-QB3BCYT5.js";

// src/app/core/services/api.service.ts
var ApiService = class _ApiService {
  constructor(http) {
    this.http = http;
    this.base = environment.apiUrl;
  }
  params(obj) {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(obj)) {
      if (v !== void 0 && v !== null)
        p = p.set(k, String(v));
    }
    return p;
  }
  // --- USUARIOS ---
  getUsers() {
    return this.http.get(`${this.base}/api/users/`);
  }
  createUser(data) {
    return this.http.post(`${this.base}/api/users/`, data);
  }
  updateUser(id, data) {
    return this.http.patch(`${this.base}/api/users/${id}`, data);
  }
  deleteUser(id) {
    return this.http.delete(`${this.base}/api/users/${id}`);
  }
  getAnalysts() {
    return this.http.get(`${this.base}/api/users/analysts`);
  }
  getSupervisors() {
    return this.http.get(`${this.base}/api/users/supervisors`);
  }
  getModulos() {
    return this.http.get(`${this.base}/api/modulos`);
  }
  getUserPermissions(userId) {
    return this.http.get(`${this.base}/api/users/${userId}/permissions`);
  }
  updateUserPermissions(userId, permissions) {
    return this.http.post(`${this.base}/api/users/${userId}/permissions`, { permissions });
  }
  // --- MERCADERISTAS ---
  getMercaderistas() {
    return this.http.get(`${this.base}/api/merchandisers/`);
  }
  getMercaderista(id) {
    return this.http.get(`${this.base}/api/merchandisers/${id}`);
  }
  createMercaderista(data) {
    return this.http.post(`${this.base}/api/merchandisers/`, data);
  }
  updateMercaderista(id, data) {
    return this.http.patch(`${this.base}/api/merchandisers/${id}`, data);
  }
  deleteMercaderista(id) {
    return this.http.delete(`${this.base}/api/merchandisers/${id}`);
  }
  uploadPhoto(formData) {
    return this.http.post(`${this.base}/api/merchandisers/upload-photo`, formData);
  }
  getActivePoints(cedula) {
    return this.http.get(`${this.base}/api/merchandisers/${cedula}/active-points`);
  }
  getFotoMetadatos(fotoId) {
    return this.http.get(`${this.base}/api/merchandisers/foto/${fotoId}/metadatos`);
  }
  // --- PUNTOS DE INTERÉS ---
  getPoints(opts = {}) {
    return this.http.get(`${this.base}/api/points/`, { params: this.params(opts) });
  }
  createPoint(data) {
    return this.http.post(`${this.base}/api/points/`, data);
  }
  updatePoint(id, data) {
    return this.http.put(`${this.base}/api/points/${id}`, data);
  }
  getRegions() {
    return this.http.get(`${this.base}/api/points/regions/list`);
  }
  getCities(departamento) {
    return this.http.get(`${this.base}/api/points/cities/list`, { params: this.params({ departamento }) });
  }
  getChains() {
    return this.http.get(`${this.base}/api/points/chains/list`);
  }
  deletePoint(id) {
    return this.http.delete(`${this.base}/api/points/${id}`);
  }
  getJerarquiaN2() {
    return this.http.get(`${this.base}/api/points/jerarquia_n2/list`);
  }
  getJerarquiaN2_2() {
    return this.http.get(`${this.base}/api/points/jerarquia_n2_2/list`);
  }
  getNivelesAlcance() {
    return this.http.get(`${this.base}/api/points/nivel_alcance/list`);
  }
  getPointsCount(opts = {}) {
    return this.http.get(`${this.base}/api/points/count`, { params: this.params(opts) });
  }
  getPointPhotos(pointId, estado) {
    return this.http.get(`${this.base}/api/points/${pointId}/photos`, { params: this.params({ estado }) });
  }
  // --- CATÁLOGOS PDV ---
  // catalog ∈ 'tipo-negocio' | 'subtipo-negocio' | 'alcance' | 'canal-venta' | 'departamentos'
  listCatalog(catalog, activo) {
    return this.http.get(`${this.base}/api/catalogos/${catalog}/`, { params: this.params({ activo }) });
  }
  createCatalogItem(catalog, data) {
    return this.http.post(`${this.base}/api/catalogos/${catalog}/`, data);
  }
  updateCatalogItem(catalog, id, data) {
    return this.http.put(`${this.base}/api/catalogos/${catalog}/${id}`, data);
  }
  deleteCatalogItem(catalog, id, force = false) {
    return this.http.delete(`${this.base}/api/catalogos/${catalog}/${id}`, { params: this.params({ force }) });
  }
  // Ciudades — endpoints específicos
  listCiudades(opts = {}) {
    return this.http.get(`${this.base}/api/catalogos/ciudades/`, { params: this.params(opts) });
  }
  createCiudad(data) {
    return this.http.post(`${this.base}/api/catalogos/ciudades/`, data);
  }
  updateCiudad(id, data) {
    return this.http.put(`${this.base}/api/catalogos/ciudades/${id}`, data);
  }
  deleteCiudad(id, force = false) {
    return this.http.delete(`${this.base}/api/catalogos/ciudades/${id}`, { params: this.params({ force }) });
  }
  // --- RUTAS ---
  getRoutes(activa) {
    return this.http.get(`${this.base}/api/routes/`, { params: this.params({ activa }) });
  }
  createRoute(data) {
    return this.http.post(`${this.base}/api/routes/`, data);
  }
  updateRoute(id, data) {
    return this.http.patch(`${this.base}/api/routes/${id}`, data);
  }
  deleteRoute(id) {
    return this.http.delete(`${this.base}/api/routes/${id}`);
  }
  duplicateRoute(id) {
    return this.http.post(`${this.base}/api/routes/${id}/duplicate`, {});
  }
  getRoutePoints(routeId, includeInactive = false) {
    return this.http.get(`${this.base}/api/routes/${routeId}/points`, { params: this.params({ include_inactive: includeInactive }) });
  }
  addPointToRoute(routeId, data) {
    return this.http.post(`${this.base}/api/routes/${routeId}/add-point`, data);
  }
  removePointFromRoute(programacionId) {
    return this.http.delete(`${this.base}/api/routes/points/${programacionId}`);
  }
  setPointActive(programacionId, activa) {
    return this.http.patch(`${this.base}/api/routes/points/${programacionId}/active`, {}, { params: this.params({ activa }) });
  }
  bulkApply(routeId, body) {
    return this.http.post(`${this.base}/api/routes/${routeId}/bulk-apply`, body);
  }
  scheduleChange(routeId, data) {
    return this.http.post(`${this.base}/api/routes/${routeId}/schedule-change`, data);
  }
  getFutureChanges(routeId) {
    return this.http.get(`${this.base}/api/routes/${routeId}/future-changes`);
  }
  getActivatedRoutes() {
    return this.http.get(`${this.base}/api/routes/activated/today`);
  }
  getRouteOptions() {
    return this.http.get(`${this.base}/api/routes/options`);
  }
  getNextRouteNumber(tipo) {
    return this.http.get(`${this.base}/api/routes/next-number`, { params: { tipo } });
  }
  // --- CLIENTES ---
  getClients() {
    return this.http.get(`${this.base}/api/clients/`);
  }
  createClient(data) {
    return this.http.post(`${this.base}/api/clients/`, data);
  }
  updateClient(id, data) {
    return this.http.put(`${this.base}/api/clients/${id}`, data);
  }
  deleteClient(id) {
    return this.http.delete(`${this.base}/api/clients/${id}`);
  }
  // --- ANALISTAS ---
  getAnalystsList() {
    return this.http.get(`${this.base}/api/analysts/`);
  }
  createAnalyst(data) {
    return this.http.post(`${this.base}/api/analysts/`, data);
  }
  updateAnalyst(id, data) {
    return this.http.put(`${this.base}/api/analysts/${id}`, data);
  }
  deleteAnalyst(id) {
    return this.http.delete(`${this.base}/api/analysts/${id}`);
  }
  // Asignaciones de analista (Fase 2)
  getAnalystsWithAssignments() {
    return this.http.get(`${this.base}/api/analysts/with-assignments`);
  }
  getAnalystRoutes(id) {
    return this.http.get(`${this.base}/api/analysts/${id}/routes`);
  }
  syncAnalystRoutes(id, ids) {
    return this.http.post(`${this.base}/api/analysts/${id}/sync-routes`, { ids });
  }
  getAnalystClients(id) {
    return this.http.get(`${this.base}/api/analysts/${id}/clients`);
  }
  getAnalystRouteClients(id) {
    return this.http.get(`${this.base}/api/analysts/${id}/route-clients`);
  }
  syncAnalystClients(id, ids) {
    return this.http.post(`${this.base}/api/analysts/${id}/sync-clients`, { ids });
  }
  // --- SUPERVISORES (asignaciones, tablas dedicadas) ---
  createSupervisor(data) {
    return this.http.post(`${this.base}/api/supervisores/`, data);
  }
  updateSupervisor(id, data) {
    return this.http.put(`${this.base}/api/supervisores/${id}`, data);
  }
  deleteSupervisor(id) {
    return this.http.delete(`${this.base}/api/supervisores/${id}`);
  }
  getSupervisorsWithAssignments() {
    return this.http.get(`${this.base}/api/supervisores/with-assignments`);
  }
  getSupervisorRoutes(id) {
    return this.http.get(`${this.base}/api/supervisores/${id}/routes`);
  }
  syncSupervisorRoutes(id, ids) {
    return this.http.post(`${this.base}/api/supervisores/${id}/sync-routes`, { ids });
  }
  getSupervisorClients(id) {
    return this.http.get(`${this.base}/api/supervisores/${id}/clients`);
  }
  getSupervisorRouteClients(id) {
    return this.http.get(`${this.base}/api/supervisores/${id}/route-clients`);
  }
  syncSupervisorClients(id, ids) {
    return this.http.post(`${this.base}/api/supervisores/${id}/sync-clients`, { ids });
  }
  // --- VISITAS ---
  getVisits(opts = {}) {
    return this.http.get(`${this.base}/api/visits/`, { params: this.params(opts) });
  }
  createVisit(data) {
    return this.http.post(`${this.base}/api/visits/`, data);
  }
  updateVisit(id, data) {
    return this.http.patch(`${this.base}/api/visits/${id}`, data);
  }
  getPendingVisits() {
    return this.http.get(`${this.base}/api/visits/pending`);
  }
  getVisitPhotos(visitId, tipo) {
    return this.http.get(`${this.base}/api/visits/${visitId}/photos`, { params: this.params({ tipo }) });
  }
  approvePhotos(fotoIds) {
    return this.http.post(`${this.base}/api/visits/approve-photos`, { foto_ids: fotoIds });
  }
  rejectPhoto(fotoId, motivo, razonesIds) {
    return this.http.post(`${this.base}/api/visits/reject-photo`, { foto_id: fotoId, motivo, razones_ids: razonesIds });
  }
  savePhotoDecisions(decisions) {
    return this.http.post(`${this.base}/api/visits/save-decisions`, { decisions });
  }
  // --- REVISIÓN / CENTRO DE MANDO (re-aplicado tras restauración) ---
  getReviewList(opts = {}) {
    return this.http.get(`${this.base}/api/visits/review-list`, { params: this.params(opts) });
  }
  markVisitReviewed(visitId, revisada = true) {
    return this.http.post(`${this.base}/api/visits/${visitId}/mark-reviewed`, null, { params: this.params({ revisada }) });
  }
  getRejectReasons() {
    return this.http.get(`${this.base}/api/visits/reject-reasons`);
  }
  getCentroMandoClientes() {
    return this.http.get(`${this.base}/api/centro-mando/clientes`);
  }
  getCentroMandoResumenDia(opts = {}) {
    return this.http.get(`${this.base}/api/centro-mando/resumen-dia`, { params: this.params(opts) });
  }
  getCentroMandoActivaciones(opts = {}) {
    return this.http.get(`${this.base}/api/centro-mando/activaciones`, { params: this.params(opts) });
  }
  getMercRutaPdvs(idRuta) {
    return this.http.get(`${this.base}/api/merc/ruta/${idRuta}/pdvs`);
  }
  deleteMercFoto(fotoId) {
    return this.http.delete(`${this.base}/api/merc/foto/${fotoId}`);
  }
  // --- DATA / BALANCES ---
  getVisitsWithBalances(opts = {}) {
    return this.http.get(`${this.base}/api/visits/with-balances`, { params: this.params(opts) });
  }
  getVisitBalances(visitId) {
    return this.http.get(`${this.base}/api/visits/${visitId}/balances`);
  }
  saveBalances(data) {
    return this.http.post(`${this.base}/api/visits/update-balances`, data);
  }
  // --- CLIENT DATA ---
  getClientDataFilters() {
    return this.http.get(`${this.base}/api/client-data/filters`);
  }
  getClientDataBalances(filters) {
    return this.http.get(`${this.base}/api/client-data/balances`, { params: this.params(filters) });
  }
  // --- REPORTE DE EXCEL ---
  downloadExcelReport(startDate, endDate) {
    const params = this.params({ fecha_inicio: startDate, fecha_fin: endDate });
    return this.http.get(`${this.base}/api/reporteria/excel`, { params, responseType: "blob" });
  }
  // --- REPORTERÍA ---
  getReportSummary(opts = {}) {
    return this.http.get(`${this.base}/api/reports/summary`, { params: this.params(opts) });
  }
  getChartData(tipo, opts = {}) {
    return this.http.get(`${this.base}/api/reports/chart-data`, { params: this.params(__spreadValues({ tipo }, opts)) });
  }
  getActivatedRoutesReport() {
    return this.http.get(`${this.base}/api/reports/activated-routes`);
  }
  // --- CHAT ---
  getChatInbox(clienteId) {
    return this.http.get(`${this.base}/api/chat/inbox`, { params: this.params({ cliente_id: clienteId }) });
  }
  searchChatVisits(q) {
    return this.http.get(`${this.base}/api/chat/search-visits`, { params: this.params({ q }) });
  }
  getMessagesByPhoto(fotoId) {
    return this.http.get(`${this.base}/api/chat/messages/${fotoId}`);
  }
  getMessagesByVisit(visitId) {
    return this.http.get(`${this.base}/api/chat/visit/${visitId}/messages`);
  }
  sendMessage(data) {
    return this.http.post(`${this.base}/api/chat/send`, data);
  }
  // --- CHAT — CONVERSACIONES (chats no atados a visita) ---
  getChatRecipients(clienteId) {
    return this.http.get(`${this.base}/api/chat/recipients`, { params: this.params({ cliente_id: clienteId }) });
  }
  listConversations(clienteId) {
    return this.http.get(`${this.base}/api/chat/conversations`, { params: this.params({ cliente_id: clienteId }) });
  }
  createConversation(body) {
    return this.http.post(`${this.base}/api/chat/conversations`, body);
  }
  getConversation(convId) {
    return this.http.get(`${this.base}/api/chat/conversations/${convId}`);
  }
  getConversationMessages(convId) {
    return this.http.get(`${this.base}/api/chat/conversations/${convId}/messages`);
  }
  sendConversationMessage(convId, mensaje) {
    return this.http.post(`${this.base}/api/chat/conversations/${convId}/messages`, { mensaje });
  }
  // --- NOTIFICACIONES ---
  getRejectionNotifications(cedula) {
    return this.http.get(`${this.base}/api/notifications/rejection`, { params: this.params({ cedula }) });
  }
  markNotifRead(id) {
    return this.http.post(`${this.base}/api/notifications/mark-read/${id}`, {});
  }
  markAllNotifsRead(cedula) {
    return this.http.post(`${this.base}/api/notifications/mark-all-read`, {}, { params: this.params({ cedula }) });
  }
  // --- SUPERVISOR ---
  getRejectedPhotos() {
    return this.http.get(`${this.base}/api/supervisor/rejected-photos`);
  }
  replacePhoto(formData) {
    return this.http.post(`${this.base}/api/supervisor/replace-photo`, formData);
  }
  // --- MERCADERISTA RUTAS ---
  getMercaderistasConRutas() {
    return this.http.get(`${this.base}/api/mercaderista-rutas/`);
  }
  getMercaderistaRoutes(mercaderistaId) {
    return this.http.get(`${this.base}/api/mercaderista-rutas/mercaderista/${mercaderistaId}/routes`);
  }
  syncMercaderistaRoutes(mercaderistaId, assignments) {
    return this.http.post(`${this.base}/api/mercaderista-rutas/mercaderista/${mercaderistaId}/sync-routes`, assignments);
  }
  assignRoute(mercaderistaId, rutaId) {
    return this.http.post(`${this.base}/api/mercaderista-rutas/assign`, null, { params: this.params({ mercaderista_id: mercaderistaId, ruta_id: rutaId }) });
  }
  // --- ADMIN SESIONES ---
  getActiveSessions() {
    return this.http.get(`${this.base}/api/admin/sessions/active`);
  }
  killSession(id) {
    return this.http.post(`${this.base}/api/admin/sessions/kill/${id}`, {});
  }
  killUserSessions(userId) {
    return this.http.post(`${this.base}/api/admin/sessions/kill-user/${userId}`, {});
  }
  invalidateSession(id) {
    return this.http.post(`${this.base}/api/admin/sessions/invalidate`, null, { params: this.params({ session_id: id }) });
  }
  cleanupSessions() {
    return this.http.post(`${this.base}/api/admin/sessions/cleanup`, {});
  }
  getSessionHistory(userId) {
    return this.http.get(`${this.base}/api/admin/sessions/history/${userId}`);
  }
  // --- AUDITORÍA ---
  getAuditLogs(opts = {}) {
    return this.http.get(`${this.base}/api/audit/logs`, { params: this.params(opts) });
  }
  getAuditEntityTypes() {
    return this.http.get(`${this.base}/api/audit/entity-types`);
  }
  // --- PRODUCTOS / PDV / SOLICITUDES ---
  // === PRODUCTOS - Con paginación y búsqueda ===
  getProductos(opts = {}) {
    return this.http.get(`${this.base}/api/productos-catalogos/productos`, { params: this.params(opts) });
  }
  getProducto(id) {
    return this.http.get(`${this.base}/api/productos-catalogos/productos/${id}`);
  }
  createProducto(data) {
    return this.http.post(`${this.base}/api/productos-catalogos/productos`, data);
  }
  updateProducto(id, data) {
    return this.http.put(`${this.base}/api/productos-catalogos/productos/${id}`, data);
  }
  deleteProducto(id) {
    return this.http.delete(`${this.base}/api/productos-catalogos/productos/${id}`);
  }
  // catálogos para dropdowns del formulario de producto
  getCatMarcas(idProductora) {
    return this.http.get(`${this.base}/api/productos-catalogos/marcas`, { params: idProductora ? { id_productora: idProductora } : {} });
  }
  getCatProductoras() {
    return this.http.get(`${this.base}/api/productos-catalogos/productoras`);
  }
  getCatPresentaciones() {
    return this.http.get(`${this.base}/api/productos-catalogos/presentaciones`);
  }
  getCatDepartamentos() {
    return this.http.get(`${this.base}/api/productos-catalogos/departamentos`);
  }
  getCatTamanos() {
    return this.http.get(`${this.base}/api/productos-catalogos/tamanos`);
  }
  // ABM de catálogos (crear/borrar) — categorías/subcategorías ya tienen sus métodos arriba
  createCatDepartamento(data) {
    return this.http.post(`${this.base}/api/productos-catalogos/departamentos`, data);
  }
  updateCatDepartamento(id, data) {
    return this.http.put(`${this.base}/api/productos-catalogos/departamentos/${id}`, data);
  }
  deleteCatDepartamento(id) {
    return this.http.delete(`${this.base}/api/productos-catalogos/departamentos/${id}`);
  }
  createCatMarca(data) {
    return this.http.post(`${this.base}/api/productos-catalogos/marcas`, data);
  }
  updateCatMarca(id, data) {
    return this.http.put(`${this.base}/api/productos-catalogos/marcas/${id}`, data);
  }
  deleteCatMarca(id) {
    return this.http.delete(`${this.base}/api/productos-catalogos/marcas/${id}`);
  }
  createCatPresentacion(data) {
    return this.http.post(`${this.base}/api/productos-catalogos/presentaciones`, data);
  }
  updateCatPresentacion(id, data) {
    return this.http.put(`${this.base}/api/productos-catalogos/presentaciones/${id}`, data);
  }
  deleteCatPresentacion(id) {
    return this.http.delete(`${this.base}/api/productos-catalogos/presentaciones/${id}`);
  }
  createCatTamano(data) {
    return this.http.post(`${this.base}/api/productos-catalogos/tamanos`, data);
  }
  updateCatTamano(id, data) {
    return this.http.put(`${this.base}/api/productos-catalogos/tamanos/${id}`, data);
  }
  deleteCatTamano(id) {
    return this.http.delete(`${this.base}/api/productos-catalogos/tamanos/${id}`);
  }
  getProductosCategorias() {
    return this.http.get(`${this.base}/api/atencion-cliente/productos/listado/categorias`);
  }
  // --- CATALOGOS DE PRODUCTOS (SNOWFLAKE) ---
  getCatalogosCategorias() {
    return this.http.get(`${this.base}/api/productos-catalogos/categorias`);
  }
  createCatalogosCategoria(data) {
    return this.http.post(`${this.base}/api/productos-catalogos/categorias`, data);
  }
  updateCatalogosCategoria(id, data) {
    return this.http.put(`${this.base}/api/productos-catalogos/categorias/${id}`, data);
  }
  deleteCatalogosCategoria(id) {
    return this.http.delete(`${this.base}/api/productos-catalogos/categorias/${id}`);
  }
  getCatalogosSubCategorias(idCategoria) {
    let params = {};
    if (idCategoria)
      params = { id_categoria: idCategoria };
    return this.http.get(`${this.base}/api/productos-catalogos/subcategorias`, { params });
  }
  createCatalogosSubCategoria(data) {
    return this.http.post(`${this.base}/api/productos-catalogos/subcategorias`, data);
  }
  updateCatalogosSubCategoria(id, data) {
    return this.http.put(`${this.base}/api/productos-catalogos/subcategorias/${id}`, data);
  }
  deleteCatalogosSubCategoria(id) {
    return this.http.delete(`${this.base}/api/productos-catalogos/subcategorias/${id}`);
  }
  getProductosFabricantes() {
    return this.http.get(`${this.base}/api/atencion-cliente/productos/listado/fabricantes`);
  }
  getProductosTiposServicio() {
    return this.http.get(`${this.base}/api/atencion-cliente/productos/listado/tipos-servicio`);
  }
  getProductosTiposFabricante() {
    return this.http.get(`${this.base}/api/atencion-cliente/productos/listado/tipos-fabricante`);
  }
  getCategorias() {
    return this.http.get(`${this.base}/api/atencion-cliente/categorias`);
  }
  getPDVList(opts = {}) {
    return this.http.get(`${this.base}/api/atencion-cliente/pdv`, { params: this.params(opts) });
  }
  createPDV(data) {
    return this.http.post(`${this.base}/api/atencion-cliente/pdv`, data);
  }
  updatePDV(id, data) {
    return this.http.put(`${this.base}/api/atencion-cliente/pdv/${id}`, data);
  }
  getSolicitudes(estado) {
    return this.http.get(`${this.base}/api/atencion-cliente/solicitudes`, { params: this.params({ estado }) });
  }
  aprobarSolicitud(id) {
    return this.http.post(`${this.base}/api/atencion-cliente/solicitudes/${id}/aprobar`, {});
  }
  rechazarSolicitud(id) {
    return this.http.post(`${this.base}/api/atencion-cliente/solicitudes/${id}/rechazar`, {});
  }
  // --- CLIENTE - MIS FOTOS & VISITAS ---
  // El query param cliente_id es OPCIONAL: solo lo usa el Coordinador Exclusivo
  // para indicar de qué cliente quiere ver los datos. Para clientes normales se ignora.
  getExclusiveClients() {
    return this.http.get(`${this.base}/api/client/exclusive-clients`);
  }
  getClientRegions(clienteId) {
    return this.http.get(`${this.base}/api/client/regions`, { params: this.params({ cliente_id: clienteId }) });
  }
  getClientChains(region, clienteId) {
    return this.http.get(`${this.base}/api/client/chains/${encodeURIComponent(region)}`, { params: this.params({ cliente_id: clienteId }) });
  }
  getClientPoints(region, clienteId) {
    return this.http.get(`${this.base}/api/client/points/${encodeURIComponent(region)}`, { params: this.params({ cliente_id: clienteId }) });
  }
  getClientPointVisits(pointId, clienteId) {
    return this.http.get(`${this.base}/api/client/point/${encodeURIComponent(pointId)}/visits`, { params: this.params({ cliente_id: clienteId }) });
  }
  getClientMisVisitas(opts = {}) {
    return this.http.get(`${this.base}/api/client/mis-visitas`, { params: this.params(opts) });
  }
  getClientDashboard(clienteId) {
    return this.http.get(`${this.base}/api/client/dashboard`, { params: this.params({ cliente_id: clienteId }) });
  }
  getClientSummary(clienteId) {
    return this.http.get(`${this.base}/api/client/summary`, { params: this.params({ cliente_id: clienteId }) });
  }
  // --- PORTAL MERCADERISTA ---
  getMercMiPerfil() {
    return this.http.get(`${this.base}/api/merc/mi-perfil`);
  }
  getMercMiRuta() {
    return this.http.get(`${this.base}/api/merc/mi-ruta`);
  }
  getMercMisVisitas(opts = {}) {
    return this.http.get(`${this.base}/api/merc/mis-visitas`, { params: this.params(opts) });
  }
  iniciarVisita(data) {
    return this.http.post(`${this.base}/api/merc/iniciar-visita`, data);
  }
  getFotosVisita(visitaId) {
    return this.http.get(`${this.base}/api/merc/visita/${visitaId}/fotos`);
  }
  getMercProductosCliente(idCliente) {
    return this.http.get(`${this.base}/api/merc/productos`, { params: { id_cliente: idCliente } });
  }
  guardarMercBalances(payload) {
    return this.http.post(`${this.base}/api/merc/balances`, payload);
  }
  // --- CLIENT CATEGORIES ---
  getClientCategories(clientId) {
    return this.http.get(`${this.base}/api/clients/${clientId}/categorias`);
  }
  addClientCategory(clientId, categoryId) {
    return this.http.post(`${this.base}/api/clients/${clientId}/categorias`, { id_categoria: categoryId });
  }
  removeClientCategory(clientId, categoryId) {
    return this.http.delete(`${this.base}/api/clients/${clientId}/categorias/${categoryId}`);
  }
  // --- CATALOGOS ---
  getEstados() {
    return this.http.get(`${this.base}/api/catalogos/estados`);
  }
  static {
    this.\u0275fac = function ApiService_Factory(t) {
      return new (t || _ApiService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiService, factory: _ApiService.\u0275fac, providedIn: "root" });
  }
};

export {
  ApiService
};
//# sourceMappingURL=chunk-G4LBJVY7.js.map
