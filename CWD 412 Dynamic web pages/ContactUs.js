
const DoneBtn = document.getElementById('DoneBtn');
const OpenDBBtn = document.getElementById('OpenDBBtn');
const NameInp = document.getElementById('NameInp');
const EmailInp = document.getElementById('emailInp');

let db;

// Open or create a database
const dbName = "CU_Subs_DB";
const dbVersion = 1;
const request = indexedDB.open(dbName, dbVersion);


request.onsuccess = function(event) {
  db = event.target.result;
  console.log("Database opened successfully");
};

request.onerror = function(event) {
  console.error("Database error: " + event.target.errorCode);
};

request.onupgradeneeded = function(event) {
  const db = event.target.result;
// Create object store
const objectStore = db.createObjectStore("Subscribers", { keyPath: "id", autoIncrement: true });

objectStore.createIndex("name", "name", { unique: false });
objectStore.createIndex("email", "email", { unique: true });
console.log("Database setup complete");
};
function emailSub(Fullname, email) {
  const transaction = db.transaction(["Subscribers"], "readwrite");
  const objectStore = transaction.objectStore("Subscribers");
 
  const request = objectStore.add({ name: Fullname, email: email });
  
  request.onsuccess = function(event) {
    console.log("Subscribed successfully");
    NameInp.value = ""; 
    EmailInp.value = "";

  }
  
  request.onerror = function(event) {
    console.error("error: " + event.target.errorCode);
  };
}

function dispTopHatsSubs() {
  //Enter a Password to continue
  const password = prompt("Enter password to continue");
  if (password === "123") {
    // Display all subscribers in the main window
    const transaction = db.transaction(["Subscribers"], "readwrite");
    const objectStore = transaction.objectStore("Subscribers");
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
      const Subscribers = event.target.result;

      // Create table element
      const table = document.createElement("table");
      table.border = "1 white solid";
      table.style.backgroundColor = "rgba(245, 226, 192, 0.811)";
      table.style.color = "black";
      table.style.width = "fit-content";

      // Create table header row
      const headerRow = document.createElement("tr");
      ["ID", "Name", "Email"].forEach(function(headerText) {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Create table data rows
      Subscribers.forEach(function(subscriber) {
        const row = document.createElement("tr");
        [subscriber.id, subscriber.name, subscriber.email].forEach(function(cellText) {
          const td = document.createElement("td");
          td.style.backgroundColor = "white";
          td.textContent = cellText;
          row.appendChild(td);
        });
        table.appendChild(row);
      });

      //Add table below the OpenDB Button
      const openDBBtn = document.getElementById("OpenDBBtn");
      openDBBtn.parentNode.insertBefore(table, openDBBtn.nextSibling);

      //Button to delete a subscriber
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete Subscriber";
      deleteBtn.style.backgroundColor = "rgba(245, 226, 192, 0.811)";
      deleteBtn.style.color = "black";
      deleteBtn.style.width = "fit-content";
      deleteBtn.addEventListener("click", () => {
        const id = prompt("Enter an id to delete")
        const transaction = db.transaction(["Subscribers"], "readwrite");
        const objectStore = transaction.objectStore("Subscribers");
        const request = objectStore.delete(parseInt(id));

        request.onsuccess = function(event) {
          console.log("Subscriber deleted successfully");
          location.reload();
        };
        request.onerror = function(event) {
          console.error("Delete Subscriber error: " + event.target.errorCode);
        };

      });  
      table.parentNode.insertBefore(deleteBtn, table.nextSibling);
    };

    request.onerror = function(event) {
      console.error("Display Subscribers error: " + event.target.errorCode);
    };
    

  } else {
    alert("Incorrect Password")
  }
};

//EventListeners
DoneBtn.addEventListener("click", () => {
  const Fullname = NameInp.value;
  const email = EmailInp.value;

  if (Fullname !== '' && email !== '') {
    emailSub(Fullname, email);
  }
});

OpenDBBtn.addEventListener("click", () => {
  location.reload();
  dispTopHatsSubs();
});
