require('dotenv').config();
const fs = require('fs');
const { Queue } = require('async-await-queue');

const Q = new Queue(12, 100);

let worldTraits = [];
let geysers = [];

const url = `${process.env.API_URL || 'https://api.mapsnotincluded.org'}/ingest`;

if (!fs.existsSync('verified.txt')) {
    fs.writeFileSync('verified.txt', '');
}
const alreadyVerified = fs.readFileSync('verified.txt').toString().split('\n');

// TODO: Queue the promises, so we can do concurrent uploads
async function uploadSave(saveDir, saveName) {
    let jsonFilePath = `${saveDir}/${saveName}/${saveName}.sav.json`
    let saveFilePath = `${saveDir}/${saveName}/${saveName}.sav`

    if (!fs.existsSync(jsonFilePath)) {
        console.log(`Save ${saveName} does not have a json file, skipping`);
        return;
    }

    if (!fs.existsSync(saveFilePath)) {
        console.log(`Save ${saveName} does not have a save file, skipping`);
        return;
    }

    let form = new FormData();
    form.append('data', fs.readFileSync(jsonFilePath));
    form.append('save', new Blob([fs.readFileSync(saveFilePath).buffer]), {
        filename: 'save.sav',
        contentType: 'application/octet-stream' // Ensure the correct content type is used
    });

    console.log(`Sending ${saveName} to ${url}`); 
    let response = await fetch(url, {
        method: 'POST',
        body: form,
        headers: {
            'Authorization': process.env.AUTH_SECRET,
        }
    });

    if (response.status != 200) {
        console.log(`Failed to ingest ${saveName} - ${response.status}`);
    } else {
        console.log(`Ingested ${saveName}`);
        console.log(await response.json());
        fs.appendFileSync('verified.txt', `${saveName}\n`);
    }
}

async function main(savesDir) { 
    const saves = fs.readdirSync(savesDir);

    console.log(`Processing ${saves.length} saves`);

    const toProcess = [];

    for (const save of saves) {
        if (save == 'auto_save') continue;

        if (alreadyVerified.includes(save)) {
            console.log(`Save ${save} has already been verified, skipping`);
            continue;
        }

        toProcess.push(Q.run(() => uploadSave(savesDir, save).catch(e => console.error(`E: ${e.message}`))));
        // break;
    }

    await Promise.all(toProcess);
}


if (require.main === module) {
    main(process.argv[2]);
}