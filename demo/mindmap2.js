/* the module to draw a mindmap
 * */


/* draw a node */
function raindrop(size,bothSide) {
	var r = Math.sqrt(size / Math.PI);
//	  return "M" + r + ",0"
//      + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
//      + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
//      + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
//      + "Z";
	if(bothSide){
		return (
			`M${r},0` +
			`C${r},${r} 0,${r} 0,${4*r}` + 
			`C0,${r} ${-r},${r} ${-r},0` + 
			`C${-r},${-r} 0,${-r} 0,${-4*r}` + 
			`C0,${-r} ${r},${-r} ${r},0` + 
			`Z`)
	}else{
		return (
			`M${r},0` +
			`A${r},${r} 0 1,1 ${-r},0` + 
			`C${-r},${-r} 0,${-r} 0,${-4*r}` + 
			`C0,${-r} ${r},${-r} ${r},0` + 
			`Z`)
	}
}


///MindmapRaindrop {{{
class MindmapRaindrop{
	/* constructor 
	 * data : the data of mindmap nodes
	 * container : the container to draw the mindmap
	 * usage : new Mindmap([...],d3.select('#div'))
	 * */
	constructor(data,container){
		console.debug(`construct mindmap with data:${data && data.length}`);
		/* properties */
		this.data = data
		this.container = container
		this.name = 'raindrop node mindmap';
		const width = 1024//311
		const height = 645
		const duration = 500

		console.debug(`load data,nodes number:${data && data.length};`)
		console.debug(`w/ width:${width},height:${height};`)
		//add svg container
		const svg = this.container.append('svg')
			.classed('raindrop',true)
			.attr('width',width)
			.attr('height',height)
		//this g(group) is for zoom & pan action
		const panelG = svg.append('g');
		const mainG = panelG.append('g')
			.attr('id','mainG')
			.attr('transform','translate(50,0)');
		/* the group for divergent tree */
		const divergentG = panelG.append('g')
			.attr('id','divergentG');

		const tree = d3.tree()
			.size([450,311]);
		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		const root = stratify(data);
		console.debug(`the node data:`,root)

		function update(source) {
			tree(root)
			console.debug(`the source:`,source)
			console.debug(`the re-lay root:`,root)
			const link = mainG.selectAll('.program-link')
				.data(root.links())
			const linkEnter = link.enter().append('path')
					.attr('class','program-link')
					.attr('d',d3.linkHorizontal()
						//first,place link to zero point,later,using animation to move to right place
						.source(function(d) {
							return [source.y0,source.x0]
						})
						.x(function(d) { return source.y0;})
						.y(function(d) { return source.x0;}))

			const linkExit = link.exit()

			const node = mainG.selectAll('.program-node')
				.data(root.descendants())
				
			const nodeEnter = node.enter().append('g')
				.attr('id',function(d) { return 't-g-' + d.id})
				.attr("class", function(d) { return "program-node" + (d.children ? " node--internal" : " node--leaf"); })
				//when create , just place the node at original point,later, make animation to move to right place
				//.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })

			nodeEnter.append("path")
				.attr('id',function(d) { return 't-c-' + d.id})
				.classed('program-node',true)
				.attr('d',function(d){ return raindrop(60,d.children && d.id !== '1' ? true:false)})
				.attr('transform',function(d){
					return d.id === '1'?'rotate(90)':'rotate(-90)'
				})
				.on('click',function(d){
					//const source = {
					//	x: d.x,
					//	y: d.y,
					//}
					console.debug('the click:',d)
					//toggle the chidlren
					if(d.children){
						d._children = d.children
						d.children = null
					}else if(d._children){
						d.children = d._children
						d._children = null
					}
					update(d)
				})

			const text = nodeEnter.append("text")
				.attr('id',function(d) { return 't-t-' + d.id})
				.attr("dy", 3)
				.attr("x", function(d) { return d.children ? -8 : 8; })
				.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
				.style('fill',function(d) {return d.data.color ? d.data.color : 'rgba(233,69,69,1)'})
				.text(function(d) { return d.data.name })
				.style('opacity',0)//fade in
				.on('click',function(d){
					console.log('okook');
					highlight(d.id);
					onClick && onClick(d.data);
				})

			//animation:to move to right place(node & link)
			nodeEnter.transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

			linkEnter.transition()
				.duration(duration)
				.attr('d',d3.linkHorizontal()
					.x(function(d) { return d.y;})
					.y(function(d) { return d.x;}))

			text.transition()
				.duration(duration)
				.style('opacity',1)

			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr("transform", function(d) {
					  return "translate(" + source.y0 + "," + source.x0 + ")";
					  })
				.remove();

			linkExit.transition()
				.duration(duration)
				.attr('d',d3.linkHorizontal()
					.x(function(d) { return source.y0;})
					.y(function(d) { return source.x0;}))
				.remove()

			root.descendants().forEach(function(d){
				d.x0 = d.x
				d.y0 = d.y
			})
		}


		tree(root)
		root.x0 = root.x
		root.y0 = root.y

		update(root);

	}
}
///}}}

///MindmapElastic {{{
class MindmapElastic{
	/* constructor 
	 * data : the data of mindmap nodes
	 * container : the container to draw the mindmap
	 * usage : new Mindmap([...],d3.select('#div'))
	 * */
	constructor(data,container){
		console.debug(`construct mindmap with data:${data && data.length}`);
		/* properties */
		this.data = data
		this.container = container
		this.name = 'raindrop node mindmap';
		const width = 1024//311
		const height = 645
		const duration = 1000
		//ease function ,document:https://github.com/d3/d3-ease 
		const EASE = d3.easeElastic

		console.debug(`load data,nodes number:${data && data.length};`)
		console.debug(`w/ width:${width},height:${height};`)
		//add svg container
		const svg = this.container.append('svg')
			.attr('width',width)
			.attr('height',height)
			//the class of container 
			.classed('class1',true)

		//this g(group) is for zoom & pan action
		const panelG = svg.append('g');
		const mainG = panelG.append('g')
			.attr('id','mainG')
			.attr('transform','translate(50,0)');
		/* the group for divergent tree */
		const divergentG = panelG.append('g')
			.attr('id','divergentG');

		const tree = d3.tree()
			.size([450,311]);
		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		const root = stratify(data);
		console.debug(`the node data:`,root)

		function update(source) {
			tree(root)
			console.debug(`the source:`,source)
			console.debug(`the re-lay root:`,root)
			const link = mainG.selectAll('.program-link')
				.data(root.links())
			const linkEnter = link.enter().append('path')
					.attr('class','program-link')
					.attr('d',d3.linkHorizontal()
						//first,place link to zero point,later,using animation to move to right place
						.source(function(d) {
							return [source.y0,source.x0]
						})
						.x(function(d) { return source.y0;})
						.y(function(d) { return source.x0;}))

			const linkExit = link.exit()

			const node = mainG.selectAll('.program-node')
				.data(root.descendants())
				
			const nodeEnter = node.enter().append('g')
				.attr('id',function(d) { return 't-g-' + d.id})
				.attr("class", function(d) { return "program-node" + (d.children ? " node--internal" : " node--leaf"); })
				//when create , just place the node at original point,later, make animation to move to right place
				//.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })

			nodeEnter.append("circle")
				.attr('id',function(d) { return 't-c-' + d.id})
				.attr("r", 0)

			const text = nodeEnter.append("text")
				.attr('id',function(d) { return 't-t-' + d.id})
				.attr("dy", 3)
				.attr("x", function(d) { return d.children ? -8 : 8; })
				.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
				.style('fill',function(d) {return d.data.color ? d.data.color : 'rgba(233,69,69,1)'})
				.text(function(d) { return d.data.name })
				//.style('opacity',0)//fade in
				.style('font-size',0)
				.on('click',function(d){
					console.log('okook');
					highlight(d.id);
					onClick && onClick(d.data);
				})

			//transition , document: https://github.com/d3/d3-transition
			//animation:to move to right place(node & link)
			nodeEnter.transition()
				.duration(duration)
				.ease(EASE)
				.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
			nodeEnter.selectAll('circle')
				.transition()
				.duration(duration)
				.ease(EASE)
				.attr('r',4)
				

			linkEnter.transition()
				.duration(duration)
				.ease(EASE)
				.attr('d',d3.linkHorizontal()
					.x(function(d) { return d.y;})
					.y(function(d) { return d.x;}))

			text.transition()
				.duration(duration)
				.ease(EASE)
				.style('font-size',12)

			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr("transform", function(d) {
					  return "translate(" + source.y0 + "," + source.x0 + ")";
					  })
				.remove();

			linkExit.transition()
				.duration(duration)
				.attr('d',d3.linkHorizontal()
					.x(function(d) { return source.y0;})
					.y(function(d) { return source.x0;}))
				.remove()

			root.descendants().forEach(function(d){
				d.x0 = d.x
				d.y0 = d.y
			})
		}


		tree(root)
		root.x0 = root.x
		root.y0 = root.y

		update(root);

	}
}
///}}}

