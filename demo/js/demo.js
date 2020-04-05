$(document).on('click', '.snackbar', function () {
    $.Snackbar('Hello World!', 'This is an example snackbar.', '', {
        position: "snack-" + $(this).data('position'),
        stack: false,
        timeout: 6000
    });
});