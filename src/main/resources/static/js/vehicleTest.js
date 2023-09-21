$(function(){

    $.ajax({
        url: '/users/accept_terminal',
        method: 'GET'
      }).done(function(json){

        // 초기화
        $("#acceptNo").empty();
        $("#acceptNo").append($("<option value=''> -- 전체 -- </option>"));

        for(var i=0;i < json.length ; i++){
          //
          var option = $("<option value='"+json[i].accept_no+"'>"+json[i].accept_no+" - "+json[i].terminal_id+"</option>");
          $("#acceptNo").append(option);
        }

      });

		$("#searchBtn").click(function(){

            // Autobox Mapping 정보 조회
            $.ajax({
                url: '/users/autobox_mapping_info',
                method: 'GET',
                data: {
                    acceptNo : $("#acceptNo").val(),
                    terminalId : $("#terminalId").val()
                }
            }).done(function(json){

                //json = JSON.parse(json);

                $("#tableAutoboxMappingInfo").empty();  // 초기화

                if(json && json.length > 0){

                    json.forEach(element => {
                        $("#tableAutoboxMappingInfo").append('<tr><td>'+element.autobox_data_id+'</td><td>'+element.data_id+'</td></tr>');
                    });

                }else{
                    $("#tableAutoboxMappingInfo").append('<tr><td colspan="2" style="text-align:center;">맵핑 정보 없음</td></tr>');
                }
            });

            $.ajax({
                url: '/users/vehicle_test_info',
                method: 'GET',
                data: {
                    acceptNo : $("#acceptNo").val(),
                    terminalId : $("#terminalId").val()
                }
            }).done(function(json){

                console.log("resturn : "+json);
                console.log("resturn.length : "+json.length);

                //json = JSON.parse(json);

                //console.log("min_speed : "+json[0].min_speed);

                if(json == null || json.length == 0){
                    return ;
                }

                $("#minSpeed").text(json[0].min_speed);
                $("#maxSpeed").text(json[0].max_speed);
                $("#stdIntervehicleDistance").text(json[0].std_intervehicle_distance);
                $("#targetRecoverySpeed").text(json[0].target_recovery_speed);
                $("#minTg").text(json[0].min_tg);
                $("#maxTg").text(json[0].max_tg);
                $("#ttc").text(json[0].ttc);

                $("#vehicleWidth").text(json[0].vehicle_width);
                $("#vehicleLength").text(json[0].vehicle_length);
                $("#centerTireWidth").text(json[0].center_tire_width);

                //$("#opposingcarUseYn").text(json[0].opposingcar_use_yn);

                if(json[0].opposingcar_use_yn){
                    $("#opposingcarUseYn").show();

                    if(json[0].opposingcar_use_yn == 'Y'){
                        $("#opposingcarUseYn").attr("src","/image/ok-1.1s-47px.png");
                    }else if(json[0].opposingcar_use_yn == 'N'){
                        $("#opposingcarUseYn").attr("src","/image/fail-1.1s-47px.png");
                    }
                }else{
                    $("#opposingcarUseYn").hide();
                }


                //$("#scenarioVeriYn").text(json[0].scenario_veri_yn);
                if(json[0].scenario_veri_yn){
                    $("#scenarioVeriYn").show();

                    if(json[0].scenario_veri_yn == 'Y'){
                        $("#scenarioVeriYn").attr("src","/image/ok-1.1s-47px.png");
                    }else if(json[0].scenario_veri_yn == 'N'){
                        $("#scenarioVeriYn").attr("src","/image/fail-1.1s-47px.png");
                    }
                }else{
                    $("#scenarioVeriYn").hide();
                }


                //$("#autoboxVeriYn").text(json[0].autobox_veri_yn);
                if(json[0].autobox_veri_yn){
                    $("#autoboxVeriYn").show();

                    if(json[0].autobox_veri_yn == 'Y'){
                        $("#autoboxVeriYn").attr("src","/image/ok-1.1s-47px.png");
                    }else if(json[0].autobox_veri_yn == 'N'){
                        $("#autoboxVeriYn").attr("src","/image/fail-1.1s-47px.png");
                    }
                }else{
                    $("#autoboxVeriYn").hide();
                }


                //$("#testDrivingFailYn").text(json[0].testdriving_fail_yn);
                if(json[0].testdriving_fail_yn){
                    $("#testDrivingFailYn").show();

                    if(json[0].testdriving_fail_yn == 'Y'){
                        $("#testDrivingFailYn").attr("src","/image/ok-1.1s-47px.png");
                    }else if(json[0].testdriving_fail_yn == 'N'){
                        $("#testDrivingFailYn").attr("src","/image/fail-1.1s-47px.png");
                    }
                }else{
                    $("#testDrivingFailYn").hide();
                }

                var testStatusStr = "" ;
                if(json[0].test_status == 100){
                    testStatusStr = "테스트예약" ;

                    $("#testStatus100").removeClass("btn-secondary");
                    $("#testStatus100").removeClass("btn-primary");
                    $("#testStatus100").addClass("btn-primary");

                }else if(json[0].test_status == 101){
                    testStatusStr = "주행테스트시작" ;

                    $("#testStatus101").removeClass("btn-secondary");
                    $("#testStatus101").removeClass("btn-primary");
                    $("#testStatus101").addClass("btn-primary");

                }else if(json[0].test_status == 102){
                    testStatusStr = "주행테스트종료" ;

                    $("#testStatus102").removeClass("btn-secondary");
                    $("#testStatus102").removeClass("btn-primary");
                    $("#testStatus102").addClass("btn-primary");

                }else if(json[0].test_status == 103){
                    testStatusStr = "평가시작" ;

                    $("#testStatus103").removeClass("btn-secondary");
                    $("#testStatus103").removeClass("btn-primary");
                    $("#testStatus103").addClass("btn-primary");

                }else if(json[0].test_status == 104){
                    testStatusStr = "평가종료" ;

                    $("#testStatus104").removeClass("btn-secondary");
                    $("#testStatus104").removeClass("btn-primary");
                    $("#testStatus104").addClass("btn-primary");
                }

                //$("#testStatus").text(testStatusStr);

                //
                //$("#testdrivingStatus").text(json[0].testdriving_status);

                if(json[0].testdriving_status == 'ready'){

                    refreshTestDrivingStatus();

                    $("#testdrivingStatusReady").removeClass("btn-secondary");
                    $("#testdrivingStatusReady").removeClass("btn-primary");
                    $("#testdrivingStatusReady").addClass("btn-primary");   //


                }else if(json[0].testdriving_status == 'started'){

                    refreshTestDrivingStatus();

                    $("#testdrivingStatusStarted").removeClass("btn-secondary");
                    $("#testdrivingStatusStarted").removeClass("btn-primary");
                    $("#testdrivingStatusStarted").addClass("btn-primary");

                }else if(json[0].testdriving_status == 'finished'){

                    refreshTestDrivingStatus();

                    $("#testdrivingStatusFinished").removeClass("btn-secondary");
                    $("#testdrivingStatusFinished").removeClass("btn-primary");
                    $("#testdrivingStatusFinished").addClass("btn-primary");

                }else if(json[0].testdriving_status == 'unmapped'){

                    refreshTestDrivingStatus();

                    $("#testdrivingStatusUnmapped").removeClass("btn-secondary");
                    $("#testdrivingStatusUnmapped").removeClass("btn-primary");
                    $("#testdrivingStatusUnmapped").addClass("btn-primary");

                }else if(json[0].testdriving_status == 'aborted'){

                    refreshTestDrivingStatus();

                    $("#testdrivingStatusAborted").removeClass("btn-secondary");
                    $("#testdrivingStatusAborted").removeClass("btn-primary");
                    $("#testdrivingStatusAborted").addClass("btn-primary");

                }

                // 시험주행 시작일시
                if(json[0].testdriving_start_dtm){
                    $("#testdrivingStartDtm").text(json[0].testdriving_start_dtm_str);
                }
                // 시험주행 종료일시
                if(json[0].testdriving_finish_dtm){
                    $("#testdrivingFinishDtm").text(json[0].testdriving_finish_dtm_str);
                }


                if(json[0].terminal_unmap_dtm){
                    $("#terminalUnmapDtm").text(json[0].terminal_unmap_dtm_str);
                }


                if(json[0].post_process_status == '00'){
                    $("#postProcessStatus00").removeClass("btn-secondary");
                    $("#postProcessStatus00").removeClass("btn-primary");
                    $("#postProcessStatus00").addClass("btn-primary");
                }else if(json[0].post_process_status == '10'){
                    $("#postProcessStatus10").removeClass("btn-secondary");
                    $("#postProcessStatus10").removeClass("btn-primary");
                    $("#postProcessStatus10").addClass("btn-primary");
                }else if(json[0].post_process_status == '11'){
                    $("#postProcessStatus11").removeClass("btn-secondary");
                    $("#postProcessStatus11").removeClass("btn-primary");
                    $("#postProcessStatus11").addClass("btn-primary");
                }else if(json[0].post_process_status == '18'){
                    $("#postProcessStatus18").removeClass("btn-secondary");
                    $("#postProcessStatus18").removeClass("btn-primary");
                    $("#postProcessStatus18").addClass("btn-primary");
                }else if(json[0].post_process_status == '20'){
                    $("#postProcessStatus20").removeClass("btn-secondary");
                    $("#postProcessStatus20").removeClass("btn-primary");
                    $("#postProcessStatus20").addClass("btn-primary");
                }else if(json[0].post_process_status == '28'){
                    $("#postProcessStatus28").removeClass("btn-secondary");
                    $("#postProcessStatus28").removeClass("btn-primary");
                    $("#postProcessStatus28").addClass("btn-primary");
                }else if(json[0].post_process_status == '30'){
                    $("#postProcessStatus30").removeClass("btn-secondary");
                    $("#postProcessStatus30").removeClass("btn-primary");
                    $("#postProcessStatus30").addClass("btn-primary");
                }else if(json[0].post_process_status == '31'){
                    $("#postProcessStatus31").removeClass("btn-secondary");
                    $("#postProcessStatus31").removeClass("btn-primary");
                    $("#postProcessStatus31").addClass("btn-primary");
                }else if(json[0].post_process_status == '38'){
                    $("#postProcessStatus38").removeClass("btn-secondary");
                    $("#postProcessStatus38").removeClass("btn-primary");
                    $("#postProcessStatus38").addClass("btn-primary");
                }else if(json[0].post_process_status == '99'){
                    $("#postProcessStatus99").removeClass("btn-secondary");
                    $("#postProcessStatus99").removeClass("btn-primary");
                    $("#postProcessStatus99").addClass("btn-primary");
                }

                // imgReplaySuccessYn
                if(json[0].replay_success_yn){
                    $("#imgReplaySuccessYn").show();

                    if(json[0].replay_success_yn == 'Y'){
                        $("#imgReplaySuccessYn").attr("src","/image/ok-1.1s-47px.png");
                    }else if(json[0].replay_success_yn == 'N'){
                        $("#imgReplaySuccessYn").attr("src","/image/fail-1.1s-47px.png");
                    }
                }else{
                    $("#imgReplaySuccessYn").hide();
                }


                // 리플레이 생성 시작일시
                if(json[0].replay_process_from){
                    $("#replayProcessFrom").text(json[0].replay_process_from);
                }
                // 리플레이 생성 종료일시
                if(json[0].replay_process_to){
                    $("#replayProcessTo").text(json[0].replay_process_to);
                }
                if(json[0].replay_process_msg){
                    $("#replayProcessMsg").text(json[0].replay_process_msg);
                }

                // 접수번호 완료일시
                if(json[0].acceptno_complete_dtm){
                    $("#acceptnoCompleteDtm").text(json[0].acceptno_complete_dtm);
                }

                // 평가시스템데이터업로드완료일시
                if(json[0].opposingcar_upload_complete_dtm){
                    $("#opposingcarUploadCompleteDtm").text(json[0].opposingcar_upload_complete_dtm);
                }

            });

        });

        function refreshPostProcessStatus(){
            $("#postProcessStatus00").removeClass("btn-secondary");
            $("#postProcessStatus00").removeClass("btn-primary");
            $("#postProcessStatus00").addClass("btn-secondary");

            $("#postProcessStatus10").removeClass("btn-secondary");
            $("#postProcessStatus10").removeClass("btn-primary");
            $("#postProcessStatus10").addClass("btn-secondary");

            $("#postProcessStatus11").removeClass("btn-secondary");
            $("#postProcessStatus11").removeClass("btn-primary");
            $("#postProcessStatus11").addClass("btn-secondary");

            $("#postProcessStatus18").removeClass("btn-secondary");
            $("#postProcessStatus18").removeClass("btn-primary");
            $("#postProcessStatus18").addClass("btn-secondary");

            $("#postProcessStatus20").removeClass("btn-secondary");
            $("#postProcessStatus20").removeClass("btn-primary");
            $("#postProcessStatus20").addClass("btn-secondary");

            $("#postProcessStatus28").removeClass("btn-secondary");
            $("#postProcessStatus28").removeClass("btn-primary");
            $("#postProcessStatus28").addClass("btn-secondary");

            $("#postProcessStatus30").removeClass("btn-secondary");
            $("#postProcessStatus30").removeClass("btn-primary");
            $("#postProcessStatus30").addClass("btn-secondary");

            $("#postProcessStatus31").removeClass("btn-secondary");
            $("#postProcessStatus31").removeClass("btn-primary");
            $("#postProcessStatus31").addClass("btn-secondary");

            $("#postProcessStatus38").removeClass("btn-secondary");
            $("#postProcessStatus38").removeClass("btn-primary");
            $("#postProcessStatus38").addClass("btn-secondary");

            $("#postProcessStatus99").removeClass("btn-secondary");
            $("#postProcessStatus99").removeClass("btn-primary");
            $("#postProcessStatus99").addClass("btn-secondary");

        }
        function refreshTestDrivingStatus(){
            $("#testdrivingStatusReady").removeClass("btn-secondary");
            $("#testdrivingStatusReady").removeClass("btn-primary");
            $("#testdrivingStatusReady").addClass("btn-secondary");   //

            $("#testdrivingStatusStarted").removeClass("btn-secondary");
            $("#testdrivingStatusStarted").removeClass("btn-primary");
            $("#testdrivingStatusStarted").addClass("btn-secondary");

            $("#testdrivingStatusFinished").removeClass("btn-secondary");
            $("#testdrivingStatusFinished").removeClass("btn-primary");
            $("#testdrivingStatusFinished").addClass("btn-secondary");

            $("#testdrivingStatusUnmapped").removeClass("btn-secondary");
            $("#testdrivingStatusUnmapped").removeClass("btn-primary");
            $("#testdrivingStatusUnmapped").addClass("btn-secondary");

            $("#testdrivingStatusAborted").removeClass("btn-secondary");
            $("#testdrivingStatusAborted").removeClass("btn-primary");
            $("#testdrivingStatusAborted").addClass("btn-secondary");
        }

        function refreshTestStatus(){
            $("#testStatus100").removeClass("btn-secondary");
            $("#testStatus100").removeClass("btn-primary");
            $("#testStatus100").addClass("btn-secondary");

            $("#testStatus101").removeClass("btn-secondary");
            $("#testStatus101").removeClass("btn-primary");
            $("#testStatus101").addClass("btn-secondary");

            $("#testStatus102").removeClass("btn-secondary");
            $("#testStatus102").removeClass("btn-primary");
            $("#testStatus102").addClass("btn-secondary");

            $("#testStatus103").removeClass("btn-secondary");
            $("#testStatus103").removeClass("btn-primary");
            $("#testStatus103").addClass("btn-secondary");

            $("#testStatus104").removeClass("btn-secondary");
            $("#testStatus104").removeClass("btn-primary");
            $("#testStatus104").addClass("btn-secondary");
        }
	});