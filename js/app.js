const mainContainer = document.querySelector('.main-container');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
let fetchResponseData = [];

// fetch function to get data from API
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    // .then(data => console.log(data))
    .then(generateHTML)
    .catch(error => console.log('Looks like there was a problem!', error))
}

fetchData('https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,phone,dob')


// function to check the status of the fetch request
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

// function to dynamically generate html elements
function generateHTML(json) {
  fetchResponseData = json.results;

  json.results.forEach( (element, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.setAttribute('data-index', `${index}`);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('card-image-container');

    const cardContentDiv = document.createElement('div');
    cardContentDiv.classList.add('card-content');

    imageDiv.innerHTML = `<img src="${element.picture.large}" alt="headshot">`;
    cardContentDiv.innerHTML = `
      <h5 class="name">${element.name.first} ${element.name.last}</h5>
      <p class="email">${element.email}</p>
      <p class="city">${element.location.city}</p>
    `;

    cardDiv.appendChild(imageDiv);
    cardDiv.appendChild(cardContentDiv);
    mainContainer.appendChild(cardDiv);
  });
}


function modalInfo(index) {
  const modalDetails = fetchResponseData[index];
  let date = new Date(modalDetails.dob.date)

  let modalHTML = `
    <img src="${modalDetails.picture.large}" alt="headshot" class="modal-image">
    <div class="">
      <h5 class="name">${modalDetails.name.first} ${modalDetails.name.last}</h5>
      <p class="email margin-b">${modalDetails.email}</p>
      <p class="city">${modalDetails.location.city}</p>
      <hr class="hr-style">
      <p class="city margin-b">${modalDetails.phone}</p>
      <p class="city margin-b">${modalDetails.location.street}, ${modalDetails.location.state}&nbsp 
      ${modalDetails.location.postcode}</p>
      <p class="city margin-b">Birthday: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
  `;

  modalContent.innerHTML = modalHTML;
  overlay.classList.remove('hidden');
}


// event listener to enable modal
mainContainer.addEventListener('click', (event) => {
  // if click grid container null is returned to console so this if statement prevents that from happening
  if (event.target !== mainContainer) {
    const cardElement = event.target.closest('.card');
    let cardClickedIndex = cardElement.getAttribute('data-index');

    modalInfo(cardClickedIndex);
  }
});

modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
});
