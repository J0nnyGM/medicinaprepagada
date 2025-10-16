// This is a "guard clause". It checks if the script has already run.
// If it has, it does nothing on subsequent loads, preventing the error.
if (!window.loaderScriptHasRun) {
    // Set a flag on the global window object to say "I've run once!"
    window.loaderScriptHasRun = true;

    const loadComponent = (url, elementId) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                }
            })
            .catch(error => {
                console.error('Error loading component:', error, 'url:', url);
            });
    };

    document.addEventListener('DOMContentLoaded', () => {
        const componentsToLoad = [
            loadComponent('components/header.html', 'header-placeholder'),
            loadComponent('components/contact-section.html', 'contact-section-placeholder'),
            loadComponent('components/footer.html', 'footer-placeholder')
        ];
        
        if (document.getElementById('plans-section-placeholder')) {
            componentsToLoad.push(
                loadComponent('components/plans-section.html', 'plans-section-placeholder')
            );
        }
        
        Promise.all(componentsToLoad)
            .then(() => {
                // --- SECUENCIA DE CARGA DE SCRIPTS ---
                const firebaseScript = document.createElement('script');
                firebaseScript.src = 'firebase-handler.js';
                
                firebaseScript.onload = () => {
                    const appScript = document.createElement('script');
                    appScript.src = 'app.js';

                    appScript.onload = () => {
                        initializeApp();
                    };
                    
                    document.body.appendChild(appScript);
                };

                document.body.appendChild(firebaseScript);
            });
    });
}