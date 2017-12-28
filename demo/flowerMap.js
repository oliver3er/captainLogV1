/* a map like tree , used for mindmap hashtags structure
 * inspired by code flower: http://www.redotheweb.com/CodeFlower/
 *
 * problem : can not collapse the nodes
 *
 * */

class FlowerMap {
	constructor(nothing,selector){
		this.width = 960
		this.height = 500
		const colors = d3.scaleOrdinal(d3.schemeCategory20)
		//draw 
		this.svg = selector.append('svg')
			.attr('width',`${this.width}px`)
			.attr('height',`${this.height}px`)
			.classed('flower-map',true)

		this.nodes = getNodes()
		//fix the root
		this.nodes.forEach(node => {
			if(node.id === '1'){
				node.fx = this.width /2
				node.fy = this.height /2
			}
			node.x = this.width / 2
			node.y = this.height /2
		})
		console.info(`nodes:`,this.nodes)
		console.info(`the nodes size:${this.nodes.length || 0}`)
		this.links = getLinks()
		this.links.forEach(link => {
			link.source.x = this.width / 2
			link.source.y = this.height / 2
			link.target.x = this.width / 2
			link.target.y = this.height / 2
		})
		console.info(`the links size:${this.links.length || 0}`)
		console.info(`links:`,this.links)
		this.update()
	}

	update(){
		var total = this.nodes.length || 1
		console.trace(`the total:${total}`)

		this.svg.selectAll("text").remove()

		//enter
		let link = this.svg.selectAll("line.link")
			.data(this.links, function(d) { 
				console.log(`link key:${d.target.data.name}`)
				return d.target.data.name; });

		// Enter any new links
		this.link = link.enter().insert("svg:line", ".node")
			.attr("class", "link")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		// Exit any old links.
		link.exit().remove();

		// Update the nodes
		let node = this.svg.selectAll("circle.node")
			.data(this.nodes, function(d) { 
				console.log(`node key:${d.data.name}`)
				return d.data.name; })
			.classed("collapsed", function(d) { return d._children ? 1 : 0; });

		node.transition()
			//.attr("r", function(d) { return d.children ? 3.5 : Math.pow(d.size, 2/5) || 1; });
			.attr("r", function(d) { return d.children ? 3.5 : Math.pow(40, 2/5) || 1; });

		// Enter any new nodes
		this.node = node.enter().append('svg:circle')
			.attr("class", "node")
			.classed('directory', function(d) { return (d._children || d.children) ? 1 : 0; })
			.attr("r", function(d) { return d.children ? 3.5 : Math.pow(40, 2/5) || 1; })
			.style("fill", function color(d) {
				return "hsl(" + parseInt(360 / total * d.id, 10) + ",90%,70%)";
			})
			//.call(this.force.drag)
			.on("click", this.click.bind(this))
			.on("mouseover", this.mouseover.bind(this))
			.on("mouseout", this.mouseout.bind(this));

		// Exit any old nodes
		node.exit().remove();

		this.text = this.svg.append('svg:text')
			.attr('class', 'nodetext')
			.attr('dy', 0)
			.attr('dx', 0)
			.attr('text-anchor', 'middle');

		this.force = d3.forceSimulation(this.nodes)
			//.force('charge',d3.forceManyBody().strength(-400))//function(d) { return d._children ? -d.size / 100 : -40; }))
			.force('charge',d3.forceManyBody().strength(function(d) { return d._children ? -d.size / 100 : -40; }))
			//.force('link',d3.forceLink(this.links).distance(150))//function(d) { return d.target._children ? 80 : 25; }))
			.force('link',d3.forceLink(this.links).distance(function(d) { return d.target._children ? 80 : 25; }))
			.force('gravity',d3.forceManyBody().strength(function(d) { return Math.atan(total / 50) / Math.PI * 0.4 }))
			.on("tick", this.tick.bind(this))
		return this;
	}

	tick () {
		console.debug('tick:',this.nodes,this.links)
		var h = this.height;
		var w = this.width;
		this.link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		this.node.attr("transform", function(d) {
			return "translate(" + Math.max(5, Math.min(w - 5, d.x)) + "," + Math.max(5, Math.min(h - 5, d.y)) + ")";
		});
	}
	
	click(d) {
		// Toggle children on click.
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		this.update();
	}

	mouseover(d) {
		const x = d.x
		const y = (d.y - 5 - (d.children ? 3.5 : Math.sqrt(40) / 2))
		console.debug(`the text position:(${x},${y});`)
		this.text
			.attr('transform', `translate(${x},${y})`)
			.text(d.data.name)
			.style('display', null);
	};

	mouseout (d) {
		this.text.style('display', 'none');
	}
}
