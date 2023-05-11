import "./style.css";

const form = document.querySelector("form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  // extract data from form by instantiating a new FormData object using our form as an input - provides us with a data strcuture that behaves like a js Map
  // could also just access prompt input directly
  const formData = new FormData(form);
  // grb prompt value from form using get method available on FormData instances
  const prompt = formData.get("prompt");

  // make request to our api using fetch api which returns a promise (so we need to await resolution of promise)
  const response = await fetch("http://localhost:8080/imagine", {
    // make sure it is using http method of post because thats how we built our api
    method: "POST",
    // because we are dealing
    headers: {
      // because we are dealing with a json api
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });
  // client side error handling
  // if status ok then no errors happened
  if (response.ok) {
    // access image url from response
    const { image } = await response.json();
    // insert image in ui
    const result = document.querySelector("#result") as HTMLDivElement;
    // the width matches css max width and since in server we are req aspect-ratio of 1/1 and also specifying this in css I guess we only need width here
    result.innerHTML = `<img src="${image}" width="512"/>`;
  } else {
    // the text method attached to the Fetch API Response object reads the body of the response and returns a Promise that resolves to a text string. This is typically used when the response body contains plain text or other non-binary data formats like JSON. this is why we use await here
    const error = await response.text();
    alert(error);
    console.error(error);
  }
  hideSpinner();
});

// Show a loading indicator while the app is fetching data
function showSpinner(): void {
  const button = document.querySelector("button") as HTMLButtonElement;
  // no more button clicks
  button.disabled = true;
  button.innerHTML = 'Dreaming... <span class="spinner">☁️</span>';
}
function hideSpinner(): void {
  const button = document.querySelector("button") as HTMLButtonElement;
  button.disabled = false;
  button.innerHTML = "Dreaming";
}
