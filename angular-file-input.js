angular.module('tw.directives.fileInput', []);

angular.module('tw.directives.fileInput').directive('input', function() {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, el, attrs, ctrl) {
      if (!ctrl || !attrs.type || angular.lowercase(attrs.type) !== 'file') {
        return;
      }

      var element = el[0], multiple = !!attrs.multiple;

      el.on('change', function(e) {
        ctrl.$setViewValue(multiple ? element.files : element.files[0]);

        scope.$$phase || scope.$apply();
      });

      ctrl.$render = function() {
        if (ctrl.$isEmpty()) {
          el.val('');
        }
      };

      ctrl.$isEmpty = function(model) {
        return !model || (multiple && !model.length);
      };

      if (attrs.accept) {
        var validateType = function(accepts, type) {
          var valid = false;

          angular.forEach(accepts, function(accept) {
            valid = valid || ~type.indexOf(accept.replace('*', ''));
          });

          return valid;
        };

        var accepts = attrs.accept.split(/\s*,\s*/);

        ctrl.$validators.accept = function(modelValue, viewValue) {
          var value = modelValue || viewValue;

          if (ctrl.$isEmpty(value)) {
            return true;
          }

          var files = multiple ? value : [value];

          var valid = true;

          angular.forEach(files, function(file) {
            valid = validateType(accepts, file.type);
          });

          return valid;
        };
      }
    }
  };
});
