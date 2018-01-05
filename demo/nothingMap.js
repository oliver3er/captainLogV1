/* do not have any effect , just a basic data structure mindmap
 * */

const EASE = d3.easeCubic
//const EASE = d3.easeElastic
const DURATION  = 1000
// the radius of nodes
const RADIUS = 4
//the radius of root node
const ROOT_RADIUS = 8
//when mindmap view , scale up the radius = RADIUS * RATIO_RADIUS
const RATIO_RADIUS = 2

class NothingMap {
	constructor(data,container){
		const info = ['NothingMap -> constructor:']
		/* properties */
		this.data = data;
		this.nodesArray = nodesArrayDeanchen
		this.linksArray = linksArrayDeanchen
		this.container = container;
		this.width = 1200
		this.height = 700
		this.treeWidth = 300
		this.treeHeight = 700
		info.push(`load the nothingmap:`,this)
		
		//now , build the constructure of data, it is :
		//	root {
		//			
		//	}
		//	links {
		//	}
		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		this.root = stratify(data)
		info.push(`found root ,with nodes:${this.root.descendants().length};links:${this.root.links().length};`)
		//the whole tree for single side mindmap
		this.singleSideData = data
		//build two side mindmap ,left and right two way tree mindmap,NOTE,the array leading by root node
		//right/leftSideData = [{name,_id,color,parentId}...]
		const rootChildren = this.root.children
		const rightChildren = rootChildren.slice(0,Math.round(rootChildren.length / 2))
		info.push(`deside right size:${rightChildren.length};`)
		const leftChildren = rootChildren.slice(Math.round(rootChildren.length / 2))
		info.push(`deside left size:${leftChildren.length};`)
		const reducer = (a,c) => {
			return [...a,...c.descendants().map(n => {
				return {
					name : n.data.name,
					_id : n.id,
					color : n.data.color,
					parentId : n.parent ? n.parent.id : undefined,
				}
			})]
		}
		this.rightSideData = rightChildren.reduce(reducer,[data[0]])
		this.leftSideData = leftChildren.reduce(reducer,[data[0]])
		info.push(`build right side data:${this.rightSideData.length};`)
		info.push(`build left side data:${this.leftSideData.length};`)

		//build the original shape , the svg , group, and node,link(with original position)
		//build svg/group
		this.svg = this.container.append('svg')
			.attr('width',`${this.width}`)
			.attr('height',`${this.height}`)
			.classed('nothing-mindmap',true)
			//.attr('transform','translate(20,0)')
		this.g = this.svg.append('g')
			//.attr('transform','translate(20,0)')
		this.relativeG = this.g.append('g')

		//links
		this.link = this.g.selectAll('.link')
			.data(this.root.links()).enter().append('path')
				.classed('link',true)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		//nodes
		this.node = this.g.selectAll('.node')
			.data(this.root.descendants()).enter().append('g')
				.classed('node',true)
				.attr('transform',function(d){
					return `translate(0,0)`
					//return `translate(${d.y},${d.x})`
				})
		this.node.append('circle')
			.attr('r',0)
			.style('fill',function(d){
				return d.data.color
			})
			.on('click',this.toggleTag.bind(this))

		this.node.append('text')
			.text(function(d){return d.data.name})
			.classed('branch-text',function(d){
				return d.children
			})
			.attr('x',8)
			.attr('y',function(d){
				return d.children ? -4 : undefined
			})

		info.push(`build original shape,this nodes:${d3.selectAll('.node').size()};links:${d3.selectAll('.link').size()};`)
		//this.update()
		//this.updateSingleSide()
		this.updateTwoSide()

		console.info(...info)
	}

	updateSingleSide(){//{{{
		const info = ['NothingMap -> updateSingleSide:']
		info.push(`begin draw...`)

		const tree = d3.tree()
			.size([this.treeHeight,this.treeWidth])
			//.nodeSize([100,200])
		info.push(`found a tree;`)

		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		info.push(`found a stratify;`)

		const singleSideRoot = stratify(this.singleSideData);
		tree(singleSideRoot)

		//translate the root position to (0,0)
		const rootPosition = [singleSideRoot.x,singleSideRoot.y]
		info.push(`the root original position:`,rootPosition)
		const translateX = x => {
			return x - rootPosition[0]
		}
		const translateY = y => {
			return y - rootPosition[1]
		}
		info.push(`the root position after translate:(${translateX(singleSideRoot.x)},${translateY(singleSideRoot.y)});`)

		//update the class data
		this.root.descendants().forEach(d => {
			const info = ['update node position:']
			let newNode = singleSideRoot.descendants().reduce((a,c) => {
				return c.id === d.id ? c : a
			},undefined)
			info.push(`found new node`,newNode)
			d.x = translateX(newNode.x)
			d.y = translateY(newNode.y)
			console.debug(...info)
		})
		this.root.links().forEach(d => {
			const info = ['update links:']
			//found the node in new tree
			let newLink = singleSideRoot.links().reduce((a,c) => {
				return c.source.id === d.source.id && c.target.id === d.target.id ? c : a
			},undefined)
			info.push(`found new link`,newLink)
			console.debug(...info)
			d.source.x = translateX(newLink.source.x)
			d.source.y = translateY(newLink.source.y)
			d.target.x = translateX(newLink.target.x)
			d.target.x = translateX(newLink.target.x)
		})
		
		//now , move the existed shape to the new d3 tree position
		this.link
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('d',function(d){
				const info = ['move links:']
				//found the node in new tree
				const newLink = singleSideRoot.links().reduce((a,c) => {
					return c.source.id === d.source.id && c.target.id === d.target.id ? c : a
				},undefined)
				info.push(`found new link`,newLink)
				console.debug(...info)
				const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
				return d3.line()(points)
			})
		this.node
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('transform',function(d){
				const info = ['move nodes:']
				//found the node in new tree
				const newNode = singleSideRoot.descendants().reduce((a,c) => {
					return c.id === d.id ? c : a
				},undefined)
				info.push(`found new nodes`,newNode)
				console.debug(...info)
				return `translate(${d.y},${d.x})`
			})
		this.node.selectAll('circle')
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('r',function(d){
				return d.parent ? RADIUS : ROOT_RADIUS
			})

		//move group
		this.g
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('transform',`translate(${translateY(20)},${-translateX(0)})`)

		console.info(...info)
		//}}}
	}

	updateTwoSide(){//{{{
		const info = ['NothingMap -> updateTwoSide:']
		info.push(`begin draw...`)

		const tree = d3.tree()
			.size([this.treeHeight,this.treeWidth])
			//.nodeSize([100,200])
		info.push(`found a tree;`)

		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		info.push(`found a stratify;`)

		const leftSideRoot = stratify(this.leftSideData );
		tree(leftSideRoot)
		const rightSideRoot = stratify(this.rightSideData );
		tree(rightSideRoot)
		//translate the root position to (0,0)
		const positionRootRight = [rightSideRoot.x,rightSideRoot.y]
		info.push(`the root original position:`,positionRootRight)
		const translateXRight = x => {
			return x - positionRootRight[0]
		}
		const translateYRight = y => {
			return y - positionRootRight[1]
		}
		info.push(`the root right position after translate:(${translateXRight(rightSideRoot.x)},${translateYRight(rightSideRoot.y)});`)
		const positionRootLeft = [leftSideRoot.x,leftSideRoot.y]
		info.push(`the root left original position:`,positionRootLeft)
		const translateXLeft = x => {
			return x - positionRootLeft[0]
		}
		const translateYLeft = y => {
			return (y - positionRootLeft[1] ) * (-1)
		}
		info.push(`the root left position after translate:(${translateXLeft(leftSideRoot.x)},${translateYLeft(leftSideRoot.y)});`)
		//update the class data
		this.root.descendants().forEach(d => {
			const info = ['update node position:']
			let isRight;
			let newNode = rightSideRoot.descendants().reduce((a,c) => {
				return c.id === d.id ? c : a
			},undefined)
			if(newNode){
				isRight = true
			}else{
				newNode = leftSideRoot.descendants().reduce((a,c) => {
					return c.id === d.id ? c : a
				},undefined)
				if(newNode){
					isRight = false
				}
			}
			info.push(`found new node`,newNode,`is right? ${isRight}`)
			d.x = isRight ? translateXRight(newNode.x) : translateXLeft(newNode.x)
			d.y = isRight ? translateYRight(newNode.y) : translateYLeft(newNode.y)
			console.debug(...info)
		})
		this.root.links().forEach(d => {
			const info = ['update links:']
			//found the node in new tree
			let isRight;
			let newLink = rightSideRoot.links().reduce((a,c) => {
				return c.source.id === d.source.id && c.target.id === d.target.id ? c : a
			},undefined)
			if(newLink){
				isRight = true
			}else{
				newLink = leftSideRoot.links().reduce((a,c) => {
					return c.source.id === d.source.id && c.target.id === d.target.id ? c : a
				},undefined)
				if(newLink){
					isRight = false
				}
			}
			info.push(`found new link`,newLink,`is right? ${isRight}`)
			console.debug(...info)
			d.source.x = isRight ? translateXRight(newLink.source.x):translateXLeft(newLink.source.x)
			d.source.y = isRight ? translateYRight(newLink.source.y):translateYLeft(newLink.source.y)
			d.target.x = isRight ? translateXRight(newLink.target.x):translateXLeft(newLink.target.x)
			d.target.x = isRight ? translateXRight(newLink.target.x):translateXLeft(newLink.target.x)
		})
		
		//now , move the existed shape to the new d3 tree position
		this.link
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('d',function(d){
				const info = ['move links:']
				const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
				console.debug(...info)
				return d3.line()(points)
			})
		this.node
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('transform',function(d){
				const info = ['move nodes:']
				console.debug(...info)
				return `translate(${d.y},${d.x})`
			})
		this.node.selectAll('circle')
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('r',function(d){
				return d.parent ? RADIUS*RATIO_RADIUS : ROOT_RADIUS * RATIO_RADIUS
			})
		//move group
		this.g
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('transform',`translate(${translateYRight(1200/2)},${-translateXRight(0)})`)

		console.info(...info)
		//}}}
	}

	/* switch tag display mode between: fold,collapse,relative collapse*/
	toggleTag(d){
		//this.toggleChildren(d)
		this.collapseRelativeTagWithParent.bind(this)(d)		
	}

	/* fold/collapse the nodes children  */
	toggleChildren(d){
		if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
	}

	/* expend/collapse the hashtag , when expend, display all hashtags relative to current tag*/
	collapseRelativeTag(d){//{{{
		const info = ['NothingMap -> toggelTag:']
		const {hasShowRelativeTags} = this
		info.push(`hasShowRelativeTags :${hasShowRelativeTags}`)
		if(hasShowRelativeTags){
			this.hasShowRelativeTags = false
			this.simulation.stop()
			this.svg.selectAll('.relative-node').remove()
			this.svg.selectAll('.relative-link').remove()
			console.info(...info)
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
			if(link.source === name && relativeTagNames.every(e => e !== link.target)){
				relativeTagNames.push(link.target)
			}else if(link.target === name && relativeTagNames.every(e => e !== link.source)){
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
		info.push(`build relative link :${relativeLinks.length};`)

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
			.force('charge',d3.forceManyBody().strength(-10))
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
		
			
		console.info(...info)
		//}}}
	}
	
	/* expend/collapse the hashtag , when expend, display all hashtags relative to current tag
	 * NOTE,consider about the parent node ,it will be included in the nodes, its fixed position, and make force strength to other nodes
	 * */
	collapseRelativeTagWithParent(d){//{{{
		const info = ['NothingMap -> toggelTag:']
		console.log(`the data:`,d)
		const {hasShowRelativeTags} = d
		info.push(`hasShowRelativeTags :${hasShowRelativeTags}`)
		if(hasShowRelativeTags){
			d.hasShowRelativeTags = false
			d.simulation.stop()
			this.svg.selectAll('.relative-node').remove()
			this.svg.selectAll('.relative-link').remove()
			console.debug(...info)
			return
		}else{
			d.hasShowRelativeTags = true
		}
		const {x,y} = d
		const {name} = d.data
		info.push(`with data:`,d)
		//find all reliatve tag
		const relativeTagNames = []
		this.linksArray.forEach(link => {
			if(link.source === name && relativeTagNames.every(e => e !== link.target)){
				relativeTagNames.push(link.target)
			}else if(link.target === name && relativeTagNames.every(e => e !== link.source)){
				relativeTagNames.push(link.source)
			}
		})
		info.push(`found relatived tag :${relativeTagNames.length};`)

		const relativeTags = [
			{
				id : name,
				name,
				fx:x,
				fy:y,
				x,
				y,
			},
			//consider about parent
			{
				id : d.parent.data.name,
				name : d.parent.data.name,
				fx : d.parent.data.x,
				fy : d.parent.data.y,
			}
			,...
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
		info.push(`build relative link :${relativeLinks.length};`)

		const relativeNode = this.g.selectAll('.relative-node')
			.data(relativeTags.slice(2)).enter().append('g')
				.classed('relative-node',true)
				.attr('transform',function(d){return `translate(${d.y},${d.x})`})
		relativeNode.append('circle')
			.attr('r',4)
			.attr('fill',function(d){return d.color})
		relativeNode.append('text')
			.text(function(d){return d.name})

		const relativeLink = this.relativeG.selectAll('.relative-link')
			.data(relativeLinks.slice(1)).enter().append('path')
				.classed('relative-link',true)
				.attr('d',function(d){
					const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					return d3.line()(points)
				})
		
		//disperse the nodes
		d.simulation = d3.forceSimulation()
			.force('charge',d3.forceManyBody().strength(-10))
			.force('link',d3.forceLink(relativeLinks).distance(100))
			//.force('center',d3.forceCenter([y,x]))
		d.simulation
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

		setTimeout(()=> d.simulation.restart(),100)
		
			
		console.info(...info)
		//}}}
	}
}
