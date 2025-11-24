// /static/js/modules/utils.js

export function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';

    const date = new Date(dateString);

    return new Intl.DateTimeFormat('es-VE', {
        timeZone: 'America/Caracas',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
}

export function showLoading(selector, message) {
    $(selector).html(`
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">${message}</p>
        </div>
    `);
}

export function showError(selector, message) {
    $(selector).html(`
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> ${message}
        </div>
    `);
}

export function showAlert(message, type) {
    const alert = $(`
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    $('#content-area').prepend(alert);
    setTimeout(() => alert.alert('close'), 3000);
}