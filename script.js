// Initialize Sanity client
const sanityClient = window.sanity.createClient({
  projectId: 'iv378ryl',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  // Add your token here if you have write permissions
  token: 'skuKYk3e0ZLjfzRnZRMLcUu62r0DwoiKHN0nHCSwKoH0MQRscs9GtcO0wz5N4GKAtqX68XguiP6m9dEKkZ9FINwTfGbjOb4X4GXVcTngHszK9PT4ceuHdQhw4G3cyMJ9fcpLn2Mybyq7MsXeTWuzeSw3Mfw3ExPsuPbEVPGnuPXVhrGZy5M1'
});

const DOCUMENT_ID = 'text-saver-entry';

async function saveText() {
  const input = document.getElementById("textInput");
  const output = document.getElementById("output");
  
  if (input.value === "") {
    alert("Please type something");
    return;
  }

  try {
    // Create or update document in Sanity
    const doc = {
      _id: DOCUMENT_ID,
      _type: 'textEntry',
      content: input.value,
      savedAt: new Date().toISOString()
    };

    await sanityClient.createOrReplace(doc);
    
    output.innerText = input.value;
    input.value = "";
    alert("Text saved to Sanity!");
  } catch (error) {
    alert("Error saving: " + error.message);
    console.error('Save error:', error);
  }
}

async function loadText() {
  const output = document.getElementById("output");

  try {
    const doc = await sanityClient.getDocument(DOCUMENT_ID);
    
    if (doc && doc.content) {
      output.innerText = doc.content;
      alert("Text loaded from Sanity!");
    } else {
      output.innerText = 'No saved text found';
    }
  } catch (error) {
    if (error.statusCode === 404) {
      alert("No saved text found yet");
      output.innerText = 'Nothing saved yet';
    } else {
      alert("Error loading: " + error.message);
    }
    console.error('Load error:', error);
  }
}