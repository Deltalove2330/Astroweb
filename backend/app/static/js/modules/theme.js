// /static/js/modules/theme.js
export function initTheme() {
    const lightBtn = $('#lightModeBtn');
    const darkBtn = $('#darkModeBtn');
    const body = $('body');
    
    const savedTheme = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'light') {
        body.addClass('light-mode');
        lightBtn.addClass('active');
        darkBtn.removeClass('active');
    } else {
        body.removeClass('light-mode');
        darkBtn.addClass('active');
        lightBtn.removeClass('active');
    }
    
    lightBtn.on('click', function() {
        body.addClass('light-mode');
        localStorage.setItem('theme', 'light');
        lightBtn.addClass('active');
        darkBtn.removeClass('active');
    });
    
    darkBtn.on('click', function() {
        body.removeClass('light-mode');
        localStorage.setItem('theme', 'dark');
        darkBtn.addClass('active');
        lightBtn.removeClass('active');
    });
}