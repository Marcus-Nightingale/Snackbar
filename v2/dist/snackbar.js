"use strict";
var Snackbar = (function () {
    function Snackbar(options) {
        this.options = options;
        this.options.duration = this.options.dismissible ? undefined : this.options.duration || 3000;
        this.container = this.createContainer();
        var position = this.options.position || 'bottom-center';
        if (!Snackbar.snackbarGroups[position]) {
            Snackbar.snackbarGroups[position] = [];
        }
        Snackbar.snackbarGroups[position].push(this);
        this.updatePositions();
    }
    Snackbar.prototype.createContainer = function () {
        var _this = this;
        var container = document.createElement('div');
        container.textContent = this.options.message;
        container.classList.add('snackbar');
        if (this.options.status) {
            container.classList.add("snackbar-".concat(this.options.status));
        }
        if (this.options.customClass) {
            container.classList.add(this.options.customClass);
        }
        if (this.options.dismissible) {
            var closeButton = document.createElement('button');
            closeButton.classList.add('snackbar-close-button');
            closeButton.innerHTML = this.options.closeIcon || '<i class="ph ph-x"></i>';
            closeButton.onclick = function () { return _this.dismiss(); };
            container.appendChild(closeButton);
        }
        if (this.options.element) {
            this.options.element.style.position = 'relative';
            container.style.position = 'absolute';
            this.options.element.appendChild(container);
        }
        else {
            container.style.position = 'fixed';
            document.body.appendChild(container);
        }
        container.style.zIndex = this.getHighestZIndex().toString();
        return container;
    };
    Snackbar.prototype.updatePositions = function () {
        var position = this.options.position || 'bottom-center';
        Snackbar.snackbarGroups[position].forEach(function (snackbar, index) {
            var offset = 10 + index * 60;
            switch (position) {
                case 'top-left':
                    snackbar.container.style.top = "".concat(offset, "px");
                    snackbar.container.style.left = '10px';
                    break;
                case 'top-center':
                    snackbar.container.style.top = "".concat(offset, "px");
                    snackbar.container.style.left = '50%';
                    snackbar.container.style.transform = 'translateX(-50%)';
                    break;
                case 'top-right':
                    snackbar.container.style.top = "".concat(offset, "px");
                    snackbar.container.style.right = '10px';
                    break;
                case 'center-left':
                    snackbar.container.style.top = "calc(50% - ".concat(offset, "px)");
                    snackbar.container.style.left = '10px';
                    snackbar.container.style.transform = 'translateY(-50%)';
                    break;
                case 'center-right':
                    snackbar.container.style.top = "calc(50% - ".concat(offset, "px)");
                    snackbar.container.style.right = '10px';
                    snackbar.container.style.transform = 'translateY(-50%)';
                    break;
                case 'bottom-left':
                    snackbar.container.style.bottom = "".concat(offset, "px");
                    snackbar.container.style.left = '10px';
                    break;
                case 'bottom-center':
                    snackbar.container.style.bottom = "".concat(offset, "px");
                    snackbar.container.style.left = '50%';
                    snackbar.container.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom-right':
                    snackbar.container.style.bottom = "".concat(offset, "px");
                    snackbar.container.style.right = '10px';
                    break;
            }
        });
    };
    Snackbar.prototype.getHighestZIndex = function () {
        var elements = document.getElementsByTagName('*');
        var highest = 0;
        for (var i = 0; i < elements.length; i++) {
            var zIndex = window.getComputedStyle(elements[i]).zIndex;
            if (zIndex !== 'auto' && Number(zIndex) > highest) {
                highest = Number(zIndex);
            }
        }
        return highest + 1;
    };
    Snackbar.prototype.show = function () {
        var _this = this;
        this.container.classList.add('show');
        if (this.options.duration) {
            setTimeout(function () { return _this.dismiss(); }, this.options.duration);
        }
    };
    Snackbar.prototype.dismiss = function () {
        var _this = this;
        this.container.classList.remove('show');
        this.container.remove();
        var position = this.options.position || 'bottom-center';
        Snackbar.snackbarGroups[position] = Snackbar.snackbarGroups[position].filter(function (snackbar) { return snackbar !== _this; });
        this.updatePositions();
    };
    Snackbar.snackbarGroups = {};
    return Snackbar;
}());
function showSnackbar(options) {
    var snackbar = new Snackbar(options);
    snackbar.show();
}
if (typeof window !== 'undefined') {
    window.showSnackbar = showSnackbar;
}
