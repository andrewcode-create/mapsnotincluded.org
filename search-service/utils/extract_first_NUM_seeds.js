const fs = require('fs');

// Function to read JSON, extract the first 100 entries, and write to a new file
const extractFirstNUMEntries = (inputFilePath, outputFilePath, number) => {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the input file:', err);
            return;
        }

        try {
            const jsonArray = JSON.parse(data); // Parse the JSON data

            // Extract the first NUM entries
            const firstNUMEntries = jsonArray.slice(0, number);

            // Write the extracted entries to the output file
            fs.writeFile(outputFilePath, JSON.stringify(firstNUMEntries), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to the output file:', writeErr);
                } else {
                    console.log(`Successfully wrote the first NUM entries to ${outputFilePath}`);
                }
            });
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
        }
    });
};

// Call the function with input and output file paths
extractFirstNUMEntries('./worlds.json', './world_export_1.json', 1);