$(function(){


    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });

    //$( "#connect" ).trigger("click");

    var socket ;

    var svg = '<svg width="120" height="120" version="1.1" xmlns="http://www.w3.org/2000/svg">'
    + '<circle cx="60" cy="60" r="60"/>'
    + '</svg>';

    var violationIndex = 0 ;
    $( "#violationViweBtn" ).click(function() {
        console.log("확인....");
        //for(var i=0; i < violationList.length ; i++){
        //}
        if(violationIndex > (violationList.length-1) ){
            violationIndex = 0 ;
        }

        showPointView(violationList[violationIndex],false);

        $("#violationLabel").text("총:"+violationList.length+"건 "+(violationIndex+1)+"/"+violationList.length);

        violationIndex++ ; // 다음건



    });

    // event bus bridge ---------------------------
    var eb = new EventBus('http://localhost:8888/eventbus');
    eb.enableReconnect(true);
    eb.onopen = () => {

      console.log("eb.onopen ................. ");

      // set a handler to receive a message
       eb.registerHandler('events-feed', (error, message) => {
         console.log('received a message: ' + message.body);
       });

       // send a message
       //eb.send('some-address', {name: 'tim', age: 587});
    }
    eb.onreconnect = () => {
      console.log("reconnect....");
    };
    // event bus bridge ---------------------------

    var image = new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color:'red'}),
      stroke: new ol.style.Stroke({color: 'red', width: 1}),
    });
    var styles = {
      'Point': new ol.style.Style({
        image: image,
      }),
      'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'orange',
          width: 2,
        }),
      })
    };

    // 위반건 저장
    var violationList = [];

    // 위반 사항  건수 저장
    var violationStopLine = 0 ;
    var violationTrafficLight = 0 ;
    var violationRuleSpeed = 0 ;
    var violationVehicleLine = 0 ;

    let linkMapping = new Map();

    $("#showPointBtn").click(function(){

      console.log("longitude : "+$("#longitude").val()+" , latitude : "+$("#latitude").val());

      var longitude = $("#longitude").val() ;
      var latitude = $("#latitude").val();

      if(!longitude || !latitude){
         return ;
      }

      map.removeLayer(vectorLayerTestPoint);

      var features = vectorLayerTestPoint.getSource().getFeatures();

      features[0].getGeometry().setCoordinates([parseFloat(longitude),parseFloat(latitude)]);  // UPDATE    [126.7737476,37.2425725]

      map.addLayer(vectorLayerTestPoint);

    });




    var indexId = 0 ;



    // degree to radian
    function degrees_to_radians(degrees){
      var pi = Math.PI;
      return degrees * (pi/180);
    }

    $("#labelKeepStopLine").hide();
    $("#labelKeepTrafficLight").hide();
    $("#labelKeepRuleSpeed").hide();
    $("#labelKeepVehicleLine").hide();

    // 신호등 초기화
    $("#strateLightRed").hide();
    $("#strateLightGreen").hide();
    $("#strateLightYellow").hide();
    $("#leftLightRed").hide();
    $("#leftLightGreen").hide();
    $("#leftLightYellow").hide();

    var today = new Date();
    var todayStr = today.toISOString().split('T')[0];
    //console.log("today: "+todayStr);

    // echart 테스트

    var myChartGauge = echarts.init(document.getElementById('chartSpeedGauge'));
    var optionGause;
    optionGause = {
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 140,
            splitNumber: 7,
            itemStyle: {
                color: '#fc6e6e',
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            progress: {
                show: true,
                roundCap: true,
                width: 16
            },
            pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '75%',
                width: 14,
                offsetCenter: [0, '5%']
            },
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 16
                }
            },
            axisTick: {
                splitNumber: 2,
                lineStyle: {
                    width: 2,
                    color: '#999'
                }
            },
            splitLine: {
                length: 12,
                lineStyle: {
                    width: 3,
                    color: '#999'
                }
            },
            axisLabel: {
                distance: 30,
                color: '#999',
                fontSize: 18
            },
            title: {
                show: false
            },
            detail: {
                backgroundColor: '#fff',
                borderColor: '#999',
                borderWidth: 2,
                width: '60%',
                lineHeight: 40,
                height: 40,
                borderRadius: 8,
                offsetCenter: [0, '35%'],
                valueAnimation: true,
                formatter: function (value) {
                    return '{value|' + value.toFixed(0) + '}{unit|km/h}';
                },
                rich: {
                    value: {
                        fontSize: 20,
                        fontWeight: 'bolder',
                        color: '#777'
                    },
                    unit: {
                        fontSize: 13,
                        color: '#999',
                        padding: [0, 0, -20, 10]
                    }
                }
            },
            data: [{
                value: 0
            }]
        }]
    };
    myChartGauge.setOption(optionGause);

    var speedChartData = [
            /*['2019-10-10T20:40:33Z', 20 ],
            ['2019-10-11T20:40:33Z', 0 ],
            ['2019-10-12T20:40:33Z', 11 ],
            ['2019-10-13T20:40:33Z', 12 ],
            ['2019-10-14T20:40:33Z', 11.8],
            ['2019-10-15T20:40:33Z', 5.9],
            ['2019-10-16T20:40:33Z', 5.2],
            ['2019-10-17T20:40:33Z', 6.9],
            ['2019-10-18T20:40:33Z', 10.9],
            ['2019-10-19T20:40:33Z', 8.6],
            ['2019-10-20T20:40:33Z', 5.6]*/
        ];

    var myChart = echarts.init(document.getElementById('chartSpeed'));
    var option;
    console.log("option : myChart"+myChart);
        option = {
            grid: {
                zlevel: 0,
                x: 60,
                x2: 60,
                y: 20,
                y2: 20,
                borderWidth: 2,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0,0,0,0)',
            },
            xAxis: {
                type: 'time',
                //boundaryGap: false,
                axisLabel: {
                    formatter: (function(value){
                        // return moment(value).format('YYYY-MM-DD mm:ss');
                        return moment(value).format('mm:ss');
                    })
                },
            },
            yAxis: [{

            },{
                type: 'category',
            }],
            series: [
                {
                    type: 'line',
                    name: "라인",
                    symbol:'none',
                    areaStyle: {},
                    large:true,
                    data: speedChartData

                },

            ]
        };

        myChart.setOption(option);


        var myChartViolation = echarts.init(document.getElementById('chartViolation'));
            var optionViolation;
            console.log("option : optionViolation"+optionViolation);
            optionViolation = {
                grid: {
                    zlevel: 0,
                    x: 60,
                    x2: 60,
                    y: 20,
                    y2: 20,
                    borderWidth: 2,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                },
                legend: {
                    data: ['정지선 위반', '신호 위반', '규정속도 위반', '차로 위반']
                },
                xAxis: {
                    type: 'category',
                },
                yAxis: {

                },
                series: [
                    {
                        type: 'bar',
                        name: "정지선 위반",
                        data: [0]

                    },
                    {
                        type: 'bar',
                        name: "신호 위반",
                        data: [0]

                    },
                    {
                        type: 'bar',
                        name: "규정속도 위반",
                        data: [0]

                    },
                     {
                         type: 'bar',
                         name: "차로 위반",
                         data: [0]

                     }

                ]
            };

            myChartViolation.setOption(optionViolation);
     // echart  테스트

    // test
    $("#chartSpeedGauge").addClass("vibration");

    function showPointView(resultData,isReal){

      if(isReal){
          // 실시간 속도 차트 출력 =================
            speedChartData.push([resultData.system_time, resultData.eval_speed ]);
            if(speedChartData.length > 70){
              speedChartData.shift();
            }
            option.series[0].data = speedChartData ;
            myChart.setOption(option);
            // 실시간 속도 차트 출력 =================

            $("#chartSpeedGauge").toggleClass("vibration");
      }



      var latitude = resultData.latitude ;
      var longitude = resultData.longitude ;

      var isviolation = false ;

      // 위반 사항 표시 =========================================
      var keepStopLine = resultData.keep_stop_line ;
      if(keepStopLine && keepStopLine === "1"){
         $("#labelKeepStopLine").show();
         if(isReal){
            isviolation = true ;
            violationStopLine++ ;
         }
      }else{
         $("#labelKeepStopLine").hide();
      }

      var keepTrafficLight = resultData.keep_traffic_light ;
      if(keepTrafficLight && keepTrafficLight === "1"){
         $("#labelKeepTrafficLight").show();
         if(isReal){
            isviolation = true ;
            violationTrafficLight++ ;
         }
      }else{
         $("#labelKeepTrafficLight").hide();
      }

      var keepRuleSpeed = resultData.keep_rule_speed ;
      if(keepRuleSpeed && keepRuleSpeed === "1"){
        $("#labelKeepRuleSpeed").show();
        if(isReal){
            isviolation = true ;
            violationRuleSpeed++ ;
        }
      }else{
        $("#labelKeepRuleSpeed").hide();
      }

      var keepVehicleLine = resultData.keep_vehicle_line ;
      if(keepVehicleLine && keepVehicleLine === "1"){
        $("#labelKeepVehicleLine").show();
        if(isReal){
            isviolation = true ;
            violationVehicleLine++ ;
        }
      }else{
        $("#labelKeepVehicleLine").hide();
      }
      // 위반 사항 표시 =========================================

      if(isReal){
          optionViolation.series[0].data = [violationStopLine];
          optionViolation.series[1].data = [violationTrafficLight] ;
          optionViolation.series[2].data = [violationRuleSpeed] ;
          optionViolation.series[3].data = [violationVehicleLine] ;

          myChartViolation.setOption(optionViolation);

          if(isviolation){
              violationList.push(resultData);
          }
      }

      // 좌표 업데이트 =================================
      map.removeLayer(vectorLayerPoint);

      var features = vectorLayerPoint.getSource().getFeatures();

      // 업데이트 좌표  설정
      features[0].getGeometry().setCoordinates([longitude,latitude]);  // UPDATE

      $("#direction").text(""); // 초기화

      console.log("("+resultData.longitude+" "+resultData.latitude+") ,speed : "+resultData.speed+" , direction : "+resultData.direction
          +" , distance_from_stop_line : "+resultData.distance_from_stop_line+" , drive_direction : ["+resultData.drive_direction
          +"] , previous_link : "+resultData.previous_link+" , current_link : "+resultData.current_link+" , last_matched_link : "+resultData.last_matched_link
          +" , cross_road_id : "+resultData.cross_road_id+" , target_traffic_light : "+resultData.target_traffic_light
          +" , g_light_state (직진신호) : ["+resultData.g_light_state+"] , a_light_state (좌회전신호) : ["+resultData.a_light_state+"]"
          +" , eval_speed : "+resultData.eval_speed+" , eval_min_speed : "+resultData.eval_min_speed+" , eval_max_speed : "+resultData.eval_max_speed
          );

      optionGause.series[0].data[0] = resultData.eval_speed ;
      myChartGauge.setOption(optionGause);

      if(resultData.drive_direction == "S"){
        $("#direction").text("직진"); // 방향 (교차로)
      }
      if(resultData.drive_direction == "L"){
        $("#direction").text("좌회전"); // 방향 (교차로)
      }
      if(resultData.drive_direction == "R"){
        $("#direction").text("우회전"); // 방향 (교차로)
      }

      // 신호등 초기화
      $("#strateLightRed").hide();
      $("#strateLightGreen").hide();
      $("#strateLightYellow").hide();

      $("#leftLightRed").hide();
      $("#leftLightGreen").hide();
      $("#leftLightYellow").hide();

      $("#infraId").text("");

      if(resultData.cross_road_id){
        $("#infraId").text(resultData.cross_road_id);
      }

      if(resultData.g_light_state == "1"){  // 직진 - red
        //alert("1");
        $("#strateLightRed").show();
      }
      if(resultData.g_light_state == "2"){  // 직진 - yellow
        $("#strateLightYellow").show();
      }
      if(resultData.g_light_state == "3"){  // 직진 - green
        $("#strateLightGreen").show();
      }

      if(resultData.a_light_state == "1"){  // 좌회전 - red
        $("#leftLightRed").show();
      }
      if(resultData.a_light_state == "2"){  // 좌회전 - yellow
        $("#leftLightYellow").show();
      }
      if(resultData.a_light_state == "3"){  // 좌회전 - green
        $("#leftLightGreen").show();
      }

      map.addLayer(vectorLayerPoint);
      // 좌표 업데이트 =================================

      // matched link 업데이트 =================================
      map.removeLayer(vectorLayerLink);

      if(resultData.last_matched_link != null && resultData.last_matched_link.length > 0){


        var featuresLink = vectorLayerLink.getSource().getFeatures();

        featuresLink[0].getGeometry().setCoordinates(linkMapping.get(resultData.last_matched_link));  // UPDATE

        map.addLayer(vectorLayerLink);

      }

      // matched link 업데이트 =================================



    }

    var styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };


    // 테스트 pointer 표시 ------------------
    var geojsonTestObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326',
        },
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [156.7722404, 37.2359967],
          },
        },
      ],
    };
    var vectorSourceTestPoint = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geojsonTestObject),
    });
    var vectorLayerTestPoint = new ol.layer.Vector({
      source: vectorSourceTestPoint,
      style: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({color:'blue'}),
          stroke: new ol.style.Stroke({color: 'blue', width: 1}),
        }),
      }),
    });
    // 테스트 pointer 표시 ------------------


    // 차량 pointer 표시 ------------------
    var geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326',
        },
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [156.7722404, 37.2359967],
          },
        },
      ],
    };
    var vectorSourcePoint = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geojsonObject),
    });
    var vectorLayerPoint = new ol.layer.Vector({
      source: vectorSourcePoint,

      style: styleFunction,

    });
    // 차량 pointer 표시 ------------------

    // matched road link 표시 ------------------
    var geojsonLinkObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326',
        },
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiLineString',
            'coordinates': [[156.7722404, 37.2359967]],
          },
        },
      ],
    };
    var vectorSourceLink = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geojsonLinkObject),
    });
    var vectorLayerLink = new ol.layer.Vector({
      source: vectorSourceLink,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 3,
        }),
      })
    });
    // matched road link 표시 ------------------

    var map = new ol.Map({
        target: 'map',
        layers: [
          // new ol.layer.Tile({
          //   source: new ol.source.OSM()
          // }),
          //vectorLayer,
          //vectorLayerPoint
        ],
        view: new ol.View({
          projection: 'EPSG:4326',
          center: [126.773, 37.240],
          zoom: 17,
          rotation: 0
        })
      });

    $.ajax({
      url: '/data/mapGeoJson.geojson',
      method: 'GET'
    }).done(function(json){

      //alert("done."+JSON.stringify(json));
      var vectorSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json),
      });

      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
      });

      map.addLayer(vectorLayer);
      // console.log("projection : "+JSON.stringify((new ol.source.OSM()).getProjection()));  //  EPSG:3857


    });

    $.ajax({
      url: '/data/geoJsonLight.geojson',
      method: 'GET'
    }).done(function(geoJson){


      var vectorTrafficLightSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geoJson),
      });
      var vectorTrafficLightLayer = new ol.layer.Vector({
        source: vectorTrafficLightSource,


        style : function(feature){
          var style = new ol.style.Style({
            image: new ol.style.Icon({
              opacity: 1,
              src: '/image/traffic-light-business-svgrepo-com.svg',
              scale: 0.3
            }),
            stroke: new ol.style.Stroke({
              color: '#3399CC',
              width: 1.25
            }),
            text: new ol.style.Text({
              font: '15px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#f00' }),
              stroke: new ol.style.Stroke({
                color: '#fff', width: 3
              }),
              // get the text from the feature - `this` is ol.Feature
              // and show only under certain resolution
              // text: map.getView().getZoom() > 12 ? this.get('description') : ''
              // text: feature.get('infra_id')
              //text : 'hard..'
            })
          });
          var styles = [style];
          style.getText().setText(feature.get("infra_name"));
          return styles ;
        }
        ,



      });

      map.addLayer(vectorTrafficLightLayer);

    });


    $.ajax({
      url: '/data/stopLineGeoJson.geojson',
      method: 'GET'
    }).done(function(geoJson){

      //console.log("geoJson: "+JSON.stringify(geoJson));

      var vectorStopLineSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geoJson),
      });

      var vectorStopLineLayer = new ol.layer.Vector({
        source: vectorStopLineSource,
        style: styleFunction,
      });

      map.addLayer(vectorStopLineLayer);
    });

    // 정밀도로 geometry load....
    $.ajax({
      url: '/data/geoJsonLink.geojson',
      method: 'GET'
    }).done(function(geoJson){

      var geoJsonParse = JSON.parse(geoJson);

      geoJsonParse.features.forEach(function(obj){
        linkMapping.set(obj.properties.LINKID,obj.geometry.coordinates);
      });

    });


    function setConnected(connected) {
        $("#connect").prop("disabled", connected);
        $("#disconnect").prop("disabled", !connected);
    }
    function connect() {
        //socket = new SockJS('/example');
        //var socket = new SockJS('http://192.168.5.8/websocket-example');

       // socket.onopen = function() {
       //  console.log('open');
       //  setConnected(true);

        // socket.send('test hello World!~');

       // };
      //  socket.onmessage = function(e) {
      //   console.log("message data :" + e.data);
      //  };
      //  socket.onclose = function() {
     //    console.log('close');
     //   };

        stompClient = Stomp.client("ws://localhost:8888/example");

        //stompClient = Stomp.overWS('ws://localhost:8888/stomp');

        //stompClient = Stomp.client("/stomp");

        //stompClient.heartbeat.outgoing = 0; // client will send heartbeats every 20000ms
        //stompClient.heartbeat.incoming = 10000;

        //stompClient.connect({},function(frame){
        //   console.log("try conection...................");
        //});

        //client.send("/topic/nonScenario", {priority: 9}, "Hello, STOMP");

        /*
        stompClient.connect({}, function (frame) {
            setConnected(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/nonScenario', function (greeting) {

                console.log("greeting : ===================== ");

                var resultInfo = JSON.parse(greeting.body) ;

                showPointView(resultInfo,true);


            });
        });
        */
    }

    function disconnect() {
        if (socket !== null) {
            socket.close();
        }
        setConnected(false);
        console.log("Disconnected");
    }

});



