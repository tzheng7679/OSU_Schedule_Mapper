import { pdfToCourses } from "./pdf_parser";

// use geocoder api at https://gissvc.osu.edu/arcgis/rest/services/Apps/Campusmap_OSU_Buildings_Locator/GeocodeServer/findAddressCandidates?Address=&Address2=&Address3=&Neighborhood=&City=&Subregion=&Region=&Postal=&PostalExt=&CountryCode=&SingleLine=&outFields=&maxLocations=&matchOutOfRange=true&langCode=&locationType=&sourceCountry=&category=&location=&searchExtent=&outSR=4140&magicKey=dHA9MCNsb2M9MjU4I2xuZz0wI2ZhPTY1NTM2&preferredLabelValues=&f=html

// make sure to use output spatial reference of 4140; this gives the lattitude and longitude as the output coordinates, instead of some weird projected bullshit

// use magic key from suggest api to make life easy

var map = L.map('map').setView([51.505, -0.09], 13);
function main() {
    let courses = pdfToCourses('Schedule Planner.pdf');

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();
}
document.body.onload = main;
console.log("hello!");