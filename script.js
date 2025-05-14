document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabLinks = document.querySelectorAll('[data-tab]');
    const loading = document.getElementById('loading');
    const toast = document.getElementById('toast');
    const bookingForm = document.getElementById('bookingForm');
    const calculateButton = document.getElementById('calculateButton');
    const roomTypeSelect = document.getElementById('roomType');
    const roomNumberSelect = document.getElementById('roomNumber');
    const customerSearch = document.getElementById('customerSearch');
    const roomTabs = document.querySelectorAll('[data-room-filter]');
    const invoiceModal = document.getElementById('invoiceModal');
    const closeInvoiceModal = document.getElementById('closeInvoiceModal');
    const printInvoice = document.getElementById('printInvoice');
    const closeInvoiceBtn = document.getElementById('closeInvoiceBtn');
    const customerModal = document.getElementById('customerModal');
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    const closeCustomerModal = document.getElementById('closeCustomerModal');
    const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');
    const saveCustomerBtn = document.getElementById('saveCustomerBtn');
    const roomModal = document.getElementById('roomModal');
    const addRoomBtn = document.getElementById('addRoomBtn');
    const closeRoomModal = document.getElementById('closeRoomModal');
    const cancelRoomBtn = document.getElementById('cancelRoomBtn');
    const saveRoomBtn = document.getElementById('saveRoomBtn');
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const billingTabs = document.querySelectorAll('[data-billing-tab]');
    const loginForm = document.getElementById('loginForm');

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();

    // Mobile Navigation
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Tab Navigation
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            document.getElementById(tabId).classList.add('active');
            
            // Update active tab styling
            tabLinks.forEach(tab => {
                tab.parentElement.classList.remove('active');
            });
            link.parentElement.classList.add('active');
            
            // If dashboard tab, update charts
            if (tabId === 'dashboard') {
                updateDashboardCharts();
            }
        });
    });

    // Room Type Change Handler
    roomTypeSelect.addEventListener('change', updateRoomNumbers);

    function updateRoomNumbers() {
        const roomType = roomTypeSelect.value;
        roomNumberSelect.innerHTML = '<option value="">-- Select Room Number --</option>';
        
        if (!roomType) return;
        
        // Simulate fetching available rooms based on type
        showLoading();
        setTimeout(() => {
            let rooms = [];
            if (roomType === 'standard') {
                rooms = ['101', '102', '103', '104'];
            } else if (roomType === 'deluxe') {
                rooms = ['201', '202', '203'];
            } else if (roomType === 'suite') {
                rooms = ['301', '302'];
            } else if (roomType === 'executive') {
                rooms = ['401'];
            }
            
            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room;
                option.textContent = room;
                roomNumberSelect.appendChild(option);
            });
            hideLoading();
        }, 500);
    }

    // Booking Form Submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateBookingForm()) {
            showLoading();
            // Simulate form submission
            setTimeout(() => {
                hideLoading();
                showToast('Booking successful!', 'Your room has been booked successfully.', 'success');
                bookingForm.reset();
            }, 1500);
        }
    });

    function validateBookingForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const checkIn = document.getElementById('checkIn');
        const checkOut = document.getElementById('checkOut');
        const roomType = document.getElementById('roomType');
        const roomNumber = document.getElementById('roomNumber');
        
        // Reset errors
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        
        if (!name.value.trim()) {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        }
        
        if (!phone.value.trim()) {
            document.getElementById('phoneError').textContent = 'Phone is required';
            isValid = false;
        } else if (!/^\d{10,15}$/.test(phone.value)) {
            document.getElementById('phoneError').textContent = 'Invalid phone number';
            isValid = false;
        }
        
        if (!email.value.trim()) {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            document.getElementById('emailError').textContent = 'Invalid email address';
            isValid = false;
        }
        
        if (!checkIn.value) {
            document.getElementById('checkInError').textContent = 'Check-in date is required';
            isValid = false;
        }
        
        if (!checkOut.value) {
            document.getElementById('checkOutError').textContent = 'Check-out date is required';
            isValid = false;
        } else if (checkIn.value && new Date(checkOut.value) <= new Date(checkIn.value)) {
            document.getElementById('checkOutError').textContent = 'Check-out must be after check-in';
            isValid = false;
        }
        
        if (!roomType.value) {
            document.getElementById('roomTypeError').textContent = 'Room type is required';
            isValid = false;
        }
        
        if (!roomNumber.value) {
            document.getElementById('roomNumberError').textContent = 'Room number is required';
            isValid = false;
        }
        
        return isValid;
    }

    // Calculate Price Button
    calculateButton.addEventListener('click', () => {
        if (validateBookingForm()) {
            const roomType = roomTypeSelect.value;
            const checkIn = new Date(document.getElementById('checkIn').value);
            const checkOut = new Date(document.getElementById('checkOut').value);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            
            let basePrice = 0;
            switch (roomType) {
                case 'standard': basePrice = 100; break;
                case 'deluxe': basePrice = 150; break;
                case 'suite': basePrice = 250; break;
                case 'executive': basePrice = 350; break;
            }
            
            let extras = 0;
            if (document.getElementById('breakfast').checked) extras += 15 * nights;
            if (document.getElementById('airport').checked) extras += 50;
            if (document.getElementById('spa').checked) extras += 30 * nights;
            if (document.getElementById('parking').checked) extras += 20 * nights;
            
            const subtotal = basePrice * nights;
            const tax = subtotal * 0.1;
            const total = subtotal + tax + extras;
            
            showToast('Price Calculation', `Estimated total for ${nights} nights: $${total.toFixed(2)}`, 'info');
        }
    });

    // Customer Search
    customerSearch.addEventListener('input', () => {
        const searchTerm = customerSearch.value.toLowerCase();
        const rows = document.querySelectorAll('#customerTable tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Room Filter Tabs
    roomTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-room-filter');
            
            // Update active tab
            roomTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter rooms
            const rooms = document.querySelectorAll('.room-card');
            rooms.forEach(room => {
                if (filter === 'all' || room.getAttribute('data-type') === filter) {
                    room.style.display = '';
                } else {
                    room.style.display = 'none';
                }
            });
        });
    });

    // Room Status Filter
    document.getElementById('roomStatusFilter').addEventListener('change', filterRooms);
    document.getElementById('roomFloorFilter').addEventListener('change', filterRooms);

    function filterRooms() {
        const statusFilter = document.getElementById('roomStatusFilter').value;
        const floorFilter = document.getElementById('roomFloorFilter').value;
        const activeTab = document.querySelector('[data-room-filter].active').getAttribute('data-room-filter');
        
        const rooms = document.querySelectorAll('.room-card');
        rooms.forEach(room => {
            const type = room.getAttribute('data-type');
            const status = room.getAttribute('data-status');
            const floor = room.getAttribute('data-floor');
            
            const typeMatch = activeTab === 'all' || type === activeTab;
            const statusMatch = statusFilter === 'all' || status === statusFilter;
            const floorMatch = floorFilter === 'all' || floor === floorFilter;
            
            room.style.display = typeMatch && statusMatch && floorMatch ? '' : 'none';
        });
    }

    // Invoice Modal
    function openInvoiceModal() {
        invoiceModal.classList.add('active');
    }

    function closeInvoiceModal() {
        invoiceModal.classList.remove('active');
    }

    createInvoiceBtn.addEventListener('click', openInvoiceModal);
    closeInvoiceModal.addEventListener('click', closeInvoiceModal);
    closeInvoiceBtn.addEventListener('click', closeInvoiceModal);

    printInvoice.addEventListener('click', () => {
        window.print();
    });

    // Customer Modal
    function openCustomerModal() {
        customerModal.classList.add('active');
    }

    function closeCustomerModal() {
        customerModal.classList.remove('active');
    }

    addCustomerBtn.addEventListener('click', openCustomerModal);
    closeCustomerModal.addEventListener('click', closeCustomerModal);
    cancelCustomerBtn.addEventListener('click', closeCustomerModal);

    saveCustomerBtn.addEventListener('click', () => {
        // Validate and save customer
        showLoading();
        setTimeout(() => {
            hideLoading();
            showToast('Customer Added', 'New guest has been added successfully.', 'success');
            closeCustomerModal();
            // In a real app, you would update the customer table here
        }, 1000);
    });

    // Room Modal
    function openRoomModal() {
        roomModal.classList.add('active');
    }

    function closeRoomModal() {
        roomModal.classList.remove('active');
    }

    addRoomBtn.addEventListener('click', openRoomModal);
    closeRoomModal.addEventListener('click', closeRoomModal);
    cancelRoomBtn.addEventListener('click', closeRoomModal);

    saveRoomBtn.addEventListener('click', () => {
        // Validate and save room
        showLoading();
        setTimeout(() => {
            hideLoading();
            showToast('Room Added', 'New room has been added successfully.', 'success');
            closeRoomModal();
            // In a real app, you would update the rooms list here
        }, 1000);
    });

    // Billing Tabs
    billingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-billing-tab');
            
            // Update active tab
            billingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show the selected tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });

    // Login Form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            showLoading();
            // Simulate login
            setTimeout(() => {
                hideLoading();
                showToast('Login Successful', 'Welcome back! Redirecting to dashboard...', 'success');
                // In a real app, you would redirect or update the UI
            }, 1500);
        } else {
            showToast('Login Failed', 'Please enter both username and password.', 'error');
        }
    });

    // Dashboard Charts
    function updateDashboardCharts() {
        const ctx = document.getElementById('occupancyChart').getContext('2d');
        
        if (window.occupancyChart) {
            window.occupancyChart.destroy();
        }
        
        window.occupancyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Occupancy Rate (%)',
                    data: [65, 59, 70, 75, 82, 86, 90, 88, 85, 80, 75, 70],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Initialize dashboard charts if on dashboard
    if (document.getElementById('dashboard').classList.contains('active')) {
        updateDashboardCharts();
    }

    // Loading Spinner
    function showLoading() {
        loading.classList.add('active');
    }

    function hideLoading() {
        loading.classList.remove('active');
    }

    // Toast Notification
    function showToast(title, message, type) {
        const toastIcon = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${toastIcon[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="close-toast">&times;</button>
        `;
        
        toast.classList.add('active');
        
        // Close toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);
        
        // Close button
        toast.querySelector('.close-toast').addEventListener('click', () => {
            toast.classList.remove('active');
        });
    }

    // Initialize with sample data
    updateRoomNumbers();
});