module.exports = function() {
  'use strict';

  return {
    showChart : function(date, hour) {
      var $progressBar = $('#charts .progress-bar'),
        dataTable = new google.visualization.DataTable(),
        annotationChart = new google.visualization.AnnotationChart(
          document.querySelector('#chart')
        ),
        drawChart = function(json) {
          var rowsToAdd = [];

          dataTable.addColumn('date', 'Date');
          dataTable.addColumn('number', '');

          $.each(json, function(id, row) {
            $.each(row, function() {
              rowsToAdd.push(
                [
                  new Date(
                    row.year,
                    row.month,
                    row.day,
                    row.hour,
                    row.minute,
                    row.second
                  ),
                  row.sensor
                ]
              );
            });
          });

          dataTable.addRows(rowsToAdd);
          annotationChart.draw(
            dataTable,
            {
              displayAnnotations: false,
              displayZoomButtons: false
            }
          );
        };

      google.load(
        'visualization',
        '1',
        { 'packages': ['annotationchart'] }
      );

      $.ajax(
        {
          url: 'http://127.0.0.1/chart/' + date + '/' + hour,
          dataType: 'json',
          cache: false,
          beforeSend: function() {
            $progressBar.css('visibility', 'visible');
          }
        }
      ).done(function (data) {
          $progressBar.css('visibility', 'hidden');

          if (Object.keys(data).length === 0) {
            document.querySelector('#no-chart-data-toast').show();

            return;
          }

          drawChart(data);
        }
      );
    }
  };
};
