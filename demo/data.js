const data = [
	{
		_id : '1',
		name : 'root',
	},
	{
		_id : '2',
		name : 'logger',
		parentId : '1',
	},
	{
		_id : '3',
		name : 'v1.0',
		parentId : '2',
	},
	{
		_id : '3.1',
		name : 'v1.1',
		parentId : '2',
	},
	{
		_id : '3.2',
		name : 'v1.2',
		parentId : '2',
	},
	{
		_id : '4',
		name : 'todo',
		parentId : '1',
	},
//	{
//		_id : '4.1',
//		name : 'doing',
//		parentId : '4',
//	},
	{
		_id : '5',
		name : '日记',
		parentId : '1',
	},
	{
		_id : '6',
		name : 'test',
		parentId : '1',
	},
	{
		_id : '8',
		name : 'day',
		parentId : '1',
	},
	{
		_id : '9',
		name : 'javascript',
		parentId : '1',
	},

]


const stratify = d3.stratify()
	.parentId(function(d){return d.parentId })
	.id(function(d){return d._id})
var innerRoot = stratify(data)
var innerNodes = (() => {
	var nodes = [], i = 0;

	function recurse(node) {
		if (node.children) {
			node.size = node.children.reduce(function(p, v) {
				return p + recurse(v);
			}, 0);
		}
		if (!node.id) node.id = ++i;
		nodes.push(node);
		return node.size;
	}
	innerRoot.size = recurse(innerRoot);
	return nodes;
})()

const getRoot = () => {
	return innerRoot
}

/* flat nodes array for root tree */
const getNodes = () => {
	return innerNodes
}


/* links array */
const getLinks = () => {
	return innerRoot.links()
}

