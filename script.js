document.addEventListener('DOMContentLoaded', function () {
    // Make all links open in a new tab
    makeAllLinksOpenInNewTab();

    // Set up MutationObserver to watch for dynamically added links
    setupLinkObserver();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Load publications data from JSON file
    loadPublications();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Only apply smooth scrolling to hash links (internal page links)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Account for the sticky nav
                    const navHeight = document.querySelector('.top-nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active class
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function () {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.top-nav').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - navHeight - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkTarget = link.getAttribute('href').substring(1);
            // Handle both homepage and about pointing to the same section
            if (linkTarget === current ||
                (current === 'homepage' && linkTarget === 'about') ||
                (current === 'about' && linkTarget === 'homepage')) {
                link.classList.add('active');
            }
        });
    });

    // Load news data - selected news by default, View All shows everything
    const latestNewsSection = document.getElementById('latest-news');
    if (latestNewsSection) {
        if (typeof initNewsViewAll === 'function') {
            initNewsViewAll('view-all-news', 'news-container', 'data/news.json');
        } else {
            console.error('initNewsViewAll function not found');
        }
    }

    // Load all news for dedicated page
    const allNewsSection = document.getElementById('all-news');
    if (allNewsSection) {
        let newsJsonPath = '../data/news.json';
        fetch(newsJsonPath)
            .then(response => response.json())
            .then(data => renderNewsItems(data, 'all-news-container'))
            .catch(error => console.error('Error loading news data:', error));
    }

    // Load honors data - use specialized Honors function for homepage
    const honorsSection = document.getElementById('honors');
    if (honorsSection) {
        // Ensure initHonorsViewAll is available
        if (typeof initHonorsViewAll === 'function') {
            initHonorsViewAll('view-all-honors', 'honors-container', 'data/honors.json');
        } else {
            console.error('initHonorsViewAll function not found');
        }
    }

    // Load all honors for dedicated page
    const allHonorsSection = document.getElementById('all-honors');
    if (allHonorsSection) {
        let honorsJsonPath = '../data/honors.json';
        fetch(honorsJsonPath)
            .then(response => response.json())
            .then(data => renderHonorsItems(data, 'all-honors-container'))
            .catch(error => console.error('Error loading honors data:', error));
    }
});

// Function to load publications from JSON
function loadPublications() {
    let publicationsJsonPath = 'data/publications.json';
    if (window.location.pathname.includes('/pages/')) {
        publicationsJsonPath = '../data/publications.json';
    }

    const publicationsList = document.querySelector('.publications-list');
    const viewAllBtn = document.getElementById('view-all-publications');

    if (!publicationsList) {
        console.warn('Publications list not found');
        return;
    }

    publicationsList.innerHTML = '';

    let allPublications = [];
    let isExpanded = false;

    fetch(publicationsJsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(publications => {
            allPublications = publications;
            console.log('Loaded publications:', publications.length);

            renderPublicationGroups(false);
            updatePublicationViewAllButton();

            if (viewAllBtn) {
                viewAllBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    isExpanded = !isExpanded;
                    renderPublicationGroups(isExpanded);
                    updatePublicationViewAllButton();
                });
            }
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
            publicationsList.innerHTML = '<p>Failed to load publications. Please check the console for details.</p>';
        });

    function updatePublicationViewAllButton() {
        if (!viewAllBtn) return;

        const remainingCount = allPublications.filter(pub => !isFirstAuthorPublication(pub)).length;
        if (remainingCount === 0) {
            viewAllBtn.style.display = 'none';
            return;
        }

        viewAllBtn.style.display = 'inline-flex';
        viewAllBtn.style.alignItems = 'center';
        viewAllBtn.style.gap = '0.25rem';

        const expandText = viewAllBtn.querySelector('.expand-text');
        const collapseText = viewAllBtn.querySelector('.collapse-text');
        const icon = viewAllBtn.querySelector('i');

        if (expandText) expandText.style.display = isExpanded ? 'none' : 'inline';
        if (collapseText) collapseText.style.display = isExpanded ? 'inline' : 'none';
        if (icon) {
            icon.classList.toggle('fa-arrow-right', !isExpanded);
            icon.classList.toggle('fa-arrow-up', isExpanded);
        }
    }
    function renderPublicationGroups(showAll) {
        publicationsList.innerHTML = '';

        const visiblePubs = showAll
            ? allPublications
            : allPublications.filter(isFirstAuthorPublication);

        if (visiblePubs.length === 0) {
            publicationsList.innerHTML = '<p class="text-neutral-500">No publications to display.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'pub-list-ul';

        let hasFirstAuthorBefore = false;
        let dividerInserted = false;

        visiblePubs.forEach(pub => {
            const isFirstAuthor = isFirstAuthorPublication(pub);
            let isFirstOtherPaper = false;

            // View All 后，在一作/共一论文和非一作论文之间插入淡分界线
            if (showAll && !dividerInserted && !isFirstAuthor && hasFirstAuthorBefore) {
                const divider = document.createElement('li');
                divider.className = 'pub-author-divider';
                divider.setAttribute('aria-hidden', 'true');
                ul.appendChild(divider);

                dividerInserted = true;
                isFirstOtherPaper = true;
            }

            const li = createPublicationItem(pub, {
                // 一作/共一论文默认显示图片
                defaultImage: isFirstAuthor,

                // 只有 View All 里的非一作论文才显示 Image/Text 按钮
                allowImageToggle: showAll && !isFirstAuthor && !!pub.thumbnail,

                // 现在不再按 Preprint / Published 分组，这里固定 false 即可
                isPreprint: false
            });

            if (isFirstOtherPaper) {
                li.classList.add('first-other-paper');
            }

            if (isFirstAuthor) {
                hasFirstAuthorBefore = true;
            }

            ul.appendChild(li);
        });

        publicationsList.appendChild(ul);
    }
}

function isFirstAuthorPublication(pub) {
    if (pub.isFirstAuthor === true || pub.firstAuthor === true) return true;

    if (typeof pub.authors === 'string') {
        const plainAuthors = pub.authors
            .replace(/<[^>]*>/g, '')
            .replace(/\*/g, '')
            .trim();
        const firstAuthor = (plainAuthors.split(',')[0] || '').toLowerCase();
        return firstAuthor.includes('yuxuan nie') || firstAuthor.includes('nie yuxuan');
    }

    return false;
}
function createPublicationItem(pub, options = {}) {
    const {
        defaultImage = false,
        allowImageToggle = false,
        isPreprint = false
    } = options;

    const statusLabel = getPublicationStatusLabel(pub);
    const isUnderReview = statusLabel === 'Under Review';

    const reviewMode = (pub.reviewMode || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

    const isDoubleBlindUnderReview =
        isUnderReview && (reviewMode === 'double_blind' || reviewMode === 'anonymous');

    const isSingleBlindUnderReview =
        isUnderReview && reviewMode === 'single_blind';



    const li = document.createElement('li');
    li.className = 'pub-list-item';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'pub-content-wrapper';

    // --- Line 1: [Venue] Title ---
    const line1 = document.createElement('div');
    line1.className = 'pub-line-1';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'pub-title-text';
    titleSpan.textContent = pub.title;
    line1.appendChild(titleSpan);
    if (isUnderReview) {
        const statusBadge = document.createElement('span');
        statusBadge.className = 'pub-status-badge status-under-review';
        statusBadge.textContent = 'Under Review';
        line1.appendChild(statusBadge);
    }
    if (pub.tags) {
        pub.tags.forEach(tag => {
            if (tag.link && tag.link !== '#') {
                const btn = document.createElement('a');
                btn.className = 'pub-link-btn';
                btn.href = tag.link;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
                btn.textContent = tag.text === 'Paper' ? 'PDF' : tag.text;
                line1.appendChild(btn);
            }
        });
    }

    let thumbBox = null;
    if (pub.thumbnail) {
        thumbBox = document.createElement('div');
        thumbBox.className = 'pub-thumbnail-box';

        const thumbImg = document.createElement('img');
        thumbImg.src = pub.thumbnail;
        thumbImg.alt = pub.title || 'Publication thumbnail';
        thumbBox.appendChild(thumbImg);

        if (defaultImage) {
            li.classList.add('with-thumbnail-expanded');
        } else {
            thumbBox.style.display = 'none';
        }
    }

    // Non-first-author papers stay as a compact unordered list by default.
    // The Image button expands only the clicked paper into the thumbnail layout.
    if (allowImageToggle && thumbBox) {
        const imageBtn = document.createElement('button');
        imageBtn.type = 'button';
        imageBtn.className = 'pub-link-btn pub-btn-preview';

        const isInitiallyOpen = li.classList.contains('with-thumbnail-expanded');

        imageBtn.textContent = isInitiallyOpen ? 'Text' : 'Image';
        imageBtn.setAttribute('aria-expanded', isInitiallyOpen ? 'true' : 'false');
        imageBtn.classList.toggle('active', isInitiallyOpen);

        imageBtn.addEventListener('click', function () {
            const isOpen = li.classList.toggle('with-thumbnail-expanded');

            thumbBox.style.display = isOpen ? 'block' : 'none';
            imageBtn.classList.toggle('active', isOpen);
            imageBtn.textContent = isOpen ? 'Text' : 'Image';
            imageBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        line1.appendChild(imageBtn);
    }

    contentWrapper.appendChild(line1);


    // --- Line 2: Authors ---
    // Hide authors only for double-blind under-review papers.
    if (!isDoubleBlindUnderReview) {
        const line2 = document.createElement('div');
        line2.className = 'pub-line-2';
        line2.innerHTML = pub.authors || '';
        contentWrapper.appendChild(line2);
    }

    // --- Line 3: Venue Details ---
    // Hide venue / ranks only for double-blind under-review papers.
    if (!isDoubleBlindUnderReview) {
        const line3 = document.createElement('div');
        line3.className = 'pub-line-3';

        let highlightText = pub.highlight || '';
        let badgeText = '';
        if (highlightText.toLowerCase().includes('oral')) badgeText = 'Oral';
        else if (highlightText.toLowerCase().includes('spotlight')) badgeText = 'Spotlight';

        if (badgeText) {
            const badge = document.createElement('span');
            badge.className = 'pub-badge-highlight';
            badge.textContent = badgeText;
            line3.appendChild(badge);
        }

        let fullVenueName = getVenueFullName(pub.venue, pub.year);

        const venueNameSpan = document.createElement('span');
        venueNameSpan.textContent = fullVenueName;
        line3.appendChild(venueNameSpan);

        // Avoid showing a second "Under Review" badge in Line 3.
        if (statusLabel && !isUnderReview) {
            const statusBadge = document.createElement('span');
            statusBadge.className = `pub-status-badge status-${statusLabel
                .toLowerCase()
                .replace(/\s+/g, '-')}`;
            statusBadge.textContent = statusLabel;
            line3.appendChild(statusBadge);
        }

        const ccfRank = getCCFRank(fullVenueName, pub.venue || '');
        if (ccfRank) {
            const rankSpan = document.createElement('span');
            rankSpan.className = `ccf-rank ccf-${ccfRank.toLowerCase()}`;
            rankSpan.textContent = `(CCF-${ccfRank})`;
            line3.appendChild(rankSpan);
            line3.appendChild(document.createTextNode(' '));
        }

        const casRank = getCASRank(fullVenueName, pub.venue || '');
        if (casRank || pub.isTop) {
            const casSpan = document.createElement('span');
            casSpan.className = `cas-rank ${casRank ? 'cas-q' + casRank : ''}`;

            let casContent = '(';
            if (casRank) {
                casContent += `中科院${casRank}区`;
            }

            if (pub.isTop) {
                if (casRank) casContent += ' ';
                casContent += '<span class="inline-top">Top</span>';
            }

            casContent += ')';
            casSpan.innerHTML = casContent;
            line3.appendChild(casSpan);
            line3.appendChild(document.createTextNode(' '));
        }

        if (pub.impactFactor) {
            const ifSpan = document.createElement('span');
            ifSpan.className = 'impact-factor';
            ifSpan.textContent = `(IF: ${pub.impactFactor})`;
            line3.appendChild(ifSpan);
        }

        contentWrapper.appendChild(line3);
    }


    li.appendChild(contentWrapper);
    if (thumbBox) {
        li.appendChild(thumbBox);
    }

    return li;
}
function getPublicationStatusLabel(pub) {
    const rawStatus = (pub.status || pub.type || '').toString().trim().toLowerCase();
    const venueLower = (pub.venue || '').toLowerCase();

    // if (
    //     rawStatus === 'accepted' ||
    //     rawStatus === 'accept'
    // ) {
    //     return 'Accepted';
    // }

    if (
        rawStatus === 'under_review' ||
        rawStatus === 'under review' ||
        rawStatus === 'review'
    ) {
        return 'Under Review';
    }

    if (
        rawStatus === 'major_revision' ||
        rawStatus === 'major revision'
    ) {
        return 'Major Revision';
    }

    if (
        rawStatus === 'minor_revision' ||
        rawStatus === 'minor revision'
    ) {
        return 'Minor Revision';
    }

    if (
        rawStatus === 'preprint' ||
        venueLower.includes('arxiv')
    ) {
        return 'Preprint';
    }

    // Backward compatibility: 如果你之前把状态写进了 venue，也能识别
    if (venueLower.includes('under review')) {
        return 'Under Review';
    }

    if (venueLower.includes('major revision')) {
        return 'Major Revision';
    }

    if (venueLower.includes('minor revision')) {
        return 'Minor Revision';
    }

    return '';
}
function getVenueShortName(venueStr, year) {
    if (!venueStr) return 'Preprint';

    // Check for revision status
    let revisionSuffix = '';
    if (venueStr.toLowerCase().includes('major revision')) {
        revisionSuffix = ', Major';
    } else if (venueStr.toLowerCase().includes('minor revision')) {
        revisionSuffix = ', Minor';
    }

    // Remove year (4 digits at end or start)
    let s = venueStr.replace(/\d{4}/g, '').trim();
    let suffix = '';

    // Check if it is a conference that needs year suffix
    const conferences = ['NeurIPS', 'CVPR', 'ICCV', 'NSDI', 'ECCV', 'ICRA', 'AAAI', 'BIBM', 'IFIP NPC', 'INFOCOM', 'MOBICOM', 'ICPP', 'ICNP', 'IMC'];
    for (const conf of conferences) {
        if (s.includes(conf)) {
            // Get last two digits of year
            if (year) {
                const yearStr = year.toString();
                if (yearStr.length === 4) {
                    suffix = "'" + yearStr.substring(2);
                }
            }
            return conf + suffix + revisionSuffix;
        }
    }

    // Special cases
    if (s.toLowerCase().includes('arxiv')) return 'arXiv' + revisionSuffix; // No year

    // Journals or specific conferences
    if (s.includes('TDSC')) return 'IEEE TDSC' + revisionSuffix;
    if (s.includes('TMC')) return 'IEEE TMC' + revisionSuffix;
    if (s.includes('TSC')) return 'IEEE TSC' + revisionSuffix;
    if (s.includes('Computer_Networks')) return 'Computer Networks' + revisionSuffix;
    if (s.includes('ESWA')) return 'Elsevier ESWA' + revisionSuffix;
    if (s.includes('JSAC')) return 'IEEE JSAC' + revisionSuffix;
    if (s.includes('TGCN')) return 'IEEE TGCN' + revisionSuffix;
    if (s.includes('LNET')) return 'IEEE LNET' + revisionSuffix;
    if (s.includes('TNSE')) return 'IEEE TNSE' + revisionSuffix;
    if (s.includes('IOTJ') || s.includes('IoTJ')) return 'IEEE IoTJ' + revisionSuffix;

    return s;
}

function getVenueFullName(venueStr, year) {
    if (!venueStr) return '';
    let s = venueStr.replace(/\d{4}/g, '').trim(); // Remove year

    // Get year suffix for conferences
    let yearSuffix = '';
    if (year) {
        const yearStr = year.toString();
        if (yearStr.length === 4) {
            yearSuffix = "'" + yearStr.substring(2);
        }
    }

    // Journal Full Names Mapping (No Year)
    if (s.includes('TDSC')) return 'IEEE Transactions on Dependable and Secure Computing';
    if (s.includes('TMC')) return 'IEEE Transactions on Mobile Computing';
    if (s.includes('TSC')) return 'IEEE Transactions on Service Computing';
    if (s.includes('Computer_Networks')) return 'Computer Networks';
    if (s.includes('ESWA')) return 'Expert Systems With Applications';
    if (s.includes('JSAC')) return 'IEEE Journal on Selected Areas in Communications';
    if (s.includes('TGCN')) return 'IEEE Transactions on Green Communications and Networking';
    if (s.includes('TNSE')) return 'IEEE Transactions on Network Science and Engineering';
    if (s.includes('IoTJ') || s.includes('IoTJ')) return 'IEEE Internet of Things Journal';
    if (s.includes('LNET') || s.includes('LNet')) return 'IEEE Networking Letters';

    // Conference Full Names Mapping (With Year Suffix)
    if (s.includes('NeurIPS')) return `Annual Conference on Neural Information Processing Systems (NeurIPS${yearSuffix})`;
    if (s.includes('NSDI')) return `USENIX Symposium on Networked Systems Design and Implementation (NSDI${yearSuffix})`;
    if (s.includes('CVPR')) return `IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR${yearSuffix})`;
    if (s.includes('ICCV')) return `IEEE/CVF International Conference on Computer Vision (ICCV${yearSuffix})`;
    if (s.includes('ECCV')) return `European Conference on Computer Vision (ECCV${yearSuffix})`;
    if (s.includes('ICRA')) return `IEEE International Conference on Robotics and Automation (ICRA${yearSuffix})`;
    if (s.includes('AAAI')) return `AAAI Conference on Artificial Intelligence (AAAI${yearSuffix})`;
    if (s.includes('INFOCOM')) return `IEEE International Conference on Computer Communications (INFOCOM${yearSuffix})`;
    if (s.includes('MOBICOM')) return `Annual International Conference on Mobile Computing and Networking (MobiCom${yearSuffix})`;
    if (s.includes('BIBM')) return `IEEE International Conference on Bioinformatics and Biomedicine (BIBM${yearSuffix})`;
    if (s.includes('IMC')) return `ACM Internet Measurement Conference (IMC${yearSuffix})`;
    if (s.includes('ICNP')) return `IEEE International Conference on Network Protocols (ICNP${yearSuffix})`;
    if (s.includes('ICPP')) return `International Conference on Parallel Processing (ICPP${yearSuffix})`;
    if (s.includes('IFIP NPC')) return `IFIP International Conference on Network and Parallel Computing (IFIP NPC${yearSuffix})`;

    if (s.toLowerCase().includes('arxiv')) return 'arXiv preprint';

    return s;
}

function getCCFRank(fullName, originalVenue) {
    const v = (fullName + ' ' + originalVenue).toLowerCase();

    // CCF-A
    if (v.includes('tdsc') || v.includes('dependable and secure') ||
        v.includes('nsdi') || v.includes('tmc') || v.includes('tsc') ||
        v.includes('aaai') || v.includes('neurips') ||
        v.includes('cvpr') || v.includes('iccv') ||
        v.includes('infocom') || v.includes('jsac')) {
        return 'A';
    }

    // CCF-B
    if (v.includes('bibm') || v.includes('computer_networks') || v.includes('imc') || v.includes('icpp') || v.includes('icnp')) {
        return 'B';
    }

    // CCF-C
    if (v.includes('ifip npc')) {
        return 'C';
    }

    return null;
}
// Function to get CAS Rank (中科院分区)
function getCASRank(fullName, originalVenue) {
    const v = (fullName + ' ' + originalVenue).toLowerCase();

    // 中科院 1区
    if (v.includes('eswa') || v.includes('expert systems') ||
        v.includes('iotj') || v.includes('internet of things journal') ||
        v.includes('jsac')) {
        return '1';
    }

    // 中科院 2区
    if (v.includes('tdsc') || v.includes('dependable and secure computing')) {
        return '2';
    }

    // 中科院 3区
    if (v.includes('tnse') || v.includes('network science')) {
        return '3';
    }

    // 中科院 4区
    if (v.includes('lnet') || v.includes('networking letters')) {
        return '4';
    }

    // 会议通常不看中科院分区，所以默认返回 null
    return null;
}
// Function to render news items
function renderNewsItems(newsData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('News container not found:', containerId);
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Add each news item to the container
    newsData.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';

        // Create the date element
        const dateElement = document.createElement('span');
        dateElement.className = 'news-date';
        dateElement.textContent = newsItem.date;

        // Create the content element
        const contentElement = document.createElement('div');
        contentElement.className = 'news-content';

        // Create emoji and content text
        const textSpan = document.createElement('span');
        textSpan.innerHTML = '' + newsItem.content;
        contentElement.appendChild(textSpan);

        // Add links if provided in the links array format
        if (newsItem.links && newsItem.links.length > 0) {
            newsItem.links.forEach(link => {
                const space = document.createTextNode(' ');
                contentElement.appendChild(space);

                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.text;
                if (link.url && !link.url.startsWith('#')) {
                    linkElement.setAttribute('target', '_blank');
                }
                contentElement.appendChild(linkElement);
            });
        }

        // Check for old style link (backward compatibility)
        if (newsItem.link && newsItem.linkText) {
            const space = document.createTextNode(' ');
            contentElement.appendChild(space);

            const linkElement = document.createElement('a');
            linkElement.href = newsItem.link;
            linkElement.textContent = newsItem.linkText;
            if (newsItem.link && !newsItem.link.startsWith('#')) {
                linkElement.setAttribute('target', '_blank');
            }
            contentElement.appendChild(linkElement);
        }

        // Add date and content to the news item
        newsElement.appendChild(dateElement);
        newsElement.appendChild(contentElement);

        // Add the news item to the container
        container.appendChild(newsElement);
    });
}

// Function to render honors items
function renderHonorsItems(honorsData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Honors container not found:', containerId);
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Separate selected and other honors
    const selectedHonors = honorsData.filter(h => h.selected);
    const otherHonors = honorsData.filter(h => !h.selected);

    // Create selected awards section
    if (selectedHonors.length > 0) {
        selectedHonors.forEach(honorItem => {
            const item = createHonorItem(honorItem, true);
            container.appendChild(item);
        });

        // Add divider if there are other honors
        if (otherHonors.length > 0) {
            const divider = document.createElement('div');
            divider.className = 'awards-divider';
            container.appendChild(divider);
        }
    }

    // Create all other honors section
    if (otherHonors.length > 0) {
        otherHonors.forEach(honorItem => {
            const item = createHonorItem(honorItem, false);
            container.appendChild(item);
        });
    }
}

function createHonorItem(honorItem, isSelected = false) {
    const item = document.createElement('div');
    item.className = isSelected ? 'honor-item honor-item-selected' : 'honor-item';

    // Create the year element
    const yearElement = document.createElement('div');
    yearElement.className = 'honor-year';
    const yearHighlight = document.createElement('span');
    yearHighlight.className = 'year-highlight';
    yearHighlight.textContent = honorItem.date;
    yearElement.appendChild(yearHighlight);

    // Create the content element
    const contentElement = document.createElement('div');
    contentElement.className = 'honor-content';

    // Create the title element
    const titleElement = document.createElement('h3');
    titleElement.textContent = honorItem.title;
    contentElement.appendChild(titleElement);

    // Create the description element if it exists
    if (honorItem.description) {
        const descElement = document.createElement('p');
        descElement.innerHTML = honorItem.description;
        contentElement.appendChild(descElement);
    }

    // Add year and content to the honor item
    item.appendChild(yearElement);
    item.appendChild(contentElement);

    return item;
}

// Function to make all links open in a new tab
function makeAllLinksOpenInNewTab() {
    // Get all links in the document
    const links = document.querySelectorAll('a');

    // Loop through each link
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Skip navigation links (links that start with #) and links without href
        if (href && !href.startsWith('#')) {
            // Set target to _blank to open in a new tab
            link.setAttribute('target', '_blank');
        }
    });
}

// Function to set up a MutationObserver to watch for new links
function setupLinkObserver() {
    // Select the target node (in this case, the entire document body)
    const targetNode = document.body;

    // Options for the observer (which mutations to observe)
    const config = {
        childList: true, // observe direct children
        subtree: true, // and lower descendants too
        characterData: false, // don't care about text changes
        attributes: false // don't care about attribute changes
    };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        // Check if any new nodes were added
        let newLinksAdded = false;

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes are links or contain links
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        if (node.tagName === 'A') {
                            newLinksAdded = true;
                            break;
                        } else if (node.querySelectorAll) {
                            const links = node.querySelectorAll('a');
                            if (links.length > 0) {
                                newLinksAdded = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (newLinksAdded) break;
        }

        // If new links were added, update them to open in new tabs
        if (newLinksAdded) {
            makeAllLinksOpenInNewTab();
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}
