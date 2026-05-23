/**
 * PhotoPreviewStore — Persistencia de fotos previsualzadas en IndexedDB
 * Las fotos sobreviven cortes de luz/internet/recarga de página.
 * Solo se eliminan cuando se suben exitosamente o el mercaderista las cancela.
 */
var PhotoPreviewStore = (function () {
    var DB_NAME = 'PhotoPreviewDB';
    var DB_VERSION = 1;
    var STORE_NAME = 'previews';
    var db = null;

    function openDB() {
        return new Promise(function (resolve, reject) {
            if (db) { resolve(db); return; }
            var req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = function (e) {
                var database = e.target.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    var store = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('bySession', 'sessionKey', { unique: false });
                    store.createIndex('bySessionType', ['sessionKey', 'type', 'subtype'], { unique: false });
                }
            };
            req.onsuccess = function (e) { db = e.target.result; resolve(db); };
            req.onerror = function (e) { reject(e.target.error); };
        });
    }

    function savePhoto(sessionKey, type, subtype, blob, meta) {
        return openDB().then(function (database) {
            return new Promise(function (resolve, reject) {
                var tx = database.transaction(STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORE_NAME);
                var entry = {
                    sessionKey: sessionKey,
                    type: type,
                    subtype: subtype || 'default',
                    blob: blob,
                    timestamp: (meta && meta.timestamp) ? meta.timestamp : new Date().toISOString(),
                    deviceGPS: (meta && meta.deviceGPS) ? meta.deviceGPS : null,
                    source: (meta && meta.source) ? meta.source : 'unknown',
                    filename: (meta && meta.filename) ? meta.filename : ('foto_' + Date.now() + '.jpg')
                };
                var addReq = store.add(entry);
                addReq.onsuccess = function () { resolve(addReq.result); };
                addReq.onerror = function (e) { reject(e.target.error); };
            });
        });
    }

    function getAllForSession(sessionKey) {
        return openDB().then(function (database) {
            return new Promise(function (resolve, reject) {
                var tx = database.transaction(STORE_NAME, 'readonly');
                var index = tx.objectStore(STORE_NAME).index('bySession');
                var req = index.getAll(IDBKeyRange.only(sessionKey));
                req.onsuccess = function () { resolve(req.result || []); };
                req.onerror = function (e) { reject(e.target.error); };
            });
        });
    }

    function deletePhoto(id) {
        if (id == null) return Promise.resolve();
        return openDB().then(function (database) {
            return new Promise(function (resolve, reject) {
                var tx = database.transaction(STORE_NAME, 'readwrite');
                var req = tx.objectStore(STORE_NAME).delete(id);
                req.onsuccess = function () { resolve(); };
                req.onerror = function (e) { reject(e.target.error); };
            });
        });
    }

    function clearByTypeAndSubtype(sessionKey, type, subtype) {
        return openDB().then(function (database) {
            return new Promise(function (resolve, reject) {
                var tx = database.transaction(STORE_NAME, 'readwrite');
                var index = tx.objectStore(STORE_NAME).index('bySessionType');
                var req = index.openCursor(IDBKeyRange.only([sessionKey, type, subtype || 'default']));
                req.onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) { cursor.delete(); cursor.continue(); } else { resolve(); }
                };
                req.onerror = function (e) { reject(e.target.error); };
            });
        });
    }

    function clearSession(sessionKey) {
        return openDB().then(function (database) {
            return new Promise(function (resolve, reject) {
                var tx = database.transaction(STORE_NAME, 'readwrite');
                var index = tx.objectStore(STORE_NAME).index('bySession');
                var req = index.openCursor(IDBKeyRange.only(sessionKey));
                req.onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) { cursor.delete(); cursor.continue(); } else { resolve(); }
                };
                req.onerror = function (e) { reject(e.target.error); };
            });
        });
    }

    return {
        savePhoto: savePhoto,
        getAllForSession: getAllForSession,
        deletePhoto: deletePhoto,
        clearByTypeAndSubtype: clearByTypeAndSubtype,
        clearSession: clearSession
    };
})();