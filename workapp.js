// Initiate global variables
var total_worked_hours,
  final_worked_hours,
  net_pay,
  break_asked,
  work_details,
  break_length,
  idNumber;

// Function Calculate Shift

function calculateShift() {
  // Set Variables
  var minutes_worked = document.getElementById("minutes_worked").value;
  var hours_worked = document.getElementById("hours_worked").value;
  break_asked = document.getElementById("break_asked").value;
  break_length = document.getElementById("break_length").value;
  work_details = document.getElementById("work_details").value;
  var wage = localStorage.getItem("wage");

  if (wage == null) {
    wage = 15.65;
    localStorage.setItem("wage", wage);
  }

  //validate input

  if (
    minutes_worked === "" ||
    hours_worked == "" ||
    break_asked == "" ||
    break_length == "" ||
    work_details == ""
  ) {
    alert("Please enter values");
    return;
  }
  // Make Grapher button disappear
  document.getElementById("grapher").style.display = "none";

  //Calculate work hours
  total_worked_hours =
    parseFloat(hours_worked) + parseFloat(minutes_worked) / 60;

  //Subtract Break
  final_worked_hours =
    parseFloat(total_worked_hours) - parseFloat(break_length) / 60;

  //Calculate worked hours
  var net_pay = parseFloat(final_worked_hours * wage).toFixed(2);

  //Display the Net Pay
  document.getElementById("totalPay").style.display = "block";
  document.getElementById("pay").innerHTML = net_pay;

  // Calculate Paycheck

  // Set database to indexedDB
  // Check to see which one will be used for the browser
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  // Request for the indexed DB
  const request = indexedDB.open("workappDB", 1);

  // Notify user if an error has occured while requesting
  request.onerror = function (event) {
    console.log("An error has occured with Indexed DB");
    console.error(event);
  };

  // onupgradeneeded for the update of initial structuring of the IndexedDB
  request.onupgradeneeded = function () {
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

  // onsuccess where all operations occur
  request.onsuccess = function () {
    // reference to db
    const db = request.result;

    // Create a transaction
    const transaction = db.transaction("shift", "readwrite");

    // Reference to store
    const store = transaction.objectStore("shift");
    const dateIndex = store.index("date");
    const shiftIndex = store.index("time_on_shift");
    const breakIndex = store.index("total_break_time");
    const workHoursIndex = store.index("hours_worked");
    const breakAskedIndex = store.index("break_asked");
    const workDetailIndex = store.index("work_details");
    const netPayIndex = store.index("money_made");

    // Find today's date
    var d = new Date(),
      dformat =
        [d.getFullYear(), "" + d.getMonth() + 1, "" + d.getDate()].join("-") +
        " " +
        [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

    var todayDate = dformat.toString();

    // Find the id
    var allRecords = store.getAll();
    allRecords.onsuccess = function () {
      idNumber = Object.keys(allRecords.result).length + 1;
      console.log("Current ID number", idNumber);
      // Add data to db
      store.put({
        id: idNumber,
        day: todayDate,
        time_on_shift: total_worked_hours,
        total_break_time: parseInt(break_length),
        hours_worked: final_worked_hours,
        break_asked: break_asked,
        work_details: work_details,
        net_pay: parseFloat(net_pay),
      });
    };

    // querying the db
    const idQuery = store.get(51);
    console.log(idQuery);

    // querying indexes
    const workDetailQuery = workDetailIndex.getAll(["Bad."]);
    const dayQuery = dateIndex.getAll(["2022-07-03 22:31:04"]);

    // Query onsuccess
    workDetailQuery.onsuccess = function () {
      console.log("workDetailQuery", workDetailQuery.result);
    };

    dayQuery.onsuccess = function () {
      console.log("dayQuery", dayQuery.result);
    };

    // Close transaction and connection to the IndexedDB
    transaction.oncomplete = function () {
      db.close();
    };
  };
}

//Hide the pay amount on load
document.getElementById("totalPay").style.display = "none";
document.getElementById("each").style.display = "none";

//click to call function
document.getElementById("calculatevar").onclick = function () {
  calculateShift();
};
