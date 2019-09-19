'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:RunnerOfTheMonthCtrl
 * @description
 * # EventsCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
	.controller('RunnerOfTheMonthCtrl', ['$scope', '$filter', '$log', 'dataFactory', 'runners', 'winners', function ($scope, $filter, $log, dataFactory, runners, winners) {

		$scope.currentPage = 1;
		$scope.pageSize = 10;
		$scope.winners = [];

		for (var i = 0; i < winners.data.length; i++) {
			var item = {
				year: winners.data[i].year,
				month: winners.data[i].month,
				girls: {},
				boys: {},
				ladies: {},
				men: {}
			};
			for (var j = 0; j < winners.data[i].winners.length; j++) {
				if (winners.data[i].winners[j].category == 'Girls')
					item.girls = winners.data[i].winners[j];
				else if (winners.data[i].winners[j].category == 'Boys')
					item.boys = winners.data[i].winners[j];
				else if (winners.data[i].winners[j].category == 'Ladies')
					item.ladies = winners.data[i].winners[j];
				else if (winners.data[i].winners[j].category == 'Men')
					item.men = winners.data[i].winners[j];
			}

			$scope.winners.push(item);
		}

		$scope.runners = runners.data;
		$scope.months = [{
			id: 0,
			text: 'January'
		}, {
			id: 1,
			text: 'February'
		}, {
			id: 2,
			text: 'March'
		}, {
			id: 3,
			text: 'April'
		}, {
			id: 4,
			text: 'May'
		}, {
			id: 5,
			text: 'June'
		}, {
			id: 6,
			text: 'July'
		}, {
			id: 7,
			text: 'August'
		}, {
			id: 8,
			text: 'September'
		}, {
			id: 9,
			text: 'October'
		}, {
			id: 10,
			text: 'November'
		}, {
			id: 11,
			text: 'December'
		}
		];
		$scope.month = new Date().getMonth();
		var currentYear = new Date().getFullYear();
		$scope.years = [];
		for (var i = 0; i <= 20; i++) {
			$scope.years.push(currentYear - i);
		}
		$scope.year = currentYear;

		$scope.showMonth = function (month) {
			if (month >= 0 && $scope.months.length) {
				var selected = $filter('filter')($scope.months, { id: parseInt(month) }, true);
				return selected.length ? selected[0].text : 'Not set';
			} else {
				return 'Not Set';
			}
		};

		$scope.showRunner = function (runnerId) {
			if (runnerId && $scope.runners.length) {
				var selected = $filter('filter')($scope.runners, {
					id: runnerId
				}, true);
				return selected.length ? selected[0].name : 'Not set';
			} else {
				return 'Not set';
			}
		};

		$scope.updateWinner = function (data, category, winner) {
			if ((category == "girls" && winner.girls.id == undefined) ||
				(category == "boys" && winner.boys.id == undefined) ||
				(category == "ladies" && winner.ladies.id == undefined) ||
				(category == "men" && winner.men.id == undefined)) {
				var result = {
					year: winner.year,
					month: winner.month
				};

				if (category == "girls") {
					result.girls = data;
				} else if (category == "boys") {
					result.boys = data;
				} else if (category == "ladies") {
					result.ladies = data;
				} else if (category == "men") {
					result.men = data;
				}

				dataFactory.saveRunnerOfTheMonth(result)
					.then(
						function (data) {
							return true;
						},
						function (reason) {
							alert('Failed: ' + reason);
						});
			} else {
				var id = 0;
				if (category == "girls" && winner.girls.id != undefined)
					id = winner.girls.winner_id;
				else if (category == "boys" && winner.boys.id != undefined)
					id = winner.boys.winner_id;
				else if (category == "ladies" && winner.ladies.id != undefined)
					id = winner.ladies.winner_id;
				else if (category == "men" && winner.men.id != undefined)
					id = winner.men.winner_id;

				dataFactory.updateRunnerOfTheMonth(id, data)
					.then(
						function (data) {
							return true;
						},
						function (reason) {
							alert('Failed: ' + reason);
						});
			}
		};

		$scope.submit = function () {
			var result = {
				year: $scope.year,
				month: $scope.month,
				men: $scope.adultMale,
				women: $scope.adultFemale,
				boys: $scope.boys,
				girls: $scope.girls
			};

			dataFactory.saveRunnerOfTheMonth(result)
				.then(
					function (data) {
						$scope.year = 0;
						$scope.month = 0;
						$scope.adultMale = 0;
						$scope.adultFemale = 0;
						$scope.boys = 0;
						$scope.girls = 0;
					},
					function (reason) {
						alert('Failed: ' + reason);
					});

			return true;
		};

		$scope.sendNominations = function () {
			var toAddress;
			if ($scope.emailSource == 'custom')
				toAddress = $scope.customEmail;
			else if ($scope.emailSource == 'committee')
				toAddress = 'committee@ipswichjaffa.org.uk';
			else if ($scope.emailSource == 'chair')
				toAddress = 'chair@ipswichjaffa.org.uk';

			var request = {
				year: $scope.nominationsYear,
				month: $scope.nominationsMonth + 1,
				toAddress: toAddress
			};

			dataFactory.sendRunnerOfTheMonthVotesEmail(request)
				.then(
					function (data) {
						alert('Sent');
					},
					function (reason) {
						alert('Failed: ' + reason);
					});

			return true;
		};
	}
	]);