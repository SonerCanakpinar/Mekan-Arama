$(function () { //hazır olduğunda daima olacak

    console.log("Sayfa Yüklendi");
    $("#btnkonum").click(function () {
        //console.log("Konum");
        navigator.geolocation.getCurrentPosition(getposition);//callback fonk tanımlama
    });
});

function getposition(position) {

    console.log(position);
    var konum = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapdiv = document.getElementById("map");

    var settings = {

        center: konum,
        zoom: 15,
        mapTypeId :'terrain',
        //mapTypeId: google.maps.MapTypeId.ROADMAP,

        mapTypeControl: true,

        navigationControlOptions: {

            style: google.maps.NavigationControlStyle.SMALL,
        }
    }

    
    
    var map = new google.maps.Map(mapdiv, settings);

    var marker = new google.maps.Marker({ //ünlem nerede olduğumuz belli olsun diye

        position: konum,
        map: map,
        title: 'Şu an buradasın',
        animation:google.maps.Animation.DROP

    });

    var trafficLayer = new google.maps.TrafficLayer();//trafik durumu
    trafficLayer.setMap(map);

    var transitLayer = new google.maps.TransitLayer();//duraklar
    transitLayer.setMap(map);

    var toprak = new google.maps.LatLng(39.209399,34.863737);//gidilece k

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
          origins:[konum],
          destinations:[toprak],
          travelMode:'DRIVING',
          drivingOptions:{
              departureTime:new Date(),
              trafficModel: 'bestguess'//optimsitic ve pessimistic
          },
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: true,
          avoidTolls: true,
      }, distance);

    var directionsService = new google.maps.DirectionsService; //yol bul
    var directionsDisplay = new google.maps.DirectionsRenderer; // yol çiz

    directionsService.route({

        origin: konum,
        destination: toprak,
        travelMode:google.maps.TravelMode.DRIVING
    }, function (response, status) {

        if (status =='OK') {
            directionsDisplay.setDirections(response);
        }
        else {
            alert("Rota Çizlemedi" + status);
        }

    });

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("panel"));
}

function distance(response,status) {

    console.log(response)
    if (status!='OK') {
        alert('Mesafe Ölçülemedi');
    }
    else {
        $("#bilgi").html("Gidilecek" + response.destinationAddresses[0] + "<br/> Uzaklık:" + response.rows[0].elements[0].distance.text + "<br/>" + response.rows[0].elements[0].duration.text + "<br/>Trafik ile:" + response.rows[0].elements[0].duration_in_traffic.text);
        var data = response.rows[0];
    }
};