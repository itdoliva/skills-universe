class DataFormatter {
  constructor(raw) {
    this.skills = raw.skills;
    this.groups = raw.groups;
    this.legends = raw.legends;

    this.enrich();
    this.createStackNodes();
    this.createMatrix();
    this.createOrbitData();

    console.log(this);
  }

  stackedNodes(d, stackBy, toRetrieve) {
    if (typeof toRetrieve === 'undefined') {
      toRetrieve = [ 'shape', 'groupId', 'vizRelated' ];
    }
    
    const stacks = stackBy(d);

    return d3.range(stacks-1, -1, -1)
      .map(i => {
        const retrieving = { stacks, i };
        toRetrieve.forEach(r => {
          retrieving[r] = d[r];
        });

        return retrieving;
      });
  }

  enrich() {
    // yi is a reference to place skill on grid chart
    this.skills = this.skills.map((skill, i) => {
      const shape = this.groups.find(group => group.id === skill.groupId).shape;

      let yi = i;
      if (skill.groupId === 1) {
        yi += 1;
      } 
      else if (skill.groupId === 3) {
        yi += 2;
      }

      return { ...skill, shape, yi }
    });

    const sorted = this.skills.sort((a, b) => a.yi - b.yi).reverse();

    this.groups = this.groups.map(g => {
      const yi = sorted.find(d => d.groupId === g.id).yi;
      
      return {...g, yi}
    })
  }

  createStackNodes() {
    this.skills = this.skills.map(e => ({
      ...e, 
      stackNodes: this.stackedNodes(e, d => d.addiction)
    }));
    
    this.groups = this.groups.map(e => ({
      ...e,
      stackNodes: this.stackedNodes(e, () => 3, [ 'shape' ])
    }));

    this.legends = this.legends.map(e => {
      if (e.id !== 'size') {
        return { ...e, stackNodes: this.stackedNodes(e, () => 5, [ 'shape' ])}
      } else {
        return { 
          ...e,
          stackNodesMajor: this.stackedNodes({...e, vizRelated: 1}, () => 5, [ 'shape', 'vizRelated' ]),
          stackNodesMinor: this.stackedNodes({...e, vizRelated: 1}, () => 3, [ 'shape', 'vizRelated' ])
        }
      }
    });

  }

  createMatrix() {
    let matrix = [];
    this.skills.forEach(d => {
      for (let xi=0; xi<5; xi++) {
        if (xi+1 !== d.relevance) {
          matrix.push({ xi, yi: d.yi, shape: 'void' })
        } else {
          matrix.push({ xi, yi: d.yi, ...d});
        }
      }
    });

    this.matrix = matrix;
  }

  createOrbitData() {
    this.orbitData = d3.sort(d3.groups(this.skills, d => d.relevance), d => d[0])
      .map(g => {
        let [ level, arr ] = g;
        const siblings = arr.length;
        const orbitOffset = Math.random();

        arr = arr.map((d, i) => ({
          ...d, 
          i, 
          siblings, 
          orbitOffset
        }));

        return [ level, arr ];
      });
  }

  

  
}