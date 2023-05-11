import "./style.css";

const form = document.querySelector("form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

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
  // access image url from response
  const { image } = await response.json();
  // insert image in ui
  const result = document.querySelector("#result") as HTMLDivElement;
  // the width matches css max width and since in server we are req aspect-ratio of 1/1 and also specifying this in css I guess we only need width here
  result.innerHTML = `<img src="${image}" width="512"/>`;
});
