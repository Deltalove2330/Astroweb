// Cache global de URLs de imágenes — compartido en TODA la app
(function() {
    const _cache = new Map();

    window.getImageUrl = function(filePath) {
        if (!filePath) return '/static/images/placeholder.png';
        if (_cache.has(filePath)) return _cache.get(filePath);

        let cleanPath = filePath
            .replace(/\\/g, '/')
            .replace('X://', 'X:/')
            .replace(/\/+/g, '/')
            .replace(/^\//, '');

        const url = `/api/image/${encodeURIComponent(cleanPath).replace(/%2F/g, '/')}`;
        _cache.set(filePath, url);
        return url;
    };

    window.clearImageCache = function() { _cache.clear(); };
    window.getImageCacheSize = function() { return _cache.size; };
})();