var margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
},
    width = 1200 - margin.right - margin.left,
    height = 900 - margin.bottom - margin.top,
    maxRadius = height / 2,
    sampleCircleRadius = 4,
    defaultSampleNumber = 1,
    animationDuration = 1000,
    sampleColors = {
        'RUS': '#538d2e',
        'CHN': '#82362d',
        'USA': '#592b76',
        'EUR': '#2a646b',
    };

var svg;

var nOfSamples,
    nOfSubjects,
    samplesData,
    matrix,
    matrixMaxValue;

var distance,
    angle;

var samples,
    allSamples;

// Fill bacteria-selector
d3.tsv('data/bacts.tsv', function(error, data) {
    if (error) {
        console.log(error);
    } else {
        data.forEach(function(bacteria) {
            var placement;

            if ($('#bacteria-selector optgroup[label=' + bacteria.phylum + ']').length === 0) {
                $('#bacteria-selector').append('<optgroup label="' + bacteria.phylum + '">');
            }
            placement = $('optgroup[label=' + bacteria.phylum + ']');

            if ($('#bacteria-selector optgroup[label=-' + bacteria.class + ']').length === 0) {
                placement.append('<optgroup label="-' + bacteria.class + '">');
            }
            placement = $('optgroup[label=-' + bacteria.class + ']');

            if ($('#bacteria-selector optgroup[label=--' + bacteria.order + ']').length === 0) {
                placement.append('<optgroup label="--' + bacteria.order + '">');
            }
            placement = $('optgroup[label=--' + bacteria.order + ']');

            if ($('#bacteria-selector optgroup[label=---' + bacteria.family + ']').length === 0) {
                placement.append('<optgroup label="---' + bacteria.family + '">');
            }
            placement = $('optgroup[label=---' + bacteria.family + ']');

            if ($('#bacteria-selector optgroup[label=----' + bacteria.genus + ']').length === 0) {
                placement.append('<optgroup label="----' + bacteria.genus + '">');
            }
            placement = $('optgroup[label=----' + bacteria.genus + ']');

            placement.append('<option label="' + bacteria.org + '">' + bacteria.org + '</option>');
        });
    }
});

// Read sample_info.tsv
d3.tsv('data/sample_info.tsv', function(error, data) {
    if (error) {
        console.log(error);
    } else {
        samplesData = data;
        nOfSamples = samplesData.length;
        nOfSubjects = d3.max(samplesData, function(d) {
            return +d.subj_id;
        });

        // Angle scale
        angle = d3.scale.linear()
            .domain([1, nOfSubjects + 1])
            .range([0, 360]);

        // Initial svg
        svg = d3.select('#chart').append('svg')
            .attr('id', 'svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        // Draw utility circles
        var utilityCircles = svg.append('g')
            .attr('class', 'utility-circles');

        utilityCircles.append('circle')
            .attr('id', 'utility-circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', maxRadius)
            .attr('stroke-width', 2);

        // Draw utility lines
        var utilityLines = svg.append('g')
            .attr('class', 'utility-lines');

        for (var i = 1; i < nOfSubjects + 1; i++) {
            utilityLines.append('line')
                .attr('class', 'utility-line')
                .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ') rotate(' + angle(i) + ')')
                .attr('x2', maxRadius);
        }

        // Draw selected bacteria data
        var bacteriaSelector = document.getElementById('bacteria-selector');
        var bacteriaName = getUrlParameter('name');
        bacteriaSelector.value = bacteriaName;
        document.title = bacteriaName;

        var viewSelector = document.getElementById('view-selector');
        var view = getUrlParameter('view');
        viewSelector.value = view;

        drawBacteriaData(bacteriaName, view);
    }
});

var drawBacteriaData = function(bacteriaName, viewType) {
    setUrlParameter('name', bacteriaName);
    setUrlParameter('view', viewType);
    document.title = bacteriaName;

    // Get center coordinates for loading circles animation
    var centerCoordinates = document.getElementById('svg').getScreenCTM();

    $('.spinner').css('top', centerCoordinates.f + (height + margin.top + margin.bottom) / 2 - 15);
    $('.spinner').css('left', centerCoordinates.e + (width + margin.left + margin.right) / 2 - 15);
    $('#loading-container').css('display', 'block');

    // Start drawing data after little timeout
    setTimeout(function() {
        d3.text('data/bacteries/' + bacteriaName + '.tsv', function(error, data) {
            if (error) {
                console.log(error);
            } else {
                // Parse bacteria data file
                matrix = d3.tsv.parseRows(data).map(function(row) {
                    return row.map(function(value) {
                        return value;
                    });
                });

                // Create distance scale according to matrix maximum value
                matrixMaxValue = d3.max(matrix, function(array) {
                    return d3.max(array, Number);
                });

                distance = d3.scale.linear()
                    .domain([0, matrixMaxValue])
                    .range([0, maxRadius]);

                // Sort matrix
                matrix[0].unshift('0');
                sortMatrixByCountry();
                matrix = transpose(matrix);
                sortMatrixByCountry();
                matrix[0].shift();

                // Draw legend
                if (d3.select('.legend').empty()) {
                    var legend = svg.append('g')
                        .attr('class', 'legend');

                    var startAngle = Math.PI / 2;
                    var endAngle = Math.PI / 2;
                    var middleAngle = Math.PI / 2;
                    var subjIds = [];

                    subjIds.push(+samplesData[0].subj_id);

                    for (var i = 1; i < nOfSamples; i++) {
                        if (samplesData[i].country != samplesData[i - 1].country || samplesData[i].region != samplesData[i - 1].region || i === nOfSamples - 1) {
                            var maxSubjId = d3.max(subjIds);
                            endAngle = angle(maxSubjId) * (Math.PI / 180) + Math.PI / 2;
                            middleAngle = startAngle + (endAngle - startAngle) / 2 - Math.PI / 2;

                            var arc = d3.svg.arc()
                                .innerRadius(maxRadius + 50)
                                .outerRadius(maxRadius + 50.3)
                                .startAngle(startAngle)
                                .endAngle(endAngle);

                            legend.append('path')
                                .attr('d', arc)
                                .attr('fill', 'none')
                                .attr('stroke', sampleColors[samplesData[i - 1].country])
                                .attr('stroke-width', .3)
                                .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');

                            legend.append('text')
                                .attr('class', 'legend-text')
                                .attr('x', width / 2 + (maxRadius + 60) * Math.cos(middleAngle))
                                .attr('y', height / 2 + (maxRadius + 60) * Math.sin(middleAngle))
                                .attr('text-anchor', function() {
                                    if ((middleAngle > 0 & middleAngle < Math.PI / 2) || (middleAngle > 1.5 * Math.PI & middleAngle < 2 * Math.PI)) {
                                        return 'start';
                                    } else {
                                        return 'end';
                                    }
                                })
                                .attr('fill', sampleColors[samplesData[i - 1].country])
                                .text(function() {
                                    if (samplesData[i - 1].region === 'NA') {
                                        return samplesData[i - 1].country;
                                    } else {
                                        return samplesData[i - 1].region;
                                    }
                                });

                            startAngle = angle(maxSubjId + 1) * (Math.PI / 180) + Math.PI / 2;
                            subjIds = [];
                        }
                        subjIds.push(+samplesData[i].subj_id);
                    }
                }

                // Draw selected viewType
                if (viewType === 'ONE') {
                    d3.select('.all-samples').remove();

                    d3.select('#slider-container').select('#scale-text')
                        .text(matrixMaxValue);

                    $('#slider-container').css('display', 'block');

                    // Draw blanks
                    if (d3.select('.samples').empty()) {
                        samples = svg.append('g')
                            .attr('class', 'samples');

                        samples.append('path')
                            .attr('class', 'current-sample-tooltip')
                            .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')')
                            .attr('d', 'M0.5,-6.5l5,-5H100v-50H-100v50H-5Z');

                        for (var i = 1; i < nOfSamples + 1; i++) {
                            var sample = samples.append('g')
                                .attr('class', 'sample')
                                .attr('id', i);

                            sample.append('circle')
                                .attr('class', 'tooltip-circle')
                                .attr('cx', width / 2)
                                .attr('cy', height / 2)
                                .attr('visibility', 'hidden');

                            sample.append('circle')
                                .attr('class', 'sample-circle')
                                .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ') rotate(' + angle(getSampleData(matrix[i][0]).subj_id) + ')')
                                .attr('cx', 0)
                                .attr('r', sampleCircleRadius - 1)
                                .attr('opacity', 0);
                        }

                        samples.append('circle')
                            .attr('class', 'current-sample')
                            .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')')
                            .attr('r', sampleCircleRadius);

                        samples.append('line')
                            .attr('class', 'current-sample-line');
                    }

                    // Change samples positions and colors
                    changeOneSampleView(defaultSampleNumber);
                    $('#loading-container').css('display', 'none');
                } else {
                    d3.select('.samples').remove();
                    $('#slider-container').css('display', 'none');

                    // Draw all samples
                    if (d3.select('.all-samples').empty()) {
                        allSamples = svg.append('g')
                            .attr('class', 'all-samples');

                        for (var i = 1; i < nOfSamples + 1; i++) {
                            var sampleCountry = getSampleData(matrix[i][0]).country;

                            var sample = allSamples.append('g')
                                .attr('class', sampleCountry)
                                .attr('id', i)
                                .attr('visibility', 'hidden')
                                .attr('opacity', .3);

                            for (var j = 1; j < nOfSamples + 1; j++) {
                                if (matrix[i][j] != '0' & matrix[i][j] != 'NA') {
                                    sample.append('circle')
                                        .attr('class', 'sample-circle')
                                        .attr('id', j)
                                        .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ') rotate(' + angle(getSampleData(matrix[0][j - 1]).subj_id) + ')')
                                        .attr('cx', distance(+matrix[i][j]))
                                        .attr('r', sampleCircleRadius - 1)
                                        .attr('fill', sampleColors[sampleCountry])
                                        .attr('stroke', sampleColors[sampleCountry])
                                        .on('mouseover', function() {
                                            var selectedSampleId = +d3.select(this).attr('id');
                                            var currentSampleName = matrix[0][selectedSampleId - 1];

                                            d3.select(this).attr('opacity', 1);

                                            // Update the tooltip position and value
                                            d3.select('#tooltip-all-samples')
                                                .style('top', (d3.event.pageY - 50) + 'px')
                                                .style('left', (d3.event.pageX - 70) + 'px')
                                                .classed('hidden', false);
                                            d3.select('#tooltip-all-samples').select('#sample-name')
                                                .text(currentSampleName);
                                        })
                                        .on('mousemove', function() {
                                            // Update the tooltip position
                                            d3.select('#tooltip-all-samples')
                                                .style('top', (d3.event.pageY - 50) + 'px')
                                                .style('left', (d3.event.pageX - 70) + 'px');
                                        })
                                        .on('mouseout', function() {
                                            // Remove tooltip and make sample normal again
                                            d3.select(this).attr('opacity', .5);
                                            d3.select('#tooltip-all-samples').classed('hidden', true);
                                        })
                                        .on('click', function() {
                                            var selectedSampleId = +d3.select(this).attr('id');
                                            var viewSelector = document.getElementById('view-selector');
                                            defaultSampleNumber = selectedSampleId;
                                            viewSelector.value = 'ONE';
                                            drawBacteriaData(d3.select('#bacteria-selector').property('value'), d3.select('#view-selector').property('value'));
                                        });
                                }
                            }
                        }
                    }

                    // Hide or show samples according to the viewType
                    changeAllSamplesView(viewType);
                    $('#loading-container').css('display', 'none');
                }
            }
        });
    }, 1000);
}

var changeOneSampleView = function(sampleNumber) {
    var scaleMultiplier = d3.select('#scale-slider').property('value');

    // Change samples locations
    for (var j = 1; j < nOfSamples + 1; j++) {
        var currentSample = getSampleData(matrix[0][j - 1]);
        var sampleEndDistance;
        var sampleColor = sampleColors[getSampleData(matrix[0][j - 1]).country];
        var strokeColor = isSampleActive(j) ? sampleColor : '#e6e6e6';
        var sampleVisibility;

        var sample = d3.selectAll('.sample')
            .filter(function() {
                return +this.getAttribute('id') === j;
            });

        if (matrix[sampleNumber][j] != '0' & matrix[sampleNumber][j] != 'NA') {
            sampleEndDistance = distance(+matrix[sampleNumber][j]) * scaleMultiplier;
            sampleVisibility = sampleEndDistance > maxRadius ? 'hidden' : 'visible';
        } else if (j === sampleNumber) {
            sampleEndDistance = 0;
        } else {
            sampleEndDistance = maxRadius + getSampleIndexInSubject(currentSample.sample_name, currentSample.subj_id) * 10;
            sampleColor = '#ffffff';
            sampleVisibility = 'visible';
        }

        sample.select('.tooltip-circle')
            .attr('r', sampleEndDistance)
            .attr('stroke', sampleColor);

        sample.select('.sample-circle')
            .attr('fill', sampleColor)
            .attr('stroke', strokeColor)
            .attr('visibility', sampleVisibility)
            .on('mouseover', function() {
                var selectedSampleCX = d3.select(this).attr('cx');
                var selectedSampleId = +d3.select(this.parentNode).attr('id');
                var currentSampleName = matrix[0][selectedSampleId - 1]
                var currentSample = getSampleData(currentSampleName);

                d3.select(this).attr('opacity', 1);

                // Show tooltip circle
                d3.select(this.parentNode.firstChild).attr('visibility', function() {
                    if (selectedSampleCX > maxRadius) {
                        return 'hidden';
                    } else {
                        return 'visible';
                    }
                });

                // Update the tooltip position and value
                d3.select('#tooltip')
                    .style('top', (d3.event.pageY - 100) + 'px')
                    .style('left', (d3.event.pageX - 70) + 'px')
                    .classed('hidden', false);
                d3.select('#tooltip').select('#sample-name')
                    .text(currentSampleName);
                d3.select('#tooltip').select('#sample-country-full-name')
                    .text(currentSample.country_full_name + ' ');
                d3.select('#tooltip').select('#sample-region')
                    .text('(' + currentSample.region + ')');
                d3.select('#tooltip').select('#distance')
                    .text(matrix[sampleNumber][selectedSampleId]);
            })
            .on('mousemove', function() {
                // Update the tooltip position
                d3.select('#tooltip')
                    .style('top', (d3.event.pageY - 100) + 'px')
                    .style('left', (d3.event.pageX - 70) + 'px');
            })
            .on('mouseout', function() {
                // Remove tooltip and make sample normal again
                d3.select(this).attr('opacity', .5);
                d3.select(this.parentNode.firstChild).attr('visibility', 'hidden');
                d3.select('#tooltip').classed('hidden', true);
            })
            .on('click', function() {
                // Change all samples positions recursively
                var selectedSampleId = +d3.select(this.parentNode).attr('id');
                defaultSampleNumber = selectedSampleId;
                changeOneSampleView(selectedSampleId);
            })
            .transition()
            .duration(animationDuration)
            .attr('cx', sampleEndDistance)
            .attr('opacity', .5);
    }

    // Draw sample in the center
    d3.select('.current-sample')
        .attr('fill', sampleColors[getSampleData(matrix[0][sampleNumber - 1]).country])
        .attr('opacity', 0)
        .transition()
        .delay(animationDuration)
        .duration(0)
        .attr('opacity', 1);

    d3.select('.current-sample-tooltip-text-name').remove();
    d3.select('.current-sample-tooltip-text-location').remove();

    samples.insert('text', 'g')
        .attr('class', 'current-sample-tooltip-text-name')
        .attr('x', width / 2)
        .attr('y', height / 2 - 50)
        .text(matrix[0][sampleNumber - 1]);

    samples.insert('text', 'g')
        .attr('class', 'current-sample-tooltip-text-location')
        .attr('x', width / 2)
        .attr('y', height / 2 - 30)
        .text(getSampleData(matrix[0][sampleNumber - 1]).country_full_name + ' (' + getSampleData(matrix[0][sampleNumber - 1]).region + ')');

    // Draw selected sample line
    d3.select('.current-sample-line')
        .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ') rotate(' + angle(getSampleData(matrix[0][sampleNumber - 1]).subj_id) + ')')
        .attr('x2', 0)
        .attr('stroke', sampleColors[getSampleData(matrix[0][sampleNumber - 1]).country])
        .transition()
        .duration(animationDuration)
        .attr('x2', maxRadius);
}

var changeAllSamplesView = function(viewType) {
    if (viewType === 'ALL') {
        // Show all samples
        d3.select('.all-samples')
            .selectAll('g')
            .attr('visibility', 'visible');

    } else {
        // Show only selected country samples
        d3.select('.all-samples')
            .selectAll('g')
            .attr('visibility', function() {
                if (this.getAttribute('class') === viewType) {
                    return 'visible';
                } else {
                    return 'hidden';
                }
            });
    }
}

var changeScale = function(value) {
    d3.select('#slider-container').select('#scale-text')
        .text(matrixMaxValue / value);

    d3.select('.samples')
        .selectAll('.sample')
        .selectAll('.sample-circle')
        .attr('cx', function() {
            var matrixValue = matrix[defaultSampleNumber][+d3.select(this.parentNode).attr('id')];
            if (matrixValue === 'NA') {
                return +d3.select(this).attr('cx');
            } else {
                return distance(matrixValue) * value;
            }
        })
        .attr('visibility', function() {
            var matrixValue = matrix[defaultSampleNumber][+d3.select(this.parentNode).attr('id')];
            if (+d3.select(this).attr('cx') > maxRadius & (matrixValue != 'NA')) {
                return 'hidden';
            } else {
                return 'visible';
            }
        });

    d3.select('.samples')
        .selectAll('.sample')
        .selectAll('.tooltip-circle')
        .attr('r', function() {
            var matrixValue = matrix[defaultSampleNumber][+d3.select(this.parentNode).attr('id')];
            if (matrixValue === 'NA') {
                return +d3.select(this).attr('r');
            } else {
                return distance(matrixValue) * value;
            }
        });
}

var getSampleData = function(sampleName) {
    for (var i = 0; i < samplesData.length; i++) {
        if (samplesData[i].sample_name === sampleName) {
            return samplesData[i];
        }
    }
    return {
        sample_name: '0',
        group: '0',
        country: '0',
        country_full_name: '0',
        region: '1',
        subj_id: '0',
        run_id: '0',
        family: '0',
        disorder: '0'
    };
}

var isSampleActive = function(sampleIndex) {
    for (var i = 1; i < nOfSamples + 1; i++) {
        if (matrix[i][sampleIndex] != '0' & matrix[i][sampleIndex] != 'NA') {
            return true;
        }
    }
    return false;
}

var getSampleIndexInSubject = function(sampleName, sampleSubj) {
    var result = 0;
    for (var i = 0; i < nOfSamples; i++) {
        if (samplesData[i].subj_id === sampleSubj) {
            result++;
            if (samplesData[i].sample_name === sampleName) {
                return result;
            }
        }
    }
    return result;
}

var sortMatrixByCountry = function() {
    matrix = matrix.sort(function(a, b) {
        if (getSampleData(a[0]).country > getSampleData(b[0]).country) {
            return 1;
        } else if (getSampleData(a[0]).country < getSampleData(b[0]).country) {
            return -1;
        } else if (getSampleData(a[0]).sample_name > getSampleData(b[0]).sample_name) {
            return 1;
        } else if (getSampleData(a[0]).sample_name < getSampleData(b[0]).sample_name) {
            return -1;
        } else {
            return 0;
        }
    });
}

var transpose = function(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) {
            return r[c];
        });
    });
}

var setUrlParameter = function(paramName, paramValue) {
    var url = window.location.href;
    if (url.indexOf(paramName + "=") >= 0) {
        var prefix = url.substring(0, url.indexOf(paramName));
        var suffix = url.substring(url.indexOf(paramName));
        suffix = suffix.substring(suffix.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + paramName + "=" + paramValue + suffix;
    } else {
        if (url.indexOf("?") < 0)
            url += "?" + paramName + "=" + paramValue;
        else
            url += "&" + paramName + "=" + paramValue;
    }
    window.history.pushState('', '', url);
}

var getUrlParameter = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Bacteria selector handler
d3.select('#bacteria-selector').on('change', function() {
    // Set slider value to default when changing bacteria
    var scaleSlider = document.getElementById('scale-slider');
    scaleSlider.value = 1;

    // Remove old samples
    d3.select('.all-samples').remove();

    // Draw new bacteria data
    return drawBacteriaData(this.value, d3.select('#view-selector').property('value'));
});

// View selector handler
d3.select('#view-selector').on('change', function() {
    // Draw new view data
    return drawBacteriaData(d3.select('#bacteria-selector').property('value'), this.value);
});

// Scale slider handler
d3.select('#scale-slider').on('change', function() {
    // Change scale on move
    return changeScale(this.value);
});
