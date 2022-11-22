var startDate = '2021-10-15';
var endDate = '2021-10-25';
var geometry = table;

var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
             .filterDate(startDate, endDate)
             .filterBounds(geometry)
             .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 35));
             
             
var s2Image = ee.Image(s2.first());
var s2VisParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};
Map.addLayer(s2Image, s2VisParams, 'Sentinel-2 Image');
Map.centerObject(geometry, 13);
