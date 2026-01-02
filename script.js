const DOCUMENT_ID = 'text-saver-entry';
let sanityClient;

// Wait for Sanity library to load - check for createClient function
function waitForSanity() {
  return new Promise((resolve, reject) => {
    // Check if Sanity is available
    if (window.createClient || window.sanityLoaded) {
      // If sanityLoaded is true but createClient isn't ready yet, wait a bit more
      if (window.createClient) {
        resolve();
      } else {
        // Wait a bit more for the module to finish loading
        setTimeout(() => {
          if (window.createClient) {
            resolve();
          } else {
            reject(new Error('createClient not available after module loaded'));
          }
        }, 100);
      }
    } else {
      // Check every 100ms for up to 10 seconds (modules can take longer)
      let attempts = 0;
      const maxAttempts = 100;
      const interval = setInterval(() => {
        attempts++;
        if (window.createClient) {
          clearInterval(interval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('Sanity library failed to load after 10 seconds. Check network tab for errors.'));
        }
      }, 100);
    }
  });
}

// Initialize when everything is ready
document.addEventListener('DOMContentLoaded', async function() {
  try {
    await waitForSanity();
    
    // Use createClient from esm.sh module
    if (window.createClient) {
      sanityClient = window.createClient({
        projectId: 'iv378ryl',
        dataset: 'production',
        useCdn: false,
        apiVersion: '2024-01-01',
        token: 'skuKYk3e0ZLjfzRnZRMLcUu62r0DwoiKHN0nHCSwKoH0MQRscs9GtcO0wz5N4GKAtqX68XguiP6m9dEKkZ9FINwTfGbjOb4X4GXVcTngHszK9PT4ceuHdQhw4G3cyMJ9fcpLn2Mybyq7MsXeTWuzeSw3Mfw3ExPsuPbEVPGnuPXVhrGZy5M1'
      });
      console.log('Sanity client initialized successfully');
    } else {
      throw new Error('createClient function not found on window object');
    }
  } catch (error) {
    console.error('Failed to initialize Sanity client:', error);
    console.error('Window object keys:', Object.keys(window).filter(k => k.toLowerCase().includes('sanity')));
    alert('Failed to load Sanity library. Please refresh the page. Error: ' + error.message);
  }
});

// Make functions available globally
window.saveText = async function() {
  if (!sanityClient) {
    alert("Sanity client not initialized. Please wait a moment and try again.");
    return;
  }

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
};

window.loadText = async function() {
  if (!sanityClient) {
    alert("Sanity client not initialized. Please wait a moment and try again.");
    return;
  }

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
};