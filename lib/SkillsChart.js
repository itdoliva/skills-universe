class SkillsChart {

  widthThreshold = 770;

  center = {};

  scaleToTeal = d3.scaleLinear()
    .domain([0, 4])
    .range(['#123D55', '#18A1D1'])
    .interpolate(d3.interpolateCubehelix);

  scaleToPink = d3.scaleLinear()
    .domain([0, 4])
    .range(['#123D55', '#C42EDB'])
    .interpolate(d3.interpolateCubehelix);

  scales = {
    shapeColor: (val, type, viz) => {
      if (typeof viz !== 'undefined' & !viz) {
        return '#0B1012'
      } 
      return type !== 1 ? this.scaleToPink(val) : this.scaleToTeal(val);
    },

    gridAlpha: d3.scaleLinear()
      .domain([0, 5])
      .range([.4, .2]),

    orbitalSpeed: d3.scaleLinear()
      .domain([1, 5])
      .range([80000, 120000])

  }

  legends = {
    arc: d3.arc()
      .startAngle(0)
      .endAngle(d => d.dir === 1 ? Math.PI : -Math.PI)
      .innerRadius(0)
      .outerRadius(d => d.radius),

    scaleRatio: (condition) => {
      if (typeof condition === 'undefined') {
        condition = this.width <= this.widthThreshold;
      } 
      return condition ? 1 : .4;
    }
  }


  constructor(data, draw, ref) {
    this.data = data;

    // Resizing effects
    if (!ref) {
      ref = 'svg'
    }

    this.ref = ref;

    this.getRefWidth = () => document.querySelector(ref).clientWidth;
    this.getRefHeight = () => document.querySelector(ref).clientHeight;

    this.setWidth(this.getRefWidth());
    this.setHeight(this.getRefHeight());

    window.addEventListener('resize', () => {
      this.setWidth(this.getRefWidth());
      this.setHeight(this.getRefHeight());
    }, true);

    if (draw) {
      this.draw();
    }

  }

  setWidth(width) {
    this.width = width;
    this.center.x = width / 2;

    this.update();
  }

  setHeight(height) {
    this.height = height;
    this.center.y = height / 2;

    this.update();
  }

  setMaxOrbitR() {
    this.r = d3.min([ this.width * .6 /2, 320 ]);
  }

  setScaleCircleRadius() {
    if (this.width <= this.widthThreshold) {
      this.scales.circleRadius = d3.scaleLinear()
        .domain([0, 4])
        .range([(this.cell.width/22) * 3, (this.cell.width/22) * 10]);
    } 
    else {
      this.scales.circleRadius = d3.scalePow()
        .exponent(1.1)
        .domain([0, 4])
        .range([(this.r/320) * 17.2, (this.r/320) * 61.7]);
    }
  }

  setScaleRectSize() {
    if (this.width <= this.widthThreshold) {
      this.scales.rectSize = d3.scaleLinear()
        .domain([0, 4])
        .range([(this.cell.width/22) * 4, (this.cell.width/22) * 18]);
    } 
    else {
      this.scales.rectSize = d3.scalePow()
        .exponent(1.1)
        .domain([0, 4])
        .range([ (this.r/320) * 30, (this.r/320) * 97.8 ]);
    }
  }

  setScaleGridDist() {
    this.scales.gridDist = d3.scalePow()
      .exponent(1.1)
      .domain([1, 5])
      .range([.38*this.r, this.r]);
  }

  setScaleSkillNameSize() {
    this.scales.skillNameSize = d3.scaleLinear()
      .domain([190, 320])
      .range([9, 12])
      .clamp(true);
  }

  setCellC() {
    this.cell = {
      width: (this.width/320) * 25,
      height: (this.width/320) * 25
    };

    this.margin = {
      left: 0,
      top: 40
    };
  }

  update() {
    this.setMaxOrbitR();
    this.setCellC();
    this.setScaleCircleRadius();
    this.setScaleRectSize();
    this.setScaleGridDist();
    this.setScaleSkillNameSize();


    if (this.width > this.widthThreshold) {
      d3.select('.grid-chart').classed('disable', true);

      const orbitC = d3.select('.orbit-chart')
        .classed('disable', false);

      orbitC
        .select('g.orbits')
          .attr('transform', `translate(${this.center.x}, ${this.center.y})`);

      orbitC
        .select('g.orbit-center')
          .attr('transform', `translate(${this.center.x}, ${this.center.y})`);

      orbitC
        .select('g.orbit-legends')
          .attr('transform', () => `translate(
            ${40}, ${this.scales.circleRadius(4) * this.legends.scaleRatio() + 60})`);

      orbitC
        .selectAll('g.orbit-legends .legend-g')
          .attr('transform', (d) => `translate(${this.scales.circleRadius(4) * this.legends.scaleRatio()}, ${this.scales.circleRadius(4) * this.legends.scaleRatio() * 2 * (d.yi + (d.yi * .25))})`);


      orbitC
        .selectAll('g.orbit-legends .legend-label')
          .attr('transform', `translate(${this.scales.circleRadius(4) * this.legends.scaleRatio() * 1.5}, 0)`);
            
      orbitC
        .select('g.orbit-legends .legend-footer')
          .attr('transform', `translate(0, ${this.scales.circleRadius(4) * this.legends.scaleRatio() * 2 * 3.5})`);
        

      orbitC
        .selectAll('.orbit-circle')
          .attr('r', d => this.scales.gridDist(d[0]))
          .attr('opacity', d => this.scales.gridAlpha(d[0]));

      orbitC
        .selectAll('g.skills')
          .attr('font-size', this.scales.skillNameSize(this.r));
        
      this.orbitTransition();
    } 

    else {
      d3.select('.orbit-chart').classed('disable', true);

      const gridC = d3.select('.grid-chart')
        .classed('disable', false)
        .attr('transform', `translate(${this.cell.width *.8 + 20}, ${this.cell.height / 2 + 20})`);

      gridC
        .select('.grid-legends')
          .attr('transform', 'translate(0, 0)');

      gridC
        .selectAll('.grid-legends .legend-g')
          .attr('transform', (d, i) => `translate(0, ${this.cell.height * (i + (i*.5))})`);

      gridC
        .selectAll('.grid-legends .legend-label')
          .attr('transform', `translate(${this.cell.width * .75}, 0)`);
          
      gridC
        .select('.grid-legends .legend-footer')
          .attr('transform', `translate(0, ${this.cell.height * 2.5 + 20})`)
      
      gridC
      .select('.grid-legends .div-line')
        .attr('d', d3.line()([
          [-this.cell.width/2, 6],
          [this.width * .8, 6]
        ]));    

      gridC
        .select('.grid-legends .disclosure')
          .attr('x', -this.cell.width/2);

      gridC
        .select('.grid-area')
          .attr('transform', `translate(0, ${this.cell.height * 2.5 + 60})`)

      gridC
        .select('.grid')
          .attr('transform', `translate(${this.cell.width * .8}, ${25})`)
        .selectAll('path.grid-line')
          .attr('d', d => d3.line()([
            [this.cell.width * (d + .5), 0],
            [this.cell.width * (d + .5), this.cell.height*22]
          ]));

      gridC
        .select('.matrix')
          .attr('transform', `translate(${this.cell.width * .8}, ${30})`)
        .selectAll('g.node')
          .attr('transform', d => `translate(${this.cell.width*d.xi + this.cell.width/2}, ${this.cell.height*d.yi + this.cell.height/2})`);

      gridC
        .select('.skills')
          .attr('transform', `translate(${20 + this.cell.width*5.4}, ${30})`)
        .selectAll('text')
          .attr('transform', d => `translate(0, ${this.cell.height*d.yi + this.cell.height/2})`);

      
      const xAxis = gridC.select('.x-legend')
        .attr('transform', `translate(${this.cell.width * .8}, ${0})`)
      .select('.x-axis')
        .attr('transform', 'translate(0, 22.5)');

      xAxis
        .select('path.domain')
          .attr('d', d3.line()([[0, 0], [this.cell.width*5.35, 0]]));

      xAxis
        .selectAll('line')
          .attr('x1', d => this.cell.width*d)
          .attr('x2', d => this.cell.width*d)
          .attr('y1', d =>  (d-.5) % 2 === 0 ? -2 : -1)
          .attr('y2', d =>  (d-.5) % 2 === 0 ? 2 : 1);

      xAxis
        .selectAll('text tspan')
          .attr('x', (d, i) => {
            if (i === 0) {
              return this.cell.width*.5;
            } else if (i === 1) {
              return this.cell.width*2.5;
            } else {
              return this.cell.width*4.5;
            }
          });

      const yGroup = gridC.select('.y-legend')
        .attr('transform', `translate(0, ${30})`)
      .selectAll('g.group-g')
        .attr('transform', d => `translate(0, ${this.cell.height*(d.yi+.5)}) rotate(-90)`);

      yGroup
        .selectAll('text')
          .attr('x', this.cell.width * .6);
    }

    // SHAPE: Diamond, Square
    d3.selectAll('g.node.shape-diamond:not(.group-shape) > rect, g.node.shape-square:not(.group-shape) > rect')
      .attr('x', d => -this.scales.rectSize(d.i) / 2)
      .attr('y', d => -this.scales.rectSize(d.i) / 2)
      .attr('width', d => this.scales.rectSize(d.i))
      .attr('height', d => this.scales.rectSize(d.i));

    // SHAPE: Circle
    d3.selectAll('g.node.shape-circle:not(.group-shape) > circle')
      .attr('r', d => this.scales.circleRadius(d.i));
    
    // SHAPE: Group: Diamond, Square
    d3.selectAll('g.node.shape-diamond.group-shape > rect, g.node.shape-square.group-shape > rect')
      .attr('x', d => -this.scales.rectSize(d.i) * this.legends.scaleRatio() / 2)
      .attr('y', d => -this.scales.rectSize(d.i) * this.legends.scaleRatio() / 2)
      .attr('width', d => this.scales.rectSize(d.i) * this.legends.scaleRatio())
      .attr('height', d => this.scales.rectSize(d.i) * this.legends.scaleRatio());

    // SHAPE: Group: Circle
    d3.selectAll('g.node.shape-circle.group-shape > circle')
      .attr('r', d => this.scales.circleRadius(d.i) * this.legends.scaleRatio());

    // SHAPE: Major, Minor
    d3.selectAll('g.node.shape-major-circle > circle')
      .attr('r', d => this.scales.circleRadius(d.i) * this.legends.scaleRatio());

    d3.selectAll('g.node.shape-minor-circle > circle')
      .attr('cx', d => this.scales.circleRadius(d.stacks-1) * this.legends.scaleRatio())
      .attr('cy', d => this.scales.circleRadius(d.stacks-1) * this.legends.scaleRatio())
      .attr('r', d => this.scales.circleRadius(d.i) * this.legends.scaleRatio());

    // SHAPE: Half circles
    d3.selectAll('g.node.shape-half-circles > path.ana-shape')
      .attr('d', d => this.legends.arc({
        ...d, 
        dir: 1,
        radius: this.scales.circleRadius(d.i) * this.legends.scaleRatio()}));

    d3.selectAll('g.node.shape-half-circles > path.viz-shape')
      .attr('d', d => this.legends.arc({
        ...d, 
        dir: 0,
        radius: this.scales.circleRadius(d.i) * this.legends.scaleRatio()}));

    d3.selectAll('g.node.shape-half-circles > path.line')
      .attr('d', d => d3.line()([
        [0, -this.scales.circleRadius(d.i) * this.legends.scaleRatio()],
        [0, this.scales.circleRadius(d.i) * this.legends.scaleRatio()]
      ]));

    // SHAPE: Distance from center
    d3.selectAll('g.node.shape-distance-from-center')
      .attr('transform', `translate(${this.scales.circleRadius(4) * -1 * this.legends.scaleRatio()}, ${this.scales.circleRadius(4) * -1 * this.legends.scaleRatio()}) scale(${this.scales.circleRadius(4) * 2 * this.legends.scaleRatio() / 67})`) // 67 is the shape original size

    // SHAPE: Sun
    d3.select('.orbit-chart .orbit-center g.node.shape-sun')
      .attr('transform', `translate(${-this.scales.gridDist(1) * 1.15}, ${-this.scales.gridDist(1) * 1.15}) scale(${this.scales.gridDist(1)*1.15*2/200})`);

    this.changeHeight();

  }

  drawNodes() {
    // SHAPE: Void
    d3.selectAll('g.node.shape-void')
      .append('circle')
        .attr('r', 1);

    // SHAPE: Diamond, Square
    d3.selectAll('g.node.shape-diamond, g.node.shape-square')
      .selectAll('rect')
        .data(d => d.stackNodes)
        .enter()
      .append('rect')
        .attr('transform', d => d.shape === 'diamond'
          ? 'rotate(-45)'
          : 'rotate(0)');  

    // SHAPE: Circle,
    d3.selectAll('g.node.shape-circle')
      .selectAll('circle')
        .data(d => d.stackNodes)
        .enter()
      .append('circle');

    // SHAPE: Major Minor Circle
    d3.selectAll('g.node.shape-major-circle')
    .selectAll('circle')
      .data(d => d.stackNodesMajor)
      .enter()
    .append('circle');

    d3.selectAll('g.node.shape-minor-circle')
      .selectAll('circle')
        .data(d => d.stackNodesMinor)
        .enter()
      .append('circle');

    // SHAPE: Half Circles
    d3.selectAll('g.node.shape-half-circles')
      .selectAll('path.ana-shape')
        .data(d => d.stackNodes)
        .enter()
      .append('path')
        .attr('class', 'ana-shape');  

    d3.selectAll('g.node.shape-half-circles')
      .selectAll('path.viz-shape')
        .data(d => d.stackNodes)
        .enter()
      .append('path')
        .attr('class', 'viz-shape')
        .attr('fill', d => this.scales.shapeColor(d.stacks -1 - d.i, 2, 1))
        .attr('stroke', 'none');  

    d3.selectAll('g.node.shape-half-circles')
      .selectAll('path.line')
        .data(d => d.stackNodes)
        .enter()
      .append('path')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    // SHAPE: Distance G
    d3.selectAll('g.node.shape-distance-from-center')
      .html('<circle cx="34" cy="34" r="33.5" stroke="#FBF9F7" stroke-opacity="0.35"/><circle cx="34" cy="34" r="27.85" stroke="#FBF9F7" stroke-opacity="0.25" stroke-width="0.3"/><circle cx="34" cy="34" r="22.85" stroke="#FBF9F7" stroke-opacity="0.25" stroke-width="0.3"/><circle cx="34" cy="34" r="17.85" stroke="#FBF9F7" stroke-opacity="0.25" stroke-width="0.3"/><circle cx="34" cy="34" r="13.5" stroke="#FBF9F7" stroke-opacity="0.35"/><path fill-rule="evenodd" clip-rule="evenodd" d="M31.9995 10.4995L33.9995 5.49951L35.9995 10.4995H34.4995V15.9995H33.4995V10.4995H31.9995Z" fill="#5F6262"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.9995 57.4995L33.9995 62.4995L31.9995 57.4995L33.4995 57.4995L33.4995 51.9995L34.4995 51.9995L34.4995 57.4995L35.9995 57.4995Z" fill="#5F6262"/><path fill-rule="evenodd" clip-rule="evenodd" d="M52.0309 49.2023L54.1522 54.152L49.2024 52.0307L50.2631 50.97L46.374 47.081L47.0811 46.3739L50.9702 50.2629L52.0309 49.2023Z" fill="#5F6262"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.9686 18.7966L13.8473 13.8469L18.7971 15.9682L17.7364 17.0289L21.6255 20.9179L20.9184 21.625L17.0293 17.736L15.9686 18.7966Z" fill="#5F6262"/><path fill-rule="evenodd" clip-rule="evenodd" d="M57.4995 31.9995L62.4995 33.9995L57.4995 35.9995L57.4995 34.4995L51.9995 34.4995L51.9995 33.4995L57.4995 33.4995L57.4995 31.9995Z" fill="#5F6262"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.4995 35.9995L5.49951 33.9995L10.4995 31.9995L10.4995 33.4995L15.9995 33.4995L15.9995 34.4995L10.4995 34.4995L10.4995 35.9995Z" fill="#5F6262"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18.7968 52.0308L13.847 54.152L14.9077 51.6772L15.9683 49.2023L17.029 50.263L20.9181 46.3739L21.6252 47.081L17.7361 50.9701L18.7968 52.0308Z" fill="#5F6262"/><path fill-rule="evenodd" clip-rule="evenodd" d="M49.2024 15.9682L54.1522 13.8469L52.0309 18.7966L50.9702 17.736L47.0811 21.6251L46.374 20.918L50.2631 17.0289L49.2024 15.9682Z" fill="#5F6262"/><path d="M37.493 31.9622L38.7318 29.2682L36.0378 30.507L34 25L31.9622 30.507L29.2682 29.2682L30.507 31.9622L25 34L30.507 36.0378L29.2682 38.7318L31.9623 37.4931L34 43L36.0377 37.4931L38.7318 38.7318L37.493 36.0378L43 34L37.493 31.9622Z" fill="#D9D9D9" fill-opacity="0.3"/>');

    // SHAPE: Sun
    d3.selectAll('g.node.shape-sun')
      .html('<path fill-rule="evenodd" clip-rule="evenodd" d="M77.4396 57.4921L29.0485 29.0485L56.1098 75.0879L36.3815 71.8529L54.1461 85.9428L0 100L51.2924 113.316L34.937 125.063L57.4509 122.466L29.0483 170.788L75.1183 143.708L71.8533 163.619L85.943 145.855L100 200L113.349 148.583L125.11 164.959L122.509 142.41L170.787 170.788L143.815 124.899L163.619 128.147L145.855 114.057L200 100L148.511 86.6327L165.005 74.7859L142.369 77.3971L170.788 29.0485L124.93 56.0031L128.147 36.3809L114.057 54.1458L100 0L86.6649 51.3649L74.8324 34.8906L77.4396 57.4921ZM119.158 56.6997L126.306 40.5419L114.434 54.9037C109.884 53.4483 105.034 52.6627 100 52.6627V6.54037L87.1857 52.09L88.591 54.0466C86.6536 54.526 84.7632 55.1247 82.9282 55.8345L76.4728 39.1345L78.2575 57.9401C73.9105 60.1918 69.957 63.0977 66.5273 66.5273L33.6732 33.6732L56.9822 75.231L59.4097 75.629C58.4029 77.3022 57.4967 79.0426 56.6994 80.8421L40.5425 73.6938L54.9035 85.5653C53.4481 90.1161 52.6624 94.9662 52.6624 99.9999L6.54037 100L52.0191 112.794L54.0316 111.349C54.507 113.281 55.101 115.166 55.8054 116.997L39.181 123.423L57.8909 121.647C60.1316 125.997 63.0264 129.955 66.4454 133.39L33.6731 166.163L75.2612 142.837L75.6295 140.59C77.3027 141.597 79.0432 142.503 80.8427 143.301L73.6942 159.458L85.5661 145.096C90.1166 146.552 94.9664 147.337 99.9997 147.337C99.9998 147.337 99.9996 147.337 99.9997 147.337L100 193.46L112.829 147.859L111.452 145.943C113.374 145.465 115.251 144.87 117.072 144.165L123.47 160.715L121.701 142.081C126.064 139.826 130.032 136.913 133.472 133.472L166.163 166.163L142.938 124.756L140.59 124.371C141.597 122.697 142.503 120.957 143.3 119.157L159.458 126.306L145.096 114.434C146.551 109.883 147.337 105.033 147.337 99.9999L193.46 100L147.789 87.1516L145.927 88.4884C145.446 86.5604 144.846 84.6792 144.136 82.8529L160.761 76.4264L142.032 78.2039C139.766 73.8435 136.841 69.8801 133.39 66.4457L166.163 33.6732L124.786 56.8809L124.371 59.4101C122.698 58.4033 120.957 57.497 119.158 56.6997Z" fill="#171C1D"/>');

    // Attr: Class and Fill
    const selectors = (
      'g.node.shape-diamond > rect' 
      + ', g.node.shape-square > rect' 
      + ', g.node.shape-circle > circle'
      + ', g.node.shape-major-circle > circle'
      + ', g.node.shape-minor-circle > circle'
      + ', g.node.shape-half-circles > circle'
    )

    d3.selectAll(selectors)
      .classed('viz-shape', d => (d.shape !== 'void') & (typeof d.vizRelated !== 'undefined') & (d.vizRelated))
      .classed('ana-shape', d => (d.shape !== 'void') & (typeof d.vizRelated !== 'undefined') & (!d.vizRelated))
      .attr('fill', d => this.scales.shapeColor(d.stacks -1 - d.i, d.groupId, d.vizRelated));

  }

  setup() {
    const svg = d3.select('svg');

    const marker = { width: 7.5, height: 7.5 };

    svg
      .append('defs')
      .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, marker.width, marker.height])
        .attr('refX', marker.width/2)
        .attr('refY', marker.height/2)
        .attr('markerWidth', marker.width)
        .attr('markerHeight', marker.height)
        .attr('orient', 'auto-start-reverse')
      .append('path')
        .attr('d', d3.line()([
          [0, 0], 
          [0, marker.height], 
          [marker.width, marker.height/2]]
        ))
        .attr('fill', '#ADACAB');


    const orbit = svg
      .append('g')
        .attr('class', 'orbit-chart');

    orbit
      .append('g')
        .attr('class', 'orbit-center');

    orbit
      .append('g')
        .attr('class', 'orbit-legends');

    orbit
      .append('g')
        .attr('class', 'orbits');
    

    const grid = svg
      .append('g')
        .attr('class', 'grid-chart');

    grid
    .append('g')
      .attr('class', 'grid-legends');

    grid
      .append('g')
        .attr('class', 'grid-area');
  }

  orbitDrawGrid() {

    const orbit = d3.select('g.orbit-chart g.orbits')
      .selectAll('g.orbit')
        .data(this.data.orbitData)
        .enter()
      .append('g')
        .attr('class', d => `orbit orbit-${d[0]}`);

    orbit
      .append('circle')
        .attr('class', 'orbit-circle');
  }

  orbitNodes() {
    d3.selectAll('.orbit-chart g.orbit')
      .selectAll('g.node')
        .data(d => d[1])
        .enter()
      .append('g')
        .attr('class',  d => `node shape-${d.shape}`);
  }

  orbitSkillNames() {
    d3.selectAll('.orbit-chart g.orbits g.node')
      .append('g')
        .attr('class', 'skills')
      .append('text')
        .text(d => d.name)
        .attr('class', 'skill-name');
  }

  orbitCenter() {
    const center = d3.select('.orbit-chart .orbit-center')
    
    center
      .append('g')
        .attr('class', 'node shape-sun');

    center
      .append('text')
        .text('Skills');
  }

  orbitLegends() {
    const data = [
      ...this.data.legends.map((d, i) => ({...d, isGroup: 0, yi: i})),
      ...this.data.groups.map((d, i) => ({...d, isGroup: 1, yi: this.data.legends.length + i + 1}))
    ]

    const g = d3.select('.orbit-chart .orbit-legends')
      .selectAll('g.legend-g')
        .data(data)
        .enter()
      .append('g')
        .attr('class', d => `legend-g legend-${d.id}`);

    g.append('g')
        .attr('class', d => `node shape-${d.shape}`)
        .classed('group-shape', d => d.isGroup);

    g.selectAll('g.node.shape-major-minor-circle')
      .append('g')
        .attr('class', `node shape-major-circle`);

    g.selectAll('g.node.shape-major-minor-circle')
      .append('g')
        .attr('class', `node shape-minor-circle`);

    const t = g
      .append('g')
        .attr('class', 'legend-label')
      .append('text')
        .attr('y', -5);

    t.append('tspan')
        .attr('class', 'legend-name')
        .attr('x', 0)
        .text(d => d.isGroup ? d.shape[0].toUpperCase() + d.shape.substr(1) + 's' : d.name);
  
    t.append('tspan')
        .attr('class', 'legend-desc')
        .attr('x', 0)
        .attr('dy', 15)
        .text(d => d.isGroup ? d.name : d.desc); 
        
    const footer = d3.select('.orbit-legends')
      .append('g')
        .attr('class', 'legend-footer');      
        
    footer
      .append('path')
        .attr('class', 'div-line')
        .attr('stroke', '#ADACAB')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', .1);
    
    footer
      .append('text')
        .attr('class', 'disclosure')
        .text('Legends apply to all three shapes, not only circles.');

  }

  orbitTransition() {
    const orbitalSpeed = this.scales.orbitalSpeed;

    d3.selectAll('.orbit-chart g.orbit g.node')
      .each(function(d) {
        const orbit = d3.select(`.orbit-${d.relevance} > circle`);
        transition(d3.select(this), orbit, orbitalSpeed(d.relevance))();
      });
  }


  gridGrid() {
    d3.select('.grid-chart .grid-area')
      .append('g')
        .attr('class', 'grid')
      .selectAll('path.grid-line')
        .data([...Array(5).keys()])
        .enter()
      .append('path')
        .attr('class', 'grid-line');
  }

  gridNodes() {
    const chart = d3.select('.grid-chart .grid-area')
      .append('g')
        .attr('class', 'matrix');

    chart
      .selectAll('g.node')
        .data(this.data.matrix)
        .enter()
      .append('g')
        .attr('class', d => `node shape-${d.shape}`);
  }

  gridSkillNames() {
    d3.select('.grid-chart .grid-area')
      .append('g')
        .attr('class', 'skills')
      .selectAll('text')
        .data(this.data.skills)
        .enter()
      .append('text')
        .attr('dy', 2.5)
        .text(d => d.name);
  }

  gridLegends() {

    const g = d3.select('.grid-chart .grid-legends')
      .selectAll('g.legend-g')
        .data(this.data.legends.filter(d => d.id !== 'distance'))
        .enter()
      .append('g')
        .attr('class', d => `legend-g legend-${d.id}`);
  
    g
      .append('g')
        .attr('class', d => `node shape-${d.shape}`);

    g.selectAll('g.node.shape-major-minor-circle')
      .append('g')
        .attr('class', `node shape-major-circle`);

    g.selectAll('g.node.shape-major-minor-circle')
      .append('g')
        .attr('class', `node shape-minor-circle`);

    const t = g
      .append('g')
        .attr('class', 'legend-label')
      .append('text')
        .attr('y', -5);

    t.append('tspan')
        .attr('class', 'legend-name')
        .attr('x', 0)
        .text(d => d.name);
  
    t.append('tspan')
        .attr('class', 'legend-desc')
        .attr('x', 0)
        .attr('dy', 15)
        .text(d => d.desc); 
        
    const footer = d3.select('.grid-legends')
      .append('g')
        .attr('class', 'legend-footer');      
        
    footer
      .append('path')
        .attr('class', 'div-line')
        .attr('stroke', '#ADACAB')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', .1);
    
    footer
      .append('text')
        .attr('class', 'disclosure')
        .text('Legends apply to all three shapes, not only circles.');
  }

  gridXAxis() {
    const relG = d3.select('.grid-chart .grid-area')
      .append('g')
        .attr('class', 'x-legend');

    relG
      .append('text')
      .attr('class', 'x-title')
      .attr('x', 0)
      .attr('text-anchor', 'start')
      .style('text-transform', 'uppercase')
      .text('Relevance for Data Design jobs');

    const axis = relG
      .append('g')
        .attr('class', 'x-axis');
  
    axis
      .append('path')
        .attr('class', 'domain')
        .attr('marker-end', 'url(#arrow)')
        .attr('stroke', '#ADACAB')
        .attr('stroke-width', 1)
        .attr('opacity', .5)
        .attr('fill', 'none');
  
    axis
      .selectAll('line')
        .data([.5, 1.5, 2.5, 3.5, 4.5])
        .enter()
      .append('line');
  
    const ticks = axis
      .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', -7.5)
        .attr('opacity', .7);
    
    ticks.append('tspan').text('Low');  
    ticks.append('tspan').text('Medium');
    ticks.append('tspan').text('High');
  }

  gridYAxis() {
    const groupG = d3.select('.grid-chart .grid-area')
      .append('g')
        .attr('class', 'y-legend')
        .attr('transform', `translate(0, 30)`)
      .selectAll('g.group-g')
        .data(this.data.groups)
        .enter()
      .append('g')
        .attr('class', 'group-g');

    groupG
      .append('text')
        .attr('x', this.cell.width*.6)
        .attr('dy', 1)
        .text(d => d.name);

    groupG
      .append('g')
        .attr('class', d => `node shape-${d.shape} group-shape`);
  }

  changeHeight() {
    let refHeight;

    if (this.width <= this.widthThreshold) {
      refHeight = 
        (this.cell.height / 2 + 20) + // Padding top g.grid-chart
        (this.cell.height * 2.5 + 60) + // Padding g.grid-area
        (30) + // Padding g.matrix
        (this.cell.height*(d3.max(this.data.matrix, d => d.yi)) + this.cell.height/2) + // Padding g.nodes 
        (this.cell.height / 2 + 40) // Padding bottom g.grid-chart
    } else {
      refHeight = this.scales.gridDist(5) * 2.15;
    }

    d3.select(this.ref)
      .style('height', refHeight + 'px');
  }

  
  draw() {
    this.setup();

    this.gridLegends();
    this.gridXAxis();
    this.gridYAxis();
    this.gridGrid();
    this.gridNodes();
    this.gridSkillNames();

    this.orbitLegends();
    this.orbitCenter();
    this.orbitDrawGrid();
    this.orbitNodes();

    this.drawNodes();

    this.orbitSkillNames();
    
    this.update();
  }

}