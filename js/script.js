let promise = new Promise((resolve, reject) => {
  
  const req = new XMLHttpRequest();
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  req.send();
  req.onload = function() {
    const json = JSON.parse(req.responseText);
    resolve(json);
  };

});

promise.then((json) => {
  
const WIDTH = 900;
const HEIGHT = 550;
const PADDING_TOP = 75;
const PADDING_BOTTOM = 55;
const PADDING_LEFT = 65;
const PADDING_RIGHT = 35;

const xValue = d => d[0];
const yValue = d => d[1];
  
const tooltipXOffset = 10;
const tooltipYOffset = -50;
  
const svg = d3.select('svg');

svg.attr('width', WIDTH)
   .attr('height', HEIGHT)
   .attr('font-family', '"Lato", sans-serif');

svg.append('text')
     .attr('id', 'title')
     .text('USA GDP')
     .attr('x', PADDING_LEFT + 10)
     .attr('y', PADDING_TOP - 10 )
     .attr('font-size', '3.5em')
     .attr('fill', "#222");

  svg.append('text')
     .text('(USD, M)')
     .attr('x', PADDING_LEFT - 52)
     .attr('y', PADDING_TOP - 10 )
     .attr('font-size', '.8em');

    svg.append('text')
     .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
     .attr('x', WIDTH / 2)
     .attr('y', HEIGHT - 10)
     .attr('font-size', '.9em')
     .attr('fill', '#444');
  
  
const yScale = d3.scaleLinear();
yScale.domain([0, d3.max(json.data, yValue)])
      .range([HEIGHT - PADDING_BOTTOM, PADDING_TOP]);

  
const xScale = d3.scaleBand();
xScale.domain(json.data.map(xValue))
      .range([PADDING_LEFT, WIDTH - PADDING_RIGHT])
      .padding(0);

    const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain()
                  .filter(date => {
      return (date.substring(4) == '-01-01' && date.substring(0, 4) % 5 == 0);     
    }))
    .tickFormat(d => d.substring(0, 4));
  
  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', `translate(0, ${HEIGHT - PADDING_BOTTOM + 3})`)
     .call(xAxis);
  
  
  const yAxis = d3.axisLeft(yScale)
    .ticks(12);
  
  svg.append('g')
     .attr('id', 'y-axis')
     .attr('transform', `translate(${PADDING_LEFT - 3} , 0)`)
     .call(yAxis);
  
  const yAxisLines = d3.selectAll('#y-axis .tick line');
  yAxisLines.attr('x2', WIDTH - (PADDING_LEFT + PADDING_RIGHT))
    .attr('color', '#888');
  
  
  
  
  /* --TOOLTIP DATE FORMATTING-- */
  function formatDate(d) {
    let formattedDate = '';
    let monthRegex = /(?<=\d{4}-)\d\d/g;
    let date = d[0].slice(4);
    formattedDate = d[0].slice(0, 4);
    if (d[0].match(monthRegex) == '01') {formattedDate += date.replace('-01-01', ' Q1')};
    if (d[0].match(monthRegex) == '04') {formattedDate += date.replace('-04-01', ' Q2')};
    if (d[0].match(monthRegex) == '07') {formattedDate += date.replace('-07-01', ' Q3')};
    if (d[0].match(monthRegex) == '10') {formattedDate += date.replace('-10-01', ' Q4')};     
    return formattedDate;
  }
 
svg.selectAll('rect')
    .data(json.data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', xValue)
    .attr('data-gdp', yValue)
    .attr('x', d => xScale(xValue(d)))
    .attr('y', d => yScale(yValue(d)))
    .attr('width', xScale.bandwidth())
    .attr('height', d => (HEIGHT - PADDING_BOTTOM) - yScale(yValue(d)))
    .on('mouseover', (d) => {
      tooltip.style('visibility', 'visible')
        .append('text')
          .attr('transform', `translate(10, 15)`)
          .append('tspan')
          .text(formatDate(d))
          .attr('x', '.5em')
          .attr('dy', '.4em')
          .append('tspan')
          .attr('dy', '1.3em')
          .attr('x', '.5em')
          .text(`$${d[1]}`);
      })
    .on('mouseout', () => {
      tooltip.style('visibility', 'hidden')
      tooltip.select('text').remove();
      })
    .on('mousemove', (d) => {
        let mousePosition = d3.mouse(d3.event.currentTarget);
        let xPosition = mousePosition[0];
        let yPosition = mousePosition[1];
        tooltip.attr('transform', `translate(${xPosition + tooltipXOffset}, ${yPosition + tooltipYOffset})`);
      });  
    
  
    let tooltip = svg.append('g')
      .attr('visibility', 'hidden');
      
      tooltip.append('rect')
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .attr('width', '98')
      .attr('height', '53')
      .attr('rx', '.5em')
      .attr('ry', '.4em')
      .attr('fill', '#AAA');

});