function calculateShift() {
  var minutes_worked = document.getElementById("minutes_worked").value;
  var hours_worked = document.getElementById("hours_worked").value;
  var break_had = document.getElementById("break_had").value;
  var break_length = document.getElementById("break_length").value;

  //validate input
  if (
    minutes_worked === "" ||
    hours_worked == "" ||
    break_had == "" ||
    break_length == ""
  ) {
    alert("Please enter values");
    return;
  }

  //Calculate work hours
  var total_worked_hours =
    parseFloat(hours_worked) + parseFloat(minutes_worked) / 60;

  //Subtract Break
  var final_worked_hours =
    parseFloat(total_worked_hours) - parseFloat(break_length) / 60;

  //Calculate worked hours
  var gross_pay = parseFloat((final_worked_hours * 15.65).toFixed(2));

  //Calculate Vacation Every
  var vacation_every = (gross_pay * 0.04).toFixed(2);

  //Calculate Net Pay
  var net_pay = parseFloat(gross_pay) + parseFloat(vacation_every);

  //Display the Net Pay
  document.getElementById("totalPay").style.display = "block";
  document.getElementById("pay").innerHTML = net_pay;
}

//Hide the pay amount on load
document.getElementById("totalPay").style.display = "none";
document.getElementById("each").style.display = "none";

//click to call function
document.getElementById("calculatevar").onclick = function () {
  calculateShift();
};
