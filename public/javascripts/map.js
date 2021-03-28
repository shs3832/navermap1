
var mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 10,
};

var map = new naver.maps.Map("map", mapOptions);

// marker 생성
// let marker = new naver.maps.Marker({
//     map: map,
//     position: new naver.maps.LatLng(37.3595704, 127.105399),
//     icon: {
//         content:`<div class="marker"></div>`
//     }
// })




var markerList = [];
var infoWindowList = [];

for (var items in data) {
    var target = data[items];
    var latlng = new naver.maps.LatLng(target.lat, target.lng);
    var marker = new naver.maps.Marker({
        map: map,
        position: latlng,
        icon: {
            content: `<div class="marker"></div>`,
            anchor: new naver.maps.Point(12, 12)
        }
    })

    var content = `<div class="infoWindowWrap">
        <div class="infoWindow_title">${target.title}</div>
        <div class="infoWindow_content">${target.content}</div>
        <div class="infoWindow_date">${target.date}</div>
    </div>`;

    var infoWindow = new naver.maps.InfoWindow({
        content: content,
        backgroundColor: "#00ff0000",
        borderColor: "#00ff0000",
        anchorSize: new naver.maps.Size(0, 0),
    });

    markerList.push(marker);
    infoWindowList.push(infoWindow);
    
};

for (let index = 0; index < markerList.length; index++) {
    naver.maps.Event.addListener(markerList[index], 'click', getClickHandler(index))
    naver.maps.Event.addListener(map, 'click', clickMap(index));
}

function getClickHandler(i) {
    return function () {
        let marker = markerList[i];
        let infoWindow = infoWindowList[i];
        
        if (infoWindow.getMap()) {
            infoWindow.close()
        } else {
            infoWindow.open(map, marker)
        }
    }
}

function clickMap(i) {
    return function () {
        let infoWindow = infoWindowList[i];
        infoWindow.close()
    }
}

let currentUsed = true;
let current = document.querySelector('.current');
current.addEventListener('click', function () {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude; // lat 좌표 가져오기
            let lng = position.coords.longitude; // lng 좌표 가져오기
            let latlng = new naver.maps.LatLng(lat, lng);
            if (currentUsed) {
                new naver.maps.Marker({
                    map: map,
                    position: latlng,
                    icon: {
                        content: `<img class="pulse" draggable="false" unselectable="on" 
                            src="https://myfirstmap.s3.ap-northeast-2.amazonaws.com/circle.png" />`,
                        anchor: new naver.maps.Point(11,11)
                    }
                }) // 마커표기
                currentUsed = false;
            }
            map.setZoom(14, false); // 줌레벨 , 애니메이션여부
            map.panTo(latlng); // 클릭시 해당 좌표로 이동
        });
    } else {
        alert('위치정보를 사용할 수 없습니다')
    }
})

let search = document.querySelector('.searchInput');
let searchBtn = document.querySelector('.searchBtn');

let postSearch = new kakao.maps.services.Places();
let searchArray = [];

search.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        let cont = event.target.value;
        postSearch.keywordSearch(cont, placeSearchCB);
    }
});

searchBtn.addEventListener('click', function (event) {
    let searchValue = search.value;
    postSearch.keywordSearch(searchValue, placeSearchCB);
});


function placeSearchCB(data,status,pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // let target = data[0];
        // let lat = target.y;
        // let lng = target.x;
        // let latlng = new naver.maps.LatLng(lat, lng);
        // let sMarker = new naver.maps.Marker({
        //     position: latlng,
        //     map: map,
        // });

        let target = data;
        let sMarker;
        let centerTargetY = target[0].y;
        let centerTargetX = target[0].x;
        let centerPosition = new naver.maps.LatLng(centerTargetY, centerTargetX);

        if (searchArray.length == 0) {
            console.log(searchArray);
        } else {
            for (var idx = 0; idx < searchArray.length; idx++) {
                console.log(searchArray.length);
                searchArray[idx].setMap(null);
            }
            searchArray = [];
        }

        for (items in target) {
            let lat = target[items].y;
            let lng = target[items].x;
            let latlng = new naver.maps.LatLng(lat, lng);
            sMarker = new naver.maps.Marker({
                position: latlng,
                map: map,
            });
            searchArray.push(sMarker);
            console.log(searchArray);
        }
        
        
        map.setZoom(14, false);
        map.panTo(centerPosition);
    } else {
        alert('검색 결과가 없습니다.');
    }
}