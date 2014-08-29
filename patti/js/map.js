/* global d3: false, queue: false, topojson: false,  d:false */
'use strict';
var width = 960,
  height = 500;

var path = d3.geo.path();

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

d3.select('body').append('div')
  .attr('class', 'valuesAsText');

var valuesAsTextTable = d3.select('div.valuesAsText').append('table');

// push the csv into a js object, todo use headings instead of hardcoding
queue()
  .defer(d3.json, 'data/us.json')
  .defer(d3.csv, 'data/mapdata.csv', function(d) {
    return {
      type: 'Feature',
      id: d.ID,
      geometry: {
        type: 'Point',
        coordinates: [+d.Longitude, +d.Latitude]
      },
      properties: {
        organization: d['Organization Name'],
        orgtype: d['Organization Type'],
        url: d.URL,
        contact: {
          name: d['First Name'] + ' ' + d['Last Name'],
          email: d.Email,
          phone: d.Phone
        },
        address: d.Address,
        city: d.City,
        state: d.State,
        country: d.Country,
        postalcode: d['Postal Code'],
        key: d.ID
      }
    };
  })
  .await(ready);



/* css styles are deliberately hard coded so that the svg can be copied as is from the page 
  TODO read from the CSS, and inject on request of download, potentially much easier said than done :) */
function ready(error, us, centroid) {
  var rows = valuesAsTextTable.selectAll('tr')
    .data(centroid)
    .enter()
    .append('tr');
  var columns = [
    ['properties', 'organization'],
    ['properties', 'url'],
    ['geometry', 'coordinates']
  ];
  rows.selectAll('td')
    .data(function(row) {
      return columns.map(function(column) {
        if (!Array.isArray(column)) {
          return {
            column: column,
            value: row[column]
          };
        } else { //TODO N:deep
          return {
            column: column[0] + column[1],
            value: row[column[0]][column[1]]
          };
        }
      });
    })
    .enter()
    .append('td')
    .html(function(d) {
      return d.value;
    });
  //Map of the US
  svg.append('path')
    .attr('class', 'states')
    .attr('style', 'fill: #ccc; stroke: #fff')
    .datum(topojson.feature(us, us.objects.states))
    .attr('d', path);

  svg.selectAll('.symbol')
    .data(centroid.sort(function(a, b) {
      return b.properties.key - a.properties.key;
    }))
    .enter().append('path')
    .attr('class', 'symbol')
    .attr('style', 'fill: steelblue; fill-opacity: .8; stroke: #fff')
    .attr('d', path.pointRadius(function() {
      return 5;
    }));
}
