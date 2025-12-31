// Component Loader - Load header and footer dynamically
(function() {
  'use strict';

  // Load component from file
  async function loadComponent(elementId, filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}`);
      }
      const html = await response.text();
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = html;
        // After injecting, apply translations in case component contains data-i18n
        if (window.i18n && typeof window.i18n.applyTranslations === 'function') {
          window.i18n.applyTranslations();
        }
      }
    } catch (error) {
      console.error('Error loading component:', error);
    }
  }



  // Load header and footer when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    
    loadComponent('header-placeholder', '../html/header.html');
    loadComponent('footer-placeholder', '../html/footer.html');
  });
  // Load home_musaned.html into #content if present
  document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    if (!content) return;
    fetch("../html/home_musaned.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        document.dispatchEvent(new Event("homeLoaded"));
      })
      .catch(err => console.error("Error loading home:", err));
  });

})();
