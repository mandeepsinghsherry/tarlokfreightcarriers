/**
 * Tarlok Freight Carriers - Website Interactions & Logic
 * Author: Antigravity AI Coding Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // MOBILE DRAWER CONTROLS
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');
    const drawerItems = document.querySelectorAll('.drawer-item');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    
    // Close drawer when menu link is clicked
    drawerItems.forEach(item => {
        item.addEventListener('click', closeDrawer);
    });


    // ==========================================================================
    // ACTIVE STATE HEADER MENU ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu .nav-item');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold offset for frosted glass sticky header height
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            // If home is in viewport or scroll is near top
            if (window.scrollY < 200 && item.getAttribute('href') === '#') {
                item.classList.add('active');
            } else if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });


    // ==========================================================================
    // INTERACTIVE AREAS "PUNJAB ROUTES" FILTER & SEARCH
    // ==========================================================================
    const citySearchInput = document.getElementById('citySearchInput');
    const btnSearchCity = document.getElementById('btnSearchCity');
    const citySearchResults = document.getElementById('citySearchResults');
    const areaTagCards = document.querySelectorAll('.area-tag-card');

    // Rich database of route transit times and schedules from Amritsar Hub
    const punjabRoutesDb = {
        'amritsar': {
            name: 'Amritsar (Base Headquarters)',
            freq: 'Continuous Local Dispatches',
            transit: 'Immediate delivery (under 1 hour) across Amritsar municipal bounds.',
            fleet: 'Tata Ace, Mahindra Pik-Up, heavy trailers on stand-by.'
        },
        'ludhiana': {
            name: 'Ludhiana Hub',
            freq: '3 Daily Scheduled Routes',
            transit: 'Leaves Amritsar at 06:00 AM, 11:00 AM, and 04:00 PM. Transit time: 2.5 - 3 hours.',
            fleet: 'Tata 407, 14-Feet open body, 19-Feet closed container trucks.'
        },
        'jalandhar': {
            name: 'Jalandhar Junction',
            freq: '4 Daily Scheduled Routes',
            transit: 'Leaves Amritsar every 3 hours starting at 07:00 AM. Transit time: 1.5 - 2 hours.',
            fleet: 'Mahindra Bolero Pik-Up, Tata 407, Tata 610.'
        },
        'patiala': {
            name: 'Patiala District',
            freq: '2 Daily Scheduled Routes',
            transit: 'Leaves Amritsar at 05:30 AM and 01:00 PM. Transit time: 4 - 4.5 hours.',
            fleet: 'Tata 1109, 19-Feet containers, 22-Feet multi-axle freight carriers.'
        },
        'bathinda': {
            name: 'Bathinda Industrial Link',
            freq: '2 Daily Scheduled Routes',
            transit: 'Leaves Amritsar at 05:00 AM and 12:00 PM. Transit time: 5 - 6 hours.',
            fleet: '20-Feet Open Body, Tata 1109, Multi-Axle heavy transport.'
        },
        'mohali': {
            name: 'Mohali Industrial Area',
            freq: '2 Daily Scheduled Routes',
            transit: 'Leaves Amritsar at 06:00 AM and 02:00 PM. Transit: 4.5 hours via NH-3.',
            fleet: 'Tata 407, Tata 1109, 19-Feet High-speed logistics container.'
        },
        'chandigarh': {
            name: 'Chandigarh Area Border',
            freq: '2 Daily Scheduled Routes',
            transit: 'Leaves Amritsar at 06:00 AM and 02:00 PM. Transit: 4.5 - 5 hours.',
            fleet: ' Tata 407, Tata 1109, closed cargo containers.'
        },
        'hoshiarpur': {
            name: 'Hoshiarpur Foothills Route',
            freq: '1 Daily Route',
            transit: 'Leaves Amritsar at 07:30 AM. Transit: 3 hours.',
            fleet: 'Tata 407, Mahindra Pik-Up.'
        },
        'gurdaspur': {
            name: 'Gurdaspur Route',
            freq: 'Daily Continuous Dispatch',
            transit: 'Leaves Amritsar twice daily at 08:00 AM and 03:00 PM. Transit: 1.5 hours.',
            fleet: 'Tata Ace, Mahindra Pik-Up, Tata 407.'
        },
        'pathankot': {
            name: 'Pathankot Junction',
            freq: '2 Daily Routes',
            transit: 'Leaves Amritsar at 07:00 AM and 02:00 PM. Transit: 2.5 hours.',
            fleet: 'Tata 407, Tata 1109, Heavy duty multi-axle.'
        },
        'tarn taran': {
            name: 'Tarn Taran border routes',
            freq: 'Continuous Daily Dispatch (Hourly)',
            transit: 'Hourly local shuttles from our main Amritsar yard. Transit: 30 - 45 minutes.',
            fleet: 'Tata Ace, Mahindra Bolero Pik-Up.'
        },
        'moga': {
            name: 'Moga Agricultural Hub',
            freq: 'Daily Scheduled Route',
            transit: 'Leaves Amritsar at 08:30 AM. Transit: 3 hours.',
            fleet: 'Mahindra Bolero Pik-Up, Tata 407, agricultural tractors support.'
        },
        'sangrur': {
            name: 'Sangrur Route',
            freq: 'Daily Route',
            transit: 'Leaves Amritsar at 06:00 AM. Transit: 4.5 hours.',
            fleet: 'Tata 1109, Open Body trucks.'
        },
        'ferozepur': {
            name: 'Ferozepur Frontier Route',
            freq: 'Daily Scheduled Route',
            transit: 'Leaves Amritsar at 08:00 AM. Transit: 3.5 hours.',
            fleet: 'Tata 407, Mahindra Pik-Up.'
        },
        'kapurthala': {
            name: 'Kapurthala District',
            freq: '2 Daily Routes',
            transit: 'Leaves Amritsar at 08:00 AM and 02:00 PM. Transit: 1.5 hours.',
            fleet: 'Mahindra Pik-Up, Tata 407.'
        },
        'faridkot': {
            name: 'Faridkot Link',
            freq: 'Daily Scheduled Route',
            transit: 'Leaves Amritsar at 07:00 AM. Transit: 4 hours.',
            fleet: 'Tata 407, Tata 1109.'
        },
        'barnala': {
            name: 'Barnala Area Route',
            freq: 'Daily Scheduled Route',
            transit: 'Leaves Amritsar at 06:30 AM. Transit: 4.5 hours.',
            fleet: 'Tata 1109, open container logistics.'
        },
        'jaipur': {
            name: 'Jaipur (Rajasthan Hub)',
            freq: 'Daily Express Route',
            transit: 'Leaves Amritsar yard at 04:30 AM daily. Transit time: 10 - 12 hours via NH-54.',
            fleet: 'Tata 1109, 19-Feet closed high-speed containers, heavy-duty B2B cargo trailers.'
        },
        'jodhpur': {
            name: 'Jodhpur Express Corridor',
            freq: 'Daily Route',
            transit: 'Leaves Amritsar at 05:00 AM. Transit time: 12 - 13 hours.',
            fleet: 'Heavy trailers, 22-Feet closed logistics cargo boxes.'
        },
        'udaipur': {
            name: 'Udaipur Connection',
            freq: 'Alternate Days (Mon, Wed, Fri)',
            transit: 'Leaves Amritsar at 04:00 AM. Transit time: 15 hours.',
            fleet: 'Multi-axle open containers, specialized logistics machinery trucks.'
        },
        'bikaner': {
            name: 'Bikaner Link Route',
            freq: 'Daily Cargo Dispatches',
            transit: 'Leaves Amritsar at 05:30 AM. Transit time: 7 - 8 hours.',
            fleet: 'Tata 407, Tata 1109, closed standard containers.'
        },
        'hanumangarh': {
            name: 'Hanumangarh Frontier Corridors',
            freq: 'Continuous Daily Dispatch (Twice Daily)',
            transit: 'Leaves Amritsar at 07:00 AM and 03:00 PM. Transit time: 4 - 4.5 hours.',
            fleet: 'Mahindra Bolero Pik-Up, Tata 407.'
        },
        'ganganagar': {
            name: 'Sri Ganganagar Corridor',
            freq: 'Continuous Daily Dispatch (Twice Daily)',
            transit: 'Leaves Amritsar at 07:00 AM and 03:00 PM. Stop #9 (Rajasthan Gateway). Transit time: 4 hours.',
            fleet: 'Mahindra Bolero Pik-Up, Tata 407.'
        },
        'zira': {
            name: 'Zira Stop (TFC Amritsar-Jaipur Corridor)',
            freq: 'Daily Scheduled Route',
            transit: 'Leaves Amritsar base yard at 06:00 AM. Stop #3. Transit time: 1.5 hours.',
            fleet: 'Tata 407, Mahindra Bolero Pik-Up.'
        },
        'kotkapura': {
            name: 'Kotkapura Stop (TFC Amritsar-Jaipur Corridor)',
            freq: 'Daily Scheduled Route',
            transit: 'Leaves Amritsar base yard at 06:00 AM. Stop #5. Transit time: 3 hours.',
            fleet: 'Tata 407, Tata 1109.'
        },
        'malout': {
            name: 'Malout Stop (TFC Amritsar-Jaipur Corridor)',
            freq: 'Daily Scheduled Route',
            transit: 'Leaves Amritsar base yard at 06:00 AM. Stop #7. Transit time: 5.5 hours.',
            fleet: 'Tata 1109, closed standard container.'
        },
        'abohar': {
            name: 'Abohar Hub (TFC Amritsar-Jaipur Corridor)',
            freq: 'Daily Express Dispatch',
            transit: 'Leaves Amritsar base yard at 06:00 AM. Stop #8. Transit time: 6.5 hours.',
            fleet: 'Tata 1109, B2B open freight trailers.'
        },
        'suratgarh': {
            name: 'Suratgarh Stop (TFC Amritsar-Jaipur Corridor)',
            freq: 'Daily Express Dispatch',
            transit: 'Leaves Amritsar base yard at 06:00 AM. Stop #10. Transit time: 8 hours.',
            fleet: 'Heavy trailers, closed container transport.'
        },
        'nagaur': {
            name: 'Nagaur Stop (TFC Amritsar-Jaipur Corridor)',
            freq: 'Daily Express Dispatch',
            transit: 'Leaves Amritsar base yard at 06:00 AM. Stop #12. Transit time: 13 hours.',
            fleet: 'Heavy commercial container trucks.'
        },
        'kuchaman': {
            name: 'Kuchaman City Stop (TFC Amritsar-Jaipur Corridor)',
            freq: 'Daily Express Dispatch',
            transit: 'Leaves Amritsar base yard at 06:00 AM. Stop #13. Transit time: 14 hours.',
            fleet: 'Heavy commercial container trucks, multi-axle freight.'
        }
    };

    function searchRoute() {
        const query = citySearchInput.value.toLowerCase().trim();
        
        if (query === '') {
            citySearchResults.classList.add('hidden');
            // Restore all cards to normal
            areaTagCards.forEach(card => {
                card.classList.remove('highlight', 'dimmed');
            });
            return;
        }

        let bestMatch = null;
        let bestMatchKey = '';

        // Perform prefix and fuzzy matching on Punjab routes
        Object.keys(punjabRoutesDb).forEach(key => {
            if (key.includes(query) || query.includes(key)) {
                bestMatch = punjabRoutesDb[key];
                bestMatchKey = key;
            }
        });

        // Highlight matching card in the grid
        areaTagCards.forEach(card => {
            const cardCity = card.getAttribute('data-city');
            if (bestMatchKey && cardCity.includes(bestMatchKey)) {
                card.classList.add('highlight');
                card.classList.remove('dimmed');
                // Scroll the matching card slightly into view within container
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                card.classList.remove('highlight');
                card.classList.add('dimmed');
            }
        });

        if (bestMatch) {
            citySearchResults.innerHTML = `
                <h4><i class="fa-solid fa-route text-saffron"></i> Daily Schedule: ${bestMatch.name}</h4>
                <p><strong>Frequency:</strong> ${bestMatch.freq}</p>
                <p><strong>Estimated Transit Time:</strong> ${bestMatch.transit}</p>
                <p><strong>Common Fleet Dedicated:</strong> ${bestMatch.fleet}</p>
                <p class="text-slate-400" style="font-size: 0.8rem; margin-top: 8px;">
                    *Time excludes extreme peak border checkpoint congestion. Perfect for retail & commercial stock.*
                </p>
            `;
            citySearchResults.classList.remove('hidden');
        } else {
            // Check if user is asking for somewhere outside Punjab & Rajasthan
            const nonRouteStates = ['delhi', 'haryana', 'himachal', 'up', 'uttar', 'kashmir', 'mumbai', 'gujarat'];
            let isOut = false;
            nonRouteStates.forEach(st => {
                if (query.includes(st)) isOut = true;
            });

            if (isOut) {
                citySearchResults.innerHTML = `
                    <h4 class="text-saffron"><i class="fa-solid fa-triangle-exclamation"></i> Routes Outside Service Bounds</h4>
                    <p>Tarlok Freight Carriers operates **exclusively within Punjab & Rajasthan**. We do not service other states at this moment to guarantee highly focused, safe regional logistics services.</p>
                `;
            } else {
                citySearchResults.innerHTML = `
                    <h4><i class="fa-solid fa-circle-question"></i> District Not Found</h4>
                    <p>We definitely serve all areas in Punjab, including smaller villages. Please call our central dispatch desk at <strong>+91 94653 82532</strong> to get an instant route schedule for "<strong>${citySearchInput.value}</strong>".</p>
                `;
            }
            citySearchResults.classList.remove('hidden');
        }
    }

    if (btnSearchCity) btnSearchCity.addEventListener('click', searchRoute);
    if (citySearchInput) {
        citySearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchRoute();
            } else if (citySearchInput.value === '') {
                searchRoute(); // Reset grid if empty
            }
        });
    }


    // ==========================================================================
    // TARIFF ESTIMATION & INTEGRATED CALCULATOR
    // ==========================================================================
    const calcWeight = document.getElementById('calcWeight');
    const calcDest = document.getElementById('calcDest');
    const calcOutput = document.getElementById('calcOutput');
    const calcFare = document.getElementById('calcFare');

    // Reference inputs in main form to auto-populate
    const mainWeight = document.getElementById('goodsWeight');
    const mainPickup = document.getElementById('pickupLoc');
    const mainDelivery = document.getElementById('deliveryLoc');

    function calculateEstimate() {
        const weightVal = calcWeight.value;
        const distVal = parseInt(calcDest.value);

        if (!weightVal || !distVal) return;

        let multiplier = 1;
        let baseFare = 1000;
        let ratePerKm = 10;

        switch (weightVal) {
            case 'light': // Under 500kg
                multiplier = 1.0;
                baseFare = 800;
                ratePerKm = 8;
                break;
            case 'medium': // 500kg - 2t
                multiplier = 1.4;
                baseFare = 1400;
                ratePerKm = 14;
                break;
            case 'heavy': // 2t - 5t
                multiplier = 2.2;
                baseFare = 2800;
                ratePerKm = 24;
                break;
            case 'bulk': // 5t+
                multiplier = 3.5;
                baseFare = 5000;
                ratePerKm = 45;
                break;
        }

        const calculated = baseFare + (distVal * ratePerKm);
        const lowerBound = Math.round(calculated * 0.95);
        const upperBound = Math.round(calculated * 1.10);

        // Format to Indian Rupees Currency
        calcFare.innerText = `₹ ${lowerBound.toLocaleString('en-IN')} - ₹ ${upperBound.toLocaleString('en-IN')}`;
        calcOutput.classList.remove('hidden');

        // AUTO-POPULATE corresponding inputs in main form to save B2B users time!
        if (mainWeight) mainWeight.value = weightVal;
        
        if (mainPickup && !mainPickup.value) {
            mainPickup.value = "Amritsar Hub (Default)";
        }
        
        if (mainDelivery) {
            // Find destination text from selected option
            const selectedDestText = calcDest.options[calcDest.selectedIndex].text;
            const cityName = selectedDestText.split('/')[0].trim();
            mainDelivery.value = cityName;
        }
    }

    if (calcWeight) calcWeight.addEventListener('change', calculateEstimate);
    if (calcDest) calcDest.addEventListener('change', calculateEstimate);


    // ==========================================================================
    // TOAST NOTIFICATIONS SYSTEM
    // ==========================================================================
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
        
        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <span class="toast-message">${message}</span>
            <span class="toast-close">&times;</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Setup close click
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, 5000);
    }


    // ==========================================================================
    // BOOKING FORM VALIDATION & WHATSAPP REDIRECT BINDINGS
    // ==========================================================================
    const bookingForm = document.getElementById('bookingForm');
    const btnSubmitForm = document.getElementById('btnSubmitForm');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    if (bookingForm) {
        // Set minimum preferred date to today
        const shippingDateInput = document.getElementById('shippingDate');
        if (shippingDateInput) {
            const today = new Date().toISOString().split('T')[0];
            shippingDateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Client data extraction
            const clientName = document.getElementById('clientName').value.trim();
            const clientPhone = document.getElementById('clientPhone').value.trim();
            const clientWhatsApp = document.getElementById('clientWhatsApp').value.trim() || clientPhone;
            const pickupLoc = document.getElementById('pickupLoc').value.trim();
            const deliveryLoc = document.getElementById('deliveryLoc').value.trim();
            const goodsTypeSelect = document.getElementById('goodsType');
            const goodsTypeName = goodsTypeSelect.options[goodsTypeSelect.selectedIndex].text;
            const weightSelect = document.getElementById('goodsWeight');
            const weightName = weightSelect.options[weightSelect.selectedIndex].text;
            const shippingDate = document.getElementById('shippingDate').value;
            const clientMsg = document.getElementById('clientMsg').value.trim() || 'No special instructions.';

            // Clean and validate Indian phone number format
            let cleanPhone = clientPhone.replace(/\D/g, ''); // strip non-digits
            if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
                cleanPhone = cleanPhone.slice(2);
            } else if (cleanPhone.length > 10 && cleanPhone.startsWith('0')) {
                cleanPhone = cleanPhone.slice(1);
            }

            if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
                showToast("Please enter a valid 10-digit mobile number (e.g., 9876543210).", "error");
                return;
            }

            // Lock submit button with beautiful loading spinner
            btnSubmitForm.disabled = true;
            btnText.innerText = "Processing Quote Request...";
            btnSpinner.classList.remove('hidden');

            // Send the form data to info@tarlokfreightcarriers.com
            fetch("https://formsubmit.co/ajax/info@tarlokfreightcarriers.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "Customer Name": clientName,
                    "Phone Number": clientPhone,
                    "WhatsApp Number": clientWhatsApp,
                    "Pickup Location": pickupLoc,
                    "Delivery Destination": deliveryLoc,
                    "Cargo Type": goodsTypeName,
                    "Cargo Weight": weightName,
                    "Preferred Shipping Date": shippingDate,
                    "Special Instructions": clientMsg
                })
            })
            .then(response => {
                // Clear submission UI states
                btnSubmitForm.disabled = false;
                btnText.innerText = "Request Booking Quote";
                btnSpinner.classList.add('hidden');

                if (response.ok) {
                    showToast(`Thank you, ${clientName}! Your request has been sent to info@tarlokfreightcarriers.com.`, "success");
                } else {
                    showToast("Quote request submitted successfully.", "success");
                }

                // WhatsApp redirection template: Creates a professional structured text message
                const formattedMessage = `Hello Tarlok Freight Carriers! I would like to book a transport vehicle. Here are my details:
----------------------------------------
👤 *Customer Name*: ${clientName}
📞 *Phone*: ${clientPhone}
🟢 *WhatsApp*: ${clientWhatsApp}
📍 *Pickup Location*: ${pickupLoc}
🏁 *Delivery Destination*: ${deliveryLoc} (Punjab & Rajasthan)
📦 *Cargo Type*: ${goodsTypeName}
⚖️ *Estimated Weight*: ${weightName}
📅 *Preferred Shipping Date*: ${shippingDate}
📝 *Special Instructions*: ${clientMsg}
----------------------------------------
Please estimate my fare and allocate a vehicle. Thanks!`;

                const whatsappUrl = `https://wa.me/919465382532?text=${encodeURIComponent(formattedMessage)}`;
                
                // Show follow-up WhatsApp recommendation toast
                setTimeout(() => {
                    showToast("Redirecting to WhatsApp to send booking details directly to our booking yard...", "success");
                    
                    // Redirect to WhatsApp in the current window to bypass browser popup blockers
                    setTimeout(() => {
                        window.location.href = whatsappUrl;
                        bookingForm.reset();
                        if (calcOutput) calcOutput.classList.add('hidden');
                        if (calcWeight) calcWeight.value = "";
                        if (calcDest) calcDest.value = "";
                    }, 1000);
                }, 1500);
            })
            .catch(error => {
                console.error("Email submission error:", error);
                
                // Fallback: Proceed to WhatsApp redirect even if email submission fails
                btnSubmitForm.disabled = false;
                btnText.innerText = "Request Booking Quote";
                btnSpinner.classList.add('hidden');
                
                showToast("Connecting to WhatsApp to complete your request...", "success");
                
                const formattedMessage = `Hello Tarlok Freight Carriers! I would like to book a transport vehicle. Here are my details:
----------------------------------------
👤 *Customer Name*: ${clientName}
📞 *Phone*: ${clientPhone}
🟢 *WhatsApp*: ${clientWhatsApp}
📍 *Pickup Location*: ${pickupLoc}
🏁 *Delivery Destination*: ${deliveryLoc} (Punjab & Rajasthan)
📦 *Cargo Type*: ${goodsTypeName}
⚖️ *Estimated Weight*: ${weightName}
📅 *Preferred Shipping Date*: ${shippingDate}
📝 *Special Instructions*: ${clientMsg}
----------------------------------------
Please estimate my fare and allocate a vehicle. Thanks!`;

                const whatsappUrl = `https://wa.me/919465382532?text=${encodeURIComponent(formattedMessage)}`;
                
                setTimeout(() => {
                    window.location.href = whatsappUrl;
                    bookingForm.reset();
                    if (calcOutput) calcOutput.classList.add('hidden');
                    if (calcWeight) calcWeight.value = "";
                    if (calcDest) calcDest.value = "";
                }, 1000);
            });
        });
    }


    // ==========================================================================
    // MODERN INTERSECTION OBSERVER SCROLL REVEALS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is in view
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits bottom of viewport
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Make Hero content animate on page load immediately
    const animateElements = document.querySelectorAll('.animate-up');
    animateElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 150 * index);
    });
});
