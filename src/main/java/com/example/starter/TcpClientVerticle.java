package com.example.starter;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.NetClient;
import io.vertx.core.net.NetClientOptions;
import io.vertx.core.net.NetSocket;

public class TcpClientVerticle extends AbstractVerticle {

  private MessageConsumer<JsonObject> sendConsumer;

  @Override
  public void start(Promise<Void> startPromise) throws Exception {

    System.out.println("TcpClientVerticle started....");

    NetClientOptions options = new NetClientOptions()
      .setConnectTimeout(10000)
      .setTcpKeepAlive(true)
      .setReconnectAttempts(10)
      .setReconnectInterval(500);;

    NetClient client = vertx.createNetClient(options);

    client
      .connect(8099,"localhost")
      .onComplete(res -> {
        if (res.succeeded()) {

          System.out.println("Connected!");
          NetSocket socket = res.result();

          // messsage send ========================
          sendConsumer = vertx.eventBus().<JsonObject> consumer("banf_message_send",message -> {

            JsonObject messageBody = message.body();

            //socket.write("TEST 입니다...\n", "UTF-8");
            socket.write(messageBody.toString());

          });
          // messsage send ========================

        } else {
          System.out.println("Failed to connect: " + res.cause().getMessage());
        }
      });

    vertx.setPeriodic(1000 * 10 , handler -> {
      System.out.println("timer fired....");


      JsonObject mainObject = new JsonObject();

      JsonObject timObject = new JsonObject();;
      JsonObject dataFramesObject = new JsonObject();;

      JsonObject msgId = new JsonObject();

      JsonObject regions = new JsonObject();

      JsonObject anchor = new JsonObject();

      msgId.put("furtherInfoID","4AFF");

      dataFramesObject.put("frameType",1);
      dataFramesObject.put("msgId",msgId);
      dataFramesObject.put("startYear",2023);
      dataFramesObject.put("startTime",330000);
      dataFramesObject.put("duratonTime",32000);

      dataFramesObject.put("priority",2);   //  2:caution , 3:warning
      dataFramesObject.put("sspLocationRights",0);

      anchor.put("lat",334458452);
      anchor.put("long",1265681962);
      anchor.put("elevation",0);

      regions.put("anchor",anchor);
      regions.put("direction","0xFFFF");

      dataFramesObject.put("regions",regions);

      dataFramesObject.put("sspMsgRights1",0);
      dataFramesObject.put("sspMsgRights2",0);

      JsonObject content = new JsonObject();
      JsonObject value = new JsonObject();

      value.put("ITIS_codes",1300);

      content.put("value",value);

      dataFramesObject.put("content",content);

      timObject.put("msgCnt",1234);
      timObject.put("dataFrames",dataFramesObject);

      mainObject.put("TIM",timObject);


      vertx.eventBus().send("banf_message_send",mainObject);
    });

    startPromise.complete();
  }

  @Override
  public void stop(Promise<Void> stopPromise) throws Exception {

    stopPromise.complete();
  }
}
