const skills = {
    nodes: [
        // Fields
        { id: 100, name: 'Data Design', size: 10, fx: .666 * 1000, fy: .269 * 1000 },
        { id: 101, name: 'Data Analysis', size: 10, fx: .282 * 1000, fy: .757 * 1000 },
        { id: 102, name: 'Dashboards', size: 10, fx: .526 * 1000, fy: .548 * 1000 },
    
        // Languages
        { id: 200, name: 'Python', size: 4 },
        { id: 205, name: 'SQL', size: 4 },
    
        { id: 201, name: 'JavaScript', size: 6 },
        { id: 202, name: 'HTML', size: 6 },
        { id: 203, name: 'CSS', size: 6 },
        { id: 204, name: 'SCSS/SASS', size: 6 },
    
        // Libraries and Frameworks
        { id: 300, name: 'D3.js', size: 10 },
        { id: 301, name: 'ReactJS', size: 10 },
        { id: 302, name: 'Plotly & Dash', size: 6 },
        { id: 303, name: 'ECharts', size: 6 },
        { id: 310, name: 'Node.js', size: 6 },
    
        { id: 304, name: 'Matplotlib', size: 3 },
        { id: 305, name: 'Seaborn', size: 3 },
        { id: 306, name: 'Pandas', size: 3 },
        { id: 307, name: 'Numpy', size: 3 },
        { id: 308, name: 'scikit-learn', size: 1 },
        { id: 309, name: 'django', size: 1 },
        { id: 311, name: 'DAX', size: 1 },
        { id: 312, name: 'Power Query', size: 1 },
    
        //  Softwares
        { id: 400, name: 'Figma', size: 8 },
        { id: 401, name: 'Adobe Illustrator', size: 8 },
        { id: 402, name: 'PowerBI', size: 7 },
        { id: 403, name: 'Tableau', size: 7 },
      ],

      links: [
        { source: 100, target: 201, value: 3, type: 'field'}, // Data Design | JavaScript
        { source: 100, target: 202, value: 3, type: 'field'}, // Data Design | HTML
        { source: 100, target: 203, value: 3, type: 'field'}, // Data Design | CSS
        { source: 100, target: 204, value: 3, type: 'field'}, // Data Design | SCSS
        { source: 100, target: 401, value: 3, type: 'field'}, // Data Design | Adobe Illustrator
        { source: 100, target: 400, value: 3, type: 'field'}, // Data Design | Figma
        // { source: 100, target: 101, value: 1, type: 'fields'}, // Data Design | Data Analysis
    
        { source: 101, target: 200, value: 3, type: 'field' }, // Data Analysis | Python
        { source: 101, target: 205, value: 1, type: 'field' }, // Data Analysis | SQL
        // { source: 101, target: 102, value: 1, type: 'fields' }, // Data Analysis | Dashboards
    
        { source: 102, target: 201, value: 3, type: 'field' }, // Dashboards | JavaScript
        { source: 102, target: 202, value: 3, type: 'field' }, // Dashboards | HTML
        { source: 102, target: 203, value: 3, type: 'field' }, // Dashboards | CSS
        { source: 102, target: 204, value: 3, type: 'field' }, // Dashboards | SCSS
        { source: 102, target: 205, value: 3, type: 'field' }, // Dashboards | SQL
        { source: 102, target: 402, value: 3, type: 'field' }, // Dashboards | Power BI
        { source: 102, target: 403, value: 3, type: 'field' }, // Dashboards | Tableau
        // { source: 102, target: 309, value: 0, type: 'field' }, // Dashboards | django
        // { source: 102, target: 310, value: 0, type: 'field' }, // Dashboards | Node.js
    
        { source: 300, target: 201, value: 5, type: 'language' }, // D3.js | JavaScript
        { source: 301, target: 201, value: 5, type: 'language' }, // ReactJS | JavaScript
        { source: 302, target: 201, value: 5, type: 'language' }, // Plotly & Dash | JavaScript
        { source: 303, target: 201, value: 5, type: 'language' }, // ECharts | JavaScript
        { source: 310, target: 201, value: 5, type: 'language' }, // Node.js | JavaScript
        { source: 302, target: 201, value: 5, type: 'language' }, // Plotly & Dash | JavaScript
    
        { source: 304, target: 200, value: 5, type: 'language' }, // Matplotlib | Python
        { source: 305, target: 200, value: 5, type: 'language' }, // Seaborn | Python
        { source: 306, target: 200, value: 5, type: 'language' }, // Pandas | Python
        { source: 307, target: 200, value: 5, type: 'language' }, // Numpy | Python
        { source: 308, target: 200, value: 5, type: 'language' }, // scikit-learn | Python
        { source: 309, target: 200, value: 5, type: 'language' }, // django | Python
        { source: 302, target: 200, value: 1, type: 'language' }, // Plotly & Dash | Python
    
        { source: 402, target: 311, value: 5, type: 'language' }, // Power BI | DAX
        { source: 402, target: 312, value: 5, type: 'language' }, // Power BI | PowerQuery
      ]
}