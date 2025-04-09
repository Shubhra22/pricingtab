
//<script src="https://cdn.jsdelivr.net/gh/Shubhra22/pricingtab@main/PricingTab.js"></script>

// PricingTab.js - Simplified version focusing on features list
(function() {
  class PricingTab extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['plan-name', 'price', 'description', 'features', 'popular'];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) {
        this.render();
      }
    }

    getFeatures() {
      const featuresAttr = this.getAttribute('features');
      if (!featuresAttr) return [];
      try {
        return JSON.parse(featuresAttr);
      } catch (e) {
        console.error('Error parsing features:', e);
        return [];
      }
    }

    render() {
      const isPopular = this.hasAttribute('popular');
      const planName = this.getAttribute('plan-name') || 'Basic Plan';
      const price = this.getAttribute('price') || '29';
      const description = this.getAttribute('description') || 'Monthly subscription';
      const features = this.getFeatures();
      
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .pricing-card {
            position: relative;
            padding: 1.5rem;
            border-radius: 1rem;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
            background-color: white;
          }
          
          .pricing-card.popular {
            background-color: #0f172a;
            border-color: #1e293b;
          }
          
          .plan-name {
            font-weight: 600;
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            color: #0f172a;
          }
          
          .popular .plan-name {
            color: white;
          }
          
          .price-container {
            margin-bottom: 0.5rem;
          }
          
          .price {
            font-weight: 700;
            font-size: 2rem;
            color: #0f172a;
          }
          
          .popular .price {
            color: white;
          }
          
          .plan-description {
            font-size: 0.875rem;
            margin-bottom: 1.25rem;
            color: #64748b;
          }
          
          .popular .plan-description {
            color: #cbd5e1;
          }
          
          .features-title {
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: #0f172a;
          }
          
          .popular .features-title {
            color: white;
          }
          
          .features-list {
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 0.875rem;
            color: #475569;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .popular .features-list {
            color: #cbd5e1;
          }
          
          .feature-item {
            display: flex;
            align-items: center;
          }
          
          .check-icon {
            fill: #10b981;
            margin-right: 0.75rem;
            flex-shrink: 0;
            width: 0.75rem;
            height: 0.75rem;
          }
        </style>
        
        <div class="pricing-card ${isPopular ? 'popular' : ''}">
          <div class="plan-name">${planName}</div>
          <div class="price-container">
            <span class="price">$${price}</span>
          </div>
          <div class="plan-description">${description}</div>
          
          <div class="features-title">Includes:</div>
          <ul class="features-list">
            ${features.map(feature => `
              <li class="feature-item">
                <svg class="check-icon" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>${feature}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }
  }

  // Register the custom element
  if (!customElements.get('pricing-tab')) {
    customElements.define('pricing-tab', PricingTab);
  }
})();