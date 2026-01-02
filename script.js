function saveText() {
  const input = document.getElementById("textInput");
  const output = document.getElementById("output");

  if (input.value === "") {
    alert("Please type something");
    return;
  }

  output.innerText = input.value;
  input.value = "";
}