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


            const frequencyMap = {};


            // Loop through the array 
            let duplicateCount = 0;
            jsonArray.forEach(seed => {
                frequencyMap[seed["coordinate"]] = (frequencyMap[seed["coordinate"]] || 0) + 1
                if (frequencyMap[seed["coordinate"]] > 1) {
                    if (frequencyMap[seed["coordinate"]] === 2) {
                        duplicateCount++
                    }
                    console.log (`Found duplicate number ${frequencyMap[seed["coordinate"]]-1} of seed ${seed["coordinate"]}`)
                }
            });

            // Log the duplicates
            console.log(`There are ${duplicateCount} unique duplicate seeds.`)
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
        }
    });
};

// Call the function with the path to your JSON file and the field you want to filter by
logUniqueValues('./worlds.json');