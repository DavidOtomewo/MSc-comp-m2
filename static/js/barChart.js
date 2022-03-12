d3.csv("/static/data/Kaggle_TwitterUSAirlineSentiment.csv").then(function(data){
    /* A asynchronous function that reads the csv file and has several functions to to compute
    the sum of negative, positive and neutral tweets for each airline and return as an arrau of objects*/
    var negativeVirginAmerica = sentimentResponse(data, 'Virgin America');
    var negativeDelta = sentimentResponse(data, 'Delta');
    var negativeUnited = sentimentResponse(data, 'United');
    var negativeUsAirways = sentimentResponse(data, 'US Airways');
    var negativeAmerican = sentimentResponse(data, 'American');
    var negativeSouthWest = sentimentResponse(data, 'Southwest');
    //console.log(negativeSouthWest)//test

    /*store negative responses into an array by using a function that returns an array of 6 objects containing
    name value-pairs for airline and the number of negative responses for that airline*/
    var airlineResponses = createResponseArray(negativeVirginAmerica, negativeDelta, negativeUnited, negativeUsAirways, negativeAmerican,
    negativeSouthWest);
    //console.log(airlineResponses)//test

    //use the created array of objects to create the bar chart
    createBarChat(airlineResponses);
 });


function sentimentResponse(data, airline){
    /* A function that loops through the csv file to calculate the negative number of response per airline
     pre conditions -  assumes you are use the csv file 'Kaggle_TwitterUSAirlineSentiment.csv' and a valid
     airline name as a string from the file.
     post conditions - returns a integer value of the number of negative responses for that airline
     */
    var negativeCount = 0
    var positiveCount = 0
    var neutralCount = 0

    //loop through the csx file to find the number of positive, neutral and negative tweets
    for(var i=0; (i<=data.length-1); i++){
        if (data[i].airline == airline && data[i].airline_sentiment =='negative'){
            negativeCount += 1;
        }

        if (data[i].airline == airline && data[i].airline_sentiment =='positive'){
            positiveCount += 1;
        }

        if (data[i].airline == airline && data[i].airline_sentiment =='neutral'){
            neutralCount += 1;
        }
    }    

    //return an array of all 3 values
    return [negativeCount, positiveCount, neutralCount]
}

function createResponseArray(negativeVirginAmerica, negativeDelta, negativeUnited, negativeUsAirways, negativeAmerican,
    /* A function that returns an array of 6 objects containing number of negative responses for each airline
     pre conditions - all arguments must be given as integers for each airline
    post conditions - returns 1 array, containing name-value pairs of all airlines and their associated number of negative
    responses*/
    negativeSouthWest){
    var airlineResponses = [
    {airline:'Virgin America', positive: negativeVirginAmerica[0], negative: negativeVirginAmerica[1], neutral: negativeVirginAmerica[2]},
    {airline:'Delta', positive: negativeDelta[0], negative: negativeDelta[1], neutral: negativeDelta[2]},
    {airline:'United', positive: negativeUnited[0], negative: negativeUnited[1], neutral: negativeUnited[2]},
    {airline:'US Airways', positive: negativeUsAirways[0], negative: negativeUsAirways[1], neutral: negativeUsAirways[2]},
    {airline:'American', positive: negativeAmerican[0], negative: negativeAmerican[1], neutral: negativeAmerican[2]},
    {airline: 'Southwest', positive: negativeSouthWest[0], negative: negativeSouthWest[1], neutral: negativeSouthWest[2]}
    ];

    return airlineResponses;
}


function createBarChat(data){
    // Parse the Data

    //create an array of all the airlines
    const groups = data.map(d => d.airline)
    console.log(groups)

    // create an array of subgroups for each sentiment per airline
    const subgroups = ["positive", "negative", "neutral"]
    console.log(subgroups)

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#BarChart-Container")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);



  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // add a scale band for the subgroups, meaning all sentiments will be grouped per airline
  const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['red','green','black'])

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // bind data to selection and loop group by group
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${x(d.airline)}, 0)`)
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .join("rect")
      .attr("x", d => xSubgroup(d.key))
      .attr("y", d => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key));

    // Svg to hold the legend of colors
    var svgLegend = d3.select("#Legend")
                    .append('svg')
                    .attr("width", 600)
                    .attr("height", 130)


    // adding new legends with circles, colors and text
    svgLegend.append("circle").attr("cx",350).attr("cy",60).attr("r", 6).style("fill", "red")
    svgLegend.append("circle").attr("cx",350).attr("cy",90).attr("r", 6).style("fill", "green")
    svgLegend.append("circle").attr("cx",350).attr("cy",120).attr("r", 6).style("fill", "black")
    svgLegend.append("text").attr("x", 370).attr("y", 60).text("Negative").style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 370).attr("y", 90).text("Positive").style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 370).attr("y", 120).text("Neutral").style("font-size", "15px").attr("alignment-baseline","middle")


}

