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