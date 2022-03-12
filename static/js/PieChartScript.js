d3.csv("/static/data/Kaggle_TwitterUSAirlineSentiment.csv").then(function(data){
    /* A asynchronous function that reads the csv file and has several functions to to compute
    the sum of negative tweets for each airline and return as an arrau of objects*/
    var negativeVirginAmerica = negativeResponse(data, 'Virgin America');
    var negativeDelta = negativeResponse(data, 'Delta');
    var negativeUnited = negativeResponse(data, 'United');
    var negativeUsAirways = negativeResponse(data, 'US Airways');
    var negativeAmerican = negativeResponse(data, 'American');
    var negativeSouthWest = negativeResponse(data, 'Southwest');
    //console.log(negativeSouthWest)//test

    /*store negative responses into an array by using a function that returns an array of 6 objects containing
    name value-pairs for airline and the number of negative responses for that airline*/
    var airlineResponses = createResponseArray(negativeVirginAmerica, negativeDelta, negativeUnited, negativeUsAirways, negativeAmerican,
    negativeSouthWest);
    //console.log(airlineResponses)//test

    //use the created array of objects to create the bar chart
    createBarChat(airlineResponses);
 });


function negativeResponse(data, airline){
    /* A function that loops through the csv file to calculate the negative number of response per airline
     pre conditions -  assumes you are use the csv file 'Kaggle_TwitterUSAirlineSentiment.csv' and a valid
     airline name as a string from the file.
     post conditions - returns a integer value of the number of negative responses for that airline
     */
    var negativeCount = 0
    for(var i=0; (i<=data.length-1); i++){
        if (data[i].airline == airline && data[i].airline_sentiment =='negative'){
            negativeCount += 1;
        }
    }
    return negativeCount
}

function createResponseArray(negativeVirginAmerica, negativeDelta, negativeUnited, negativeUsAirways, negativeAmerican,
    /* A function that returns an array of 6 objects containing number of negative responses for each airline
     pre conditions - all arguments must be given as integers for each airline
    post conditions - returns 1 array, containing name-value pairs of all airlines and their associated number of negative
    responses*/
    negativeSouthWest){
    var airlineResponses = [
    {virginAmerica: negativeVirginAmerica},
    {delta: negativeDelta},
    {united: negativeUnited},
    {usAirways : negativeUsAirways},
    {american: negativeAmerican},
    {southWest: negativeSouthWest}
    ];

    return airlineResponses;
}


function createBarChat(data){



        // set the dimensions and margins of the graph
    const width = 450,
        height = 425,
        margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#Pie-Chart-Container")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    //parse data again
      const reducedData = {a: data[0].virginAmerica, b: data[1].delta, c:data[2].united, d:data[3].usAirways, e:data[4].american, f: data[5].southWest}
      console.log(reducedData)

    // set the color scale
    const color = d3.scaleOrdinal()
      .range(["red", "purple", "green", "black", "blue", "orange"])

    // Compute the position of each group on the pie:
    const pie = d3.pie()
      .value(function(d) {return d[1]})
    const data_ready = pie(Object.entries(reducedData))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('whatever')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', function(d){ return(color(d.data[1])) })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)

      // Svg to hold the legend
    var svgLegend = d3.select("#Legend")
                    .append('svg')
                    .attr("width", 600)
                    .attr("height", 200)


    // legend
    svgLegend.append("circle").attr("cx",350).attr("cy",40).attr("r", 6).style("fill", "red")
    svgLegend.append("circle").attr("cx",350).attr("cy",70).attr("r", 6).style("fill", "purple")
    svgLegend.append("circle").attr("cx",350).attr("cy",100).attr("r", 6).style("fill", "green")
    svgLegend.append("circle").attr("cx",350).attr("cy",130).attr("r", 6).style("fill", "black")
    svgLegend.append("circle").attr("cx",350).attr("cy",160).attr("r", 6).style("fill", "blue")
    svgLegend.append("circle").attr("cx",350).attr("cy",190).attr("r", 6).style("fill", "orange")
    svgLegend.append("text").attr("x", 370).attr("y", 40).text("Virgin America " + data[0].virginAmerica).style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 370).attr("y", 70).text("Delta " + data[1].delta).style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 370).attr("y", 100).text("United " + data[2].united).style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 370).attr("y", 130).text("US Airways " + data[3].usAirways).style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 370).attr("y", 160).text("American " + data[4].american).style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 370).attr("y", 190).text("SouthWest " + data[5].southWest).style("font-size", "15px").attr("alignment-baseline","middle")


}
