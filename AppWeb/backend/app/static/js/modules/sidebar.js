// /static/js/modules/sidebar.js
export function initSidebar(sidebarCollapsed) {
    const $sidebar = $('.sidebar');
    if ($(window).width() >= 768) {
        $sidebar.toggleClass('collapsed', sidebarCollapsed);
    }
    updateTogglePosition();
    updateAriaState();
}

export function initModules() {
   // $('.sidebar-module:first-child .module-content').addClass('show');
  //$('.sidebar-module:first-child .module-toggle').addClass('rotated');
    
    $('.module-header').on('click', function() {
        const $module = $(this).closest('.sidebar-module');
        const $content = $module.find('.module-content');
        const $toggle = $module.find('.module-toggle');
        
        $content.toggleClass('show');
        $toggle.toggleClass('rotated');
    });
}

export function toggleSidebar(sidebarCollapsed) {
    const $sidebar = $('.sidebar');
    if ($(window).width() < 768) {
        $sidebar.toggleClass('active');
    } else {
        sidebarCollapsed = !sidebarCollapsed;
        $sidebar.toggleClass('collapsed', sidebarCollapsed);
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }
    updateTogglePosition();
    updateAriaState();
}

export function closeSidebar() {
    const $sidebar = $('.sidebar');
    if ($(window).width() < 768) {
        $sidebar.removeClass('active');
    } else {
        sidebarCollapsed = true;
        $sidebar.addClass('collapsed');
        localStorage.setItem('sidebarCollapsed', true);
    }
    updateTogglePosition();
    updateAriaState();
}

export function updateTogglePosition() {
    const $toggle = $('#toggleSidebar');
    const $sidebar = $('.sidebar');
    if ($(window).width() < 768) {
        if ($sidebar.hasClass('active')) {
            $toggle.css('left', 'calc(var(--sidebar-width) - 40px)');
        } else {
            $toggle.css('left', '15px');
        }
    } else {
        if ($sidebar.hasClass('collapsed')) {
            $toggle.css('left', 'calc(var(--sidebar-collapsed-width) - 40px)');
        } else {
            $toggle.css('left', 'calc(var(--sidebar-width) - 50px)');
        }
    }
}

export function updateAriaState() {
    const $sidebar = $('.sidebar');
    let isExpanded;
    if ($(window).width() < 768) {
        isExpanded = $sidebar.hasClass('active');
    } else {
        isExpanded = !$sidebar.hasClass('collapsed');
    }
    $('#toggleSidebar').attr('aria-expanded', isExpanded);
}