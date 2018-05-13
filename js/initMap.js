var APP_PREFIX = "monash.eng1003.navigationApp";
var path = JSON.parse(localStorage.getItem(APP_PREFIX + "-selectedPath"));
console.log(path);
var map = null;
var infoWindow = null;
var latlng = path.latlng;
let isFirst = true;
var marker = null;
var circle = null;
var line = null;
var dashLine = null;
let routes = [];
let heading = 0;

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     zoom: 15,
     draggable: true,
     mapTypeId: 'roadmap',
   });
   infoWindow = new google.maps.InfoWindow({map: map});
     const blueline = new google.maps.Polyline({
       path: latlng.map(item => {
         return new google.maps.LatLng(item[0], item[1]);
       }),
       map: map,
       geodesic: true,
       strokeColor: '#87CEFA',
       strokeOpacity: 1,
       strokeWeight: 2,
    });
    drawCurrentPosition(map, infoWindow);
 }

 function handleLocationError(browserHasGeolocation, infoWindow, pos) {
   infoWindow.setPosition(pos);
   infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
 }

 function drawCurrentPosition(map, infoWindow) {
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      const speed = typeof window.speed === 'number' ? Math.abs(window.speed.toFixed(1)) : 0.001;
      // const heading = window.alpha;
      const { latitude, longitude } = position.coords;
      const [ comLat, comLng ] = latlng[0] || [];
      const [ lastLat, lastLng ] = latlng[latlng.length - 1] || [];
      const centerPosition = new google.maps.LatLng(latitude, longitude);
      const composition = new google.maps.LatLng(comLat, comLng);
      const lastposition = new google.maps.LatLng(lastLat, lastLng);
      const isArrivedNext = google.maps.geometry.spherical.computeDistanceBetween(centerPosition, composition) < 5;
      isArrivedNext && latlng.splice(0, 1);

      const [ nextLat, nextLng ] = latlng[0] || [];
      const nextposition = new google.maps.LatLng(nextLat, nextLng);
      const isArrived = latlng.length === 1 && google.maps.geometry.spherical.computeDistanceBetween(centerPosition, nextposition) < 5;
      const remainDistance = google.maps.geometry.spherical.computeDistanceBetween(centerPosition, lastposition);
      const remainTime = remainDistance / speed;
       routes.push(centerPosition);
       let shouldRender = false
       if(routes.length > 1 && google.maps.geometry.spherical.computeHeading(routes[routes.length - 2], centerPosition) !== 0) {
         heading = -1*google.maps.geometry.spherical.computeHeading(routes[routes.length - 2], centerPosition);
         const offsetDistance = google.maps.geometry.spherical.computeDistanceBetween(routes[routes.length - 2], centerPosition);
         if(2 < offsetDistance && offsetDistance < 20) {
           shouldRender = true;
         }
       }
       const nowDirection = heading < 0 ? 360 + heading : heading;
       const targetDirection = google.maps.geometry.spherical.computeHeading(centerPosition, nextposition) < 0 ? 360 + google.maps.geometry.spherical.computeHeading(centerPosition, nextposition) : google.maps.geometry.spherical.computeHeading(centerPosition, nextposition);
       const offsetDeg = targetDirection - nowDirection;
       isFirst && map.setCenter(centerPosition);
       if(isFirst) {
         marker = new google.maps.Marker({
             position: centerPosition,
             map: map,
             icon: {
               path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
               scale: 4,
               strokeColor: 'black',
               rotation: heading || 0,
             }
         });
         circle = new google.maps.Circle({
             center: centerPosition,
             radius: 100,
             map: map,
             fillColor: '#FF0000',
             fillOpacity: 0.5,
             strokeColor: '#FF0000',
             strokeOpacity: 0.5
         });
         line = new google.maps.Polyline({
          path: routes,
          map: map,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1,
          strokeWeight: 2
        });
        dashLine = new google.maps.Polyline({
         path: [centerPosition, nextposition],
         map: map,
         geodesic: true,
         strokeColor: '#FFD700',
         strokeOpacity: 0,
         strokeWeight: 2,
         icons: [{
           icon: {path: 'M 0,-1 0, 1', strokeOpacity: 1, scale: 3},
           offset: '0',
           repeat: '20px',
         }],
       });
     } else if(shouldRender) {
         marker.setPosition(centerPosition);
         marker.setIcon({
           path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
           scale: 4,
           strokeColor: 'black',
           rotation: 0 - heading,
         })
         circle.setCenter(centerPosition);
         line.setPath(routes);
         dashLine.setPath([centerPosition, nextposition]);
      }
      if (isFirst || shouldRender) {
        let direction = '';
        if(-5 <= offsetDeg && offsetDeg <= 5) {
          direction = 'straight';
        } else if (5 < offsetDeg && offsetDeg <= 45) {
          direction = 'slight_left';
        } else if(-45< offsetDeg && offsetDeg < -5) {
          direction = 'slight_right';
        } else if (45 < offsetDeg && offsetDeg <= 135) {
          direction = 'left';
        } else if(-135 < offsetDeg && offsetDeg <= -45) {
          direction = 'right';
        } else if (135 < offsetDeg && offsetDeg <= 180) {
          direction = 'return';
        } else if (-180 < offsetDeg && offsetDeg <= -135) {
          direction = 'return';
        } else if (-270 < offsetDeg && offsetDeg <= -180) {
          direction = 'return';
        }
        console.log(isArrived, direction, offsetDeg, `${remainDistance/1000}km`, `${remainTime/60}min`);
        if(isArrived) {
          document.querySelector('#pointer').className = `pointer`;
          setDom([['#nextAction', 'Arrived'], ['#distance', `0 m`], ['#remainTime', `0 min`], ['#speed', `${speed} m/s`]]);
          return;
        }
        setDom([['#nextAction', `${direction}`], ['#distance', `${remainDistance.toFixed(1)}m`], ['#remainTime', `${(remainTime/60).toFixed(1)}min`], ['#speed', `${speed} m/s`]]);
        document.querySelector('#pointer').className = `${direction} pointer`;
        // infoWindow.setPosition(centerPosition);
        // infoWindow.setContent('dsfsda');
      }
      isFirst = false;
     }, function (error) {
      //处理错误
      switch (error.code) {
        case 1:
          alert("位置服务被拒绝。");
          break;
        case 2:
          alert("暂时获取不到位置信息。");
          break;
        case 3:
          alert("获取信息超时。");
          break;
        default:
          alert("未知错误。");
          break;
      }
    });
   }
  }

   function setDom(arr) {
     arr.forEach(item => {
       document.querySelector(item[0]).innerHTML = item[1];
     });
   }
