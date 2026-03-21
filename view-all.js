// View All / Hide All functionality
function initViewAll(btnId, containerId, dataPath, renderFunc, limit = 8) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    let allData = [];
    let isExpanded = false;

    // Load data
    let jsonPath = dataPath;
    if (window.location.pathname.includes('/pages/')) {
        jsonPath = '../' + dataPath;
    }

    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            allData = data;
            renderFunc(data.slice(0, limit), containerId);
        })
        .catch(error => console.error('Error loading data:', error));

    // Toggle expand/collapse
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        isExpanded = !isExpanded;

        if (isExpanded) {
            renderFunc(allData, containerId);
            btn.querySelector('.expand-text').style.display = 'none';
            btn.querySelector('.collapse-text').style.display = 'inline';
            btn.querySelector('i').classList.replace('fa-arrow-right', 'fa-arrow-up');
        } else {
            renderFunc(allData.slice(0, limit), containerId);
            btn.querySelector('.expand-text').style.display = 'inline';
            btn.querySelector('.collapse-text').style.display = 'none';
            btn.querySelector('i').classList.replace('fa-arrow-up', 'fa-arrow-right');
        }
    });
}

// Special function for honors with selected/all separation
function initHonorsViewAll(btnId, containerId, dataPath) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    let allData = [];
    let isExpanded = false;

    // Load data
    let jsonPath = dataPath;
    if (window.location.pathname.includes('/pages/')) {
        jsonPath = '../' + dataPath;
    }

    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            allData = data;
            // Initial render: only selected awards
            renderHonorsItems(allData.filter(h => h.selected), containerId);
        })
        .catch(error => console.error('Error loading honors data:', error));

    // Toggle expand/collapse - simple click without animation
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        isExpanded = !isExpanded;

        if (isExpanded) {
            // Render all honors
            renderHonorsItems(allData, containerId);
            btn.querySelector('.expand-text').style.display = 'none';
            btn.querySelector('.collapse-text').style.display = 'inline';
            btn.querySelector('i').classList.replace('fa-arrow-right', 'fa-arrow-up');
        } else {
            // Render only selected honors
            renderHonorsItems(allData.filter(h => h.selected), containerId);
            btn.querySelector('.expand-text').style.display = 'inline';
            btn.querySelector('.collapse-text').style.display = 'none';
            btn.querySelector('i').classList.replace('fa-arrow-up', 'fa-arrow-right');
        }
    });
}

