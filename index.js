<script type='text/javascript'> 
ws.onmessage = function (event) {
	curDiv = addElement();
	//document.getElementById(curDiv).innerHTML = event.data;
	if (reader.readyState == 1){
		queue.push(event.data);
	} else {
		reader.readAsBinaryString(event.data);
	}
};
var questattr = []
var reqquest = [0]
</script>
<div id='output'></div>
<script type='text/javascript'> 
function addElement() {
	var ni = document.getElementById('output');
	var newdiv = document.createElement('div');
	var div_id = Math.random().toString(36).substring(7);
	newdiv.setAttribute('id',div_id);
	ni.appendChild(newdiv);
	return div_id;};
function removeElements() {
	var out = document.getElementById('output');
      	for (i = out.childElementCount-1;i>=0;i--) {
		out.removeChild(out.childNodes[i])
	};
};
var reader = new FileReader();
var queue = [];
reader.onload = function(e) {
	document.getElementById(curDiv).innerHTML += reader.result;
	if (queue.length == 0)  return ;
	var i = queue.shift()
	console.log(i)
	this.readAsBinaryString(i);
}
</script>
