'use strict';

describe('Controller: TodosCtrl', function() {

  // load the controller's module
  beforeEach(module('app'));

  var TodosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    TodosCtrl = $controller('TodosCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of todos to the scope', function() {
    expect(scope.todos.length).toBe(3);
  });
});
