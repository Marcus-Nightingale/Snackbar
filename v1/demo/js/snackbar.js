/*!
  * Snackbar.js
  *
  * Created by Marcus Nightingale
  * Date: 04/05/2020
  * Time: 12:00
  */
window.onload = function() {
    if (!window.jQuery) {
        // jQuery is loaded
        console.log('%c Snackbar.js requires jQuery. jQuery must be included before snackbar.js.', 'background: #222; color: white; padding 30px; font-size: 18px;');
    }
};

(function () {
    $.Snackbar = function (title, text, type, options) {

        // Set default Options
        let defaultOptions = {
            appendTo: 'body',
            stack: true,
            position: 'snack-bottom-right',
            timeout: 4000,
            progress: true,
            closeable: true,
            width: 250,
            spacing: 10,
            sticky: false,
            icon: true,
            rounded: true
        };

        let $snack = null;
        let $options = $.extend(true, {}, defaultOptions, options);
        let $spacing = $options.spacing;
        let $css = {
            "position": ($options.appendTo === "body") ? "fixed" : "absolute",
            "display": "none",
        };
        let $rounded = $options.rounded ? " snack-rounded" : "";

        $snack = $('<div class="snackbar-wrapper ' + type + ' ' + $options.position + $rounded + '"></div>');

        if($options.icon){
            if(type === 'danger') {
                $('<div class="sb-1"><i class="fas fa-exclamation snack-icon fa-fw"></i></div>').appendTo($snack);
            } else if(type === 'info') {
                $('<div class="sb-1"><i class="fas fa-question snack-icon fa-fw"></i></div>').appendTo($snack);
            } else if(type === 'warning') {
                $('<div class="sb-1"><i class="far fa-bell snack-icon fa-fw"></i></div>').appendTo($snack);
            } else if(type === 'success') {
                $('<div class="sb-1"><i class="fas fa-check snack-icon fa-fw"></i></div>').appendTo($snack);
            }
        }

        $('<p class="snack-text">' + '<b>' + title + '</b><br />' + text  + '</p>').appendTo($snack);

        // Need to calc and setting padding and force this to the right
        if ($options.closeable) {
            $('<button type="button" class="btn btn-link snack-close"><i class="fas fa-times"></i></button>').appendTo($snack);
        }

        if ($options.progress && $options.timeout > 0) {
            $('<div class="snack-progress"></div>').appendTo($snack);
        }

        if ($options.sticky) {
            $options.spacing = 0;
            $spacing = 0;

            switch ($options.position) {
                case "snack-top-left" : {
                    $css.top = 0;
                    $css.left = 0;
                    break;
                }
                case "snack-top-right" : {
                    $css.top = 0;
                    $css.left = 0;
                    break;
                }
                case "snack-top-center" : {
                    $css.top = 0;
                    $css.left = $css.right = 0;
                    $css.width = "100%";
                    break;
                }
                case "snack-bottom-left" : {
                    $css.bottom = 0;
                    $css.left = 0;
                    break;
                }
                case "snack-bottom-right" : {
                    $css.bottom = 0;
                    $css.right = 0;
                    break;
                }
                case "snack-bottom-center" : {
                    $css.bottom = 0;
                    $css.left = $css.right = 0;
                    $css.width = "100%";
                    break;
                }
                default : {
                    break;
                }
            }
        }

        if ($options.stack) {
            if ($options.position.indexOf("snack-top") !== -1) {
                $($options.appendTo).find('.snackbar-wrapper').each(function () {
                    $css.top = parseInt($(this).css("top")) + this.offsetHeight + $spacing;
                });
            } else if ($options.position.indexOf("snack-bottom") !== -1) {
                $($options.appendTo).find('.snackbar-wrapper').each(function () {
                    $css.bottom = parseInt($(this).css("bottom")) + this.offsetHeight + $spacing;
                });
            }
        }

        $snack.css($css);
        $snack.appendTo($options.appendTo);

        if ($snack.fadeIn) {
            $snack.fadeIn();
        } else {
            $alert.css({display: 'block', opacity: 1});
        }

        function removeSnack() {
            $.Snackbar.remove($snack);
        }

        if ($options.timeout > 0) {
            setTimeout(removeSnack, $options.timeout);
            if ($options.progress) {
                $(".snack-progress", $snack).animate({"width": "100%"}, $options.timeout);
            }
        }

        $(".snack-close", $snack).click(removeSnack);

        return $snack;
    };
    $.Snackbar.remove = function ($snack) {
        "use strict";
        if ($snack.fadeOut) {
            $snack.fadeOut(function () {
                return $snack.remove();
            });
        } else {
            $snack.remove();
        }
    };
})();