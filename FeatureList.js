class FeatureList extends HTMLElement {
    constructor() {
        super();
        this.options = {
            container: this,
            features: [],
            theme: this.getAttribute('theme') || 'default',
            icon: this.getAttribute('icon') || '✓',
            animation: this.getAttribute('animation') !== 'false'
        };
        
        this.init();
    }

    static get observedAttributes() {
        return ['theme', 'icon', 'animation', 'features'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch(name) {
            case 'theme':
                this.options.theme = newValue || 'default';
                break;
            case 'icon':
                this.options.icon = newValue || '✓';
                break;
            case 'animation':
                this.options.animation = newValue !== 'false';
                break;
            case 'features':
                try {
                    this.options.features = JSON.parse(newValue);
                } catch (e) {
                    console.error('FeatureList: Invalid features JSON');
                }
                break;
        }
        this.render();
    }

    connectedCallback() {
        // Check for features attribute first
        const featuresAttr = this.getAttribute('features');
        if (featuresAttr) {
            try {
                this.options.features = JSON.parse(featuresAttr);
            } catch (e) {
                console.error('FeatureList: Invalid features JSON');
            }
        } else {
            // Fallback to child elements if no features attribute
            this.options.features = Array.from(this.children)
                .filter(child => child.tagName === 'FEATURE')
                .map(feature => feature.textContent.trim());
        }
        
        this.render();
    }

    init() {
        this.render();
    }

    setFeatures(features) {
        this.options.features = features;
        this.render();
    }

    render() {
        this.innerHTML = '';
        const list = document.createElement('ul');
        list.className = `feature-list feature-list-${this.options.theme}`;

        this.options.features.forEach((feature, index) => {
            const item = document.createElement('li');
            item.className = 'feature-item';
            
            if (this.options.animation) {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            }

            const icon = document.createElement('span');
            icon.className = 'feature-icon';
            icon.textContent = this.options.icon;

            const text = document.createElement('span');
            text.className = 'feature-text';
            text.textContent = feature;

            item.appendChild(icon);
            item.appendChild(text);
            list.appendChild(item);
        });

        this.appendChild(list);
        this.addStyles();
    }

    addStyles() {
        if (!document.getElementById('feature-list-styles')) {
            const style = document.createElement('style');
            style.id = 'feature-list-styles';
            style.textContent = `
                feature-list {
                    display: block;
                }
                .feature-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 16px;
                    line-height: 1.5;
                }

                .feature-icon {
                    margin-right: 12px;
                    color: #4CAF50;
                    font-weight: bold;
                }

                .feature-text {
                    color: #333;
                }

                /* Theme variations */
                .feature-list-default .feature-icon {
                    color: #4CAF50;
                }

                .feature-list-blue .feature-icon {
                    color: #2196F3;
                }

                .feature-list-purple .feature-icon {
                    color: #9C27B0;
                }

                .feature-list-orange .feature-icon {
                    color: #FF9800;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Register the custom element
customElements.define('feature-list', FeatureList);

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeatureList;
} else if (typeof define === 'function' && define.amd) {
    define([], function() { return FeatureList; });
} else {
    window.FeatureList = FeatureList;
} 