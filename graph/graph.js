const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// Request for the indexed DB
const openRequest = indexedDB.open("workappDB", 1);

let linear = false;
let sum = 0;
let sumList = [];
let firstChart;
let averageValues;

document.getElementById("linear-graph").onclick = function () {
  if (linear == false) {
    linear = true;
  } else {
    linear = false;
  }
  resetGraph();
};

function resetGraph() {
  if (linear == true) {
    firstChart.data.datasets[0].data = sumList;

    firstChart.data.datasets.splice(1);
    firstChart.update();
  } else {
    firstChart.data.datasets[0].data = yValues;

    firstChart.data.datasets[1].label = "Average Net Pay";
    firstChart.data.datasets[1].data = averageValues;
    firstChart.data.datasets[1].borderColor = "black";
    firstChart.data.datasets[1].fill = false;
    firstChart.data.datasets[1].pointRadius = 0;

    firstChart.update();
  }

  /*
  if (linear == true) {
    if (typeof firstChart == "undefined") {
      //pass
    } else {
      firstChart.destroy();
    }

    if (oldChartHTML.style.display == "none") {
      // pass
    } else {
      oldChartHTML.style.display = "none";
    }

    NewChart = new Chart("newChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            label: "Money Made",
            data: sumList,
            borderColor: "blue",
            fill: true,
          },
        ],
      },
      options: {
        legend: { display: true },
      },
    });

    document.getElementById("averageMoneyMade").style.display = "none";
  } else {
    if (newChartHTML.style.display == "none") {
      // pass
    } else {
      newChartHTML.style.display = "none";
    }

    if (typeof oldChartHTML == "null") {
      // null
    } else {
      OldChart = new Chart("oldChart", {
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
    }
    document.getElementById("averageMoneyMade").innerHTML =
      "Average money made per shift : $" + average.toFixed(2);
  }*/
}

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

    for (i = 0; i != yValues.length; i++) {
      sum += parseFloat(yValues[i]);
      sumList.push(sum);
    }

    let average = sum / yValues.length;

    averageValues = [];

    for (let i = 1; i <= yValues.length; i++) {
      averageValues.push(average);
    }

    firstChart = new Chart("myChart", {
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
