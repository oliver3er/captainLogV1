/* do not have any effect , just a basic data structure mindmap
 * */


class NothingMap {
	constructor(data,container){
		const info = ['NothingMap -> constructor:']
		/* propeties */
		this.data = data;
		this.nodesArray = nodesArrayDeanchen
		this.linksArray = linksArrayDeanchen
		this.container = container;
		this.width = 700
		this.height = 700
		this.treeWidth = 300
		this.treeHeight = 700
		info.push(`load the nothingmap:`,this)

		this.draw()

		console.debug(...info)
	}

	draw(){
		const info = ['NothingMap -> draw:']
		info.push(`begin draw...`)
		//add svg
		this.svg = this.container.append('svg')
			.attr('width',`${this.width}`)
			.attr('height',`${this.height}`)
			.classed('nothing-mindmap',true)

		this.relativeG = this.svg.append('g')
			.attr('transform','translate(20,0)')

		this.g = this.svg.append('g')
			.attr('transform','translate(20,0)')
		const g = this.g

		const tree = d3.tree()
			.size([this.treeHeight,this.treeWidth])
			//.nodeSize([100,200])
		info.push(`found a tree;`)

		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		info.push(`found a stratify;`)

		const root = stratify(this.data);
		tree(root)

		//links
		const link = g.selectAll('.link')
			.data(root.links()).enter().append('path')
				.classed('link',true)
				.attr('d',function(d){
					const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					return d3.line()(points)
				})
		
		//nodes
		const node = g.selectAll('.node')
			.data(root.descendants()).enter().append('g')
				.classed('node',true)
				.attr('transform',function(d){
					return `translate(${d.y},${d.x})`
				})
		node.append('circle')
			.attr('r',4)
			.style('fill',function(d){
				return d.data.color
			})
			.on('click',this.toggleTag.bind(this))

		node.append('text')
			.text(function(d){return d.data.name})
			.classed('branch-text',function(d){
				return d.children
			})
			.attr('x',8)
			.attr('y',function(d){
				return d.children ? -4 : undefined
			})

		console.debug(...info)
	}

	/* expend/collapse the hashtag , when expend, display all hashtags relative to current tag*/
	toggleTag(d){
		const info = ['NothingMap -> toggelTag:']
		const {hasShowRelativeTags} = this
		info.push(`hasShowRelativeTags :${hasShowRelativeTags}`)
		if(hasShowRelativeTags){
			this.hasShowRelativeTags = false
			this.simulation.stop()
			this.svg.selectAll('.relative-node').remove()
			this.svg.selectAll('.relative-link').remove()
			console.debug(...info)
			return
		}else{
			this.hasShowRelativeTags = true
		}
		const {x,y} = d
		const {name} = d.data
		info.push(`with data:`,d)
		//find all reliatve tag
		const relativeTagNames = []
		this.linksArray.forEach(link => {
			if(link.source === name ){
				relativeTagNames.push(link.target)
			}else if(link.target === name ){
				relativeTagNames.push(link.source)
			}
		})
		info.push(`found relatived tag :${relativeTagNames.length};`)

		const relativeTags = [{
			id : name,
			name,
			fx:x,
			fy:y,
			x,
			y,
		},...
			relativeTagNames.map(n =>{
			return {
				id : n,
				name : n,
				x: x + Math.random()*10 - 5,
				y: y + Math.random()*10 - 5,
				color : 'crimson',
			}})
		]
		const relativeLinks = relativeTags.slice(1).map(tag => {
			return {
				source : relativeTags[0],
				target : tag,
			}
		})

		const relativeNode = this.g.selectAll('.relative-node')
			.data(relativeTags.slice(1)).enter().append('g')
				.classed('relative-node',true)
				.attr('transform',function(d){return `translate(${d.y},${d.x})`})
		relativeNode.append('circle')
			.attr('r',4)
			.attr('fill',function(d){return d.color})
		relativeNode.append('text')
			.text(function(d){return d.name})

		const relativeLink = this.relativeG.selectAll('.relative-link')
			.data(relativeLinks).enter().append('path')
				.classed('relative-link',true)
				.attr('d',function(d){
					const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					return d3.line()(points)
				})
		
		//disperse the nodes
		this.simulation = d3.forceSimulation()
			.force('charge',d3.forceManyBody(-30))
			.force('link',d3.forceLink(relativeLinks).distance(100))
			//.force('center',d3.forceCenter([y,x]))
		this.simulation
			.nodes(relativeTags)
			.on('tick',function(){
				relativeNode.attr('transform',function(d){
					console.debug(d)
					//if(d.id !== name) debugger
					return `translate(${d.y},${d.x})`})
				relativeLink
					.attr('d',function(d){
						const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
						return d3.line()(points)
					})
			})
			.stop()

		setTimeout(()=> this.simulation.restart(),100)
		
			
		console.debug(...info)
	}
}
