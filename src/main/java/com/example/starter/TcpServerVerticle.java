package com.example.starter;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.net.NetServer;

public class TcpServerVerticle extends AbstractVerticle {

  @Override
  public void start(Promise<Void> startPromise) throws Exception {

    NetServer server = null ;

    server = vertx.createNetServer();

    server.connectHandler(clientSocket -> {

      System.out.println("client socket connect handler client's IP: "+clientSocket.remoteAddress());

      clientSocket.handler(buffer -> {
        System.out.println("RECEIVED from client - msg {}"+buffer.toString("UTF-8"));
      });

      clientSocket.closeHandler(handler -> {
        System.out.println("client socket DISCONNECTED client's IP: "+clientSocket.remoteAddress());
      });

    });

    /*
    server.listen(8099, ar -> {
      if(ar.succeeded()) {
        System.out.println("listening 8099");
      }else{
        System.err.println("listening 8099 FAILED...."+ar.cause());
      }
    });
    */


    startPromise.complete();
  }

  @Override
  public void stop(Promise<Void> stopPromise) throws Exception {
    stopPromise.complete();
  }
}
