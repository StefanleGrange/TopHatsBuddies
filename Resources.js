let db;

const dbName = "ResourceDB";
const dbVersion = 1;
const request = indexedDB.open(dbName, dbVersion);
request.onerror = function(event){
  console.error("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event){
  db = event.target.result;
  console.log("Database opened successfully");
  displayFiles();
};

request.onupgradeneeded = function(event){
  const db = event.target.result;
  const objectStore = db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
  //indexes
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("type", "type", { unique: false });
  objectStore.createIndex("size", "size", { unique: false });

  console.log("Database setup complete");
};

//Upload function
function uploadFile(){
  const fileInput = document.getElementById("FileInp");
  const file = fileInput.files[0];

  const transaction = db.transaction(["files"], "readwrite");
  const objectStore = transaction.objectStore("files");

  const request = objectStore.add({ name: file.name, type: file.type, size: file.size, data: file });

  request.onsuccess = function(event){
    console.log("File uploaded successfully");
    fileInput.value = "";
    displayFiles();
  };

  request.onerror = function(event){
    console.error("File upload error: " + event.target.errorCode);
  };
}
//Display Function
function displayFiles(){
  const transaction = db.transaction(["files"], "readonly");
  const objectStore = transaction.objectStore("files");
  const request = objectStore.getAll();

  request.onsuccess = function(event){
    const files = event.target.result;
    const FileTBody = document.getElementById("FileTBody");
    FileTBody.innerHTML = "";

    files.forEach(file => {
      const tr = document.createElement("tr");
      const Nametd = document.createElement("td");
      Nametd.textContent = file.name;
      const Sizetd = document.createElement("td");
      Sizetd.textContent = file.size +" KB";
      const Downltd = document.createElement("td");
      const DownloadBtn = document.createElement("button");
      DownloadBtn.textContent = "Download";
      DownloadBtn.className = "download";

      DownloadBtn.onclick = function(){
        downloadFile(file.name);
      };

      Downltd.appendChild(DownloadBtn);
      tr.appendChild(Nametd);
      tr.appendChild(Sizetd);
      tr.appendChild(Downltd);
      FileTBody.appendChild(tr);
    });
  };

  request.onerror = function(event){
    console.error("Display files error: " + event.target.errorCode);
  };
}
//Search Function
function searchFiles(){
  const searchInput = document.getElementById("searchInput");
  const FileSearch = searchInput.value.trim().toLowerCase();

  const transaction = db.transaction(["files"], "readonly");
  const objectStore = transaction.objectStore("files");
  const index = objectStore.index("name");
  const request = index.openCursor();

  const FileTBody = document.getElementById("FileTBody");
  FileTBody.innerHTML = "";

  request.onsuccess = function(event){
    const cursor = event.target.result;
    if (cursor){
      const file = cursor.value;
      if (file.name.toLowerCase().includes(FileSearch)){
        const tr = document.createElement("tr");
        const Nametd = document.createElement("td");
        Nametd.textContent = file.name;
        const Sizetd = document.createElement("td");
        Sizetd.textContent = file.size +" KB";
        const Downltd = document.createElement("td");
        const DownloadBtn = document.createElement("button");
        DownloadBtn.textContent = "Download";
        DownloadBtn.className = "download";

        DownloadBtn.onclick = function(){
          downloadFile(file.name);
        };

        Downltd.appendChild(DownloadBtn);
        tr.appendChild(Nametd);
        tr.appendChild(Sizetd);
        tr.appendChild(Downltd);
        FileTBody.appendChild(tr);
      }
      cursor.continue();
    }
  };

  request.onerror = function(event){
    console.error("Search error: " + event.target.errorCode);
  };
}

//Download function
function downloadFile(File){
  const transaction = db.transaction(["files"], "readonly");
  const objectStore = transaction.objectStore("files");
  const index = objectStore.index("name");
  const request = index.get(File);

  request.onsuccess = function(event){
    const file = event.target.result;
    const dlURL = URL.createObjectURL(file.data);
    const dlLink = document.createElement("a");
    dlLink.href = dlURL;
    dlLink.download = file.name;
    dlLink.click();
    URL.revokeObjectURL(dlURL);
  };

  request.onerror = function(event){
    console.error("Download error: " + event.target.errorCode);
  };
}

/*--------------------------------------------Delete function for Testing purposes----------------------------------------------------
//Delete all when unloaded
window.onunload = function(){
  const transaction = db.transaction(["files"], "readwrite");
  const objectStore = transaction.objectStore("files");
  const request = objectStore.clear();

  request.onsuccess = function(event){
    console.log("All files deleted");
  };

  request.onerror = function(event){
    console.error("Delete all error: " + event.target.errorCode);
  };
};
*/