import React, { useState } from 'react';
import { Map, Grid, AlertCircle, BarChart2, List, Layers, Moon, Satellite, Sliders, Terminal } from 'lucide-react';

const LunarControlModule = () => {
  const [activeMap, setActiveMap] = useState('grid');
  const [visibleLayers, setVisibleLayers] = useState({
    habitats: true,
    resources: true,
    vehicles: true,
    sensors: false,
    radiation: false,
  });
  
  const toggleLayer = (layer) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };
  
  const tasks = [
    { id: 1, priority: 'high', title: 'Oxygen level maintenance', status: 'in-progress', eta: '00:45:30' },
    { id: 2, priority: 'critical', title: 'Solar flare protection', status: 'pending', eta: '00:15:00' },
    { id: 3, priority: 'medium', title: 'Water recycling check', status: 'queued', eta: '01:30:00' },
    { id: 4, priority: 'low', title: 'Comms array alignment', status: 'queued', eta: '03:00:00' },
    { id: 5, priority: 'high', title: 'Power distribution balance', status: 'in-progress', eta: '00:50:00' },
  ];
  
  const mapElements = [
    { id: 'hab-1', type: 'habitat', location: [3, 2], status: 'operational' },
    { id: 'hab-2', type: 'habitat', location: [5, 3], status: 'operational' },
    { id: 'res-1', type: 'resource', location: [2, 4], status: 'extracting', resource: 'water' },
    { id: 'res-2', type: 'resource', location: [6, 6], status: 'scanning', resource: 'helium-3' },
    { id: 'veh-1', type: 'vehicle', location: [4, 5], status: 'moving', destination: 'hab-2' },
    { id: 'sen-1', type: 'sensor', location: [1, 1], status: 'active', reading: 'nominal' },
    { id: 'sen-2', type: 'sensor', location: [7, 2], status: 'active', reading: 'warning' },
  ];
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-blue-100 font-mono">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-blue-500 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Moon className="text-blue-400" size={24} />
          <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">LUNAR CONTROL MODULE</span>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span>SYSTEMS NOMINAL</span>
          </div>
          <div className="text-blue-300">MET: 128:45:22</div>
        </div>
      </div>
      
      {/* Main Content - Two Windows */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Multiple Windows */}
        <div className="flex-1 p-4 grid grid-cols-3 grid-rows-2 gap-4">
          {/* Map Window */}
          <div className="col-span-2 row-span-2 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
            <div className="bg-gray-700 p-2 border-b border-blue-600 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Map size={18} className="text-blue-400" />
                <span className="font-bold">LUNAR SURFACE MAPPING</span>
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
                        <div key={`${i}-${j}`} className="bg-gray-700 border border-blue-900/40 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-blue-500/30">{i},{j}</span>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Map Elements */}
                  {mapElements.map(element => {
                    const [x, y] = element.location;
                    const visible = (
                      (element.type === 'habitat' && visibleLayers.habitats) ||
                      (element.type === 'resource' && visibleLayers.resources) ||
                      (element.type === 'vehicle' && visibleLayers.vehicles) ||
                      (element.type === 'sensor' && visibleLayers.sensors)
                    );
                    
                    if (!visible) return null;
                    
                    let elementIcon;
                    let statusColor = "bg-green-500";
                    
                    if (element.status === 'warning' || element.reading === 'warning') {
                      statusColor = "bg-yellow-500";
                    }
                    
                    switch(element.type) {
                      case 'habitat':
                        elementIcon = <div className="text-cyan-400 bg-cyan-900/60 p-1 rounded-md flex items-center justify-center w-full h-full"><Grid size={16} /></div>;
                        break;
                      case 'resource':
                        elementIcon = <div className="text-green-400 bg-green-900/60 p-1 rounded-md flex items-center justify-center w-full h-full"><BarChart2 size={16} /></div>;
                        break;
                      case 'vehicle':
                        elementIcon = <div className="text-purple-400 bg-purple-900/60 p-1 rounded-md flex items-center justify-center w-full h-full"><Satellite size={16} /></div>;
                        break;
                      case 'sensor':
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
              <div>ACTIVE SENSORS: {Object.values(visibleLayers).filter(Boolean).length}/{Object.keys(visibleLayers).length}</div>
            </div>
          </div>
          
          {/* Task Queue Window */}
          <div className="bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
            <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
              <List size={18} className="text-blue-400" />
              <span className="font-bold">TASK QUEUE</span>
            </div>
            
            <div className="flex-1 p-2 overflow-y-auto">
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`p-2 rounded-md border text-xs ${
                      task.priority === 'critical' ? 'border-red-500 bg-red-900/30' : 
                      task.priority === 'high' ? 'border-orange-500 bg-orange-900/30' : 
                      task.priority === 'medium' ? 'border-yellow-500 bg-yellow-900/30' : 
                      'border-green-500 bg-green-900/30'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-blue-200">{task.title}</span>
                      <span className={`uppercase text-xs ${
                        task.priority === 'critical' ? 'text-red-400' : 
                        task.priority === 'high' ? 'text-orange-400' : 
                        task.priority === 'medium' ? 'text-yellow-400' : 
                        'text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-gray-400">
                      <span>Status: {task.status}</span>
                      <span>ETA: {task.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Map Index Window */}
          <div className="bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
            <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
              <Terminal size={18} className="text-blue-400" />
              <span className="font-bold">SURFACE INDEX</span>
            </div>
            
            <div className="flex-1 p-2 overflow-y-auto text-xs">
              <div className="space-y-3">
                <div>
                  <div className="font-bold text-blue-300 border-b border-blue-600/50 pb-1 mb-1">HABITATS</div>
                  <div className="pl-2 space-y-1">
                    <div className="flex justify-between">
                      <span>HAB-1</span>
                      <span className="text-green-400">OPERATIONAL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HAB-2</span>
                      <span className="text-green-400">OPERATIONAL</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-blue-300 border-b border-blue-600/50 pb-1 mb-1">RESOURCES</div>
                  <div className="pl-2 space-y-1">
                    <div className="flex justify-between">
                      <span>RES-1 (WATER)</span>
                      <span className="text-blue-400">EXTRACTING</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RES-2 (HE-3)</span>
                      <span className="text-yellow-400">SCANNING</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-blue-300 border-b border-blue-600/50 pb-1 mb-1">VEHICLES</div>
                  <div className="pl-2 space-y-1">
                    <div className="flex justify-between">
                      <span>VEH-1</span>
                      <span className="text-purple-400">MOVING → HAB-2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Layer Toggler Window */}
          <div className="bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
            <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
              <Layers size={18} className="text-blue-400" />
              <span className="font-bold">LAYER CONTROL</span>
            </div>
            
            <div className="flex-1 p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Grid size={16} className="text-cyan-400" />
                    <span className="text-sm">Habitats</span>
                  </div>
                  <button 
                    onClick={() => toggleLayer('habitats')}
                    className={`w-10 h-5 rounded-full p-1 ${visibleLayers.habitats ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200 relative`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${visibleLayers.habitats ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart2 size={16} className="text-green-400" />
                    <span className="text-sm">Resources</span>
                  </div>
                  <button 
                    onClick={() => toggleLayer('resources')}
                    className={`w-10 h-5 rounded-full p-1 ${visibleLayers.resources ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200 relative`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${visibleLayers.resources ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Satellite size={16} className="text-purple-400" />
                    <span className="text-sm">Vehicles</span>
                  </div>
                  <button 
                    onClick={() => toggleLayer('vehicles')}
                    className={`w-10 h-5 rounded-full p-1 ${visibleLayers.vehicles ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200 relative`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${visibleLayers.vehicles ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} className="text-yellow-400" />
                    <span className="text-sm">Sensors</span>
                  </div>
                  <button 
                    onClick={() => toggleLayer('sensors')}
                    className={`w-10 h-5 rounded-full p-1 ${visibleLayers.sensors ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200 relative`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${visibleLayers.sensors ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sliders size={16} className="text-red-400" />
                    <span className="text-sm">Radiation</span>
                  </div>
                  <button 
                    onClick={() => toggleLayer('radiation')}
                    className={`w-10 h-5 rounded-full p-1 ${visibleLayers.radiation ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200 relative`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${visibleLayers.radiation ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Secondary Window */}
        <div className="w-64 border-l border-blue-600 bg-gray-800 flex flex-col">
          <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-center">
            <span className="font-bold">SYSTEM CONTROL</span>
          </div>
          
          {/* System Status */}
          <div className="p-3 border-b border-blue-600/50">
            <div className="text-sm font-bold text-blue-300 mb-2">SYSTEM STATUS</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Power</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>92%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Oxygen</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>97%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Water</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                  <span>63%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Communications</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>Online</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Thermal</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>Nominal</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Alerts */}
          <div className="p-3 border-b border-blue-600/50">
            <div className="text-sm font-bold text-blue-300 mb-2">RECENT ALERTS</div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-yellow-900/30 border border-yellow-600 rounded-md">
                <div className="font-bold">Low Water Warning</div>
                <div className="text-gray-300">Tank level below 65%</div>
                <div className="text-gray-400 text-xs">12:45:22</div>
              </div>
              <div className="p-2 bg-red-900/30 border border-red-600 rounded-md">
                <div className="font-bold">Solar Flare Alert</div>
                <div className="text-gray-300">ETA: 15 minutes</div>
                <div className="text-gray-400 text-xs">12:30:07</div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="p-3">
            <div className="text-sm font-bold text-blue-300 mb-2">QUICK ACTIONS</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
                <Satellite size={16} className="mb-1" />
                <span>Deploy Comms</span>
              </button>
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
                <AlertCircle size={16} className="mb-1" />
                <span>Emergency</span>
              </button>
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
                <Grid size={16} className="mb-1" />
                <span>Habitat Control</span>
              </button>
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
                <Map size={16} className="mb-1" />
                <span>Survey</span>
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-auto p-3 text-xs text-gray-500">
            <div className="text-center">LUNAR BASE ALPHA</div>
            <div className="text-center">LCM v2.3.1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LunarControlModule;