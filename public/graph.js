(function() {
  var Graph, root;

  Graph = (function() {

    function Graph(slug, graphLabel) {
      this.slug = slug;
      this.graphLabel = graphLabel;
    }

    Graph.prototype.init = function() {
      var _this = this;
      this.show('day');
      $('#past-day').click(function() {
        return _this.show('day');
      });
      $('#past-week').click(function() {
        return _this.show('week');
      });
      return $('#past-month').click(function() {
        return _this.show('month');
      });
    };

    Graph.prototype.show = function(graphName) {
      this.loadJSON(graphName);
      this.showDetails(graphName);
      return false;
    };

    Graph.prototype.loadJSON = function(graphName) {
      var _this = this;
      return $.getJSON(this.jsonPath(graphName), function(lineData) {
        var line, lines;
        $('.spinner').fadeOut(200);
        lines = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = lineData.length; _i < _len; _i++) {
            line = lineData[_i];
            _results.push({
              data: line.data,
              label: line.label,
              color: line.color
            });
          }
          return _results;
        })();
        return $.plot($('#holder'), lines, {
          xaxis: {
            mode: 'time'
          },
          legend: {
            position: 'sw'
          }
        });
      });
    };

    Graph.prototype.showDetails = function(name) {
      $('.arrows').remove();
      $('<span class="arrows">&#187;</span>').insertBefore($("#past-" + name + " > a"));
      $('.graph-details').each(function() {
        return $(this).hide();
      });
      $('#graph-details-' + name).show();
      return $('#current-graph-name').text("Past " + name);
    };

    Graph.prototype.jsonPath = function(path) {
      return "/" + this.slug + "/data/" + path;
    };

    return Graph;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Graph = Graph;

}).call(this);
