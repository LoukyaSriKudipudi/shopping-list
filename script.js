const form = document.querySelector('form');
const itemsContainer = document.querySelector('#itemsContainer');
const clearAll = document.querySelector('#clearAll');
const search = document.querySelector('#search');
const time = document.getElementById('time');

function getTime() {
  const now = new Date();
  let dateTime = now.toLocaleString('en-IN');
  dateTime = dateTime.replace(/\b(am|pm)\b/gi, '');
  time.textContent = dateTime;
}

setInterval(getTime, 1000);
getTime();

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
  
  if (storedItems.some((obj) => obj.text === item)) {
    alert('Item already added');
  } else {
    storedItems.unshift({ text: item, done: false });
  }

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
