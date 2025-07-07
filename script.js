document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const searchResults = document.getElementById('searchResults');
    const apiError = document.getElementById('apiError');

    // Debug check for elements
    console.log('Initializing search functionality...');

    // Check if API keys are configured
    function checkApiConfiguration() {
        if (!window.config || !window.config.OPENCAGE_API_KEY || !window.config.TIMEZONEDB_API_KEY || !window.config.UNSPLASH_ACCESS_KEY) {
            apiError.style.display = 'block';
            return false;
        }
        apiError.style.display = 'none';
        return true;
    }

    // Function to show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'result-card error';
        errorDiv.innerHTML = `<p>⚠️ ${message}</p>`;
        searchResults.innerHTML = '';
        searchResults.appendChild(errorDiv);
        searchResults.classList.add('active');
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Function to fetch location data from OpenCage
    async function fetchLocationData(query) {
        try {
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${config.OPENCAGE_API_KEY}&limit=5`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`OpenCage API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status.code !== 200) {
                throw new Error(data.status.message);
            }
            
            return data.results;
        } catch (error) {
            console.error('Error fetching location data:', error);
            showError(`Failed to fetch location data: ${error.message}`);
            return [];
        }
    }

    // Function to fetch timezone data from TimeZoneDB
    async function fetchTimezone(lat, lng) {
        try {
            // Using HTTPS for TimeZoneDB
            const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${config.TIMEZONEDB_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`TimeZoneDB API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'OK') {
                throw new Error(data.message || 'TimeZoneDB request failed');
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching timezone:', error);
            return null;
        }
    }

    // Function to fetch image from Unsplash
    async function fetchLocationImage(query) {
        try {
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${config.UNSPLASH_API_KEY}&per_page=1`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Unsplash API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.results[0]?.urls?.regular || null;
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    }

    // Function to format time
    function formatTime(timestamp) {
        try {
            const date = new Date(timestamp * 1000);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Time unavailable';
        }
    }

    // Function to create result card
    function createResultCard(location, timeZone, imageUrl) {
        const formattedTime = timeZone ? formatTime(timeZone.timestamp) : 'Time unavailable';
        const timeZoneName = timeZone ? timeZone.zoneName : 'Unknown timezone';
        
        return `
            <div class="result-card">
                <div class="local-time">
                    Current Local Time (${timeZoneName}): ${formattedTime}
                </div>
                <img src="${imageUrl || 'https://via.placeholder.com/400x200'}" alt="${location.formatted}" class="destination-image">
                <div class="destination-info">
                    <h2>${location.formatted}</h2>
                    <p>${location.components.country || 'Location details unavailable'}</p>
                    <a href="#" class="visit-button">Visit</a>
                </div>
            </div>
        `;
    }

    // Search handler
    async function handleSearch() {
        if (!checkApiConfiguration()) return;

        const query = searchInput.value.trim();
        
        if (!query) {
            showError('Please enter a search term');
            return;
        }

        try {
            // Show loading state
            searchResults.innerHTML = '<div class="result-card loading">Searching...</div>';
            searchResults.classList.add('active');

            // Fetch location data
            const locations = await fetchLocationData(query);
            
            if (locations.length === 0) {
                showError('No results found');
                return;
            }

            // Process each location
            const resultsHTML = await Promise.all(locations.map(async (location) => {
                const timeZone = await fetchTimezone(location.geometry.lat, location.geometry.lng);
                const imageUrl = await fetchLocationImage(`${location.formatted} landmark`);
                return createResultCard(location, timeZone, imageUrl);
            }));

            // Update results
            searchResults.innerHTML = resultsHTML.join('');

        } catch (error) {
            console.error('Error in search:', error);
            showError(`Search failed: ${error.message}`);
        }
    }

    // Event listeners
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
        });
    }

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && 
            !searchInput.contains(e.target) && 
            !searchButton.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Debounced search for input changes
    const debouncedSearch = debounce(() => {
        if (searchInput.value.trim().length >= 3) {
            handleSearch();
        }
    }, 500);

    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
    }

    console.log('Search functionality initialized');

    // Book Now button functionality
    const bookNowButton = document.querySelector('.cta-button');
    bookNowButton.addEventListener('click', () => {
        // Here you would typically redirect to a booking page
        alert('Redirecting to booking page...');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', checkApiConfiguration);
}); 