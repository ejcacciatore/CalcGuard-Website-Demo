document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const menuToggle = document.getElementById('menuToggle');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const nav = document.querySelector('.site-header__nav');
    const header = document.querySelector('.site-header');
    const backToTop = document.querySelector('.back-to-top');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    // Toggle mobile menu
    function toggleMenu() {
        hamburgerIcon.classList.toggle('active');
        nav.classList.toggle('mobile-active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (nav.classList.contains('mobile-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Handle menu toggle click
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    }

    // Close mobile menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function() {
            toggleMenu();
        });
    }

    // Close mobile menu on window resize (if desktop size)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && nav && nav.classList.contains('mobile-active')) {
            toggleMenu();
        }
    });

    // Handle header background on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Initialize scroll handler
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    // Handle mobile menu links (close menu when clicked)
    if (nav) {
        const mobileNavLinks = nav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (nav.classList.contains('mobile-active')) {
                    toggleMenu();
                }
            });
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add in-view to any grids inside this section
                const grids = entry.target.querySelectorAll('.overview__grid, .features-grid, .security-grid, .technical-grid');
                grids.forEach(grid => {
                    grid.classList.add('in-view');
                });
                
                // Unobserve after animation
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Initialize Cytoscape graph if the element exists
    const graphContainer = document.getElementById('cy');
    if (graphContainer) {
        initializeCytoscapeGraph();
    }
});

// Cytoscape graph initialization
function initializeCytoscapeGraph() {
    try {
        const cy = cytoscape({
            container: document.getElementById('cy'),
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#00C4B4',
                        'label': 'data(id)',
                        'color': '#F9FAFB',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': '12px',
                        'width': '50px',
                        'height': '50px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#4A90E2',
                        'target-arrow-color': '#4A90E2',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                }
            ],
            layout: {
                name: 'grid',
                rows: 2
            },
            elements: [
                // Sample nodes - replace with your actual data
                { data: { id: 'Order' } },
                { data: { id: 'Routes' } },
                { data: { id: 'Venue A' } },
                { data: { id: 'Venue B' } },
                { data: { id: 'Execution' } },
                
                // Sample edges - replace with your actual data
                { data: { id: 'o-r', source: 'Order', target: 'Routes' } },
                { data: { id: 'r-va', source: 'Routes', target: 'Venue A' } },
                { data: { id: 'r-vb', source: 'Routes', target: 'Venue B' } },
                { data: { id: 'va-e', source: 'Venue A', target: 'Execution' } },
                { data: { id: 'vb-e', source: 'Venue B', target: 'Execution' } }
            ]
        });
        
        // Optional: Add a custom layout
        cy.layout({
            name: 'breadthfirst',
            directed: true,
            padding: 30,
            spacingFactor: 1.5,
            animate: true,
            animationDuration: 1000
        }).run();
    } catch (error) {
        console.error('Error initializing Cytoscape graph:', error);
    }
}