let Snackbar = (function() {
    let defaults = {
        appendTo: 'body',
        stack: true,
        position: 'sb-br',
        timeout: 4000,
        progress: true,
        closable: true,
        minWidth: 250,
        gutter: 10,
        sticky: false,
        icon: true,
        rounded: true
    };

    /**
     * Create a constructor object
     * @param {string} title
     * @param {string} message
     * @param {object} opts
     * @constructor
     */
    function Constructor(title, message = '', opts = {}) {
        if (typeof title !== 'string') {
            console.error('Snackbar title must be of type string!');
            return;
        }

        if (typeof message !== 'string') {
            console.error('Snackbar message must be of type string!');
            return;
        }

        if (!title.length && !message.length) {
            console.error('Snackbar title or message must be set and cannot be empty!');
            return;
        }

        if (typeof opts !== 'object') {
            console.error('Snackbar opts must be an object if set!');
            return;
        }

        Constructor['options'] = defaults; // TODO :: extend defaults with opts

        this.addSnack(title, message);
    }

    Constructor.prototype.addSnack = (title, message) => {
        let snack = document.createElement('div');

        snack.classList.add('snack');
        snack.classList.add(Constructor['options'].position);
        snack.innerHTML = `<p class="snack-inner"><b>${title}</b><br/>${message}</p>`;

        if (Constructor['options'].appendTo !== 'body') {
            // TODO :: Handle request to attach to another element
            return;
        }

        document.body.appendChild(snack);
    }

    return Constructor;
})();