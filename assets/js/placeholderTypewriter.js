(function ($) {
    "use strict";
    $.fn.placeholderTypewriter = function (options) {
      var settings = $.extend({
        delay: 50,
        pause: 1000,
        text: []
      }, options);
      function typeString($target, index, cursorPosition, callback) {
        var text = settings.text[index];
        var placeholder = $target.attr('placeholder');
        $target.attr('placeholder', placeholder + text[cursorPosition]);
        if (cursorPosition < text.length - 1) {
          setTimeout(function () {
            typeString($target, index, cursorPosition + 1, callback);
          }, settings.delay);
          return true;
        }
        callback();
      }
      function deleteString($target, callback) {
        var placeholder = $target.attr('placeholder');
        var length = placeholder.length;
        $target.attr('placeholder', placeholder.substr(0, length - 1));
        if (length > 1) {
          setTimeout(function () {
            deleteString($target, callback)
          }, settings.delay);
          return true;
        }
        callback();
      }
      function loopTyping($target, index) {
        $target.attr('placeholder', '');
        typeString($target, index, 0, function () {
          setTimeout(function () {
            deleteString($target, function () {
              loopTyping($target, (index + 1) % settings.text.length)
            })
          }, settings.pause);
        })
      }
      return this.each(function () {
        loopTyping($(this), 0);
      });
    };
  }(jQuery));