/* this script demo a two side raindrop transition to a single side drop, using modify 'd' attribute */
d3.select('body').selectAll('svg').remove()
var svg = d3.select('body').append('svg')
    .attr('width','500px')
    .attr('height','500px')
    //.style('background','BLACK')

var g = svg.append('g')
    .attr('transform','translate(250,250)')
        
var r = 80
var path = g.append('path')
    .attr('fill','crimson')
    .attr('stroke','none')
    .attr('d',
       `M${r},0` +
       `C${r},${r} 0,${r} 0,${3*r}` + 
       `C0,${r} ${-r},${r} ${-r},0` + 
       `C${-r},${-r} 0,${-r} 0,${-3*r}` + 
       `C0,${-r} ${r},${-r} ${r},0` + 
       `Z`)

path.transition().duration(2000)
    .attr('d',`M${r},0` +
       `C${r},${r/2} ${r/2},${r} 0,${r}` + 
       `C${-r/2},${r} ${-r},${r/2} ${-r},0` +
       `C${-r},${-r} 0,${-r} 0,${-3*r}` + 
       `C0,${-r} ${r},${-r} ${r},0` + 
       `Z`)

