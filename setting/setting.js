function saveSettings() {
  var wage = document.getElementById("wage").value;

  //validate input

  if (wage === "") {
    alert("Please enter values");
    return;
  }

  localStorage.removeItem("wage");
  localStorage.setItem("wage", wage);
}

document.getElementById("save").onclick = function () {
  saveSettings();
};
