import * as p5 from "p5";
import "p5/lib/addons/p5.dom";
import * as ml5 from "ml5";

let video;
let features;
let knn;
// let labelP;
// let requiredP;
let ready = false;
let label = 'nothing';
let requiredArray;
let required;
let requiredUrl;
let randomShapeForRound;
let requiredTwo = 'dog';
let result;
let circular;
let circularBold;
let quImage;
let trainListImages = [];
let isResultRequired;
let logo;
let quickfox;
let finishedButton;
let yellow;
let red;
let black;
let gray;
let lightGray;
let scene;
let score;
let trainingDetail;
let trainingDetailImg;

const shapes = [
  ["t-shirt", "t-shirt"],
  ["heart", "heart"],
  ["elephant", "elephant"],
  ["quick-fox", "fox"],
  //["unicorn", "unicorn"],
  ["ice-cream", "ice cream"],
  ["crab", "crab"],
  ["killer-whale", "killer whale"],
  ["bird", "bird"],
  ["rectangle", "rectangle"],
  ["walrus", "walrus"],
  //["ninja-star", "ninja star"],
  ["fish", "fish"],
  ["owl", "owl"],
  ["x", "x"],
  ["jiggly-worm", "jiggly worm"],
  ["mouse", "mouse"],
  ["penguin", "penguin"],
  ["snake", "snake"],
  ["v", "v"],
  ["lazy-dog", "lazy dog"],
  ["airplane", "airplane"],
  ["zen-triangle", "zen triangle"],
  ["yacht", "yacht"],
  //["dinosaur", "dinosaur"]
  ["other-fish", "other fish"],
  ["gentle-cactus", "gentle cactus"]
];

const modelReady = () => {
  console.log('model ready!');
  // Comment back in to load your own model!
  knn.load('./datasets/model.json', console.log('knn loaded'));
}

const goClassify = () => {
  const logits = features.infer(video);
  knn.classify(logits, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      label = result.label;
      //console.log('Result: ' + result.label);
      goClassify();
    }
  });
}

const save = (knn, name) => {
  const dataset = knn.knnClassifier.getClassifierDataset();
  if (knn.mapStringToIndex.length > 0) {
    Object.keys(dataset).forEach(key => {
      if (knn.mapStringToIndex[key]) {
        dataset[key].label = knn.mapStringToIndex[key];
      }
    });
  }
  const tensors = Object.keys(dataset).map(key => {
    const t = dataset[key];
    if (t) {
      return t.dataSync();
    }
    return null;
  });
  let fileName = 'myKNN.json';
  if (name) {
    fileName = name.endsWith('.json') ? name : `${name}.json`;
  }
  saveFile(fileName, JSON.stringify({ dataset, tensors }));
};

const saveFile = (name, data) => {
  const downloadElt = document.createElement('a');
  const blob = new Blob([data], { type: 'octet/stream' });
  const url = URL.createObjectURL(blob);
  downloadElt.setAttribute('href', url);
  downloadElt.setAttribute('download', name);
  downloadElt.style.display = 'none';
  document.body.appendChild(downloadElt);
  downloadElt.click();
  document.body.removeChild(downloadElt);
  URL.revokeObjectURL(url);
};

const s = sk => {

  sk.preload = () => {
    circular = sk.loadFont('assets/font/C.otf');
    circularBold = sk.loadFont('assets/font/C_b.otf');
    quImage = sk.loadImage('assets/img/shapes/quick-fox.png');
  }

  sk.setup = () => {
      sk.createCanvas(window.innerWidth, window.innerHeight);

      yellow = sk.color(252, 238, 33);
      red = sk.color(255, 28, 0);
      black = '#262326';
      gray = '#4F4C4F';
      lightGray = '#706E70';

      //scene = "shapegive";
      score = 0;

      //set lines in comment to get a random shape
      // requiredArray = shapes[3];
      // required = requiredArray[1];
      // requiredUrl = 'assets/img/shapes/' + requiredArray[0] + '.png';

      //shapeGive();

      trainingZone();

      features = ml5.featureExtractor('MobileNet', modelReady);
      knn = ml5.KNNClassifier();
  };

  sk.windowResized = () => {
    console.log("resized");
    //sk.resizeCanvas(window.innerWidth, window.innerHeight);
    trainingZone();
  }

  const trainingZone = () => {
    scene = "trainingzone";
    sk.resizeCanvas(window.innerWidth, window.innerHeight * 1.5);
    sk.clear();
    sk.background(black);

    // header

    //sk.loadImage(requiredUrl, img => { sk.image(img, sk.width / 2, sk.height / 3, sk.width * 0.7, sk.width * 0.7)});
    logo = 'assets/img/tqf-logo.png';
    quickfox = 'assets/img/shapes/quick-fox.png';
    sk.imageMode(sk.CENTER);
    // 1/4th of innerHeight
    sk.loadImage(logo, img => {sk.image(img, sk.width / 2, sk.height / 6, sk.width * 0.8, sk.width * 0.08)});
    // 1/8th of innerHeight
    sk.loadImage(quickfox, img => {sk.image(img, sk.width / 2, sk.height / 12, sk.width * 0.35, sk.width * 0.35)});

    sk.textAlign(sk.CENTER);
    sk.textFont(circularBold);
    sk.textSize(25);
    sk.fill(yellow);
    // 0.3105 of innerHeight
    sk.text('TRAINING ZONE', sk.width / 2, sk.height * 0.207);

    //show all shapes
    for (var i = 0; i < shapes.length; i++) {
      trainListImages[i] = 'assets/img/shapes/' + shapes[i][0] + '.png';

      sk.fill(gray);
      sk.noStroke();
      sk.rectMode(sk.CENTER);

      let remainder = i%3;
      let divided = i / 3;
      let shapeSize = sk.width / 4;
      let border = sk.width / 16;
      let xPos = sk.width * (1/5 + (1.5/5 * remainder));
      let yPos = (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided));

      let trainShape = sk.rect(xPos, yPos, shapeSize, shapeSize);
      let trainImage = sk.loadImage(trainListImages[i], img => {sk.image(img, xPos, yPos, shapeSize, shapeSize)});
    }
  }

  const trainingZoneDetail = (detail) => {

    sk.resizeCanvas(window.innerWidth, window.innerHeight);

    trainingDetail = detail;
    trainingDetailImg = sk.loadImage('assets/img/shapes/' + shapes[trainingDetail][0] + '.png');

    scene = "trainingzonedetail";

  }

  const drawTrainingZoneDetail = () => {

    sk.clear();
    sk.background(black);

    sk.imageMode(sk.CENTER);
    sk.image(trainingDetailImg, sk.width / 2, sk.height / 8, sk.width * 0.35, sk.width * 0.35);

    let headerText = 'THE ' + shapes[trainingDetail][1].toUpperCase();

    sk.textAlign(sk.CENTER);
    sk.textFont(circularBold);


    sk.textSize(35);
    sk.fill('#ffffff');
    sk.text(headerText, sk.width / 2, sk.height / 3.8);

    sk.textSize(25);
    sk.fill(yellow);
    // 0.3105 of innerHeight
    sk.text('TRAINING ZONE', sk.width / 2, sk.height * 0.3105);

  }

  const shapeGive = () => {

    scene = "shapegive";

    //get random shape for scene
    randomShapeForRound = shapes[Math.floor(Math.random() * shapes.length)];
    requiredArray = randomShapeForRound;
    required = requiredArray[1];
    requiredUrl = 'assets/img/shapes/' + requiredArray[0] + '.png';

    //layout
    sk.clear();
    sk.background(black);
    sk.translate(sk.width - sk.width, sk.height - sk.height);
    sk.imageMode(sk.CENTER);

    sk.loadImage(requiredUrl, img => { sk.image(img, sk.width / 2, sk.height / 3, sk.width * 0.7, sk.width * 0.7)});
    //sk.image(quImage, sk.width / 2, sk.height / 3, sk.width * 0.7, sk.width * 0.7);

    sk.textFont(circularBold);
    sk.textSize(35);
    sk.textAlign(sk.CENTER);
    sk.fill('#ffffff');

    //"make a" vs. "make an"
    if (required.charAt(0) === "a" ||required.charAt(0) === "e" ||required.charAt(0) === "i" ||required.charAt(0) === "o" ||required.charAt(0) === "u" ||required.charAt(0) === "x") {
      sk.text('Make an ' + required, sk.width / 2, sk.height / 2 + 40);
    } else {
      sk.text('Make a ' + required, sk.width / 2, sk.height / 2 + 40);
    }

    //finish button
    finishedButton = sk.createButton("I'M FINISHED");
    finishedButton.position(sk.width * 0.1, sk.height * 0.65);
    finishedButton.style('background-color', yellow);
    finishedButton.style('border', 'none');
    finishedButton.style('font-family', 'Circular Pro');
    finishedButton.style('font-weight', 'bold');
    finishedButton.style('font-size', '25pt');
    finishedButton.size(sk.width * 0.8, 70);
    finishedButton.mousePressed(changeScene);

  };

  const changeScene = () => {
    if (scene === "shapegive") {
      scene = "shapecheck";
      if (scene === "shapecheck") {
        sk.clear();
        sk.fill(black);
        //sk.rect(0, sk.height / 2, sk.width, sk.height / 2);
        //finishedButton.style("display", "none");
        finishedButton.remove();
        video = sk.createCapture(sk.VIDEO);
        video.size(sk.width,sk.height/2);
        video.style("transform", "scale(-1,1)");
        video.hide();
        return
      }
    }
    if (scene === "shapecheck") {
      scene = "shape";
      console.log("ik werk maar de 2de keer dat ik deze functie uitvoer");
      if (isResultRequired = true) {
        score = score + 5;
        console.log('Score ' + score);
        shapeGive();
        return
      }
      if (isResultRequired = false) {
        score = score + 0;
        console.log('Score ' + score);
        console.log('niet juist');
        shapeGive();
        return
      }
    }
  };

  const shape = () => {
    sk.clear();
  }

  const shapeCheck = () => {
    //sk.clear();
    sk.background(black);

    sk.imageMode(sk.CENTER);
    sk.image(quImage, sk.width / 2, sk.height * 0.68, sk.width * 0.6, sk.width * 0.6);

    sk.translate(sk.width / 2, sk.height / 2);
    sk.textFont(circularBold);
    sk.textSize(30);
    sk.textAlign(sk.CENTER);
    sk.fill('#ffffff');
    sk.text('Show your ' + required, 0, sk.height / 2 - sk.height / 8);

    sk.imageMode(sk.CORNER);
    sk.image(video, - sk.width/2, - sk.height/2);

    if (!ready && knn.getNumLabels() > 0) {
      goClassify();
      ready = true;
    }
    if (knn.getNumLabels() > 0) {
      if (label === "empty") {
        console.log("try to aim your camera to your origami creation");
      } else {
        if (label === required) {
          sk.clear();
          sk.background(yellow);
          sk.imageMode(sk.CORNER);
          sk.image(video, - sk.width/2, - sk.height/2);
          sk.textSize(100);
          sk.fill(0);
          sk.text('+ 5', 0, sk.height / 4);
          isResultRequired = true;
          setTimeout(changeScene, 1000);
          return
        } else {
          sk.clear();
          sk.background(red);
          sk.imageMode(sk.CORNER);
          sk.image(video, - sk.width/2, - sk.height/2);
          sk.textSize(50);
          sk.fill('#ffffff');
          sk.text('Not quite right', 0, sk.height / 4);
          isResultRequired = false;
          setTimeout(changeScene, 1000);
          return
        }
      }
    }
  }

  const SuccessCheck = () => {

  }

  sk.keyPressed = () => {
    if (scene === "shapecheck" && knn.getNumLabels() > 0) {
      const logits = features.infer(video);
      if (sk.key == 'd') {
        knn.addExample(logits, 'dog');
        console.log('dog');
      } else if (sk.key == 'f') {
        knn.addExample(logits, 'fox');
        console.log('fox');
      } else if (sk.key == 't') {
        knn.addExample(logits, 'triangle');
        console.log('triangle');
      } else if (sk.key == 'e') {
        knn.addExample(logits, 'empty');
        console.log('empty');
      } else if (sk.key == 's') {
        save(knn, 'model.json');
        //knn.save('model.json');
      }
    }
  }


  sk.touchStarted = () => {
    if (scene === "trainingzone") {
      for (var i = 0; i < shapes.length; i++) {
        sk.fill(lightGray);
        sk.noStroke();
        sk.rectMode(sk.CENTER);

        let remainder = i%3;
        let divided = i / 3;
        let shapeSize = sk.width / 4;
        let border = sk.width / 16;
        let xPos = sk.width * (1/5 + (1.5/5 * remainder));
        let yPos = (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided));

        //check if mouseposition is on shape
        if (
          sk.mouseX > (xPos - (shapeSize / 2)) &&
          sk.mouseX < (xPos + (shapeSize / 2)) &&
          sk.mouseY > (yPos - (shapeSize / 2)) &&
          sk.mouseY < (yPos + (shapeSize / 2))
        ) {
            // style
            let trainShape = sk.rect(xPos, yPos, shapeSize, shapeSize);
            let trainImage = sk.loadImage(trainListImages[i], img => {sk.image(img, xPos, yPos, shapeSize, shapeSize)});


            setTimeout(trainingZoneDetail, 100, i);

        }
      }
    } else {
      console.log("🦊");
    }
  }

  sk.draw = () => {

    // if (scene = "trainingzone") {
    //   //console.log("x" + sk.mouseX + "y" + sk.mouseY);
    //   for (var i = 0; i < shapes.length; i++) {
    //     //trainListImages[i] = 'assets/img/shapes/' + shapes[i][0] + '.png';
    //
    //     sk.fill(lightGray);
    //     sk.noStroke();
    //     sk.rectMode(sk.CENTER);
    //
    //     let remainder = i%3;
    //     let divided = i / 3;
    //     let shapeSize = sk.width / 4;
    //     let border = sk.width / 16;
    //     let trainImage;
    //     if (remainder == 0) {
    //       //check if hovering over first row shape
    //       if (
    //         sk.mouseX > (sk.width / 5 - (shapeSize / 2)) &&
    //         sk.mouseX < (sk.width / 5 + (shapeSize / 2)) &&
    //         sk.mouseY > ((sk.height / 3.65) + ((shapeSize + border) * divided) - (shapeSize / 2)) &&
    //         sk.mouseY < ((sk.height / 3.65) + ((shapeSize + border) * divided) + (shapeSize / 2))) {
    //           //console.log(trainListImages[i]);
    //           let trainShape = sk.rect(sk.width / 5, (sk.height / 3.65) + ((shapeSize + border) * divided), shapeSize, shapeSize );
    //           trainImage = sk.loadImage(trainListImages[i], img => {
    //             sk.image(
    //                 img,
    //                 sk.width / 5,
    //                 (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided)),
    //                 shapeSize,
    //                 shapeSize
    //             )
    //           });
    //           //console.log(trainImage);
    //           // if (sk.rect.mousePressed) {
    //           //   console.log(trainListImages[i]);
    //           // }
    //       }
    //       //first row
    //       //sk.rect(sk.width / 5, (sk.height / 3.65) + ((shapeSize + border) * divided), shapeSize, shapeSize );
    //       //sk.loadImage(trainListImages[i], img => {sk.image(img, sk.width / 5, (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided)), shapeSize, shapeSize )});
    //     }
    //
    //     console.log(trainImage);
    //
    //     if (remainder == 1) {
    //       //second row
    //       //sk.rect(sk.width / 2, (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided)), shapeSize, shapeSize );
    //       //sk.loadImage(trainListImages[i], img => {sk.image(img, sk.width / 2, (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided)), shapeSize, shapeSize )});
    //     }
    //
    //     if (remainder == 2) {
    //       //third row
    //       //sk.rect(sk.width * (4/5), (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided)), shapeSize, shapeSize );
    //       //sk.loadImage(trainListImages[i], img => {sk.image(img, sk.width * (4/5), (sk.height / 3.65) + ((shapeSize + border) * Math.floor(divided)), shapeSize, shapeSize )});
    //     }
    //   }
    // }

    if (scene === "shapecheck") {
      // shapecheck needs to be in the draw function for the video capture
      shapeCheck();
      console.log(isResultRequired);
    }

    if (scene === "trainingzonedetail") {
      drawTrainingZoneDetail();
    }

  };
}


const P5 = new p5(s);