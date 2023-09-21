package com.example.starter;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientRequest;
import io.vertx.core.http.HttpClientResponse;
import io.vertx.core.http.HttpMethod;

public class MainVerticle extends AbstractVerticle {

  @Override
  public void start(Promise<Void> startPromise) throws Exception {

    System.out.println("start................");

    vertx.deployVerticle(new TcpClientVerticle(), new DeploymentOptions(), ar -> {
      if(ar.succeeded()) {
        System.out.println("TcpClientVerticle.....");
      }
      else {
        System.err.println("TcpClientVerticle.....FAILED..."+ar.cause());
      }
    });

    vertx.deployVerticle(new TcpServerVerticle(), new DeploymentOptions(), ar -> {
      if(ar.succeeded()) {
        System.out.println("TcpServerVerticle.....");
      }
      else {
        System.err.println("TcpServerVerticle.....FAILED..."+ar.cause());
      }
    });

    startPromise.complete();

  }
}
