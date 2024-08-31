interface SnackbarOptions {
    message: string; // The message to display
    duration?: number; // How long the snackbar should be visible (in milliseconds)
    position?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'; // Position of the snackbar
    element?: HTMLElement; // An element to contain the snackbar (optional)
    customClass?: string; // A custom CSS class for additional styling
    dismissible?: boolean; // Whether the snackbar should be dismissible with a button
    closeIcon?: string; // HTML for a custom close button icon
    status?: 'success' | 'error' | 'warning' | 'info'; // Predefined status styles
    centerText?: boolean; // Whether the text should be centered
}

class Snackbar {
    private container: HTMLElement;
    private static snackbarGroups: { [key: string]: Snackbar[] } = {};

    constructor(private options: SnackbarOptions) {
        // Set the default duration to 5000ms (5 seconds) if not specified
        this.options.duration = this.options.dismissible ? undefined : this.options.duration || 5000;

        this.container = this.createContainer();

        const position = this.options.position || 'bottom-center';
        if (!Snackbar.snackbarGroups[position]) {
            Snackbar.snackbarGroups[position] = [];
        }

        Snackbar.snackbarGroups[position].push(this);
        this.updatePositions();
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.textContent = this.options.message;
        container.classList.add('snackbar');

        // Apply the correct class based on the background color each time the snackbar is created
        this.applyColorScheme(container);

        if (this.options.customClass) {
            container.classList.add(this.options.customClass);
        }

        if (this.options.status) {
            container.classList.add(`snackbar-${this.options.status}`);
        }

        if (this.options.dismissible) {
            const closeButton = document.createElement('button');
            closeButton.classList.add('snackbar-close-button');
            closeButton.innerHTML = this.options.closeIcon || '<i class="ph ph-x"></i>';
            closeButton.onclick = () => this.dismiss();
            container.appendChild(closeButton);
        }

        if (this.options.centerText) {
            container.classList.add('snackbar-center-text');
        }

        if (this.options.element) {
            this.options.element.style.position = 'relative';
            container.style.position = 'absolute';
            this.options.element.appendChild(container);
        } else {
            container.style.position = 'fixed';
            document.body.appendChild(container);
        }

        container.style.zIndex = this.getHighestZIndex().toString();
        return container;
    }

    private applyColorScheme(container: HTMLElement) {
        const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bodyBackgroundColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
        const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        const isDarkBackground = brightness < 128;

        if (isDarkBackground) {
            container.classList.add('snackbar-light');
        } else {
            container.classList.add('snackbar-dark');
        }
    }

    private updatePositions() {
        const position = this.options.position || 'bottom-center';

        Snackbar.snackbarGroups[position].forEach((snackbar, index) => {
            const offset = 10 + index * 60;

            switch (position) {
                case 'top-left':
                    snackbar.container.style.top = `${offset}px`;
                    snackbar.container.style.left = '10px';
                    break;
                case 'top-center':
                    snackbar.container.style.top = `${offset}px`;
                    snackbar.container.style.left = '50%';
                    snackbar.container.style.transform = 'translateX(-50%)';
                    break;
                case 'top-right':
                    snackbar.container.style.top = `${offset}px`;
                    snackbar.container.style.right = '10px';
                    break;
                case 'center-left':
                    snackbar.container.style.top = `calc(50% - ${offset}px)`;
                    snackbar.container.style.left = '10px';
                    snackbar.container.style.transform = 'translateY(-50%)';
                    break;
                case 'center-right':
                    snackbar.container.style.top = `calc(50% - ${offset}px)`;
                    snackbar.container.style.right = '10px';
                    snackbar.container.style.transform = 'translateY(-50%)';
                    break;
                case 'bottom-left':
                    snackbar.container.style.bottom = `${offset}px`;
                    snackbar.container.style.left = '10px';
                    break;
                case 'bottom-center':
                    snackbar.container.style.bottom = `${offset}px`;
                    snackbar.container.style.left = '50%';
                    snackbar.container.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom-right':
                    snackbar.container.style.bottom = `${offset}px`;
                    snackbar.container.style.right = '10px';
                    break;
            }
        });
    }

    private getHighestZIndex(): number {
        const elements = document.getElementsByTagName('*');
        let highest = 0;

        for (let i = 0; i < elements.length; i++) {
            const zIndex = window.getComputedStyle(elements[i]).zIndex;
            if (zIndex !== 'auto' && Number(zIndex) > highest) {
                highest = Number(zIndex);
            }
        }

        return highest + 1;
    }

    public show() {
        this.container.classList.add('show');

        if (this.options.duration) {
            setTimeout(() => this.dismiss(), this.options.duration);
        }
    }

    private dismiss() {
        this.container.classList.remove('show');
        this.container.remove();

        const position = this.options.position || 'bottom-center';
        Snackbar.snackbarGroups[position] = Snackbar.snackbarGroups[position].filter(snackbar => snackbar !== this);
        this.updatePositions();
    }
}

function showSnackbar(options: SnackbarOptions) {
    const snackbar = new Snackbar(options);
    snackbar.show();
}

if (typeof window !== 'undefined') {
    (window as any).showSnackbar = showSnackbar;
}