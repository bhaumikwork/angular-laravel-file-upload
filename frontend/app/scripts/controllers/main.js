'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', ['$scope', '$http', '$timeout', '$compile', '$upload',function ($scope, $http, $timeout, $compile, $upload) {
    var url = 'http://localhost:8000/';
    $scope.uploadedFiles = [];
    $http.get(url + "files/").then(function(data){
    	angular.forEach(data.data,function(obj){
    		$scope.uploadedFiles.push(obj);
    	});
    })
	$scope.$watch('files', function(files) {
		$scope.formUpload = false;
		if (files != null) {
			for (var i = 0; i < files.length; i++) {
				$scope.errorMsg = null;
				(function(file) {
					generateThumbAndUpload(file);
				})(files[i]);
			}
		}
	});
	
	$scope.uploadPic = function(files) {
		$scope.formUpload = true;
		if (files != null) {
			generateThumbAndUpload(files[0])
		}
	}
	
	function generateThumbAndUpload(file) {
		$scope.errorMsg = null;
		$scope.generateThumb(file);
		uploadUsing$upload(file);
	}
	
	$scope.generateThumb = function(file) {
		if (file != null) {
			if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
				$timeout(function() {
					var fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = function(e) {
						$timeout(function() {
							file.dataUrl = e.target.result;
						});
					}
				});
			}
		}
	}
	function uploadUsing$upload(file) {
		file.upload = $upload.upload({
			url: url + "files/" + $scope.getReqParams(),
			method: 'POST',
			sendObjectsAsJsonBlob: false,
			file: file,
			fileFormDataName: 'file',
		});

		file.upload.then(function(response) {
			$timeout(function() {
				file.result = response.data;
				$scope.uploadedFiles.push(response.data);
			});
		}, function(response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		});

		file.upload.progress(function(evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});

		file.upload.xhr(function(xhr) {
			// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
		});
	}
	$scope.getReqParams = function() {
		return $scope.generateErrorOnServer ? "?errorCode=" + $scope.serverErrorCode + 
				"&errorMessage=" + $scope.serverErrorMsg : "";
	}

	window.addEventListener("dragover", function(e) {
		e.preventDefault();
	}, false);
	window.addEventListener("drop", function(e) {
		e.preventDefault();
	}, false);

  }]);
