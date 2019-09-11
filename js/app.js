const mainContainer = document.querySelector('.main-container');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

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
  json.results.forEach(element => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

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

// event listener to enable modal
mainContainer.addEventListener('click', (event) => {
  const cardElements = document.querySelectorAll('.card');
  console.log(cardElements);

  // if (event.target === cardElement) {
  //   console.log(event.target);
  // }
});
