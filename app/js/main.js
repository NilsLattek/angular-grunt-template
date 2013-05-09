require('vendor/es5-shim.min');
require('vendor/jquery');
require('vendor/angular');

angular.module('app', ['todoModule'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: 'views/main.html', controller: 'TodosCtrl' })
    .otherwise({ redirectTo: '/' });
}]);

require('todo/index');