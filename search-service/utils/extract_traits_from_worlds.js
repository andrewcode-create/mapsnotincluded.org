const fs = require("fs");

// Function to read the JSON file and log unique values for a specific field
const logUniqueValues = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    try {
      const jsonArray = JSON.parse(data); // Parse the JSON data

      // Use a Set to collect unique values
      const traits = new Set();
      let maxNumTraits = 0;

      // Loop through the array and add values to the Set
      jsonArray.forEach((seed) => {
        seed["asteroids"].forEach((asteroid) => {
          if (asteroid["worldTraits"].length > maxNumTraits) {
            maxNumTraits = asteroid["worldTraits"].length;
          }
          asteroid["worldTraits"].forEach((trait) => {
            traits.add(trait);
          });
        });
      });

      // Log the unique values
      console.log(`Unique values for worldtrait:`, [...traits]);
      console.log(`Max number of traits: ${maxNumTraits}`);
    } catch (parseErr) {
      console.error("Error parsing JSON data:", parseErr);
    }
  });
};

// Call the function with the path to your JSON file and the field you want to filter by
logUniqueValues("./Worlds/data-1.json");
