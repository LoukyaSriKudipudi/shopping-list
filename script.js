const form = document.querySelector('form');
const itemsContainer = document.querySelector('#itemsContainer');
const clearAll = document.querySelector('#clearAll');
const search = document.querySelector('#search');
const weather = document.getElementById('weather');

// format time
function getTime() {
  const now = new Date();
  return now.toLocaleString('default', {
    weekday: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// fetch weather
async function getWeather(lat, lon) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=e5790c66878544a5a0a132636251408&q=${lat},${lon}`
  );
  const data = await res.json();

  function renderWeather() {
    const timeNow = getTime();
    weather.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 weatherIcon" width="16px" style="margin-right: 0.5rem">
        <path d="M1 12.5A4.5 4.5 0 0 0 5.5 17H15a4 4 0 0 0 1.866-7.539 3.504 3.504 0 0 0-4.504-4.272A4.5 4.5 0 0 0 4.06 8.235 4.502 4.502 0 0 0 1 12.5Z" />
      </svg> 
      Temp. ${data.current.temp_c}°C <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5" width="16px" style="margin-right: 0.5rem; margin-left: 0.5rem">
  <path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.919Z" clip-rule="evenodd" />
</svg>

 Cond. ${data.current.condition.text}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 timeIcon" width="16px" style="margin-right: 0.5rem; margin-left: 0.5rem">
        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd"/>
      </svg> 
      ${timeNow}
    `;
  }

  renderWeather();
  setInterval(renderWeather, 60000); // update every 1 min
}

// get location by IP
async function getIp() {
  const res = await fetch('https://ipwhois.app/json/');
  const data = await res.json();
  getWeather(data.latitude, data.longitude);
}

getIp();

// Render function
function renderItems(storedItems) {
  itemsContainer.innerHTML = '';

  if (storedItems.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No Saved Items';
    itemsContainer.appendChild(li);
    return;
  }

  storedItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('listItem');
    li.dataset.index = index;

    // icon + text wrapper
    const content = document.createElement('div');
    content.classList.add('item-content');

    // icon
    const icon = document.createElement('span');
    icon.classList.add('item-icon');
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
  <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
  <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
</svg>
`;

    // text
    const span = document.createElement('span');
    span.classList.add('item-text');
    span.textContent = item.text;
    if (item.done) span.classList.add('strikeItem');

    // append icon + text
    content.appendChild(icon);
    content.appendChild(span);

    // delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4" width=16px>
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
</svg>
`;
    deleteBtn.classList.add('itemDeleteButton');
    deleteBtn.addEventListener('click', () => deleteItem(index));

    // append to li
    li.appendChild(content);
    li.appendChild(deleteBtn);
    itemsContainer.appendChild(li);
  });
}

// Add item
function addItem(item) {
  const storedItems = JSON.parse(localStorage.getItem('items')) || [];

  if (!item.trim()) {
    alert('Please enter a valid item');
    return;
  }

  if (storedItems.some((obj) => obj.text === item)) {
    alert('Item already added');
    return;
  }

  if (item.length > 50) {
    alert('Item is too long (max 50 characters)');
    return;
  }

  storedItems.unshift({ text: item, done: false });

  localStorage.setItem('items', JSON.stringify(storedItems));
  renderItems(storedItems);
}

// Delete item
function deleteItem(index) {
  const storedItems = JSON.parse(localStorage.getItem('items')) || [];
  storedItems.splice(index, 1);
  localStorage.setItem('items', JSON.stringify(storedItems));
  renderItems(storedItems);
}

// Strike-through on right-click
function strikeThrough(e) {
  e.preventDefault();
  const li = e.target.closest('li');
  if (!li || !li.dataset.index) return;

  const storedItems = JSON.parse(localStorage.getItem('items')) || [];
  const index = parseInt(li.dataset.index);

  if (!storedItems[index]) return;
  storedItems[index].done = !storedItems[index].done;

  localStorage.setItem('items', JSON.stringify(storedItems));
  renderItems(storedItems);
}

itemsContainer.addEventListener('contextmenu', strikeThrough);

// Edit on click
function editItem(e) {
  const li = e.target.closest('li');
  if (!li || !li.dataset.index) return;

  const index = parseInt(li.dataset.index);
  const storedItems = JSON.parse(localStorage.getItem('items')) || [];
  if (!storedItems[index] || storedItems[index].done) return;

  const span = li.firstElementChild.lastElementChild;
  span.setAttribute('contenteditable', true);
  span.focus();

  function saveEdit() {
    storedItems[index].text = span.textContent.trim();
    localStorage.setItem('items', JSON.stringify(storedItems));
    span.removeAttribute('contenteditable');
    renderItems(storedItems);
  }

  span.addEventListener('blur', saveEdit, { once: true });
  span.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEdit;
    }
  });
}

itemsContainer.addEventListener('click', editItem);

// Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const item = e.target.item.value.trim();
  if (item) {
    addItem(item);
    e.target.reset();
  }
});

// Clear all
clearAll.addEventListener('click', () => {
  if (confirm('Are you sure?')) {
    localStorage.removeItem('items');
    renderItems([]);
  }
});

// Load on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const storedItems = JSON.parse(localStorage.getItem('items')) || [];
  renderItems(storedItems);
});

//  search items
function searchItems(e) {
  const storedItems = JSON.parse(localStorage.getItem('items')) || [];

  const searchedItems = storedItems.filter((item) =>
    item.text.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderItems(searchedItems);
}

search.addEventListener('input', searchItems);
