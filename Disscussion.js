const MessageCtnr = document.getElementById('MessageCtnr');
const NameInp = document.getElementById('NameInp');
const MessageInp = document.getElementById('MessageInp');
const SendBtn = document.getElementById('SendBtn');

let db;
// Open or create a database
const dbName = 'Chat';
const dbVersion = 1;
const request = indexedDB.open(dbName, dbVersion);

request.onsuccess = (event) => {
  console.log('Database opened successfully');
  db = event.target.result;
};
request.onerror = (event) => {
  console.error('Error opening database:', event.target.error);
};

request.onupgradeneeded = (event) => {
  const objectStore = event.target.result.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
};

//Send message
function sendMessage(username, message){
  
  const timestamp = new Date().toISOString();

  const transaction = db.transaction('messages', 'readwrite');
  const objectStore = transaction.objectStore('messages');
  const addMessage = objectStore.add({ username: username, content: message, timestamp: timestamp });

  addMessage.onsuccess = (event) => {
    console.log('Message sent:', message);
    
    displayMessages();
  };
  addMessage.onerror = (event) => {
    console.error('Error sending message:', event.target.error);
  };
}

//Display messages
function displayMessages() {
  MessageCtnr.innerHTML = '';

  const transaction = db.transaction('messages','readonly');
  const objectStore = transaction.objectStore('messages');
  const getAllMess = objectStore.getAll();

  getAllMess.onsuccess = (event) => {
    const messages = event.target.result;

    messages.forEach(message => {
      const MessageP = document.createElement('p');

      MessageP.textContent = `${message.username} (${message.timestamp}): ${message.content}`;
      MessageCtnr.appendChild(MessageP);
      
    });
  }
  getAllMess.onerror = (event) => {
    console.error('Error retrieving messages:', event.target.error);
  };
}

SendBtn.addEventListener('click', () => {
  const username = NameInp.value.trim();
  const message = MessageInp.value.trim();

  if (username !== '' && message !== '') {
    sendMessage(username, message);
    MessageInp.value = '';
  }
});

window.addEventListener("load",() => {displayMessages()});

/*--------------------------------Delete messages for Testing purposes----------------------------------
function deleteMessages() {
  const transaction = db.transaction('messages','readwrite');
  const objectStore = transaction.objectStore('messages');
  const deleteMess = objectStore.clear();

  deleteMess.onsuccess = (event) => {
    console.log('Messages deleted successfully');
  };
  deleteMess.onerror = (event) => {
    console.error('Error deleting messages:', event.target.error);
  };
}
//delete messages for testing purposes
window.addEventListener("unload",() => {deleteMessages()});
*/