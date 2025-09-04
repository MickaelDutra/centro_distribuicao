const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
const inputoccurrence = document.querySelector('.input-occurrence');
const inputStatus = document.querySelector('.input-status');



const fetchoccurrences = async () => {
  const response = await fetch('http://10.0.6.185:3000/occurrences')
  const occurrences = await response.json()
  return occurrences;
}

const addoccurrence = async (event) => {
  event.preventDefault();

  const occurrence = { title: inputoccurrence.value, status: inputStatus.value };

  await fetch('http://10.0.6.185:3000/occurrences', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(occurrence),
  });


  loadoccurrences();
  inputoccurrence.value = '';
}

const deleteoccurrence = async (id) => {
  await fetch(`http://10.0.6.185:3000/occurrences/${id}`, {
    method: 'delete',
  });

  loadoccurrences();
}

const updateoccurrence = async ({ id, title, status }) => {

  await fetch(`http://10.0.6.185:3000/occurrences/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, status }),
  });

  loadoccurrences();
}



const formatDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle: 'short' };
  const date = new Date(dateUTC).toLocaleString('pt-br', options);
  return date;
}

const createElement = (tag, innerText = '', innerHTML = '') => {
  const element = document.createElement(tag);

  if (innerText) {
    element.innerText = innerText;
  }

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
}

const createSelect = (value) => {
  const options = `
    <option value="Travou em 83% (10min)">Travou em 83% (10min)</option>
    <option value="Processou porém manteve os paletes">Processou porém manteve os paletes</option>
    <option value="Outro Motivo">Outra(descreva na ocorrência)</option>
  `;

  const select = createElement('select', '', options);

  select.value = value;

  return select;
}



const createRow = (occurrence) => {

  const { id, title, created_at, status } = occurrence;

  const tr = createElement('tr');
  const tdTitle = createElement('td', title);
  const tdCreatedAt = createElement('td', formatDate(created_at));
  const tdStatus = createElement('td', status);
  const tdActions = createElement('td');

  const select = createSelect(status);

  select.addEventListener('change', ({ target }) => updateoccurrence({ ...occurrence, status: target.value }));

  const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit_square</span>');
  const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete_forever</span>');
  
  const editForm = createElement('form');
  const editInput = createElement('input');

  editInput.value = title;
  editForm.appendChild(editInput);
  
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    updateoccurrence({ id, title: editInput.value, status });
  });

  editButton.addEventListener('click', () => {
    tdTitle.innerText = '';
    tdTitle.appendChild(editForm);
    tdStatus.appendChild(select);
  });

  editButton.classList.add('btn-action');
  deleteButton.classList.add('btn-action');

  deleteButton.addEventListener('click', () => deleteoccurrence(id));
  
  

  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  tr.appendChild(tdTitle);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdStatus);
  tr.appendChild(tdActions);

  return tr;
}

const loadoccurrences = async () => {
  const occurrences = await fetchoccurrences();

  tbody.innerHTML = '';

  occurrences.forEach((occurrence) => {
    const tr = createRow(occurrence);
    tbody.appendChild(tr);
  });
}


addForm.addEventListener('submit', addoccurrence);

loadoccurrences();

