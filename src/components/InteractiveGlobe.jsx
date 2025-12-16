import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import './InteractiveGlobe.css';

const InteractiveGlobe = ({ onZoomComplete }) => {
  const svgRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0); // 0 = globe, 1 = zoomed to Edinburgh
  const rotationRef = useRef([0, -55.9533, 0]); // Start centered on Edinburgh
  const projectionRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const sensitivity = 75;

    // Edinburgh coordinates
    const edinburgh = {
      name: 'Edinburgh',
      coordinates: [-3.1883, 55.9533]
    };

    console.log('Globe initialized, zoom level:', zoomLevel);

    // Clear previous SVG content completely
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    svg.attr('width', width)
      .attr('height', height);

    // Create gradient for ocean
    const defs = svg.append('defs');
    
    const oceanGradient = defs.append('radialGradient')
      .attr('id', 'ocean-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    oceanGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#d4e8e9')
      .attr('stop-opacity', 1);
    
    oceanGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#7da2a9')
      .attr('stop-opacity', 1);

    // Glow effect
    const filter = defs.append('filter')
      .attr('id', 'glow');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create main group for globe (ocean + graticule + countries together)
    const globeGroup = svg.append('g').attr('class', 'globe-group');

    // Projection setup
    const initialScale = Math.min(width, height) / 2.5;
    let projection = d3.geoOrthographic()
      .scale(initialScale)
      .center([0, 0])
      .rotate(rotationRef.current)
      .translate([width / 2, height / 2]);

    projectionRef.current = projection;
    let path = d3.geoPath().projection(projection);

    // Add ocean sphere to globe group
    globeGroup.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'ocean')
      .attr('d', path)
      .style('fill', 'url(#ocean-gradient)')
      .style('stroke', '#7da2a9')
      .style('stroke-width', '1.5px');

    // Add graticule (grid lines) to globe group
    const graticule = d3.geoGraticule().step([10, 10]);
    
    globeGroup.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', '#7da2a9')
      .style('stroke-width', '0.5px')
      .style('opacity', 0.3);

    // Load and render world data
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(world => {
        const countries = feature(world, world.objects.countries);

        // Draw countries in globe group
        globeGroup.append('g')
          .attr('class', 'countries')
          .selectAll('path')
          .data(countries.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('fill', '#ffffff')
          .style('stroke', '#7da2a9')
          .style('stroke-width', '0.5px')
          .style('opacity', 0.85)
          .on('mouseover', function() {
            d3.select(this)
              .style('fill', '#f7f7f7')
              .style('stroke-width', '1px');
          })
          .on('mouseout', function() {
            d3.select(this)
              .style('fill', '#ffffff')
              .style('stroke-width', '0.5px');
          });

        // Add Edinburgh marker with pulsing effect (separate from globe group)
        const edinburghMarker = svg.append('g')
          .attr('class', 'edinburgh-marker');

        // Outer pulse ring
        edinburghMarker.append('circle')
          .attr('class', 'pulse-ring')
          .attr('cx', projection(edinburgh.coordinates)[0])
          .attr('cy', projection(edinburgh.coordinates)[1])
          .attr('r', 20)
          .style('fill', 'none')
          .style('stroke', '#7da2a9')
          .style('stroke-width', '2px')
          .style('opacity', 0);

        // Main marker
        edinburghMarker.append('circle')
          .attr('cx', projection(edinburgh.coordinates)[0])
          .attr('cy', projection(edinburgh.coordinates)[1])
          .attr('r', 8)
          .style('fill', '#7da2a9')
          .style('stroke', '#fff')
          .style('stroke-width', '2px')
          .attr('filter', 'url(#glow)');

        // Inner dot
        edinburghMarker.append('circle')
          .attr('cx', projection(edinburgh.coordinates)[0])
          .attr('cy', projection(edinburgh.coordinates)[1])
          .attr('r', 3)
          .style('fill', '#fff')
          .style('opacity', 0.8);

        // Label
        edinburghMarker.append('text')
          .attr('x', projection(edinburgh.coordinates)[0])
          .attr('y', projection(edinburgh.coordinates)[1] - 15)
          .attr('text-anchor', 'middle')
          .style('fill', '#7da2a9')
          .style('font-size', '14px')
          .style('font-weight', '600')
          .style('text-shadow', '0 0 3px white, 0 0 3px white')
          .text(edinburgh.name);

        // Pulse animation
        function pulse() {
          edinburghMarker.select('.pulse-ring')
            .transition()
            .duration(2000)
            .attr('r', 30)
            .style('opacity', 0.6)
            .transition()
            .duration(0)
            .attr('r', 20)
            .style('opacity', 0)
            .on('end', pulse);
        }
        pulse();

        setIsLoading(false);
      });

    // Drag functionality
    const drag = d3.drag()
      .on('drag', (event) => {
        const rotate = rotationRef.current;
        const k = sensitivity / projection.scale();
        rotationRef.current = [
          rotate[0] + event.dx * k,
          rotate[1] - event.dy * k,
          rotate[2]
        ];
        projection.rotate(rotationRef.current);
        
        // Update globe-group paths
        svg.select('.globe-group').selectAll('path').attr('d', path);
        
        // Update Edinburgh marker position
        const coords = projection(edinburgh.coordinates);
        svg.selectAll('.edinburgh-marker circle')
          .attr('cx', coords[0])
          .attr('cy', coords[1]);
        svg.select('.edinburgh-marker text')
          .attr('x', coords[0])
          .attr('y', coords[1] - 15);
      });

    svg.call(drag);

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const currentScale = zoomLevel === 1 
        ? Math.min(newWidth, newHeight) / 2.5 * 8 
        : Math.min(newWidth, newHeight) / 2.5;
      
      svg.attr('width', newWidth).attr('height', newHeight);
      projection
        .scale(currentScale)
        .translate([newWidth / 2, newHeight / 2]);
      
      // Update globe-group paths
      svg.select('.globe-group').selectAll('path').attr('d', path);
      
      const coords = projection(edinburgh.coordinates);
      svg.selectAll('.edinburgh-marker circle')
        .attr('cx', coords[0])
        .attr('cy', coords[1]);
      svg.select('.edinburgh-marker text')
        .attr('x', coords[0])
        .attr('y', coords[1] - 15);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let hasScrolledManually = false;
    let scrollTimeout;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const triggerPoint = 100; // Reduced to 100px for quicker trigger
      
      // Mark as manually scrolled after a short delay
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        hasScrolledManually = true;
      }, 100);
      
      console.log('Scroll:', scrollTop, '/ Trigger:', triggerPoint, '/ ZoomLevel:', zoomLevel, '/ IsZooming:', isZooming);
      
      // Only allow zoom if user has manually scrolled
      if (!hasScrolledManually && scrollTop > 0) {
        console.log('⚠️ Ignoring scroll - not manual (likely from browser restore)');
        return;
      }
      
      // Zoom IN when scrolling down past trigger point
      if (scrollTop > triggerPoint && zoomLevel === 0 && !isZooming) {
        console.log('🎯 ZOOM IN TRIGGERED!');
        setIsZooming(true);
        
        const svg = d3.select(svgRef.current);
        const projection = projectionRef.current;
        if (!projection) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        const initialScale = Math.min(width, height) / 2.5;
        const targetScale = initialScale * 8;
        const duration = 1200; // Faster zoom - 1.2 seconds
        
        svg.on('.drag', null);
        
        svg.transition()
          .duration(duration)
          .tween('zoom', () => {
            const scaleInterpolate = d3.interpolate(initialScale, targetScale);
            return (t) => {
              const currentScale = scaleInterpolate(t);
              projection.scale(currentScale);
              const path = d3.geoPath().projection(projection);
              
              // Batch update all paths at once for synchronized animation
              const globeGroup = svg.select('.globe-group');
              const allPaths = globeGroup.selectAll('path');
              allPaths.each(function() {
                d3.select(this).attr('d', path);
              });
              
              const coords = projection([-3.1883, 55.9533]);
              svg.selectAll('.edinburgh-marker circle')
                .attr('cx', coords[0])
                .attr('cy', coords[1]);
              svg.select('.edinburgh-marker text')
                .attr('x', coords[0])
                .attr('y', coords[1] - 15);
              
              setZoomLevel(t);
            };
          })
          .on('end', () => {
            setIsZooming(false);
            setZoomLevel(1);
            console.log('✅ Zoom IN complete!');
            if (onZoomComplete) {
              onZoomComplete();
            }
          });
      }
      // Zoom OUT when scrolling back to top
      else if (scrollTop < 50 && zoomLevel === 1 && !isZooming) {
        console.log('🔙 ZOOM OUT TRIGGERED!');
        setIsZooming(true);
        
        const svg = d3.select(svgRef.current);
        const projection = projectionRef.current;
        if (!projection) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        const initialScale = Math.min(width, height) / 2.5;
        const targetScale = initialScale * 8;
        const duration = 1200; // Faster zoom out
        
        svg.transition()
          .duration(duration)
          .tween('zoom-out', () => {
            const scaleInterpolate = d3.interpolate(targetScale, initialScale);
            return (t) => {
              const currentScale = scaleInterpolate(t);
              projection.scale(currentScale);
              const path = d3.geoPath().projection(projection);
              
              // Batch update all paths at once for synchronized animation
              const globeGroup = svg.select('.globe-group');
              const allPaths = globeGroup.selectAll('path');
              allPaths.each(function() {
                d3.select(this).attr('d', path);
              });
              
              const coords = projection([-3.1883, 55.9533]);
              svg.selectAll('.edinburgh-marker circle')
                .attr('cx', coords[0])
                .attr('cy', coords[1]);
              svg.select('.edinburgh-marker text')
                .attr('x', coords[0])
                .attr('y', coords[1] - 15);
              
              setZoomLevel(1 - t);
            };
          })
          .on('end', () => {
            setIsZooming(false);
            setZoomLevel(0);
            console.log('✅ Zoom OUT complete!');
            
            // Re-enable drag after zoom out
            const drag = d3.drag()
              .on('drag', (event) => {
                const rotate = projection.rotate();
                const sensitivity = 0.5;
                projection.rotate([
                  rotate[0] + event.dx * sensitivity,
                  rotate[1] - event.dy * sensitivity,
                  rotate[2]
                ]);
                const path = d3.geoPath().projection(projection);
                
                // Update globe-group paths
                svg.select('.globe-group').selectAll('path').attr('d', path);
                
                const coords = projection([-3.1883, 55.9533]);
                svg.selectAll('.edinburgh-marker circle')
                  .attr('cx', coords[0])
                  .attr('cy', coords[1]);
                svg.select('.edinburgh-marker text')
                  .attr('x', coords[0])
                  .attr('y', coords[1] - 15);
              });
            
            svg.call(drag);
          });
      }
    };
    
    console.log('Adding scroll listener...');
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      console.log('Removing scroll listener...');
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [zoomLevel, isZooming, onZoomComplete]);

  return (
    <div className="interactive-globe-container">
      {isLoading && (
        <div className="globe-loader">
          <div className="loader-spinner"></div>
          <p>Loading Globe...</p>
        </div>
      )}
      <svg ref={svgRef} className="globe-svg"></svg>
      
      <div className="globe-controls">
        <div className="control-hint">
          <span className="hint-icon">{isZooming ? '⏳' : zoomLevel === 0 ? '🖱️' : '✓'}</span>
          <span>
            {isZooming 
              ? 'Zooming to Edinburgh...' 
              : zoomLevel === 0 
                ? 'Drag to rotate • Scroll down to zoom' 
                : 'Zoomed to Edinburgh'}
          </span>
        </div>
      </div>

      <div className="globe-info">
        <h1 className="globe-title">Edinburgh, Scotland</h1>
        <p className="globe-subtitle">Center of Climate Action & Public Health Innovation</p>
      </div>
    </div>
  );
};

export default InteractiveGlobe;
