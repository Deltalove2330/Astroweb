// static/js/modules/session-monitor.js
// Monitorea la sesión y redirige si fue invalidada por el admin

(function() {
    const CHECK_INTERVAL = 15000;
    let sessionChecker = null;  // ← fuera para que sea accesible

    function checkSession() {
        fetch('/api/current-user', {
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(res => {
            if (res.status === 401) {
                clearInterval(sessionChecker);  // ← ahora sí lo encuentra
                window.location.href = '/login';
                return null;
            }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            if (!data.success && data.code === 'SESSION_INVALIDATED') {
                clearInterval(sessionChecker);
                window.location.href = '/login';
            }
        })
        .catch(() => {});
    }

    const isLoginPage = window.location.pathname.includes('/login');
    if (!isLoginPage) {
        sessionChecker = setInterval(checkSession, CHECK_INTERVAL);
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) checkSession();
        });
    }
})();