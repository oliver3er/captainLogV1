/* do not have any effect , just a basic data structure mindmap
 * */

//const EASE = d3.easeCubic
let EASE = d3.easeElastic
let DURATION  = 1000
// the radius of nodes
let RADIUS = 4
//the radius of root node
let ROOT_RADIUS = 8
//when mindmap view , scale up the radius = RADIUS * RATIO_RADIUS
let RATIO_RADIUS = 2
//the gap between first level children and root node 
let ROOT_SEPERATOR = 80
const colorScale = d3.scaleOrdinal(d3.schemeCategory20)

//{{{ node helper class 
const NoderDefault = function(){
	return {
		init : function(selector){
			selector.append('circle')
				.attr('r',0)
				.style('fill',function(d){
					return d.data.color
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.append('text')
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('x',8)
				.attr('y',function(d){
					return d.children ? -4 : undefined
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
				})
		}.bind(this),
	}
}

const NoderTest1 = function(){
	return {
		init : function(selector){
			selector.append('circle')
				.classed('test-node-1-circle',true)
				.attr('r',0)
				.style('stroke',function(d){
					return d.data.color
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.append('text')
				.classed('test-node-1-text',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('x',8)
				.attr('y',function(d){
					return d.children ? -4 : undefined
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
				})
		}.bind(this),
	}
}
const NoderTest2 = function(){
	return {
		init : function(selector){
			selector.append('circle')
				.classed('test-2-node-circle',true)
				.attr('r',0)
				.style('stroke',function(d){
					return d.data.color
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.append('text')
				.classed('test-2-node-text',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('x',8)
				.attr('y',function(d){
					return d.children ? -4 : undefined
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
				})
		}.bind(this),
	}
}

const NodeHelperBig = function(){
	return {
		init : function(selector){
			selector.append('circle')
				.classed('big-node-circle',true)
				.attr('id',function(d){return `circle-${d.id}`})
				.attr('r',0)
				.style('fill',function(d){
					return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.each(function(d){
				const info = ['paint:']
				info.push(`paint:${d.id};`)
				const node = d3.select(this)
				node.append("clipPath")
					  .attr("id", function(d) { return "clip-" + d.id; })
					.append("use")
					  .attr("xlink:href", function(d) { return "#circle-" + d.id; });
				if(d.data.icon){
					info.push(`paint icon:`)
					node.append('image')
						.classed('big-node-icon',true)
						.attr('xlink:href',`./images/${d.data.icon}`)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.attr('x',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('y',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('width',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
						.attr('height',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
				}else{
					info.push(`paint logo letter:`)
					node.append('text')
						.classed('big-node-text-logo',true)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.text(d.data.name.slice(0,1).toUpperCase())
				}
				console.info(...info)
			})
				
			selector.append('text')
				.classed('big-node-text',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('y',function(d){
					return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
				})
		}.bind(this),
	}
}

const NodeHelperBig2 = function(){
	return {
		init : function(selector){
			selector.append('circle')
				.classed('big-node-circle-2',true)
				.attr('id',function(d){return `circle-${d.id}`})
				.attr('r',0)
				.style('fill',function(d){
					return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
				})
				.style('stroke',function(d){
					return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.each(function(d){
				const info = ['paint:']
				info.push(`paint:${d.id};`)
				const node = d3.select(this)
				node.append("clipPath")
					  .attr("id", function(d) { return "clip-" + d.id; })
					.append("use")
					  .attr("xlink:href", function(d) { return "#circle-" + d.id; });
				if(d.data.icon){
					info.push(`paint icon:`)
					node.append('image')
						.classed('big-node-icon-2',true)
						.attr('xlink:href',`./images/${d.data.icon}`)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.attr('x',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('y',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('width',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
						.attr('height',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
				}else{
					info.push(`paint logo letter:`)
					node.append('text')
						.classed('big-node-text-logo-2',true)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.text(d.data.name.slice(0,1).toUpperCase())
				}
				console.info(...info)
			})
				
			selector.append('text')
				.classed('big-node-text-2',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('y',function(d){
					return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS + 4 : RADIUS*RATIO_RADIUS + 4
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
				})
		}.bind(this),
	}
}

const NodeHelperBig3 = function(){
	return {
		init : function(selector){
			selector.append('circle')
				.classed('big-node-circle-2',true)
				.attr('id',function(d){return `circle-${d.id}`})
				.attr('r',0)
				.style('fill',function(d){
					return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
				})
				.style('stroke',function(d){
					return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.each(function(d){
				const info = ['paint:']
				info.push(`paint:${d.id};`)
				const node = d3.select(this)
				node.append("clipPath")
					  .attr("id", function(d) { return "clip-" + d.id; })
					.append("use")
					  .attr("xlink:href", function(d) { return "#circle-" + d.id; });
				if(d.data.icon){
					info.push(`paint icon:`)
					node.append('image')
						.classed('big-node-icon-2',true)
						.attr('xlink:href',`./images/${d.data.icon}`)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.attr('x',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('y',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('width',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
						.attr('height',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
				}else{
					info.push(`paint logo letter:`)
					node.append('text')
						.classed('big-node-text-logo-2',true)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.text(d.data.name.slice(0,1).toUpperCase())
				}
				console.info(...info)
			})
				
			selector.append('text')
				.classed('big-node-text-2',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('y',function(d){
					if(d.weight === undefined){
						throw new Error()
					}
					const change = d.weight * 18 - 3
					return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS + 4 : RADIUS*RATIO_RADIUS + 4 + change
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			const objectThis = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					if(d.weight === undefined){
						throw new Error()
					}
					const change = d.weight * 18 - 3
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS + change
				})
				.on('end',function(){
					//when finish , force the node
					var forceStrength = 0.006
					function charge(d) {
						if(d.weight === undefined){
							throw new Error()
						}
						const change = d.weight * 18 - 3
						r = d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS + change
						return -Math.pow(r, 2.0) * forceStrength
					}
					objectThis.simulation = d3.forceSimulation(root.descendants())
						.velocityDecay(0.7)
						.alphaDecay(0.08)
						.force('charge', d3.forceManyBody().strength(charge))
						//.force('collide',d3.forceCollide().radius(function(d){
						//	if(d.weight === undefined){
						//		throw new Error()
						//	}
						//	const change = d.weight * 18 - 3
						//	r = d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS + change
						//	return r * 1.05
						//}))
						.on('tick',() => {
							const info = ['tick:']
							objectThis.node
								.attr('transform',function(d){
									return `translate(${d.y},${d.x})`
								})
							objectThis.link
								.attr('d',function(d){
									const info = ['move links:']
									//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
									//return d3.line()(points)
									console.debug(...info)
									return d3.linkHorizontal()({
										source : [d.source.y,d.source.x],
										target : [d.target.y,d.target.x],
									})
								})
							console.debug(...info)
						})

				})
		}.bind(this),
	}
}

const NodeHelperBig4 = function(){
	return {
		init : function(selector){
			selector.append('circle')
				.classed('big-node-circle-4',true)
				.attr('id',function(d){return `circle-${d.id}`})
				.attr('r',0)
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.each(function(d){
				const info = ['paint:']
				info.push(`paint:${d.id};`)
				const node = d3.select(this)
				node.append("clipPath")
					  .attr("id", function(d) { return "clip-" + d.id; })
					.append("use")
					  .attr("xlink:href", function(d) { return "#circle-" + d.id; });
				if(d.data.icon){
					info.push(`paint icon:`)
					node.append('image')
						.classed('big-node-icon-2',true)
						.attr('xlink:href',`./images/${d.data.icon}`)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.attr('x',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('y',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('width',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
						.attr('height',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
				}else{
					info.push(`paint logo letter:`)
					node.append('text')
						.classed('big-node-text-logo-4',true)
						.style('fill',function(d){
							return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
						})
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.text(d.data.name.slice(0,1).toUpperCase())
				}
				console.info(...info)
			})
				
			selector.append('text')
				.classed('big-node-text-4',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('y',function(d){
					if(d.weight === undefined){
						throw new Error()
					}
					const change = d.weight * 18 - 3
					return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS + 4 : RADIUS*RATIO_RADIUS + 4 
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			const objectThis = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS 
				})
		}.bind(this),
	}
}

const NodeHelperBig5 = function(){
	return {
		init : function(selector){
			selector.append('linearGradient')
				.attr('id',function(d){return `L_G_${d.id}`})
//				.attr('x1',function(d){
//					return 0
//				})
//				.attr('y1',function(d){
//					const r = d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
//					return -r
//				})
//				.attr('x2',function(d){
//					return 0
//				})
//				.attr('y2',function(d){
//					const r = d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
//					return r
//				})
				.attr('gradientTransform','rotate(90)')
				.selectAll('stop')
				.data(function(d){
					const color = d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
					return [['0%','#ffffff',0.8],['50%',color,0.3],['100%',color,0.8]]
				}).enter().append('stop')
					.attr('offset',function(d){return d[0]})
					.attr('style',function(d){return `stop-color:${d[1]};stop-opacity:${d[2]}`})

			selector.append('circle')
				.classed('big-node-circle-5',true)
				.attr('id',function(d){return `circle-${d.id}`})
				.attr('r',0)
				.style('fill',function(d){
					return `url(#L_G_${d.id})`
				})
				.style('stroke',function(d){
					return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.each(function(d){
				const info = ['paint:']
				info.push(`paint:${d.id};`)
				const node = d3.select(this)
				node.append("clipPath")
					  .attr("id", function(d) { return "clip-" + d.id; })
					.append("use")
					  .attr("xlink:href", function(d) { return "#circle-" + d.id; });
				if(d.data.icon){
					info.push(`paint icon:`)
					node.append('image')
						.classed('big-node-icon-5',true)
						.attr('xlink:href',`./images/${d.data.icon}`)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.attr('x',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('y',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('width',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
						.attr('height',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
				}else{
					info.push(`paint logo letter:`)
					node.append('text')
						.classed('big-node-text-logo-5',true)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.text(d.data.name.slice(0,1).toUpperCase())
				}
				console.info(...info)
			})
				
			selector.append('text')
				.classed('big-node-text-5',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('y',function(d){
					if(d.weight === undefined){
						throw new Error()
					}
					const change = d.weight * 18 - 3
					return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS + 4 : RADIUS*RATIO_RADIUS + 4 
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			const objectThis = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS 
				})
		}.bind(this),
	}
}

const NodeHelperBig6 = function(){
	return {
		init : function(selector){
			selector.append('radialGradient')
				.attr('id',function(d){return `R_G_${d.id}`})
//				.attr('x1',function(d){
//					return 0
//				})
//				.attr('y1',function(d){
//					const r = d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
//					return -r
//				})
//				.attr('x2',function(d){
//					return 0
//				})
//				.attr('y2',function(d){
//					const r = d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
//					return r
//				})
				//.attr('gradientTransform','rotate(90)')
				.selectAll('stop')
				.data(function(d){
					const color = d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
					return [['0%','#ffffff'],['70%','#e0e0e0'],['100%','#a8a8a8']]
				}).enter().append('stop')
					.attr('offset',function(d){return d[0]})
					.attr('style',function(d){return `stop-color:${d[1]}`})

			selector.append('circle')
				.classed('big-node-circle-6',true)
				.attr('id',function(d){return `circle-${d.id}`})
				.attr('r',0)
				.style('fill',function(d){
					return `url(#R_G_${d.id})`
				})
				.on('click',this.toggleTag.bind(this))
				.on('contextmenu',function(d){
					d3.event.preventDefault()
					console.warn('click',this)
					this.drawMenu(d)
				}.bind(this))

			selector.each(function(d){
				const info = ['paint:']
				info.push(`paint:${d.id};`)
				const node = d3.select(this)
				node.append("clipPath")
					  .attr("id", function(d) { return "clip-" + d.id; })
					.append("use")
					  .attr("xlink:href", function(d) { return "#circle-" + d.id; });
				if(d.data.icon){
					info.push(`paint icon:`)
					node.append('image')
						.classed('big-node-icon-6',true)
						.attr('xlink:href',`./images/${d.data.icon}`)
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.attr('x',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('y',function(d){
							return d.id === '0' ? -ROOT_RADIUS * RATIO_RADIUS : -RADIUS*RATIO_RADIUS
						})
						.attr('width',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
						.attr('height',function(d){
							return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS * 2 : RADIUS*RATIO_RADIUS * 2
						})
				}else{
					info.push(`paint logo letter:`)
					node.append('text')
						.classed('big-node-text-logo-6',true)
						.style('fill',function(d){
							return d.data.color === 'crimson' ? colorScale(d.id) : d.data.color
						})
						.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
						.text(d.data.name.slice(0,1).toUpperCase())
				}
				console.info(...info)
			})
				
			selector.append('text')
				.classed('big-node-text-6',true)
				.text(function(d){return d.data.name})
				.classed('branch-text',function(d){
					return d.children
				})
				.attr('y',function(d){
					if(d.weight === undefined){
						throw new Error()
					}
					const change = d.weight * 18 - 3
					return d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS + 4 : RADIUS*RATIO_RADIUS + 4 
				})
		}.bind(this),
		transition : function(selector){
			const {root} = this
			const objectThis = this
			selector.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.id === root.id ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS 
				})
		}.bind(this),
	}
}
//}}}

//{{{ link helper class
const LinkHelperDefault = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					console.debug(...info)
					return d3.line()(points)
				})
		}.bind(this),
	}
}

const LinkHelperTest1 = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('test-1-link',true)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					console.debug(...info)
					return d3.linkHorizontal()({
						source : [d.source.y,d.source.x],
						target : [d.target.y,d.target.x],
					})
				})
		}.bind(this),
	}
}
const LinkHelperTest2 = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('test-2-link',true)
				.style('stroke',function(d){
					//if(d.target.data.name === 'logger') debugger
					const {color} = d.target.data
					return color === 'crimson' ? '#434549' : d.target.data.color 
					//return d.target.data.color 
				})
				.style('stroke-opacity',0.5)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					console.debug(...info)
					return d3.linkHorizontal()({
						source : [d.source.y,d.source.x],
						target : [d.target.y,d.target.x],
					})
				})
		}.bind(this),
	}
}

const LinkHelperBig = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('big-link',true)
				.style('stroke',function(d){
					//if(d.target.data.name === 'logger') debugger
					const {color} = d.target.data
					//return color === 'crimson' ? '#434549' : d.target.data.color 
					//return color === 'crimson' ? colorScale(d.target.data._id) : d.target.data.color 
					return '#434549'
					//return d.target.data.color 
				})
				.style('stroke-opacity',0.5)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					return d3.line()(points)
					console.debug(...info)
					//return d3.linkHorizontal()({
					//	source : [d.source.y,d.source.x],
					//	target : [d.target.y,d.target.x],
					//})
				})
		}.bind(this),
	}
}

const LinkHelperBig2 = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('big-link-2',true)
				.style('stroke',function(d){
					//if(d.target.data.name === 'logger') debugger
					const {color} = d.target.data
					//return color === 'crimson' ? '#434549' : d.target.data.color 
					//return color === 'crimson' ? colorScale(d.target.data._id) : d.target.data.color 
					return '#434549'
					//return d.target.data.color 
				})
				.style('stroke-opacity',0.5)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					return d3.line()(points)
					console.debug(...info)
					//return d3.linkHorizontal()({
					//	source : [d.source.y,d.source.x],
					//	target : [d.target.y,d.target.x],
					//})
				})
		}.bind(this),
	}
}

const LinkHelperBig3 = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('big-link-2',true)
				.style('stroke',function(d){
					//if(d.target.data.name === 'logger') debugger
					const {color} = d.target.data
					//return color === 'crimson' ? '#434549' : d.target.data.color 
					//return color === 'crimson' ? colorScale(d.target.data._id) : d.target.data.color 
					return '#434549'
					//return d.target.data.color 
				})
				.style('stroke-opacity',0.5)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					//return d3.line()(points)
					console.debug(...info)
					return d3.linkHorizontal()({
						source : [d.source.y,d.source.x],
						target : [d.target.y,d.target.x],
					})
				})
		}.bind(this),
	}
}

const LinkHelperBig4 = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('big-link-2',true)
				.style('stroke',function(d){
					//if(d.target.data.name === 'logger') debugger
					const {color} = d.target.data
					//return color === 'crimson' ? '#434549' : d.target.data.color 
					//return color === 'crimson' ? colorScale(d.target.data._id) : d.target.data.color 
					return '#434549'
					//return d.target.data.color 
				})
				.style('stroke-opacity',0.5)
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					//return d3.line()(points)
					console.debug(...info)
					return d3.linkHorizontal()({
						source : [d.source.y,d.source.x],
						target : [d.target.y,d.target.x],
					})
				})
		}.bind(this),
	}
}

const LinkHelperBig5 = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('big-link-5',true)
				.style('stroke',function(d){
					//if(d.target.data.name === 'logger') debugger
					const {color} = d.target.data
					//return color === 'crimson' ? '#434549' : d.target.data.color 
					return color === 'crimson' ? colorScale(d.target.data._id) : d.target.data.color 
					//return '#434549'
					//return d.target.data.color 
				})
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.linkHorizontal()({
						source : [0,0],
						target : [0,0],
					})
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					//return d3.line()(points)
					const sourceRadius = d.id === '0' ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
					const targetRadius = d.target.id === '0' ? ROOT_RADIUS * RATIO_RADIUS : RADIUS*RATIO_RADIUS
					const isRight = d.target.y >= 0 ? true : false
					const sign = isRight ? 1 : -1
					console.debug(...info)
					return d3.linkHorizontal()({
						source : [d.source.y + sourceRadius * sign,d.source.x],
						target : [d.target.y - targetRadius * sign,d.target.x],
					})
				})
		}.bind(this),
	}
}

const LinkHelperBig6 = function(){
	return {
		init : function(selector){
			selector.append('path')
				.classed('link',true)
				.classed('big-link-6',true)
				.style('stroke',function(d){
					//if(d.target.data.name === 'logger') debugger
					const {color} = d.target.data
					//return color === 'crimson' ? '#434549' : d.target.data.color 
					return color === 'crimson' ? colorScale(d.target.data._id) : d.target.data.color 
					//return '#434549'
					//return d.target.data.color 
				})
				.attr('d',function(d){
					//const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
		transition : function(selector){
			selector
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('d',function(d){
					const info = ['move links:']
					const points = [[d.source.y,d.source.x],[d.target.y,d.target.x]]
					//const points = [[0,0],[0,0]]
					return d3.line()(points)
				})
		}.bind(this),
	}
}
//}}}

/* class for draw mindmap,arguments:
 * setting = {
 * 		noder : //the object to draw node shape and text
 * }
 * */
class NothingMap {
	constructor(data,container,setting){
		const info = ['NothingMap -> constructor:']
		/* properties */
		this.data = data;
		this.nodesArray = nodesArrayDeanchen
		this.linksArray = linksArrayDeanchen
		this.container = container
		this.width = 1200
		this.height = 700
		//this.treeWidth = 300
		//this.treeHeight = 700
		this.nodeWidth = 100
		this.nodeHeight = 50
		this.nodeSingleWidth = 90
		this.nodeSingleHeight = 25
		/* the context menu show or not */
		this.hasMenuShown = false
		/* function to draw the map */
		if(setting && setting.noder){
			this.noder = setting.noder.bind(this)()
		}else{
			this.noder = NoderDefault.bind(this)()
		}
		if(setting && setting.linkHelper){
			this.linkHelper = setting.linkHelper.bind(this)()
		}else{
			this.linkHelper = LinkHelperDefault.bind(this)()
		}

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
		//add weight
		this.root.descendants().forEach(n => {
			n.weight = Math.random()
		})
		info.push(`found root ,with nodes:${this.root.descendants().length};links:${this.root.links().length};`)


		//the whole tree for single side mindmap
		this.singleSideData = data

		//build the original shape , the svg , group, and node,link(with original position)
		//build svg/group
		this.svg = this.container.append('svg')
			.attr('width',`${this.width}`)
			.attr('height',`${this.height}`)
			.classed('nothing-mindmap',true)
			.on('click',function(d){
				const info = ['svgClick:']
				if(this.hasMenuShown){
					d3.select('.menu').remove()
					this.hasMenuShown = false
				}
				console.info(...info)
			}.bind(this))
			//.attr('transform','translate(20,0)')
		this.g = this.svg.append('g')
			//.attr('transform','translate(20,0)')
		this.relativeG = this.g.append('g')
		this.mountAndUnmountNode()

		console.info(...info)
	}

	buildTwoSideData(){
		const info = ['buildTwoSideData:']
		//build two side mindmap ,left and right two way tree mindmap,NOTE,the array leading by root node
		//right/leftSideData = [{name,_id,color,parentId}...]
		info.push(`with total nodes:${this.root.descendants().length}`)
		const rootChildren = this.root.children
		const rightChildren = rootChildren.slice(0,Math.round(rootChildren.length / 2))
		info.push(`deside right size:${rightChildren.length};`)
		const leftChildren = rootChildren.slice(Math.round(rootChildren.length / 2))
		info.push(`deside left size:${leftChildren.length};`)
		const rootData = {
			name : this.root.data.name,
			_id : this.root.id,
			color : this.root.data.color,
		}
		const reducer = (a,c) => {
			return [...a,...c.descendants().map(n => {
				if(!n.data){
					throw new Error()
				}
				return {
					name : n.data.name,
					_id : n.id,
					color : n.data.color,
					parentId : n.parent ? n.parent.id : undefined,
				}
			})]
		}
		this.rightSideData = rightChildren.reduce(reducer,[rootData])
		this.leftSideData = leftChildren.reduce(reducer,[rootData])
		info.push(`build right side data:${this.rightSideData.length};`)
		info.push(`build left side data:${this.leftSideData.length};`)
		console.info(...info)
	}
	

	mountAndUnmountNode(){
		const info = ['mountAndUnmountNode:']
		//links
		const link = this.g.selectAll('.link')
			.data(this.root.links(),function(d){
				return `${d.source.id}_${d.target.id}`
			})
		const linkEnter = link.enter()
		this.linkHelper.init(linkEnter)
			
		info.push(`link enter:${linkEnter.size()};`)
		const linkExit = link.exit()
		info.push(`link exit:${linkExit.size()};`)
		linkExit.remove()
		this.link = this.g.selectAll('.link')
		info.push(`link :${this.link.size()};`)
		//nodes
		const node = this.g.selectAll('.node')
			.data(this.root.descendants(),function(d){return d.id})
		
		const nodeEnter = node
			.enter().append('g')
				.call(dragListener)
				.classed('node',true)
				.attr('transform',function(d){
					return `translate(0,0)`
					//return `translate(${d.y},${d.x})`
				})
		this.noder.init(nodeEnter)
		info.push(`node enter:${nodeEnter.size()};`)

		const nodeExit = node.exit()
		console.log(`node exit:`,nodeExit)
		nodeExit.each(n => console.log(`data:`,n))
		info.push(`node exit:${nodeExit.size()};`)
		nodeExit.remove()

		this.node = this.g.selectAll('.node')
		info.push(`node:${this.node.size()};`)	
		//change the style of folded node
		const circle = this.node.selectAll('circle')
		circle
			.attr('stroke',function(d){
				return d._children && !d.hasShowRelativeTags ? 'gray':undefined
			})
			.attr('stroke-width',function(d){
				return d._children && !d.hasShowRelativeTags ? 4:undefined
			})

		info.push(`build original shape,this nodes:${d3.selectAll('.node').size()};links:${d3.selectAll('.link').size()};`)

		console.info(...info)
	}

	/* set the mode: single,twoSide */
	setMode(mode){
		this.mode = mode
	}

	update(){
		if(this.mode === 'single'){
			this.updateSingleSide()
		}else if (this.mode === 'twoSide'){
			this.updateTwoSide()
		}else if (this.mode === 'search'){
			this.updateSearch()
		}else{
			throw new Error()
		}
	}

	updateSingleSide(){//{{{
		const info = ['NothingMap -> updateSingleSide:']
		info.push(`begin draw...`)
		

		//delete the force
		if(this.simulation){
			this.simulation.force('x',null)
			this.simulation.force('y',null)
			this.simulation.force('charge',null)
			this.simulation.nodes([])
			this.simulation.on('tick',null)
			this.simulation = undefined

			//if link is invisible , make it visible 
			if(d3.select('.link').style('opacity') === "0"){
				this.link
					.transition()
					.duration(DURATION)
					.ease(EASE)
					.style('opacity',1)
			}
			this.node.selectAll('.big-node-text-2,.big-node-text-5,.big-node-text-6')
				.classed('single',true)
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.style('opacity','1')
			this.node.selectAll('.big-node-text-logo-2,.big-node-text-logo-5,.big-node-text-logo-6')
				.classed('single',true)
			this.node
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('transform',function(d){
					return `translate(${d.y0},${d.x0})`
				})
			this.node.selectAll('circle')
				.transition()
				.duration(DURATION)
				.ease(EASE)
				.attr('r',function(d){
					return d.parent ? RADIUS : ROOT_RADIUS
				})
			return
		}

		const tree = d3.tree()
			//.size([this.treeHeight,this.treeWidth])
			.nodeSize([this.nodeSingleHeight,this.nodeSingleWidth])
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

		//add 'single' class to all node group
		this.node.selectAll('.big-node-text-logo-2,.big-node-text-logo-5,.big-node-text-logo-6')
			.classed('single',true)
		this.node.selectAll('.big-node-text-2,.big-node-text-5,.big-node-text-6')
			.classed('single',true)
			.attr('y',0)
			.attr('x',function(d){
				return d.id === '0' ? ROOT_RADIUS + 2: RADIUS + 2
			})

		//move group
		this.g
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('transform',`translate(${translateY(20)},${translateX(this.height/2)})`)

		console.info(...info)
		//}}}
	}

	updateTwoSide(){//{{{
		const info = ['NothingMap -> updateTwoSide:']
		info.push(`begin draw...`)

		this.buildTwoSideData()

		const tree = d3.tree()
			//.size([this.treeHeight,this.treeWidth])
			.nodeSize([this.nodeHeight,this.nodeWidth])
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

		this.root.translate = [translateYRight(this.width /2),translateXRight(this.height /2)]

		const objectThis = this
		this.root.descendants().forEach(d => {
			if(d.id !== '0' && ROOT_SEPERATOR ){
				d.y = d.y + ROOT_SEPERATOR * (d.y > 0 ? 1:-1)
			}
			d.x0 = d.x
			d.y0 = d.y
			//the reference to class
			d.nothingMap = objectThis
		})
		

		this.mountAndUnmountNode()

		this.layoutNodes()

		//add 'single' class to all node group
		this.node.selectAll('.big-node-text-logo-2,.big-node-text-logo-5,.big-node-text-logo-6')
			.classed('single',false)
		this.node.selectAll('.big-node-text-2,.big-node-text-5,.big-node-text-6')
			.classed('single',false)
			.attr('x',0)
			.attr('y',function(d){
				return d.id === '0' ? ROOT_RADIUS*RATIO_RADIUS + 2: RADIUS*RATIO_RADIUS + 2
			})
		
		console.info(...info)
		//}}}
	}

	updateSearch(){//{{{
		const info = ['NothingMap -> updateSearch:']
		info.push(`begin draw...`)

		const objectThis = this
		//this.root.descendants().forEach(d => {
		//	if(d.id !== '0' && ROOT_SEPERATOR ){
		//		d.y = d.y + ROOT_SEPERATOR * (d.y > 0 ? 1:-1)
		//	}
		//	d.x0 = d.x
		//	d.y0 = d.y
		//	//the reference to class
		//	d.nothingMap = objectThis
		//})

		//move all node to out space ring orbit ,random angle
		this.root.descendants().forEach(d => {
			//const info = ['disperseNode:']
			//save old place
			d.x0 = d.x
			d.y0 = d.y
			const r = 500
			//d.x = Math.sin( Math.random() * 2 * Math.PI ) * r
			//d.y = Math.cos( Math.random() * 2 * Math.PI ) * r
			d.r = Math.random() * 40 + 5
			info.push(`random point:(${d.x},${d.y});`)
			//console.debug(...info)
		})

		this.node
			.attr('transform',function(d){
				return `translate(${d.y},${d.x})`
			})
		this.node.selectAll('circle')
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('r',function(d){ return d.r})
		//force
		function charge(d) {
			return -Math.pow(d.r, 2.0) * forceStrength;
		}
		var forceStrength = 0.5
		this.simulation = d3.forceSimulation(this.root.descendants())
			.velocityDecay(0.2)
			//.force('gravity',d3.forceCenter(0,150))
			//.force('gravity',d3.forceManyBody())
			.force('x', d3.forceX().strength(forceStrength).x(0))
			.force('y', d3.forceY().strength(forceStrength).y(130))
			//.force('x',d3.forceX(0))
			//.force('y',d3.forceY(130))
			.force('charge', d3.forceManyBody().strength(charge))
			//.force('collide',d3.forceCollide().radius(function(d){
			//	return d.r * 1.01
			//}))
			.on('tick',() => {
				const info = ['tick:']
				this.node
					.attr('transform',function(d){
						return `translate(${d.y},${d.x})`
					})
				console.debug(...info)
			})

		
		//add 'single' class to all node group
		this.node.selectAll('.big-node-text-logo-2,.big-node-text-logo-5,.big-node-text-logo-6')
			.classed('single',false)
		this.node.selectAll('.big-node-text-2,.big-node-text-5,.big-node-text-6')
			.classed('single',false)
			.style('opacity','0')
		this.link
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.style('opacity',0)
		
		console.info(...info)
		//}}}
	}

	layoutNodes(){//{{{
		//now , move the existed shape to the new d3 tree position
		const {root} = this
		this.linkHelper.transition(this.link)
		this.node
			.transition()
			.duration(DURATION)
			.ease(EASE)
			.attr('transform',function(d){
				const info = ['move nodes:']
				console.debug(...info)
				return `translate(${d.y},${d.x})`
			})
		
		this.noder.transition(this.node)
		//move group
		this.g
			//.transition()
			//.duration(DURATION)
			//.ease(EASE)
			.attr('transform',`translate(${this.root.translate[0]},${this.root.translate[1]})`)
		//}}}
	}

	/* switch tag display mode between: fold,collapse,relative collapse*/
	toggleTag(d){
		const {hasShowRelativeTags,children,_children} = d
		if(children){
			this.toggleChildren(d)
			this.collapseRelativeTagWithParent.bind(this)(d)		
		}else if(_children && hasShowRelativeTags){
			this.collapseRelativeTagWithParent.bind(this)(d)		
		}else if(_children && !hasShowRelativeTags){
			this.toggleChildren(d)
		}else if(!children && !_children){
			this.collapseRelativeTagWithParent.bind(this)(d)		
		}

	}

	/* fold/collapse the nodes children  */
	toggleChildren(d){
		const oldNodes = this.root.descendants()
		const info = ['toggleChildren:']
		if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
		//update the root data
		//this.root = d3.hierarchy(this.root)
		const newNodes = this.root.descendants()
		const removed = oldNodes.filter(node => {
			return newNodes.every(n => n.id !== node.id)	
		})
		info.push(`removed nodes:${removed.length};`)
		console.debug(`removed nodes:`,removed)
		//check the data
		//const {id} = d
		//if(!this.root.descendants().every(dd => dd.id !== id)){
		//	console.warn(...info)
		//	throw new Error()
		//}

		this.update()
		console.info(...info)
        return d;
	}

	/* expend/collapse the hashtag , when expend, display all hashtags relative to current tag*/
	collapseRelativeTag(d){//{{{
		const info = ['NothingMap -> toggelTag:']
		const {hasShowRelativeTags} = this
		info.push(`hasShowRelativeTags :${hasShowRelativeTags}`)
		if(hasShowRelativeTags){
			d.hasShowRelativeTags = false
			d.simulation.stop()
			this.svg.selectAll('.relative-node').remove()
			this.svg.selectAll('.relative-link').remove()
			console.info(...info)
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
		d.simulation = d3.forceSimulation()
			.force('charge',d3.forceManyBody().strength(-10))
			.force('link',d3.forceLink(relativeLinks).distance(100))
			//.force('center',d3.forceCenter([y,x]))
		d.simulation
			.nodes(relativeTags)
			.on('tick',function(){
				relativeNode.attr('transform',function(d){
					console.debug(d)
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

	/* draw the ring context menu for node */
	drawMenu(d){
		const info = ['drawMenu:']
		const menuG = this.svg.append('g')
			.classed('menu',true)
			.attr('transform',`translate(${this.root.translate[0] + d.y},${this.root.translate[1]+d.x})`)

		//the menu background ring
		menuG.append('circle')
			.classed('ring',true)

		//the menu item
		const items = [
			{
				name : 'GoTo',
				action : () => this.gotoNode(d),
			},
			{
				name : 'Add',
				action : () => this.addNode(d),
			},
			{
				name : 'Del',
				action : () => this.delNode(d),
			},
		]
		const itemG = menuG.selectAll('.item').data(items).enter().append('g')
			.classed('item',true)
			.attr('transform',function(d,i){
				//calculate the position of menu item
				const r = 100
				const angle = Math.PI / 6
				const x = r * Math.sin(angle * i)
				const y = r * Math.cos(angle * i)
				return `translate(${x},${-y})`
			})
			.on('click',function(d){
				const info = ['itemClick:']
				info.push(`clicking ${d.name};`)
				d.action && d.action()
				console.info(...info)
			})
		itemG.append('circle')
		itemG.append('text')
			.text(function(d){return d.name})
			


		this.hasMenuShown = true
			
		console.info(...info)
	}

	/* change the central node to this node */
	gotoNode(d){
		const info = ['gotoNode']
		info.push(`node : ${d.id};`)
		this.root = d
		this.update()
		console.info(...info)
	}

	addNode(d){
		const info = ['gotoNode']
		info.push(`node : ${d.id};`)
		info.push(`data before add:${this.data.length}`)
		const newNodeData = {
			name : `Node${this.data.length}`,
			_id : `Node${this.data.length}`,
			parentId : d.id,
		}
		this.data.push(newNodeData)
		info.push(`data after add:${this.data.length}`)
		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		this.root = stratify(this.data)
		//check the result
		this.root.descendants().forEach(n => {
			if(n.id === d.id){
				if(n.descendants().some(nn => nn.id === newNodeData._id)){
					info.push(`OK,found the new data:${newNodeData._id},in parent ids;thie parents has descendants:${n.descendants().length};`)
				}else{
					throw new Error()
				}
			}
		})
		this.update()
		console.info(...info)
	}

	delNode(d){
		const info = ['delNode']
		info.push(`node : ${d.id};`)
		let toDeleteNodes
		this.root.descendants().forEach(n => {
			if(n.id === d.id){
				toDeleteNodes = n.descendants()
			}
		})
		info.push(`to delete nodes:${toDeleteNodes.length};`)
		info.push(`the data before delete:${this.data.length};`)
		this.data = this.data.filter(n => {
			if(toDeleteNodes.some(t => t.id === n._id)){
				return false
			}else{
				return true
			}
		})
		info.push(`the data after delete:${this.data.length};`)
		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		this.root = stratify(this.data)
		this.update()
		console.info(...info)
	}

	moveNode(d,targetNodeId,area){
		const info = ['moveNode']
		info.push(`node : ${d.id};`)
		if(area === 'right'){
			//move node's parent to target node 
			this.data.forEach(e => {
				if(e._id === d.id){
					//yes,this is the node to move
					e.parentId = targetNodeId
					info.push(`yes,move it:${e._id},to,${e.parentId};`)
				}
			})
		}else if(area === 'top' || area === 'bottom' ){
			//move node's position to : the parent id is target Node's parent ;the position is before the target node
			//first ,drop the node (which will to be move) from data
			let indexOfCurrentNode,currentNodeData
			this.data.forEach((e,i) => { if(e._id === d.id){ indexOfCurrentNode = i;currentNodeData = e}})
			this.data.splice(indexOfCurrentNode,1)
			//then , find the target node
			let indexOfTargetNodeId,parentOfTargetNodeId
			this.data.forEach((e,i) => {
				if(e._id === targetNodeId){
					indexOfTargetNodeId = i
					parentOfTargetNodeId = e.parentId
				}
			})
			//move
			currentNodeData.parentId = parentOfTargetNodeId
			this.data.splice(area === 'top'?indexOfTargetNodeId: indexOfTargetNodeId + 1,0,currentNodeData)
			info.push(`remove current node from ${indexOfCurrentNode},then insert to ${indexOfTargetNodeId};`)
		}
		const stratify = d3.stratify()
			.parentId(function(d){return d.parentId })
			.id(function(d){return d._id})
		this.root = stratify(this.data)
		this.update()
		console.info(...info)
	}
}



const dragListener = d3.drag()
	.on('start',function(d){
		const currentD = d
		const info = ['start:']
		d3.event.sourceEvent.stopPropagation()
		//begin drag, hide all children nodes and links from this node,slice(1)->except itself
		const descendants = d.descendants().slice(1)
		info.push(`begin drag :${d.id};hide descendants:${descendants.length};`)
		const descendantNodes = d3.selectAll('g.node').filter(function(d){return descendants.some(dd => dd.id === d.id)})
		info.push(`found descendant node :${descendantNodes.length};`)
		descendantNodes
			.style('opacity',0.2)
		const descendantLinks = d3.selectAll('path.link').filter(function(d){return descendants.concat(currentD).some(dd => dd.id === d.source.id || dd.id === d.target.id)})
		info.push(`found descendant link :${descendantLinks.length};`)
		descendantLinks
			.style('opacity',0.2)
		console.info(...info)
	})
	.on('drag',function(d){
		const info = ['drag:']
		info.push(`is draging : ${d.id}`)
		d.x0 += d3.event.dy
		d.y0 += d3.event.dx
		d3.select(this)
			.attr('transform',`translate(${d.y0},${d.x0})`)
		
		//find the closest node
		const distance = (x0,y0,x1,y1) =>{
			return Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2))
		}
		const ancestors = d.ancestors()
		const root = ancestors && ancestors[ancestors.length - 1 ]
		info.push(`find the ancestors:${ancestors && ancestors.length};the last one is root:${root.id};`)
		const descendants = root.descendants()
		info.push(`find nodes:${descendants && descendants.length};`)
		let closestNode; 
		descendants.forEach(node => {
			if(!closestNode){
				closestNode = node
			}else{
				if(node.id !== d.id && distance(node.x,node.y,d.x0,d.y0) < distance(closestNode.x,closestNode.y,d.x0,d.y0)){
					closestNode = node
				}
			}
		})
		info.push(`find the closest node:${closestNode && closestNode.id};`)
		//the node must close enough 
		//change the closest node style
		const distanceToClosestNode = distance(closestNode.x,closestNode.y,d.x0,d.y0)
		const LIMIT = 50
		/* area: the mouse pointer is close enough and is at top/right/bottom area to closestNode */
		let area
		if(distanceToClosestNode < LIMIT){
			//then, test the moving node is in which area: right/top/bottom (no left)
			//first , calculate the angle between closest node and mouse pointer
			let x1 = closestNode.y,
				y1 = -closestNode.x,
				x2 = d.y0,
				y2 = -d.x0,
				deltaY = y2 - y1,
				deltaX = x2 - x1, 
				tan = Math.atan( deltaY / deltaX),
				angle ,//angle in [0-2PI]
				conditionCase

			if(deltaX >= 0 ){
				if(deltaY >= 0 ){
					angle = tan
				}else{
					angle = Math.PI * 2 + tan
				}
			}else{
				angle = Math.PI + tan
			}
			if(angle > 0 && angle < Math.PI / 4 ){
				conditionCase = 1
				area = 'right'
			}else if(angle > Math.PI / 4 && angle < Math.PI * 3 /4){
				conditionCase = 2
				area = 'top'
			}else if (angle > Math.PI * 5 / 4 && angle < Math.PI * 7 / 4){
				conditionCase = 3
				area = 'bottom'
			}else if(angle > Math.PI * 7 / 4){
				conditionCase = 4
				area = 'right'
			}
			info.push(`cal angle ,x1:${x1};x2:${x2};y1:${y1};y2:${y2};deltaX:${deltaX};deltaY:${deltaY};tan:${tan};angle:${angle};area:${area};conditionCase:${conditionCase};`)
			//OK, draw the area path
			if(area !== undefined){
				let arc
				let style
				if(area === 'right' ){
					arc = d3.arc()
						.innerRadius(0)
						.outerRadius(LIMIT)
						.startAngle(Math.PI / 4)
						.endAngle(Math.PI * 3 / 4)
					style = 'right'
				}else if(area === 'top'){
					arc = d3.arc()
						.innerRadius(0)
						.outerRadius(LIMIT)
						.startAngle(- Math.PI / 4)
						.endAngle(Math.PI /4)
					style = 'top'
				}else if(area === 'bottom'){
					arc = d3.arc()
						.innerRadius(0)
						.outerRadius(LIMIT)
						.startAngle(Math.PI * 3 / 4)
						.endAngle(Math.PI * 5 /4)
					style = 'bottom'
				}
				const g = d3.selectAll('g.node').filter(function(d){return d.id === closestNode.id})
				if(g.select('.mask').size() === 0 || g.select('.mask').classed(style) === false){
					d3.selectAll('.mask').remove()
					g.append('g')
						.classed('mask',true)
						.classed(style,true)
						.append('path')
							.attr('d',arc())
					console.debug(`draw a mask`)
				}
			}
		}else{
			d3.selectAll('.mask').remove()
		}

		if(area === undefined || closestNode === undefined){
			//remove the dock data for current node
			d.dock = undefined
			info.push(`remove dock`)
		}else{
			//add/update dock data for current node
			d.dock = {
				id : closestNode.id,
				area,
			}
			info.push(`update dock,${d.dock.id};area:${d.dock.area}`)
		}


		console.debug(...info)
	})
	.on('end',function(d){
		const currentD = d
		const info = ['end:']
		d3.selectAll('.mask').remove()
		//check dock data
		if(d.dock){
			const descendants = d.descendants().slice(1)
			info.push(`end drag :${d.id};display descendants:${descendants.length};`)
			const descendantNodes = d3.selectAll('g.node').filter(function(d){return descendants.some(dd => dd.id === d.id)})
			info.push(`found descendant node :${descendantNodes.length};`)
			descendantNodes
				.style('opacity',1)
			const descendantLinks = d3.selectAll('path.link').filter(function(d){return descendants.concat(currentD).some(dd => dd.id === d.source.id || dd.id === d.target.id)})
			info.push(`found descendant link :${descendantLinks.length};`)
			descendantLinks
				.style('opacity',1)
			info.push(`found dock data,try to move nodes;`)
			info.push(`move the parent;`)
			d.nothingMap.moveNode(d,d.dock.id,d.dock.area)
		}else{
			info.push(`no dock data,move back;`)
			d.x0 = d.x
			d.y0 = d.y
			d3.select(this)
				.transition()
				.duration(1000)
				.attr('transform',`translate(${d.y0},${d.x0})`)
				.on('end',function(){
					const descendants = d.descendants().slice(1)
					info.push(`end drag :${d.id};display descendants:${descendants.length};`)
					const descendantNodes = d3.selectAll('g.node').filter(function(d){return descendants.some(dd => dd.id === d.id)})
					info.push(`found descendant node :${descendantNodes.length};`)
					descendantNodes
						.style('opacity',1)
					const descendantLinks = d3.selectAll('path.link').filter(function(d){return descendants.concat(currentD).some(dd => dd.id === d.source.id || dd.id === d.target.id)})
					info.push(`found descendant link :${descendantLinks.length};`)
					descendantLinks
						.style('opacity',1)
				})
		}

		console.info(...info)
	})
