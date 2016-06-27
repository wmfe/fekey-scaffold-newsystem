
module.exports = function (msg, dosomething) {
	var elem = $('<div class="superMsg">' + msg + '</div>').appendTo('body');
    var ew = elem.outerWidth();
    var eh = elem.outerHeight();
    elem.css({
        marginTop: '-' + eh/2 + 'px',
        marginLeft: '-' + ew/2 + 'px'
    });
    setTimeout(function () {
        elem.fadeOut(500, function () {
            $(this).remove();
            if (dosomething === true) {
                window.location.reload();
            } else if (typeof dosomething === 'function') {
                dosomething();
            } else if (/^url:/.test(dosomething)) {
                window.location.href = dosomething.replace(/^url:/, '');
            }
        });
    }, 2000);
};