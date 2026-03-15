// View All / Hide All Toggle Functionality
// Reusable module for expanding/collapsing content sections

function initViewAllToggle(config) {
    const {
        buttonId,
        containerId,
        data,
        renderFunction,
        defaultLimit = 8
    } = config;

    const viewAllBtn = document.getElementById(buttonId);
    const container = document.getElementById(containerId);

    if (!viewAllBtn || !container || !data || data.length <= defaultLimit) {
        if (viewAllBtn) viewAllBtn.style.display = 'none';
        return;
    }

    let isExpanded = false;

    viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const expandText = viewAllBtn.querySelector('.expand-text');
        const collapseText = viewAllBtn.querySelector('.collapse-text');

        if (!isExpanded) {
            renderFunction(data, containerId);
            expandText.style.display = 'none';
            collapseText.style.display = 'inline';
            isExpanded = true;
        } else {
            renderFunction(data.slice(0, defaultLimit), containerId);
            expandText.style.display = 'inline';
            collapseText.style.display = 'none';
            isExpanded = false;
        }
    });
}

