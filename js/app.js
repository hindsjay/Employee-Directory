// global variables
const mainContainer = document.querySelector('.main-container');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const inputBar = document.getElementById('input-bar');
const toggle = document.getElementById('toggle');
let cardClickedIndex;
let chevronLeft;
let chevronRight;
let fetchResponseData = [];


// fetch function to get data from API
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(generateHTML)
    .catch(error => console.log('Looks like there was a problem!', error))
}


// to fetch data from randomuser API
fetchData('https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,phone,dob')

// check local storage settings
localStorageCheck();


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

  fetchResponseData.forEach( (element, index) => {
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


// to create elements for the modal window
function modalInfo(index) {
  const modalDetails = fetchResponseData[index];
  let date = new Date(modalDetails.dob.date)

  let modalHTML = `
    <img src="${modalDetails.picture.large}" alt="headshot" class="modal-image">
    <div>
      <h5 class="name">${modalDetails.name.first} ${modalDetails.name.last}</h5>
      <p class="email margin-b">${modalDetails.email}</p>
      <p class="city">${modalDetails.location.city}</p>
      <hr class="hr-style">
      <p class="city margin-b">${modalDetails.phone}</p>
      <p class="city margin-b">${modalDetails.location.street}, ${modalDetails.location.state}&nbsp 
      ${modalDetails.location.postcode}</p>
      <p class="city margin-b">Birthday: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    <div class="chevrons">
      <i class="fa fa-angle-left"></i>
      <i class="fa fa-angle-right"></i>
    </div>
  `;

  modalContent.innerHTML = modalHTML;

  chevronLeft = document.querySelector('.fa-angle-left');
  chevronRight = document.querySelector('.fa-angle-right');

  checkIndex(index);
  overlay.classList.remove('hidden');
}


// event listener to enable modal
mainContainer.addEventListener('click', (event) => {
  // if grid container is clicked, error is thrown to console.  This if statement prevents that from happening
  if (event.target !== mainContainer) {
    const cardElement = event.target.closest('.card');
    cardClickedIndex = parseInt(cardElement.getAttribute('data-index'));
    
    window.scroll(0,0);
    modalInfo(cardClickedIndex);
  }
});


// event listener for close button on modal
modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
});


//search functionality
inputBar.addEventListener('keyup', () => {
  let filter = inputBar.value.toLowerCase();
  let cardContentCollection = document.querySelectorAll('.card-content');

  for (let i = 0; i < cardContentCollection.length ; i++) {
    let elementNamesCollection = cardContentCollection[i].firstElementChild.innerHTML;

    if (elementNamesCollection.toLowerCase().indexOf(filter) > -1) {
      cardContentCollection[i].parentNode.style.display = '';
    } else {
      cardContentCollection[i].parentNode.style.display = 'none';
    }
  }
});


// function to switch employee details when modal activated
modalContent.addEventListener('click', (event) => {
  if (event.target === chevronLeft || event.target === chevronRight) {
    if (event.target === chevronLeft && cardClickedIndex > 0) {
      cardClickedIndex--;
    } else if (event.target === chevronRight && cardClickedIndex < 11) {
      cardClickedIndex++;
    }
    modalInfo(cardClickedIndex);
  }
});


// to check if we are at index 0 or 11 - if so, then hide appropriate chevron in modal
function checkIndex(index) {
  if (index === 0) {
    chevronLeft.style.opacity = '0';
  }
  if (index === 11) {
    chevronRight.style.opacity = '0';
  }
}


// function to update dark theme to on/off in localStorage and on screen
function updateTheme() {
  if (toggle.checked) {
    localStorage.setItem('Dark-Theme', 'on')
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('Dark-Theme', 'off')
  }
}


// event listener for theme toggle
toggle.addEventListener('click', updateTheme);


// check what value for theme is in local storage
function localStorageCheck() {
  if (typeof(localStorage) !== "undefined") {
    let storageThemeValue = localStorage.getItem('Dark-Theme')
  
    if (storageThemeValue === 'off') {
      toggle.checked = false;
    } else {
      toggle.checked = true;
      updateTheme();
    }
  }
}