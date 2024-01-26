function createForceDirectedGraph(container, nodes, links) {
    var svg = d3.select(container);

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(function(d) { return d.id; })
            .distance(50)
            .strength(0.25)) 
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(750, 300))
        .force("collide", d3.forceCollide());

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    var linkLabels = svg.selectAll(".link-label")
        .data(links)
        .enter().append("text")
        .attr("class", "link-label")
        .text(function(d) { return d.label; });

    var node = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 15)
        .style("fill", function(d) { return d.color; })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .call(d3.drag() 
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function handleMouseOver(d) {
        tooltip.html("Node ID: " + d.id + "<br>" + d.tooltip)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY + 10) + "px")
            .style("opacity", 1);
    }

    function handleMouseOut() {
        tooltip.style("opacity", 0);
    }

    function dragStarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnded(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    simulation.on("tick", function() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        linkLabels
            .attr("x", function(d) { return (d.source.x + d.target.x) / 2 - 5; })
            .attr("y", function(d) { return (d.source.y + d.target.y) / 2 - 5; })
            .attr("transform", function(d) {
                var angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * (180 / Math.PI);
                return "rotate(" + angle + "," + ((d.source.x + d.target.x) / 2) + "," + ((d.source.y + d.target.y) / 2) + ")";
            });
    });
}
