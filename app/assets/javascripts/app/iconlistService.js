angular.module('iconlistService', ['ngResource']).
        factory('iconHub', [
            '$resource','$location',
            function ($resource,$location) {
                var host = $location.host()
                var protocol = $location.protocol()
                var port = $location.port();
                return $resource(protocol + '://' + host + ':' + port + '/companies/:id/get_json_icon_gallery',
                    {
                        id: '@id'
                    },
                    {
                        getIconGallery: {
                            method: 'GET'
                        },
                    });
            }
        ]);
