"use strict";
var app = require('../app'),
    analytics = require('../core/analytics'),
    notify = require('../api/notify');

/*
 * Social sharing directive
 */

app.directive('socialSharing', function ($rootScope, socialService, emailService) {
    return {
        restrict: 'E',
        templateUrl: '/directive/social.html',
        scope: {
            type: '='
        },
        link : function (scope) {
            function init() {
                socialService.init();
                scope.buildURL = socialService.twitter.build;

                socialService.twitter.share(function (res) {
                    if (res) {
                        analytics.track('Share success', {
                            category: 'Twitter Sharing'
                        });
                        return;
                    } else {
                        analytics.track('Share failure', {
                            category: 'Twitter Sharing'
                        });
                        return;
                    }
                });
            }

            init();

            scope.loading = false;
            scope.mailModal = false;
            scope.mailForm = {
                description: 'Hack your way through video game history with Pixel Hack from Kano! http://art.kano.me/challenges/pixelhack/'
            };

            scope.open = function () {
                scope.mailModal = true;
            };
            scope.close = function () {
                scope.mailModal = false;
            };
            scope.facebookShare = function () {
                var options = {
                    title   : 'Pixel Hack on Make Art',
                    url     : 'http://art.kano.me/challenges/pixelhack/',
                    picture : 'http://art.kano.me/assets/challenges/images/world_covers/pixelhack.png',
                    caption : 'Shared by ' + $rootScope.user.username + ' via Pixel Hack',
                    text    : 'Hack your way through video game history with #PixelHack from Kano'
                };

                socialService.facebook.share(options, function (err, res) {
                    if (err) {
                        analytics.track('Share failure', {
                            category: 'Facebook Sharing'
                        });
                        return err;
                    } else if (res) {
                        analytics.track('Share success', {
                            category: 'Facebook Sharing'
                        });
                    }
                });
            };

            scope.sendMail = function () {
                var emailObj;
                if (!scope.mailForm.email || !scope.mailForm.description) {
                    return;
                } else {
                    if (!emailService.validate(scope.mailForm.email)) {
                        scope.error = 'Invalid email address';
                        return;
                    }
                    scope.error = '';
                    scope.loading = true;
                    scope.mailForm.user_email = $rootScope.user.email;
                    scope.mailForm.username = $rootScope.user.username;
                    emailObj = emailService.buildObject(scope.mailForm);

                    emailService.send(emailObj, function (res) {
                        if (res.status === 200) {
                            emailService.reset(scope.mailForm);
                            analytics.track('Email success', {
                                category: 'Email Sharing'
                            });
                            scope.loading = false;
                            scope.close();
                            return notify.success();
                        }
                    }, function (error) {
                        if (error) {
                            analytics.track('Email failure', {
                                category: 'Email Sharing'
                            });
                            scope.loading = false;
                            return notify.failure(error);
                        }
                    });
                }
            };
        }
    };
});