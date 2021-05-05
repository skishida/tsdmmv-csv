# Ts Digital Multi Meter Viewer Logfile Converter

convert log csv file to user-friendly csv and json file

### Fromat 

* original csv file
    ```csv
    [TsDigitalMultiMeterViewer Ver.11.4.0 : [OWON B35/B35T (Bluetooth2.0)] : Date 2021/05/05 16:11:45],test Fig,test Meter Title
    Elapsed time | Main Value               | Mode  | Date Time
      0:00'00"12 , DC    ,  356.80 ,     mV ,       , 2021/05/05 15:46:57,
      0:00'00"64 , DC    ,  355.90 ,     mV ,       , 2021/05/05 15:46:57,
    ```

* output csv file for main data
    ```csv
    Elapsed time,Elapsed sec,Mode,Main Value,Unit,Mode,Date Time
    0:00:00.12,0.12,DC,356.80,mV,,2021/05/05 15:46:57,
    0:00:00.64,0.64,DC,355.90,mV,,2021/05/05 15:46:57,
    ```
  * remove blank
  * change date format from `hh:mm'ss"uuu` to `hh:mm:ss.uuu`
  * add `Elapsed sec` field


* output json file for meta data
    ```json
    {
      "Version": "TsDigitalMultiMeterViewer Ver.11.4.0",
      "Meter": "OWON B35/B35T (Bluetooth2.0)",
      "Save Date": "2021/05/05 16:11:45",
      "Fig Title": "test Fig",
      "Meter Title": "test Meter Title"
    }
    ```

### Usage

* [Open this page in github pages](https://skishida.github.io/tsdmmv-csv/index.html) and just drag&drop `.csv` file into browser
  * or clone this repository and open `index.html` locally

### Note

* Only tested on voltage & tempreture meter logfile.

### Reference

* [Ts Digital Multi Meter Viewer](http://www.ts-software-jp.net/products/tsdmmview.html)