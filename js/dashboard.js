document.addEventListener('DOMContentLoaded', () => {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const contentSections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('page-title');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const ctx = document.getElementById('revenueChart').getContext('2d');
        let revenueChart; // Declare here to be accessible in the scope

        // --- Navigation Logic ---
        function switchTab(hash) {
            hash = hash || window.location.hash || '#dashboard';
            
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active');
                }
            });

            contentSections.forEach(section => {
                if ('#' + section.id === hash) {
                    section.classList.remove('hidden');
                    pageTitle.textContent = section.id.charAt(0).toUpperCase() + section.id.slice(1);
                } else {
                    section.classList.add('hidden');
                }
            });
        }

        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const hash = link.getAttribute('href');
                history.pushState(null, null, hash);
                switchTab(hash);
                 if (window.innerWidth < 1024) {
                    sidebar.classList.add('-translate-x-full');
                }
            });
        });

        window.addEventListener('popstate', () => switchTab());
        
        // --- Mobile Menu Toggle ---
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });

        // --- Dark Mode & Chart Logic ---
        function applyDarkModeUI(isDark) {
            if (isDark) {
                document.body.classList.add('dark');
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark');
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('darkMode', 'disabled');
            }
        }
        
        function updateChartColors(isDark) {
            if (!revenueChart) return; // Safety check
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const textColor = isDark ? '#e2e8f0' : '#333';
            
            revenueChart.options.scales.y.ticks.color = textColor;
            revenueChart.options.scales.x.ticks.color = textColor;
            revenueChart.options.scales.y.grid.color = gridColor;
            revenueChart.options.scales.x.grid.color = gridColor;
            revenueChart.options.plugins.legend.labels.color = textColor;
            revenueChart.update();
        }

        function createChart(isDark) {
             const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
             const textColor = isDark ? '#e2e8f0' : '#333';

             revenueChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli'],
                    datasets: [{
                        label: 'Pendapatan',
                        data: [1200000, 1900000, 1500000, 2200000, 1800000, 2550000],
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                        pointRadius: 4,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value, index, values) {
                                    return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
                                },
                                color: textColor
                            },
                             grid: {
                                color: gridColor
                            }
                        },
                        x: {
                             ticks: {
                                color: textColor
                            },
                             grid: {
                                color: gridColor
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    }
                }
            });
        }

        // --- Initialization ---
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedMode = localStorage.getItem('darkMode');
        const isDarkMode = savedMode === 'enabled' || (savedMode === null && prefersDark);
        
        // Initial page setup
        switchTab(); 
        applyDarkModeUI(isDarkMode);
        createChart(isDarkMode);

        // Event listener for dark mode toggle
        darkModeToggle.addEventListener('click', () => {
            const newIsDark = !document.body.classList.contains('dark');
            applyDarkModeUI(newIsDark);
            updateChartColors(newIsDark);
        });
    });