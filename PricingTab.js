// PricingTab.js - A simple library for creating pricing tabs
(function() {
  // Define the custom element
  class PricingTab extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['plan-name', 'price', 'description', 'price-id', 'popular', 'features'];
    }

    connectedCallback() {
      this.render();
      
      // Add event listener to the button
      const button = this.shadowRoot.querySelector('.subscribe-button');
      if (button) {
        button.addEventListener('click', this.handleSubscribe.bind(this));
      }
    }

    attributeChangedCallback() {
      if (this.isConnected) {
        this.render();
      }
    }

    handleSubscribe() {
      const priceId = this.getAttribute('price-id');
      // Dispatch custom event
      const event = new CustomEvent('subscribe', {
        bubbles: true,
        composed: true,
        detail: { priceId, type: "payment" }
      });
      this.dispatchEvent(event);
    }

    get loading() {
      return this.hasAttribute('loading');
    }

    set loading(value) {
      if (value) {
        this.setAttribute('loading', '');
      } else {
        this.removeAttribute('loading');
      }
      // Update button content
      const button = this.shadowRoot.querySelector('.subscribe-button');
      if (button) {
        button.innerHTML = this.loading 
          ? this.getSpinnerHTML() 
          : '<span>Get Lifetime Access</span>';
        button.disabled = this.loading;
      }
    }

    getSpinnerHTML() {
      return `<div class="spinner"></div>`;
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
            height: 100%;
          }
          
          .pricing-tab {
            height: 100%;
          }
          
          .pricing-card {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
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
          
          .popular-badge {
            position: absolute;
            top: 0;
            right: 0;
            margin-right: 1.5rem;
            margin-top: -1rem;
            display: inline-flex;
            align-items: center;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.375rem 0.75rem;
            background-color: #10b981;
            color: white;
            border-radius: 9999px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          
          .header-section {
            margin-bottom: 1.25rem;
          }
          
          .plan-name {
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: #0f172a;
          }
          
          .popular .plan-name {
            color: white;
          }
          
          .price-container {
            display: inline-flex;
            align-items: baseline;
            margin-bottom: 0.5rem;
          }
          
          .currency {
            font-weight: 700;
            font-size: 1.875rem;
            color: #0f172a;
          }
          
          .popular .currency {
            color: white;
          }
          
          .price {
            font-weight: 700;
            font-size: 2.25rem;
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
          
          .subscribe-button {
            width: 100%;
            display: inline-flex;
            justify-content: center;
            white-space: nowrap;
            border-radius: 0.5rem;
            background-color: #6366f1;
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: white;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
            border: none;
            cursor: pointer;
            transition: background-color 150ms ease;
          }
          
          .subscribe-button:hover {
            background-color: #4f46e5;
          }
          
          .subscribe-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
          }
          
          .subscribe-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
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
            font-size: 0.875rem;
            color: #475569;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            flex-grow: 1;
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
          
          .spinner {
            height: 1.25rem;
            width: 1.25rem;
            border: 2px solid white;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        </style>
        
        <div class="pricing-tab">
          <div class="pricing-card ${isPopular ? 'popular' : ''}">
            ${isPopular ? `
              <div class="popular-badge">Most Popular</div>
            ` : ''}
            
            <div class="header-section">
              <div class="plan-name">${planName}</div>
              <div class="price-container">
                <span class="currency">$</span>
                <span class="price">${price}</span>
              </div>
              <div class="plan-description">${description}</div>
              <button class="subscribe-button">
                ${this.loading ? this.getSpinnerHTML() : '<span>Get Lifetime Access</span>'}
              </button>
            </div>
            
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
        </div>
      `;
    }
  }

  // Register the custom element
  if (!customElements.get('pricing-tab')) {
    customElements.define('pricing-tab', PricingTab);
  }
})();