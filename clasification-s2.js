var filtered = table;
var geometry = filtered.geometry();
Map.centerObject(geometry, 10);

var startDate = '2022-07-01';
var endDate = '2022-10-10';

var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
  .filterDate(startDate, endDate)
  .filterBounds(geometry);

// Create a Mode Composite.
var classification = dw.select('label');
var dwComposite = classification.reduce(ee.Reducer.mode());

// Extract the Built Area class.
var builtArea = dwComposite.eq(6);

var dwVisParams = {
  min: 0,
  max: 8,
  palette: ['#419BDF', '#397D49', '#88B053', '#7A87C6',
    '#E49635', '#DFC35A', '#C4281B', '#A59B8F', '#B39FE1']
};

// Clip the composite and add it to the Map.
Map.addLayer(dwComposite.clip(geometry), dwVisParams, 'Classified Composite');
//Map.addLayer(builtArea.clip(geometry), {}, 'Built Areas');
Map.addLayer(presioneslb);

// Rename the band names.
var dwComposite = dwComposite.rename(['classification']);
var builtArea = builtArea.rename(['built_area']);

// Calculate Pixel Counts.
/*
// Count all pixels.
var statsTotal = builtArea.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: geometry,
    scale: 10,
    maxPixels: 1e10
    }); 
var totalPixels = statsTotal.get('built_area');

// Mask 0 pixel values and count remaining pixels.
var builtAreaMasked = builtArea.selfMask();

var statsMasked = builtAreaMasked.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: geometry,
    scale: 10,
    maxPixels: 1e10
    }); 
var builtAreaPixels = statsMasked.get('built_area');
print('Built area pixel count', builtAreaPixels);
var fraction = (ee.Number(builtAreaPixels).divide(totalPixels))
  .multiply(100);
print('Percentage built area', fraction.format('%.2f'));

// Calculating Pixel Counts for all classes.
var pixelCountStats = dwComposite.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram().unweighted(),
    geometry: geometry,
    scale: 10,
    maxPixels: 1e10
    }); 
 
var pixelCounts = ee.Dictionary(pixelCountStats.get('classification'));
print('Pixel counts per class', pixelCounts);

// Format the results to make it more readable.
var classLabels = ee.List([
    'water', 'trees', 'grass', 'flooded_vegetation', 'crops',
    'shrub_and_scrub', 'built', 'bare', 'snow_and_ice'
    ]);

// Rename keys with class names.
var pixelCountsFormatted = pixelCounts.rename(
  pixelCounts.keys(), classLabels);
print('Pixel counts per class (formatted)', pixelCountsFormatted);

// Create a Feature Collection.
var exportFc = ee.FeatureCollection(
  ee.Feature(null, pixelCountsFormatted));

// Export the results as a CSV file.
Export.table.toDrive({
  collection: exportFc,
  description: 'pixel_counts_export',
  folder: 'earthengine',
  fileNamePrefix: 'pixel_counts',
  fileFormat: 'CSV',
});
*/

/*
 * Map panel configuration
 */

// Now let's do some overall layout.
// Create a map panel.

var mapPanel = ui.Map();

// Take all tools off the map except the zoom and mapTypeControl tools.
mapPanel.setControlVisibility(
    {all: false, zoomControl: true, mapTypeControl: true});