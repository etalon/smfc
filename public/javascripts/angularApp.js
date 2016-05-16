angular.module('ErrorCatcher', [])
    .factory('errorHttpInterceptor', function ($exceptionHandler, $q) {
        return {
            responseError: function responseError(rejection) {
                $exceptionHandler("[HTTP request error] Status: " + rejection.status + ", Text: " + rejection.data);
                return $q.reject(rejection);
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('errorHttpInterceptor');
    });

var app = angular.module('SMFC', ['ui.router', 'ErrorCatcher']);


app.config(function ($provide) {
    $provide.decorator("$exceptionHandler", function ($delegate, $injector) {
        return function (exception, cause) {
           
            var $rootScope = $injector.get("$rootScope");

            $rootScope.errors = $rootScope.errors || [];
            $rootScope.errors.push(exception);
                      
            $delegate(exception, cause);
        };
    });
});

app.config([
    '$httpProvider'
    , '$stateProvider'
    
    , '$urlRouterProvider'
    
    , function ($httpProvider, $stateProvider, $urlRouterProvider) {

        $httpProvider.useLegacyPromiseExtensions = false;

        $stateProvider
            .state('home', {
                url: '/home'
                , templateUrl: '/home.html'
                , controller: 'MainCtrl'
            , })

        .state('supermarketgroupsoverview', {
            url: '/supermarketgroupsoverview'
            , templateUrl: '/supermarketgroupsoverview.html'
            , controller: 'SupermarketGroupsOverviewCtrl'
            , resolve: {
                postPromise: ['supermarketgroups', function (supermarketgroups) {
                    return supermarketgroups.getAll();
                }]
            }
        })

        .state('supermarketgroups', {
            url: '/supermarketgroups/{id}'
            , templateUrl: '/supermarketgroups.html'
            , controller: 'SupermarketGroupsCtrl'
        })

        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('supermarketgroups', ['$exceptionHandler', '$http', function ($exceptionHandler, $http) {
    var o = {
        supermarketgroups: []
    };

    o.getAll = function () {
        console.log("test2");
        return $http.get('/supermarketgroups')
            .then(function (response) {
                angular.copy(response.data, o.supermarketgroups);
            });
    };

    o.create = function (supermarketgroup) {
        return $http.post('/supermarketgroups', supermarketgroup)
            .then(function (response) {
                o.supermarketgroups.push(response.data);
            })
    };

    o.delete = function (supermarketgroup) {
        return $http.delete('/supermarketgroups/' + supermarketgroup._id)
            .then(function (data) {
                o.getAll();
            });
    };
    return o;
}]);

app.controller('SupermarketGroupsCtrl', [
    '$scope'
    
    , '$stateParams'
    
    , 'supermarketgroups'
    
    , function ($scope, $stateParams, supermarketgroups) {
        $scope.supermarketgroup = supermarketgroups.supermarketgroups[$stateParams.id];

        $scope.addSupermarket = function () {
            // undone
        };
    }
]);

app.controller('SupermarketGroupsOverviewCtrl', [
    '$scope'
    
    , 'supermarketgroups'
    
    , function ($scope, supermarketgroups) {
        $scope.supermarketgroups = supermarketgroups.supermarketgroups;
        $scope.addSupermarketGroup = function () {
            if (!$scope.name || $scope.name === '') {
                return;
            }

            supermarketgroups.create({
                name: $scope.name
            });

            $scope.name = '';
        };

        $scope.deleteSupermarketGroup = function (supermarketgroup) {
            supermarketgroups.delete(supermarketgroup);

        }
    }]);