import { Component, enableProdMode, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ASTWithSource } from '@angular/compiler';
import * as AWS from 'aws-sdk';
//import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
//import AWS = require('aws-sdk');

//declare const AWS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class  AppComponent implements OnInit{ 

  //imgdata = '';

  fromdt;
  todt;
  title = 'Edgetensor-app';
  reta = [];

  ngOnInit() {}
   
   bucket = new S3(
    {
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRETE_KEY',
      region: 'YOUR_REGION'
    }
  );

  check() {
    if(this.reta.length == 0 ){
      return false;
    } else {
      return true;
    }
  }
  
  getImages(fromdt, todt) { debugger; console.log(fromdt, todt, typeof(fromdt),typeof(todt));

    if(fromdt.split('T')[0] != todt.split('T')[0]) {
      alert('please select same dates');
      return;
    }

    const params = {
      Bucket: 'edgeimages/jsonobj',
      Key: 'data_json.json'
      //Body: ""
    };
    var retArray = [];
    this.bucket.getObject(params, function (err, data) {
      console.log(data);
      var decodedString = String.fromCharCode.apply(null, new Uint8Array(data.Body));
      var obj = JSON.parse(decodedString);
  
      var date = fromdt.split('T')[0] + ' ';
      var fromA = fromdt.split('T')[1].split(':');
      var fromTime = Number(fromA[0] + fromA[1]);
      var toA = todt.split('T')[1].split(':');
      var toTime = Number(toA[0] + toA[1]);

      for(var t = fromTime; t < toTime; t++) {
        for(var key in obj) {
          var formattedKey = String(t).substring(0, 2) + ':' + String(t).substring(2);
          if(String(key).startsWith(date+formattedKey)) {
            retArray.push(obj[key]);
          }
        }
      }

      console.log(obj);
      console.log(retArray);
      console.log('reta ', this.reta);
      // for(var im in retArray) {

      // }
      // this.imgdata = '';
      // for(var obs in retArray){
      //   this.imgdata += "<img src=obs.link style='width:43px;height:43px;'><br />"
      //   if(obs.flag==0){
      //     this.imgdata += "<p>Colored image!</p>";
      //   } else {
      //     this.imgdata += "<p>Grayscaled image!</p>";
      //   }
      // }

      console.log(this.reta[0].link);
      if (err) {
        console.log('There was an error downloading your file: ', err);
        return false;
      }
      console.log('Successfully downloaded file.', data);
      return true;
    });
    this.reta = retArray;
  }
  
  // ngOnInit() {
  //   this.getData();
  // }
  
  
  //OnInit() {
    // Set up credentials
    // AWS.config.update =  new aws.Credentials({
    //   accessKeyId: 'YOUR_ACCESS_KEY_ID', secretAccessKey: 'YOUR_SECRETE_KEY'
    // });

    // let s3 = new AWS.S3();

    // s3.getObject({Bucket: 'edgetensor', Key: 'jsonobj/data_json.json'}, function(err, data) {
    //   if (err) {
    //     console.log(data);
    //     console.error('Error in getting',err); // an error occurred
    //   } else {
    //     const string = new TextDecoder('utf-8').decode(data?.Body);
    //     console.log(string);
    //   }
    // });
  //}
  //var AWS: any;

/*  dispimg() { enableProdMode();
    var source = document.getElementById('img-file');
    this.image = (<HTMLImageElement>source).src
  } */

  /*AWS.config.update({accessKeyId: 'YOUR_ACCESS_KEY_ID', secretAccessKey: 'YOUR_SECRETE_KEY;
  var s3 = new AWS.S3({maxRetries: 7});
  console.log('S3 configured');
  s3.listObjects({Bucket: 'edgetensor', Prefix: 'jsonobj'});*/

}
