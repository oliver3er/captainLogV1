/**
 * balls collide and concentrate to center pointer
 *
 *
 * nodes: [{"label":"oliver","id":"oliver","color":"crimson","size":3},...]
 * 
 */
//draw select for data
let nodesArray,linksArray
function changeData(name){
	if(name === 'deanchen'){
		nodesArray = nodesArrayDeanchen
		linksArray = linksArrayDeanchen
	}else if(name === 'oliver'){
		nodesArray = nodesArrayOliver
		linksArray = linksArrayOliver
	}
	console.debug(`the nodesArray:${nodesArray.length},linksArray:${linksArray.length}`)
	
	//ok, begin draw here!
	console.info(`begin draw...`)
	draw()
}
d3.select('#selectData').append('select')
	.on('change',function(){
		var name = d3.event.target.value
		changeData(name)
	})
	.selectAll('option').data(['deanchen','oliver']).enter().append('option')
		.text(function(d){return d})
		.attr('value',function(d){return d})
		.attr('selected',function(d,i){return i === 1 ? '':undefined})
changeData('oliver')


/* the main function to draw the whole graph */
function draw(){
	d3.select('#graphHolder').selectAll('*').remove()
	const width = 1200,height = 700
	const color = d3.scaleOrdinal(d3.schemeCategory10)
	const size = d3.scaleLinear()
		.domain([3,nodesArray.reduce((a,c) => c.size > a ? c.size:a,3)])
		.range([20,60])
	//random the tags
	nodesArray.forEach(node => {
		node.x = Math.random() * width //* 2
		node.y = Math.random() * height //* 2 
	})

	const svg = d3.select('#graphHolder').append('svg')
		.attr('width',`${width}px`)
		.attr('height',`${height}px`)

	const g = svg.selectAll('g').data(nodesArray).enter().append('g')
		.attr('transform',function(d){return `translate(${d.x},${d.y})`})

	g.append('circle')
		.attr('r',function(d){return size(d.size)})
		.attr('fill',function(d){return d3.color(d.color?d.color:'crimson').brighter()})
		.attr('stroke',function(d){return d.color?d.color:'crimson'})
		.style('fill-opacity',0.5)
	g.append('text')
		.text(function(d){return d.label})

	//force to concentrate it
	const simulation = d3.forceSimulation(nodesArray)
		.velocityDecay(0.1)
		//.alphaMin(0.1)
		.alphaDecay(0.13)
		.force('gravity',d3.forceManyBody().strength(function(d){return size(d.size)*20}))
		.force('charge',d3.forceManyBody().strength(function(d){return -size(d.size)*10}))
		//.force('collide',d3.forceCollide().radius(function(d){return size( d.size) }))
		//.force('center',d3.forceCenter(width/2,height/2))
		.on('tick',function(){
			var quadtree = d3.quadtree()
				.x(function(d){return d.x})
				.y(function(d){return d.y})
				.addAll(nodesArray)
			g.each(collide(.4,quadtree))
				.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")"
				})
			//g.attr("transform", function(d) {
			//	return "translate(" + d.x + "," + d.y + ")"
			//})
			if(simulation.alpha() < 0.002){
				simulation.alpha(0.0022)
			}
		})
		
	
	// Resolves collisions between d and all other circles.
	function collide(alpha, quadtree) {
		return function(d) {
			var padding = 100,//vis.forceRep.radius.range()[1] * 1.5,
				r = size(d.size) + padding, //vis.forceRep.radius(vis.forceRep.rad(d)) + padding,
				nx1 = d.x - r,
				nx2 = d.x + r,
				ny1 = d.y - r,
				ny2 = d.y + r;
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if (quad.data && (quad.data !== d) ) {
					var x = d.x - quad.data.x,
						y = d.y - quad.data.y,
						l = Math.sqrt(x * x + y * y),
						/*+ (d.nodeValue.lang !== quad.point.nodeValue.lang) * padding*/
						//r = vis.forceRep.radius(vis.forceRep.rad(d)) +
						//	vis.forceRep.radius(vis.forceRep.rad(quad.point)) * 1.02;
						r = size(d.size) + 
							size(quad.data.size) * 1.32;
					if (l < r) {
						l = (l - r) / (l || 1) * (alpha || 1);

						x *= l;
						y *= l;

						d.x -= x;
						d.y -= y;

						quad.data.x += x;
						quad.data.y += y;
					}
				}
				return x1 > nx2
					|| x2 < nx1
					|| y1 > ny2
					|| y2 < ny1;
			});
		};
	}
}

