//Get Document Elements
const camera = document.querySelector('#webcam');

const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#btnScreenshot');
const closeBtn = document.querySelector('.close');

const gallery = document.querySelector('#gallery');


// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = 'block';
  camera.style.display = 'none';
  gallery.style.display = 'none';
}

// Close
function closeModal() {
  modal.style.display = 'none';
  camera.style.display = 'block';
  gallery.style.display = 'block';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    closeModal();
  }
}

// const btnUpload = document.querySelector("#btnUpload");
btnUpload.addEventListener('click', function() {
  closeModal();
  window.location.hash = "gallery";
});

const btnRetake = document.querySelector("#btnRetake");
btnRetake.addEventListener('click', function() {
  closeModal();
  window.location.hash = "camera";
});