let drawable = true;

function splitToArrays(str) {
    let array = str.value.split(",");
    array = array.map(function(item){
        return item.trim();
    });
    return array;
}

function splitArcsToArray(str){
    let array = str.value.split(",");
    let arrayOfArcs = [];
    for( let i= 0; i<array.length; i+=2){
        let arc = array[i] + "," +array[i+1];
        arrayOfArcs.push(arc);
    }
    return arrayOfArcs;
}

function foramtPlacesAsJson(array) {
    let json = {};
    let arrayOfJson = [];
    for (let item of array) {
        json["key"] = item;
        json["color"] = "grey";
        json["category"] = "place";
        arrayOfJson.push(json);
        json = {};
    }
    return arrayOfJson;
}

function foramtTransitionsAsJson(array) {
    let json = {};
    let arrayOfJson = [];
    for (let item of array) {
        json["key"] = item;
        json["color"] = "lightgray";
        json["category"] = "transition";
        arrayOfJson.push(json);
        json = {};
    }
    return arrayOfJson;
}

function formatArcsToJson(array){
    let json = {};
    let arrayOfJson = [];
    for(let item of array){
        // get first node
        let firstNode = item.split(",")[0];
        firstNode = firstNode.trim();
        firstNode = firstNode.replace('(','');
        // get second node
        let secondNode = item.split(",")[1];
        secondNode = secondNode.trim();
        secondNode = secondNode.replace(')','');

        json["from"] = firstNode;
        json["to"] = secondNode;
        arrayOfJson.push(json);

        json = {};
    }
    return arrayOfJson;
}

function getData(){
    if(!drawable){
        alert("Please reset the diagram before drawing another one");
        return;
    }

    let diagram = document.getElementById("myDiagramDiv");
    diagram.style = "width: 1000px; height: 500px; border: 4 solid black;";
    diagram.innerHTML = "";

    let places = document.getElementById("places");
    let transitions = document.getElementById("transitions");
    let arcs = document.getElementById("arcs");

    let placesArray = splitToArrays(places);
    let placesJson = foramtPlacesAsJson(placesArray);
    console.log("placesArray", placesJson);

    let transitionsArray = splitToArrays(transitions);
    let transitionsJson = foramtTransitionsAsJson(transitionsArray);
    console.log("transitionsArray", transitionsJson);

    let arcsArray = splitArcsToArray(arcs);
    let arcsJson = formatArcsToJson(arcsArray);
    console.log("arcsArray", arcsJson);

    init(placesJson,transitionsJson,arcsJson);
    drawable = false;
}

function init(placesArray,TransitionArray,linkDataArray) {
    var $ = go.GraphObject.make;
    myDiagram = $(go.Diagram, "myDiagramDiv", {
      initialAutoScale: go.Diagram.UniformToFill,
      layout: $(go.LayeredDigraphLayout),
      // other Layout properties are set by the layout function, defined below
    });

    // var placesArray = [
    //   { key: "i", color: "grey", category: "place" },
    //   { key: "o", color: "grey", category: "place" },
    //   { key: "p1", color: "grey", category: "place" },
    //   { key: "p2", color: "grey", category: "place" },
    // ];
    // var TransitionArray = [
    //   { key: "t1", color: "lightgray", category: "transition" },
    //   { key: "t2", color: "lightgray", category: "transition" },
    //   { key: "t3", color: "lightgray", category: "transition" },
    // ];
    var nodeDataArray = placesArray.concat(TransitionArray);

    // var linkDataArray = [
    //   { from: "i", to: "t1" },
    //   { from: "t1", to: "p1" },
    //   { from: "t2", to: "p2" },
    //   { from: "p1", to: "t2" },
    //   { from: "t2", to: "p1" },
    //   { from: "p2", to: "t3" },
    //   { from: "t3", to: "o" },
    // ];
    // styling places
    var placeTemplate = $(
      go.Node,
      "Auto",
      $(go.Shape, "Circle", new go.Binding("fill", "color")),
      $(
        go.TextBlock,
        { margin: 5, textAlign: "center", font: "bold 16px sans-serif" },
        new go.Binding("text", "key")
      )
    );
    // styling transitions
    var transitionTemplate = $(
      go.Node,
      "Auto",
      $(go.Shape, "Rectangle", new go.Binding("fill", "color")),
      $(
        go.TextBlock,
        { margin: 5, textAlign: "center", font: "bold 16px sans-serif" },
        new go.Binding("text", "key")
      )
    );
    var templmap = new go.Map();

    templmap.add("place", placeTemplate);
    templmap.add("transition", transitionTemplate);

    templmap.add("", myDiagram.nodeTemplate);

    myDiagram.nodeTemplateMap = templmap;
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }