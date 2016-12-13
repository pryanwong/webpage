angular.module('productService', ['ngResource']).
        factory('iconHub', [
            '$resource','$location',
            function ($resource,$location) {
                var host = $location.host()
                var protocol = $location.protocol()
                var port = $location.port();
                return $resource(protocol + '://' + host + ':' + port + '/companies/:id/:action',
                    {
                        id: '@id',
                        action: '@action'
                    },
                    {
                        getIconGallery: {
                            method: 'GET',
                            params: {action: 'get_json_icon_gallery'}
                        },
                    });
            }
        ]).
        factory('productConfigHub', [
            '$resource','$location',
            function ($resource,$location) {
                var host = $location.host()
                var protocol = $location.protocol()
                var port = $location.port();
                return $resource(protocol + '://' + host + ':' + port + '/companies/:company_id/:action/:id',
                    {
                        company_id: '@company_id',
                        id: '@id',
                        action: '@action'
                    },
                    {
                        getIconGallery: {
                            method: 'GET',
                            params: {action: 'productconfig'}
                        },
                    });
            }
        ])
