const fs = require('fs');

// Function to read the JSON file and log unique values for a specific field
const logUniqueValues = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        try {
            const jsonArray = JSON.parse(data); // Parse the JSON data

            // Use a Set to collect unique values
            const geysers = new Set();
            let maxNumGeysers = 0;

            // Loop through the array and add values to the Set
            jsonArray.forEach(seed => {
                seed["asteroids"].forEach(asteroid => {
                    if(asteroid["geysers"].length > maxNumGeysers) {
                        maxNumGeysers = asteroid["geysers"].length;
                    }
                    asteroid["geysers"].forEach(geyser => {
                        geysers.add(geyser.id);
                    })
                })
            });

            // Log the unique values
            console.log(`Unique values for geysers:`, [...geysers]);
            console.log(`Max number of geysers: ${maxNumGeysers}`)
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
        }
    });
};

// Call the function with the path to your JSON file and the field you want to filter by
logUniqueValues('./worlds.json');