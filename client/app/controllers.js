function HomeCtrl($scope,$rootScope,$routeParams,$location,$timeout) {
	Meteor.subscribe("albums");
	Meteor.subscribe("playlist");
	
	$scope.Albums = new Meteor.AngularCollection("albums", $scope);
	$scope.albums = $scope.Albums.find({});
	$scope.Playlist = new Meteor.AngularCollection("playlist", $scope);
	$scope.playlist = $scope.Playlist.findOne({});
	
	$scope.player = {};
	$scope.player.current_album = 0;
	$scope.player.current_track = 0;
	$scope.player.playing = false;
	
	$scope.pl = {};
	
	$scope.poop = function() {
		alert("huh");
	};
	
	$scope.pl.add = function(album) {
		console.log($scope.playlist.albums);
		if ($scope.playlist.albums.indexOf(album) != -1) return;
			$scope.playlist.albums.push(album);
		$scope.playlist.$save();
	};
	
	$scope.play = function(track, album) {
		if (!$scope.playlist.albums.length) return;
		if (angular.isDefined(track)) $scope.player.current_track = track;
		if (angular.isDefined(album))	$scope.player.current_album = album;

		var url =  $scope.playlist.albums[$scope.player.current_album].tracks[$scope.player.current_track].url;
		
    if (true) audio.src = url;
    audio.play();
		$scope.player.playing = true;
	}
	
	$scope.pause = function() {
		if ($scope.player.playing) {
			audio.pause();
			$scope.player.playing = false;
		}
	}
	
	$scope.reset = function() {
		$scope.pause();
		$scope.player.current_album = 0;
		$scope.player.current_track = 0;
	}
	
	$scope.previous = function() {
		  if (!$scope.playlist.albums.length) return;
      $scope.player.playing = true;
      if ($scope.player.current_track > 0) {
        $scope.player.current_track--;
      } else {
        $scope.player.current_album = ($scope.player.current_album - 1 + $scope.playlist.albums.length) % $scope.playlist.albums.length;
        $scope.player.current_track = $scope.playlist.albums[$scope.player.current_album].tracks.length - 1;
      }
      if ($scope.player.playing) $scope.play();
    }
	
	$scope.next = function() {
		console.log("NEXT");
		if (!$scope.playlist.albums.length) return;
    $scope.player.playing = true;
    if ($scope.playlist.albums[$scope.player.current_album].tracks.length > ($scope.player.current_track + 1)) {
      $scope.player.current_track = $scope.player.current_track + 1;
    } else {
      $scope.player.current_track = 0;
      $scope.player.current_album = ($scope.player.current_album + 1) % $scope.playlist.albums.length;
    }
    if ($scope.player.playing) $scope.play();
	}
	
	$scope.pl.remove = function(album) {
		var index = $scope.playlist.albums.indexOf(album);
		var pl_num = index + 1;
		if (pl_num == $scope.player.current_album + 1) $scope.reset();
		$scope.playlist.albums.splice(index, 1);
		$scope.playlist.$save();
	};
	
}