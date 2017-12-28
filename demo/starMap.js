/* a map like star, used for relative hashtags
 *
 * */
const width  = 960,
	height = 500;
//data {{{
var nodes = [
	    {id: 0,fx:(0),fy:(0)},
	    {id: 1},
	    {id: 2},
	    {id: 3},
	    {id: 4},
	    {id: 5},
	    {id: 6},
	    {id: 7},
	    {id: 8},
	    {id: 9},
	    {id: 10},
	    {id: 11},
	    {id: 12},
	    {id: 13},
	    {id: 14},
	    {id: 15},
	    {id: 16},
	  ],
	  lastNodeId = 2,
	  links = [
		      {source: nodes[0], target: nodes[1], },
		      {source: nodes[0], target: nodes[2], },
		      {source: nodes[0], target: nodes[3], },
		      {source: nodes[0], target: nodes[4], },
		      {source: nodes[0], target: nodes[5], },
		      {source: nodes[0], target: nodes[6], },
		      {source: nodes[0], target: nodes[7], },
		      {source: nodes[0], target: nodes[8], },
		      {source: nodes[0], target: nodes[9], },
		      {source: nodes[0], target: nodes[10], },
		      {source: nodes[0], target: nodes[11], },
		      {source: nodes[0], target: nodes[12], },
		      {source: nodes[0], target: nodes[13], },
		      {source: nodes[0], target: nodes[14], },
		      {source: nodes[0], target: nodes[15], },
		      {source: nodes[0], target: nodes[16], },
		    ];
//}}}

class StarMap {
	constructor(data,selector){
		const colors = d3.scaleOrdinal(d3.schemeCategory20)
		//draw 
		const svg = selector.append('svg')
			.attr('width',`${width}px`)
			.attr('height',`${height}px`)
			.classed('star-map',true)

		const marker = svg.append('defs').append('marker')
			.attr('id', 'arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', 6)
			.attr('markerWidth', 3)
			.attr('markerHeight', 3)
			.attr('orient', 'auto')
			.append('path')
			.attr('d', 'M0,-5L10,0L0,5')
			.attr('fill', '#000')

		const g = svg.append('g')
			.attr('transform',`translate(${width/2},${height/2})`)
		
		//draw link
		const pathLink = g.selectAll('path').data(links).enter().append('path')
			.classed('link',true)
			.style('marker-end','url(#arrow)')
			.attr('d','M0,0L0,0')

		//draw nodes
		const circle = g.selectAll('circle').data(nodes).enter().append('circle')
			.classed('node',true)
			.attr('r',12)
			.style('fill',function(d){return d3.rgb(colors(d.id)).brighter().toString()})
			.style('stroke',function(d){return d3.rgb(colors(d.id)).darker().toString()})
			.attr('cx',0)
			.attr('cy',0)
		
			
		//using force
		const simulation = d3.forceSimulation(nodes)
			.force('charge',d3.forceManyBody(-1000))
			.force('link',d3.forceLink(links).distance(150))
			.on('tick',function(){
				pathLink.attr('d',function(d){
					var deltaX = d.target.x - d.source.x,
						        deltaY = d.target.y - d.source.y,
						        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
						        normX = deltaX / dist,
						        normY = deltaY / dist,
						        sourcePadding = 17,
						        targetPadding = 17,
						        sourceX = d.source.x + (sourcePadding * normX),
						        sourceY = d.source.y + (sourcePadding * normY),
						        targetX = d.target.x - (targetPadding * normX),
						        targetY = d.target.y - (targetPadding * normY);
					return `M${sourceX},${sourceY}L${targetX},${targetY}`;
				})
				circle
					.attr('cx',function(d){return d.x})
					.attr('cy',function(d){return d.y})
			})

	}
}
