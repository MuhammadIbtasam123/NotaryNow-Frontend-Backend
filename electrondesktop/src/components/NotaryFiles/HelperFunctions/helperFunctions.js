/** image onto base64 */
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

function convertBase64ToImage(base64String) {
  return new Promise((resolve, reject) => {
    // Create a new image element
    const img = new Image();

    // Set the src attribute to the base64 string
    img.src = base64String;

    // When the image is loaded, resolve the promise with the image element
    img.onload = () => {
      resolve(img);
    };

    // If there's an error loading the image, reject the promise with the error
    img.onerror = (error) => {
      reject(error);
    };
  });
}

export { convertToBase64, convertBase64ToImage };
