const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// Request for the indexed DB
const openRequest = indexedDB.open("workappDB", 1);

openRequest.onerror = function (event) {
  console.log("An error has occured with Indexed DB");
  console.error(event);
};

// onupgradeneeded for the update of initial structuring of the IndexedDB
openRequest.onupgradeneeded = function () {
  const db = request.result;
  const store = db.createObjectStore("shift", {
    keyPath: "id",
    autoIncrement: true,
  });
  store.createIndex("date", ["day"], { unique: false });
  store.createIndex("time_on_shift", ["time_on_shift"], { unique: false });
  store.createIndex("total_break_time", ["total_break_time"], {
    unique: false,
  });
  store.createIndex("hours_worked", ["hours_worked"], { unique: false });
  store.createIndex("break_asked", ["break_asked"], { unique: false });
  store.createIndex("work_details", ["work_details"], { unique: false });
  store.createIndex("money_made", ["net_pay"], { unique: false });
};

var yValues = [];
var xValues = [];

let db;
function query(db, myCallbackFunction) {
  const tx = db.transaction("shift", "readwrite");
  const st = tx.objectStore("shift");
  const re = st.getAll();

  re.onsuccess = (event) => {
    // denote the array of objects with a variable
    // here, event.target is === to request, can use either one
    const data = event.target.result;
    // pass the data to the callback function so that caller can
    // access it
    myCallbackFunction(data);
  };
}

// Open the database and then run the query
openRequest.onsuccess = (event) => {
  db = openRequest.result;
  query(db, (data = []) => {
    // This gets called when the query has run with the loaded
    // data
    for (const row of data) {
      yValues.push(row["net_pay"]);
      xValues.push(row["id"]);
    }

    let sum = 0;
    console.log(yValues.length);
    for (i = 0; i != yValues.length; i++) {
      sum += parseFloat(yValues[i]);
    }

    let average = sum / yValues.length;

    averageValues = [];

    for (let i = 1; i <= yValues.length; i++) {
      averageValues.push(average);
    }

    new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            label: "Net Pay",
            data: yValues,
            borderColor: "blue",
            fill: true,
          },
          {
            label: "Average Net Pay",
            data: averageValues,
            borderColor: "black",
            fill: false,
            pointRadius: 0,
          },
        ],
      },
      options: {
        legend: { display: true },
      },
    });

    document.getElementById("averageMoneyMade").innerHTML =
      "Average money made per shift : $" + average.toFixed(2);
  });
};
