package com.example.starter;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientRequest;
import io.vertx.core.http.HttpClientResponse;
import io.vertx.core.http.HttpMethod;

public class CKanPusherVerticle extends AbstractVerticle {

  @Override
  public void start(Promise<Void> startPromise) throws Exception {

    HttpClient client = vertx.createHttpClient();

    client.request(HttpMethod.POST,80,"121.183.203.78","/api/3/action/datastore_upsert", ar1 -> {
      if(ar1.succeeded()){
        HttpClientRequest request = ar1.result();

        request.putHeader("Authorization","58d24efc-ab89-49fb-9e99-52ad35319340");

        request.send(ar2 -> {
          if(ar2.succeeded()){
            HttpClientResponse response = ar2.result();



            System.out.println("Received response with status code : " + response.statusCode() + " , status message : "+response.statusMessage());
          }else{
            System.out.println("2 ERROR : "+ar2.cause().getMessage());
          }
        });
      }else{
        System.out.println("ERROR: "+ar1.cause());
      }
    });

    startPromise.complete();

  }


  @Override
  public void stop(Promise<Void> stopPromise) throws Exception {
    stopPromise.complete();
  }
}
