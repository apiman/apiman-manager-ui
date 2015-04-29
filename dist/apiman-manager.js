/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>

/// <reference path="../../includes.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.pluginName = "api-manager";
    Apiman.log = Logger.get(Apiman.pluginName);
    Apiman.templatePath = "plugins/api-manager/html";
})(Apiman || (Apiman = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="apimanGlobals.ts"/>
var Apiman;
(function (Apiman) {
    Apiman._module = angular.module(Apiman.pluginName, ['ApimanServices', 'ApimanLogger', 'ApimanConfiguration', 'ApimanTranslation', 'ApimanPageLifecycle', 'ApimanCurrentUser', 'ApimanDialogs', 'ui.sortable', 'xeditable']);
    var tab = undefined;
    var routes = {
        '/dash': { templateUrl: 'dash.html' },
        '/profile': { templateUrl: 'profile.html' },
        '/admin/gateways': { templateUrl: 'admin/admin-gateways.html' },
        '/admin/plugins': { templateUrl: 'admin/admin-plugins.html' },
        '/admin/policyDefs': { templateUrl: 'admin/admin-policyDefs.html' },
        '/admin/roles': { templateUrl: 'admin/admin-roles.html' },
        '/admin/gateways/:gateway': { templateUrl: 'forms/edit-gateway.html' },
        '/admin/plugins/:plugin': { templateUrl: 'forms/edit-plugin.html' },
        '/admin/policyDefs/:policyDef': { templateUrl: 'forms/edit-policyDef.html' },
        '/admin/roles/:role': { templateUrl: 'forms/edit-role.html' },
        '/orgs/:org/:type/:id/:ver/policies/:policy': { templateUrl: 'forms/edit-policy.html' },
        '/orgs/:org/:type/:id/:ver/new-policy': { templateUrl: 'forms/new-policy.html' },
        '/orgs/:org/apps/:app': { templateUrl: 'app/app.html' },
        '/orgs/:org/apps/:app/:version': { templateUrl: 'app/app-overview.html' },
        '/orgs/:org/apps/:app/:version/contracts': { templateUrl: 'app/app-contracts.html' },
        '/orgs/:org/apps/:app/:version/apis': { templateUrl: 'app/app-apis.html' },
        '/orgs/:org/apps/:app/:version/policies': { templateUrl: 'app/app-policies.html' },
        '/orgs/:org/apps/:app/:version/activity': { templateUrl: 'app/app-activity.html' },
        '/orgs/:org/apps/:app/:version/new-version': { templateUrl: 'forms/new-appversion.html' },
        '/orgs/:org/plans/:plan': { templateUrl: 'plan/plan.html' },
        '/orgs/:org/plans/:plan/:version': { templateUrl: 'plan/plan-overview.html' },
        '/orgs/:org/plans/:plan/:version/policies': { templateUrl: 'plan/plan-policies.html' },
        '/orgs/:org/plans/:plan/:version/activity': { templateUrl: 'plan/plan-activity.html' },
        '/orgs/:org/plans/:plan/:version/new-version': { templateUrl: 'forms/new-planversion.html' },
        '/orgs/:org/services/:service': { templateUrl: 'service/service.html' },
        '/orgs/:org/services/:service/:version': { templateUrl: 'service/service-overview.html' },
        '/orgs/:org/services/:service/:version/impl': { templateUrl: 'service/service-impl.html' },
        '/orgs/:org/services/:service/:version/plans': { templateUrl: 'service/service-plans.html' },
        '/orgs/:org/services/:service/:version/policies': { templateUrl: 'service/service-policies.html' },
        '/orgs/:org/services/:service/:version/endpoint': { templateUrl: 'service/service-endpoint.html' },
        '/orgs/:org/services/:service/:version/contracts': { templateUrl: 'service/service-contracts.html' },
        '/orgs/:org/services/:service/:version/activity': { templateUrl: 'service/service-activity.html' },
        '/orgs/:org/services/:service/:version/new-version': { templateUrl: 'forms/new-serviceversion.html' },
        '/browse/orgs': { templateUrl: 'consumer/consumer-orgs.html' },
        '/browse/services': { templateUrl: 'consumer/consumer-services.html' },
        '/browse/orgs/:org': { templateUrl: 'consumer/consumer-org.html' },
        '/browse/orgs/:org/:service': { templateUrl: 'consumer/consumer-service-redirect.html' },
        '/browse/orgs/:org/:service/:version': { templateUrl: 'consumer/consumer-service.html' },
        '/new-app': { templateUrl: 'forms/new-app.html' },
        '/new-contract': { templateUrl: 'forms/new-contract.html' },
        '/new-gateway': { templateUrl: 'forms/new-gateway.html' },
        '/new-org': { templateUrl: 'forms/new-org.html' },
        '/new-plan': { templateUrl: 'forms/new-plan.html' },
        '/new-plugin': { templateUrl: 'forms/new-plugin.html' },
        '/new-role': { templateUrl: 'forms/new-role.html' },
        '/new-service': { templateUrl: 'forms/new-service.html' },
        '/import-policyDefs': { templateUrl: 'forms/import-policyDefs.html' },
        '/orgs/:org': { templateUrl: 'org/org.html' },
        '/orgs/:org/plans': { templateUrl: 'org/org-plans.html' },
        '/orgs/:org/services': { templateUrl: 'org/org-services.html' },
        '/orgs/:org/apps': { templateUrl: 'org/org-apps.html' },
        '/orgs/:org/members': { templateUrl: 'org/org-members.html' },
        '/orgs/:org/manage-members': { templateUrl: 'org/org-manage-members.html' },
        '/orgs/:org/activity': { templateUrl: 'org/org-activity.html' },
        '/orgs/:org/new-member': { templateUrl: 'org/org-new-member.html' },
        '/users/:user': { templateUrl: 'user/user.html' },
        '/users/:user/activity': { templateUrl: 'user/user-activity.html' },
        '/users/:user/apps': { templateUrl: 'user/user-apps.html' },
        '/users/:user/orgs': { templateUrl: 'user/user-orgs.html' },
        '/users/:user/services': { templateUrl: 'user/user-services.html' },
        '/errors/400': { templateUrl: 'errors/400.html' },
        '/errors/403': { templateUrl: 'errors/403.html' },
        '/errors/404': { templateUrl: 'errors/404.html' },
        '/errors/409': { templateUrl: 'errors/409.html' },
        '/errors/500': { templateUrl: 'errors/500.html' }
    };
    Apiman._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(Apiman.pluginName).title(function () { return "Apiman"; }).href(function () { return "/api-manager"; }).subPath("Home", "dash", builder.join(Apiman.templatePath, 'dash.html')).build();
        builder.configureRouting($routeProvider, tab);
        // Map all the routes into the route provider.
        angular.forEach(routes, function (config, key) {
            config.templateUrl = builder.join(Apiman.templatePath, config.templateUrl);
            this.when('/' + Apiman.pluginName + key, config);
        }, $routeProvider);
        $locationProvider.html5Mode(true);
    }]);
    Apiman._module.factory('authInterceptor', ['$q', '$timeout', 'Configuration', 'Logger', function ($q, $timeout, Configuration, Logger) {
        var refreshBearerToken = function () {
            Logger.info('Refreshing bearer token now.');
            // Note: we need to use jquery directly for this call, otherwise we will have
            // a circular dependency in angular.
            $.get('rest/tokenRefresh', function (reply) {
                Logger.info('Bearer token successfully refreshed: {0}', reply);
                Configuration.api.auth.bearerToken.token = reply.token;
                var refreshPeriod = reply.refreshPeriod;
                $timeout(refreshBearerToken, refreshPeriod * 1000);
            }).fail(function (error) {
                Logger.error('Failed to refresh bearer token: {0}', error);
            });
        };
        if (Configuration.api.auth.type == 'bearerToken') {
            var refreshPeriod = Configuration.api.auth.bearerToken.refreshPeriod;
            $timeout(refreshBearerToken, refreshPeriod * 1000);
        }
        var requestInterceptor = {
            request: function (config) {
                if (Configuration.api.auth.type == 'basic') {
                    var username = Configuration.api.auth.basic.username;
                    var password = Configuration.api.auth.basic.password;
                    var enc = btoa(username + ':' + password);
                    config.headers.Authorization = 'Basic ' + enc;
                }
                else if (Configuration.api.auth.type == 'bearerToken') {
                    var token = Configuration.api.auth.bearerToken.token;
                    config.headers.Authorization = 'Bearer ' + token;
                }
                else if (Configuration.api.auth.type == 'authToken') {
                    var token = Configuration.api.auth.bearerToken.token;
                    config.headers.Authorization = 'AUTH-TOKEN ' + token;
                }
                return config;
            }
        };
        return requestInterceptor;
    }]);
    Apiman._module.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);
    Apiman._module.run(['$rootScope', 'HawtioNav', function ($rootScope, HawtioNav) {
        HawtioNav.add(tab);
        $rootScope.pluginName = Apiman.pluginName;
        Apiman.log.debug("loaded");
    }]);
    hawtioPluginLoader.registerPreBootstrapTask(function (next) {
        // Load the configuration jsonp script
        $.getScript('js/configuration.nocache.js').done(function (script, textStatus) {
            Apiman.log.info("Loaded the configuration.nocache.js config!");
        }).fail(function (response) {
            Apiman.log.debug("Error fetching configuration: ", response);
        }).always(function () {
            // Load the i18n jsonp script
            $.getScript('js/translations.nocache.js').done(function (script, textStatus) {
                Apiman.log.info("Loaded the translations.nocache.js bundle!");
            }).fail(function (response) {
                Apiman.log.debug("Error fetching translations: ", response);
            }).always(function () {
                next();
            });
        });
    }, true);
    hawtioPluginLoader.addModule(Apiman.pluginName);
})(Apiman || (Apiman = {}));

/// <reference path="../../includes.ts"/>
var ApimanConfiguration;
(function (ApimanConfiguration) {
    ApimanConfiguration._module = angular.module("ApimanConfiguration", []);
    ApimanConfiguration.Configuration = ApimanConfiguration._module.factory('Configuration', ['$window', function ($window) {
        return $window.APIMAN_CONFIG_DATA;
    }]);
})(ApimanConfiguration || (ApimanConfiguration = {}));

/// <reference path='../../includes.ts'/>
var ApimanCurrentUser;
(function (ApimanCurrentUser) {
    ApimanCurrentUser._module = angular.module('ApimanCurrentUser', ['ApimanServices']);
    ApimanCurrentUser.CurrentUser = ApimanCurrentUser._module.factory('CurrentUser', ['$q', '$rootScope', 'CurrentUserSvcs', 'Logger', function ($q, $rootScope, CurrentUserSvcs, Logger) {
        return {
            getCurrentUser: function () {
                return $rootScope.currentUser;
            },
            getCurrentUserOrgs: function () {
                var orgs = {};
                var perms = $rootScope.currentUser.permissions;
                for (var i = 0; i < perms.length; i++) {
                    var perm = perms[i];
                    orgs[perm.organizationId] = true;
                }
                var rval = [];
                angular.forEach(orgs, function (value, key) {
                    this.push(key);
                }, rval);
                return rval;
            },
            hasPermission: function (organizationId, permission) {
                if (organizationId && $rootScope.permissions) {
                    var permid = organizationId + '||' + permission;
                    return $rootScope.permissions[permid];
                }
                else {
                    return false;
                }
            },
            isMember: function (organizationId) {
                if (organizationId) {
                    return $rootScope.memberships[organizationId];
                }
                else {
                    return false;
                }
            },
            clear: function () {
                $rootScope.currentUser = undefined;
            }
        };
    }]);
})(ApimanCurrentUser || (ApimanCurrentUser = {}));

/// <reference path="apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.DashController = Apiman._module.controller("Apiman.DashController", ['$scope', 'PageLifecycle', 'CurrentUser', function ($scope, PageLifecycle, CurrentUser) {
        PageLifecycle.loadPage('Dash', undefined, $scope, function () {
            $scope.isAdmin = CurrentUser.getCurrentUser().admin;
            $scope.currentUser = CurrentUser.getCurrentUser();
            PageLifecycle.setPageTitle('dashboard');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../../includes.ts"/>
var ApimanDialogs;
(function (ApimanDialogs) {
    ApimanDialogs._module = angular.module("ApimanDialogs", ["ApimanLogger", "ApimanServices"]);
    ApimanDialogs.Dialogs = ApimanDialogs._module.factory('Dialogs', ['Logger', '$compile', '$rootScope', '$timeout', 'ApimanSvcs', 'OrgSvcs', function (Logger, $compile, $rootScope, $timeout, ApimanSvcs, OrgSvcs) {
        return {
            // A standard confirmation dialog
            /////////////////////////////////
            confirm: function (title, message, yesCallback, noCallback) {
                var modalScope = $rootScope.$new(true);
                modalScope.onYes = function () {
                    if (yesCallback) {
                        yesCallback();
                    }
                };
                modalScope.onNo = function () {
                    if (noCallback) {
                        noCallback();
                    }
                };
                modalScope.title = title;
                modalScope.message = message;
                $('body').append($compile('<apiman-confirm-modal modal-title="{{ title }}">{{ message }}</apiman-confirm-modal>')(modalScope));
                $timeout(function () {
                    $('#confirmModal')['modal']({ 'keyboard': true, 'backdrop': 'static' });
                }, 1);
            },
            // A simple "Select a Service" dialog (allows selecting a single service + version
            //////////////////////////////////////////////////////////////////////////////////
            selectService: function (title, handler, publishedOnly) {
                var modalScope = $rootScope.$new(true);
                modalScope.selectedService = undefined;
                modalScope.selectedServiceVersion = undefined;
                modalScope.search = function () {
                    modalScope.selectedService = undefined;
                    if (!modalScope.searchText) {
                        modalScope.criteria = undefined;
                        modalScope.services = undefined;
                    }
                    else {
                        modalScope.searchButton.state = 'in-progress';
                        var body = {};
                        body.filters = [];
                        body.filters.push({ "name": "name", "value": "%" + modalScope.searchText + "%", "operator": "like" });
                        var searchStr = angular.toJson(body);
                        Logger.log("Searching for services: {0}", modalScope.searchText);
                        ApimanSvcs.save({ entityType: 'search', secondaryType: 'services' }, searchStr, function (reply) {
                            if (reply.beans.length > 0) {
                                modalScope.services = reply.beans;
                            }
                            else {
                                modalScope.services = undefined;
                            }
                            modalScope.criteria = modalScope.searchText;
                            Logger.log("Found {0} services.", reply.beans.length);
                            modalScope.searchButton.state = 'complete';
                        }, function (error) {
                            Logger.error(error);
                            // TODO do something interesting with the error
                            modalScope.services = undefined;
                            modalScope.criteria = modalScope.searchText;
                            modalScope.searchButton.state = 'error';
                        });
                    }
                };
                modalScope.onServiceSelected = function (service) {
                    if (modalScope.selectedService) {
                        modalScope.selectedService.selected = false;
                    }
                    modalScope.selectedService = service;
                    service.selected = true;
                    modalScope.selectedServiceVersion = undefined;
                    OrgSvcs.query({ organizationId: service.organizationId, entityType: 'services', entityId: service.id, versionsOrActivity: 'versions' }, function (versions) {
                        if (publishedOnly) {
                            var validVersions = [];
                            angular.forEach(versions, function (version) {
                                if (version.status == 'Published') {
                                    validVersions.push(version);
                                }
                            });
                            modalScope.serviceVersions = validVersions;
                        }
                        else {
                            modalScope.serviceVersions = versions;
                        }
                        if (modalScope.serviceVersions.length > 0) {
                            modalScope.selectedServiceVersion = modalScope.serviceVersions[0];
                        }
                    }, function (error) {
                        modalScope.serviceVersions = [];
                        modalScope.selectedServiceVersion = undefined;
                    });
                };
                modalScope.onOK = function () {
                    if (handler) {
                        handler(modalScope.selectedServiceVersion);
                    }
                };
                modalScope.title = title;
                $('body').append($compile('<apiman-select-service-modal modal-title="{{ title }}"></apiman-confirm-modal>')(modalScope));
                $timeout(function () {
                    $('#selectServiceModal')['modal']({ 'keyboard': true, 'backdrop': 'static' });
                    $('#selectServiceModal').on('shown.bs.modal', function () {
                        $('#selectServiceModal .input-search').focus();
                    });
                }, 1);
            }
        };
    }]);
})(ApimanDialogs || (ApimanDialogs = {}));

/// <reference path="../../includes.ts"/>
var Apiman;
(function (Apiman) {
    Apiman._module.directive('apimanActionBtn', ['Logger', function (Logger) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var actionVar = attrs.field;
                var actionText = attrs.placeholder;
                var icon = attrs.icon;
                Logger.debug("Action button initializing state variable [{0}].", actionVar);
                scope[actionVar] = {
                    state: 'ready',
                    html: $(element).html(),
                    actionHtml: '<i class="fa fa-spin ' + icon + '"></i> ' + actionText
                };
                scope.$watch(actionVar + '.state', function () {
                    var newVal = scope[actionVar];
                    if (newVal.state == 'in-progress') {
                        $(element).prop('disabled', true);
                        $(element).html(newVal.actionHtml);
                    }
                    else {
                        $(element).prop('disabled', false);
                        $(element).html(newVal.html);
                    }
                });
            }
        };
    }]);
    Apiman._module.directive('apimanSelectPicker', ['Logger', '$timeout', '$parse', 'TranslationService', function (Logger, $timeout, $parse, TranslationService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function refresh(newVal) {
                    scope.$applyAsync(function () {
                        $(element)['selectpicker']('refresh');
                    });
                }
                $timeout(function () {
                    $(element)['selectpicker']();
                    $(element)['selectpicker']('refresh');
                });
                if (attrs.ngOptions && / in /.test(attrs.ngOptions)) {
                    var refreshModel = attrs.ngOptions.split(' in ')[1];
                    Logger.debug('Watching model {0} for {1}.', refreshModel, attrs.ngModel);
                    scope.$watch(refreshModel, function () {
                        scope.$applyAsync(function () {
                            Logger.debug('Refreshing {0} due to watch model update.', attrs.ngModel);
                            $(element)['selectpicker']('refresh');
                        });
                    }, true);
                }
                if (attrs.apimanSelectPicker) {
                    Logger.debug('Watching {0}.', attrs.apimanSelectPicker);
                    scope.$watch(attrs.apimanSelectPicker + '.length', refresh, true);
                }
                if (attrs.ngModel) {
                    scope.$watch(attrs.ngModel, refresh, true);
                }
                if (attrs.ngDisabled) {
                    scope.$watch(attrs.ngDisabled, refresh, true);
                }
                scope.$on('$destroy', function () {
                    $timeout(function () {
                        $(element)['selectpicker']('destroy');
                    });
                });
                $timeout(function () {
                    $(element)['selectpicker']('refresh');
                }, 200);
            }
        };
    }]);
    Apiman._module.directive('apimanPermission', ['Logger', 'CurrentUser', function (Logger, CurrentUser) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var refresh = function (newValue) {
                    var orgId = $scope.organizationId;
                    if (orgId) {
                        var permission = attrs.apimanPermission;
                        if (!CurrentUser.hasPermission(orgId, permission)) {
                            $(element).hide();
                        }
                        else {
                            $(element).show();
                        }
                    }
                    else {
                        Logger.error('Missing organizationId from $scope - authorization disabled.');
                    }
                };
                $scope.$watch('organizationId', refresh);
                $scope.$watch('permissions', refresh);
            }
        };
    }]);
    Apiman._module.directive('apimanStatus', ['Logger', 'EntityStatusService', function (Logger, EntityStatusService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function ($scope) {
                    return EntityStatusService.getEntityStatus();
                }, function (newValue, oldValue) {
                    var entityStatus = newValue;
                    var elem = element;
                    if (entityStatus) {
                        var validStatuses = attrs.apimanStatus.split(',');
                        var statusIsValid = false;
                        for (var i = 0; i < validStatuses.length; i++) {
                            if (validStatuses[i] == entityStatus) {
                                statusIsValid = true;
                                break;
                            }
                        }
                        if (!statusIsValid) {
                            $(element).hide();
                        }
                        else {
                            $(element).show();
                        }
                    }
                    else {
                        Logger.error('Missing entityStatus from $scope - hide/show based on entity status feature is disabled.');
                    }
                });
            }
        };
    }]);
    Apiman._module.factory('EntityStatusService', ['$rootScope', function ($rootScope) {
        var entityStatus = null;
        return {
            setEntityStatus: function (status) {
                entityStatus = status;
            },
            getEntityStatus: function () {
                return entityStatus;
            }
        };
    }]);
    Apiman._module.directive('apimanEntityStatus', ['Logger', 'EntityStatusService', function (Logger, EntityStatusService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function ($scope) {
                    return EntityStatusService.getEntityStatus();
                }, function (newValue, oldValue) {
                    var entityStatus = newValue;
                    if (entityStatus) {
                        $(element).html(entityStatus);
                        $(element).removeClass();
                        $(element).addClass('apiman-label');
                        if (entityStatus == 'Created' || entityStatus == 'Ready') {
                            $(element).addClass('apiman-label-warning');
                        }
                        else if (entityStatus == 'Retired') {
                            $(element).addClass('apiman-label-default');
                        }
                        else {
                            $(element).addClass('apiman-label-success');
                        }
                    }
                });
            }
        };
    }]);
    Apiman._module.directive('apimanSearchBox', ['Logger', 'TranslationService', function (Logger, TranslationService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'plugins/api-manager/html/directives/searchBox.html',
            scope: {
                searchFunction: '=function'
            },
            link: function (scope, element, attrs) {
                scope.placeholder = attrs.placeholder;
                if (attrs.apimanI18nKey) {
                    var translationKey = attrs.apimanI18nKey + ".placeholder";
                    var defaultValue = scope.placeholder;
                    var translatedValue = TranslationService.translate(translationKey, defaultValue);
                    scope.placeholder = translatedValue;
                }
                scope.doSearch = function () {
                    $(element).find('button i').removeClass('fa-search');
                    $(element).find('button i').removeClass('fa-close');
                    if (scope.value) {
                        $(element).find('button i').addClass('fa-close');
                    }
                    else {
                        $(element).find('button i').addClass('fa-search');
                    }
                    scope.searchFunction(scope.value);
                };
                scope.onClick = function () {
                    if (scope.value) {
                        scope.value = '';
                        $(element).find('button i').removeClass('fa-search');
                        $(element).find('button i').removeClass('fa-close');
                        $(element).find('button i').addClass('fa-search');
                    }
                    scope.searchFunction(scope.value);
                };
            }
        };
    }]);
    Apiman._module.directive('apimanConfirmModal', ['Logger', function (Logger) {
        return {
            templateUrl: 'plugins/api-manager/html/directives/confirmModal.html',
            replace: true,
            restrict: 'E',
            transclude: true,
            link: function (scope, element, attrs) {
                scope.title = attrs.modalTitle;
                $(element).on('hidden.bs.modal', function () {
                    $(element).remove();
                });
            }
        };
    }]);
    Apiman._module.directive('apimanSelectServiceModal', ['Logger', function (Logger) {
        return {
            templateUrl: 'plugins/api-manager/html/directives/selectServiceModal.html',
            replace: true,
            restrict: 'E',
            link: function (scope, element, attrs) {
                scope.title = attrs.modalTitle;
                $(element).on('hidden.bs.modal', function () {
                    $(element).remove();
                });
            }
        };
    }]);
    var entryTypeClasses = {
        Organization: 'fa-shield',
        Application: 'fa-gears',
        Plan: 'fa-bar-chart-o',
        Service: 'fa-puzzle-piece'
    };
    Apiman._module.directive('apimanActivity', ['Logger', '$rootScope', 'PageLifecycle', function (Logger, $rootScope, PageLifecycle) {
        return {
            templateUrl: 'plugins/api-manager/html/directives/activity.html',
            restrict: 'E',
            replace: true,
            scope: {
                auditEntries: '=model',
                next: '=next'
            },
            link: function (scope, element, attrs) {
                scope.pluginName = $rootScope.pluginName;
                scope.hasMore = true;
                scope.getEntryIcon = function (entry) {
                    return entryTypeClasses[entry.entityType];
                };
                scope.getMore = function () {
                    scope.getMoreButton.state = 'in-progress';
                    scope.next(function (newEntries) {
                        scope.auditEntries = scope.auditEntries.concat(newEntries);
                        scope.hasMore = newEntries.length >= 20;
                        scope.getMoreButton.state = 'complete';
                    }, PageLifecycle.handleError);
                };
            }
        };
    }]);
    Apiman._module.directive('apimanAuditEntry', ['Logger', '$rootScope', function (Logger, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                entry: '=model'
            },
            link: function (scope, element, attrs) {
                scope.pluginName = $rootScope.pluginName;
                scope.template = 'plugins/api-manager/html/directives/audit/' + scope.entry.entityType + '/audit' + scope.entry.what + '.html';
                if (scope.entry.data) {
                    scope.data = JSON.parse(scope.entry.data);
                }
            },
            template: '<div ng-include="template"></div>'
        };
    }]);
    Apiman._module.directive('apimanDropText', ['Logger', function (Logger) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            link: function ($scope, $elem, $attrs, ngModel) {
                $elem.on('dragover', function (e) {
                    e.preventDefault();
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = 'copy';
                    }
                    if (!$elem.hasClass('dropping')) {
                        $elem.addClass('dropping');
                    }
                    return false;
                });
                $elem.on('dragenter', function (e) {
                    e.preventDefault();
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = 'copy';
                    }
                    $elem.addClass('dropping');
                    return false;
                });
                $elem.on('dragleave', function (e) {
                    e.preventDefault();
                    $elem.removeClass('dropping');
                    return false;
                });
                $elem.on('drop', function (e) {
                    e.preventDefault();
                    $elem.removeClass('dropping');
                    if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                        if (e.preventDefault)
                            e.preventDefault();
                        if (e.stopPropagation)
                            e.stopPropagation();
                        var firstFile = e.originalEvent.dataTransfer.files[0];
                        var reader = new FileReader();
                        reader.onload = (function (theFile) {
                            return function (result) {
                                $elem.val(result.target.result);
                                ngModel.$setViewValue(result.target.result);
                            };
                        })(firstFile);
                        reader.readAsText(firstFile);
                    }
                });
            }
        };
    }]);
    Apiman._module.directive('apimanPolicyList', ['Logger', function (Logger) {
        return {
            restrict: 'E',
            scope: {
                policies: "=ngModel",
                remove: "=removeFunction",
                type: "@",
                org: "@orgId",
                id: "@pageId",
                version: "@"
            },
            controller: function ($scope) {
                $scope.policyListOptions = {
                    //containment: '#draggable-ctr',
                    containerPositioning: 'relative'
                };
                $scope.pluginName = $scope.$parent.pluginName;
            },
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'plugins/api-manager/html/directives/policyList.html'
        };
    }]);
    Apiman._module.directive('apimanEditableDescription', ['Logger', function (Logger) {
        return {
            restrict: 'E',
            scope: {
                descr: '=description',
                callback: '='
            },
            controller: function ($scope) {
            },
            link: function ($scope, $elem, $attrs) {
                $scope.defaultValue = $attrs.defaultValue;
                var elem = null;
                var previousRows = 1;
                $scope.topPosition = 0;
                $scope.leftPosition = 0;
                $scope.height = 60;
                // If description is updated, call updateFunction.
                $scope.$watch(function () {
                    return $scope.descr;
                }, function (new_value, old_value) {
                    if (old_value !== new_value && typeof old_value !== 'undefined') {
                        $scope.callback(new_value || '');
                    }
                });
                $scope.focusOnDescription = function (event) {
                    elem = event.target;
                    elem.value = $scope.descr;
                    $(elem).css('height', 'auto');
                    $(elem).height(elem.scrollHeight);
                };
                $scope.changeOnDescription = function () {
                    $(elem).css('height', 'auto');
                    $(elem).height(elem.scrollHeight);
                };
                $scope.descriptionMouseOver = function (event) {
                    $scope.showPencil = true;
                    var elem = event.target;
                    var position = elem.getBoundingClientRect();
                    // Calculate position of pen
                    // console.log("elem.top " + position.top);
                    // console.log("elem.bottom " + position.bottom);
                    // console.log("elem.left " + position.left);
                    // console.log("elem.right " + position.right);
                    if (position.right != 0) {
                        $scope.leftPosition = (position.right - position.left) - 15;
                        $scope.height = (position.bottom - position.top);
                    }
                };
                $scope.descriptionMouseOut = function (event) {
                    $scope.showPencil = false;
                };
            },
            templateUrl: 'plugins/api-manager/html/directives/editDescription.html'
        };
    }]);
    Apiman._module.run(function (editableOptions, editableThemes) {
        editableOptions.theme = 'default';
        // overwrite templates
        editableThemes['default'].submitTpl = '<button class="btn btn-default inline-save-btn" type="submit"><i class="fa fa-check fa-fw"></i></button>';
        editableThemes['default'].cancelTpl = '<button class="btn btn-default" type="button" ng-click="$form.$cancel()"><i class="fa fa-times fa-fw"></i></button>';
        editableThemes['default'].buttonsTpl = '<div></div>';
        editableThemes['default'].formTpl = '<form class="editable-wrap description apiman-inline-edit"></form>';
    });
    Apiman._module.directive('apimanI18nKey', ['Logger', 'TranslationService', function (Logger, TranslationService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (!attrs.apimanI18nKey) {
                    return;
                }
                var translationKey, defaultValue, translatedValue;
                // Process the text of the element only if it has no child elements
                if ($(element).children().length == 0) {
                    translationKey = attrs.apimanI18nKey;
                    defaultValue = $(element).text();
                    translatedValue = TranslationService.translate(translationKey, defaultValue);
                    $(element).text(translatedValue);
                }
                // Now process the placeholder attribute.
                if ($(element).attr('placeholder')) {
                    translationKey = attrs.apimanI18nKey + '.placeholder';
                    defaultValue = $(element).attr('placeholder');
                    translatedValue = TranslationService.translate(translationKey, defaultValue);
                    Logger.debug('Translating placeholder attr.  Key: {2}  default value: {0}  translated: {1}', defaultValue, translatedValue, translationKey);
                    $(element).prop('placeholder', translatedValue);
                    $(element).attr('placeholder', translatedValue);
                }
                // Now process the title attribute.
                if ($(element).attr('title')) {
                    translationKey = attrs.apimanI18nKey + '.title';
                    defaultValue = $(element).attr('title');
                    translatedValue = TranslationService.translate(translationKey, defaultValue);
                    Logger.debug('Translating title attr.  Key: {2}  default value: {0}  translated: {1}', defaultValue, translatedValue, translationKey);
                    $(element).prop('title', translatedValue);
                    $(element).attr('title', translatedValue);
                }
            }
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman._module.controller("Apiman.Error400Controller", ['$scope', '$rootScope', 'PageLifecycle', function ($scope, $rootScope, PageLifecycle) {
        PageLifecycle.loadPage('Error', undefined, $scope, function () {
            PageLifecycle.setPageTitle('error', 400);
        });
    }]);
    Apiman._module.controller("Apiman.Error403Controller", ['$scope', '$rootScope', 'PageLifecycle', function ($scope, $rootScope, PageLifecycle) {
        PageLifecycle.loadPage('Error', undefined, $scope, function () {
            PageLifecycle.setPageTitle('error', 403);
        });
    }]);
    Apiman._module.controller("Apiman.Error404Controller", ['$scope', '$rootScope', 'PageLifecycle', function ($scope, $rootScope, PageLifecycle) {
        PageLifecycle.loadPage('Error', undefined, $scope, function () {
            PageLifecycle.setPageTitle('error', 404);
        });
    }]);
    Apiman._module.controller("Apiman.Error409Controller", ['$scope', '$rootScope', 'PageLifecycle', function ($scope, $rootScope, PageLifecycle) {
        PageLifecycle.loadPage('Error', undefined, $scope, function () {
            PageLifecycle.setPageTitle('error', 409);
        });
    }]);
    Apiman._module.controller("Apiman.Error500Controller", ['$scope', '$rootScope', 'PageLifecycle', 'Logger', function ($scope, $rootScope, PageLifecycle, Logger) {
        $scope.error = $rootScope.pageError;
        PageLifecycle.loadPage('Error', undefined, $scope, function () {
            PageLifecycle.setPageTitle('error', 500);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../../includes.ts"/>
var ApimanPageLifecycle;
(function (ApimanPageLifecycle) {
    ApimanPageLifecycle.pageTitles = {
        "page.title.admin-gateways": "apiman - Admin - Gateways",
        "page.title.admin-plugins": "apiman - Admin - Plugins",
        "page.title.admin-roles": "apiman - Admin - Roles",
        "page.title.admin-policyDefs": "apiman - Admin - Policy Definitions",
        "page.title.app-activity": "apiman - {0} (Activity)",
        "page.title.app-apis": "apiman - {0} (APIs)",
        "page.title.app-contracts": "apiman - {0} (Contracts)",
        "page.title.app-overview": "apiman - {0} (Overview)",
        "page.title.app-policies": "apiman - {0} (Policies)",
        "page.title.consumer-org": "apiman - Organization {0}",
        "page.title.consumer-orgs": "apiman - Organizations",
        "page.title.consumer-service": "apiman - Service {0}",
        "page.title.consumer-services": "apiman - Services",
        "page.title.dashboard": "apiman - Home",
        "page.title.edit-gateway": "apiman - Edit Gateway",
        "page.title.edit-policy": "apiman - Edit Policy",
        "page.title.edit-policyDef": "apiman - Edit Policy Definition",
        "page.title.edit-role": "apiman - Edit Role",
        "page.title.import-policyDefs": "apiman - Import Policy Definition(s)",
        "page.title.import-services": "apiman - Import Service(s)",
        "page.title.new-app": "apiman - New Application",
        "page.title.new-app-version": "apiman - New Application Version",
        "page.title.new-contract": "apiman - New Contract",
        "page.title.new-gateway": "apiman - New Gateway",
        "page.title.new-member": "apiman - Add Member",
        "page.title.new-org": "apiman - New Organization",
        "page.title.new-plan": "apiman - New Plan",
        "page.title.new-plan-version": "apiman - New Plan Version",
        "page.title.new-plugin": "apiman - Add Plugin",
        "page.title.new-policy": "apiman - Add Policy",
        "page.title.new-role": "apiman - New Role",
        "page.title.new-service": "apiman - New Service",
        "page.title.new-service-version": "apiman - New Service Version",
        "page.title.org-activity": "apiman - {0} (Activity)",
        "page.title.org-apps": "apiman - {0} (Applications)",
        "page.title.org-manage-members": "apiman - {0} (Manage Members)",
        "page.title.org-members": "apiman - {0} (Members)",
        "page.title.org-plans": "apiman - {0} (Plans)",
        "page.title.org-services": "apiman - {0} (Services)",
        "page.title.plan-activity": "apiman - {0} (Activity)",
        "page.title.plan-overview": "apiman - {0} (Overview)",
        "page.title.plan-policies": "apiman - {0} (Policies)",
        "page.title.plugin-details": "apiman - Plugin Details",
        "page.title.policy-defs": "apiman - Admin - Policy Definitions",
        "page.title.service-activity": "apiman - {0} (Activity)",
        "page.title.service-contracts": "apiman - {0} (Contracts)",
        "page.title.service-endpoint": "apiman - {0} (Endpoint)",
        "page.title.service-impl": "apiman - {0} (Implementation)",
        "page.title.service-overview": "apiman - {0} (Overview)",
        "page.title.service-plans": "apiman - {0} (Plans)",
        "page.title.service-policies": "apiman - {0} (Policies)",
        "page.title.user-activity": "apiman - {0} (Activity)",
        "page.title.user-apps": "apiman - {0} (Applications)",
        "page.title.user-orgs": "apiman - {0} (Organizations)",
        "page.title.user-profile": "apiman - User Profile",
        "page.title.user-services": "apiman - {0} (Services)",
        "page.title.error": "apiman - {0} Error",
    };
    var formatMessage = function (theArgs) {
        var now = new Date();
        var msg = theArgs[0];
        if (theArgs.length > 1) {
            for (var i = 1; i < theArgs.length; i++) {
                msg = msg.replace('{' + (i - 1) + '}', theArgs[i]);
            }
        }
        return msg;
    };
    ApimanPageLifecycle._module = angular.module("ApimanPageLifecycle", []);
    ApimanPageLifecycle.PageLifecycle = ApimanPageLifecycle._module.factory('PageLifecycle', ['$q', 'Logger', '$rootScope', '$location', 'CurrentUserSvcs', 'Configuration', function ($q, Logger, $rootScope, $location, CurrentUserSvcs, Configuration) {
        $rootScope.showHeader = true;
        if (Configuration['ui'] && Configuration.ui.header == false) {
            $rootScope.showHeader = false;
        }
        var processCurrentUser = function (currentUser) {
            $rootScope.currentUser = currentUser;
            var permissions = {};
            var memberships = {};
            if (currentUser.permissions) {
                for (var i = 0; i < currentUser.permissions.length; i++) {
                    var perm = currentUser.permissions[i];
                    var permid = perm.organizationId + '||' + perm.name;
                    permissions[permid] = true;
                    memberships[perm.organizationId] = true;
                }
            }
            Logger.info('Updating permissions now {0}', permissions);
            $rootScope.permissions = permissions;
            $rootScope.memberships = memberships;
        };
        var handleError = function (error) {
            $rootScope.pageState = 'error';
            $rootScope.pageError = error;
            if (error.status == 400) {
                Logger.info('Detected an error {0}, redirecting to 400.', error.status);
                $location.url(Apiman.pluginName + '/errors/400').replace();
            }
            else if (error.status == 403) {
                Logger.info('Detected an error {0}, redirecting to 403.', error.status);
                $location.url(Apiman.pluginName + '/errors/403').replace();
            }
            else if (error.status == 404) {
                Logger.info('Detected an error {0}, redirecting to 404.', error.status);
                $location.url(Apiman.pluginName + '/errors/404').replace();
            }
            else if (error.status == 409) {
                Logger.info('Detected an error {0}, redirecting to 409.', error.status);
                $location.url(Apiman.pluginName + '/errors/409').replace();
            }
            else {
                Logger.info('Detected an error {0}, redirecting to 500.', error.status);
                $location.url(Apiman.pluginName + '/errors/500').replace();
            }
        };
        return {
            setPageTitle: function (titleKey, params) {
                var pattern = ApimanPageLifecycle.pageTitles['page.title.' + titleKey];
                if (pattern) {
                    var args = [];
                    args.push(pattern);
                    args = args.concat(params);
                    var title = formatMessage(args);
                    document.title = title;
                }
                else {
                    document.title = pattern;
                }
            },
            handleError: handleError,
            forwardTo: function () {
                var path = '/' + Apiman.pluginName + formatMessage(arguments);
                Logger.info('Forwarding to page {0}', path);
                $location.url(path).replace();
            },
            redirectTo: function () {
                var path = '/' + Apiman.pluginName + formatMessage(arguments);
                Logger.info('Redirecting to page {0}', path);
                $location.url(path);
            },
            loadPage: function (pageName, pageData, $scope, handler) {
                Logger.log("|{0}| >> Loading page.", pageName);
                $rootScope.pageState = 'loading';
                // Every page gets the current user.
                var allData = undefined;
                var commonData = {
                    currentUser: $q(function (resolve, reject) {
                        if ($rootScope.currentUser) {
                            Logger.log("|{0}| >> Using cached current user from $rootScope.");
                            resolve($rootScope.currentUser);
                        }
                        else {
                            CurrentUserSvcs.get({ what: 'info' }, function (currentUser) {
                                processCurrentUser(currentUser);
                                resolve(currentUser);
                            }, reject);
                        }
                    })
                };
                // If some additional page data is requested, merge it into the common data
                if (pageData) {
                    allData = angular.extend({}, commonData, pageData);
                }
                else {
                    allData = commonData;
                }
                // Now resolve the data as a promise (wait for all data packets to be fetched)
                var promise = $q.all(allData);
                promise.then(function (data) {
                    var count = 0;
                    angular.forEach(data, function (value, key) {
                        Logger.debug("|{0}| >> Binding {1} to $scope.", pageName, key);
                        this[key] = value;
                        count++;
                    }, $scope);
                    $rootScope.pageState = 'loaded';
                    if (handler) {
                        handler();
                    }
                    Logger.log("|{0}| >> Page successfully loaded: {1} data packets loaded", pageName, count);
                }, function (reason) {
                    Logger.error("|{0}| >> Page load failed: {1}", pageName, reason);
                    handleError(reason);
                });
            }
        };
    }]);
})(ApimanPageLifecycle || (ApimanPageLifecycle = {}));

/// <reference path="../../includes.ts"/>
var ApimanLogger;
(function (ApimanLogger) {
    ApimanLogger._module = angular.module("ApimanLogger", []);
    var stringifyIfObject = function (candidate) {
        return (typeof candidate === 'object') ? angular.toJson(candidate) : candidate;
    };
    var _formatMessage = function (theArgs) {
        var now = new Date();
        var msg = theArgs[0];
        if (theArgs.length > 1) {
            for (var i = 1; i < theArgs.length; i++) {
                msg = msg.replace('{' + (i - 1) + '}', stringifyIfObject(theArgs[i]));
            }
        }
        else {
            msg = stringifyIfObject(msg);
        }
        return 'apiman [' + now.toLocaleTimeString() + ']>>  ' + msg;
    };
    ApimanLogger.Logger = ApimanLogger._module.factory('Logger', function () {
        return {
            info: function () {
                console.info(_formatMessage(arguments));
            },
            log: function () {
                console.info(_formatMessage(arguments));
            },
            debug: function () {
                console.warn(_formatMessage(arguments));
            },
            error: function () {
                console.error(_formatMessage(arguments));
            }
        };
    });
})(ApimanLogger || (ApimanLogger = {}));

/// <reference path="apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NavbarController = Apiman._module.controller("Apiman.NavbarController", ['$scope', 'Logger', 'Configuration', function ($scope, Logger, Configuration) {
        Logger.log("Current user is {0}.", Configuration.user.username);
        $scope.username = Configuration.user.username;
        $scope.logoutUrl = Configuration.apiman.logoutUrl;
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../../includes.ts"/>
var ApimanServices;
(function (_ApimanServices) {
    _ApimanServices._module = angular.module("ApimanServices", ['ngResource', 'ApimanConfiguration']);
    _ApimanServices.ApimanServices = _ApimanServices._module.factory('ApimanSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        var endpoint = Configuration.api.endpoint + '/:entityType/:secondaryType';
        return $resource(endpoint, { entityType: '@entityType', secondaryType: '@secondaryType' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
    }]);
    _ApimanServices.UserServices = _ApimanServices._module.factory('UserSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        var endpoint = Configuration.api.endpoint + '/users/:user/:entityType';
        return $resource(endpoint, { user: '@user', entityType: '@entityType' });
    }]);
    _ApimanServices.OrganizationServices = _ApimanServices._module.factory('OrgSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        var endpoint = Configuration.api.endpoint + '/organizations/:organizationId/:entityType/:entityId/:versionsOrActivity/:version/:policiesOrActivity/:policyId/:policyChain';
        return $resource(endpoint, {
            organizationId: '@organizationId',
            entityType: '@entityType',
            entityId: '@entityId',
            versionsOrActivity: '@versionsOrActivity',
            version: '@version',
            policiesOrActivity: '@policiesOrActivity',
            policyId: '@policyId',
            chain: '@policyChain',
            page: '@page',
            count: '@count'
        }, {
            update: {
                method: 'PUT' // update issues a PUT request
            }
        });
    }]);
    _ApimanServices.CurrentUserServices = _ApimanServices._module.factory('CurrentUserSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        var endpoint = Configuration.api.endpoint + '/currentuser/:what';
        return $resource(endpoint, { entityType: '@what' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
    }]);
    _ApimanServices.ActionServices = _ApimanServices._module.factory('ActionSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        var endpoint = Configuration.api.endpoint + '/actions';
        return $resource(endpoint);
    }]);
    _ApimanServices.AuditServices = _ApimanServices._module.factory('AuditSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        var endpoint = Configuration.api.endpoint + '/organizations/:organizationId/:entityType/:entityId/activity';
        return $resource(endpoint, {
            organizationId: '@organizationId',
            entityType: '@entityType',
            entityId: '@entityId',
            page: '@page',
            count: '@count'
        });
    }]);
    _ApimanServices.UserAuditServices = _ApimanServices._module.factory('UserAuditSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        var endpoint = Configuration.api.endpoint + '/users/:user/activity';
        return $resource(endpoint, {
            user: '@user',
            page: '@page',
            count: '@count'
        });
    }]);
    _ApimanServices.PluginServices = _ApimanServices._module.factory('PluginSvcs', ['$resource', 'Configuration', function ($resource, Configuration) {
        return {
            getPolicyForm: function (pluginId, policyDefId, handler, errorHandler) {
                var endpoint = Configuration.api.endpoint + '/plugins/:pluginId/policyDefs/:policyDefId/form';
                $resource(endpoint, { pluginId: '@pluginId', policyDefId: '@policyDefId' }).get({ pluginId: pluginId, policyDefId: policyDefId }, handler, errorHandler);
            }
        };
    }]);
})(ApimanServices || (ApimanServices = {}));

/// <reference path="apimanPlugin.ts"/>
/// <reference path="services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman._module.controller("Apiman.DefaultPolicyConfigFormController", ['$scope', 'Logger', function ($scope, Logger) {
        var validateRaw = function (config) {
            var valid = true;
            try {
                var parsed = JSON.parse(config);
                $scope.config = parsed;
            }
            catch (e) {
                valid = false;
            }
            $scope.setValid(valid);
        };
        $scope.$watch('rawConfig', validateRaw);
    }]);
    Apiman._module.controller("Apiman.JsonSchemaPolicyConfigFormController", ['$scope', 'Logger', 'PluginSvcs', function ($scope, Logger, PluginSvcs) {
        var initEditor = function (schema) {
            var holder = document.getElementById('json-editor-holder');
            var editor = new window['JSONEditor'](holder, {
                // Disable fetching schemas via ajax
                ajax: false,
                // The schema for the editor
                schema: schema,
                // Disable additional properties
                no_additional_properties: true,
                // Require all properties by default
                required_by_default: true,
                disable_edit_json: true,
                disable_properties: true,
                iconlib: "fontawesome4",
                theme: "bootstrap3"
            });
            editor.on('change', function () {
                $scope.$apply(function () {
                    // Get an array of errors from the validator
                    var errors = editor.validate();
                    // Not valid
                    if (errors.length) {
                        $scope.setValid(false);
                    }
                    else {
                        $scope.setValid(true);
                        $scope.setConfig($scope.editor.getValue());
                    }
                });
            });
            $scope.editor = editor;
        };
        var destroyEditor = function () {
            $scope.editor.destroy();
        };
        $scope.$on('$destroy', function () {
            Logger.debug('Destroying the json-editor!');
            destroyEditor();
        });
        $scope.schemaState = 'loading';
        var pluginId = $scope.selectedDef.pluginId;
        var policyDefId = $scope.selectedDef.id;
        PluginSvcs.getPolicyForm(pluginId, policyDefId, function (schema) {
            Logger.debug("Schema: {0}", schema);
            initEditor(schema);
            $scope.editor.setValue($scope.config);
            $scope.schemaState = 'loaded';
        }, function (error) {
            // TODO handle the error better here!
            Logger.error(error);
            $scope.schemaState = 'loaded';
        });
    }]);
    Apiman._module.controller("Apiman.RateLimitingFormController", ['$scope', 'Logger', function ($scope, Logger) {
        var validate = function (config) {
            var valid = true;
            if (!config.limit || config.limit < 1) {
                valid = false;
            }
            if (!config.granularity) {
                valid = false;
            }
            if (!config.period) {
                valid = false;
            }
            $scope.setValid(valid);
        };
        $scope.$watch('config', validate, true);
    }]);
    Apiman._module.controller("Apiman.IPListFormController", ['$scope', 'Logger', function ($scope, Logger) {
        var validate = function (config) {
            var valid = true;
            $scope.setValid(valid);
        };
        $scope.$watch('config', validate, true);
        if (!$scope.config.ipList) {
            $scope.config.ipList = [];
        }
        $scope.add = function (ip) {
            $scope.remove(ip);
            $scope.config.ipList.push(ip);
            $scope.selectedIP = [ip];
            $scope.ipAddress = undefined;
            $('#ip-address').focus();
        };
        $scope.remove = function (ips) {
            angular.forEach(ips, function (ip) {
                var idx = -1;
                angular.forEach($scope.config.ipList, function (item, index) {
                    if (item == ip) {
                        idx = index;
                    }
                });
                if (idx != -1) {
                    $scope.config.ipList.splice(idx, 1);
                }
            });
            $scope.selectedIP = undefined;
        };
        $scope.clear = function () {
            $scope.config.ipList = [];
            $scope.selectedIP = undefined;
        };
    }]);
    Apiman._module.controller("Apiman.IgnoredResourcesFormController", ['$scope', 'Logger', function ($scope, Logger) {
        var validate = function (config) {
            var valid = true;
            $scope.setValid(valid);
        };
        $scope.$watch('config', validate, true);
        $scope.add = function (path) {
            if (!$scope.config.pathsToIgnore) {
                $scope.config.pathsToIgnore = [];
            }
            $scope.remove(path);
            $scope.config.pathsToIgnore.push(path);
            $scope.selectedPath = [path];
            $scope.path = undefined;
            $('#path').focus();
        };
        $scope.remove = function (paths) {
            angular.forEach(paths, function (path) {
                var idx = -1;
                angular.forEach($scope.config.pathsToIgnore, function (item, index) {
                    if (item == path) {
                        idx = index;
                    }
                });
                if (idx != -1) {
                    $scope.config.pathsToIgnore.splice(idx, 1);
                }
            });
            $scope.selectedPath = undefined;
        };
        $scope.clear = function () {
            $scope.config.pathsToIgnore = [];
            $scope.selectedPath = undefined;
        };
    }]);
    Apiman._module.controller("Apiman.BasicAuthFormController", ['$scope', 'Logger', function ($scope, Logger) {
        var validate = function (config) {
            var valid = true;
            if (!config.realm) {
                valid = false;
            }
            if (!config.staticIdentity && !config.ldapIdentity && !config.jdbcIdentity) {
                valid = false;
            }
            if (config.staticIdentity) {
                if (!config.staticIdentity.identities) {
                    valid = false;
                }
            }
            if (config.ldapIdentity) {
                if (!config.ldapIdentity.url) {
                    valid = false;
                }
                if (!config.ldapIdentity.dnPattern) {
                    valid = false;
                }
            }
            if (config.jdbcIdentity) {
                if (!config.jdbcIdentity.datasourcePath) {
                    valid = false;
                }
                if (!config.jdbcIdentity.query) {
                    valid = false;
                }
            }
            $scope.setValid(valid);
        };
        $scope.$watch('config', validate, true);
        if ($scope.config.staticIdentity) {
            $scope.identitySourceType = 'static';
        }
        else if ($scope.config.ldapIdentity) {
            $scope.identitySourceType = 'ldap';
        }
        else if ($scope.config.jdbcIdentity) {
            $scope.identitySourceType = 'jdbc';
        }
        $scope.$watch('identitySourceType', function (newValue) {
            if (newValue) {
                if (newValue == 'static' && !$scope.config.staticIdentity) {
                    $scope.config.staticIdentity = new Object();
                    delete $scope.config.ldapIdentity;
                    delete $scope.config.jdbcIdentity;
                }
                else if (newValue == 'jdbc' && !$scope.config.jdbcIdentity) {
                    $scope.config.jdbcIdentity = new Object();
                    $scope.config.jdbcIdentity.hashAlgorithm = 'SHA1';
                    delete $scope.config.staticIdentity;
                    delete $scope.config.ldapIdentity;
                }
                else if (newValue == 'ldap' && !$scope.config.ldapIdentity) {
                    $scope.config.ldapIdentity = new Object();
                    delete $scope.config.staticIdentity;
                    delete $scope.config.jdbcIdentity;
                }
            }
        });
        $scope.add = function (username, password) {
            var item = {
                username: username,
                password: password
            };
            if (!$scope.config.staticIdentity.identities) {
                $scope.config.staticIdentity.identities = [];
            }
            $scope.remove([item]);
            $scope.config.staticIdentity.identities.push(item);
            $scope.selectedIdentity = [item];
            $scope.username = undefined;
            $scope.password = undefined;
            $('#username').focus();
        };
        $scope.remove = function (selectedIdentities) {
            angular.forEach(selectedIdentities, function (identity) {
                var idx = -1;
                angular.forEach($scope.config.staticIdentity.identities, function (item, index) {
                    if (item.username == identity.username) {
                        idx = index;
                    }
                });
                if (idx != -1) {
                    $scope.config.staticIdentity.identities.splice(idx, 1);
                }
            });
            $scope.selectedIdentity = undefined;
        };
        $scope.clear = function () {
            $scope.config.staticIdentity.identities = [];
            $scope.selectedIdentity = undefined;
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="apimanPlugin.ts"/>
/// <reference path="services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.UserProfileController = Apiman._module.controller("Apiman.UserProfileController", ['$q', '$scope', '$location', 'CurrentUserSvcs', 'PageLifecycle', function ($q, $scope, $location, CurrentUserSvcs, PageLifecycle) {
        var pageData = {
            user: $q(function (resolve, reject) {
                CurrentUserSvcs.get({ what: 'info' }, resolve, reject);
            })
        };
        $scope.isDirty = false;
        $scope.isValid = true;
        $scope.updatedUser = {
            fullName: undefined,
            email: undefined
        };
        $scope.$watch('updatedUser', function (newValue) {
            var dirty = false;
            var valid = true;
            if (!newValue.fullName) {
                valid = false;
            }
            if (!newValue.email) {
                valid = false;
            }
            if (newValue.fullName != $scope.user.fullName) {
                dirty = true;
            }
            if (newValue.email != $scope.user.email) {
                dirty = true;
            }
            $scope.isDirty = dirty;
            $scope.isValid = valid;
        }, true);
        $scope.save = function () {
            $scope.updateButton.state = 'in-progress';
            CurrentUserSvcs.update({ what: 'info' }, $scope.updatedUser, function () {
                $scope.updateButton.state = 'complete';
                $scope.user.fullName = $scope.updatedUser.fullName;
                $scope.user.email = $scope.updatedUser.email;
                $scope.isValid = true;
                $scope.isDirty = false;
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('UserProfile', pageData, $scope, function () {
            $scope.updatedUser.fullName = $scope.user.fullName;
            $scope.updatedUser.email = $scope.user.email;
            PageLifecycle.setPageTitle('user-profile');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../../includes.ts"/>
var ApimanTranslation;
(function (ApimanTranslation) {
    ApimanTranslation._module = angular.module("ApimanTranslation", []);
    ApimanTranslation.Translation = ApimanTranslation._module.factory('TranslationService', ['$window', function ($window) {
        return {
            translate: function (key, defaultValue) {
                var translation = undefined;
                if ($window.APIMAN_TRANSLATION_DATA && $window.APIMAN_TRANSLATION_DATA[key]) {
                    translation = $window.APIMAN_TRANSLATION_DATA[key];
                }
                else {
                    translation = defaultValue;
                }
                return translation;
            }
        };
    }]);
})(ApimanTranslation || (ApimanTranslation = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AdminGatewaysController = Apiman._module.controller("Apiman.AdminGatewaysController", ['$q', '$scope', 'ApimanSvcs', 'PageLifecycle', function ($q, $scope, ApimanSvcs, PageLifecycle) {
        $scope.tab = 'gateways';
        var pageData = {
            gateways: $q(function (resolve, reject) {
                ApimanSvcs.query({ entityType: 'gateways' }, function (adminGateways) {
                    resolve(adminGateways);
                }, reject);
            })
        };
        PageLifecycle.loadPage('AdminGateways', pageData, $scope, function () {
            PageLifecycle.setPageTitle('admin-gateways');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AdminPluginsController = Apiman._module.controller("Apiman.AdminPluginsController", ['$q', '$scope', 'ApimanSvcs', 'PageLifecycle', function ($q, $scope, ApimanSvcs, PageLifecycle) {
        $scope.tab = 'plugins';
        var pageData = {
            plugins: $q(function (resolve, reject) {
                ApimanSvcs.query({ entityType: 'plugins' }, function (adminPlugins) {
                    resolve(adminPlugins);
                }, reject);
            })
        };
        PageLifecycle.loadPage('AdminPlugins', pageData, $scope, function () {
            PageLifecycle.setPageTitle('admin-plugins');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AdminPolicyDefsController = Apiman._module.controller("Apiman.AdminPolicyDefsController", ['$q', '$scope', 'ApimanSvcs', 'PageLifecycle', function ($q, $scope, ApimanSvcs, PageLifecycle) {
        $scope.tab = 'policyDefs';
        $scope.filterPolicies = function (value) {
            if (!value) {
                $scope.filteredPolicyDefs = $scope.policyDefs;
            }
            else {
                var filtered = [];
                angular.forEach($scope.policyDefs, function (policyDef) {
                    if (policyDef.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(policyDef);
                    }
                });
                $scope.filteredPolicyDefs = filtered;
            }
        };
        var pageData = {
            policyDefs: $q(function (resolve, reject) {
                ApimanSvcs.query({ entityType: 'policyDefs' }, function (policyDefs) {
                    $scope.filteredPolicyDefs = policyDefs;
                    resolve(policyDefs);
                }, reject);
            })
        };
        PageLifecycle.loadPage('AdminPolicyDefs', pageData, $scope, function () {
            PageLifecycle.setPageTitle('admin-policyDefs');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AdminRolesController = Apiman._module.controller("Apiman.AdminRolesController", ['$q', '$scope', 'ApimanSvcs', 'PageLifecycle', function ($q, $scope, ApimanSvcs, PageLifecycle) {
        $scope.tab = 'roles';
        $scope.filterRoles = function (value) {
            if (!value) {
                $scope.filteredRoles = $scope.roles;
            }
            else {
                var filtered = [];
                angular.forEach($scope.roles, function (role) {
                    if (role.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(role);
                    }
                });
                $scope.filteredRoles = filtered;
            }
        };
        var pageData = {
            roles: $q(function (resolve, reject) {
                ApimanSvcs.query({ entityType: 'roles' }, function (adminRoles) {
                    $scope.filteredRoles = adminRoles;
                    resolve(adminRoles);
                }, reject);
            })
        };
        PageLifecycle.loadPage('AdminRoles', pageData, $scope, function () {
            PageLifecycle.setPageTitle('admin-roles');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AppActivityController = Apiman._module.controller("Apiman.AppActivityController", ['$q', '$scope', '$location', 'Logger', 'PageLifecycle', 'AppEntityLoader', 'AuditSvcs', '$routeParams', function ($q, $scope, $location, Logger, PageLifecycle, AppEntityLoader, AuditSvcs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'activity';
        $scope.version = params.version;
        var getNextPage = function (successHandler, errorHandler) {
            $scope.currentPage = $scope.currentPage + 1;
            AuditSvcs.get({ organizationId: params.org, entityType: 'applications', entityId: params.app, page: $scope.currentPage, count: 20 }, function (results) {
                var entries = results.beans;
                successHandler(entries);
            }, errorHandler);
        };
        var pageData = AppEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            auditEntries: $q(function (resolve, reject) {
                $scope.currentPage = 0;
                getNextPage(resolve, reject);
            })
        });
        $scope.getNextPage = getNextPage;
        PageLifecycle.loadPage('AppActivity', pageData, $scope, function () {
            PageLifecycle.setPageTitle('app-activity', [$scope.app.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AppApisController = Apiman._module.controller("Apiman.AppApisController", ['$q', '$scope', '$location', 'PageLifecycle', 'AppEntityLoader', 'Logger', 'OrgSvcs', '$rootScope', '$compile', '$timeout', '$routeParams', function ($q, $scope, $location, PageLifecycle, AppEntityLoader, Logger, OrgSvcs, $rootScope, $compile, $timeout, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'apis';
        $scope.version = params.version;
        $scope.downloadAsJson = 'proxies/apiman/organizations/' + params.org + '/applications/' + params.app + '/versions/' + params.version + '/apiregistry/json';
        $scope.downloadAsXml = 'proxies/apiman/organizations/' + params.org + '/applications/' + params.app + '/versions/' + params.version + '/apiregistry/xml';
        $scope.toggle = function (api) {
            api.expanded = !api.expanded;
        };
        $scope.howToInvoke = function (api) {
            var modalScope = $rootScope.$new(true);
            modalScope.asQueryParam = api.httpEndpoint + '?apikey=' + api.apiKey;
            if (api.httpEndpoint.indexOf('?') > -1) {
                modalScope.asQueryParam = api.httpEndpoint + '&apikey=' + api.apiKey;
            }
            modalScope.asRequestHeader = 'X-API-Key: ' + api.apiKey;
            $('body').append($compile('<apiman-api-modal></apiman-api-modal>')(modalScope));
            $timeout(function () {
                $('#apiModal')['modal']({ 'keyboard': true, 'backdrop': 'static' });
            }, 1);
        };
        var pageData = AppEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            apiRegistry: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'apiregistry', policyId: 'json' }, resolve, reject);
            })
        });
        PageLifecycle.loadPage('AppApis', pageData, $scope, function () {
            Logger.info("API Registry: {0}", $scope.apiRegistry);
            PageLifecycle.setPageTitle('app-apis', [$scope.app.name]);
        });
    }]);
    Apiman._module.directive('apimanApiModal', ['Logger', function (Logger) {
        return {
            templateUrl: 'plugins/api-manager/html/app/apiModal.html',
            replace: true,
            restrict: 'E',
            link: function (scope, element, attrs) {
                $(element).on('hidden.bs.modal', function () {
                    $(element).remove();
                });
            }
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AppContractsController = Apiman._module.controller("Apiman.AppContractsController", ['$q', '$scope', '$location', 'PageLifecycle', 'AppEntityLoader', 'OrgSvcs', 'Logger', 'Dialogs', '$routeParams', function ($q, $scope, $location, PageLifecycle, AppEntityLoader, OrgSvcs, Logger, Dialogs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'contracts';
        $scope.version = params.version;
        var pageData = AppEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            contracts: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'contracts' }, function (contracts) {
                    $scope.filteredContracts = contracts;
                    resolve(contracts);
                }, reject);
            })
        });
        function removeContractFromArray(contract, carray) {
            var idx = -1;
            for (var i = 0; i < carray.length; i++) {
                if (carray[i].contractId == contract.contractId) {
                    idx = i;
                    break;
                }
            }
            if (idx > -1) {
                carray.splice(idx, 1);
            }
        }
        ;
        $scope.filterContracts = function (value) {
            Logger.debug('Called filterContracts!');
            if (!value) {
                $scope.filteredContracts = $scope.contracts;
            }
            else {
                var fc = [];
                angular.forEach($scope.contracts, function (contract) {
                    if (contract.serviceOrganizationName.toLowerCase().indexOf(value.toLowerCase()) > -1 || contract.serviceName.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        fc.push(contract);
                    }
                });
                $scope.filteredContracts = fc;
            }
        };
        $scope.breakAll = function () {
            Dialogs.confirm('Break All Contracts?', 'Do you really want to break all contracts with all services?', function () {
                OrgSvcs.delete({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'contracts' }, function () {
                    $scope.contracts = [];
                    $scope.filteredContracts = [];
                }, PageLifecycle.handleError);
            });
        };
        $scope.break = function (contract) {
            Logger.debug("Called break() with {0}.", contract);
            Dialogs.confirm('Break Contract', 'Do you really want to break this contract?', function () {
                OrgSvcs.delete({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'contracts', policyId: contract.contractId }, function () {
                    removeContractFromArray(contract, $scope.contracts);
                    removeContractFromArray(contract, $scope.filteredContracts);
                }, PageLifecycle.handleError);
            });
        };
        PageLifecycle.loadPage('AppContracts', pageData, $scope, function () {
            PageLifecycle.setPageTitle('app-contracts', [$scope.app.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AppOverviewController = Apiman._module.controller("Apiman.AppOverviewController", ['$q', '$scope', '$location', 'PageLifecycle', 'AppEntityLoader', '$routeParams', function ($q, $scope, $location, PageLifecycle, AppEntityLoader, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'overview';
        $scope.version = params.version;
        var pageData = AppEntityLoader.getCommonData($scope, $location);
        PageLifecycle.loadPage('AppOverview', pageData, $scope, function () {
            PageLifecycle.setPageTitle('app-overview', [$scope.app.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AppPoliciesController = Apiman._module.controller("Apiman.AppPoliciesController", ['$q', '$scope', '$location', 'PageLifecycle', 'AppEntityLoader', 'OrgSvcs', 'Dialogs', '$routeParams', function ($q, $scope, $location, PageLifecycle, AppEntityLoader, OrgSvcs, Dialogs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'policies';
        $scope.version = params.version;
        var removePolicy = function (policy) {
            angular.forEach($scope.policies, function (p, index) {
                if (policy === p) {
                    $scope.policies.splice(index, 1);
                }
            });
        };
        $scope.removePolicy = function (policy) {
            Dialogs.confirm('Confirm Remove Policy', 'Do you really want to remove this policy from the application?', function () {
                OrgSvcs.delete({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'policies', policyId: policy.id }, function (reply) {
                    removePolicy(policy);
                }, PageLifecycle.handleError);
            });
        };
        var pageData = AppEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            policies: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'policies' }, function (policies) {
                    resolve(policies);
                }, reject);
            })
        });
        PageLifecycle.loadPage('AppPolicies', pageData, $scope, function () {
            PageLifecycle.setPageTitle('app-policies', [$scope.app.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.AppRedirectController = Apiman._module.controller("Apiman.AppRedirectController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, $routeParams) {
        var orgId = $routeParams.org;
        var appId = $routeParams.app;
        var pageData = {
            versions: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: orgId, entityType: 'applications', entityId: appId, versionsOrActivity: 'versions' }, resolve, reject);
            })
        };
        PageLifecycle.loadPage('AppRedirect', pageData, $scope, function () {
            var version = $scope.versions[0].version;
            if (!version) {
                PageLifecycle.handleError({ status: 404 });
            }
            else {
                PageLifecycle.forwardTo('/orgs/{0}/apps/{1}/{2}', orgId, appId, version);
            }
        });
    }]);
    Apiman.AppEntityLoader = Apiman._module.factory('AppEntityLoader', ['$q', 'OrgSvcs', 'Logger', '$rootScope', '$routeParams', 'EntityStatusService', function ($q, OrgSvcs, Logger, $rootScope, $routeParams, EntityStatusService) {
        return {
            getCommonData: function ($scope, $location) {
                var params = $routeParams;
                return {
                    version: $q(function (resolve, reject) {
                        OrgSvcs.get({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: params.version }, function (version) {
                            $scope.org = version.application.organization;
                            $scope.app = version.application;
                            $rootScope.mruApp = version;
                            EntityStatusService.setEntityStatus(version.status);
                            resolve(version);
                        }, reject);
                    }),
                    versions: $q(function (resolve, reject) {
                        OrgSvcs.query({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions' }, resolve, reject);
                    })
                };
            }
        };
    }]);
    Apiman.AppEntityController = Apiman._module.controller("Apiman.AppEntityController", ['$q', '$scope', '$location', 'ActionSvcs', 'Logger', 'Dialogs', 'PageLifecycle', '$routeParams', 'OrgSvcs', 'EntityStatusService', function ($q, $scope, $location, ActionSvcs, Logger, Dialogs, PageLifecycle, $routeParams, OrgSvcs, EntityStatusService) {
        var params = $routeParams;
        $scope.setEntityStatus = function (status) {
            EntityStatusService.setEntityStatus(status);
        };
        $scope.getEntityStatus = function () {
            return EntityStatusService.getEntityStatus();
        };
        $scope.setVersion = function (app) {
            PageLifecycle.redirectTo('/orgs/{0}/apps/{1}/{2}', params.org, params.app, app.version);
        };
        $scope.registerApp = function () {
            $scope.registerButton.state = 'in-progress';
            var registerAction = {
                type: 'registerApplication',
                entityId: params.app,
                organizationId: params.org,
                entityVersion: params.version
            };
            ActionSvcs.save(registerAction, function (reply) {
                $scope.version.status = 'Registered';
                $scope.registerButton.state = 'complete';
                $scope.setEntityStatus($scope.version.status);
            }, PageLifecycle.handleError);
        };
        $scope.unregisterApp = function () {
            $scope.unregisterButton.state = 'in-progress';
            Dialogs.confirm('Confirm Unregister App', 'Do you really want to unregister the application?  This cannot be undone.', function () {
                var unregisterAction = {
                    type: 'unregisterApplication',
                    entityId: params.app,
                    organizationId: params.org,
                    entityVersion: params.version
                };
                ActionSvcs.save(unregisterAction, function (reply) {
                    $scope.version.status = 'Retired';
                    $scope.unregisterButton.state = 'complete';
                    $scope.setEntityStatus($scope.version.status);
                }, PageLifecycle.handleError);
            }, function () {
                $scope.unregisterButton.state = 'complete';
            });
        };
        $scope.updateAppDescription = function (updatedDescription) {
            var updateAppBean = {
                description: updatedDescription
            };
            OrgSvcs.update({
                organizationId: $scope.organizationId,
                entityType: 'applications',
                entityId: $scope.app.id
            }, updateAppBean, function (success) {
            }, function (error) {
                Logger.error("Unable to update app description: {0}", error);
            });
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ConsumerOrgController = Apiman._module.controller("Apiman.ConsumerOrgController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', 'CurrentUser', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, CurrentUser, $routeParams) {
        $scope.filterServices = function (value) {
            if (!value) {
                $scope.filteredServices = $scope.services;
            }
            else {
                var filtered = [];
                angular.forEach($scope.services, function (service) {
                    if (service.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(service);
                    }
                });
                $scope.filteredServices = filtered;
            }
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: $routeParams.org, entityType: '' }, resolve, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: $routeParams.org, entityType: 'members' }, resolve, reject);
            }),
            services: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: $routeParams.org, entityType: 'services' }, resolve, reject);
            })
        };
        PageLifecycle.loadPage('ConsumerOrg', pageData, $scope, function () {
            $scope.org.isMember = CurrentUser.isMember($scope.org.id);
            $scope.filteredServices = $scope.services;
            PageLifecycle.setPageTitle('consumer-org', [$scope.org.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ConsumerOrgsController = Apiman._module.controller("Apiman.ConsumerOrgsController", ['$q', '$location', '$scope', 'ApimanSvcs', 'PageLifecycle', 'Logger', 'CurrentUser', function ($q, $location, $scope, ApimanSvcs, PageLifecycle, Logger, CurrentUser) {
        var params = $location.search();
        if (params.q) {
            $scope.orgName = params.q;
        }
        $scope.searchOrg = function (value) {
            $location.search('q', value);
        };
        var pageData = {
            orgs: $q(function (resolve, reject) {
                if (params.q) {
                    var body = {};
                    body.filters = [];
                    body.filters.push({ "name": "name", "value": "%" + params.q + "%", "operator": "like" });
                    var searchStr = angular.toJson(body);
                    ApimanSvcs.save({ entityType: 'search', secondaryType: 'organizations' }, searchStr, function (result) {
                        resolve(result.beans);
                    }, reject);
                }
                else {
                    resolve([]);
                }
            })
        };
        PageLifecycle.loadPage('ConsumerOrgs', pageData, $scope, function () {
            PageLifecycle.setPageTitle('consumer-orgs');
            $scope.$applyAsync(function () {
                angular.forEach($scope.orgs, function (org) {
                    org.isMember = CurrentUser.isMember(org.id);
                });
                $('#apiman-search').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ConsumerServiceRedirectController = Apiman._module.controller("Apiman.ConsumerServiceRedirectController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $routeParams) {
        var orgId = $routeParams.org;
        var serviceId = $routeParams.service;
        var pageData = {
            versions: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: orgId, entityType: 'services', entityId: serviceId, versionsOrActivity: 'versions' }, resolve, reject);
            })
        };
        PageLifecycle.loadPage('ConsumerServiceRedirect', pageData, $scope, function () {
            var version = $scope.versions[0].version;
            PageLifecycle.forwardTo('/browse/orgs/{0}/{1}/{2}', orgId, serviceId, version);
        });
    }]);
    Apiman.ConsumerSvcController = Apiman._module.controller("Apiman.ConsumerSvcController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $routeParams) {
        $scope.params = $routeParams;
        $scope.chains = {};
        $scope.getPolicyChain = function (plan) {
            var planId = plan.planId;
            if (!$scope.chains[planId]) {
                OrgSvcs.get({ organizationId: $routeParams.org, entityType: 'services', entityId: $routeParams.service, versionsOrActivity: 'versions', version: $routeParams.version, policiesOrActivity: 'plans', policyId: plan.planId, policyChain: 'policyChain' }, function (policyReply) {
                    $scope.chains[planId] = policyReply.policies;
                }, function (error) {
                    $scope.chains[planId] = [];
                });
            }
        };
        var pageData = {
            service: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: $routeParams.org, entityType: 'services', entityId: $routeParams.service }, resolve, reject);
            }),
            version: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: $routeParams.org, entityType: 'services', entityId: $routeParams.service, versionsOrActivity: 'versions', version: $routeParams.version }, resolve, reject);
            }),
            versions: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: $routeParams.org, entityType: 'services', entityId: $routeParams.service, versionsOrActivity: 'versions' }, function (versions) {
                    angular.forEach(versions, function (version) {
                        if (version.version == $routeParams.version) {
                            $scope.selectedServiceVersion = version;
                        }
                    });
                    resolve(versions);
                }, reject);
            }),
            publicEndpoint: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: $routeParams.org, entityType: 'services', entityId: $routeParams.service, versionsOrActivity: 'versions', version: $routeParams.version, policiesOrActivity: 'endpoint' }, resolve, function (error) {
                    resolve({
                        managedEndpoint: 'Not available.'
                    });
                });
            }),
            plans: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: $routeParams.org, entityType: 'services', entityId: $routeParams.service, versionsOrActivity: 'versions', version: $routeParams.version, policiesOrActivity: 'plans' }, resolve, reject);
            })
        };
        $scope.setVersion = function (serviceVersion) {
            PageLifecycle.redirectTo('/browse/orgs/{0}/{1}/{2}', $routeParams.org, $routeParams.service, serviceVersion.version);
        };
        PageLifecycle.loadPage('ConsumerService', pageData, $scope, function () {
            PageLifecycle.setPageTitle('consumer-service', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ConsumerSvcsController = Apiman._module.controller("Apiman.ConsumerSvcsController", ['$q', '$location', '$scope', 'ApimanSvcs', 'PageLifecycle', function ($q, $location, $scope, ApimanSvcs, PageLifecycle) {
        var params = $location.search();
        if (params.q) {
            $scope.serviceName = params.q;
        }
        $scope.searchSvcs = function (value) {
            $location.search('q', value);
        };
        var pageData = {
            services: $q(function (resolve, reject) {
                if (params.q) {
                    var body = {};
                    body.filters = [];
                    body.filters.push({ "name": "name", "value": "%" + params.q + "%", "operator": "like" });
                    var searchStr = angular.toJson(body);
                    ApimanSvcs.save({ entityType: 'search', secondaryType: 'services' }, searchStr, function (reply) {
                        resolve(reply.beans);
                    }, reject);
                }
                else {
                    resolve([]);
                }
            })
        };
        PageLifecycle.loadPage('ConsumerSvcs', pageData, $scope, function () {
            $('#apiman-search').focus();
            PageLifecycle.setPageTitle('consumer-services');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.EditGatewayController = Apiman._module.controller("Apiman.EditGatewayController", ['$q', '$scope', '$location', 'ApimanSvcs', 'PageLifecycle', 'Dialogs', '$routeParams', function ($q, $scope, $location, ApimanSvcs, PageLifecycle, Dialogs, $routeParams) {
        $scope.isValid = false;
        var params = $routeParams;
        var validate = function () {
            $scope.testResult = 'none';
            // First validation
            var valid = true;
            if (!$scope.configuration.endpoint) {
                valid = false;
            }
            if (!$scope.configuration.username) {
                valid = false;
            }
            if (!$scope.configuration.password) {
                valid = false;
            }
            if ($scope.configuration.password != $scope.passwordConfirm) {
                valid = false;
            }
            $scope.isValid = valid;
            // Now dirty
            var dirty = false;
            if ($scope.gateway.description != $scope.originalGateway.description) {
                dirty = true;
            }
            if ($scope.configuration.endpoint != $scope.originalConfig.endpoint) {
                dirty = true;
            }
            if ($scope.configuration.username != $scope.originalConfig.username) {
                dirty = true;
            }
            if ($scope.configuration.password != $scope.originalConfig.password) {
                dirty = true;
            }
            $scope.isDirty = dirty;
        };
        var Gateway = function () {
            return {
                description: $scope.gateway.description,
                type: $scope.gateway.type,
                configuration: angular.toJson($scope.configuration)
            };
        };
        var pageData = {
            gateway: $q(function (resolve, reject) {
                ApimanSvcs.get({ entityType: 'gateways', secondaryType: params.gateway }, function (gateway) {
                    $scope.gateway = gateway;
                    $scope.configuration = JSON.parse(gateway.configuration);
                    $scope.passwordConfirm = $scope.configuration.password;
                    $scope.originalGateway = angular.copy(gateway);
                    $scope.originalConfig = angular.copy($scope.configuration);
                    $scope.isDirty = false;
                    resolve(gateway);
                }, reject);
            })
        };
        var testGateway = function () {
            $scope.testButton.state = 'in-progress';
            var gateway = Gateway();
            ApimanSvcs.update({ entityType: 'gateways' }, gateway, function (reply) {
                $scope.testButton.state = 'complete';
                if (reply.success == true) {
                    Logger.info('Connected successfully to Gateway: {0}', reply.detail);
                    $scope.testResult = 'success';
                }
                else {
                    Logger.info('Failed to connect to Gateway: {0}', reply.detail);
                    $scope.testResult = 'error';
                    $scope.testErrorMessage = reply.detail;
                }
            }, function (error) {
                $scope.testButton.state = 'error';
                $scope.testResult = 'error';
                $scope.testErrorMessage = error;
            });
        };
        $scope.updateGateway = function () {
            $scope.updateButton.state = 'in-progress';
            var gateway = Gateway();
            ApimanSvcs.update({ entityType: 'gateways', secondaryType: $scope.gateway.id }, gateway, function () {
                PageLifecycle.redirectTo('/admin/gateways');
            }, PageLifecycle.handleError);
        };
        $scope.deleteGateway = function () {
            $scope.deleteButton.state = 'in-progress';
            Dialogs.confirm('Confirm Delete Gateway', 'Do you really want to permanently delete this gateway?  This can be very destructive to any Service published to it.', function () {
                ApimanSvcs.delete({ entityType: 'gateways', secondaryType: $scope.gateway.id }, function (reply) {
                    PageLifecycle.redirectTo('/admin/gateways');
                }, PageLifecycle.handleError);
            }, function () {
                $scope.deleteButton.state = 'complete';
            });
        };
        $scope.testGateway = testGateway;
        PageLifecycle.loadPage('EditGateway', pageData, $scope, function () {
            PageLifecycle.setPageTitle('edit-gateway');
            $scope.$watch('gateway', validate, true);
            $scope.$watch('configuration', validate, true);
            $scope.$watch('passwordConfirm', validate);
            $('#apiman-gateway-description').focus();
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.EditPluginController = Apiman._module.controller("Apiman.EditPluginController", ['$q', '$scope', '$location', 'ApimanSvcs', 'PageLifecycle', 'Dialogs', '$routeParams', function ($q, $scope, $location, ApimanSvcs, PageLifecycle, Dialogs, $routeParams) {
        var params = $routeParams;
        var pageData = {
            plugin: $q(function (resolve, reject) {
                ApimanSvcs.get({ entityType: 'plugins', secondaryType: params.plugin }, function (plugin) {
                    resolve(plugin);
                }, reject);
            })
        };
        $scope.deletePlugin = function () {
            $scope.deleteButton.state = 'in-progress';
            Dialogs.confirm('Confirm Delete Plugin', 'Do you really want to delete this plugin?', function () {
                ApimanSvcs.delete({ entityType: 'plugins', secondaryType: $scope.plugin.id }, function (reply) {
                    PageLifecycle.redirectTo('/admin/plugins');
                }, PageLifecycle.handleError);
            }, function () {
                $scope.deleteButton.state = 'complete';
            });
        };
        PageLifecycle.loadPage('EditPlugin', pageData, $scope, function () {
            PageLifecycle.setPageTitle('plugin-details');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.EditPolicyController = Apiman._module.controller("Apiman.EditPolicyController", ['$q', '$location', '$scope', 'OrgSvcs', 'ApimanSvcs', 'PageLifecycle', 'Logger', '$routeParams', function ($q, $location, $scope, OrgSvcs, ApimanSvcs, PageLifecycle, Logger, $routeParams) {
        var params = $routeParams;
        var pageData = {
            policy: $q(function (resolve, reject) {
                var etype = params.type;
                if (etype == 'apps') {
                    etype = 'applications';
                }
                OrgSvcs.get({
                    organizationId: params.org,
                    entityType: etype,
                    entityId: params.id,
                    versionsOrActivity: 'versions',
                    version: params.ver,
                    policiesOrActivity: 'policies',
                    policyId: params.policy
                }, function (policy) {
                    var config = new Object();
                    try {
                        config = JSON.parse(policy.configuration);
                    }
                    catch (e) {
                    }
                    $scope.config = config;
                    if (policy.definition.formType == 'JsonSchema') {
                        $scope.include = 'plugins/api-manager/html/policyForms/JsonSchema.include';
                    }
                    else {
                        var inc = Apiman.ConfigForms[policy.definition.id];
                        if (!inc) {
                            inc = 'Default.include';
                        }
                        $scope.include = 'plugins/api-manager/html/policyForms/' + inc;
                    }
                    $scope.selectedDef = policy.definition;
                    resolve(policy);
                }, reject);
            })
        };
        $scope.setValid = function (valid) {
            $scope.isValid = valid;
        };
        $scope.setConfig = function (config) {
            $scope.config = config;
        };
        $scope.updatePolicy = function () {
            $scope.updateButton.state = 'in-progress';
            var updatedPolicy = {
                configuration: angular.toJson($scope.config)
            };
            var etype = params.type;
            if (etype == 'apps') {
                etype = 'applications';
            }
            OrgSvcs.update({
                organizationId: params.org,
                entityType: etype,
                entityId: params.id,
                versionsOrActivity: 'versions',
                version: params.ver,
                policiesOrActivity: 'policies',
                policyId: params.policy
            }, updatedPolicy, function () {
                PageLifecycle.redirectTo('/orgs/{0}/{1}/{2}/{3}/policies', params.org, params.type, params.id, params.ver);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('EditPolicy', pageData, $scope, function () {
            PageLifecycle.setPageTitle('edit-policy');
            $('#apiman-description').focus();
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.EditPolicyDefController = Apiman._module.controller("Apiman.EditPolicyDefController", ['$q', '$scope', '$location', 'ApimanSvcs', 'PageLifecycle', '$routeParams', function ($q, $scope, $location, ApimanSvcs, PageLifecycle, $routeParams) {
        var params = $routeParams;
        var pageData = {
            policyDef: $q(function (resolve, reject) {
                ApimanSvcs.get({ entityType: 'policyDefs', secondaryType: params.policyDef }, function (policyDef) {
                    resolve(policyDef);
                    $scope.policyDefJSON = angular.toJson(policyDef, true);
                }, reject);
            })
        };
        $scope.updatePolicyDef = function () {
            var policyDefUpdate = {};
            var policyDef = JSON.parse($scope.policyDefJSON);
            policyDefUpdate.name = policyDef.name;
            policyDefUpdate.description = policyDef.description;
            policyDefUpdate.icon = policyDef.icon;
            ApimanSvcs.update({ entityType: 'policyDefs', secondaryType: $scope.policyDef.id }, policyDefUpdate, function (reply) {
                PageLifecycle.redirectTo('/admin/policyDefs');
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('EditPolicyDef', pageData, $scope, function () {
            PageLifecycle.setPageTitle('edit-policyDef');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.EditRoleController = Apiman._module.controller("Apiman.EditRoleController", ['$q', '$scope', '$location', 'ApimanSvcs', 'PageLifecycle', 'Logger', 'Dialogs', '$routeParams', function ($q, $scope, $location, ApimanSvcs, PageLifecycle, Logger, Dialogs, $routeParams) {
        var params = $routeParams;
        var allPermissions = ['orgView', 'orgEdit', 'orgAdmin', 'planView', 'planEdit', 'planAdmin', 'svcView', 'svcEdit', 'svcAdmin', 'appView', 'appEdit', 'appAdmin'];
        $scope.isValid = true;
        $scope.rolePermissions = {};
        angular.forEach(allPermissions, function (value) {
            $scope.rolePermissions[value] = false;
        });
        var validate = function () {
            var atLeastOne = false;
            angular.forEach($scope.rolePermissions, function (value, key) {
                if (value == true) {
                    atLeastOne = true;
                }
            });
            return atLeastOne;
        };
        $scope.$watch('rolePermissions', function (newValue) {
            $scope.isValid = validate();
        }, true);
        var pageData = {
            role: $q(function (resolve, reject) {
                ApimanSvcs.get({ entityType: 'roles', secondaryType: params.role }, function (role) {
                    angular.forEach(role.permissions, function (name) {
                        $scope.rolePermissions[name] = true;
                    });
                    resolve(role);
                }, reject);
            })
        };
        $scope.updateRole = function () {
            $scope.updateButton.state = 'in-progress';
            var permissions = [];
            angular.forEach($scope.rolePermissions, function (value, key) {
                if (value == true) {
                    permissions.push(key);
                }
            });
            var role = {};
            role.name = $scope.role.name;
            role.description = $scope.role.description;
            role.permissions = permissions;
            role.autoGrant = $scope.role.autoGrant;
            ApimanSvcs.update({ entityType: 'roles', secondaryType: $scope.role.id }, role, function (reply) {
                PageLifecycle.redirectTo('/admin/roles');
            }, PageLifecycle.handleError);
        };
        $scope.deleteRole = function () {
            $scope.deleteButton.state = 'in-progress';
            Dialogs.confirm('Confirm Delete Role', 'Do you really want to delete this role?', function () {
                ApimanSvcs.delete({ entityType: 'roles', secondaryType: $scope.role.id }, function (reply) {
                    PageLifecycle.redirectTo('/admin/roles');
                }, PageLifecycle.handleError);
            }, function () {
                $scope.deleteButton.state = 'complete';
            });
        };
        PageLifecycle.loadPage('EditRole', pageData, $scope, function () {
            PageLifecycle.setPageTitle('edit-role');
            $('#apiman-description').focus();
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ImportPolicyDefsController = Apiman._module.controller("Apiman.ImportPolicyDefsController", ['$q', '$scope', '$location', 'ApimanSvcs', 'PageLifecycle', function ($q, $scope, $location, ApimanSvcs, PageLifecycle) {
        $scope.isData = true;
        $scope.isConfirm = false;
        $scope.isValid = false;
        $scope.parseJSON = function () {
            var policiesImport = JSON.parse($scope.policyDefsJSON);
            var policyDefs = [];
            if (policiesImport.constructor === Array) {
                policyDefs = policiesImport;
            }
            else {
                policyDefs.push(policiesImport);
            }
            $scope.policyDefs = policyDefs;
            $scope.isData = false;
            $scope.isConfirm = true;
        };
        $scope.$watch('policyDefsJSON', function (newValue) {
            try {
                JSON.parse($scope.policyDefsJSON);
                $scope.isValid = true;
            }
            catch (e) {
                $scope.isValid = false;
            }
        });
        $scope.importPolicyDefs = function () {
            $scope.yesButton.state = 'in-progress';
            var promises = [];
            angular.forEach($scope.policyDefs, function (def) {
                promises.push($q(function (resolve, reject) {
                    ApimanSvcs.save({ entityType: 'policyDefs' }, def, resolve, reject);
                }));
            });
            $q.all(promises).then(function () {
                PageLifecycle.redirectTo('/admin/policyDefs');
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('ImportPolicyDefs', undefined, $scope, function () {
            PageLifecycle.setPageTitle('import-policyDefs');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewAppController = Apiman._module.controller("Apiman.NewAppController", ['$q', '$location', '$scope', 'CurrentUserSvcs', 'OrgSvcs', 'PageLifecycle', '$rootScope', function ($q, $location, $scope, CurrentUserSvcs, OrgSvcs, PageLifecycle, $rootScope) {
        var recentOrg = $rootScope.mruOrg;
        var pageData = {
            organizations: $q(function (resolve, reject) {
                CurrentUserSvcs.query({ what: 'apporgs' }, function (orgs) {
                    if (recentOrg) {
                        $scope.selectedOrg = recentOrg;
                    }
                    else if (orgs.length > 0) {
                        $scope.selectedOrg = orgs[0];
                    }
                    resolve(orgs);
                }, reject);
            }),
        };
        $scope.setOrg = function (org) {
            $scope.selectedOrg = org;
        };
        $scope.saveNewApp = function () {
            $scope.createButton.state = 'in-progress';
            OrgSvcs.save({ organizationId: $scope.selectedOrg.id, entityType: 'applications' }, $scope.app, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/apps/{1}/{2}', reply.organization.id, reply.id, $scope.app.initialVersion);
            }, PageLifecycle.handleError);
        };
        $scope.app = {
            initialVersion: '1.0'
        };
        PageLifecycle.loadPage('NewApp', pageData, $scope, function () {
            PageLifecycle.setPageTitle('new-app');
            $scope.$applyAsync(function () {
                $('#apiman-entityname').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewAppVersionController = Apiman._module.controller("Apiman.NewAppVersionController", ['$q', '$location', '$scope', 'OrgSvcs', 'PageLifecycle', '$routeParams', function ($q, $location, $scope, OrgSvcs, PageLifecycle, $routeParams) {
        var params = $routeParams;
        $scope.appversion = {
            clone: true,
            cloneVersion: params.version
        };
        $scope.saveNewAppVersion = function () {
            $scope.createButton.state = 'in-progress';
            OrgSvcs.save({ organizationId: params.org, entityType: 'applications', entityId: params.app, versionsOrActivity: 'versions', version: '' }, $scope.appversion, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/apps/{1}/{2}', params.org, params.app, reply.version);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewAppVersion', undefined, $scope, function () {
            PageLifecycle.setPageTitle('new-app-version');
            $scope.$applyAsync(function () {
                $('#apiman-version').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewContractController = Apiman._module.controller("Apiman.NewContractController", ['$q', '$location', '$scope', 'OrgSvcs', 'CurrentUserSvcs', 'PageLifecycle', 'Logger', '$rootScope', 'Dialogs', function ($q, $location, $scope, OrgSvcs, CurrentUserSvcs, PageLifecycle, Logger, $rootScope, Dialogs) {
        var params = $location.search();
        var svcId = params.svc;
        var svcOrgId = params.svcorg;
        var svcVer = params.svcv;
        var planId = params.planid;
        $scope.refreshAppVersions = function (organizationId, appId, onSuccess, onError) {
            OrgSvcs.query({ organizationId: organizationId, entityType: 'applications', entityId: appId, versionsOrActivity: 'versions' }, function (versions) {
                var plainVersions = [];
                angular.forEach(versions, function (version) {
                    if (version.status == 'Created' || version.status == 'Ready') {
                        plainVersions.push(version.version);
                    }
                });
                $scope.appVersions = plainVersions;
                if (onSuccess) {
                    onSuccess(plainVersions);
                }
            }, PageLifecycle.handleError);
        };
        var pageData = {
            apps: $q(function (resolve, reject) {
                CurrentUserSvcs.query({ what: 'applications' }, function (apps) {
                    if ($rootScope.mruApp) {
                        for (var i = 0; i < apps.length; i++) {
                            var app = apps[i];
                            if (app.organizationId == $rootScope.mruApp.application.organization.id && app.id == $rootScope.mruApp.application.id) {
                                $scope.selectedApp = app;
                            }
                        }
                    }
                    else {
                        $scope.selectedApp = undefined;
                    }
                    resolve(apps);
                }, reject);
            }),
            selectedService: $q(function (resolve, reject) {
                if (svcId && svcOrgId && svcVer) {
                    Logger.debug('Loading service {0}/{1} version {2}.', svcOrgId, svcId, svcVer);
                    OrgSvcs.get({ organizationId: svcOrgId, entityType: 'services', entityId: svcId, versionsOrActivity: 'versions', version: svcVer }, function (serviceVersion) {
                        serviceVersion.organizationName = serviceVersion.service.organization.name;
                        serviceVersion.organizationId = serviceVersion.service.organization.id;
                        serviceVersion.name = serviceVersion.service.name;
                        serviceVersion.id = serviceVersion.service.id;
                        resolve(serviceVersion);
                    }, reject);
                }
                else {
                    resolve(undefined);
                }
            })
        };
        $scope.$watch('selectedApp', function (newValue) {
            Logger.debug("App selected: {0}", newValue);
            $scope.selectedAppVersion = undefined;
            $scope.appVersions = [];
            if (newValue) {
                $scope.refreshAppVersions(newValue.organizationId, newValue.id, function (versions) {
                    Logger.debug("Versions: {0}", versions);
                    if ($rootScope.mruApp) {
                        if ($rootScope.mruApp.application.organization.id == newValue.organizationId && $rootScope.mruApp.application.id == newValue.id) {
                            $scope.selectedAppVersion = $rootScope.mruApp.version;
                        }
                    }
                    else {
                        if (versions.length > 0) {
                            $scope.selectedAppVersion = versions[0];
                        }
                    }
                });
            }
        });
        $scope.selectService = function () {
            Dialogs.selectService('Select a Service', function (serviceVersion) {
                $scope.selectedService = serviceVersion;
            }, true);
        };
        $scope.$watch('selectedService', function (newValue) {
            if (!newValue) {
                $scope.plans = undefined;
                $scope.selectedPlan = undefined;
                return;
            }
            Logger.debug('Service selection made, fetching plans.');
            OrgSvcs.query({ organizationId: newValue.organizationId, entityType: 'services', entityId: newValue.id, versionsOrActivity: 'versions', version: newValue.version, policiesOrActivity: 'plans' }, function (plans) {
                $scope.plans = plans;
                Logger.debug("Found {0} plans: {1}.", plans.length, plans);
                if (plans.length > 0) {
                    if (planId) {
                        for (var i = 0; i < plans.length; i++) {
                            if (plans[i].planId == planId) {
                                $scope.selectedPlan = plans[i];
                            }
                        }
                    }
                    else {
                        $scope.selectedPlan = undefined;
                    }
                }
                else {
                    $scope.plans = undefined;
                }
            }, PageLifecycle.handleError);
        });
        $scope.createContract = function () {
            Logger.log("Creating new contract from {0}/{1} ({2}) to {3}/{4} ({5}) through the {6} plan!", $scope.selectedApp.organizationName, $scope.selectedApp.name, $scope.selectedAppVersion, $scope.selectedService.organizationName, $scope.selectedService.name, $scope.selectedService.version, $scope.selectedPlan.planName);
            $scope.createButton.state = 'in-progress';
            var newContract = {
                serviceOrgId: $scope.selectedService.organizationId,
                serviceId: $scope.selectedService.id,
                serviceVersion: $scope.selectedService.version,
                planId: $scope.selectedPlan.planId
            };
            OrgSvcs.save({ organizationId: $scope.selectedApp.organizationId, entityType: 'applications', entityId: $scope.selectedApp.id, versionsOrActivity: 'versions', version: $scope.selectedAppVersion, policiesOrActivity: 'contracts' }, newContract, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/apps/{1}/{2}/contracts', $scope.selectedApp.organizationId, $scope.selectedApp.id, $scope.selectedAppVersion);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewContract', pageData, $scope, function () {
            PageLifecycle.setPageTitle('new-contract');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewGatewayController = Apiman._module.controller("Apiman.NewGatewayController", ['$q', '$location', '$scope', 'ApimanSvcs', 'PageLifecycle', 'CurrentUser', 'Logger', function ($q, $location, $scope, ApimanSvcs, PageLifecycle, CurrentUser, Logger) {
        $scope.isValid = false;
        $scope.gateway = {};
        $scope.configuration = {
            endpoint: 'http://localhost:8080/apiman-gateway-api/'
        };
        var validate = function () {
            $scope.testResult = 'none';
            var valid = true;
            if (!$scope.gateway.name) {
                valid = false;
            }
            if (!$scope.configuration.endpoint) {
                valid = false;
            }
            if (!$scope.configuration.username) {
                valid = false;
            }
            if (!$scope.configuration.password) {
                valid = false;
            }
            if ($scope.configuration.password != $scope.passwordConfirm) {
                valid = false;
            }
            $scope.isValid = valid;
        };
        $scope.$watch('gateway', validate, true);
        $scope.$watch('configuration', validate, true);
        $scope.$watch('passwordConfirm', validate);
        var Gateway = function () {
            var gateway = $scope.gateway;
            gateway.configuration = angular.toJson($scope.configuration);
            gateway.type = 'REST';
            return gateway;
        };
        var testGateway = function () {
            $scope.testButton.state = 'in-progress';
            var gateway = Gateway();
            ApimanSvcs.update({ entityType: 'gateways' }, gateway, function (reply) {
                $scope.testButton.state = 'complete';
                if (reply.success == true) {
                    Logger.info('Connected successfully to Gateway: {0}', reply.detail);
                    $scope.testResult = 'success';
                }
                else {
                    Logger.info('Failed to connect to Gateway: {0}', reply.detail);
                    $scope.testResult = 'error';
                    $scope.testErrorMessage = reply.detail;
                }
            }, function (error) {
                $scope.testButton.state = 'error';
                $scope.testResult = 'error';
                $scope.testErrorMessage = error;
            });
        };
        $scope.createGateway = function () {
            $scope.createButton.state = 'in-progress';
            var gateway = Gateway();
            ApimanSvcs.save({ entityType: 'gateways' }, gateway, function (reply) {
                PageLifecycle.redirectTo('/admin/gateways');
            }, PageLifecycle.handleError);
        };
        $scope.testGateway = testGateway;
        PageLifecycle.loadPage('NewGateway', undefined, $scope, function () {
            PageLifecycle.setPageTitle('new-gateway');
            $('#apiman-gateway-name').focus();
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewOrgController = Apiman._module.controller("Apiman.NewOrgController", ['$q', '$location', '$scope', 'OrgSvcs', 'PageLifecycle', 'CurrentUser', function ($q, $location, $scope, OrgSvcs, PageLifecycle, CurrentUser) {
        $scope.saveNewOrg = function () {
            $scope.createButton.state = 'in-progress';
            OrgSvcs.save($scope.org, function (reply) {
                CurrentUser.clear();
                PageLifecycle.redirectTo('/orgs/{0}/plans', reply.id);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewOrg', undefined, $scope, function () {
            PageLifecycle.setPageTitle('new-org');
            $scope.$applyAsync(function () {
                $('#apiman-entityname').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewPlanController = Apiman._module.controller("Apiman.NewPlanController", ['$q', '$location', '$scope', 'CurrentUserSvcs', 'OrgSvcs', 'PageLifecycle', '$rootScope', function ($q, $location, $scope, CurrentUserSvcs, OrgSvcs, PageLifecycle, $rootScope) {
        var recentOrg = $rootScope.mruOrg;
        var pageData = {
            organizations: $q(function (resolve, reject) {
                CurrentUserSvcs.query({ what: 'planorgs' }, function (orgs) {
                    if (recentOrg) {
                        $scope.selectedOrg = recentOrg;
                    }
                    else if (orgs.length > 0) {
                        $scope.selectedOrg = orgs[0];
                    }
                    resolve(orgs);
                }, reject);
            })
        };
        $scope.setOrg = function (org) {
            $scope.selectedOrg = org;
        };
        $scope.saveNewPlan = function () {
            $scope.createButton.state = 'in-progress';
            OrgSvcs.save({ organizationId: $scope.selectedOrg.id, entityType: 'plans' }, $scope.plan, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/plans/{1}/{2}', reply.organization.id, reply.id, $scope.plan.initialVersion);
            }, PageLifecycle.handleError);
        };
        // Initialize the model - the default initial version for a new plan is always 1.0
        $scope.plan = {
            initialVersion: '1.0'
        };
        PageLifecycle.loadPage('NewPlan', pageData, $scope, function () {
            PageLifecycle.setPageTitle('new-plan');
            $scope.$applyAsync(function () {
                $('#apiman-entityname').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewPlanVersionController = Apiman._module.controller("Apiman.NewPlanVersionController", ['$q', '$location', '$scope', 'OrgSvcs', 'PageLifecycle', '$routeParams', function ($q, $location, $scope, OrgSvcs, PageLifecycle, $routeParams) {
        var params = $routeParams;
        $scope.planversion = {
            clone: true,
            cloneVersion: params.version
        };
        $scope.saveNewPlanVersion = function () {
            $scope.createButton.state = 'in-progress';
            OrgSvcs.save({ organizationId: params.org, entityType: 'plans', entityId: params.plan, versionsOrActivity: 'versions', version: '' }, $scope.planversion, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/plans/{1}/{2}', params.org, params.plan, reply.version);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewPlanVersion', undefined, $scope, function () {
            PageLifecycle.setPageTitle('new-plan-version');
            $scope.$applyAsync(function () {
                $('#apiman-version').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewPluginController = Apiman._module.controller("Apiman.NewPluginController", ['$q', '$scope', '$location', 'ApimanSvcs', 'PageLifecycle', 'Dialogs', function ($q, $scope, $location, ApimanSvcs, PageLifecycle, Dialogs) {
        $scope.plugin = {};
        var validate = function () {
            var valid = true;
            if (!$scope.plugin.groupId) {
                valid = false;
            }
            if (!$scope.plugin.artifactId) {
                valid = false;
            }
            if (!$scope.plugin.version) {
                valid = false;
            }
            $scope.isValid = valid;
        };
        $scope.$watch('plugin', function (newValue) {
            validate();
        }, true);
        $scope.addPlugin = function () {
            $scope.addButton.state = 'in-progress';
            ApimanSvcs.save({ entityType: 'plugins' }, $scope.plugin, function (reply) {
                PageLifecycle.redirectTo('/admin/plugins');
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewPlugin', undefined, $scope, function () {
            PageLifecycle.setPageTitle('new-plugin');
            $('#apiman-group-id').focus();
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ConfigForms = {
        BASICAuthenticationPolicy: 'basic-auth.include',
        IgnoredResourcesPolicy: 'ignored-resources.include',
        IPBlacklistPolicy: 'ip-list.include',
        IPWhitelistPolicy: 'ip-list.include',
        RateLimitingPolicy: 'rate-limiting.include'
    };
    Apiman.NewPolicyController = Apiman._module.controller("Apiman.NewPolicyController", ['$q', '$location', '$scope', 'OrgSvcs', 'ApimanSvcs', 'PageLifecycle', 'Logger', '$routeParams', function ($q, $location, $scope, OrgSvcs, ApimanSvcs, PageLifecycle, Logger, $routeParams) {
        var params = $routeParams;
        var pageData = {
            policyDefs: $q(function (resolve, reject) {
                ApimanSvcs.query({ entityType: 'policyDefs' }, function (policyDefs) {
                    $scope.selectedDefId = '__null__';
                    resolve(policyDefs);
                }, reject);
            })
        };
        $scope.$watch('selectedDefId', function (newValue) {
            if (newValue) {
                var newDef = undefined;
                angular.forEach($scope.policyDefs, function (def) {
                    if (def.id == newValue) {
                        newDef = def;
                    }
                });
                $scope.selectedDef = newDef;
            }
        });
        $scope.$watch('selectedDef', function (newValue) {
            if (!newValue) {
                $scope.include = undefined;
            }
            else {
                $scope.config = new Object();
                if ($scope.selectedDef.formType == 'JsonSchema') {
                    $scope.include = 'plugins/api-manager/html/policyForms/JsonSchema.include';
                }
                else {
                    var inc = Apiman.ConfigForms[$scope.selectedDef.id];
                    if (!inc) {
                        inc = 'Default.include';
                    }
                    $scope.include = 'plugins/api-manager/html/policyForms/' + inc;
                }
            }
        });
        $scope.setValid = function (valid) {
            $scope.isValid = valid;
        };
        $scope.setConfig = function (config) {
            $scope.config = config;
        };
        $scope.addPolicy = function () {
            $scope.createButton.state = 'in-progress';
            var newPolicy = {
                definitionId: $scope.selectedDefId,
                configuration: angular.toJson($scope.config)
            };
            var etype = params.type;
            if (etype == 'apps') {
                etype = 'applications';
            }
            OrgSvcs.save({ organizationId: params.org, entityType: etype, entityId: params.id, versionsOrActivity: 'versions', version: params.ver, policiesOrActivity: 'policies' }, newPolicy, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/{1}/{2}/{3}/policies', params.org, params.type, params.id, params.ver);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewPolicy', pageData, $scope, function () {
            PageLifecycle.setPageTitle('new-policy');
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewRoleController = Apiman._module.controller("Apiman.NewRoleController", ['$q', '$location', '$scope', 'OrgSvcs', 'PageLifecycle', 'CurrentUser', 'Logger', 'ApimanSvcs', function ($q, $location, $scope, OrgSvcs, PageLifecycle, CurrentUser, Logger, ApimanSvcs) {
        $scope.role = {};
        $scope.rolePermissions = {};
        $scope.isValid = false;
        var validate = function () {
            var valid = true;
            if (!$scope.role.name) {
                valid = false;
            }
            var atLeastOne = false;
            angular.forEach($scope.rolePermissions, function (value, key) {
                if (value == true) {
                    atLeastOne = true;
                }
            });
            if (!atLeastOne) {
                valid = false;
            }
            $scope.isValid = valid;
        };
        $scope.$watch('role', function (newValue) {
            validate();
        }, true);
        $scope.$watch('rolePermissions', function (newValue) {
            validate();
        }, true);
        $scope.addRole = function () {
            $scope.createButton.state = 'in-progress';
            var permissions = [];
            angular.forEach($scope.rolePermissions, function (value, key) {
                if (value == true) {
                    permissions.push(key);
                }
            });
            var role = {};
            role.name = $scope.role.name;
            role.description = $scope.role.description;
            role.permissions = permissions;
            role.autoGrant = $scope.role.autoGrant;
            ApimanSvcs.save({ entityType: 'roles' }, role, function (reply) {
                PageLifecycle.redirectTo('/admin/roles');
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewRole', undefined, $scope, function () {
            PageLifecycle.setPageTitle('new-role');
            $('#apiman-entityname').focus();
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewServiceController = Apiman._module.controller("Apiman.NewServiceController", ['$q', '$location', '$scope', 'CurrentUserSvcs', 'OrgSvcs', 'PageLifecycle', '$rootScope', function ($q, $location, $scope, CurrentUserSvcs, OrgSvcs, PageLifecycle, $rootScope) {
        var recentOrg = $rootScope.mruOrg;
        var pageData = {
            organizations: $q(function (resolve, reject) {
                CurrentUserSvcs.query({ what: 'svcorgs' }, function (orgs) {
                    if (recentOrg) {
                        $scope.selectedOrg = recentOrg;
                    }
                    else if (orgs.length > 0) {
                        $scope.selectedOrg = orgs[0];
                    }
                    resolve(orgs);
                }, reject);
            }),
        };
        $scope.setOrg = function (org) {
            $scope.selectedOrg = org;
        };
        $scope.saveNewService = function () {
            $scope.createButton.state = 'in-progress';
            OrgSvcs.save({ organizationId: $scope.selectedOrg.id, entityType: 'services' }, $scope.service, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/services/{1}/{2}', reply.organization.id, reply.id, $scope.service.initialVersion);
            }, PageLifecycle.handleError);
        };
        $scope.service = {
            initialVersion: '1.0'
        };
        PageLifecycle.loadPage('NewService', pageData, $scope, function () {
            PageLifecycle.setPageTitle('new-service');
            $scope.$applyAsync(function () {
                $('#apiman-entityname').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.NewServiceVersionController = Apiman._module.controller("Apiman.NewServiceVersionController", ['$q', '$location', '$scope', 'OrgSvcs', 'PageLifecycle', 'Logger', '$routeParams', function ($q, $location, $scope, OrgSvcs, PageLifecycle, Logger, $routeParams) {
        var params = $routeParams;
        $scope.svcversion = {
            clone: true,
            cloneVersion: params.version
        };
        $scope.saveNewServiceVersion = function () {
            $scope.createButton.state = 'in-progress';
            Logger.info('Creating new version {0} of service {1} / {2}', $scope.svcversion.version, params.service, params.org);
            OrgSvcs.save({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: '' }, $scope.svcversion, function (reply) {
                PageLifecycle.redirectTo('/orgs/{0}/services/{1}/{2}', params.org, params.service, reply.version);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('NewServiceVersion', undefined, $scope, function () {
            PageLifecycle.setPageTitle('new-service-version');
            $scope.$applyAsync(function () {
                $('#apiman-version').focus();
            });
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.PlanActivityController = Apiman._module.controller("Apiman.PlanActivityController", ['$q', '$scope', '$location', 'OrgSvcs', 'AuditSvcs', 'Logger', 'PageLifecycle', 'PlanEntityLoader', '$routeParams', function ($q, $scope, $location, OrgSvcs, AuditSvcs, Logger, PageLifecycle, PlanEntityLoader, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'activity';
        $scope.version = params.version;
        var getNextPage = function (successHandler, errorHandler) {
            $scope.currentPage = $scope.currentPage + 1;
            AuditSvcs.get({ organizationId: params.org, entityType: 'plans', entityId: params.plan, page: $scope.currentPage, count: 20 }, function (results) {
                var entries = results.beans;
                successHandler(entries);
            }, errorHandler);
        };
        var pageData = PlanEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            auditEntries: $q(function (resolve, reject) {
                $scope.currentPage = 0;
                getNextPage(resolve, reject);
            })
        });
        $scope.getNextPage = getNextPage;
        PageLifecycle.loadPage('PlanActivity', pageData, $scope, function () {
            PageLifecycle.setPageTitle('plan-activity', [$scope.plan.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.PlanOverviewController = Apiman._module.controller("Apiman.PlanOverviewController", ['$q', '$scope', '$location', 'PageLifecycle', 'PlanEntityLoader', '$routeParams', function ($q, $scope, $location, PageLifecycle, PlanEntityLoader, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'overview';
        var pageData = PlanEntityLoader.getCommonData($scope, $location);
        PageLifecycle.loadPage('PlanOverview', pageData, $scope, function () {
            PageLifecycle.setPageTitle('plan-overview', [$scope.plan.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.PlanPoliciesController = Apiman._module.controller("Apiman.PlanPoliciesController", ['$q', '$scope', '$location', 'OrgSvcs', 'ApimanSvcs', 'Logger', 'PageLifecycle', 'PlanEntityLoader', 'Dialogs', '$routeParams', function ($q, $scope, $location, OrgSvcs, ApimanSvcs, Logger, PageLifecycle, PlanEntityLoader, Dialogs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'policies';
        $scope.version = params.version;
        var removePolicy = function (policy) {
            angular.forEach($scope.policies, function (p, index) {
                if (policy === p) {
                    $scope.policies.splice(index, 1);
                }
            });
        };
        $scope.removePolicy = function (policy) {
            Dialogs.confirm('Confirm Remove Policy', 'Do you really want to remove this policy from the plan?', function () {
                OrgSvcs.delete({ organizationId: params.org, entityType: 'plans', entityId: params.plan, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'policies', policyId: policy.id }, function (reply) {
                    removePolicy(policy);
                }, PageLifecycle.handleError);
            });
        };
        var pageData = PlanEntityLoader.getCommonData($scope, $location);
        angular.extend(pageData, {
            policies: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'plans', entityId: params.plan, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'policies' }, function (policies) {
                    resolve(policies);
                }, reject);
            })
        });
        PageLifecycle.loadPage('PlanPolicies', pageData, $scope, function () {
            PageLifecycle.setPageTitle('plan-policies', [$scope.plan.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.PlanRedirectController = Apiman._module.controller("Apiman.PlanRedirectController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', 'CurrentUser', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, CurrentUser, $routeParams) {
        var orgId = $routeParams.org;
        var planId = $routeParams.plan;
        var pageData = {
            versions: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: orgId, entityType: 'plans', entityId: planId, versionsOrActivity: 'versions' }, resolve, reject);
            })
        };
        PageLifecycle.loadPage('PlanRedirect', pageData, $scope, function () {
            var version = $scope.versions[0].version;
            if (!version) {
                PageLifecycle.handleError({ status: 404 });
            }
            else {
                PageLifecycle.forwardTo('/orgs/{0}/plans/{1}/{2}', orgId, planId, version);
            }
        });
    }]);
    Apiman.PlanEntityLoader = Apiman._module.factory('PlanEntityLoader', ['$q', 'OrgSvcs', 'Logger', '$rootScope', '$routeParams', 'EntityStatusService', function ($q, OrgSvcs, Logger, $rootScope, $routeParams, EntityStatusService) {
        return {
            getCommonData: function ($scope, $location) {
                var params = $routeParams;
                return {
                    version: $q(function (resolve, reject) {
                        OrgSvcs.get({ organizationId: params.org, entityType: 'plans', entityId: params.plan, versionsOrActivity: 'versions', version: params.version }, function (version) {
                            $scope.org = version.plan.organization;
                            $scope.plan = version.plan;
                            EntityStatusService.setEntityStatus(version.status);
                            resolve(version);
                        }, reject);
                    }),
                    versions: $q(function (resolve, reject) {
                        OrgSvcs.query({ organizationId: params.org, entityType: 'plans', entityId: params.plan, versionsOrActivity: 'versions' }, resolve, reject);
                    })
                };
            }
        };
    }]);
    Apiman.PlanEntityController = Apiman._module.controller("Apiman.PlanEntityController", ['$q', '$scope', '$location', 'ActionSvcs', 'Logger', 'PageLifecycle', '$routeParams', 'OrgSvcs', 'EntityStatusService', function ($q, $scope, $location, ActionSvcs, Logger, PageLifecycle, $routeParams, OrgSvcs, EntityStatusService) {
        var params = $routeParams;
        $scope.setEntityStatus = function (status) {
            EntityStatusService.setEntityStatus(status);
        };
        $scope.getEntityStatus = function () {
            return EntityStatusService.getEntityStatus();
        };
        $scope.setVersion = function (plan) {
            PageLifecycle.redirectTo('/orgs/{0}/plans/{1}/{2}', params.org, params.plan, plan.version);
        };
        $scope.lockPlan = function () {
            $scope.lockButton.state = 'in-progress';
            var lockAction = {
                type: 'lockPlan',
                entityId: params.plan,
                organizationId: params.org,
                entityVersion: params.version
            };
            ActionSvcs.save(lockAction, function (reply) {
                $scope.version.status = 'Locked';
                $scope.lockButton.state = 'complete';
                $scope.setEntityStatus($scope.version.status);
            }, PageLifecycle.handleError);
        };
        $scope.updatePlanDescription = function (updatedDescription) {
            var updatePlanBean = {
                description: updatedDescription
            };
            OrgSvcs.update({
                organizationId: $scope.organizationId,
                entityType: 'plans',
                entityId: $scope.plan.id
            }, updatePlanBean, function (success) {
            }, function (error) {
                Logger.error("Unable to update plan description:  {0}", error);
            });
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServiceActivityController = Apiman._module.controller("Apiman.ServiceActivityController", ['$q', '$scope', '$location', 'PageLifecycle', 'ServiceEntityLoader', 'AuditSvcs', '$routeParams', function ($q, $scope, $location, PageLifecycle, ServiceEntityLoader, AuditSvcs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'activity';
        $scope.version = params.version;
        var getNextPage = function (successHandler, errorHandler) {
            $scope.currentPage = $scope.currentPage + 1;
            AuditSvcs.get({ organizationId: params.org, entityType: 'services', entityId: params.service, page: $scope.currentPage, count: 20 }, function (results) {
                var entries = results.beans;
                successHandler(entries);
            }, errorHandler);
        };
        var pageData = ServiceEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            auditEntries: $q(function (resolve, reject) {
                $scope.currentPage = 0;
                getNextPage(resolve, reject);
            })
        });
        $scope.getNextPage = getNextPage;
        PageLifecycle.loadPage('ServiceActivity', pageData, $scope, function () {
            PageLifecycle.setPageTitle('service-activity', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServiceContractsController = Apiman._module.controller("Apiman.ServiceContractsController", ['$q', '$scope', '$location', 'PageLifecycle', 'ServiceEntityLoader', 'OrgSvcs', 'Logger', '$routeParams', function ($q, $scope, $location, PageLifecycle, ServiceEntityLoader, OrgSvcs, Logger, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'contracts';
        $scope.version = params.version;
        var getNextPage = function (successHandler, errorHandler) {
            var maxCount = 10;
            $scope.currentPage = $scope.currentPage + 1;
            OrgSvcs.query({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'contracts', page: $scope.currentPage, count: maxCount }, function (contracts) {
                if (contracts.length == maxCount) {
                    $scope.hasMore = true;
                }
                else {
                    $scope.hasMore = false;
                }
                successHandler(contracts);
            }, errorHandler);
        };
        var pageData = ServiceEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            contracts: $q(function (resolve, reject) {
                $scope.currentPage = 0;
                getNextPage(resolve, reject);
            })
        });
        $scope.getNextPage = getNextPage;
        PageLifecycle.loadPage('ServiceContracts', pageData, $scope, function () {
            Logger.debug("::: is public: {0}", $scope.version.publicService);
            if ($scope.version.publicService) {
                Logger.debug("::: num plans: {0}", $scope.version.plans.length);
                if ($scope.version.plans.length == 0) {
                    $scope.isPublicOnly = true;
                }
            }
            PageLifecycle.setPageTitle('service-contracts', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServiceEndpointController = Apiman._module.controller("Apiman.ServiceEndpointController", ['$q', '$scope', '$location', 'PageLifecycle', 'ServiceEntityLoader', 'OrgSvcs', 'ApimanSvcs', '$routeParams', function ($q, $scope, $location, PageLifecycle, ServiceEntityLoader, OrgSvcs, ApimanSvcs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'endpoint';
        $scope.version = params.version;
        var pageData = ServiceEntityLoader.getCommonData($scope, $location);
        if (params.version != null) {
            pageData = angular.extend(pageData, {
                managedEndpoint: $q(function (resolve, reject) {
                    OrgSvcs.get({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'endpoint' }, resolve, reject);
                })
            });
        }
        PageLifecycle.loadPage('ServiceEndpoint', pageData, $scope, function () {
            PageLifecycle.setPageTitle('service-endpoint', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServiceImplController = Apiman._module.controller("Apiman.ServiceImplController", ['$q', '$scope', '$location', 'PageLifecycle', 'ServiceEntityLoader', 'OrgSvcs', 'ApimanSvcs', '$routeParams', 'EntityStatusService', function ($q, $scope, $location, PageLifecycle, ServiceEntityLoader, OrgSvcs, ApimanSvcs, $routeParams, EntityStatusService) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'impl';
        $scope.version = params.version;
        $scope.typeOptions = ["rest", "soap"];
        $scope.updatedService = new Object();
        var pageData = ServiceEntityLoader.getCommonData($scope, $location);
        if (params.version != null) {
            pageData = angular.extend(pageData, {
                gateways: $q(function (resolve, reject) {
                    ApimanSvcs.query({ entityType: 'gateways' }, resolve, reject);
                })
            });
        }
        $scope.$watch('updatedService', function (newValue) {
            if ($scope.version) {
                var dirty = false;
                if (newValue.endpoint != $scope.version.endpoint || newValue.endpointType != $scope.version.endpointType) {
                    dirty = true;
                }
                else if (newValue.gateways && newValue.gateways.length > 0) {
                    Logger.debug('Dirty because of gateways!');
                    dirty = true;
                }
                $scope.isDirty = dirty;
            }
        }, true);
        $scope.$watch('selectedGateway', function (newValue) {
            Logger.info('New gateway selected: {0}', newValue);
            var alreadySet = false;
            if ($scope.version.gateways[0].gatewayId == newValue.id) {
                alreadySet = true;
            }
            if (!alreadySet) {
                $scope.updatedService.gateways = [{ gatewayId: newValue.id }];
            }
            else {
                delete $scope.updatedService.gateways;
            }
        });
        $scope.reset = function () {
            $scope.updatedService.endpoint = $scope.version.endpoint;
            $scope.updatedService.endpointType = $scope.version.endpointType;
            delete $scope.updatedService.gateways;
            angular.forEach($scope.gateways, function (gateway) {
                // TODO support multiple gateway assignments here
                if (gateway.id == $scope.version.gateways[0].gatewayId) {
                    $scope.selectedGateway = gateway;
                }
            });
            $scope.isDirty = false;
        };
        $scope.saveService = function () {
            $scope.saveButton.state = 'in-progress';
            OrgSvcs.update({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: params.version }, $scope.updatedService, function (reply) {
                $scope.isDirty = false;
                $scope.saveButton.state = 'complete';
                $scope.version = reply;
                EntityStatusService.setEntityStatus(reply.status);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('ServiceImpl', pageData, $scope, function () {
            $scope.reset();
            PageLifecycle.setPageTitle('service-impl', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServiceOverviewController = Apiman._module.controller("Apiman.ServiceOverviewController", ['$q', '$scope', '$location', 'PageLifecycle', 'ServiceEntityLoader', '$routeParams', function ($q, $scope, $location, PageLifecycle, ServiceEntityLoader, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'overview';
        $scope.version = params.version;
        var pageData = ServiceEntityLoader.getCommonData($scope, $location);
        PageLifecycle.loadPage('ServiceOverview', pageData, $scope, function () {
            PageLifecycle.setPageTitle('service-overview', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServicePlansController = Apiman._module.controller("Apiman.ServicePlansController", ['$q', '$scope', '$location', 'PageLifecycle', 'ServiceEntityLoader', 'OrgSvcs', 'ApimanSvcs', '$routeParams', 'EntityStatusService', function ($q, $scope, $location, PageLifecycle, ServiceEntityLoader, OrgSvcs, ApimanSvcs, $routeParams, EntityStatusService) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'plans';
        $scope.version = params.version;
        $scope.updatedService = new Object();
        var lockedPlans = [];
        var getSelectedPlans = function () {
            var selectedPlans = [];
            for (var i = 0; i < lockedPlans.length; i++) {
                var plan = lockedPlans[i];
                if (plan.checked) {
                    var selectedPlan = {};
                    selectedPlan.planId = plan.id;
                    selectedPlan.version = plan.selectedVersion;
                    selectedPlans.push(selectedPlan);
                }
            }
            return selectedPlans;
        };
        var pageData = ServiceEntityLoader.getCommonData($scope, $location);
        if (params.version != null) {
            pageData = angular.extend(pageData, {
                plans: $q(function (resolve, reject) {
                    OrgSvcs.query({ organizationId: params.org, entityType: 'plans' }, function (plans) {
                        //for each plan find the versions that are locked
                        var promises = [];
                        angular.forEach(plans, function (plan) {
                            promises.push($q(function (resolve, reject) {
                                OrgSvcs.query({ organizationId: params.org, entityType: 'plans', entityId: plan.id, versionsOrActivity: 'versions' }, function (planVersions) {
                                    //for each plan find the versions that are locked
                                    var lockedVersions = [];
                                    for (var j = 0; j < planVersions.length; j++) {
                                        var planVersion = planVersions[j];
                                        if (planVersion.status == "Locked") {
                                            lockedVersions.push(planVersion.version);
                                        }
                                    }
                                    // if we found locked plan versions then add them
                                    if (lockedVersions.length > 0) {
                                        plan.lockedVersions = lockedVersions;
                                        lockedPlans.push(plan);
                                    }
                                    resolve(planVersions);
                                }, reject);
                            }));
                        });
                        $q.all(promises).then(function () {
                            lockedPlans.sort(function (a, b) {
                                if (a.id.toLowerCase() < b.id.toLowerCase()) {
                                    return -1;
                                }
                                else if (b.id < a.id) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            });
                            resolve(lockedPlans);
                        });
                    }, reject);
                })
            });
        }
        $scope.$watch('updatedService', function (newValue) {
            var dirty = false;
            if (newValue.publicService != $scope.version.publicService) {
                dirty = true;
            }
            if (newValue.plans.length != $scope.version.plans.length) {
                dirty = true;
            }
            else {
                for (var i = 0; i < newValue.plans.length; i++) {
                    var p1 = newValue.plans[i];
                    var p2 = $scope.version.plans[i];
                    if (p1.planId != p2.planId || p1.version != p2.version) {
                        dirty = true;
                    }
                }
            }
            $scope.isDirty = dirty;
        }, true);
        $scope.$watch('plans', function (newValue) {
            $scope.updatedService.plans = getSelectedPlans();
        }, true);
        $scope.reset = function () {
            $scope.updatedService.publicService = $scope.version.publicService;
            for (var i = 0; i < lockedPlans.length; i++) {
                lockedPlans[i].selectedVersion = lockedPlans[i].lockedVersions[0];
                for (var j = 0; j < $scope.version.plans.length; j++) {
                    if (lockedPlans[i].id == $scope.version.plans[j].planId) {
                        lockedPlans[i].checked = true;
                        lockedPlans[i].selectedVersion = $scope.version.plans[j].version;
                        break;
                    }
                }
            }
            $scope.updatedService.plans = getSelectedPlans();
            $scope.isDirty = false;
        };
        $scope.saveService = function () {
            $scope.saveButton.state = 'in-progress';
            OrgSvcs.update({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: params.version }, $scope.updatedService, function (reply) {
                $scope.version.publicService = $scope.updatedService.publicService;
                $scope.isDirty = false;
                $scope.saveButton.state = 'complete';
                $scope.version = reply;
                EntityStatusService.setEntityStatus(reply.status);
            }, PageLifecycle.handleError);
        };
        PageLifecycle.loadPage('ServicePlans', pageData, $scope, function () {
            $scope.reset();
            PageLifecycle.setPageTitle('service-plans', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServicePoliciesController = Apiman._module.controller("Apiman.ServicePoliciesController", ['$q', '$scope', '$location', 'PageLifecycle', 'ServiceEntityLoader', 'OrgSvcs', 'Dialogs', '$routeParams', function ($q, $scope, $location, PageLifecycle, ServiceEntityLoader, OrgSvcs, Dialogs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.tab = 'policies';
        $scope.version = params.version;
        var removePolicy = function (policy) {
            angular.forEach($scope.policies, function (p, index) {
                if (policy === p) {
                    $scope.policies.splice(index, 1);
                }
            });
        };
        $scope.removePolicy = function (policy) {
            Dialogs.confirm('Confirm Remove Policy', 'Do you really want to remove this policy from the service?', function () {
                OrgSvcs.delete({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'policies', policyId: policy.id }, function (reply) {
                    removePolicy(policy);
                }, PageLifecycle.handleError);
            });
        };
        var pageData = ServiceEntityLoader.getCommonData($scope, $location);
        pageData = angular.extend(pageData, {
            policies: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: params.version, policiesOrActivity: 'policies' }, resolve, reject);
            })
        });
        PageLifecycle.loadPage('ServicePolicies', pageData, $scope, function () {
            PageLifecycle.setPageTitle('service-policies', [$scope.service.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.ServiceRedirectController = Apiman._module.controller("Apiman.ServiceRedirectController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', 'CurrentUser', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, CurrentUser, $routeParams) {
        var orgId = $routeParams.org;
        var serviceId = $routeParams.service;
        var pageData = {
            versions: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: orgId, entityType: 'services', entityId: serviceId, versionsOrActivity: 'versions' }, resolve, reject);
            })
        };
        PageLifecycle.loadPage('ServiceRedirect', pageData, $scope, function () {
            var version = $scope.versions[0].version;
            if (!version) {
                PageLifecycle.handleError({ status: 404 });
            }
            else {
                PageLifecycle.forwardTo('/orgs/{0}/services/{1}/{2}', orgId, serviceId, version);
            }
        });
    }]);
    Apiman.ServiceEntityLoader = Apiman._module.factory('ServiceEntityLoader', ['$q', 'OrgSvcs', 'Logger', '$rootScope', '$routeParams', 'EntityStatusService', function ($q, OrgSvcs, Logger, $rootScope, $routeParams, EntityStatusService) {
        return {
            getCommonData: function ($scope, $location) {
                var params = $routeParams;
                return {
                    version: $q(function (resolve, reject) {
                        OrgSvcs.get({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions', version: params.version }, function (version) {
                            $scope.org = version.service.organization;
                            $scope.service = version.service;
                            $rootScope.mruService = version;
                            EntityStatusService.setEntityStatus(version.status);
                            resolve(version);
                        }, reject);
                    }),
                    versions: $q(function (resolve, reject) {
                        OrgSvcs.query({ organizationId: params.org, entityType: 'services', entityId: params.service, versionsOrActivity: 'versions' }, resolve, reject);
                    })
                };
            }
        };
    }]);
    Apiman.ServiceEntityController = Apiman._module.controller("Apiman.ServiceEntityController", ['$q', '$scope', '$location', 'ActionSvcs', 'Logger', 'Dialogs', 'PageLifecycle', '$routeParams', 'OrgSvcs', 'EntityStatusService', function ($q, $scope, $location, ActionSvcs, Logger, Dialogs, PageLifecycle, $routeParams, OrgSvcs, EntityStatusService) {
        var params = $routeParams;
        $scope.params = params;
        $scope.setEntityStatus = function (status) {
            EntityStatusService.setEntityStatus(status);
        };
        $scope.getEntityStatus = function () {
            return EntityStatusService.getEntityStatus();
        };
        $scope.setVersion = function (service) {
            PageLifecycle.redirectTo('/orgs/{0}/services/{1}/{2}', params.org, params.service, service.version);
        };
        $scope.publishService = function () {
            $scope.publishButton.state = 'in-progress';
            var publishAction = {
                type: 'publishService',
                entityId: params.service,
                organizationId: params.org,
                entityVersion: params.version
            };
            ActionSvcs.save(publishAction, function (reply) {
                $scope.version.status = 'Published';
                $scope.publishButton.state = 'complete';
                $scope.setEntityStatus($scope.version.status);
            }, PageLifecycle.handleError);
        };
        $scope.retireService = function () {
            $scope.retireButton.state = 'in-progress';
            Dialogs.confirm('Confirm Retire Service', 'Do you really want to retire this service?  This action cannot be undone.', function () {
                var retireAction = {
                    type: 'retireService',
                    entityId: params.service,
                    organizationId: params.org,
                    entityVersion: params.version
                };
                ActionSvcs.save(retireAction, function (reply) {
                    $scope.version.status = 'Retired';
                    $scope.retireButton.state = 'complete';
                    $scope.setEntityStatus($scope.version.status);
                }, PageLifecycle.handleError);
            }, function () {
                $scope.retireButton.state = 'complete';
            });
        };
        $scope.updateServiceDescription = function (updatedDescription) {
            var updateServiceBean = {
                description: updatedDescription
            };
            OrgSvcs.update({
                organizationId: $scope.organizationId,
                entityType: 'services',
                entityId: $scope.service.id,
            }, updateServiceBean, function (success) {
                Logger.info("Updated sucessfully");
            }, function (error) {
                Logger.error("Unable to update service description:  {0}", error);
            });
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.UserActivityController = Apiman._module.controller("Apiman.UserActivityController", ['$q', '$scope', '$location', 'UserSvcs', 'UserAuditSvcs', 'PageLifecycle', '$routeParams', function ($q, $scope, $location, UserSvcs, UserAuditSvcs, PageLifecycle, $routeParams) {
        $scope.tab = 'activity';
        var getNextPage = function (successHandler, errorHandler) {
            $scope.currentPage = $scope.currentPage + 1;
            UserAuditSvcs.get({ user: $routeParams.user, page: $scope.currentPage, count: 20 }, function (results) {
                var entries = results.beans;
                successHandler(entries);
            }, errorHandler);
        };
        var pageData = {
            user: $q(function (resolve, reject) {
                UserSvcs.get({ user: $routeParams.user }, function (user) {
                    if (!user.fullName) {
                        user.fullName = user.username;
                    }
                    resolve(user);
                }, reject);
            }),
            auditEntries: $q(function (resolve, reject) {
                $scope.currentPage = 0;
                getNextPage(resolve, reject);
            })
        };
        $scope.getNextPage = getNextPage;
        PageLifecycle.loadPage('UserActivity', pageData, $scope, function () {
            PageLifecycle.setPageTitle('user-activity', [$scope.user.fullName]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.UserAppsController = Apiman._module.controller("Apiman.UserAppsController", ['$q', '$scope', '$location', 'UserSvcs', 'PageLifecycle', 'Logger', '$routeParams', function ($q, $scope, $location, UserSvcs, PageLifecycle, Logger, $routeParams) {
        $scope.tab = 'applications';
        $scope.filterApps = function (value) {
            if (!value) {
                $scope.filteredApps = $scope.applications;
            }
            else {
                var filtered = [];
                angular.forEach($scope.applications, function (app) {
                    if (app.name.toLowerCase().indexOf(value.toLowerCase()) > -1 || app.organizationName.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(app);
                    }
                });
                $scope.filteredApps = filtered;
            }
        };
        var pageData = {
            user: $q(function (resolve, reject) {
                UserSvcs.get({ user: $routeParams.user }, function (user) {
                    if (!user.fullName) {
                        user.fullName = user.username;
                    }
                    resolve(user);
                }, reject);
            }),
            applications: $q(function (resolve, reject) {
                UserSvcs.query({ user: $routeParams.user, entityType: 'applications' }, function (userApps) {
                    $scope.filteredApps = userApps;
                    resolve(userApps);
                }, reject);
            })
        };
        PageLifecycle.loadPage('UserApps', pageData, $scope, function () {
            PageLifecycle.setPageTitle('user-apps', [$scope.user.fullName]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.UserOrgsController = Apiman._module.controller("Apiman.UserOrgsController", ['$q', '$scope', '$location', 'UserSvcs', 'PageLifecycle', '$routeParams', function ($q, $scope, $location, UserSvcs, PageLifecycle, $routeParams) {
        $scope.tab = 'organizations';
        $scope.filterOrgs = function (value) {
            if (!value) {
                $scope.filteredOrgs = $scope.organizations;
            }
            else {
                var filtered = [];
                angular.forEach($scope.organizations, function (org) {
                    if (org.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(org);
                    }
                });
                $scope.filteredOrgs = filtered;
            }
        };
        var pageData = {
            user: $q(function (resolve, reject) {
                UserSvcs.get({ user: $routeParams.user }, function (user) {
                    if (!user.fullName) {
                        user.fullName = user.username;
                    }
                    resolve(user);
                }, reject);
            }),
            organizations: $q(function (resolve, reject) {
                UserSvcs.query({ user: $routeParams.user, entityType: 'organizations' }, function (userOrgs) {
                    $scope.filteredOrgs = userOrgs;
                    resolve(userOrgs);
                }, reject);
            })
        };
        PageLifecycle.loadPage('UserOrgs', pageData, $scope, function () {
            PageLifecycle.setPageTitle('user-orgs', [$scope.user.fullName]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.UserServicesController = Apiman._module.controller("Apiman.UserServicesController", ['$q', '$scope', '$location', 'UserSvcs', 'PageLifecycle', '$routeParams', function ($q, $scope, $location, UserSvcs, PageLifecycle, $routeParams) {
        $scope.tab = 'services';
        $scope.filterServices = function (value) {
            if (!value) {
                $scope.filteredServices = $scope.services;
            }
            else {
                var filtered = [];
                angular.forEach($scope.services, function (svc) {
                    if (svc.name.toLowerCase().indexOf(value.toLowerCase()) > -1 || svc.organizationName.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(svc);
                    }
                });
                $scope.filteredServices = filtered;
            }
        };
        var pageData = {
            user: $q(function (resolve, reject) {
                UserSvcs.get({ user: $routeParams.user }, function (user) {
                    if (!user.fullName) {
                        user.fullName = user.username;
                    }
                    resolve(user);
                }, reject);
            }),
            services: $q(function (resolve, reject) {
                UserSvcs.query({ user: $routeParams.user, entityType: 'services' }, function (userServices) {
                    $scope.filteredServices = userServices;
                    resolve(userServices);
                }, reject);
            })
        };
        PageLifecycle.loadPage('UserServices', pageData, $scope, function () {
            PageLifecycle.setPageTitle('user-services', [$scope.user.fullName]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.UserRedirectController = Apiman._module.controller("Apiman.UserRedirectController", ['$q', '$scope', '$location', 'PageLifecycle', '$routeParams', function ($q, $scope, $location, PageLifecycle, $routeParams) {
        PageLifecycle.loadPage('UserRedirect', undefined, $scope, function () {
            PageLifecycle.forwardTo('/users/{0}/orgs', $routeParams.user);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgActivityController = Apiman._module.controller("Apiman.OrgActivityController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', 'AuditSvcs', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, AuditSvcs, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        var getNextPage = function (successHandler, errorHandler) {
            $scope.currentPage = $scope.currentPage + 1;
            AuditSvcs.get({ organizationId: params.org, page: $scope.currentPage, count: 20 }, function (results) {
                var entries = results.beans;
                successHandler(entries);
            }, errorHandler);
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: '' }, function (org) {
                    $rootScope.mruOrg = org;
                    resolve(org);
                }, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function (members) {
                    resolve(members);
                }, reject);
            }),
            auditEntries: $q(function (resolve, reject) {
                $scope.currentPage = 0;
                getNextPage(resolve, reject);
            })
        };
        $scope.getNextPage = getNextPage;
        PageLifecycle.loadPage('OrgActivity', pageData, $scope, function () {
            PageLifecycle.setPageTitle('org-activity', [$scope.org.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgAppsController = Apiman._module.controller("Apiman.OrgAppsController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.filterApps = function (value) {
            if (!value) {
                $scope.filteredApps = $scope.apps;
            }
            else {
                var filtered = [];
                angular.forEach($scope.apps, function (app) {
                    if (app.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(app);
                    }
                });
                $scope.filteredApps = filtered;
            }
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: '' }, function (org) {
                    $rootScope.mruOrg = org;
                    resolve(org);
                }, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function (members) {
                    resolve(members);
                }, reject);
            }),
            apps: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'applications' }, function (apps) {
                    $scope.filteredApps = apps;
                    resolve(apps);
                }, reject);
            })
        };
        PageLifecycle.loadPage('OrgApps', pageData, $scope, function () {
            PageLifecycle.setPageTitle('org-apps', [$scope.org.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.getRoleIds = function (member) {
        return member.roles.map(function (role) {
            return role.roleId;
        });
    };
    Apiman.OrgManageMembersController = Apiman._module.controller("Apiman.OrgManageMembersController", ['$q', '$scope', '$location', 'ApimanSvcs', 'OrgSvcs', 'PageLifecycle', '$rootScope', 'Logger', '$routeParams', function ($q, $scope, $location, ApimanSvcs, OrgSvcs, PageLifecycle, $rootScope, $log, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.filteredMembers = [];
        $scope.filterValue = "";
        $scope.selectedRoles = "";
        var containsAnyRoles = function (containsArray) {
            if ($scope.selectedRoles.length === 0) {
                return true;
            }
            var returnVal = false;
            jQuery.each($scope.selectedRoles, function (index, value) {
                if (jQuery.inArray(value, containsArray) > -1) {
                    return returnVal = true;
                }
            });
            return returnVal;
        };
        $scope.filterMembers = function (value) {
            $scope.filterValue = value;
            if (!value) {
                if ($scope.selectedRoles.length === 0) {
                    $scope.filteredMembers = $scope.members;
                }
                else {
                    $scope.filteredMembers = jQuery.grep($scope.members, function (member, _) {
                        return containsAnyRoles(Apiman.getRoleIds(member));
                    });
                }
            }
            else {
                $scope.filteredMembers = jQuery.grep($scope.members, function (m, _) {
                    return (m.userName.toLowerCase().indexOf(value.toLowerCase()) > -1 || m.userId.toLowerCase().indexOf(value.toLowerCase()) > -1 && containsAnyRoles(Apiman.getRoleIds(m)));
                });
            }
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: '' }, function (org) {
                    $rootScope.mruOrg = org;
                    resolve(org);
                }, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function (members) {
                    $scope.filteredMembers = members;
                    resolve(members);
                }, reject);
            }),
            roles: $q(function (resolve, reject) {
                ApimanSvcs.query({ entityType: 'roles' }, function (adminRoles) {
                    $scope.filteredRoles = adminRoles;
                    resolve(adminRoles);
                }, reject);
            })
        };
        PageLifecycle.loadPage('OrgManageMembers', pageData, $scope, function () {
            PageLifecycle.setPageTitle('org-manage-members', [$scope.org.name]);
        });
    }]);
    Apiman.OrgManageMembersController.directive('apimanUserCard', ['OrgSvcs', 'Dialogs', 'Logger', 'PageLifecycle', function (OrgSvcs, Dialogs, $log, PageLifecycle) {
        return {
            restrict: 'E',
            scope: {
                member: '=',
                roles: '=',
                orgId: '@'
            },
            template: '<div ng-include="currentTemplate()" ng-show="isCardVisible"></div>',
            link: function ($scope, element, attrs) {
                // updatedRoles comes from card-back.
                $scope.updatedRoles = Apiman.getRoleIds($scope.member);
                $scope.front = 'apiman-user-card-front';
                $scope.back = 'apiman-user-card-back';
                $scope.cardFace = $scope.front;
                $scope.isCardVisible = true;
                $scope.flipCard = function (face) {
                    $scope.cardFace = face;
                };
                $scope.currentTemplate = function () {
                    return 'plugins/api-manager/html/org/' + $scope.cardFace + '.html';
                };
                $scope.joinRoles = function (roles) {
                    return roles.map(function (role) {
                        return role.roleName;
                    }).join(', ');
                };
                // Update is revoke + grant
                $scope.updateRoles = function (selectedRoles) {
                    if (!selectedRoles)
                        return $scope.flipCard($scope.front);
                    var grantRolesBean = {
                        userId: $scope.member.userId,
                        roleIds: selectedRoles
                    };
                    _revokeAll($scope.orgId, $scope.member.userId);
                    OrgSvcs.save({ organizationId: $scope.orgId, entityType: 'roles' }, grantRolesBean, function () {
                        $log.info('Successfully Saved: ' + angular.toJson(grantRolesBean));
                        $scope.flipCard($scope.front);
                    }, PageLifecycle.handleError);
                    _reassignRoles(selectedRoles);
                };
                // Revoke all permissions with warning
                $scope.revokeAll = function () {
                    Dialogs.confirm('Confirm Revoke All', 'This will remove ' + $scope.member.userName + ' from all roles in the Organization. Really do this?', function () {
                        _revokeAll($scope.orgId, $scope.member.userId);
                        $scope.isCardVisible = false;
                    });
                };
                // Actual revoke function.
                var _revokeAll = function (orgId, userId) {
                    OrgSvcs.delete({ organizationId: orgId, entityType: 'members', entityId: userId }, function () {
                        $log.debug('Successfully revoked all roles for ' + userId);
                    }, PageLifecycle.handleError);
                };
                // Now we've modified the roles, we can update to reflect.
                var _reassignRoles = function (newRoles) {
                    var matchingRoles = jQuery.grep($scope.roles, function (role, _) {
                        return jQuery.inArray(role.id, newRoles) >= 0;
                    });
                    var assignedRoles = matchingRoles.map(function (elem) {
                        return {
                            roleId: elem.id,
                            roleName: elem.name
                        };
                    });
                    $scope.member.roles = assignedRoles;
                    $scope.updatedRoles = Apiman.getRoleIds($scope.member);
                };
            }
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgMembersController = Apiman._module.controller("Apiman.OrgMembersController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.filterMembers = function (value) {
            if (!value) {
                $scope.filteredMembers = $scope.members;
            }
            else {
                var filtered = [];
                angular.forEach($scope.members, function (member) {
                    if (member.userName.toLowerCase().indexOf(value.toLowerCase()) > -1 || member.userId.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(member);
                    }
                });
                $scope.filteredMembers = filtered;
            }
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: '' }, function (org) {
                    $rootScope.mruOrg = org;
                    resolve(org);
                }, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function (members) {
                    $scope.filteredMembers = members;
                    resolve(members);
                }, reject);
            })
        };
        PageLifecycle.loadPage('OrgMembers', pageData, $scope, function () {
            PageLifecycle.setPageTitle('org-members', [$scope.org.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgNewMemberController = Apiman._module.controller("Apiman.OrgNewMemberController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', 'ApimanSvcs', 'Logger', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, ApimanSvcs, $log, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.selectedUsers = {};
        $scope.selectedRoles = [];
        $scope.queriedUsers = [];
        $scope.searchBoxValue = '';
        $scope.addMembers = function () {
            if ($scope.selectedRoles) {
                $scope.addMembersButton.state = 'in-progress';
                // Iterate over object like map (k:v)
                jQuery.each($scope.selectedUsers, function (k, user) {
                    $log.debug('Adding user: {0}', user);
                    var grantRolesBean = {
                        userId: user.username,
                        roleIds: $scope.selectedRoles
                    };
                    OrgSvcs.save({ organizationId: $scope.organizationId, entityType: 'roles' }, grantRolesBean, function () {
                        $log.debug('Successfully Saved: {0}', grantRolesBean);
                        $scope.addMembersButton.state = 'complete';
                        PageLifecycle.redirectTo('/orgs/{0}/manage-members', params.org);
                    }, PageLifecycle.handleError);
                });
            }
        };
        $scope.findUsers = function (searchBoxValue) {
            $scope.searchButton.state = 'in-progress';
            $scope.searchBoxValue = searchBoxValue;
            if (!searchBoxValue || searchBoxValue.length == 0) {
                $scope.queriedUsers = [];
                $scope.searchButton.state = 'complete';
                return;
            }
            var queryBean = {
                filters: [{
                    name: 'username',
                    value: '*' + searchBoxValue + '*',
                    operator: 'like'
                }],
                orderBy: {
                    name: 'fullName',
                    ascending: true
                },
                paging: {
                    page: 1,
                    pageSize: 50
                }
            };
            $log.debug('Query: {0}', queryBean);
            ApimanSvcs.save({ entityType: 'users', secondaryType: 'search' }, queryBean, function (reply) {
                $scope.searchButton.state = 'complete';
                $log.debug('Reply: {0}', reply);
                $scope.queriedUsers = reply.beans;
            }, function () {
                $scope.searchButton.state = 'error';
            });
        };
        $scope.countObjectKeys = function (object) {
            return Object.keys(object).length;
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: '' }, function (org) {
                    $rootScope.mruOrg = org;
                    resolve(org);
                }, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function (members) {
                    $scope.filteredMembers = members;
                    resolve(members);
                }, reject);
            }),
            roles: $q(function (resolve, reject) {
                ApimanSvcs.query({ entityType: 'roles' }, function (adminRoles) {
                    $scope.filteredRoles = adminRoles;
                    resolve(adminRoles);
                }, reject);
            })
        };
        PageLifecycle.loadPage('OrgNewMember', pageData, $scope, function () {
            PageLifecycle.setPageTitle('new-member');
        });
    }]);
    Apiman.OrgNewMemberController.directive('apimanUserEntry', ['Logger', function ($log) {
        return {
            scope: {
                user: '=',
                selectedUsers: '='
            },
            replace: true,
            templateUrl: 'plugins/api-manager/html/org/apiman-user-entry.html',
            link: function ($scope) {
                $scope.isSelectedUser = false;
                $scope.selectThisUser = function () {
                    $scope.isSelectedUser = !$scope.isSelectedUser;
                    // If selected user then add to map; if deselected remove it.
                    if ($scope.isSelectedUser) {
                        $scope.selectedUsers[$scope.user.username] = $scope.user;
                    }
                    else {
                        delete $scope.selectedUsers[$scope.user.username];
                    }
                    $log.debug("Selected {0}", $scope.user.username);
                    $log.debug("Global $scope.selectedUsers {0}", $scope.selectedUsers);
                };
            }
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgPlansController = Apiman._module.controller("Apiman.OrgPlansController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.filterPlans = function (value) {
            if (!value) {
                $scope.filteredPlans = $scope.plans;
            }
            else {
                var filtered = [];
                angular.forEach($scope.plans, function (plan) {
                    if (plan.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(plan);
                    }
                });
                $scope.filteredPlans = filtered;
            }
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: '' }, function (org) {
                    $rootScope.mruOrg = org;
                    resolve(org);
                }, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function (members) {
                    resolve(members);
                }, reject);
            }),
            plans: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'plans' }, function (plans) {
                    $scope.filteredPlans = plans;
                    resolve(plans);
                }, reject);
            })
        };
        PageLifecycle.loadPage('OrgPlans', pageData, $scope, function () {
            PageLifecycle.setPageTitle('org-plans', [$scope.org.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgServicesController = Apiman._module.controller("Apiman.OrgServicesController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, $routeParams) {
        var params = $routeParams;
        $scope.organizationId = params.org;
        $scope.filterServices = function (value) {
            if (!value) {
                $scope.filteredServices = $scope.services;
            }
            else {
                var filtered = [];
                angular.forEach($scope.services, function (service) {
                    if (service.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        filtered.push(service);
                    }
                });
                $scope.filteredServices = filtered;
            }
        };
        var pageData = {
            org: $q(function (resolve, reject) {
                OrgSvcs.get({ organizationId: params.org, entityType: '' }, function (org) {
                    $rootScope.mruOrg = org;
                    resolve(org);
                }, reject);
            }),
            members: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function (members) {
                    resolve(members);
                }, reject);
            }),
            services: $q(function (resolve, reject) {
                OrgSvcs.query({ organizationId: params.org, entityType: 'services' }, function (services) {
                    $scope.filteredServices = services;
                    resolve(services);
                }, reject);
            })
        };
        PageLifecycle.loadPage('OrgSvcs', pageData, $scope, function () {
            PageLifecycle.setPageTitle('org-services', [$scope.org.name]);
        });
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgSidebarController = Apiman._module.controller("Apiman.OrgSidebarController", ['Logger', '$scope', 'OrgSvcs', function (Logger, $scope, OrgSvcs) {
        $scope.updateOrgDescription = function (updatedDescription) {
            var updateOrganizationBean = {
                description: updatedDescription
            };
            OrgSvcs.update({ organizationId: $scope.organizationId }, updateOrganizationBean, function (success) {
            }, function (error) {
                Logger.error("Unable to update org description: {0}", error);
            });
        };
    }]);
})(Apiman || (Apiman = {}));

/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
var Apiman;
(function (Apiman) {
    Apiman.OrgRedirectController = Apiman._module.controller("Apiman.OrgRedirectController", ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', 'CurrentUser', '$routeParams', function ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, CurrentUser, $routeParams) {
        PageLifecycle.loadPage('OrgRedirect', undefined, $scope, function () {
            var orgId = $routeParams.org;
            var tab = 'members';
            if (CurrentUser.hasPermission(orgId, 'planEdit')) {
                tab = 'plans';
            }
            else if (CurrentUser.hasPermission(orgId, 'svcEdit')) {
                tab = 'services';
            }
            else if (CurrentUser.hasPermission(orgId, 'appEdit')) {
                tab = 'apps';
            }
            PageLifecycle.forwardTo('/orgs/{0}/{1}', orgId, tab);
        });
    }]);
})(Apiman || (Apiman = {}));

angular.module("apiman-manager-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/api-manager/html/dash.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.DashController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h1 apiman-i18n-key=\"page-heading\">API Management</h1>\r\n          <hr />\r\n        </div>\r\n        <div class=\"col-md-12 no-phone\">\r\n          <span class=\"description\" apiman-i18n-key=\"dash.page-description\">\r\n            Welcome to apiman, open source API management.  Use this software to provide\r\n            various APIs (Services) to your users (Applications) through a secure, scalable,\r\n            and governed Gateway layer.  API Management allows Service Developers to centralize\r\n            control and analysis of their Services.  It also provides a central locaton for\r\n            Application Developers to find and consume available APIs.\r\n          </span>\r\n          <hr />\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n        \r\n          <div class=\"dash-group\">\r\n            <div class=\"title\">\r\n              <i class=\"fa fa-shield\"></i>\r\n              <span apiman-i18n-key=\"organizations\">Organizations</span>\r\n            </div>\r\n            <div class=\"description\" apiman-i18n-key=\"dash.orgs-description\">\r\n              All services and applications must be managed within the context of an \r\n              Organization.  You can be a member of multiple Organizations at the same\r\n              time, with different roles in each:  you can be an Application\r\n              Developer in one organization and a Service Developer in another.\r\n            </div>\r\n            <div class=\"actions\">\r\n              <ul>\r\n                <li><a href=\"{{ pluginName }}/new-org\" apiman-i18n-key=\"actions.create-new-org\" data-field=\"createOrg\">Create a New Organization</a></li>\r\n                <li><a href=\"{{ pluginName }}/browse/orgs\" apiman-i18n-key=\"actions.browse-orgs\" data-field=\"browseOrgs\">Browse/Find an Organization</a></li>\r\n                <li><a href=\"{{ pluginName }}/users/{{ currentUser.username }}/orgs\" apiman-i18n-key=\"actions.my-orgs\" data-field=\"myOrgs\">Go to My Organizations</a></li>\r\n              </ul>\r\n            </div>\r\n          </div>\r\n          \r\n          <div class=\"dash-group pull-right\">\r\n            <div class=\"title\">\r\n              <i class=\"fa fa-puzzle-piece\"></i>\r\n              <span apiman-i18n-key=\"services\">Services</span>\r\n            </div>\r\n            <div class=\"description\" apiman-i18n-key=\"dash.services-description\">\r\n              Create, find, or manage Services.  A Service is also known as an API - anything\r\n              that can be invoked remotely by some sort of client (Application).  This platform\r\n              simply provides a way to expose existing APIs by defining them as Services and\r\n              attaching value-added policies to them.\r\n            </div>\r\n            <div class=\"actions\">\r\n              <ul>\r\n                <li><a href=\"{{ pluginName }}/browse/services\" apiman-i18n-key=\"actions.find-service\" data-field=\"browseServices\">Find/Consume a Service</a></li>\r\n                <li><a href=\"{{ pluginName }}/users/{{ currentUser.username }}/services\" apiman-i18n-key=\"actions.my-services\" data-field=\"myServices\">Manage My Services</a></li>\r\n                <li><a href=\"{{ pluginName }}/new-service\" apiman-i18n-key=\"actions.create-service\" data-field=\"createService\">Create a New Service</a></li>\r\n              </ul>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"dash-group\">\r\n            <div class=\"title\">\r\n              <i class=\"fa fa-gears\"></i>\r\n              <span apiman-i18n-key=\"applications\">Applications</span>\r\n            </div>\r\n            <div class=\"description\" apiman-i18n-key=\"dash.applications-description\">\r\n              Create and manage your Applications.  An Application is the thing that consumes\r\n              APIs (Services).  These consumers must be defined in this platform so that \r\n              contracts can be created between them and the Services they wish to consume.\r\n            </div>\r\n            <div class=\"actions\">\r\n              <ul>\r\n                <li><a href=\"{{ pluginName }}/users/{{ currentUser.username }}/apps\" apiman-i18n-key=\"actions.my-apps\" data-field=\"myApps\">Manage My Applications</a></li>\r\n                <li><a href=\"{{ pluginName }}/new-app\" apiman-i18n-key=\"actions.new-app\" data-field=\"createApp\">Create a New Application</a></li>\r\n              </ul>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"dash-group dash-admin-group pull-right\" data-field=\"adminDashPanel\" ng-show=\"isAdmin\">\r\n            <div class=\"title\">\r\n              <i class=\"fa fa-gavel\"></i>\r\n              <span apiman-i18n-key=\"system-administration\">System Administration</span>\r\n            </div>\r\n            <div class=\"description\" apiman-i18n-key=\"dash.system-description\">\r\n              Hey it looks like you\'re an administrator!  Here are some things only you can do.\r\n              These are system-wide settings you\'re thinking about modifying, so please proceed\r\n              with caution.\r\n            </div>\r\n            <div class=\"actions\">\r\n              <ul>\r\n                <li><a href=\"{{ pluginName }}/admin/roles\" apiman-i18n-key=\"actions.manage-roles\" data-field=\"manageRoles\">Manage Roles/Permissions</a></li>\r\n                <li><a href=\"{{ pluginName }}/admin/policyDefs\" apiman-i18n-key=\"actions.manage-policyDefs\" data-field=\"managePolicyDefs\">Manage Policy Definitions</a></li>\r\n                <li><a href=\"{{ pluginName }}/admin/gateways\" apiman-i18n-key=\"actions.manage-gateways\" data-field=\"manageGateways\">Manage Gateways</a></li>\r\n                <li><a href=\"{{ pluginName }}/admin/plugins\" apiman-i18n-key=\"actions.manage-plugins\" data-field=\"managePlugins\">Manage Plugins</a></li>\r\n              </ul>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/profile.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.UserProfileController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h1><i class=\"fa fa-user fa-fw\"></i> <span apiman-i18n-key=\"user-profile\">User Profile</span></h1>\r\n          <hr />\r\n        </div>\r\n      </div>\r\n      <div class=\"row settings\">\r\n        <div class=\"col-md-6\">\r\n          <div class=\"settings-detail\">\r\n            <form role=\"form\">\r\n              <div class=\"form-group\">\r\n                <label apiman-i18n-key=\"profile.username\" for=\"usernameInput\">Username</label>\r\n                <input ng-model=\"user.username\" type=\"text\" class=\"form-control\" id=\"apiman-username\" disabled=\"disabled\">\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label apiman-i18n-key=\"profile.full-name\" for=\"nameInput\">Full Name</label>\r\n                <input ng-model=\"updatedUser.fullName\" type=\"text\" class=\"form-control\" id=\"apiman-name\" apiman-i18n-key=\"profile.enter-full-name\" placeholder=\"Enter your full name...\">\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label apiman-i18n-key=\"profile.email\" for=\"emailInput\">Email</label>\r\n                <input ng-model=\"updatedUser.email\" type=\"email\" class=\"form-control\" id=\"apiman-email\" apiman-i18n-key=\"profile.enter-email\" placeholder=\"Email address...\">\r\n              </div>\r\n              <button ng-disabled=\"!isDirty || !isValid\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"updateButton\" apiman-i18n-key=\"update-profile\" placeholder=\"Updating...\" data-icon=\"fa-cog\" ng-click=\"save()\">Update Profile</button>\r\n              <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/admin/admin-gateways.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.AdminGatewaysController\" class=\"page container admin-page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_bc.include\'\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <!-- Side Navigation -->\r\n        <div class=\"col-md-3\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_tabs.include\'\"></div>\r\n        </div>\r\n        <!-- Admin Content -->\r\n        <div class=\"col-md-9 admin-content\">\r\n          <div class=\"container-fluid\">\r\n            <div class=\"row\">\r\n              <h2 class=\"title\" data-field=\"heading\" apiman-i18n-key=\"gateways\">Gateways</h2>\r\n            </div>\r\n            <!-- Helpful hint -->\r\n            <div class=\"row\">\r\n              <p class=\"col-md-10 apiman-label-faded\" apiman-i18n-key=\"gateways-help-text\" class=\"apiman-label-faded\">Configure the gateways on which the services may be published.  If no gateways are configured, then users will not be able to publish their services!</p>\r\n            </div>\r\n            <!-- HR -->\r\n            <div class=\"row hr-row\">\r\n              <hr/>\r\n            </div>\r\n            <!-- Filter and Actions -->\r\n            <div class=\"row\">\r\n              <div class=\"apiman-filters apiman-gateways-filters\">\r\n                <a apiman-i18n-key=\"new-gateway\" data-field=\"toNewGateway\" href=\"{{pluginName }}/new-gateway\" class=\"btn btn-primary pull-right\">New Gateway</a>\r\n              </div>\r\n            </div>\r\n            <!-- Table of Gateways -->\r\n            <div class=\"row\">\r\n              <div class=\"table-responsive\">\r\n                <table class=\"table table-striped table-bordered table-hover\" data-field=\"gateways\">\r\n                  <thead>\r\n                    <tr>\r\n                      <th apiman-i18n-key=\"name\">Name</th>\r\n                      <th apiman-i18n-key=\"type\">Configuration Type</th>\r\n                    </tr>\r\n                  </thead>\r\n                  <tbody>\r\n                    <tr ng-hide=\"gateways.length > 0\">\r\n                      <td colspan=\"2\">\r\n                        <div class=\"apiman-no-content\">\r\n                          <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-gateways-found\">No gateways have been added! Try adding a Gateway by clicking \'New Gateway\' above - you\'ll need at least one, otherwise users will not be able to publish their Services.</p>\r\n                        </div>\r\n                      </td>\r\n                    </tr>\r\n                    <tr ng-repeat=\"gateway in gateways\">\r\n                      <td><a href=\"{{ pluginName}}/admin/gateways/{{ gateway.id }}\"><span>{{ gateway.name}}</span></a></td>\r\n                      <td>{{ gateway.type}}</td>\r\n                    </tr>\r\n                  </tbody>\r\n                </table>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/admin/admin-plugins.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.AdminPluginsController\" class=\"page container admin-page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_bc.include\'\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <!-- Side Navigation -->\r\n        <div class=\"col-md-3\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_tabs.include\'\"></div>\r\n        </div>\r\n        <!-- Admin Content -->\r\n        <div class=\"col-md-9 admin-content\">\r\n          <div class=\"container-fluid\">\r\n            <div class=\"row\">\r\n              <h2 class=\"title\" data-field=\"heading\" apiman-i18n-key=\"plugins\">Plugins</h2>\r\n            </div>\r\n            <!-- Helpful hint -->\r\n            <div class=\"row\">\r\n              <p class=\"col-md-10 apiman-label-faded\" apiman-i18n-key=\"plugins-help-text\" class=\"apiman-label-faded\">Manage the plugins known to this installation of apiman.  Plugins allow additional functionality to be included in the system after it has been installed and configured.</p>\r\n            </div>\r\n            <!-- HR -->\r\n            <div class=\"row hr-row\">\r\n              <hr/>\r\n            </div>\r\n            <!-- Filter and Actions -->\r\n            <div class=\"row\">\r\n              <div class=\"apiman-filters apiman-plugins-filters\">\r\n                <a apiman-i18n-key=\"add-plugin\" data-field=\"toNewPlugin\" href=\"{{ pluginName }}/new-plugin\" class=\"btn btn-primary pull-right\">Add Plugin</a>\r\n              </div>\r\n            </div>\r\n            <!-- Table of Plugins -->\r\n            <div class=\"row\">\r\n              <div class=\"table-responsive\">\r\n                <table class=\"table table-striped table-bordered table-hover\" data-field=\"plugins\">\r\n                  <thead>\r\n                    <tr>\r\n                      <th apiman-i18n-key=\"name\">Name</th>\r\n                      <th apiman-i18n-key=\"coordinates\">Coordinates</th>\r\n                    </tr>\r\n                  </thead>\r\n                  <tbody >\r\n                    <tr ng-hide=\"plugins.length > 0\">\r\n                      <td colspan=\"2\">\r\n                        <div class=\"apiman-no-content container-fluid\">\r\n                          <div class=\"row\">\r\n                            <div class=\"col-md-12\">\r\n                              <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-plugins-found\">No plugins have been added! Try adding some plugins by clicking Add Plugin above.</p>\r\n                            </div>\r\n                          </div>\r\n                        </div>\r\n                      </td>\r\n                    </tr>\r\n                    <tr ng-repeat=\"plugin in plugins\">\r\n                      <td>{{ plugin.name }}</td>\r\n                      <td><a href=\"{{ pluginName }}/admin/plugins/{{ plugin.id }}\"><span>{{ plugin.groupId }}:{{ plugin.artifactId }}:{{ plugin.version}}:{{ plugin.type }}</span></a></td>\r\n                    </tr>\r\n                  </tbody>\r\n                </table>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/admin/admin-policyDefs.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.AdminPolicyDefsController\" class=\"page container admin-page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_bc.include\'\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <!-- Side Navigation -->\r\n        <div class=\"col-md-3\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_tabs.include\'\"></div>\r\n        </div>\r\n        <!-- Admin Content -->\r\n        <div class=\"col-md-9 admin-content\">\r\n          <div class=\"container-fluid\">\r\n            <div class=\"row\">\r\n              <h2 class=\"title\" data-field=\"heading\" apiman-i18n-key=\"policy-definitions\">Policy Definitions</h2>\r\n            </div>\r\n            <!-- Helpful hint -->\r\n            <div class=\"row\">\r\n              <p class=\"col-md-10 apiman-label-faded\" apiman-i18n-key=\"policy-definitions-help-text\" class=\"apiman-label-faded\">Configure the available policy definitions.  These will be the policies made available to users when configuring applications, services, and plans.</p>\r\n            </div>\r\n            <!-- HR -->\r\n            <div class=\"row hr-row\">\r\n              <hr/>\r\n            </div>\r\n            <!-- Filter and Actions -->\r\n            <div class=\"row\">\r\n              <div class=\"apiman-filters apiman-policyDefs-filters\">\r\n                <div>\r\n                  <apiman-search-box apiman-i18n-key=\"filter-policies\" function=\"filterPolicies\" placeholder=\"Filter by policy name...\" />\r\n                </div>\r\n                </table>\r\n                <a apiman-i18n-key=\"import-policy\" href=\"{{ pluginName }}/import-policyDefs\" class=\"btn btn-primary pull-right\">Import Policy</a>\r\n              </div>\r\n            </div>\r\n            <!-- Table of Policy Definitions -->\r\n            <div class=\"row\">\r\n\r\n              <div ng-hide=\"policyDefs.length > 0\">\r\n                <div class=\"apiman-no-content container-fluid\">\r\n                  <div class=\"row\">\r\n                    <div class=\"col-md-12\">\r\n                      <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-policy-defs-found\">No policy definitions have been added!  Without at least one policy definition users will not be able to add policies to their Services, Plans, and Applications.</p>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div ng-show=\"policyDefs.length > 0 && filteredPolicyDefs.length == 0\">\r\n                <div class=\"apiman-no-content container-fluid\">\r\n                  <div class=\"row\">\r\n                    <div class=\"col-md-12\">\r\n                      <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-policy-defs-for-filter\">No policy definitions matched your filter criteria.  Try something different!</p>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"apiman-summaryrow\" ng-repeat=\"policyDef in filteredPolicyDefs\">\r\n                <a href=\"{{ pluginName }}/admin/policyDefs/{{policyDef.id}}\"><i style=\"font-size: 18px; margin-top: 2px\" class=\"fa fa-{{ policyDef.icon}} fa-fw\"></i><span>{{ policyDef.name }}</span></a>\r\n                <div style=\"padding-left: 24px\">\r\n	                <div class=\"description apiman-label-faded\">{{ policyDef.description}}</div>\r\n	                <div>\r\n	                  <div class=\"emphasis\" apiman-i18n-key=\"implementation\">Implementation:</div>\r\n	                  <div>{{ policyDef.policyImpl}}</div\r\n	                </div>\r\n                </div>\r\n                <hr/>\r\n              </div>\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/admin/admin-roles.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.AdminRolesController\" class=\"page container admin-page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_bc.include\'\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <!-- Side Navigation -->\r\n        <div class=\"col-md-3\">\r\n          <div ng-include=\"\'plugins/api-manager/html/admin/admin_tabs.include\'\"></div>\r\n        </div>\r\n        <!-- Admin Content -->\r\n        <div class=\"col-md-9 admin-content\">\r\n          <div class=\"container-fluid\">\r\n            <div class=\"row\">\r\n              <h2 class=\"title\" apiman-i18n-key=\"role-management\" apiman-i18n-key=\"role-management\">Role Management</h2>\r\n            </div>\r\n            <!-- Helpful hint -->\r\n            <div class=\"row\">\r\n              <p class=\"col-md-10 apiman-label-faded\" apiman-i18n-key=\"role-management-help-text\" class=\"apiman-label-faded\">Create and modify roles that users can be granted membership in for any organization.  Each role grants the user a set of permissions, allowing her to do specific things within the organization.</p>\r\n            </div>\r\n            <!-- HR -->\r\n            <div class=\"row hr-row\">\r\n              <hr/>\r\n            </div>\r\n            <!-- Filter and Actions -->\r\n            <div class=\"row\">\r\n              <div class=\"apiman-filters apiman-roles-filters\">\r\n                <div>\r\n                  <apiman-search-box apiman-i18n-key=\"filter-roles\" function=\"filterRoles\" placeholder=\"Filter by role name...\" />\r\n                </div>\r\n                <a apiman-i18n-key=\"new-role\" href=\"{{ pluginName }}/new-role\" class=\"btn btn-primary pull-right\">New Role</a>\r\n              </div>\r\n            </div>\r\n            <!-- The Roles -->\r\n            <div class=\"row\">\r\n              <div class=\"apiman-roles\">\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"roles.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-8\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-roles-found\">No roles have been created.  Until at least one \"auto-grant\" role is created, users will not be able to use apiman.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"roles.length > 0 && filteredRoles.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-roles-found-for-filter\">No roles found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"role in filteredRoles\">\r\n                    <div class=\"row\">\r\n                      <span class=\"title\"><a href=\"{{ pluginName }}/admin/roles/{{ role.id }}\">{{ role.name }}</a></span>\r\n                      \r\n                      <a ng-show=\"role.autoGrant\" class=\"apiman-summaryrow-icon\">\r\n                        <i class=\"fa fa-check fa-fw\"></i>\r\n                        <span class=\"title-summary-item\" apiman-i18n-key=\"auto-grant-to-creator\">Auto-granted to org creator</span>\r\n                      </a>\r\n                    </div>\r\n                    <div class=\"row\" style=\"margin-bottom: 8px;\">\r\n                      <span class=\"description apiman-label-faded\">\r\n                        {{ role.description }}\r\n                      </span>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <div class=\"permissions\">\r\n                        <span class=\"emphasis\" apiman-i18n-key=\"grants-permissions\">Grants Permissions:</span>\r\n                        <span class=\"description\" ng-repeat=\"permission in role.permissions\">\r\n                        	{{ permission }}{{$last ? \'\' : \', \'}}\r\n                        </span>\r\n                      </div>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/app/apiModal.html","<div class=\"modal fade\" id=\"apiModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button data-dismiss=\"modal\" aria-hidden=\"true\" class=\"close\" type=\"button\">\r\n          <span class=\"pficon pficon-close\"></span>\r\n        </button>\r\n        <h4 class=\"modal-title\" id=\"apiCopyModalLabel\">\r\n          <span apiman-i18n-key=\"modal-title\">Copy API Endpoint</span>\r\n        </h4>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <p class=\"explanation\" apiman-i18n-key=\"api-dialog-explanation\">To successfully invoke the managed service for this service contract, you must provide the appropriate API Key with each request. The API Key can be provided either by sending it as an HTTP Request Header named X-API-Key, or you can send it as a URL query parameter.</p>\r\n        <hr style=\"margin-left: -25px; margin-right: -25px\">\r\n        <div class=\"form-label\" apiman-i18n-key=\"as-query-param\">As Query Parameter</div>\r\n        <textarea readonly style=\"width: 100%\">{{ asQueryParam }}</textarea>\r\n        <p apiman-i18n-skip>&nbsp;</p>\r\n        <div class=\"form-label\" apiman-i18n-key=\"as-request-header\">As HTTP Request Header</div>\r\n        <textarea readonly style=\"width: 100%\">{{ asRequestHeader }}</textarea>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button data-dismiss=\"modal\" apiman-i18n-key=\"done\" class=\"btn btn-default\" type=\"button\">Done</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/app/app-activity.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.AppActivityController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/app/app_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\">\r\n          <!-- Title and help text -->\r\n          <div class=\"title\" apiman-i18n-key=\"app-activity\">Application Activity</div>\r\n          <div class=\"description\" apiman-i18n-key=\"app-activity-help\">The list below is all of the activity (configuration changes made by apiman users) associated with this Application.</div>\r\n          <hr />\r\n          <apiman-activity model=\"auditEntries\" next=\"getNextPage\"/>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/app/app-apis.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.AppApisController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/app/app_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\">\r\n          <div class=\"col-md-11\">\r\n            <!-- Title and help text -->\r\n            <div class=\"title\" apiman-i18n-key=\"application-apis\">Application APIs</div>\r\n            <div class=\"description\" apiman-i18n-key=\"apis-help\">Below is a list of all the APIs this application consumes.  This information is derived from the set of Service Contracts the Application has entered into.  Manage these Contracts by switching to the \"Contracts\" tab.</div>\r\n            <hr />\r\n            <!-- The list of apis (filterable) -->\r\n            <div>\r\n              <div class=\"clearfix\"></div>\r\n              <div class=\"actions\">\r\n                <a href=\"{{ downloadAsJson }}\" class=\"btn btn-default\" target=\"_self\" apiman-i18n-key=\"download-as-json\">Download as JSON</a>\r\n                <a href=\"{{ downloadAsXml }}\" class=\"btn btn-default\" target=\"_self\" apiman-i18n-key=\"download-as-xml\">Download as XML</a>\r\n              </div>\r\n              <div class=\"clearfix\"></div>\r\n              <!-- The list of apis -->\r\n              <div class=\"table-responsive\">\r\n                <table class=\"table table-striped table-bordered table-hover table-with-details\" data-field=\"apis\">\r\n                  <thead>\r\n                    <tr>\r\n                      <th nowrap=\"nowrap\" width=\"1%\"></th>\r\n                      <th apiman-i18n-key=\"service\" nowrap=\"nowrap\">Service</th>\r\n                      <th apiman-i18n-key=\"version\" width=\"1%\" nowrap=\"nowrap\">Version</th>\r\n                      <th apiman-i18n-key=\"plan\" nowrap=\"nowrap\">Plan</th>\r\n                    </tr>\r\n                  </thead>\r\n                  <tbody>\r\n                    <tr ng-repeat-start=\"api in apiRegistry.apis\">\r\n                      <td><a ng-click=\"toggle(api)\" href=\"javascript:return false;\"><i class=\"fa fa-fw {{ api.expanded ? \'fa-chevron-down\' : \'fa-chevron-right\' }}\"></i></a></td>\r\n                      <td>\r\n                        <span><a href=\"{{ pluginName }}/browse/orgs/{{ api.serviceOrgId }}\">{{ api.serviceOrgName }}</a>\r\n                        <span apiman-i18n-skip>/</span>\r\n                        <a href=\"{{ pluginName }}/browse/orgs/{{ api.serviceOrgId }}/{{ api.serviceName }}/{{ api.serviceVersion }}\"><span class=\"emphasis\">{{ api.serviceName }}</span></a></span>\r\n                      </td>\r\n                      <td><span>{{ api.serviceVersion }}</span></td>\r\n                      <td>{{ api.planName }}</td>\r\n                    </tr>\r\n                    <tr ng-repeat-end ng-show=\"api.expanded\">\r\n                      <td colspan=\"4\">\r\n                        <form role=\"form\">\r\n                          <div class=\"form-group\">\r\n                            <label apiman-i18n-key=\"api-key\">API Key</label>\r\n                            <input readonly type=\"text\" class=\"form-control readonly apiman-readonly\" value=\"{{ api.apiKey }}\">\r\n                          </div>\r\n                          <div class=\"form-group\">\r\n                            <div>\r\n                              <button title=\"Click for details on how to invoke this managed service.\" data-field=\"detailsButton\" class=\"btn btn-default\" apiman-i18n-key=\"how-to-invoke\" ng-click=\"howToInvoke(api)\">How to invoke...</button>\r\n                            </div>\r\n                          </div>\r\n                        </form>\r\n                      </td>\r\n                    </tr>\r\n                  </tbody>\r\n                </table>\r\n              </div>\r\n            </div>\r\n            <!-- /Contract List -->\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/app/app-contracts.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.AppContractsController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/app/app_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\">\r\n          <div class=\"col-md-9\">\r\n            <!-- Title and help text -->\r\n            <div class=\"title\" apiman-i18n-key=\"service-contracts\">Service Contracts</div>\r\n            <div class=\"description\" apiman-i18n-key=\"contracts-help\">Here is a list of all Services that this Application is currently contracted to utilize.  This provides a list of all Services that Application can potentially invoke.</div>\r\n            <hr />\r\n            <!-- The list of contracts (filterable) -->\r\n            <div>\r\n              <div class=\"apiman-filters apiman-contracts-filters\">\r\n                <div>\r\n                  <apiman-search-box apiman-i18n-key=\"filter-app-contracts\" function=\"filterContracts\" placeholder=\"Filter by org or service name...\" />\r\n                </div>\r\n                <a apiman-permission=\"appEdit\" apiman-status=\"Created,Ready\" data-field=\"toNewContract\" apiman-i18n-key=\"new-contract\" href=\"{{ pluginName }}/new-contract\" class=\"btn btn-primary pull-right\">New Contract</a>\r\n                <button ng-click=\"breakAll()\" apiman-action-btn=\"\" ng-disabled=\"!contracts.length\" apiman-permission=\"appEdit\" apiman-status=\"Created,Ready\" data-field=\"breakAllContracts\" apiman-i18n-key=\"break-all-contracts\" placeholder=\"Breaking...\" data-icon=\"fa-cog\" class=\"btn btn-default pull-right\">Break All</button>\r\n              </div>\r\n              <div class=\"clearfix\"></div>\r\n              <!-- The list of contracts -->\r\n              <div class=\"apiman-contracts\" data-field=\"contracts\" ng-repeat=\"contract in filteredContracts\">\r\n                <div class=\"container-fluid apiman-summaryrow\">\r\n                  <div class=\"row\">\r\n                    <div class=\"col-md-10 col-no-padding\">\r\n                      <a href=\"{{ pluginName }}/browse/orgs/{{ contract.serviceOrganizationId }}\">{{ contract.serviceOrganizationName }}</a> / <span class=\"title\"><a href=\"{{ pluginName }}/browse/orgs/{{ contract.serviceOrganizationId }}/{{ contract.serviceId }}/{{ contract.serviceVersion }}\">{{ contract.serviceName }}</a></span>\r\n                      <div class=\"versionAndPlan\">\r\n                        <span apiman-i18n-key=\"app-contract.detail.service-version\">Service version</span>\r\n                        <span><a href=\"{{ pluginName }}/browse/orgs/{{ contract.serviceOrganizationId }}/{{ contract.serviceId }}/{{ contract.serviceVersion }}\">{{ contract.serviceVersion }}</a></span>\r\n                        <span apiman-i18n-key=\"app-contract.detail.via-plan\">via plan</span>\r\n                        <span><a>{{ contract.planName }}</a></span>\r\n                        <span apiman-i18n-key=\"app-contract.detail.entered-into\">entered into on</span>\r\n                        <i class=\"fa fa-clock-o fa-fw fa-inline\"></i>\r\n                        <span>{{ contract.createdOn | date: \'yyyy-MM-dd\' }}</span>\r\n                      </div>\r\n                      <div class=\"description apiman-label-faded\">\r\n                        {{ contract.serviceDescription }}\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-no-padding\">\r\n                      <span class=\"actions\"><button apiman-i18n-key=\"break-contract\" apiman-status=\"Created,Ready\" apiman-permission=\"appEdit\" ng-click=\"break(contract)\" class=\"btn btn-default\">Break Contract</button></span>\r\n                    </div>\r\n                  </div>\r\n                  <hr />\r\n                </div>\r\n              </div>\r\n              \r\n              <div class=\"apiman-no-content container-fluid\" ng-show=\"filteredContracts.length == 0\">\r\n                <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-app-service-contracts.message\">This application doesn\'t appear to have any service contracts (or perhaps none that match your filter above).  Try creating a new Contract to a Service - if you do it will get listed here!</p>\r\n              </div>              \r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/app/app-overview.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.AppOverviewController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/app/app_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\">\r\n          <!-- Content Summary -->\r\n          <div class=\"col-md-12\">\r\n            <h1 apiman-i18n-key=\"app-details\">Application Details</h1>\r\n            <p apiman-i18n-key=\"app-overview.app-description\">\r\n              This is the application details page.  Use this page to modify the Application\'s meta-data,\r\n              policies, and contracts.  There is no need to follow the tabs in order, but note that\r\n              you will need to fill out a minimum amount of data before the Application can be registered\r\n              with the Gateway.  In particular, the Application must have at least one Service Contract\r\n              (see the \"Contracts\" tab).\r\n            </p>\r\n            \r\n            <h2 apiman-i18n-key=\"contracts\">Contracts</h2>\r\n            <p apiman-i18n-key=\"app-overview.contracts-description\">\r\n              The \'Contracts\' tab is where you can manage all of the Service Contracts for this \r\n              Application.  A Service Contract is simply a link between this Application and a provided\r\n              Service the the Application consumes.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"policies\">Policies</h2>\r\n            <p apiman-i18n-key=\"app-overview.policies-description\">\r\n              The \'Policies\' tab allows you to manage the Application-level policies that should\r\n              be applied whenever a request is made to any Service consumed by this Application.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"apis\" apiman-status=\"Registered\">APIs</h2>\r\n            <p apiman-i18n-key=\"app-overview.apis-description\" apiman-status=\"Registered\">\r\n              The \'APIs\' tab lists all of the Services consumed by this Application, including \r\n              showing the API Key and live endpoint for each.  Go here if you want to figure out\r\n              how to invoke a Service once you have a Contract for it.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"activity\">Activity</h2>\r\n            <p apiman-i18n-key=\"app-overview.activity-description\">\r\n              The \'Activity\' tab shows a history of all the changes made to the Application.  Essentially\r\n              it is an audit log.\r\n            </p>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/app/app-policies.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.AppPoliciesController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/app/app_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/app/app_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content\">\r\n          <div class=\"col-md-9\">\r\n            <!-- Title and help text -->\r\n            <div class=\"title\" apiman-i18n-key=\"app-policies\">Application Policies</div>\r\n            <div class=\"description\" apiman-i18n-key=\"app-policies-help\">Here is a list of all Policies defined for this Application.  These Policies will be applied to all Service invocations made by the Application, in addition to whatever Policies are defined by the Service itself.</div>\r\n            <hr />\r\n            <!-- The list of policies -->\r\n            <div apiman-permission=\"appEdit\" apiman-status=\"Created,Ready\" class=\"apiman-filters apiman-policies-filters\">\r\n              <a apiman-i18n-key=\"add-policy\" href=\"{{ pluginName }}/orgs/{{ org.id }}/apps/{{ app.id }}/{{ version.version }}/new-policy\" class=\"btn btn-primary pull-right\">Add Policy</a>\r\n            </div>\r\n            <div class=\"clearfix\"></div>\r\n            <div class=\"apiman-policies\" data-field=\"policies\">\r\n\r\n              <div class=\"apiman-no-content container-fluid\" ng-hide=\"policies.length > 0\">\r\n                <div class=\"row\">\r\n                  <div class=\"col-md-9\">\r\n                    <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-policies-for-app\">It looks like there aren\'t any policies defined! That may be exactly what you want (of course) but if not, you may try defining one using the Add Policy button above...</p>\r\n                  </div>\r\n                  <div apiman-permission=\"svcEdit\" apiman-status=\"Created,Ready\" class=\"col-md-3\">\r\n                    <div class=\"apiman-no-entities-arrow\"></div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"clearfix\"></div>\r\n              <apiman-policy-list ng-model=\"policies\" remove-function=\"removePolicy\" type=\"applications\" org-id=\"{{ org.id }}\" page-id=\"{{ app.id }}\" version=\"{{ version.version }}\"></policy-list>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/app/app.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.AppRedirectController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/consumer/consumer-org.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.ConsumerOrgController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <ol class=\"breadcrumb\" data-field=\"breadcrumb\">\r\n            <li><a href=\"{{ pluginName }}/dash\"><i class=\"fa fa-home fa-fw\"></i><span apiman-i18n-key=\"home\">Home</span></a></li>\r\n            <li><a href=\"{{ pluginName }}/browse/orgs\"><i class=\"fa fa-search fa-fw\"></i><span apiman-i18n-key=\"organizations\">Organizations</span></a></li>\r\n            <li class=\"active\"><span><i class=\"fa fa-shield fa-fw\"></i><span>{{ org.name }}</span></span></li>\r\n          </ol>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h1 class=\"consumer-top-header\" apiman-i18n-key=\"organization-details\">Organization Details</h1>\r\n        </div>\r\n        <div class=\"col-md-12\">\r\n          <div class=\"vspacer-10\" />\r\n        </div>\r\n      </div>\r\n      \r\n      <div class=\"row\">\r\n\r\n        <!-- Left column -->\r\n        <div class=\"col-md-4 browse-items\">\r\n          <div class=\"item\" style=\"width: 100%; margin-bottom: 20px;\" data-field=\"organizationCard\">\r\n            <div class=\"title\"><i class=\"fa fa-shield icon\"></i><span data-field=\"title\">{{ org.name }}</span></div>\r\n            <div class=\"description\" data-field=\"description\">{{ org.description }}</div>\r\n            <div class=\"actions\" style=\"display:none\">\r\n              <button class=\"btn btn-default\" style=\"display:none\" data-field=\"requestMembership\" apiman-i18n-key=\"request-membership\">Request Membership</button>\r\n            </div>\r\n            <a ng-show=\"org.isMember\" class=\"ismember\" title=\"You are already a member of this Organization.\" href=\"{{ pluginName }}/orgs/{{ org.id }}\" data-field=\"isMemberLink\" apiman-i18n-key=\"is-member\"></a>\r\n          </div>\r\n          \r\n          <div class=\"consumer-section\">\r\n            <h3 apiman-i18n-key=\"current-members\" class=\"consumer-header\">Current Members</h3>\r\n            <div class=\"apiman-members\" data-field=\"members\">\r\n              <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"member in members\">\r\n                <div class=\"row\">\r\n                  <span class=\"title\">\r\n                    <i class=\"fa fa-fw fa-user icon\"></i>\r\n                    <a href=\"{{ pluginName }}/users/{{ member.userId }}/orgs\">{{ member.userName }}</a>\r\n                    <span class=\"secondary\">({{ member.userId }})</span>\r\n                  </span>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Right column -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"consumer-section\">\r\n            <h3 apiman-i18n-key=\"services-offered\" class=\"consumer-header\">Services Offered</h3>\r\n            <div class=\"apiman-filters apiman-services-filters\">\r\n              <apiman-search-box apiman-i18n-key=\"filter-consumer-services\" function=\"filterServices\" placeholder=\"Filter by service name...\" />\r\n            </div>\r\n            <div class=\"apiman-services consumer-section\" data-field=\"services\">\r\n\r\n              <div class=\"apiman-no-content\" ng-hide=\"services.length > 0\">\r\n                <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"consumer-no-services-found-for-org\">No services are currently offered by this organization.</p>\r\n              </div>\r\n\r\n              <div class=\"apiman-no-content\" ng-show=\"services.length > 0 && filteredServices.length == 0\">\r\n                <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"consumer-no-services-found-for-filter\">No services matched the current filter criteria.</p>\r\n              </div>\r\n\r\n              <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"service in filteredServices\">\r\n                <div class=\"row\">\r\n                  <i class=\"fa fa-fw fa-puzzle-piece icon\"></i>\r\n                  <span class=\"title\"><a href=\"{{ pluginName }}/browse/orgs/{{ org.id }}/{{ service.id }}\">{{ service.name }}</a></span>\r\n                </div>\r\n                <div class=\"row\">\r\n                  <span class=\"description\">\r\n                    {{ service.description }}\r\n                  </span>\r\n                </div>\r\n                <hr/>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/consumer/consumer-orgs.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.ConsumerOrgsController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <ol class=\"breadcrumb\" data-field=\"breadcrumb\">\r\n            <li><a href=\"{{ pluginName }}/dash\"><i class=\"fa fa-home fa-fw\"></i><span apiman-i18n-key=\"home\">Home</span></a></li>\r\n            <li class=\"active\"><i class=\"fa fa-search fa-fw\"></i><span apiman-i18n-key=\"organizations\">Organizations</span></li>\r\n          </ol>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h1 class=\"consumer-top-header\" apiman-i18n-key=\"find-org\">Find an Organization</h1>\r\n        </div>\r\n        <div class=\"col-md-6 no-phone\">\r\n          <p class=\"description\" apiman-i18n-key=\"find-org-description\">Use this page to find Organizations you may wish to join. Use this page to find Organizations you may wish to join. Use this page to find Organizations you may wish to join.</p>\r\n        </div>\r\n        <div class=\"col-md-6\">\r\n          <form ng-submit=\"searchOrg(orgName)\">\r\n            <input id=\"apiman-search\" ng-model=\"orgName\" type=\"text\" class=\"form-control input-search\" apiman-i18n-key=\"searchfor-orgs\" placeholder=\"Enter a word or phrase to search by...\"></input>\r\n            <button type=\"submit\" class=\"btn btn-default btn-search\" apiman-i18n-key=\"search\" data-field=\"searchButton\"\">Search</input>\r\n          </form>\r\n        </div>\r\n        <div class=\"col-md-12\">\r\n          <hr />\r\n        </div>\r\n      </div>\r\n      \r\n      <!-- Search results -->\r\n      <div class=\"row browse-items\">\r\n        <div class=\"col-md-12\" data-field=\"orgs\">\r\n\r\n          <div class=\"apiman-no-content container-fluid\" ng-hide=\"orgs.length > 0\">\r\n            <div class=\"row\">\r\n              <div class=\"col-md-9\">\r\n                <p apiman-i18n-key=\"consumer-no-orgs-found\" class=\"apiman-no-entities-description\">No organizations found. Either no organizations matched the query or you haven\'t queried yet!</p>\r\n              </div>\r\n              <div class=\"col-md-3\"></div>\r\n            </div>\r\n          </div>\r\n\r\n          <div ng-show=\"orgs.length > 0\">\r\n	        <div class=\"count\">\r\n	          Found {{ orgs.length }} matching organizations.\r\n	        </div>\r\n	        <div class=\"item\" ng-repeat=\"org in orgs\">\r\n	          <div class=\"title\"><i class=\"fa fa-shield icon\"></i><a href=\"{{ pluginName }}/browse/orgs/{{ org.id }}\">{{ org.name }}</a></div>\r\n	          <div class=\"description\" title=\"{{ org.description }}\">{{ org.description }}</div>\r\n<!-- 	          <div class=\"actions\"> -->\r\n<!-- 	            <button class=\"btn btn-default\">Request Membership</button> -->\r\n<!-- 	          </div> -->\r\n	          <a apiman-i18n-key=\"is-member-badge\" ng-show=\"org.isMember\" href=\"{{ pluginName }}/orgs/{{ org.id }}\" class=\"ismember\" title=\"You are already a member of this Organization.\"></a>\r\n	        </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      \r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/consumer/consumer-service-redirect.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.ConsumerServiceRedirectController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/consumer/consumer-service.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.ConsumerSvcController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <ol class=\"breadcrumb\" data-field=\"breadcrumb\">\r\n            <li><a href=\"{{ pluginName }}/dash\"><i class=\"fa fa-home fa-fw\"></i><span apiman-i18n-key=\"home\">Home</span></a></li>\r\n            <li><a href=\"{{ pluginName }}/browse/services\"><i class=\"fa fa-search fa-fw\"></i><span apiman-i18n-key=\"services\">Services</span></a></li>\r\n            <li class=\"active\"><i class=\"fa fa-puzzle-piece fa-fw\"></i><span>{{ service.name }}</span></li>\r\n          </ol>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h1 class=\"consumer-top-header\" apiman-i18n-key=\"service-details\">Service Details</h1>\r\n        </div>\r\n        <div class=\"col-md-12\">\r\n          <div class=\"vspacer-10\" />\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n\r\n        <!-- Left column -->\r\n        <div class=\"col-md-4 browse-items\">\r\n          <div class=\"item\" style=\"width: 100%; margin-bottom: 20px;\" data-field=\"serviceCard\">\r\n            <div class=\"title\">\r\n              <i class=\"fa fa-puzzle-piece icon\"></i><a href=\"{{ pluginName }}/browse/orgs/{{ service.organization.id }}\" data-field=\"titleOrg\">{{ service.organization.name }}</a>\r\n              <span apiman-i18n-skip> / </span>\r\n              <span class=\"emphasis\" data-field=\"titleService\">{{ service.name }}</span>\r\n            </div>\r\n            <div class=\"description\" data-field=\"description\" style=\"margin-bottom: 10px;\">{{ service.description }}</div>\r\n            <span class=\"form-label\" apiman-i18n-key=\"choose-version\">Choose Version:</span>\r\n            <div class=\"btn-group apiman-entity-action\" ng-show=\"versions.length > 0\">\r\n              <select apiman-select-picker=\"\" ng-model=\"selectedServiceVersion\" ng-change=\"setVersion( selectedServiceVersion )\" \r\n                title=\"\" class=\"selectpicker\" data-live-search=\"false\" apiman-i18n-skip\r\n                data-field=\"versionSelector\" data-ng-options=\"version as version.version for version in versions\">\r\n              </select>\r\n            </div>\r\n            <div apiman-i18n-key=\"no-published-service-versions-found\" class=\"apiman-label-faded\" ng-hide=\"versions.length > 0\">\r\n              No versions of this service have been published.  You will not be able to\r\n              consume this service until it has been published by its owner!\r\n            </div>\r\n          </div>\r\n        </div>\r\n        \r\n        <!-- Right column -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"consumer-section\">\r\n            <div id=\"managed-endpoint-wrap\" ng-show=\"version.publicService\">\r\n              <h3 apiman-i18n-key=\"public-endpoint\" class=\"consumer-header\">Public Endpoint</h3>\r\n              <p class=\"apiman-label-faded\" apiman-i18n-key=\"consumer-service.public-service-warning\">\r\n                Because this is a Public Service, it is possible to invoke it directly, without\r\n                the need for a Service Contract with an Application.  To directly invoke the\r\n                Service, send requests to the API Gateway endpoint below.\r\n              </p>\r\n              <div style=\"margin-bottom: 20px;\">\r\n                <textarea readonly=\"readonly\" class=\"apiman-endpoint\" style=\"width:100%\">{{ publicEndpoint.managedEndpoint }}</textarea>\r\n              </div>\r\n            </div>\r\n\r\n            <div id=\"available-plans-wrap\">\r\n              <h3 apiman-i18n-key=\"available-plans\" class=\"consumer-header\">Available Plans</h3>\r\n              <div class=\"apiman-plans consumer-section\" data-field=\"plans\">\r\n\r\n                <div class=\"apiman-no-content\" ng-hide=\"plans.length > 0\">\r\n                  <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-plans-offered-by-service\">No plans are currently offered by this service.</p>\r\n                </div>\r\n\r\n                <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"plan in plans\">\r\n                  <div class=\"row\">\r\n                    <div class=\"col-md-10 col-no-padding\">\r\n                      <i class=\"fa fa-fw fa-bar-chart-o icon\"></i>\r\n                      <span class=\"title\"><a data-toggle=\"collapse\" ng-click=\"getPolicyChain(plan)\" href=\"#collapse{{ $index }}\">{{ plan.planName }}</a></span>\r\n                      <div class=\"description\">\r\n                        {{ plan.planDescription }}\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-no-padding\">\r\n                      <span class=\"actions\"><a apiman-i18n-key=\"create-contract\" href=\"{{ pluginName }}/new-contract?svc={{ params.service }}&amp;svcorg={{ params.org }}&amp;svcv={{ params.version }}&amp;planid={{ plan.planId }}\" class=\"btn btn-default\">Create Contract</a></span>\r\n                    </div>\r\n                  </div>\r\n                  <!-- Sub-section - policy chain -->\r\n                  <div class=\"panel-collapse collapse apiman-policy-chain\" id=\"collapse{{ $index }}\" style=\"margin-top: 15px\" >\r\n                  \r\n                    <div ng-hide=\"chains[plan.planId]\">\r\n                      <div class=\"spinner spinner-sm pull-left\"></div>\r\n                      <span apiman-i18n-key=\"loading-policy-chain\" style=\"margin-left: 5px\">Loading policy chain...</span>\r\n                    </div>\r\n                  \r\n                    <div class=\"apiman-policies\" ng-show=\"chains[plan.planId]\">\r\n                      <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"policy in chains[plan.planId]\">\r\n                        <div class=\"row\">\r\n                          <div class=\"col-md-1 col-no-padding\">\r\n                            <i class=\"fa fa-{{ policy.icon }} fa-fw apiman-policy-icon\"></i>\r\n                          </div>\r\n                          <div class=\"col-md-11 col-no-padding\">\r\n                            <div class=\"\">\r\n                              <span class=\"title apiman-label-faded\">{{ policy.name }}</span>\r\n                            </div>\r\n                            <div class=\"description apiman-label-faded\">{{ policy.description }}</div>\r\n                          </div>\r\n                        </div>\r\n                        <div>\r\n                          <hr>\r\n                        </div>\r\n                      </div>\r\n                    </div> <!-- /policy chain -->\r\n                    \r\n                  </div>\r\n                  <hr />\r\n                </div>\r\n              \r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div> <!-- /right-column -->\r\n        \r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/consumer/consumer-services.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.ConsumerSvcsController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <ol class=\"breadcrumb\" data-field=\"breadcrumb\">\r\n            <li><a href=\"{{ pluginName }}/dash\"><i class=\"fa fa-home fa-fw\"></i><span apiman-i18n-key=\"home\">Home</span></a></li>\r\n            <li class=\"active\"><i class=\"fa fa-search fa-fw\"></i><span apiman-i18n-key=\"services\">Services</span></li>\r\n          </ol>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h1 class=\"consumer-top-header\" apiman-i18n-key=\"find-service\">Find a Service</h1>\r\n        </div>\r\n        <div class=\"col-md-6 no-phone\">\r\n          <p class=\"description\" apiman-i18n-key=\"find-service-description\">Use this page to find Services you wish to consume.  Use the various search options to find Services, then review them and eventually create Contracts to them.</p>\r\n        </div>\r\n        <div class=\"col-md-6\">\r\n          <form ng-submit=\"searchSvcs(serviceName)\">\r\n            <input id=\"apiman-search\" ng-model=\"serviceName\" type=\"text\" class=\"form-control input-search\" apiman-i18n-key=\"searchfor-svcs\" placeholder=\"Search by service name or keyword...\"></input>\r\n            <button type=\"submit\" class=\"btn btn-default btn-search\" apiman-i18n-key=\"search\" data-field=\"searchButton\" ng-click=\"searchSvcs()\">Search</input>\r\n          </button>\r\n        </div>\r\n        <div class=\"col-md-12\">\r\n          <hr />\r\n        </div>\r\n      </div>\r\n      \r\n      <!-- Search results -->\r\n      <div class=\"row browse-items\">\r\n        <div class=\"col-md-12\" data-field=\"services\">\r\n\r\n          <div class=\"apiman-no-content container-fluid\" ng-hide=\"services.length > 0\">\r\n            <div class=\"row\">\r\n              <div class=\"col-md-9\">\r\n                <p apiman-i18n-key=\"consumer-no-services-found\" class=\"apiman-no-entities-description\">No services found. Either no services matched the query or you haven\'t queried yet!</p>\r\n              </div>\r\n              <div class=\"col-md-3\"></div>\r\n            </div>\r\n          </div>\r\n\r\n          <div ng-show=\"services.length > 0\">\r\n            <div class=\"count\">\r\n              Found {{ services.length}} matching services.\r\n            </div>\r\n\r\n            <div class=\"item\" ng-repeat=\"service in services\">\r\n              <div class=\"title\">\r\n                <i class=\"fa fa-puzzle-piece icon\"></i><a href=\"{{ pluginName }}/browse/orgs/{{service.organizationId}}\">{{ service.organizationName }}</a>\r\n                <span apiman-i18n-skip> / </span>\r\n                <b><a href=\"{{ pluginName }}/browse/orgs/{{service.organizationId}}/{{service.id}}\">{{ service.name }}</a></b>\r\n              </div>\r\n              <div class=\"description\" title=\"{{ service.description }}\">{{ service.description }}</div>\r\n            </div>\r\n          </div>\r\n\r\n        </div>\r\n      </div>\r\n\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/directives/activity.html","<div class=\"apiman-activity\">\r\n\r\n  <div class=\"apiman-no-content container-fluid\" ng-hide=\"auditEntries.length > 0\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-activity-found-for-user\">No activity was found.  I guess someone should do something first!</p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"entry in auditEntries\">\r\n    <div>\r\n      <apiman-audit-entry model=\"entry\" entity-type=\"{{ entry.what }}\" data-entry-type=\"{{ entry.entityType }}\" />\r\n    </div>\r\n    <div class=\"row\">\r\n      <i class=\"fa fa-fw {{ getEntryIcon(entry) }}\"></i>\r\n      <div class=\"apiman-timestamp\">{{ entry.createdOn | date : \"yyyy-MM-dd \'@\' h:mm:ss a\" }}</div>\r\n    </div>\r\n    <hr/>\r\n  </div>\r\n  <div class=\"container-fluid\" style=\"text-align: center\" ng-hide=\"auditEntries.length == 0\">\r\n    <button ng-show=\"hasMore && auditEntries.length >= 20\" apiman-action-btn=\"\" data-field=\"getMoreButton\" apiman-i18n-key=\"activity.show-more\" placeholder=\"Loading More...\" data-icon=\"fa-cog\" ng-click=\"getMore()\" class=\"btn btn-default\">Show Next 20 Items</button>\r\n  </div>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/confirmModal.html","      <div class=\"modal fade\" id=\"confirmModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r\n        <div class=\"modal-dialog\">\r\n          <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n              <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\r\n                <span class=\"pficon pficon-close\"></span>\r\n              </button>\r\n              <h4 class=\"modal-title\"><span>{{ title }}</span></h4>\r\n            </div>\r\n            <div class=\"modal-body\" ng-transclude=\"\"></div>\r\n            <div class=\"modal-footer\">\r\n              <button ng-click=\"onNo()\" data-dismiss=\"modal\" type=\"button\" class=\"btn btn-default\" apiman-i18n-key=\"no\">No</button>\r\n              <button ng-click=\"onYes()\" data-dismiss=\"modal\" type=\"button\" class=\"btn btn-primary\"  apiman-i18n-key=\"yes\">Yes</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/editDescription.html","<div style=\"margin-top: 15px; position: relative;\">\r\n    <div class=\"description\" editable-textarea=\"descr\" e-ng-focus=\"focusOnDescription($event)\" e-ng-change=\"changeOnDescription()\"\r\n        e-class=\"autoExpand\" ng-mouseover=\"descriptionMouseOver($event)\" ng-mouseout=\"descriptionMouseOut($event)\"\r\n        id=\"descriptionWrapper\">\r\n            {{ descr || \"&lt;\" + defaultValue + \"&gt;\" }}\r\n            <a href=\"#\" class=\"apiman-inline-edit-overlay-edit\" ng-show=\"showPencil\" style=\"position:absolute\"\r\n                ng-style=\"{ left: leftPosition, top: topPosition, height: height }\">\r\n                <i class=\"fa fa-pencil fa-fw\"></i>\r\n            </a>\r\n    </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/policyList.html","<div class=\"apiman-policies\" id=\'draggable-ctr\' as-sortable=\"policyListOptions\" ng-model=\"ctrl.policies\">\r\n    <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"policy in ctrl.policies\" as-sortable-item>\r\n        <div class=\"row\" >\r\n            <div as-sortable-item-handle apiman-permission=\"svcEdit\" apiman-status=\"Created,Ready\" class=\"grabber\" style=\"height: 48px\"></div>\r\n            <div class=\"col-md-1 col-no-padding\">\r\n                <i class=\"apiman-policy-icon fa fa-{{ policy.icon }} fa-fw\"></i>\r\n            </div>\r\n            <div class=\"col-md-9 col-no-padding\">\r\n                <div>\r\n                    <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{ ctrl.org }}/{{ ctrl.type == \'applications\' ? \'apps\' : ctrl.type }}/{{ ctrl.id }}/{{ ctrl.version }}/policies/{{ policy.id }}\">{{ policy.name }}</a></span>\r\n                </div>\r\n                <div class=\"metaData\">\r\n                    <span apiman-i18n-key=\"policyList.policy-created-by\">Policy created by </span>\r\n                    <span><a href=\"{{ pluginName }}/users/{{ policy.createdBy }}\">{{ policy.createdBy }}</a></span>\r\n                    <span apiman-i18n-key=\"on\">on</span>\r\n                    <i class=\"fa fa-clock-o fa-inline\"></i>\r\n                    <span>{{ policy.createdOn | date:\'yyyy-MM-dd\' }}</span>\r\n                </div>\r\n                <div class=\"description apiman-label-faded\">\r\n                    {{ policy.description }}\r\n                </div>\r\n            </div>\r\n            <div class=\"col pull-right\">\r\n                <button apiman-i18n-key=\"remove\" class=\"btn btn-default\" apiman-status=\"Created,Ready\" ng-click=\"ctrl.remove( policy )\">Remove</button>\r\n            </div>\r\n        </div>\r\n        <hr />\r\n    </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/searchBox.html","<table class=\"search-box input-search\" data-field=\"contractFilter\">\r\n    <tbody>\r\n      <tr>\r\n        <td width=\"99%\">\r\n          <input ng-model=\"value\" ng-change=\"doSearch()\" value=\"\" type=\"text\" placeholder=\"{{ placeholder }}\">\r\n        </td>\r\n        <td width=\"1%\">\r\n          <button ng-click=\"onClick()\" class=\"btn btn-default\"><i class=\"fa fa-fw fa-search\"></i></button>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n</table>\r\n");
$templateCache.put("plugins/api-manager/html/directives/selectServiceModal.html","      <div class=\"modal fade\" id=\"selectServiceModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r\n        <div class=\"modal-dialog\">\r\n          <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n              <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\r\n                <span class=\"pficon pficon-close\"></span>\r\n              </button>\r\n              <h4 class=\"modal-title\"><span>{{ title }}</span></h4>\r\n            </div>\r\n            <div class=\"modal-body modal-select-service\">\r\n              <p apiman-i18n-key=\"select-service-help\">\r\n                Select a service by searching for a service by name (or part of a name) and choosing one of the\r\n                matches.\r\n              </p>\r\n              <form ng-submit=\"search()\">\r\n                <input apiman-i18n-key=\"search-service-name\" ng-model=\"searchText\" type=\"text\" class=\"form-control input-search\" placeholder=\"Search by service name...\"></input>\r\n                <button type=\"submit\" apiman-action-btn=\"\" class=\"btn btn-default btn-search\" data-field=\"searchButton\" apiman-i18n-key=\"search\" data-icon=\"fa-cog\" placeholder=\"Searching\">Search</button>\r\n              </form>\r\n              <div class=\"clearfix\"></div>\r\n              <div class=\"panel panel-default input-search-results\">\r\n                <div class=\"panel-body container-fluid\" data-field=\"services\">\r\n                  <a ng-click=\"onServiceSelected(service)\" href=\"#\" class=\"item\" ng-repeat=\"service in services\" ng-class=\"{ selected : service.selected }\">\r\n                    <i class=\"fa fa-puzzle-piece fa-fw\"></i>\r\n                    <span class=\"\">{{ service.organizationName }}</span>\r\n                    <span apiman-i18n-skip> / </span>\r\n                    <span class=\"emphasis\">{{ service.name }}</span>\r\n                  </a>\r\n                  <div class=\"alert alert-info\" ng-show=\"!services && criteria\">\r\n                     <span class=\"pficon pficon-info\"></span>\r\n                     <span apiman-i18n-key=\"no-services-matched\">No services found matching your search.  Please try a different search.</span>\r\n                  </div>\r\n                  <div class=\"alert alert-info\" ng-show=\"!services && !criteria\">\r\n                     <span class=\"pficon pficon-info\"></span>\r\n                     <span apiman-i18n-key=\"no-service-search-criteria\">Enter some search criteria above and click Search to find a Service.</span>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"clearfix\"></div>\r\n              <table ng-show=\"serviceVersions\">\r\n                <tr>\r\n                  <td><span apiman-i18n-key=\"choose-svc-version\" class=\"form-label\">Choose Service Version:</span></td>\r\n                  <td>\r\n                    <select apiman-i18n-key=\"choose-svc-version-select\" ng-model=\"selectedServiceVersion\" apiman-select-picker=\"\" class=\"selectpicker version\" title=\"[no versions found]\" ng-options=\"svcVersion.version for svcVersion in serviceVersions\">\r\n                  </td>\r\n                </tr>\r\n              </table>\r\n              <div class=\"alert alert-warning\" ng-show=\"serviceVersions && serviceVersions.length == 0\" style=\"margin-top: 15px\">\r\n                 <span class=\"pficon pficon-info\"></span>\r\n                 <span apiman-i18n-key=\"no-valid-service-versions\">No valid versions of the selected Service were found.</span>\r\n              </div>\r\n              \r\n            </div>\r\n            <div class=\"modal-footer\">\r\n              <button data-dismiss=\"modal\" type=\"button\" class=\"btn btn-default\" apiman-i18n-key=\"cancel\">Cancel</button>\r\n              <button ng-disabled=\"!selectedServiceVersion\" ng-click=\"onOK()\" data-dismiss=\"modal\" type=\"button\" class=\"btn btn-primary\" apiman-i18n-key=\"ok\">OK</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n");
$templateCache.put("plugins/api-manager/html/errors/400.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.Error400Controller\" class=\"container error-page\" data-field=\"error-page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">\r\n          <div class=\"error-icon error-403 pull-right\"></div>\r\n        </div>\r\n        <div class=\"col-md-8\">\r\n          <div class=\"title\" apiman-i18n-key=\"error-400-title\">Bad Request!</div>\r\n          <div class=\"description\" apiman-i18n-key=\"error-400-description\">\r\n           Bad request!\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/errors/403.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.Error403Controller\" class=\"container error-page\" data-field=\"error-page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">\r\n          <div class=\"error-icon error-403 pull-right\"></div>\r\n        </div>\r\n        <div class=\"col-md-8\">\r\n          <div class=\"title\" apiman-i18n-key=\"error-403-title\">Not Allowed!</div>\r\n          <div class=\"description\" apiman-i18n-key=\"error-403-description\">Uh oh, it looks like you tried to access something you aren\'t allowed to see.  Since you aren\'t that kind of person it was probably our fault. Maybe you should let someone know?</div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/errors/404.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.Error404Controller\" class=\"container error-page\" data-field=\"error-page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">\r\n          <div class=\"error-icon error-404 pull-right\"></div>\r\n        </div>\r\n        <div class=\"col-md-8\">\r\n          <div class=\"title\" apiman-i18n-key=\"error-404-title\">Oops, Not Found</div>\r\n          <div class=\"description\" apiman-i18n-key=\"error-404-description\">Oh...well, we couldn\'t find the page you were looking for.  Perhaps it no longer exists?  Or maybe you just got the name wrong?  I doubt it was stolen by badgers, but that\'s not impossible either.</div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/errors/409.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.Error409Controller\" class=\"container error-page\" data-field=\"error-page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">\r\n          <div class=\"error-icon error-409 pull-right\"></div>\r\n        </div>\r\n        <div class=\"col-md-8\">\r\n          <div class=\"title\" apiman-i18n-key=\"error-409-title\">Already Exists</div>\r\n          <div apiman-i18n-key=\"error-409-message\" class=\"description\" apiman-i18n-key=\"error-409-description\">You\'ve just tried to create something that already exists!  Maybe try again with a different name?</div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/errors/500.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.Error500Controller\" class=\"container error-page\" data-field=\"error-page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">\r\n          <div class=\"error-icon error-500 pull-right\"></div>\r\n        </div>\r\n        <div class=\"col-md-8\">\r\n          <div class=\"title\" apiman-i18n-key=\"error-500-title\">Server Error!</div>\r\n          <div class=\"description\" apiman-i18n-key=\"error-500-message\">Oh boy.  This one is totally on us.  Something really unexpected happened on the server and caused an error.  It\'s not you, it\'s me.  Really.  You could probably just try it again and see what happens.  If it keeps on happening you may need to contact someone about it.</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\" ng-show=\"error.data\" style=\"margin-top: 20px\">\r\n        <div class=\"col-md-3\"></div>\r\n        <div class=\"col-md-8\">\r\n          <div class=\"header\" apiman-i18n-key=\"error-message\">Error Message</div>\r\n          <div>\r\n            <input data-field=\"errorMessage\" class=\"form-control errorMessage\" readonly=\"readonly\" value=\"{{ error.data.message }}\" type=\"text\"></input>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\" style=\"margin-top: 15px\" ng-show=\"error.data\">\r\n        <div class=\"col-md-3\"></div>\r\n        <div class=\"col-md-8\">\r\n          <div class=\"header\" apiman-i18n-key=\"error-details\">Error Details</div>\r\n          <div>\r\n            <pre data-field=\"errorDetail\">{{ error.data.stacktrace }}</pre>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/edit-gateway.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.EditGatewayController\" id=\"form-page\" class=\"container apiman-edit-gateway apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <fieldset>\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"edit-gateway\">Edit Gateway</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"edit-gateway-help-text\" class=\"col-md-6 apiman-label-faded\">Update this gateway\'s details, useful when a Gateway\'s endpoint or authentication information is changed.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Choose gateway name -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"gateway-name\">Gateway Name</dt>\r\n          <dd>\r\n            <input id=\"apiman-gateway-name\" ng-model=\"gateway.name\" data-field=\"name\" type=\"text\" class=\"form-control name entityname\" placeholder=\"Enter gateway name...\" apiman-i18n-key=\"enter-gateway-name\" disabled=\"disabled\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Description of gateway -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"description\">Description</dt>\r\n          <dd>\r\n            <textarea ng-model=\"gateway.description\" data-field=\"description\" type=\"text\" class=\"form-control description\" id=\"apiman-gateway-description\" apiman-i18n-key=\"enter-gateway-description\" placeholder=\"Enter gateway description (optional)...\"></textarea>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Configuration Endpoint -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"config-endpoint\">Configuration Endpoint</dt>\r\n          <dd>\r\n            <input ng-model=\"configuration.endpoint\" data-field=\"configEndpoint\" type=\"text\" class=\"form-control description\" id=\"config-endpoint\" apiman-i18n-key=\"enter-gateway-config-endpoint\" placeholder=\"Enter configuration endpoint...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Authentication Credentials -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"credentials\">Configuration Endpoint Credentials</dt>\r\n          <dd>\r\n            <table class=\"form-table\">\r\n              <tr>\r\n                <td class=\"td-label\">\r\n                  <span apiman-i18n-key=\"username\">Username:</span>\r\n                </td>\r\n                <td>\r\n                  <input ng-model=\"configuration.username\" name=\"username\" type=\"text\" class=\"form-control name entityname\" apiman-i18n-key=\"gateway-auth-username\" placeholder=\"Username...\"></input>\r\n                </td>\r\n              </tr>\r\n              <tr>\r\n                <td class=\"td-label\">\r\n                  <span apiman-i18n-key=\"password\">Password:</span>\r\n                </td>\r\n                <td>\r\n                  <input ng-model=\"configuration.password\" name=\"password\" type=\"password\" class=\"form-control name entityname\" apiman-i18n-key=\"gateway-auth-password\" placeholder=\"Password...\"></input>\r\n                </td>\r\n              </tr>\r\n              <tr>\r\n                <td></td>\r\n                <td>\r\n                  <input ng-model=\"passwordConfirm\" name=\"passwordConfirm\" type=\"password\" class=\"form-control name entityname\" apiman-i18n-key=\"gateway-auth-confirm-pass\" placeholder=\"Confirm Password...\"></input>\r\n                </td>\r\n              </tr>\r\n            </table>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid\" ng-click=\"testGateway()\" apiman-action-btn=\"\" class=\"btn btn-default\" data-field=\"testButton\" apiman-i18n-key=\"test-gateway\" placeholder=\"Testing...\" data-icon=\"fa-cog\">Test Gateway</button>\r\n      </div>\r\n      <div class=\"row\" ng-show=\"testResult == \'success\'\">\r\n        <div class=\"alert alert-success description\" style=\"margin-top: 10px\">\r\n          <span class=\"pficon pficon-ok\"></span>\r\n          <strong apiman-i18n-key=\"gateway-configuration-valid.title\">Gateway Configuration Valid</strong> \r\n          <div apiman-i18n-key=\"gateway-configuration-valid.msg\">Your Gateway configuration is correct.  Great job!</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\" ng-show=\"testResult == \'error\'\">\r\n        <div class=\"alert alert-danger description\" style=\"margin-top: 10px\">\r\n          <span class=\"pficon-layered\">\r\n            <span class=\"pficon pficon-error-octagon\"></span>\r\n            <span class=\"pficon pficon-error-exclamation\"></span>\r\n          </span>\r\n          <strong apiman-i18n-key=\"gateway-configuration-invalid.title\">Gateway Configuration Invalid</strong>\r\n          <div apiman-i18n-key=\"gateway-configuration-invalid.msg\">Something has gone wrong when testing the Gateway.  Hopefully the details (below) will help you figure out what.</div>\r\n          <div style=\"margin-top: 8px\">\r\n            <pre>{{ testErrorMessage }}</pre>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Update Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid || !isDirty\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"updateButton\" apiman-i18n-key=\"update-gateway\" placeholder=\"Updating...\" data-icon=\"fa-cog\" ng-click=\"updateGateway()\">Update Gateway</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n        <button apiman-action-btn=\"\" class=\"btn btn-danger\" style=\"margin-left: 100px;\" data-field=\"deleteButton\" apiman-i18n-key=\"delete-gateway\" placeholder=\"Deleting...\" data-icon=\"fa-cog\" ng-click=\"deleteGateway()\">Delete Gateway</button>\r\n      </div>\r\n  	  </fieldset>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/edit-plugin.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.EditPluginController\" id=\"form-page\" class=\"container apiman-edit-plugin apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"plugin-details\">Plugin Details</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"plugin-details-help-text\" class=\"col-md-6 apiman-label-faded\">Plugins cannot be edited, but details about the plugin can be viewed on this page.  Additionally, the plugin can be deleted via the Delete button below.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <div class=\"row container\">\r\n        <!-- Left column -->\r\n        <div class=\"col-md-6 container\">\r\n          <div class=\"row\">\r\n            <h3 class=\"\" apiman-i18n-key=\"plugin-coordinates\">Plugin Coordinates</h3>\r\n          </div>\r\n          <div class=\"row\">\r\n            <dl>\r\n              <dt apiman-i18n-key=\"group-id\">Group Id</dt>\r\n              <dd>\r\n                <span data-field=\"groupId\">{{ plugin.groupId }}</span>\r\n              </dd>\r\n            </dl>\r\n          </div>\r\n          <div class=\"row\">\r\n            <dl>\r\n              <dt apiman-i18n-key=\"artifact-id\">Artifact Id</dt>\r\n              <dd>\r\n                <span data-field=\"artifactId\">{{ plugin.artifactId }}</span>\r\n              </dd>\r\n            </dl>\r\n          </div>\r\n          <div class=\"row\">\r\n            <dl>\r\n              <dt apiman-i18n-key=\"version\">Version</dt>\r\n              <dd>\r\n                <span data-field=\"version\">{{ plugin.version }}</span>\r\n              </dd>\r\n            </dl>\r\n          </div>\r\n          <div class=\"row\">\r\n            <dl>\r\n              <dt apiman-i18n-key=\"classifier.optional\">Classifier (optional)</dt>\r\n              <dd>\r\n                <span data-field=\"classifier\">{{ plugin.classifier }}</span>\r\n              </dd>\r\n            </dl>\r\n          </div>\r\n          <div class=\"row\">\r\n            <dl>\r\n              <dt apiman-i18n-key=\"type.optional\">Type (optional)</dt>\r\n              <dd>\r\n                <span data-field=\"type\">{{ plugin.type }}</span>\r\n              </dd>\r\n            </dl>\r\n          </div>\r\n        </div>\r\n        <!-- Right column -->\r\n        <div class=\"col-md-6 container\">\r\n          <div class=\"row\">\r\n            <h3 class=\"\" apiman-i18n-key=\"plugin-info\">Plugin Info</h3>\r\n          </div>\r\n          <div class=\"row\">\r\n            <dl>\r\n              <dt apiman-i18n-key=\"name\">Name</dt>\r\n              <dd>\r\n                <span data-field=\"name\">{{ plugin.name }}</span>\r\n              </dd>\r\n            </dl>\r\n          </div>\r\n          <div class=\"row\">\r\n            <dl>\r\n              <dt apiman-i18n-key=\"description\">Description</dt>\r\n              <dd>\r\n                <span data-field=\"description\">{{ plugin.description }}</span>\r\n              </dd>\r\n            </dl>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n        <button apiman-action-btn=\"\" class=\"btn btn-danger\" style=\"margin-left: 100px;\" data-field=\"deleteButton\" apiman-i18n-key=\"delete-plugin\" placeholder=\"Deleting...\" data-icon=\"fa-cog\" ng-click=\"deletePlugin()\">Delete Plugin</button>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/edit-policy.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.EditPolicyController\" id=\"form-page\" class=\"container apiman-edit-policy apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" data-field=\"heading\" apiman-i18n-key=\"edit-policy\">Edit Policy</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p class=\"col-md-6 apiman-label-faded\" apiman-i18n-key=\"edit-policy-help-text\" class=\"apiman-label-faded\">Update this policy\'s configuration settings using the form below.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n\r\n      <!-- Policy Type-specific config -->\r\n      <div class=\"row\" ng-show=\"include\">\r\n        <h3 data-field=\"policyHeading\">{{ policy.definition.name }} Configuration</h3>\r\n        <div class=\"box col-md-9 container\">\r\n          <div ng-include=\"include\"></div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\" data-status=\"Created,Ready\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Update Button -->\r\n      <div class=\"row\" data-status=\"Created,Ready\">\r\n        <button apiman-action-btn=\"\" ng-click=\"updatePolicy()\" ng-disabled=\"!isValid\" class=\"btn btn-primary\" data-field=\"updateButton\" apiman-i18n-key=\"update-policy\" placeholder=\"Updating...\" data-icon=\"fa-cog\">Update Policy</button>\r\n        <a data-field=\"cancelButton\" href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/edit-policyDef.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.EditPolicyDefController\" id=\"form-page\" class=\"container apiman-edit-policy apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" data-field=\"heading\" apiman-i18n-key=\"edit-policy-def\">Edit Policy Definition</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p class=\"col-md-6 apiman-label-faded\" apiman-i18n-key=\"edit-policy-def-help-text\" class=\"apiman-label-faded\">Update this policy definition\'s configuration settings using the form below.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Policy Type-specific config -->\r\n      <div class=\"row\">\r\n        <h3 data-field=\"policyHeading\">Policy Configuration<i> </i></h3>\r\n        <div class=\"box col-md-9 container\" data-field=\"policyFormWrapper\">\r\n          <div class=\"form policy-config default\">\r\n            <span apiman-i18n-key=\"manually-configure-policy-json\">Please manually configure your policy\'s JSON configuration below.</span>\r\n            <textarea ng-model=\"policyDefJSON\">{{ policyDefJSON }}</textarea>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\" apiman-status=\"Created,Ready\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Update Button -->\r\n      <div class=\"row\" apiman-status=\"Created,Ready\">\r\n        <button class=\"btn btn-primary\" data-field=\"updateButton\" apiman-i18n-key=\"update-policy\" placeholder=\"Updating...\" data-icon=\"fa-cog\" ng-click=\"updatePolicyDef()\">Update Policy</button>\r\n        <a data-field=\"cancelButton\" href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/edit-role.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.EditRoleController\" id=\"form-page\" class=\"container apiman-edit-role apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"edit-role\">Edit Role</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"edit-role-help-text\" class=\"col-md-6 apiman-label-faded\">Update this role\'s definition, including description and assigned permissions.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Description of role -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"description\">Description</dt>\r\n          <dd>\r\n            <input ng-model=\"role.description\" type=\"text\" class=\"form-control description\" id=\"apiman-description\" apiman-i18n-key=\"enter-role-description\" placeholder=\"Enter role description (optional)...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Auto-grant this role -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"auto-grant\">Auto-Grant Role</dt>\r\n          <dd>\r\n             <div class=\"checkbox\">\r\n               <label>\r\n                 <input ng-model=\"role.autoGrant\" data-field=\"autoGrant\" type=\"checkbox\"></input> \r\n                 <span apiman-i18n-key=\"grant-role-automatically\">Grant this role automatically when creating a new Organization</span>\r\n               </label>\r\n             </div>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Permissions -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"permissions\">Permissions</dt>\r\n          <dd>\r\n            <div class=\"container\">\r\n              <div class=\"row\" data-field=\"permissions\">\r\n                <div class=\"col-md-3\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'orgView\']\" data-field=\"orgView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.orgView\">Organization View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'orgEdit\']\" data-field=\"orgEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.orgEdit\">Organization Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'orgAdmin\']\" data-field=\"orgAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.orgAdmin\">Organization Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'planView\']\" data-field=\"planView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.planView\">Plan View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'planEdit\']\" data-field=\"planEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.planEdit\">Plan Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'planAdmin\']\" data-field=\"planAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.planAdmin\">Plan Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'svcView\']\" data-field=\"svcView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.svcView\">Service View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'svcEdit\']\" data-field=\"svcEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.svcEdit\">Service Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'svcAdmin\']\" data-field=\"svcAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.svcAdmin\">Service Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'appView\']\" data-field=\"appView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.appView\">Application View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'appEdit\']\" data-field=\"appEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.appEdit\">Application Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'appAdmin\']\" data-field=\"appAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.appAdmin\">Application Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"updateButton\" apiman-i18n-key=\"update-role\" placeholder=\"Updating...\" data-icon=\"fa-cog\" ng-click=\"updateRole()\">Update Role</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n        <button apiman-action-btn=\"\" class=\"btn btn-danger\" style=\"margin-left: 100px;\" data-field=\"deleteButton\" apiman-i18n-key=\"delete-role\" placeholder=\"Deleting...\" data-icon=\"fa-cog\" ng-click=\"deleteRole()\">Delete Role</button>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/import-policyDefs.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ImportPolicyDefsController\" id=\"form-page\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"import-policy-defs\">Import Policy Definition(s)</h2>\r\n      </div>\r\n      <div id=\"dataPage\" ng-show=\"isData\">\r\n        <!-- Helpful hint -->\r\n        <div class=\"row\">\r\n          <p apiman-i18n-key=\"import-policy-defs-help-text\" class=\"col-md-6 apiman-label-faded\">Import one or more policy definition.  Simply copy/paste the policy definition data into the text area below and click Import - we\'ll do the rest!  Make sure the data is properly formatted JSON.</p>\r\n        </div>\r\n        <!-- HR -->\r\n        <div class=\"row hr-row\">\r\n          <hr/>\r\n        </div>\r\n        <!-- Choose policyDef name -->\r\n        <div class=\"row\">\r\n          <dl>\r\n            <dt apiman-i18n-key=\"policyDef-data\">Policy Definition Data</dt>\r\n            <dd>\r\n              <textarea apiman-drop-text ng-model=\"policyDefsJSON\" data-field=\"data\" class=\"form-control form-data\" width=\"100%\"></textarea>\r\n              <div class=\"alert alert-warning\" ng-show=\"!isValid && policyDefsJSON\" style=\"margin-top: 15px\">\r\n                 <span class=\"pficon pficon-info\"></span>\r\n                 <span apiman-i18n-key=\"invalid-policy-def-data-message\">The policy definition data above is not valid.  Please make sure to type/copy a valid Policy Definition JSON document.</span>\r\n              </div>\r\n            </dd>\r\n          </dl>\r\n        </div>\r\n        <!-- HR -->\r\n        <div class=\"row hr-row\">\r\n          <hr/>\r\n        </div>\r\n        <!-- Import Button -->\r\n        <div class=\"row\">\r\n          <button ng-disabled=\"!isValid\" class=\"btn btn-primary\" apiman-i18n-key=\"import\" placeholder=\"Importing...\" data-icon=\"fa-cog\"  ng-click=\"parseJSON()\">Import</button>\r\n          <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n        </div>\r\n      </div>\r\n\r\n      <div id=\"confirmPage\" ng-show=\"isConfirm\">\r\n        <div class=\"row\">\r\n          <table class=\"table table-striped table-bordered table-hover table-responsive\" data-field=\"policyDefs\">\r\n            <thead>\r\n              <tr>\r\n                <th apiman-i18n-key=\"policy\">Policy</th>\r\n                <th class=\"no-phone\" apiman-i18n-key=\"implementation.header\">Implementation</th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr ng-repeat=\"policyDef in policyDefs\">\r\n                <td><i class=\"fa fa-{{policyDef.icon}} fa-fw\"></i><span>{{ policyDef.name }}</span></td>\r\n                <td class=\"no-phone\">{{ policyDef.policyImpl }}</td>\r\n              </tr>\r\n            </tbody>\r\n          </table>\r\n        </div>\r\n        <div class=\"row\">\r\n          <p apiman-i18n-key=\"confirm-import-policyDefs\">Really import the policy definition(s) listed above?</p>\r\n        </div>\r\n        <!-- Confirm Button  -->\r\n        <div class=\"row\">\r\n          <button apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"yesButton\" apiman-i18n-key=\"yes\" placeholder=\"Importing...\" data-icon=\"fa-cog\" ng-click=\"importPolicyDefs()\">Yes</button>\r\n          <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"noButton\" apiman-i18n-key=\"no\">No</a>\r\n        </div>\r\n\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-app.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewAppController\" id=\"form-page\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-application\">New Application</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-app-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new Application within the specified Organization, allowing you to begin connecting provided Services with your Application.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Choose org and app name -->\r\n      <div ng-show=\"organizations.length > 0\">\r\n        <div class=\"row\">\r\n          <dl class=\"org\">\r\n            <dt apiman-i18n-key=\"organization\">Organization</dt>\r\n            <dd>\r\n              <div class=\"btn-group\" data-field=\"orgSelector\">\r\n                <button type=\"button\" id=\"selector-org\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" data-field=\"button\">\r\n                  <span id=\"selector-org-value\">{{selectedOrg.name}}</span> &nbsp;&nbsp;<span class=\"caret\"></span>\r\n                </button>\r\n                <ul class=\"dropdown-menu\" data-field=\"organizations\">\r\n                   <li ng-repeat=\"org in organizations\"><a href=\"#\" ng-click=\"setOrg( org )\">{{ org.name }}</a></li>\r\n                </ul>\r\n              </div>\r\n            </dd>\r\n          </dl>\r\n          <dl class=\"slash\">\r\n            <dt apiman-i18n-skip>&nbsp;</dt>\r\n            <dd>\r\n              <span class=\"divider\" apiman-i18n-skip>/</span>\r\n            </dd>\r\n          </dl>\r\n          <dl class=\"name\">\r\n            <dt apiman-i18n-key=\"application-name\">Application Name</dt>\r\n            <dd>\r\n              <input ng-model=\"app.name\" data-field=\"name\" type=\"text\" class=\"form-control entityname\" id=\"apiman-entityname\" apiman-i18n-key=\"enter-app-name\" placeholder=\"Enter application name...\"></input>\r\n            </dd>\r\n          </dl>\r\n        </div>\r\n        <!-- Initial Application Version -->\r\n        <div class=\"row\">\r\n          <dl>\r\n            <dt apiman-i18n-key=\"initial-version\">Initial Version</dt>\r\n            <dd>\r\n              <input ng-model=\"app.initialVersion\" data-field=\"version\" type=\"text\" class=\"form-control version\" id=\"apiman-version\"></input>\r\n            </dd>\r\n          </dl>\r\n        </div>\r\n        <!-- Description of app -->\r\n        <div class=\"row\">\r\n          <dl>\r\n            <dt apiman-i18n-key=\"description\">Description</dt>\r\n            <dd>\r\n              <input ng-model=\"app.description\" data-field=\"description\" type=\"text\" class=\"form-control description\" id=\"apiman-description\" apiman-i18n-key=\"enter-app-description\" placeholder=\"Enter application description (optional)...\"></input>\r\n            </dd>\r\n          </dl>\r\n        </div>\r\n      </div>\r\n      <div ng-hide=\"organizations.length > 0\" class=\"apiman-no-content container-fluid\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12\">\r\n            <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"missing-create-app-permission\">You don\'t have permission to create an Application in any of your Organizations (or you aren\'t in any orgs)!  Please become a member of an existing Organization or create a new one before trying to create an Application.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!app.name || !app.initialVersion || !selectedOrg\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-application\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"saveNewApp()\">Create Application</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-appversion.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div id=\"progress-indicator\" ng-class=\"{ \'loading\': isLoading, \'loaded\': isLoaded }\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewAppVersionController\" id=\"form-page\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-app-version\">New Application Version</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-appversion-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new version of this Application, allowing multiple different versions of the Application to be managed at the same time.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Application Version -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"version\">Version</dt>\r\n          <dd>\r\n            <input ng-model=\"appversion.version\" type=\"text\" class=\"form-control version\" id=\"apiman-version\" apiman-i18n-key=\"enter-app-version\" placeholder=\"Enter version...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dd>\r\n            <table>\r\n              <tr>\r\n                <td><input ng-model=\"appversion.clone\" type=\"checkbox\" id=\"cloneCB\" data-field=\"cloneCB\"></input></td>\r\n                <td><label style=\"margin-left: 4px; padding-top: 2px\" for=\"cloneCB\" apiman-i18n-key=\"make-clone\">Make a clone of the previously selected version (copy all policies and settings)</label></td>\r\n              </tr>\r\n            </table>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!appversion.version\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-version\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"saveNewAppVersion()\">Create Version</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-contract.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewContractController\" id=\"form-page\" class=\"container apiman-new-contract apiman-entity-new page\" data-field=\"page\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-contract\">New Contract</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p class=\"col-md-6 apiman-label-faded\" apiman-i18n-key=\"new-contract-help-text\" class=\"apiman-label-faded\">Creating a Contract allows you to connect an Application to a Service via a particular Plan offered by the Service.  You would want to do this so that your Application can invoke the Service successfully.  Note that this is not necessary if the Service is public.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n\r\n      <div id=\"new-contract-form\" class=\"row\">\r\n        <div class=\"col-md-6\">\r\n          <div class=\"application\" ng-class=\"{ selected : selectedAppVersion }\">\r\n            <div class=\"title\"><i class=\"fa fa-gears fa-fw\"></i> <span apiman-i18n-key=\"from-app\">From Application</span></div>\r\n            <div class=\"body\">\r\n              <p apiman-i18n-key=\"new-contract.app-description\">\r\n                The Application that will be used as the source of the new Service Contract.  Choose one \r\n                of your available Applications below, and then choose an application version.\r\n              </p>\r\n              <div class=\"center-content\" ng-show=\"apps.length > 0\">\r\n                <select ng-model=\"selectedApp\" apiman-select-picker=\"\" class=\"selectpicker\" data-live-search=\"true\" apiman-i18n-key=\"select-app\" title=\"Select an Application\" ng-options=\"(app.organizationName + \' / \' + app.name) for app in apps\"></select>\r\n                <span class=\"slash\" apiman-i18n-skip>&#8680;</span>\r\n                <select ng-model=\"selectedAppVersion\" apiman-select-picker=\"appVersions\" class=\"selectpicker\" apiman-i18n-key=\"select-app-version\" title=\"Select a Version\" ng-options=\"version for version in appVersions\">\r\n                </select>\r\n              </div>\r\n              <div class=\"alert alert-warning\" ng-show=\"apps.length > 0 && selectedApp && appVersions.length == 0\">\r\n                 <span class=\"pficon pficon-info\"></span>\r\n                 <span apiman-i18n-key=\"new-contract.no-unregistered-app-versions\">\r\n                   There are no (unregistered) versions of the selected application.  Note: you may only create\r\n                   Contracts in Applications that have not yet been registered.\r\n                 </span>\r\n              </div>\r\n              <div class=\"alert alert-warning\" ng-show=\"apps.length == 0\">\r\n                 <span class=\"pficon pficon-info\"></span>\r\n                 <span apiman-i18n-key=\"new-contract.no-apps-found\">\r\n                   We couldn\'t find any Applications for you - you must have at least one (not yet registered)\r\n                   Application in order to create a Contract.\r\n                 </span>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        \r\n        <div class=\"clearfix\"></div>\r\n\r\n        <div class=\"col-md-6\">\r\n          <div class=\"arrow to-plan-arrow\" apiman-i18n-skip>&nbsp;</div>\r\n        </div>\r\n\r\n        <div class=\"clearfix\"></div>\r\n      \r\n        <div class=\"col-md-6\">\r\n          <div class=\"plan\" ng-class=\"{ selected : selectedPlan }\">\r\n            <div class=\"title\"><i class=\"fa fa-bar-chart-o fa-fw\"></i> <span apiman-i18n-key=\"using-plan\">Using Plan</span></div>\r\n            <div class=\"body\">\r\n              <p ng-show=\"!plans\" apiman-i18n-key=\"new-contract.choose-valid-service-msg\">\r\n                 Please choose a valid Service below before selecting the Plan you wish to use for\r\n                 this Contract (either you have not selected a Service or the Service has no \r\n                 available plans).\r\n              </p>\r\n              <p apiman-i18n-key=\"new-contract.plan-description\" ng-show=\"plans\" apiman-i18n-key=\"new-contract.choose-plan-msg\">\r\n                Use the drop-down below to choose one of the Plans made available by the selected Service.\r\n              </p>\r\n              <div class=\"center-content\" ng-show=\"plans\">\r\n                <select ng-model=\"selectedPlan\" apiman-select-picker=\"\" class=\"selectpicker\" apiman-i18n-key=\"select-plan\" title=\"Select a Plan\" ng-options=\"plan.planName for plan in plans\">\r\n                </select>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"clearfix\"></div>\r\n\r\n        <div class=\"col-md-6\">\r\n          <div class=\"arrow to-service-arrow\" apiman-i18n-skip>&nbsp;</div>\r\n        </div>\r\n\r\n        <div class=\"clearfix\"></div>\r\n\r\n        <div class=\"col-md-6\">\r\n          <div class=\"service\" ng-class=\"{ selected : selectedService }\">\r\n            <div class=\"title\"><i class=\"fa fa-puzzle-piece fa-fw\"></i> <span apiman-i18n-key=\"to-service\">To Service</span></div>\r\n            <div class=\"body\">\r\n              <p apiman-i18n-key=\"new-contract.service-description\">\r\n                Use this section to choose what Service the Application will be consuming (aka the\r\n                \"target\" of this Service Contract).\r\n              </p>\r\n              <div class=\"center-content\">\r\n                <button ng-click=\"selectService()\" class=\"btn btn-default btn-svc\" ng-show=\"selectedService\">\r\n                  <span>{{ selectedService.organizationName }}</span>\r\n                  <span apiman-i18n-skip> / </span>\r\n                  <span class=\"emphasis\">{{ selectedService.name }}</span>\r\n                  <span apiman-i18n-skip>&#8680;</span>\r\n                  <span>{{ selectedService.version }}</span>\r\n                </button>\r\n                <button ng-click=\"selectService()\" class=\"btn btn-default btn-svc btn-primary\" ng-show=\"!selectedService\">\r\n                  <span apiman-i18n-key=\"select-service\">Select a Service</span>\r\n                </button>\r\n                <div class=\"clearfix\" />\r\n                <span style=\"font-size: 10px\" ng-show=\"selectedService\" apiman-i18n-key=\"new-contract.click-to-change\">(click to change)</span>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div> <!-- /new-contract-form -->\r\n      \r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <button ng-click=\"createContract()\" apiman-action-btn=\"\" ng-disabled=\"!selectedApp || !selectedAppVersion || !selectedPlan || !selectedService\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-contract\" placeholder=\"Creating...\" data-icon=\"fa-cog\">Create Contract</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-gateway.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.NewGatewayController\" id=\"form-page\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <fieldset>\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-gateway\">New Gateway</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-gateway-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new API Gateway for use by Services.  When publishing a Service, at least one Gateway must be specified so that service configuration details can be published to the appropriate place.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Choose gateway name -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"gateway-name\">Gateway Name</dt>\r\n          <dd>\r\n            <input id=\"apiman-gateway-name\" ng-model=\"gateway.name\" name=\"name\" type=\"text\" class=\"form-control name entityname\" apiman-i18n-key=\"enter-gateway-name\" placeholder=\"Enter gateway name...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Description of gateway -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"description\">Description</dt>\r\n          <dd>\r\n            <textarea ng-model=\"gateway.description\" data-field=\"description\" type=\"text\" class=\"form-control description\" id=\"apiman-description\" apiman-i18n-key=\"enter-gateway-description\" placeholder=\"Enter gateway description (optional)...\"></textarea>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Configuration Endpoint -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"config-endpoint\">Configuration Endpoint</dt>\r\n          <dd>\r\n            <input ng-model=\"configuration.endpoint\" type=\"url\" name=\"configEndpoint\" type=\"text\" class=\"form-control description\" id=\"config-endpoint\" apiman-i18n-key=\"enter-gateway-config-endpoint\" placeholder=\"Enter configuration endpoint...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Authentication Credentials -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"credentials\">Configuration Endpoint Credentials</dt>\r\n          <dd>\r\n            <table class=\"form-table\">\r\n              <tr>\r\n                <td class=\"td-label\">\r\n                  <span apiman-i18n-key=\"username\">Username:</span>\r\n                </td>\r\n                <td>\r\n                  <input ng-model=\"configuration.username\" name=\"username\" type=\"text\" class=\"form-control name entityname\" apiman-i18n-key=\"enter-gateway-username\" placeholder=\"Username...\"></input>\r\n                </td>\r\n              </tr>\r\n              <tr>\r\n                <td class=\"td-label\">\r\n                  <span apiman-i18n-key=\"password\">Password:</span>\r\n                </td>\r\n                <td>\r\n                  <input ng-model=\"configuration.password\" data-field=\"password\" type=\"password\" class=\"form-control name entityname\" apiman-i18n-key=\"enter-gateway-password\" placeholder=\"Password...\"></input>\r\n                </td>\r\n              </tr>\r\n              <tr>\r\n                <td></td>\r\n                <td>\r\n                  <input ng-model=\"passwordConfirm\" data-field=\"passwordConfirm\" type=\"password\" class=\"form-control name entityname\" apiman-i18n-key=\"enter-gateway-password-confirm\" placeholder=\"Confirm Password...\"></input>\r\n                </td>\r\n              </tr>\r\n            </table>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid\" apiman-action-btn=\"\" data-field=\"testButton\" ng-click=\"testGateway()\" class=\"btn btn-default\" name=\"testButton\" apiman-i18n-key=\"test-gateway\" placeholder=\"Testing...\" data-icon=\"fa-cog\">Test Gateway</button>\r\n      </div>\r\n      <div class=\"row\" ng-show=\"testResult == \'success\'\">\r\n        <div class=\"alert alert-success description\" style=\"margin-top: 10px\">\r\n          <span class=\"pficon pficon-ok\"></span>\r\n          <strong apiman-i18n-key=\"gateway-config-valid.title\">Gateway Configuration Valid</strong> \r\n          <div apiman-i18n-key=\"gateway-config-valid.msg\">Your Gateway configuration is correct.  Great job!</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\" ng-show=\"testResult == \'error\'\">\r\n        <div class=\"alert alert-danger description\" style=\"margin-top: 10px\">\r\n          <span class=\"pficon-layered\">\r\n            <span class=\"pficon pficon-error-octagon\"></span>\r\n            <span class=\"pficon pficon-error-exclamation\"></span>\r\n          </span>\r\n          <strong apiman-i18n-key=\"gateway-config-invalid.title\">Gateway Configuration Invalid</strong>\r\n          <div apiman-i18n-key=\"gateway-config-invalid.msg\">Something has gone wrong when testing the Gateway.  Hopefully the details (below) will help you figure out what.</div>\r\n          <div style=\"margin-top: 8px\">\r\n            <pre>{{ testErrorMessage }}</pre>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" name=\"createButton\" apiman-i18n-key=\"create-gateway\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"createGateway()\">Create Gateway</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n      </fieldset>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-org.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewOrgController\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-organization\">New Organization</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-org-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new Organization within which to manage your Services and Applications.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Choose org and app name -->\r\n      <div class=\"row\">\r\n        <dl class=\"name\">\r\n          <dt apiman-i18n-key=\"organization-name\">Organization Name</dt>\r\n          <dd>\r\n            <input ng-model=\"org.name\" data-field=\"name\" type=\"text\" class=\"form-control entityname\" id=\"apiman-entityname\" apiman-i18n-key=\"enter-org-name\" placeholder=\"Enter organization name...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Description of app -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"description\">Description</dt>\r\n          <dd>\r\n            <input ng-model=\"org.description\" data-field=\"description\" type=\"text\" class=\"form-control description\" id=\"apiman-description\" apiman-i18n-key=\"enter-org-description\" placeholder=\"Enter description (optional)...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Add Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!org.name\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-organization\" placeholder=\"Creating...\" data-icon=\"fa-cog\"  ng-click=\"saveNewOrg()\">Create Organization</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-plan.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewPlanController\" id=\"form-page\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-plan\">New Plan</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-plan-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new Plan within the specified Organization, allowing you to assign groups of Policies to Services.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Choose org and plan name -->\r\n      <div class=\"row\">\r\n        <dl class=\"org\">\r\n          <dt apiman-i18n-key=\"organization\">Organization</dt>\r\n          <dd>\r\n            <div class=\"btn-group\" data-field=\"orgSelector\">\r\n              <button type=\"button\" id=\"selector-org\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" data-field=\"button\">\r\n                <span data-field=\"selectorLabel\" id=\"selector-org-value\">{{selectedOrg.name}}</span> &nbsp;&nbsp;<span class=\"caret\"></span>\r\n              </button>\r\n              <ul class=\"dropdown-menu\" data-field=\"organizations\">\r\n                <li ng-repeat=\"org in organizations\"><a href=\"#\" ng-click=\"setOrg( org )\">{{ org.name }}</a></li>\r\n              </ul>\r\n            </div>\r\n          </dd>\r\n        </dl>\r\n        <dl class=\"slash\">\r\n          <dt apiman-i18n-skip>&nbsp;</dt>\r\n          <dd>\r\n            <span class=\"divider\" apiman-i18n-skip>/</span>\r\n          </dd>\r\n        </dl>\r\n        <dl class=\"name\">\r\n          <dt apiman-i18n-key=\"plan-name\">Plan Name</dt>\r\n          <dd>\r\n            <input ng-model=\"plan.name\" data-field=\"name\" type=\"text\" class=\"form-control entityname\" id=\"apiman-entityname\" apiman-i18n-key=\"enter-plan-name\" placeholder=\"Enter plan name...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Initial Plan Version -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"initial-version\">Initial Version</dt>\r\n          <dd>\r\n            <input ng-model=\"plan.initialVersion\" data-field=\"version\" type=\"text\" class=\"form-control version\" id=\"apiman-version\" value=\"1.0\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Description of plan -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"description\">Description</dt>\r\n          <dd>\r\n            <input ng-model=\"plan.description\" data-field=\"description\" type=\"text\" class=\"form-control description\" id=\"apiman-description\" apiman-i18n-key=\"enter-plan-description\" placeholder=\"Enter plan description (optional)...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-plan\" placeholder=\"Creating...\" data-icon=\"fa-cog\"  ng-click=\"saveNewPlan()\">Create Plan</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n    </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-planversion.html","    <!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div id=\"progress-indicator\" ng-class=\"{ \'loading\': isLoading, \'loaded\': isLoaded }\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewPlanVersionController\" id=\"form-page\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-plan-version\">New Plan Version</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-planversion-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new version of this Plan, allowing multiple different versions of the Plan to be managed at the same time.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Plan Version -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"version\">Version</dt>\r\n          <dd>\r\n            <input ng-model=\"planversion.version\" type=\"text\" class=\"form-control version\" id=\"apiman-version\" apiman-i18n-key=\"enter-plan-version\" placeholder=\"Enter version...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dd>\r\n            <table>\r\n              <tr>\r\n                <td><input ng-model=\"planversion.clone\" type=\"checkbox\" id=\"cloneCB\" data-field=\"cloneCB\"></input></td>\r\n                <td><label style=\"margin-left: 4px; padding-top: 2px\" for=\"cloneCB\" apiman-i18n-key=\"make-clone\">Make a clone of the previously selected version (copy all policies and settings)</label></td>\r\n              </tr>\r\n            </table>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!planversion.version\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-version\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"saveNewPlanVersion()\">Create Version</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-plugin.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.NewPluginController\" id=\"form-page\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n    <div id=\"form-page\" class=\"\" data-field=\"page\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-plugin\">Add Plugin</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-plugin-help-text\" class=\"col-md-6 apiman-label-faded\">Adds a plugin to the API Manager.  A plugin is identified by its \"coordinates\", which are its maven artifact details (groupId, artifactId, version, classifier, type).  Enter valid values below and click add!</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <div class=\"row\">\r\n        <h3 class=\"\" apiman-i18n-key=\"plugin-coordinates\">Plugin Coordinates</h3>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"group-id\">Group Id</dt>\r\n          <dd>\r\n            <input ng-model=\"plugin.groupId\" id=\"apiman-group-id\" data-field=\"groupId\" type=\"text\" class=\"form-control entityname\" apiman-i18n-key=\"enter-gav-groupid\" placeholder=\"Enter groupId...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"artifact-id\">Artifact Id</dt>\r\n          <dd>\r\n            <input ng-model=\"plugin.artifactId\" type=\"text\" class=\"form-control entityname\" apiman-i18n-key=\"enter-gav-artifactid\" placeholder=\"Enter artifactId...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"version\">Version</dt>\r\n          <dd>\r\n            <input ng-model=\"plugin.version\" type=\"text\" class=\"form-control entityname\" apiman-i18n-key=\"enter-gav-version\" placeholder=\"Enter version (e.g. 1.0)...\" style=\"width: 175px\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"classifier.optional\">Classifier (optional)</dt>\r\n          <dd>\r\n            <input ng-model=\"plugin.classifier\" type=\"text\" class=\"form-control entityname\" apiman-i18n-key=\"enter-gav-classifier\" placeholder=\"Enter classifier...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"type.optional\">Type (optional)</dt>\r\n          <dd>\r\n            <input ng-model=\"plugin.type\" type=\"text\" class=\"form-control entityname\" apiman-i18n-key=\"enter-gav-type\" placeholder=\"Enter type (e.g. jar)...\" style=\"width: 175px\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"addButton\" apiman-i18n-key=\"add-plugin\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"addPlugin()\">Add Plugin</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-policy.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewPolicyController\" id=\"form-page\" class=\"container apiman-new-policy apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" data-field=\"heading\" apiman-i18n-key=\"add-policy\">Add Policy</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p class=\"col-md-6 apiman-label-faded\" apiman-i18n-key=\"new-policy-help-text\" class=\"apiman-label-faded\">Adding a policy will allow its specific functionality to be applied to the service invocation as part of the overall Policy Chain.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Policy Type -->\r\n      <div class=\"row policy-type-row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"policy-type\">Policy Type</dt>\r\n          <dd>\r\n            <select ng-model=\"selectedDefId\" apiman-select-picker=\"\" class=\"selectpicker\" data-live-search=\"true\" apiman-i18n-key=\"new-policy.choose-policy-type\" title=\"Choose a policy type...\">\r\n              <option value=\"__null__\" data-content=\"<i class=\'fa fa-inline fa-fw\'></i> <span class=\'apiman-label-faded\'>Choose a policy type...</span>\" apiman-i18n-key=\"new-policy.choose-policy-type\">Choose a policy type...</option>\r\n              <option value=\"{{ def.id }}\" ng-repeat=\"def in policyDefs | orderBy : \'name.toLowerCase()\'\" data-content=\"<i class=\'fa fa-inline fa-fw fa-{{ def.icon }}\'></i> <span>{{ def.name }}</span>\">{{ def.name }}</option>\r\n            </select>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n\r\n      <!-- Policy Type-specific config -->\r\n      <div class=\"row\" ng-show=\"include\">\r\n        <h3 data-field=\"policyHeading\">{{ selectedDef.name }} <span apiman-i18n-key=\"configuration\">Configuration</span></h3>\r\n        <div class=\"box col-md-9 container\">\r\n          <div ng-include=\"include\"></div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-policy\" placeholder=\"Adding...\" data-icon=\"fa-cog\" ng-click=\"addPolicy()\">Add Policy</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n    </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-role.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewRoleController\" id=\"form-page\" class=\"container apiman-entity-new page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-role\">New Role</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-role-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new Role Definition that may be used to grant specific sets of permissions to users within Organizations.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Choose role name -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"role-name\">Role Name</dt>\r\n          <dd>\r\n            <input id=\"apiman-entityname\" ng-model=\"role.name\" type=\"text\" class=\"form-control name entityname\" apiman-i18n-key=\"enter-role-name\" placeholder=\"Enter role name...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Description of role -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"description\">Description</dt>\r\n          <dd>\r\n            <input data-field=\"description\" ng-model=\"role.description\" type=\"text\" class=\"form-control description\" id=\"apiman-description\" apiman-i18n-key=\"enter-role-description\" placeholder=\"Enter role description (optional)...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Auto-grant this role -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"auto-grant\">Auto-Grant Role</dt>\r\n          <dd>\r\n             <div class=\"checkbox\">\r\n               <label>\r\n                 <input ng-model=\"role.autoGrant\" data-field=\"autoGrant\" type=\"checkbox\"></input> \r\n                 <span apiman-i18n-key=\"grant-role-automatically\">Grant this role automatically when creating a new Organization</span>\r\n               </label>\r\n             </div>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- Permissions -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"permissions\">Permissions</dt>\r\n          <dd>\r\n            <div class=\"container\">\r\n              <div class=\"row\" data-field=\"permissions\">\r\n                <div class=\"col-md-3\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'orgView\']\" data-field=\"orgView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.orgView\">Organization View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'orgEdit\']\" data-field=\"orgEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.orgEdit\">Organization Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'orgAdmin\']\" data-field=\"orgAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.orgAdmin\">Organization Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'planView\']\" data-field=\"planView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.planView\">Plan View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'planEdit\']\" data-field=\"planEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.planEdit\">Plan Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'planAdmin\']\" data-field=\"planAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.planAdmin\">Plan Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'svcView\']\" data-field=\"svcView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.svcView\">Service View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'svcEdit\']\" data-field=\"svcEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.svcEdit\">Service Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'svcAdmin\']\" data-field=\"svcAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.svcAdmin\">Service Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'appView\']\" data-field=\"appView\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.appView\">Application View</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'appEdit\']\" data-field=\"appEdit\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.appEdit\">Application Edit</span>\r\n                    </label>\r\n                  </div>\r\n                  <div class=\"checkbox\">\r\n                    <label>\r\n                      <input ng-model=\"rolePermissions[\'appAdmin\']\" data-field=\"appAdmin\" type=\"checkbox\"></input> <span apiman-i18n-key=\"permission.appAdmin\">Application Admin</span>\r\n                    </label>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!isValid\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-role\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"addRole()\">Create Role</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-service.html","    <!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewServiceController\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-service\">New Service</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-service-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new Service within the specified Organization, allowing Applications to begin consuming it.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Choose org and service name -->\r\n      <div ng-show=\"organizations.length > 0\">\r\n        <div class=\"row\">\r\n          <dl class=\"org\">\r\n            <dt apiman-i18n-key=\"organization\">Organization</dt>\r\n            <dd>\r\n              <div class=\"btn-group\" data-field=\"orgSelector\">\r\n                <button type=\"button\" id=\"selector-org\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\r\n                  <span data-field=\"selectorLabel\" id=\"selector-org-value\">{{selectedOrg.name}}</span> &nbsp;&nbsp;<span class=\"caret\"></span>\r\n                </button>\r\n                <ul class=\"dropdown-menu\" data-field=\"organizations\">\r\n                   <li ng-repeat=\"org in organizations\"><a href=\"#\" ng-click=\"setOrg( org )\">{{ org.name }}</a></li>\r\n                </ul>\r\n              </div>\r\n            </dd>\r\n          </dl>\r\n          <dl class=\"slash\">\r\n            <dt apiman-i18n-skip>&nbsp;</dt>\r\n            <dd>\r\n              <span class=\"divider\" apiman-i18n-skip>/</span>\r\n            </dd>\r\n          </dl>\r\n          <dl class=\"name\">\r\n            <dt apiman-i18n-key=\"service-name\">Service Name</dt>\r\n            <dd>\r\n              <input ng-model=\"service.name\" data-field=\"name\" type=\"text\" class=\"form-control entityname\" id=\"apiman-entityname\" apiman-i18n-key=\"enter-service-name\" placeholder=\"Enter service name...\"></input>\r\n            </dd>\r\n          </dl>\r\n        </div>\r\n        <!-- Initial Service Version -->\r\n        <div class=\"row\">\r\n          <dl>\r\n            <dt apiman-i18n-key=\"initial-version\">Initial Version</dt>\r\n            <dd>\r\n              <input ng-model=\"service.initialVersion\" data-field=\"version\" type=\"text\" class=\"form-control version\" id=\"apiman-version\" value=\"1.0\"></input>\r\n            </dd>\r\n          </dl>\r\n        </div>\r\n        <!-- Description of service -->\r\n        <div class=\"row\">\r\n          <dl>\r\n            <dt apiman-i18n-key=\"description\">Description</dt>\r\n            <dd>\r\n              <input ng-model=\"service.description\" data-field=\"description\" type=\"text\" class=\"form-control description\" id=\"apiman-description\" apiman-i18n-key=\"enter-service-description\" placeholder=\"Enter service description (optional)...\"></input>\r\n            </dd>\r\n          </dl>\r\n        </div>\r\n      </div>\r\n      <div ng-hide=\"organizations.length > 0\" class=\"apiman-no-content container-fluid\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12\">\r\n            <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"missing-create-service-permission\">You don\'t have permission to create a Service in any of your Organizations (or you aren\'t in any orgs)!  Please become a member of an existing Organization or create a new one before trying to create a Service.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!service.name || !service.initialVersion || !selectedOrg\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-service\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"saveNewService()\">Create Service</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/forms/new-serviceversion.html","    <!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div id=\"progress-indicator\" ng-class=\"{ \'loading\': isLoading, \'loaded\': isLoaded }\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.NewServiceVersionController\" class=\"container apiman-entity-new page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-service-version\">New Service Version</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-serviceversion-help-text\" class=\"col-md-6 apiman-label-faded\">Create a new version of this Service, allowing multiple different versions of the Service to be managed at the same time.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Service Version -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"version\">Version</dt>\r\n          <dd>\r\n            <input ng-model=\"svcversion.version\" data-field=\"version\" type=\"text\" class=\"form-control version\" id=\"apiman-version\" apiman-i18n-key=\"enter-service-version\" placeholder=\"Enter version...\"></input>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dd>\r\n            <input ng-model=\"svcversion.clone\" type=\"checkbox\" id=\"cloneCB\" data-field=\"cloneCB\"></input>\r\n            <label for=\"cloneCB\" apiman-i18n-key=\"make-clone\">Make a clone of the previously selected version (copy all policies and settings)</label>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button ng-disabled=\"!svcversion.version\" apiman-action-btn=\"\" class=\"btn btn-primary\" data-field=\"createButton\" apiman-i18n-key=\"create-version\" placeholder=\"Creating...\" data-icon=\"fa-cog\" ng-click=\"saveNewServiceVersion()\">Create Version</button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/apiman-user-card-back.html","<div class=\"apiman-card\" data-field=\"card\">\r\n  <div class=\"back active\">\r\n    <div class=\"title\">\r\n      <div class=\"explanation\" data-field=\"editExplanation\">Assign roles to {{member.userId}}</div>\r\n    </div>\r\n    <div class=\"body\">\r\n      <div class=\"card-edit-details\">\r\n        <div class=\"roles\">\r\n          <select class=\"selectpicker\" ng-model=\"updatedRoles\" apiman-i18n-key=\"select-member-role\" title=\"Select at least one role...\"\r\n                  apiman-select-picker=\"\" multiple ng-options=\"role.id as role.name for role in roles\"\r\n                  ng-select=\"member.roles\">\r\n          </select>\r\n        </div>\r\n        <div class=\"actions\">\r\n          <button class=\"btn btn-primary btn-xs btn-apply\" apiman-i18n-key=\"apply\" placeholder=\"Applying...\" data-icon=\"fa-cog\" ng-click=\"updateRoles(updatedRoles) && flipCard(front)\">Apply</button>\r\n\r\n          <button class=\"btn btn-default btn-xs btn-cancel\" ng-click=\"flipCard(front)\" apiman-i18n-key=\"cancel\">Cancel</button>\r\n\r\n          <button class=\"btn btn-danger btn-xs btn-revoke-all\" apiman-i18n-key=\"revoke-all\" placeholder=\"Revoking...\" ng-click=\"revokeAll()\" data-icon=\"fa-cog\">Revoke All</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/org/apiman-user-card-front.html","<!-- One card per member -->\r\n<div class=\"apiman-card\" data-field=\"card\">\r\n  <div class=\"front active\">\r\n    <div class=\"title\">\r\n      <div class=\"name\" data-field=\"fullName\" data-role=\"dummy\">{{member.userName}}</div>\r\n      <div class=\"name\" data-field=\"userId\" data-role=\"dummy\">({{member.userId}})</div>\r\n      <div class=\"actions\">\r\n        <a href=\"#\" data-field=\"editButton\" ng-click=\"flipCard(back)\" apiman-i18n-key=\"edit\">Edit</a>\r\n      </div>\r\n    </div>\r\n    <div class=\"body\">\r\n      <div class=\"card-icon\">\r\n        <i class=\"fa fa-user\"></i>\r\n      </div>\r\n      <div class=\"card-details\">\r\n        <div class=\"card-details-item\">\r\n          <div class=\"card-label\" apiman-i18n-key=\"email-label\">Email:</div>\r\n          <div class=\"card-value\"><a href=\"mailto:{{member.email}}\" data-field=\"email\">{{member.email}}</a></div>\r\n        </div>\r\n        <div class=\"card-details-item\">\r\n          <div class=\"card-label\" apiman-i18n-key=\"roles-label\">Role(s):</div>\r\n          <div class=\"card-value\" data-field=\"roles\">\r\n            {{ joinRoles(member.roles) }}\r\n          </div>\r\n        </div>\r\n        <div class=\"card-details-item\">\r\n          <i class=\"fa fa-clock-o\"></i>\r\n          <div class=\"apiman-label-faded card-value\" apiman-i18n-key=\"joined-on\">Joined on</div>\r\n          <div class=\"card-value\" data-field=\"joinedOn\" data-role=\"dummy\">{{ member.joinedOn | date:\'yyyy-MM-dd\' }}</div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/org/apiman-user-entry.html","<a href=\"#\" class=\"item\" ng-class=\"{selected: isSelectedUser == true}\" ng-click=\"selectThisUser()\">\r\n  <i class=\"fa fa-user fa-fw\"></i>\r\n  <span class=\"\">{{ user.fullName }}</span>\r\n  <span apiman-i18n-skip>(</span><span class=\"\">{{ user.username }}</span><span apiman-i18n-skip>)</span>\r\n</a>\r\n");
$templateCache.put("plugins/api-manager/html/org/org-activity.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.OrgActivityController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/org/org_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <div ng-include=\"\'plugins/api-manager/html/org/org_entity.include\'\"></div>\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <ul id=\"entitytabs\" class=\"nav nav-tabs\">\r\n              <li apiman-permission=\"planView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/plans\" data-field=\"toOrgPlans\" apiman-i18n-key=\"plans\">Plans</a></li>\r\n              <li apiman-permission=\"svcView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/services\" data-field=\"toOrgServices\" apiman-i18n-key=\"services\">Services</a></li>\r\n              <li apiman-permission=\"appView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/apps\" data-field=\"toOrgApps\" apiman-i18n-key=\"applications\">Applications</a></li>\r\n              <li><a href=\"{{ pluginName }}/orgs/{{org.id}}/members\" data-field=\"toOrgMembers\" apiman-i18n-key=\"members\">Members</a></li>\r\n              <li class=\"pull-right active\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/activity\" data-field=\"toOrgActivity\" apiman-i18n-key=\"activity\">Activity</a></li>\r\n            </ul>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Activity Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-activity\">\r\n                <!-- The org\'s activity stream -->\r\n                <apiman-activity model=\"auditEntries\" next=\"getNextPage\"/>\r\n              </div>\r\n              <!-- End Activity Tab Content -->\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n        \r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/org-apps.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.OrgAppsController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/org/org_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <div ng-include=\"\'plugins/api-manager/html/org/org_entity.include\'\"></div>\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <ul id=\"entitytabs\" class=\"nav nav-tabs\">\r\n              <li apiman-permission=\"planView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/plans\" data-field=\"toOrgPlans\" apiman-i18n-key=\"plans\">Plans</a></li>\r\n              <li apiman-permission=\"svcView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/services\" data-field=\"toOrgServices\" apiman-i18n-key=\"services\">Services</a></li>\r\n              <li apiman-permission=\"appView\" class=\"active\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/apps\" data-field=\"toOrgApps\" apiman-i18n-key=\"applications\">Applications</a></li>\r\n              <li><a href=\"{{ pluginName }}/orgs/{{org.id}}/members\" data-field=\"toOrgMembers\" apiman-i18n-key=\"members\">Members</a></li>\r\n              <li class=\"pull-right\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/activity\" data-field=\"toOrgActivity\" apiman-i18n-key=\"activity\">Activity</a></li>\r\n            </ul>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Applications Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-apps\">\r\n                <div class=\"apiman-filters apiman-applications-filters\">\r\n                  <div>\r\n                    <apiman-search-box apiman-i18n-key=\"filter-org-apps\" function=\"filterApps\" placeholder=\"Filter by application name...\" />\r\n                  </div>\r\n                  <a apiman-permission=\"appEdit\" data-field=\"toNewApp\" href=\"{{ pluginName }}/new-app\" class=\"btn btn-primary pull-right\" apiman-i18n-key=\"new-app\">New App</a>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The list of applications in the org -->\r\n                <div class=\"apiman-applications\" data-field=\"applications\">\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"apps.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-9\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-apps-found-for-org\">It looks like there aren\'t (yet) any applications in this organization! Now might be a good time to click the New App button up above...</p>\r\n                      </div>\r\n                      <div class=\"col-md-3\">\r\n                        <div class=\"apiman-no-entities-arrow\"></div>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"apps.length > 0 && filteredApps.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-apps-found-for-filter\">No applications found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"app in filteredApps\">\r\n                    <div class=\"row\">\r\n                      <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/apps/{{app.id}}\">{{ app.name }}</a></span>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <span class=\"description\">{{ app.description }}\r\n                      </span>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- End Applications Tab Content -->\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/org-manage-members.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n  <meta charset=\"utf-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n</head>\r\n\r\n<body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.OrgManageMembersController as membersCtrl\" class=\"container page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/org/org-manage-members_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <div class=\"apiman-filters apiman-members-filters\">\r\n            <div>\r\n              <!-- Search for Members by name -->\r\n              <apiman-search-box apiman-i18n-key=\"filter-members\" function=\"filterMembers\" placeholder=\"Filter by member name or id...\"></api-manager-search-box>\r\n            </div>\r\n            <select apiman-i18n-key=\"manage-members.filter-by-roles\" title=\"Filter by role(s)...\" ng-options=\"role.id as role.name for role in roles\" ng-model=\"selectedRoles\" class=\"selectpicker\" apiman-select-picker=\"\" multiple ng-change=\"filterMembers(filterValue)\">\r\n            </select>\r\n            <a href=\"{{ pluginName }}/orgs/{{ organizationId }}/new-member\" class=\"btn btn-primary pull-right\" apiman-i18n-key=\"add-member\">Add Member</a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- Member list (cards) -->\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 apiman-manage-members\">\r\n          <div class=\"container-fluid apiman-cards\" data-field=\"cards\">\r\n            <div ng-repeat=\"member in filteredMembers\">\r\n              <apiman-user-card member=\"member\" roles=\"roles\" org-id=\"{{ organizationId }}\"></api-manager-user-card>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</body>\r\n\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/org-members.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.OrgMembersController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/org/org_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <div ng-include=\"\'plugins/api-manager/html/org/org_entity.include\'\"></div>\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <ul id=\"entitytabs\" class=\"nav nav-tabs\">\r\n              <li apiman-permission=\"planView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/plans\" data-field=\"toOrgPlans\" apiman-i18n-key=\"plans\">Plans</a></li>\r\n              <li apiman-permission=\"svcView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/services\" data-field=\"toOrgServices\" apiman-i18n-key=\"services\">Services</a></li>\r\n              <li apiman-permission=\"appView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/apps\" data-field=\"toOrgApps\" apiman-i18n-key=\"applications\">Applications</a></li>\r\n              <li class=\"active\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/members\" data-field=\"toOrgMembers\" apiman-i18n-key=\"members\">Members</a></li>\r\n              <li class=\"pull-right\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/activity\" data-field=\"toOrgActivity\" apiman-i18n-key=\"activity\">Activity</a></li>\r\n            </ul>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Members Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-members\">\r\n                <div class=\"apiman-filters apiman-members-filters\">\r\n                  <div>\r\n                    <apiman-search-box apiman-i18n-key=\"filter-members\" function=\"filterMembers\" apiman-i18n-key=\"org-members.filter-by-member-name\" placeholder=\"Filter by member name...\" />\r\n                  </div>\r\n                  <a apiman-permission=\"orgAdmin\" href=\"{{ pluginName }}/orgs/{{org.id}}/manage-members\" class=\"btn btn-default pull-right\" data-field=\"toManageMembers\" apiman-i18n-key=\"manage-members\">Manage Members</a>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The organization\'s list of members -->\r\n                <div class=\"apiman-members\" data-field=\"members\">\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"members.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-members-found-for-org\">This is very strange, but apparently this Organization has no members!  Highly irregular!</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"members.length > 0 && filteredMembers.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-members-found-for-filter\">No members found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"member in filteredMembers\">\r\n                    <div class=\"row\">\r\n                      <span class=\"title\">\r\n                        <a href=\"{{ pluginName }}/users/{{ member.userId }}/orgs\">{{ member.userName }}</a>\r\n                        <span class=\"secondary\">({{ member.userId}})</span>\r\n                      </span>\r\n                      <a class=\"apiman-summaryrow-icon\">\r\n                        <i class=\"fa fa-clock-o fa-fw\"></i>\r\n                        <span apiman-i18n-key=\"joined-on\" class=\"title-summary-item\">Joined on</span>\r\n                        <span class=\"title-summary-item\">{{ member.joinedOn | date:\'yyyy-MM-dd\' }}</span>\r\n                      </a>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <span class=\"description\" ng-repeat=\"role in member.roles\">\r\n                        {{ role.roleName}} {{ $last ? \'\' : ($index==member.roles.length-2) ? \' and \' : \', \' }}\r\n                      </span>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- End Members Tab Content -->\r\n\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/org-new-member.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    <script type=\"text/javascript\" src=\"site.js\"></script>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div id=\"form-page\" class=\"container apiman-entity-new page\" ng-controller=\"Apiman.OrgNewMemberController as onmCtrl\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div class=\"row\">\r\n        <h2 class=\"title\" apiman-i18n-key=\"new-member\">New Member</h2>\r\n      </div>\r\n      <!-- Helpful hint -->\r\n      <div class=\"row\">\r\n        <p apiman-i18n-key=\"new-member-help-text\" class=\"col-md-6 apiman-label-faded\">Add a member to this organization by searching for a User below.  Once the User is located, simply select their roles and click \'Add Member\'.</p>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- User search bar -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"find-user\">Find a User</dt>\r\n          <dd>\r\n            <div class=\"\" style=\"line-height: normal\">\r\n              <form ng-submit=\"findUsers(searchText)\">\r\n                <input ng-model=\"searchText\" type=\"text\" class=\"form-control input-search\" apiman-i18n-key=\"new-member.search-by-user\" placeholder=\"Search by user name...\"></input>\r\n                <button type=\"submit\" apiman-action-btn=\"\" class=\"btn btn-default btn-search\" data-field=\"searchButton\" apiman-i18n-key=\"search\" data-icon=\"fa-cog\" placeholder=\"Searching\">Search</button>\r\n              </form>\r\n            </div>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- User search results -->\r\n      <div class=\"row\">\r\n        <div class=\"panel panel-default input-search-results\">\r\n          <div class=\"panel-body container-fluid\">\r\n            <div ng-hide=\"searchBoxValue.length > 0\" apiman-i18n-key=\"new-member.search-for-users\">(Search for users above)</div>\r\n            <div ng-show=\"searchBoxValue.length > 0 && queriedUsers.length == 0\" apiman-i18n-key=\"new-member.no-users-found\">(No users found)</div>\r\n            <apiman-user-entry user=\"user\" selected-users=\"selectedUsers\" ng-repeat=\"user in queriedUsers\"></apiman-user-entry>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- Role selections -->\r\n      <div class=\"row\">\r\n        <dl>\r\n          <dt apiman-i18n-key=\"roles\">Role(s)</dt>\r\n          <dd>\r\n            <div>\r\n              <select apiman-i18n-key=\"new-member.select-roles\" title=\"Select role(s)...\" ng-options=\"role.id as role.name for role in roles\"\r\n                ng-model=\"selectedRoles\" class=\"selectpicker\" apiman-select-picker=\"\"\r\n                multiple>\r\n              </select>\r\n            </div>\r\n          </dd>\r\n        </dl>\r\n      </div>\r\n      <!-- HR -->\r\n      <div class=\"row hr-row\">\r\n        <hr/>\r\n      </div>\r\n      <!-- Create Button -->\r\n      <div class=\"row\">\r\n        <button class=\"btn btn-primary\" apiman-i18n-key=\"add-members\" data-icon=\"fa-cog\" placeholder=\"Adding...\"\r\n                ng-click=\"addMembers()\" data-field=\"addMembersButton\" apiman-action-btn\r\n                ng-disabled=\"selectedRoles.length === 0 || countObjectKeys(selectedUsers) === 0\">\r\n          Add Member(s)\r\n        </button>\r\n        <a href=\"javascript:window.history.back()\" class=\"btn btn-default btn-cancel\" apiman-i18n-key=\"cancel\">Cancel</a>\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/org-plans.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.OrgPlansController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/org/org_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <div ng-include=\"\'plugins/api-manager/html/org/org_entity.include\'\"></div>\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <ul id=\"entitytabs\" class=\"nav nav-tabs\">\r\n              <li apiman-permission=\"planView\" class=\"active\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/plans\" data-field=\"toOrgPlans\" apiman-i18n-key=\"plans\">Plans</a></li>\r\n              <li apiman-permission=\"svcView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/services\" data-field=\"toOrgServices\" apiman-i18n-key=\"services\">Services</a></li>\r\n              <li apiman-permission=\"appView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/apps\" data-field=\"toOrgApps\" apiman-i18n-key=\"applications\">Applications</a></li>\r\n              <li><a href=\"{{ pluginName }}/orgs/{{org.id}}/members\" data-field=\"toOrgMembers\" apiman-i18n-key=\"members\">Members</a></li>\r\n              <li class=\"pull-right\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/activity\" data-field=\"toOrgActivity\" apiman-i18n-key=\"activity\">Activity</a></li>\r\n            </ul>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Plans Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-plans\">\r\n                <div class=\"apiman-filters apiman-plans-filters\">\r\n                  <div>\r\n                    <apiman-search-box apiman-i18n-key=\"filter-org-plans\" function=\"filterPlans\" placeholder=\"Filter by plan name...\" />\r\n                  </div>\r\n                  <a apiman-permission=\"planEdit\" data-field=\"toNewPlan\" apiman-i18n-key=\"new-plan\" href=\"{{ pluginName }}/new-plan\" class=\"btn btn-primary pull-right\">New Plan</a>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The list of plans in this organization -->\r\n                <div class=\"apiman-plans\" data-field=\"plans\">\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"plans.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-9\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-plans-found-for-org\">There aren\'t any plans configured for this organization. That means all published services in this organization must be public.</p>\r\n                      </div>\r\n                      <div class=\"col-md-3\">\r\n                        <div class=\"apiman-no-entities-arrow\"></div>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"plans.length > 0 && filteredPlans.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-plans-found-for-filter\">No plans found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"plan in filteredPlans\">\r\n                    <div class=\"row\">\r\n                      <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{ org.id }}/plans/{{ plan.id}}\">{{ plan.name }}</a></span>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <span class=\"description\">{{ plan.description }}\r\n                      </span>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- End Plans Tab Content -->\r\n\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n        \r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/org-services.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.OrgServicesController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/org/org_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <div ng-include=\"\'plugins/api-manager/html/org/org_entity.include\'\"></div>\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <ul id=\"entitytabs\" class=\"nav nav-tabs\">\r\n              <li apiman-permission=\"planView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/plans\" data-field=\"toOrgPlans\" apiman-i18n-key=\"plans\">Plans</a></li>\r\n              <li apiman-permission=\"svcView\" class=\"active\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/services\" data-field=\"toOrgServices\" apiman-i18n-key=\"services\">Services</a></li>\r\n              <li apiman-permission=\"appView\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/apps\" data-field=\"toOrgApps\" apiman-i18n-key=\"applications\">Applications</a></li>\r\n              <li><a href=\"{{ pluginName }}/orgs/{{org.id}}/members\" data-field=\"toOrgMembers\" apiman-i18n-key=\"members\">Members</a></li>\r\n              <li class=\"pull-right\"><a href=\"{{ pluginName }}/orgs/{{org.id}}/activity\" data-field=\"toOrgActivity\" apiman-i18n-key=\"activity\">Activity</a></li>\r\n            </ul>\r\n\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Services Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-services\">\r\n                <div class=\"apiman-filters apiman-services-filters\">\r\n                  <div>\r\n                    <apiman-search-box apiman-i18n-key=\"filter-org-services\" function=\"filterServices\" placeholder=\"Filter by service name...\" />\r\n                  </div>\r\n                  <div apiman-permission=\"svcEdit\" class=\"btn-group pull-right\">\r\n                    <a data-field=\"toNewService\" href=\"{{ pluginName }}/new-service\" class=\"btn btn-primary\" apiman-i18n-key=\"new-service\">New Service</a>\r\n<!--                     <button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\"> -->\r\n<!--                       <span class=\"caret\"></span> -->\r\n<!--                       <span class=\"sr-only\" apiman-i18n-key=\"toggle-dropdown\">Toggle Dropdown</span> -->\r\n<!--                     </button> -->\r\n<!--                     <ul class=\"dropdown-menu\" role=\"menu\"> -->\r\n<!--                       <li><a href=\"import-services.html\" disabled=\"disabled\" data-field=\"toImportServices\" apiman-i18n-key=\"import-services\">Import Service(s)</a></li> -->\r\n<!--                     </ul> -->\r\n                  </div>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The list of services the user has access to -->\r\n                <div class=\"apiman-services\" data-field=\"services\">\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"services.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-9\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-services-found-for-org\">We couldn\'t find any services in this organization. Probably because none exist. We hope. Try creating one using the New Service button.</p>\r\n                      </div>\r\n                      <div class=\"col-md-3\">\r\n                        <div class=\"apiman-no-entities-arrow\"></div>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"services.length > 0 && filteredServices.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-services-found-for-filter\">No services found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"service in filteredServices\">\r\n                    <div class=\"row\">\r\n                      <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{ service.organizationId }}/services/{{ service.id }}\">{{ service.name }}</a></span>\r\n                      <a class=\"apiman-summaryrow-icon\">\r\n                        <i class=\"fa fa-clock-o fa-fw\"></i>\r\n                        <span class=\"title-summary-item\" apiman-i18n-key=\"created-on\">Created on</span>\r\n                        <span class=\"title-summary-item\">{{ service.createdOn | date:\'yyyy-MM-dd\' }}</span>\r\n                      </a>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <span class=\"description\">{{ service.description }}\r\n                      </span>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- End Services Tab Content -->\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/org/org.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.OrgRedirectController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/plan/plan-activity.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.PlanActivityController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/plan/plan_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/plan/plan_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/plan/plan_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\" >\r\n          <!-- Title and help text -->\r\n          <div class=\"title\" apiman-i18n-key=\"plan-activity\">Plan Activity</div>\r\n          <div class=\"description\" apiman-i18n-key=\"plan-activity-help\">The list below is all of the activity (configuration changes made by apiman users) associated with this Plan.</div>\r\n          <hr />\r\n          <apiman-activity model=\"auditEntries\" next=\"getNextPage\"/>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/plan/plan-overview.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.PlanOverviewController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/plan/plan_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/plan/plan_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/plan/plan_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\" >\r\n          <!-- Content Summary -->\r\n          <div class=\"col-md-12\">\r\n            <h1 apiman-i18n-key=\"plan-details\">Plan Details</h1>\r\n            <p apiman-i18n-key=\"plan-overview.plan-description\">\r\n              This is the plan details page.  Use this page to modify the Plan\'s meta-data and policies.\r\n              Once you have fully configured the Plan, don\'t forget to \"Lock\" it so that it can be used\r\n              by Services in the org.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"policies\">Policies</h2>\r\n            <p apiman-i18n-key=\"plan-overview.policies-description\">\r\n              The \'Policies\' tab allows you to manage the Policy-level policies that should\r\n              be applied whenever a request is made to a Service via this Plan.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"activity\">Activity</h2>\r\n            <p apiman-i18n-key=\"plan-overview.activity-description\">\r\n              The \'Activity\' tab shows a history of all the changes made to the Plan.  Essentially\r\n              it is an audit log.\r\n            </p>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/plan/plan-policies.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.PlanPoliciesController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/plan/plan_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/plan/plan_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/plan/plan_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\" >\r\n          <div class=\"col-md-9\">\r\n            <!-- Title and help text -->\r\n            <div class=\"title\" apiman-i18n-key=\"plan-policies\">Plan Policies</div>\r\n            <div class=\"description\" apiman-i18n-key=\"plan-policies-help\">Here is a list of all Policies defined for this Plan.  These Policies will be applied to all Service invocations made by Applications using this Plan in a Contract (in addition to whatever Policies are defined individually by the Application and/or Service).</div>\r\n            <hr />\r\n            <!-- The list of policies -->\r\n            <div apiman-permission=\"planEdit\" apiman-status=\"Created,Ready\" class=\"apiman-filters apiman-policies-filters\">\r\n              <a apiman-i18n-key=\"add-policy\" href=\"{{ pluginName }}/orgs/{{ org.id }}/plans/{{ plan.id }}/{{ version.version }}/new-policy\" class=\"btn btn-primary pull-right\">Add Policy</a>\r\n            </div>\r\n            <div class=\"clearfix\"></div>\r\n            <div class=\"apiman-policies\" data-field=\"policies\">\r\n\r\n              <div class=\"apiman-no-content container-fluid\" ng-hide=\"policies.length > 0\">\r\n                <div class=\"row\">\r\n                  <div class=\"col-md-9\">\r\n                    <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-policies-for-plan\">It looks like there aren\'t any policies defined! That may be exactly what you want (of course) but if not, you may try defining one using the Add Policy button above...</p>\r\n                  </div>\r\n                  <div apiman-permission=\"planEdit\" apiman-status=\"Created,Ready\" class=\"col-md-3\">\r\n                    <div class=\"apiman-no-entities-arrow\"></div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"clearfix\"></div>\r\n              <apiman-policy-list ng-model=\"policies\" remove-function=\"removePolicy\" type=\"plans\" org-id=\"{{ org.id }}\" page-id=\"{{ plan.id }}\" version=\"{{ version.version }}\"></policy-list>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/plan/plan.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.PlanRedirectController\" class=\"container page\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service-activity.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServiceActivityController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/service/service_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content\">\r\n          <!-- Title and help text -->\r\n          <div class=\"title\" apiman-i18n-key=\"service-activity\">Service Activity</div>\r\n          <div class=\"description\" apiman-i18n-key=\"service-activity-help\">The list below is all of the activity (configuration changes made by apiman users) associated with this Service.</div>\r\n          <hr />\r\n          <apiman-activity model=\"auditEntries\" next=\"getNextPage\"/> \r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service-contracts.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServiceContractsController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/service/service_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content\">\r\n          <div class=\"col-md-9\">\r\n            <div class=\"title\" apiman-i18n-key=\"service-contracts\">Service Contracts</div>\r\n            <div class=\"description\" apiman-i18n-key=\"service-contracts-help\">Here is a list of all contracts between all Applications and this Service.  This provides a list of all Applications that may potentially consume this Service.</div>\r\n          </div>\r\n          <div class=\"col-md-12\" ng-show=\"isPublicOnly\">\r\n            <div aria-hidden=\"false\" style=\"background-color: rgb(255, 213, 185);\" apiman-i18n-key=\"warning-public-only\" data-field=\"onlyPublicWarning\" class=\"alert alert-warning\">Warning: this service is exclusively public, which means that it is impossible for Applications to create Service Contracts with it.</div>\r\n          </div>\r\n          <div class=\"col-md-12\">\r\n            <div class=\"table-responsive\">\r\n              <table class=\"table table-striped table-bordered table-hover\" data-field=\"contracts\">\r\n                <thead>\r\n                  <tr>\r\n                    <th width=\"70%\" apiman-i18n-key=\"application\" nowrap=\"nowrap\">Application</th>\r\n                    <th apiman-i18n-key=\"plan\" nowrap=\"nowrap\">Plan</th>\r\n                    <th apiman-i18n-key=\"created-on_capitalized\" nowrap=\"nowrap\">Created On</th>\r\n                  </tr>\r\n                </thead>\r\n                <tbody>\r\n\r\n                  <tr ng-hide=\"contracts.length > 0\">\r\n                    <td colspan=\"4\">\r\n                      <div class=\"apiman-no-content container-fluid\">\r\n                        <div class=\"row\">\r\n                          <div class=\"col-md-12\">\r\n                            <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-service-contracts\">This service doesn\'t appear to have any contracts. This means that there aren\'t any applications consuming this service.  Note: if this is a public service, then no contracts are necessary to invoke the service!</p>\r\n                          </div>\r\n                        </div>\r\n                      </div>\r\n                    </td>\r\n                  </tr>\r\n\r\n                  <tr ng-repeat=\"contract in contracts\">\r\n                    <td>\r\n                      <span>\r\n                        <a href=\"{{ pluginName }}/browse/orgs/{{ contract.appOrganizationId }}\"><span>{{ contract.appOrganizationName }}</span></a>\r\n                        <span apiman-i18n-skip>/</span>\r\n                        <span class=\"emphasis\">{{ contract.appName }}</span>\r\n                        <span apiman-i18n-skip>&#8680;</span>\r\n                        <span>{{ contract.appVersion }}</span>\r\n                      </span>\r\n                    </td>\r\n                    <td><span>{{ contract.planName }}</span></td>\r\n                    <td><span>{{ contract.createdOn | date:\'yyyy-MM-dd\' }}</span></td>\r\n                  </tr>\r\n                </tbody>\r\n              </table>\r\n            </div>\r\n            <div style=\"text-align: center\" ng-hide=\"contracts.length == 0\">\r\n              <button ng-show=\"hasMore\" ng-click=\"getNextPage()\" class=\"btn btn-default\" data-field=\"moreButton\" apiman-i18n-key=\"show-more-contracts\" placeholder=\"Loading...\" data-icon=\"fa-cog\">Show More Contracts</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service-endpoint.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServiceEndpointController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/service/service_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\">\r\n          <!-- Content Summary -->\r\n          <div class=\"col-md-12\">\r\n            <div class=\"title\" apiman-i18n-key=\"managed-endpoint-impl\">Managed Endpoint Information</div>\r\n            <p class=\"explanation\" apiman-i18n-key=\"managed-endpoint-explanation\">\r\n                To successfully invoke this managed service, a client must send the request \r\n                to the appropriate API Gateway endpoint.  When invoking the Service through\r\n                a Service Contract, a valid API Key must be included in each request.  If \r\n                the Service is public, it can be invoked directly (without an API Key) through\r\n                the endpoint below.\r\n            </p>\r\n            <div ng-show=\"!version.publicService\">\r\n              <div class=\"apiman-divider-40\"></div>\r\n              <div apiman-i18n-key=\"warning-not-public\" class=\"alert alert-warning\">Warning: this Service is not public - this endpoint will only work if a valid Service Contract API key is included in requests made to it.</div>\r\n            </div>\r\n            <hr />\r\n            <div class=\"form-label\" apiman-i18n-key=\"managed-endpoint\">Managed Endpoint</div>\r\n            <textarea readonly=\"readonly\" class=\"apiman-endpoint\" style=\"width:100%\" data-field=\"mangedEndpoint\">{{ managedEndpoint.managedEndpoint }}</textarea>\r\n          </div>\r\n          <!-- /Content Summary -->\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service-impl.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServiceImplController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/service/service_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content\">\r\n          <div class=\"col-md-8\">\r\n            <div class=\"title\" apiman-i18n-key=\"service-impl\">Service Implementation</div>\r\n            <div class=\"apiman-label-faded\">\r\n              <p apiman-i18n-key=\"service-impl-explanation\">\r\n                Please provide us with details about the back-end service implementation\r\n                so that the API Gateway can successfully proxy Service requests.\r\n              </p>\r\n            </div>\r\n            <div>\r\n              <span apiman-i18n-key=\"api-endpoint-label\">API Endpoint:</span>\r\n              <input ng-model=\"updatedService.endpoint\" data-field=\"endpoint\" class=\"form-control\" type=\"text\"></input>\r\n            </div>\r\n            <div class=\"apiman-divider-20\">\r\n              <span class=\"clearfix\" apiman-i18n-key=\"api-type-label\">API Type:</span>\r\n              <select apiman-i18n-key=\"service-impl.choose-type\" title=\"Choose a type...\" apiman-select-picker=\"\" ng-model=\"updatedService.endpointType\" class=\"selectpicker\" ng-options=\"type.toUpperCase() for type in typeOptions\">\r\n              </select>\r\n            </div>\r\n            <div id=\"gateway-info\" ng-show=\"gateways.length > 1\">\r\n              <div class=\"title\" apiman-i18n-key=\"gateway\">Gateway</div>\r\n              <div class=\"apiman-label-faded\">\r\n                <p apiman-i18n-key=\"service-impl-gateway-explanation\">\r\n                  There are multiple API Gateways configured - you\'ll need to tell us which one you\r\n                  want to use for this service.\r\n                </p>\r\n              </div>\r\n              <div>\r\n                <span class=\"clearfix\" apiman-i18n-key=\"publish-to\">Publish To:</span>\r\n                <select ng-model=\"selectedGateway\" apiman-select-picker=\"\" class=\"selectpicker\" ng-options=\"gateway.name for gateway in gateways | orderBy: name\">\r\n                </select>\r\n              </div>\r\n            </div>\r\n            <div apiman-permission=\"svcEdit\" apiman-status=\"Created,Ready\" class=\"actions\" style=\"margin-top: 20px\">\r\n              <button ng-disabled=\"!isDirty\" apiman-action-btn=\"\" ng-click=\"saveService()\" class=\"btn btn-primary\" data-field=\"saveButton\" apiman-i18n-key=\"save\" placeholder=\"Saving...\" data-icon=\"fa-cog\" >Save</button>\r\n              <button ng-disabled=\"!isDirty\" ng-click=\"reset()\" class=\"btn btn-default\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service-overview.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServiceOverviewController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/service/service_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content apiman-entity-overview\">\r\n          <!-- Content Summary -->\r\n          <div class=\"col-md-12\">\r\n            <h1 apiman-i18n-key=\"service-details\">Service Details</h1>\r\n            <p apiman-i18n-key=\"service-overview.service-description\">\r\n              This is the service details page.  Use this page to modify the meta-data, plans, and \r\n              policies for the service.  There is no need to follow the tabs in order, but note that\r\n              you will need to fill out a minimum amount of data before the service can be published\r\n              to the Gateway.  In particular, the Implementation and Plans tabs are important (more\r\n              information below).\r\n            </p>\r\n            \r\n            <h2 apiman-i18n-key=\"impl\">Implementation</h2>\r\n            <p apiman-i18n-key=\"service-overview.impl-description\">\r\n              The \'Implementation\' tab is where you go to configure the details of the real service\r\n              being managed.  This is where you tell apiman where the service is, so that we can \r\n              actually invoke it at runtime.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"plans\">Plans</h2>\r\n            <p apiman-i18n-key=\"service-overview.plans-description\">\r\n              The \'Plans\' tab is used to configure which Plans (already defined in the Organization)\r\n              are available when an Application wishes to create a Service Contract with this \r\n              Service.  Optionally, a Service can also be marked as \"Public\", which means that no\r\n              Service Contract is required (the Service can be invoked without sending an API Key).\r\n            </p>\r\n            \r\n            <h2 apiman-i18n-key=\"policies\">Policies</h2>\r\n            <p apiman-i18n-key=\"service-overview.policies-description\">\r\n              The \'Policies\' tab is where you go if you wish to configure any policies that should\r\n              be enforced for *all* requests to the Service, regardless of which user, application,\r\n              or plan is being used.  In other words, Service-level policies.\r\n            </p>\r\n            \r\n            <h2 apiman-i18n-key=\"contracts\">Contracts</h2>\r\n            <p apiman-i18n-key=\"service-overview.contracts-description\">\r\n              The \'Contracts\' tab will show a table of all Applications that have created Service\r\n              Contracts to this Service.  In other words, it shows all of the registered \r\n              consumers of the Service.  Note that if the Service is marked as \"Public\", this tab\r\n              will likely be empty.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"endpoint\">Endpoint</h2>\r\n            <p apiman-i18n-key=\"service-overview.endpoint-description\">\r\n              The \'Endpoint\' tab will show you information about how to invoke the Service once\r\n              it is published to the API Gateway.\r\n            </p>\r\n\r\n            <h2 apiman-i18n-key=\"activity\">Activity</h2>\r\n            <p apiman-i18n-key=\"service-overview.activity-description\">\r\n              The \'Activity\' tab shows a history of all the changes made to the Service.  Essentially\r\n              it is an audit log.\r\n            </p>\r\n            \r\n          </div>\r\n          <!-- /Content Summary -->\r\n          \r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service-plans.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServicePlansController\" id=\"page-content\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/service/service_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content\">\r\n          <div class=\"col-md-10\">\r\n            <div class=\"title\" apiman-i18n-key=\"public-service\">Public Service</div>\r\n            <div>\r\n              <span apiman-i18n-key=\"public-service-help\">Select this option if you wish this service to be accessible directly, without a Service Contract.  Typically (but not always) this option is used instead of selecting plan(s).</span>\r\n            </div>\r\n            <div style=\"padding: 8px; margin-bottom: 10px\">\r\n              <input ng-model=\"updatedService.publicService\" type=\"checkbox\" id=\"public-service\" data-field=\"publicService\"></input>\r\n              <label for=\"public-service\" apiman-i18n-key=\"make-service-public\" style=\"padding-left: 3px\">Make this service public</label>\r\n            </div>\r\n            <div class=\"title\" apiman-i18n-key=\"available-plans\">Available Plans</div>\r\n            <div>\r\n              <span apiman-i18n-key=\"available-plans-help\">Choose which plans should be presented when Applications create a link (Contract) to this Service. Note that only plans in a \'Locked\' state show up in this list.</span>\r\n            </div>\r\n            <!-- The plans to choose from -->\r\n            <div class=\"apiman-plan-selector apiman-divider-40\">\r\n              <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"plan in plans\">\r\n                <div class=\"row\">\r\n                  <input ng-model=\"plan.checked\" data-field=\"checkbox\" type=\"checkbox\"></input>\r\n                  <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{ plan.organizationId }}/plans/{{ plan.id }}\" data-field=\"name\" title=\"{{ plan.description }}\">{{ plan.name }}</a></span>\r\n                  <select apiman-select-picker=\"\" ng-model=\"plan.selectedVersion\" ng-options=\"version for version in plan.lockedVersions\" class=\"selectpicker pull-right\">\r\n                  </select>\r\n                </div>\r\n                <hr>\r\n              </div>\r\n            </div>\r\n            \r\n            <div apiman-permission=\"svcEdit\" apiman-status=\"Created,Ready\" class=\"actions\">\r\n              <button ng-disabled=\"!isDirty\" apiman-action-btn=\"\" ng-click=\"saveService()\" class=\"btn btn-primary\" data-field=\"saveButton\" apiman-i18n-key=\"save\" placeholder=\"Saving...\" data-icon=\"fa-cog\">Save</button>\r\n              <button ng-disabled=\"!isDirty\" class=\"btn btn-default\" ng-click=\"reset()\" data-field=\"cancelButton\" apiman-i18n-key=\"cancel\">Cancel</button>\r\n            </div>\r\n            \r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service-policies.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServicePoliciesController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_bc.include\'\"></div>\r\n      <!-- Entity Summary Row -->\r\n      <div ng-include=\"\'plugins/api-manager/html/service/service_entity.include\'\"></div>\r\n\r\n      <!-- Navigation + Content Row -->\r\n      <div class=\"row\">\r\n        <!-- Left hand nav -->\r\n        <div ng-include=\"\'plugins/api-manager/html/service/service_tabs.include\'\"></div>\r\n        <!-- /Left hand nav -->\r\n\r\n        <!-- Content -->\r\n        <div class=\"col-md-10 apiman-entity-content\">\r\n          <div class=\"col-md-9\">\r\n            <!-- Title and help text -->\r\n            <div class=\"title\" apiman-i18n-key=\"service-policies\">Service Policies</div>\r\n            <div class=\"description\" apiman-i18n-key=\"service-policies-help\">Here is a list of all Policies defined for this Service.  These Policies will be applied to all invocations of this Service by any Application, regardless of the Plan used in its Contract.</div>\r\n            <hr />\r\n            <!-- The list of policies -->\r\n            <div apiman-permission=\"svcEdit\" apiman-status=\"Created,Ready\" class=\"apiman-filters apiman-policies-filters\">\r\n              <a apiman-i18n-key=\"add-policy\" href=\"{{ pluginName }}/orgs/{{ org.id }}/services/{{ service.id }}/{{ version.version }}/new-policy\" class=\"btn btn-primary pull-right\">Add Policy</a>\r\n            </div>\r\n            <div class=\"clearfix\"></div>\r\n            <div class=\"apiman-policies\" data-field=\"policies\">\r\n\r\n              <div class=\"apiman-no-content container-fluid\" ng-hide=\"policies.length > 0\">\r\n                <div class=\"row\">\r\n                  <div class=\"col-md-9\">\r\n                    <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-policies-for-service\">It looks like there aren\'t any policies defined! That may be exactly what you want (of course) but if not, you may try defining one using the Add Policy button above...</p>\r\n                  </div>\r\n                  <div apiman-permission=\"svcEdit\" apiman-status=\"Created,Ready\" class=\"col-md-3\">\r\n                    <div class=\"apiman-no-entities-arrow\"></div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"clearfix\"></div>\r\n              <apiman-policy-list ng-model=\"policies\" remove-function=\"removePolicy\" type=\"services\" org-id=\"{{ org.id }}\" page-id=\"{{ service.id }}\" version=\"{{ version.version }}\"></policy-list>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Content -->\r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/service/service.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.ServiceRedirectController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/user/user-activity.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.UserActivityController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/user/user_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <!-- Left Hand Side -->\r\n        <div ng-include=\"\'plugins/api-manager/html/user/user_entity.include\'\"></div>\r\n        <!-- /Left Hand Side -->\r\n\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <div ng-include=\"\'plugins/api-manager/html/user/user_tabs.include\'\"></div>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Activity Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-activity\">\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The user\'s activity stream -->\r\n                <apiman-activity model=\"auditEntries\" next=\"getNextPage\"/>\r\n              </div>\r\n              <!-- End Activity Tab Content -->\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n        \r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/user/user-apps.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>   \r\n    <div ng-controller=\"Apiman.UserAppsController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/user/user_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <!-- Left Hand Side -->\r\n        <div ng-include=\"\'plugins/api-manager/html/user/user_entity.include\'\"></div>\r\n        <!-- /Left Hand Side -->\r\n\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <div ng-include=\"\'plugins/api-manager/html/user/user_tabs.include\'\"></div>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Applications Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-apps\">\r\n                <div class=\"apiman-filters apiman-applications-filters\">\r\n                  <div>\r\n                    <apiman-search-box apiman-i18n-key=\"filter-user-apps\" function=\"filterApps\" placeholder=\"Filter by org or app name...\" />\r\n                  </div>\r\n                  <a apiman-i18n-key=\"new-app\" data-field=\"toNewApp\" href=\"{{ pluginName }}/new-app\" class=\"btn btn-primary pull-right\">New App</a>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The list of applications the user has access to -->\r\n                <div class=\"apiman-applications\" data-field=\"applications\">\r\n                  \r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"applications.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-9\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-apps-found-for-user\">User is not managing any applications. Perhaps that\'s just not her thing. But if it is, she can create a new Application using the New App button above.</p>\r\n                      </div>\r\n                      <div class=\"col-md-3\">\r\n                        <div class=\"apiman-no-entities-arrow\"></div>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"applications.length > 0 && filteredApps.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-apps-found-for-filter\">No applications found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"app in filteredApps\">\r\n                    <div class=\"row\">\r\n                      <a href=\"{{ pluginName}}/orgs/{{ app.organizationId }}/apps\">{{ app.organizationName }}</a>\r\n                      <span apiman-i18n-skip>/</span>\r\n                      <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{ app.organizationId }}/apps/{{ app.id}}\">{{ app.name }}</a></span>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <span class=\"description\">\r\n                        {{ app.description }}\r\n                      </span>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- End Applications Tab Content -->\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n        \r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/user/user-orgs.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.UserOrgsController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/user/user_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <!-- Left Hand Side -->\r\n        <div ng-include=\"\'plugins/api-manager/html/user/user_entity.include\'\"></div>\r\n        <!-- /Left Hand Side -->\r\n\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <div ng-include=\"\'plugins/api-manager/html/user/user_tabs.include\'\"></div>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n              \r\n              <!-- Organizations Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-orgs\">\r\n                <div class=\"apiman-filters apiman-organizations-filters\">\r\n                  <div>\r\n                    <apiman-search-box apiman-i18n-key=\"filter-user-orgs\" function=\"filterOrgs\" placeholder=\"Filter by organization name...\" />\r\n                  </div>\r\n                  <a data-field=\"toNewOrg\" href=\"{{ pluginName }}/new-org\" class=\"btn btn-primary pull-right\" apiman-i18n-key=\"new-org\">New Org</a>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The list of organizations the user belongs to -->\r\n                <div class=\"apiman-organizations\">\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"organizations.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-9\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-orgs-found-for-user\">No organizations found. This user should be granted membership in an organization or perhaps she can create a new one with the button above.</p>\r\n                      </div>\r\n                      <div class=\"col-md-3\">\r\n                        <div class=\"apiman-no-entities-arrow\"></div>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"organizations.length > 0 && filteredOrgs.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-orgs-found-for-filter\">No organizations found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"org in filteredOrgs\">\r\n                    <div class=\"row\">\r\n                      <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{ org.id }}\">{{ org.name }}</a></span>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <span class=\"description\">{{ org.description }}</span>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- End Organizations Tab Content -->\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n        \r\n      </div>\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/user/user-services.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n    \r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.UserServicesController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n      <div ng-include=\"\'plugins/api-manager/html/user/user_bc.include\'\"></div>\r\n      <div class=\"row\">\r\n        <!-- Left Hand Side -->\r\n        <div ng-include=\"\'plugins/api-manager/html/user/user_entity.include\'\"></div>\r\n        <!-- /Left Hand Side -->\r\n\r\n        <!-- Center Content -->\r\n        <div class=\"col-md-8\">\r\n          <div class=\"apiman-entitytabs\">\r\n            <div ng-include=\"\'plugins/api-manager/html/user/user_tabs.include\'\"></div>\r\n            <div id=\"entitytabsContent\" class=\"tab-content\">\r\n\r\n              <!-- Services Tab Content -->\r\n              <div class=\"tab-pane active\" id=\"tab-services\">\r\n                <div class=\"apiman-filters apiman-services-filters\">\r\n                  <div>\r\n                    <apiman-search-box apiman-i18n-key=\"filter-user-services\" function=\"filterServices\" placeholder=\"Filter by org or service name...\" />\r\n                  </div>\r\n                  <a apiman-i18n-key=\"new-service\" data-field=\"toNewService\" apiman-i18n-key=\"new-service\" href=\"{{ pluginName}}/new-service\" class=\"btn btn-primary pull-right\">New Service</a>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n                <!-- The list of services the user has access to -->\r\n                <div class=\"apiman-services\" data-field=\"services\">\r\n                  \r\n                  <div class=\"apiman-no-content container-fluid\" ng-hide=\"services.length > 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-9\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-services-found-for-user\">It looks like this user isn\'t responsible for any services. Maybe she\'s just all about the applications? If not, maybe she could log in and try creating a New Service.</p>\r\n                      </div>\r\n                      <div class=\"col-md-3\">\r\n                        <div class=\"apiman-no-entities-arrow\"></div>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"apiman-no-content container-fluid\" ng-show=\"services.length > 0 && filteredServices.length == 0\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-12\">\r\n                        <p class=\"apiman-no-entities-description\" apiman-i18n-key=\"no-services-found-for-filter\">No services found matching your filter criteria - please try searching for something different.</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"container-fluid apiman-summaryrow\" ng-repeat=\"service in filteredServices\">\r\n                    <div class=\"row\">\r\n                      <a href=\"{{ pluginName }}/orgs/{{ service.organizationId }}/services\">{{ service.organizationName }}</a>\r\n                      <span apiman-i18n-skip>/</span>\r\n                      <span class=\"title\"><a href=\"{{ pluginName }}/orgs/{{ service.organizationId }}/services/{{ service.id }}\">{{ service.name }}</a></span>\r\n                      <a class=\"apiman-summaryrow-icon\">\r\n                        <i class=\"fa fa-clock-o fa-fw\"></i>\r\n                        <span class=\"title-summary-item\" apiman-i18n-key=\"created-on\">Created on</span>\r\n                        <span class=\"title-summary-item\">{{ service.createdOn | date:\'yyyy-MM-dd\' }}</span>\r\n                      </a>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <span class=\"description\">\r\n                        {{ service.description }}\r\n                      </span>\r\n                    </div>\r\n                    <hr/>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- End Services Tab Content -->\r\n              \r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- /Center Content -->\r\n        \r\n      </div>\r\n    </div> <!-- /container -->\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/user/user.html","<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></meta>\r\n  </head>\r\n\r\n  <body>\r\n  <div>\r\n    <div ng-include=\"\'plugins/api-manager/html/progress.include\'\"></div>\r\n    <div id=\"apiman-header\" ng-include=\"\'plugins/api-manager/html/navbar.include\'\"></div>\r\n    <div ng-controller=\"Apiman.UserRedirectController\" class=\"page container\" data-field=\"page\" ng-cloak=\"\" ng-show=\"pageState == \'loaded\'\">\r\n    </div> <!-- /container -->\r\n  </div>\r\n  </body>\r\n</html>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/auditUnknown.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.did-something-unknown\">did something we didn\'t recognize!</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditAddPolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.added-policy-to\">added a policy to</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-added\">Policy added:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditBreakContract.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.broke-contract-from-app\">broke a contract from application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.contract-broken-between-app\">A contract was broken between application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps\">{{ data.appOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}\">{{ data.appId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}/{{ data.appVersion }}\">{{ data.appVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.and-service\">and service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services\">{{ data.serviceOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}\">{{ data.serviceId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}/{{ data.serviceVersion }}\">{{ data.serviceVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.through-version\">through version</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}/{{ data.planVersion }}\">{{ data.planVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.of-plan\">of plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}\">{{ data.planId }}</a>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditCreate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.created-app\">created application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditCreateContract.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.created-contract-from-app\">created a contract from application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.contract-created-between-app\">A contract was created between application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps\">{{ data.appOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}\">{{ data.appId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}/{{ data.appVersion }}\">{{ data.appVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.and-service\">and service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services\">{{ data.serviceOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}\">{{ data.serviceId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}/{{ data.serviceVersion }}\">{{ data.serviceVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.through-version\">through version</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}/{{ data.planVersion }}\">{{ data.planVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.of-plan\">of plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}\">{{ data.planId }}</a>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditDelete.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.deleted-app\">deleted application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditRegister.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.registered-app\">registered application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditRemovePolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.removed-policy-from\">removed a policy from</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-removed\">Policy removed:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditReorderPolicies.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.reordered-policies-in\">reordered policies in</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditUnregister.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.retired-app\">retired application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditUpdate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-application\">updated application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <div ng-repeat=\"item in data.changes\">\r\n    <div>\r\n      <span class=\"capitalized emphasis\">{{ item.name }}</span>\r\n    </div>\r\n    <div class=\"activity-value\">\r\n      <span>{{ item.after }}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Application/auditUpdatePolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-policy-in\">updated a policy in</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/apps/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-updated\">Policy updated:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditAddPolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.added-policy-to\">added a policy to</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-added\">Policy added:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditCreate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.created-plan\">created plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditDelete.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.deleted-plan\">deleted plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditLock.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.locked-plan\">locked plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditRemovePolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.removed-policy-from\">removed a policy from</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-removed\">Policy removed:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditReorderPolicies.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.reordered-policies\">reordered policies in</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditUpdate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-plan\">updated plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <div ng-repeat=\"item in data.changes\">\r\n    <div>\r\n      <span class=\"capitalized emphasis\">{{ item.name }}</span>\r\n    </div>\r\n    <div class=\"activity-value\">\r\n      <span>{{ item.after }}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Plan/auditUpdatePolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-policy-in\">updated a policy in</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-updated\">Policy updated:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Organization/auditCreate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.created-org\">created organization</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Organization/auditDelete.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.deleted-org\">deleted organization</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Organization/auditGrant.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.granted-memberships\">granted membership(s) in </span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <ul>\r\n    <li ng-repeat=\"role in data.roles\">\r\n      <span>\r\n        <a href=\"{{ pluginName }}/users/{{ data.userId }}/apps\">{{ data.userId }}</a>\r\n        <span apiman-i18n-key=\"audit.was-given-role\">was given role</span>\r\n        <span class=\"emphasis\">{{ role }}</span>\r\n      </span>\r\n    </li>\r\n  </ul>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Organization/auditRevoke.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.revoked-memberships\">revoked membership(s) in </span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <ul>\r\n    <li ng-repeat=\"role in data.roles\" ng-show=\"data.roles[0] != \'*\'\">\r\n      <span>\r\n        <span apiman-i18n-key=\"audit.role\">Role</span>\r\n        <span class=\"emphasis\">{{ role }}</span>\r\n        <span apiman-i18n-key=\"audit.was-taken-away-from\">was taken away from</span>\r\n        <a href=\"{{ pluginName }}/users/{{ data.userId }}/apps\">{{ data.userId }}</a><span apiman-i18n-skip>.</span>\r\n      </span>\r\n    </li>\r\n  </ul>\r\n  <span ng-show=\"data.roles[0] == \'*\'\">\r\n    <span class=\"emphasis\" apiman-i18n-key=\"audit.all-roles\">All roles</span>\r\n    <span apiman-i18n-key=\"audit.were-taken-away-from\">were taken away from</span>\r\n    <a href=\"{{ pluginName }}/users/{{ data.userId }}/apps\">{{ data.userId }}</a><span apiman-i18n-skip>.</span>\r\n  </span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Organization/auditUpdate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-org\">updated organization</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <div ng-repeat=\"item in data.changes\">\r\n    <div>\r\n      <span class=\"capitalized emphasis\">{{ item.name }}</span>\r\n    </div>\r\n    <div class=\"activity-value\">\r\n      <span>{{ item.after }}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditAddPolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.added-policy-to\">added a policy to</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-added\">Policy added:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditBreakContract.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.broke-contract-with-service\">broke a contract with service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.contract-broken-between-app\">A contract was broken between application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps\">{{ data.appOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}\">{{ data.appId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}/{{ data.appVersion }}\">{{ data.appVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.and-service\">and service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services\">{{ data.serviceOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}\">{{ data.serviceId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}/{{ data.serviceVersion }}\">{{ data.serviceVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.through-version\">through version</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}/{{ data.planVersion }}\">{{ data.planVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.of-plan\">of plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}\">{{ data.planId }}</a>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditCreate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.created-service\">created service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditCreateContract.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.created-contract-with-service\">created a contract with service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.contract-created-between-app\">A contract was created between application</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps\">{{ data.appOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}\">{{ data.appId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.appOrgId }}/apps/{{ data.appId }}/{{ data.appVersion }}\">{{ data.appVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.and-service\">and service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/apps\">{{ data.serviceOrgId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}\">{{ data.serviceId }}</a>\r\n  <span apiman-i18n-skip>:</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.serviceOrgId }}/services/{{ data.serviceId }}/{{ data.serviceVersion }}\">{{ data.serviceVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.through-version\">through version</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}/{{ data.planVersion }}\">{{ data.planVersion }}</a>\r\n  <span apiman-i18n-key=\"audit.of-plan\">of plan</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ data.planOrgId }}/plans/{{ data.planId }}\">{{ data.planId }}</a>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditDelete.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.deleted-service\">deleted service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditDeleteDefinition.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.deleted-service-def\">deleted the service definition from</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditPublish.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.published-service\">published service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditRemovePolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.removed-policy-from\">removed a policy from</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-removed\">Policy removed:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditReorderPolicies.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.reordered-policies\">reordered policies in</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditRetire.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.retired-service\">retired service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditUpdate.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-service\">updated service</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span ng-show=\"entry.entityVersion\">\r\n    <span apiman-i18n-key=\"audit.version\">version</span>\r\n    <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a>\r\n  </span>\r\n  <span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <div ng-repeat=\"item in data.changes\">\r\n    <div>\r\n      <span class=\"capitalized emphasis\">{{ item.name }}</span>\r\n    </div>\r\n    <div class=\"activity-value\">\r\n      <span>{{ item.after }}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditUpdateDefinition.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-service-def\">updated the service definition for</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n");
$templateCache.put("plugins/api-manager/html/directives/audit/Service/auditUpdatePolicy.html","<div class=\"row\">\r\n  <a href=\"{{ pluginName }}/users/{{ entry.who }}\">{{ entry.who }}</a>\r\n  <span apiman-i18n-key=\"audit.updated-policy-in\">updated a policy in</span>\r\n  <a href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/plans\">{{ entry.organizationId }}</a>\r\n  <span apiman-i18n-skip>/</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}\">{{ entry.entityId }}</a>\r\n  <span apiman-i18n-key=\"audit.version\">version</span>\r\n  <a class=\"emphasis\" href=\"{{ pluginName }}/orgs/{{ entry.organizationId }}/services/{{ entry.entityId }}/{{ entry.entityVersion }}\">{{ entry.entityVersion }}</a><span apiman-i18n-skip>.</span>\r\n</div>\r\n<div class=\"row boxed-row\">\r\n  <span apiman-i18n-key=\"audit.policy-updated\">Policy updated:</span>\r\n  <span class=\"emphasis\">{{ data.policyDefId }}</span>\r\n</div>");}]); hawtioPluginLoader.addModule("apiman-manager-templates");