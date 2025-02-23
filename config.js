const config = {
    // Default ports that will be tried first
    defaultBackendPort: 3001,
    defaultFrontendPort: 8080,
    
    // Port range to try if defaults are taken
    portRange: {
        min: 3000,
        max: 4000
    }
};

module.exports = config;
