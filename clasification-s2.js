var startDate = '2022-08-18';
var endDate = '2022-10-09';
var geometry = ee.Geometry.Point([286.952564717386,9.055927787338167 ]||[286.852564717386,7.055927787338167 ]);

var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
             .filterDate(startDate, endDate)
             .filterBounds(geometry)
             .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 50));
             
             
var s2Image = ee.Image(s2.first());
var s2VisParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};
Map.addLayer(s2Image, s2VisParams, 'Sentinel-2 Image');
Map.centerObject(geometry, 8);

//********Find the Matching Dynamic World Image
var imageId = s2Image.get('system:index');
print(imageId);

var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
             .filter(ee.Filter.eq('system:index', imageId));
var dwImage = ee.Image(dw.first());
print(dwImage);

//********************* Visualize the Classified Image
var classification = dwImage.select('label');
var dwVisParams = {
  min: 0,
  max: 8,
  palette: [
    '#419BDF', '#397D49', '#88B053', '#7A87C6', '#E49635', '#DFC35A',
    '#C4281B', '#A59B8F', '#B39FE1'
  ]
};

Map.addLayer(classification.clip(table), dwVisParams, 'Classified Image');

Map.addLayer(table);
