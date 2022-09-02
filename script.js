// get page elements
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const video = document.querySelector("#video");
const screenshotsContainer = document.querySelector(".image-grid");

const btnScreenshot = document.querySelector("#btnScreenshot");
const btnUpload = document.querySelector("#btnUpload");





// video constraints
const constraints = {
  video: {
    width: {
      min: 1280,
      max: 2560,
    },
    height: {
      min: 720,
      max: 1440,
    },
  },
};

// use front face camera
let useFrontCamera = true;

// current video stream
let videoStream;

pullImages();

console.log(isPortrait())



// take screenshot
btnScreenshot.addEventListener("click", function() {
  const img = document.createElement("img");
  if (isPortrait()) {
    context.drawImage(video, 0, 0, 720, 1280);
  }
  else {
    context.drawImage(video, 0, 0, 720, 1280);
  }

  img.src = canvas.toDataURL("image/png");



  /* BORDER */
  //excuse the lazy code i will do better next time - nick
  const borderBtn1 = document.querySelector("#borderBtn1");
  const borderBtn2 = document.querySelector("#borderBtn2");
  const borderBtn3 = document.querySelector("#borderBtn3");
  const borderBtn4 = document.querySelector("#borderBtn4");
  const borderBtn5 = document.querySelector("#borderBtn5");
  let border = new Image();
  let filtered = false;


  borderBtn1.addEventListener("click", function() {
    border.src = "Border1.png";
    if (filtered) {
      context.drawImage(img, 0, 0, 720, 1280);
    }
    context.drawImage(border, 0, 0, 720, 1280);
    fitered = true;
  });

  borderBtn2.addEventListener("click", function() {
    border.src = "Border2.png";
    if (filtered) {
      context.drawImage(img, 0, 0, 720, 1280);
    }
    context.drawImage(border, 0, 0, 720, 1280);
    fitered = true;
  });

  borderBtn3.addEventListener("click", function() {
    border.src = "Border3.png";
    if (filtered) {
      context.drawImage(img, 0, 0, 720, 1280);
    }
    context.drawImage(border, 0, 0, 720, 1280);
    fitered = true;
  });

  borderBtn4.addEventListener("click", function() {
    border.src = "Border4.png";
    if (filtered) {
      context.drawImage(img, 0, 0, 720, 1280);
    }
    context.drawImage(border, 0, 0, 720, 1280);
    fitered = true;
  });

  borderBtn5.addEventListener("click", function() {
    border.src = "Border5.png";
    if (filtered) {
      context.drawImage(img, 0, 0, 720, 1280);
    }
    context.drawImage(border, 0, 0, 720, 1280);
    fitered = true;
  });



  /* REVERT */
  const revertBtn = document.querySelector("#btnRevert");

  revertBtn.addEventListener("click", function() {
    context.drawImage(img, 0, 0, 720, 1280);
  });
});



//Upload image to gallery
btnUpload.addEventListener("click", function() {
  const img = document.createElement("img");
  img.src = canvas.toDataURL("image/png");
  console.log(img.src);
  var imgstr = img.src;
  imgstr = imgstr.slice(22);
  console.log(imgstr);
  uplimg(imgstr);
  screenshotsContainer.prepend(img);

});


// stop video stream
function stopVideoStream() {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

// Initialize Camera
async function initializeCamera() {
  stopVideoStream();
  constraints.video.facingMode = useFrontCamera ? "user" : "environment";

  try {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = videoStream;
  } catch (err) {
    alert("Could not access the camera");
  }
}

initializeCamera();

//function to upload image to imgur api
async function uplimg(imagedata) {
  const encodedParams = new URLSearchParams();
  encodedParams.append("image", imagedata);

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer da7a91b667d2433039c3a3e29aebe73d26650c9f',
      'X-RapidAPI-Key': '7af2f43e27msh7847b6f6fed0cfap111851jsn6cb2ad420860',
      'X-RapidAPI-Host': 'imgur-apiv3.p.rapidapi.com'
    },
    body: encodedParams
  };

  try {
    let response = await fetch('https://imgur-apiv3.p.rapidapi.com/3/image', options);
    let result = await response.json();
    console.log(result);
    console.log(result.data.id);
    addtoalbum(result.data.id);
  } catch (e) {
    console.log(e);
  }

}

//adds uploaded image to album so entire album can be returned as an array
async function addtoalbum(imageID) {
  const albumencodedParams = new URLSearchParams();
  albumencodedParams.append("ids[]", imageID);

  const albumoptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer da7a91b667d2433039c3a3e29aebe73d26650c9f',
      'X-RapidAPI-Key': '7af2f43e27msh7847b6f6fed0cfap111851jsn6cb2ad420860',
      'X-RapidAPI-Host': 'imgur-apiv3.p.rapidapi.com'
    },
    body: albumencodedParams
  };

  fetch('https://imgur-apiv3.p.rapidapi.com/3/album/Pmm9wuf/add', albumoptions)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

//pull image album from imgur to load gallery
async function pullImages() {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer da7a91b667d2433039c3a3e29aebe73d26650c9f',
      'X-RapidAPI-Key': '7af2f43e27msh7847b6f6fed0cfap111851jsn6cb2ad420860',
      'X-RapidAPI-Host': 'imgur-apiv3.p.rapidapi.com'
    }
  };

  try {
    let response = await fetch('https://imgur-apiv3.p.rapidapi.com/3/album/Pmm9wuf/images', options);
    console.log(response);
    let result = await response.json();
    console.log(result);
    renderGallery(result.data);
  } catch (e) {
    console.log(e);
  }
}

function renderGallery(pics) {
  console.log(pics);
  pics.reverse();
  const gal = document.querySelector(".image-grid");
  let rendered = '';

  for (let pic of pics) {
    rendered += `<img src="${pic.link}" width= "400">`;
  }
  gal.innerHTML = rendered;
}


//check device orientation

function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

