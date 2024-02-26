document.addEventListener("DOMContentLoaded", () => {

    async function Fetch() {
        const res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
        let data = await res.json();
        for(let i = 0; i < data.length - 1; i++) {
            for(let a = 0; a < data.length - i - 1; a++) {
                if(data[a]["Seconds"] < data[a + 1]["Seconds"]) {
                    temp = data[a];
                    data[a] = data[a + 1];
                    data[a + 1] = temp;
                }
            }
        }
    
        const h = 600; // canvas height
        const w = 1000; // canvas width
        const p = 100; // canvas padding
        
        const svg = d3.select("#container").append("svg").attr("width", w).attr("height", h);
        
        const xScale = d3.scaleLinear().domain([d3.min(data, (d) => d["Year"]) - 1, d3.max(data, (d) => d["Year"]) + 1]).range([p, w - p]);
        
        let yScale = d3.scaleLinear().domain([d3.max(data, (d) => d["Seconds"]), d3.min(data, (d) => d["Seconds"])]).range([h - p, p]);
        
    svg.selectAll("circle").data(data).enter().append("circle").attr("cx", (d) => xScale(d["Year"])).attr("cy", (d) => yScale(d["Seconds"])).attr("r", 6).attr("class", "dot").attr("fill", (d) => {if(d["Doping"]) { return "#6586AE" } else { return "#CC8633" }});
        
    svg.select("div").data(data).enter().append("div").style("margin-left", (d) => `calc(50vw - 500px + ${xScale(d["Year"])}px + 0px)`).style("margin-top", (d) => `calc(${yScale(d["Seconds"])}px - 650px)`).attr("class", "tooltip");
        
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        svg.append("g").call(xAxis).attr("id", "x-axis").attr("transform", `translate(0, ${h - p})`);
    
        yScale = d3.scaleLinear().domain([data[0]["Seconds"], data[data.length - 1]["Seconds"]]).range([h - p, p]);
        const yAxis = d3.axisLeft(yScale).tickValues([2385, 2370, 2355, 2340, 2325, 2310, 2295, 2280, 2265, 2250, 2235, 2220]).tickFormat((d, i) => ["39:45", "39:30", "39:15", "39:00", "38:45", "38:30", "38:15", "38:00", "37:45", "37:30", "37:15", "37:00"][i]);
        svg.append("g").call(yAxis).attr("id", "y-axis").attr("transform", `translate(${p}, 0)`);
        
        const dot = Array.from(document.querySelectorAll(".dot"));
        const tooltip = Array.from(document.querySelectorAll(".tooltip"));
        
        dot.forEach((item, index) => {
            tooltip[index].innerHTML = `${data[index]["Name"]}: ${data[index]["Nationality"]}<br />Year: ${data[index]["Year"]}, Time: ${data[index]["Time"]}`;
            if(data[index]["Doping"]) {tooltip[index].innerHTML += `<br /><br />${data[index]["Doping"]}`};
            item.addEventListener("mouseenter", () => {
                tooltip[index].style.display = "block";
            });
            
            item.addEventListener("mouseleave", () => {
                tooltip[index].style.display = "none";
            });
        });
    }
    Fetch();

})