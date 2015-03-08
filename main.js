var measure = document.createElement("div");
measure.style.width = "1in";
document.documentElement.appendChild(measure);
var inchesToPixels = measure.offsetWidth;
var pixelsToInches = 1/inchesToPixels
document.documentElement.removeChild(measure);

var createGrid = function(width, height) {
    var a = [], i;
    for (i=0; i < width * height; i+=1) {
        a[i] = null;
    }
    
    return {
        width: width,
        height: height,
        array: a,
        get: function(x, y) {
            return this.array[y * this.width + x];
        },
        set: function(x, y, v) {
            this.array[y * this.width + x] = v;
        }
    };
};

var color = function(h, s, l) {
    return "hsl( " + h + ", " + s + "%, " + v + "%)";
};

var triadic = function(previousHue) {
    var step = 10;
    return (previousHue + step) % 360;
};

var borderWidths = function(x, y, grid, borderWidth) {
    var r = {};
    var pos = grid.get(x, y);
    
    var check = function(a, b, v) {
        if (grid.get(a, b) === undefined || grid.get(a, b) === null || 
            grid.get(a, b) !== v) {
            return borderWidth;
        } else {
            return 0;
        }
    };
    
    r.top = check(x, y-1, pos);
    r.bottom = check(x, y+1, pos);
    r.left = check(x-1, y, pos);
    r.right = check(x+1, y, pos);
    
    return r;
};

var renderGrid = function(settings, grid) {
    var container = document.createElement("div");
    
    var row, cell, r, c, borders;
    
    var maxWidth = Math.floor(settings.width / settings.xCells);
    var maxHeight = Math.floor(settings.height / settings.yCells);
    
    for(r=0; r < settings.yCells; r+=1) {
        row = document.createElement("div");
        for(c=0; c < settings.xCells; c+=1) {
            cell = document.createElement("div");
            cell.style.display = "inline-block";
            cell.style.border = settings.border;
            
            borders = borderWidths(c, r, grid, settings.borderWidth);
            
            cell.style.borderLeftWidth = borders.left + "px";
            cell.style.borderRightWidth = borders.right + "px";
            cell.style.borderBottomWidth = borders.bottom + "px";
            cell.style.borderTopWidth = borders.top + "px";
            
            cell.style.width = maxWidth - borders.left - borders.right
                             - settings.margin * 2 + "px";
            cell.style.height = maxHeight - borders.top - borders.bottom
                              - settings.margin * 2 + "px";
            cell.style.margin = settings.margin + "px";
            
            row.appendChild(cell);
        }
        container.appendChild(row);
        console.log(row);
    }
    
    return container;
};

var page;

window.onload = function(e) {
    page = {
        height: 9 * inchesToPixels,
        width: 6.5 * inchesToPixels,
        xCells: 3,
        yCells: 3,
        border: "5px solid black",
        borderWidth: 5,
        margin: 5
    };
    
    var b = document.getElementById("main");
    b.style.padding = "1in";
    b.style.margin = "0px";
    
    var g = createGrid(page.xCells, page.yCells);
    
    b.appendChild( renderGrid(page, g) );
};