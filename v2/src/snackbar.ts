interface SnackbarOptions {
    message: string;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    element?: HTMLElement;
    customClass?: string;
    dismissible?: boolean;
    closeIcon?: string;
    status?: 'success' | 'error' | 'warning' | 'info'; // New option for status
}

class Snackbar {
    private container: HTMLElement;
    private static snackbarGroups: { [key: string]: Snackbar[] } = {};

    constructor(private options: SnackbarOptions) {
        this.options.duration = this.options.dismissible ? undefined : this.options.duration || 3000;
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

        if (this.options.status) {
            container.classList.add(`snackbar-${this.options.status}`);
        }

        if (this.options.customClass) {
            container.classList.add(this.options.customClass);
        }

        if (this.options.dismissible) {
            const closeButton = document.createElement('button');
            closeButton.classList.add('snackbar-close-button');
            closeButton.innerHTML = this.options.closeIcon || '<i class="ph ph-x"></i>';
            closeButton.onclick = () => this.dismiss();
            container.appendChild(closeButton);
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