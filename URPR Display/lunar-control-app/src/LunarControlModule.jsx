import React, { useState } from 'react';
import { Map, Grid, AlertCircle, BarChart2, List, Layers, Moon, Satellite, Sliders, Terminal } from 'lucide-react';

const LunarControlModule = () => {
  const [activeMap, setActiveMap] = useState('grid');
  const [visibleLayers, setVisibleLayers] = useState({
    breadcrumb: false,
    eva: true,
    pr: true,
    poi: true
  });
  const [mapElements, setMapElements] = useState([
    { id: 'bread-1', type: 'breadcrumb', location: [3, 2] },
    { id: 'bread-2', type: 'breadcrumb', location: [5, 3] },
    { id: 'eva-1', type: 'eva', location: [2, 4] },
    { id: 'eva-2', type: 'eva', location: [6, 6] },
    { id: 'pr-1', type: 'pr', location: [4, 5] },
    { id: 'poi-1', type: 'poi', location: [1, 1] },
    { id: 'poi-2', type: 'poi', location: [7, 2] },
  ]);
  const [isPoiMode, setIsPoiMode] = useState(false);
  let poiCounter = mapElements.filter(el => el.type === 'poi').length + 1;

  const toggleLayer = (layer) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleAddPoint = () => {
    setIsPoiMode(true);
  };

  const handleGridClick = (x, y) => {
    if (!isPoiMode) return;

    const poiExists = mapElements.some(
      el => el.type === 'poi' && el.location[0] === x && el.location[1] === y
    );

    if (!poiExists) {
      setMapElements(prev => [
        ...prev,
        { id: `poi-${poiCounter++}`, type: 'poi', location: [x, y] }
      ]);
      setVisibleLayers(prev => ({
        ...prev,
        poi: true
      }));
    }

    setIsPoiMode(false);
  };

  const tasks = [
    { id: 1, priority: 'high', title: 'Oxygen level maintenance', status: 'pending', eta: '00:01:30' },
    { id: 2, priority: 'critical', title: 'Sample #2 scan incomplete', status: 'pending', eta: '00:02:00' },
    { id: 3, priority: 'medium', title: 'Sample #3 scan', status: 'queued', eta: '00:04:00' },
    { id: 4, priority: 'low', title: 'Comms check', status: 'queued', eta: '00:00:30' },
    { id: 5, priority: 'high', title: 'Ingress', status: 'queued', eta: '00:03:00' },
    { id: 6, priority: 'low', title: 'Sample #1 scan', status: 'complete', eta: '00:02:37' },
  ];

  const samples = [
    { id: 1, size: '5x3x4 cm', color: 'Gray', texture: 'Fine', status: 'complete' },
    { id: 2, size: '1x2x3 cm', color: 'Red', texture: 'N/A', status: 'incomplete' },
    { id: 3, size: 'N/A', color: 'N/A', texture: 'N/A', status: 'incomplete' },
    { id: 4, size: 'N/A', color: 'N/A', texture: 'N/A', status: 'incomplete' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-blue-100 font-mono">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-blue-500 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Moon className="text-blue-400" size={24} />
          <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">PRESSURIZED ROVER UI</span>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span>SYSTEMS NOMINAL</span>
          </div>
          <div className="text-blue-300">Mission Timer: 00:07:37</div>
        </div>
      </div>
      
      {/* Main Content - Two Windows */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Multiple Windows */}
        <div className="flex-1 p-4 grid grid-cols-4 grid-rows-2 gap-4">
          {/* Map Window */}
          <div className="col-span-2 row-span-2 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
            <div className="bg-gray-700 p-2 border-b border-blue-600 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Map size={18} className="text-blue-400" />
                <span className="font-bold">MINIMAP</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  className={`px-2 py-1 rounded-md text-xs ${activeMap === 'grid' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                  onClick={() => setActiveMap('grid')}
                >
                  GRID
                </button>
                <button 
                  className={`px-2 py-1 rounded-md text-xs ${activeMap === 'topo' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                  onClick={() => setActiveMap('topo')}
                >
                  TOPO
                </button>
                <button 
                  className={`px-2 py-1 rounded-md text-xs ${activeMap === '3d' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                  onClick={() => setActiveMap('3d')}
                >
                  3D
                </button>
              </div>
            </div>
            
            {/* Grid Map */}
            <div className="flex-1 p-4 relative">
              <div className="absolute inset-0 m-4">
                <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-1 relative">
                  {/* Grid Lines */}
                  {Array.from({length: 10}).map((_, i) => (
                    <React.Fragment key={i}>
                      {Array.from({length: 10}).map((_, j) => (
                        <div 
                          key={`${i}-${j}`} 
                          className={`bg-gray-700 border border-blue-900/40 rounded-sm flex items-center justify-center ${isPoiMode ? 'cursor-pointer hover:bg-gray-600' : ''}`}
                          onClick={() => handleGridClick(j, i)}
                        >
                          <span className="text-xs text-blue-500/30">{i},{j}</span>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Map Elements */}
                  {mapElements.map(element => {
                    const [x, y] = element.location;
                    const visible = (
                      (element.type === 'breadcrumb' && visibleLayers.breadcrumb) ||
                      (element.type === 'eva' && visibleLayers.eva) ||
                      (element.type === 'pr' && visibleLayers.pr) ||
                      (element.type === 'poi' && visibleLayers.poi)
                    );
                    
                    if (!visible) return null;
                    
                    let elementIcon;
                    let statusColor = "bg-green-500";
                    
                    if (element.status === 'warning' || element.reading === 'warning') {
                      statusColor = "bg-yellow-500";
                    }
                    
                    switch(element.type) {
                      case 'breadcrumb':
                        elementIcon = <div className="text-cyan-400 bg-cyan-900/60 p-1 rounded-md flex items-center justify-center w-full h-full"><Grid size={16} /></div>;
                        break;
                      case 'eva':
                        elementIcon = <div className="text-green-400 bg-green-900/60 p-1 rounded-md flex items-center justify-center w-full h-full"><BarChart2 size={16} /></div>;
                        break;
                      case 'pr':
                        elementIcon = <div className="text-purple-400 bg-purple-900/60 p-1 rounded-md flex items-center justify-center w-full h-full"><Satellite size={16} /></div>;
                        break;
                      case 'poi':
                        elementIcon = <div className="text-yellow-400 bg-yellow-900/60 p-1 rounded-md flex items-center justify-center w-full h-full"><AlertCircle size={16} /></div>;
                        break;
                      default:
                        elementIcon = null;
                    }
                    
                    return (
                      <div
                        key={element.id}
                        style={{
                          position: 'absolute',
                          top: `${y * 10}%`,
                          left: `${x * 10}%`,
                          width: '10%',
                          height: '10%',
                          padding: '2px',
                          zIndex: 10
                        }}
                        className="animate-fadeIn hover:z-20"
                      >
                        <div className="relative w-full h-full group">
                          {elementIcon}
                          <div className={`absolute right-0 top-0 w-2 h-2 rounded-full animate-pulse z-10 border border-white/50 shadow-glow ${statusColor}`} style={{boxShadow: '0 0 5px currentColor'}}></div>
                          
                          {/* Tooltip */}
                          <div className="hidden group-hover:block absolute top-full left-0 bg-gray-800 border border-blue-500 p-2 rounded-md shadow-lg text-xs min-w-32 z-30">
                            <div className="font-bold text-blue-300">{element.id.toUpperCase()}</div>
                            <div className="text-gray-300">Type: {element.type}</div>
                            <div className="text-gray-300">Status: {element.status}</div>
                            {element.resource && <div className="text-gray-300">Resource: {element.resource}</div>}
                            {element.reading && <div className="text-gray-300">Reading: {element.reading}</div>}
                            {element.destination && <div className="text-gray-300">Dest: {element.destination}</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Coordinate System */}
              <div className="absolute left-0 top-0 p-1 bg-gray-800/80 rounded-br-md border-r border-b border-blue-600/50 text-xs flex flex-col">
                <div className="text-blue-300">LAT: 23°12'66"N</div>
                <div className="text-blue-300">LONG: 42°40'15"E</div>
              </div>
              
              {/* Status Indicators */}
              <div className="absolute right-0 bottom-0 p-1 bg-gray-800/80 rounded-tl-md border-l border-t border-blue-600/50 text-xs">
                <div className="text-blue-300">GRID RES: 10m²</div>
              </div>
            </div>
            
            {/* Control Bar */}
            <div className="bg-gray-700 p-2 border-t border-blue-600 text-xs text-blue-300 flex justify-between">
              <div>MAP MODE: {activeMap.toUpperCase()}</div>
              <div>ACTIVE TOGGLES: {Object.values(visibleLayers).filter(Boolean).length}/{Object.keys(visibleLayers).length}</div>
            </div>
          </div>
          
          {/* Task Queue Window */}
          <div className="col-start-3 row-start-1 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
            <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
              <List size={18} className="text-blue-400" />
              <span className="font-bold">TASK QUEUE</span>
            </div>
            
            <div className="flex-1 p-2...
