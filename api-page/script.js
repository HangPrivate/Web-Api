document.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const body = document.body;
    body.classList.add("no-scroll");

    // Animated loading dots
    const loadingDotsAnimation = setInterval(() => {
        const loadingDots = document.querySelector(".loading-dots");
        if (loadingDots) {
            if (loadingDots.textContent === '...') {
                loadingDots.textContent = '.';
            } else {
                loadingDots.textContent += '.';
            }
        }
    }, 500);

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggleBtn').innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Theme toggle functionality
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        // Update icon with animation
        const btn = document.getElementById('themeToggleBtn');
        btn.classList.add('theme-toggle-spin');
        setTimeout(() => {
            btn.innerHTML = isDarkMode ? 
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            setTimeout(() => {
                btn.classList.remove('theme-toggle-spin');
            }, 150);
        }, 150);
    });

    // Clear search button functionality
    document.getElementById('clearSearch').addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        searchInput.focus();
        // Trigger input event to update the search results
        searchInput.dispatchEvent(new Event('input'));
    });

    // Copy to clipboard functionality
    document.getElementById('copyEndpoint').addEventListener('click', () => {
        copyToClipboard('apiEndpoint');
    });
    
    document.getElementById('copyResponse').addEventListener('click', () => {
        copyToClipboard('apiResponseContent');
    });

    function copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = elementId === 'apiEndpoint' ? 
                document.getElementById('copyEndpoint') : 
                document.getElementById('copyResponse');
            
            // Show success animation
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.classList.add('copy-success');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="far fa-copy"></i>';
                btn.classList.remove('copy-success');
            }, 1500);
        });
    }

    try {
        const settings = await fetch('/src/settings.json').then(res => res.json());

        const setContent = (id, property, value) => {
            const element = document.getElementById(id);
            if (element) element[property] = value;
        };
        
        // Set page content from settings
        setContent('page', 'textContent', settings.name || "Falcon-Api");
        setContent('wm', 'textContent', `© ${new Date().getFullYear()} ${settings.apiSettings.creator}. All rights reserved.` || `© ${new Date().getFullYear()} FlowFalcon. All rights reserved.`);
        setContent('header', 'textContent', settings.name || "Falcon-Api");
        setContent('name', 'textContent', settings.name || "Falcon-Api");
        setContent('version', 'textContent', settings.version || "v1.0");
        setContent('versionHeader', 'textContent', settings.header.status || "Online!");
        setContent('description', 'textContent', settings.description || "Simple and easy to use API.");

        // Set banner image
        const dynamicImage = document.getElementById('dynamicImage');
        if (dynamicImage && settings.bannerImage) {
            dynamicImage.src = settings.bannerImage;
        }

        // Create API content
        const apiContent = document.getElementById('apiContent');
        
        settings.categories.forEach((category, categoryIndex) => {
            const sortedItems = category.items.sort((a, b) => a.name.localeCompare(b.name));
            
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            categorySection.dataset.category = category.name.toLowerCase();
            
            const categoryHeader = document.createElement('h3');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category.name;
            categorySection.appendChild(categoryHeader);
            
            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'api-grid';
            
            sortedItems.forEach((item, index) => {
                const itemCard = document.createElement('div');
                itemCard.className = 'api-item';
                itemCard.dataset.name = item.name.toLowerCase();
                itemCard.dataset.desc = item.desc.toLowerCase();
                itemCard.style.animationDelay = `${(index * 0.05) + (categoryIndex * 0.1)}s`;
                
                const cardContent = document.createElement('div');
                cardContent.className = 'hero-section';
                
                const infoDiv = document.createElement('div');
                
                const itemTitle = document.createElement('h5');
                itemTitle.textContent = item.name;
                
                const itemDesc = document.createElement('p');
                itemDesc.className = 'text-muted';
                itemDesc.textContent = item.desc;
                
                infoDiv.appendChild(itemTitle);
                infoDiv.appendChild(itemDesc);
                
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'api-actions';
                
                const getBtn = document.createElement('button');
                getBtn.className = 'get-api-btn';
                getBtn.textContent = 'GET';
                getBtn.dataset.apiPath = item.path;
                getBtn.dataset.apiName = item.name;
                getBtn.dataset.apiDesc = item.desc;
                
                // Add API status indicator
                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'api-status';
                
                // Set status based on item.status (or default to "ready")
                const status = item.status || "ready";
                let statusClass, statusIcon;
                
                switch(status) {
                    case "error":
                        statusClass = "status-error";
                        statusIcon = "fa-exclamation-circle";
                        break;
                    case "update":
                        statusClass = "status-update";
                        statusIcon = "fa-arrow-up";
                        break;
                    default: // "ready"
                        statusClass = "status-ready";
                        statusIcon = "fa-circle";
                }
                
                statusIndicator.classList.add(statusClass);
                const icon = document.createElement('i');
                icon.className = `fas ${statusIcon}`;
                statusIndicator.appendChild(icon);
                
                const statusText = document.createElement('span');
                statusText.textContent = status;
                statusIndicator.appendChild(statusText);
                
                actionsDiv.appendChild(getBtn);
                actionsDiv.appendChild(statusIndicator);
                
                cardContent.appendChild(infoDiv);
                cardContent.appendChild(actionsDiv);
                
                itemCard.appendChild(cardContent);
                itemsGrid.appendChild(itemCard);
            });
            
            categorySection.appendChild(itemsGrid);
            apiContent.appendChild(categorySection);
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            // Show/hide clear button based on search input
            if (searchTerm.length > 0) {
                clearSearchBtn.style.opacity = '1';
                clearSearchBtn.style.pointerEvents = 'auto';
            } else {
                clearSearchBtn.style.opacity = '0';
                clearSearchBtn.style.pointerEvents = 'none';
            }
            
            const apiItems = document.querySelectorAll('.api-item');
            const categorySections = document.querySelectorAll('.category-section');
            let hasResults = false;

            apiItems.forEach(item => {
                const name = item.dataset.name;
                const desc = item.dataset.desc;
                
                if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                    item.style.display = '';
                    hasResults = true;
                } else {
                    item.style.display = 'none';
                }
            });

            categorySections.forEach(section => {
                const visibleItems = section.querySelectorAll('.api-item[style=""]');
                if (visibleItems.length) {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Handle no results
            const existingNoResults = document.getElementById('noResultsMessage');
            if (existingNoResults) {
                existingNoResults.remove();
            }
            
            if (!hasResults && searchTerm.length > 0) {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResultsMessage';
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No results found for "<span>${searchTerm}</span>"</p>
                    <button id="clearSearchFromMsg" class="btn">Clear Search</button>
                `;
                apiContent.appendChild(noResultsMsg);
                
                document.getElementById('clearSearchFromMsg').addEventListener('click', () => {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                    searchInput.focus();
                });
            }
        });

        // API Button click handler
        document.addEventListener('click', event => {
            if (!event.target.classList.contains('get-api-btn')) return;

            const { apiPath, apiName, apiDesc } = event.target.dataset;
            const modal = new bootstrap.Modal(document.getElementById('apiResponseModal'));
            const modalRefs = {
                label: document.getElementById('apiResponseModalLabel'),
                desc: document.getElementById('apiResponseModalDesc'),
                content: document.getElementById('apiResponseContent'),
                container: document.getElementById('responseContainer'),
                endpoint: document.getElementById('apiEndpoint'),
                spinner: document.getElementById('apiResponseLoading'),
                queryInputContainer: document.getElementById('apiQueryInputContainer'),
                submitBtn: document.getElementById('submitQueryBtn')
            };

            // Reset modal
            modalRefs.label.textContent = apiName;
            modalRefs.desc.textContent = apiDesc;
            modalRefs.content.textContent = '';
            modalRefs.endpoint.textContent = '';
            modalRefs.spinner.classList.add('d-none');
            modalRefs.content.classList.add('d-none');
            modalRefs.container.classList.add('d-none');
            modalRefs.endpoint.classList.add('d-none');

            modalRefs.queryInputContainer.innerHTML = '';
            modalRefs.submitBtn.classList.add('d-none');

            let baseApiUrl = `${window.location.origin}${apiPath}`;
            let params = new URLSearchParams(apiPath.split('?')[1]);
            let hasParams = params.toString().length > 0;

            if (hasParams) {
                // Create input fields for parameters
                const paramContainer = document.createElement('div');
                paramContainer.className = 'param-container';

                const formTitle = document.createElement('h6');
                formTitle.className = 'param-form-title';
                formTitle.innerHTML = '<i class="fas fa-sliders-h"></i> Parameters';
                paramContainer.appendChild(formTitle);
                
                Array.from(params.keys()).forEach(param => {
                    const paramGroup = document.createElement('div');
                    paramGroup.className = 'param-group';

                    const labelContainer = document.createElement('div');
                    labelContainer.className = 'param-label-container';
                    
                    const label = document.createElement('label');
                    label.className = 'form-label';
                    label.textContent = param;
                    label.htmlFor = `param-${param}`;
                    
                    const requiredSpan = document.createElement('span');
                    requiredSpan.className = 'required-indicator';
                    requiredSpan.textContent = '*';
                    label.appendChild(requiredSpan);
                    
                    labelContainer.appendChild(label);
                    
                    // Add parameter description tooltip if available
                    const currentItem = settings.categories
                        .flatMap(category => category.items)
                        .find(item => item.path === apiPath);
                    
                    if (currentItem && currentItem.params && currentItem.params[param]) {
                        const tooltipIcon = document.createElement('i');
                        tooltipIcon.className = 'fas fa-info-circle param-info';
                        tooltipIcon.title = currentItem.params[param];
                        labelContainer.appendChild(tooltipIcon);
                    }
                    
                    paramGroup.appendChild(labelContainer);
                    
                    const inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.className = 'custom-input';
                    inputField.id = `param-${param}`;
                    inputField.placeholder = `Enter ${param}...`;
                    inputField.dataset.param = param;
                    inputField.required = true;
                    inputField.addEventListener('input', validateInputs);
                    
                    paramGroup.appendChild(inputField);
                    paramContainer.appendChild(paramGroup);
                });

                modalRefs.queryInputContainer.appendChild(paramContainer);
                modalRefs.submitBtn.classList.remove('d-none');
                modalRefs.submitBtn.disabled = true;

                // Submit button handler
                modalRefs.submitBtn.onclick = async () => {
                    const inputs = modalRefs.queryInputContainer.querySelectorAll('input');
                    const newParams = new URLSearchParams();
                    let isValid = true;

                    inputs.forEach(input => {
                        if (!input.value.trim()) {
                            isValid = false;
                            input.classList.add('is-invalid');
                        } else {
                            input.classList.remove('is-invalid');
                            newParams.append(input.dataset.param, input.value.trim());
                        }
                    });

                    if (!isValid) return;

                    // Show loading animation
                    modalRefs.submitBtn.disabled = true;
                    modalRefs.submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

                    const apiUrlWithParams = `${window.location.origin}${apiPath.split('?')[0]}?${newParams.toString()}`;
                    
                    modalRefs.queryInputContainer.style.display = 'none';
                    modalRefs.submitBtn.style.display = 'none';
                    handleApiRequest(apiUrlWithParams, modalRefs);
                };
            } else {
                handleApiRequest(baseApiUrl, modalRefs);
            }

            modal.show();
        });

        // Input validation
        function validateInputs() {
            const submitBtn = document.getElementById('submitQueryBtn');
            const inputs = document.querySelectorAll('.param-container input');
            const isValid = Array.from(inputs).every(input => input.value.trim() !== '');
            
            if (isValid) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
            
            // Remove validation error on input
            this.classList.remove('is-invalid');
        }

        // Handle API request
        async function handleApiRequest(apiUrl, modalRefs) {
            modalRefs.spinner.classList.remove('d-none');
            modalRefs.endpoint.textContent = apiUrl;
            modalRefs.endpoint.classList.remove('d-none');

            try {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.startsWith('image/')) {
                    // Handle image response
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);

                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = 'API Response Image';
                    img.className = 'response-image';
                    img.style.maxWidth = '100%';

                    modalRefs.content.innerHTML = '';
                    modalRefs.content.appendChild(img);
                } else {
                    // Handle JSON response
                    const data = await response.json();
                    const formattedJson = syntaxHighlight(JSON.stringify(data, null, 2));
                    modalRefs.content.innerHTML = formattedJson;
                }

                modalRefs.container.classList.remove('d-none');
                modalRefs.content.classList.remove('d-none');
            } catch (error) {
                // Error display
                modalRefs.content.innerHTML = `
                    <div class="error-container">
                        <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
                        <div class="error-message">
                            <h6>Error Occurred</h6>
                            <p>${error.message}</p>
                        </div>
                    </div>
                `;
                modalRefs.container.classList.remove('d-none');
                modalRefs.content.classList.remove('d-none');
            } finally {
                modalRefs.spinner.classList.add('d-none');
            }
        }
        
        // JSON syntax highlighting
        function syntaxHighlight(json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        
        // Show error notification
        const errorNotification = document.createElement('div');
        errorNotification.className = 'error-notification';
        errorNotification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load settings: ${error.message}</p>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(errorNotification);
        
        // Add notification close button functionality
        errorNotification.querySelector('.close-notification').addEventListener('click', () => {
            errorNotification.classList.add('fade-out');
            setTimeout(() => errorNotification.remove(), 300);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorNotification.classList.add('fade-out');
            setTimeout(() => errorNotification.remove(), 300);
        }, 5000);
    } finally {
        // Hide loading screen
        clearInterval(loadingDotsAnimation);
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = "none";
                body.classList.remove("no-scroll");
            }, 500);
        }, 1000);
    }
});