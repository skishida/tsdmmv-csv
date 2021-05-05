if (window.File) {
    var dropArea = document.getElementById('dropArea');

    dropArea.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);

    dropArea.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        processFiles(files);
    }, false);

    const inputElement = document.getElementById("input");
    inputElement.addEventListener("change", inputChangedHandler, false);
    function inputChangedHandler() {
        processFiles(this.files);
        document.getElementById('input').value = ''
    }
}

function processFiles(files) {
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        console.log(f);

        // check file type
        if (f.name.endsWith(".csv") && f.type.match(/application|csv/)) {
        } else {
            alert('wrong format file selected!');
            return;
        };

        var reader = new FileReader();

        reader.onerror =
            function () {
                alert('error on file reading!')
            };
        reader.addEventListener('load', { file: f, handleEvent: areaLoadedHandler });

        reader.readAsText(f);
    }
}

function areaLoadedHandler(e) {
    const res = e.target.result;
    const filename = this.file.name;
    const data = res.split('\n');
    process(data, filename);
}

function process(data, filename) {
    namebase = filename.substring(0, filename.lastIndexOf("."));

    // check csv contains "TsDigitalMultiMeterViewer"
    if (data[0].indexOf("TsDigitalMultiMeterViewer") == -1) {
        alert('wrong csv format!')
        return;
    }

    // read first line
    var meta =
    {
        "Version": "",
        "Meter": "",
        "Save Date": "",
        "Fig Title": "",
        "Meter Title": ""
    };
    metaTitle = data[0].split(",");
    metaData = metaTitle[0].split(":");
    meta["Version"] = metaData[0].trim().replace("[", "");
    meta["Meter"] = metaData[1].trim().replace("[", "").replace("]", "");
    date = metaData.slice(2, metaData.length).join(":").replace("]", "").replace("Date", "");
    meta["Save Date"] = date.trim();
    meta["Fig Title"] = metaTitle[1].trim()
    meta["Meter Title"] = metaTitle[2].trim()

    // convert & export json
    const metajson = JSON.stringify(meta, undefined, 2);
    donwloadJson(metajson, namebase + "_meta");

    // skip second line
    var csv = "Elapsed time,Elapsed sec,Mode,Main Value,Unit,Mode,Date Time\n";

    // read following line
    var csvData = [];
    for (var i = 0; i < data.length - 2; i++) {
        var line = data[i + 2].split(",");
        csvData[i] = [, , , , , ,];

        // Elapsed time: change date format
        // Elapsed sec: calc from elapsed time
        csvData[i][0] = line[0].trim().replace("'", ":").replace("\"", ".")
        const d = "1970-01-01 " + csvData[i][0] + " +0000";
        const date = new Date(d);
        csvData[i][1] = date.getTime() / 1000.0;

        for (var j = 0; j < line.length - 1; j++) {
            csvData[i][2 + j] = line[1 + j].trim().replace(",", "");
        }

        csv += csvData[i].join(",") + "\n";
    }

    // export csv
    console.log("total size:" + csv.length);
    downloadCsv(csv, namebase + "_csv");
}

function donwloadJson(json, name) {
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    fname = name + ".json";
    openLink(data, fname);
}

function downloadCsv(csv, name) {
    var data = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    fname = name + ".csv";
    openLink(data, fname);
}

function openLink(data, fname) {
    var anchor = document.createElement('a');
    anchor.setAttribute("href", data);
    anchor.setAttribute("download", fname);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}