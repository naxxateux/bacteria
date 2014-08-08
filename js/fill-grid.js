var bacteriaNames = [];
var viewType = 'ALL';
var imgWidth = 300,
    imgHeight = 300;

var addContent = function(i, view) {
    var row = $('<div>').appendTo('#container').addClass('row');

    for (var j = 0; j < 3; j++) {
        if ((i + j) < bacteriaNames.length) {
            var bacteriaName = bacteriaNames[i + j].split('/')[3].split('.')[0];
            var column = $('<div>').appendTo(row).addClass('column-' + (j + 1));
            $('<div>').appendTo(column).addClass('caption').html(bacteriaName);
            var imageContainer = $('<div>').appendTo(column).addClass('image-container').fadeIn('slow');
            var link = $('<a href="bacteria.html?name=' + bacteriaName + '&view=' + view + '">').appendTo(imageContainer);
            $('<img src="img/' + view + '/' + bacteriaName + '.png" width="' + imgWidth + '" height="' + imgHeight + '">').appendTo(link);
        }
    }
}

var drawSelectedViewTypeGrid = function() {
    $('#container').remove();
    $('body').append('<div id="container">');
    var nOfPossibleRows = 5;
    $(function() {
        // Read the file names
        $.get('php/get_images.php?view=' + viewType, function(data) {
            bacteriaNames = data;
            for (var i = 0; i < nOfPossibleRows * 3; i += 3) {
                if (i < bacteriaNames.length) {
                    addContent(i, viewType);
                }
            }
        }, 'json');

        // Add scroll event
        $(window).scroll(function() {
            var scrollTop = $(window).scrollTop();
            var scrollHeight = $(document).height();
            if (scrollTop === scrollHeight - $(window).height()) {
                if ($('#container > *').length * 3 < bacteriaNames.length) {
                    addContent($('#container > *').length * 3, viewType);
                }
            }
        });
    });
}

// Fill selector with options
$('<option value="ALL">').appendTo('#view-selector').html('All regions');
$('<option value="CHN">').appendTo('#view-selector').html('China');
$('<option value="EUR">').appendTo('#view-selector').html('Europe');
$('<option value="RUS">').appendTo('#view-selector').html('Russia');
$('<option value="USA">').appendTo('#view-selector').html('USA');

// Add change function to view selector
$('#view-selector').change(function() {
    viewType = this.value;
    drawSelectedViewTypeGrid();
});

drawSelectedViewTypeGrid();
