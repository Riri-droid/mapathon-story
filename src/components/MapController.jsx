/**
 * MapController.jsx
 * Mapbox GL JS controller with 3D terrain and smooth transitions
 */

import { useEffect, useRef, useState, memo } from 'react'
import mapboxgl from 'mapbox-gl'
import './MapController.css'

// Mapbox access token - replace with your own token
// Get one free at: https://account.mapbox.com/
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94LWRlbW8iLCJhIjoiY2xvMnM5dGF2MDFsMjJrcXM4ZHJxNjQ0NSJ9.VPIxTg4B9TY_MQp6LGTSXw'

const MapController = memo(({ 
  config, 
  onMapLoad, 
  interactive = false,
  style = 'mapbox://styles/mapbox/satellite-v9',
  showTerrain = false,
  showAravalliHighlight = false,
  showElevationColors = false,
  showDesertBarrier = false,
  showMiningZones = false,
  showDesertExpansion = false,
  showFutureScenarios = false,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (map.current) return // Initialize only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: config.center,
      zoom: config.zoom,
      pitch: config.pitch || 0,
      bearing: config.bearing || 0,
      interactive: interactive,
      attributionControl: true,
      antialias: true,
      fadeDuration: 300,
      projection: 'globe', // Globe view for cinematic effect
    })

    map.current.on('load', () => {
      setIsLoaded(true)
      
      // Add atmosphere for globe effect
      map.current.setFog({
        color: 'rgb(10, 10, 20)',
        'high-color': 'rgb(20, 30, 50)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(5, 5, 15)',
        'star-intensity': 0.6
      })

      // Add India country border with GeoJSON
      map.current.addSource('india-border-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [68.176645, 35.484696], // Kashmir
              [73.876903, 35.714745], // Kashmir East
              [78.912269, 34.321936], // Ladakh
              [79.266869, 32.990236], // Himachal
              [78.738895, 30.082156], // Uttarakhand
              [88.043133, 27.445818], // Sikkim/Bengal
              [88.896256, 26.414615], // Assam
              [92.033484, 26.835840], // Arunachal
              [97.395555, 28.335945], // Arunachal East
              [97.402561, 27.882536], // Upper Assam
              [96.419366, 27.264589], // Nagaland
              [95.124768, 26.573572], // Manipur
              [93.413348, 24.240014], // Mizoram
              [92.672721, 22.041238], // Tripura
              [91.569410, 23.502501], // Bangladesh Border
              [88.863049, 25.299534], // West Bengal
              [88.084422, 24.501657], // Bangladesh Border
              [88.209789, 21.629161], // West Bengal South
              [86.975704, 20.295262], // Odisha
              [84.663592, 19.476950], // Odisha West
              [82.192792, 17.016636], // Chhattisgarh
              [80.286043, 15.893551], // Andhra Pradesh
              [77.547425, 13.344225], // Karnataka
              [76.767871, 11.607148], // Tamil Nadu
              [77.250445, 8.076597],  // Kerala South
              [76.271186, 9.417850],  // Kerala West
              [73.653566, 9.931640],  // Karnataka Coast
              [72.711091, 19.099078], // Maharashtra
              [68.842167, 23.732050], // Gujarat
              [68.204999, 24.267234], // Gujarat North
              [69.649252, 25.264135], // Rajasthan
              [70.501689, 27.296381], // Rajasthan West
              [71.045094, 29.074408], // Punjab
              [73.029861, 30.368179], // Punjab East
              [75.068535, 32.487682], // Himachal
              [73.922677, 34.029357], // Kashmir South
              [68.176645, 35.484696]  // Close
            ]]
          }
        }
      })

      map.current.addLayer({
        id: 'india-country-fill',
        type: 'fill',
        source: 'india-border-source',
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0
        }
      })

      map.current.addLayer({
        id: 'india-country-outline',
        type: 'line',
        source: 'india-border-source',
        paint: {
          'line-color': '#ffff00',
          'line-width': 5,
          'line-opacity': 1
        }
      })

      // Add state boundaries using admin boundaries
      if (!map.current.getSource('state-boundaries')) {
        map.current.addSource('state-boundaries', {
          type: 'vector',
          url: 'mapbox://mapbox.boundaries-adm1-v4'
        })
      }

      map.current.addLayer({
        id: 'state-borders',
        type: 'line',
        source: 'state-boundaries',
        'source-layer': 'boundaries_admin_1',
        filter: ['==', ['get', 'iso_3166_1'], 'IN'],
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })

      if (onMapLoad) onMapLoad()
    })

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Handle terrain toggle
  useEffect(() => {
    if (!map.current || !isLoaded) return

    if (showTerrain) {
      // Add terrain source if it doesn't exist
      if (!map.current.getSource('mapbox-dem')) {
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        })
      }
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 })
    } else {
      map.current.setTerrain(null)
    }
  }, [showTerrain, isLoaded])

  // Handle elevation colors
  useEffect(() => {
    if (!map.current || !isLoaded) return

    if (showElevationColors) {
      // Add DEM source
      if (!map.current.getSource('mapbox-dem')) {
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        })
      }

      // Add subtle hillshade
      if (!map.current.getLayer('elevation-hillshade')) {
        map.current.addLayer({
          id: 'elevation-hillshade',
          type: 'hillshade',
          source: 'mapbox-dem',
          paint: {
            'hillshade-exaggeration': 0.5,
            'hillshade-shadow-color': '#444444',
            'hillshade-highlight-color': '#ffffff',
            'hillshade-illumination-direction': 315
          }
        })
      }

      // Add distinct elevation color zones with accurate Aravalli geography
      if (!map.current.getSource('elevation-zones')) {
        map.current.addSource('elevation-zones', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              // Peak zone - Guru Shikhar at Mount Abu (1500-1722m) - ACCURATE LOCATION
              {
                type: 'Feature',
                properties: { color: '#8B0000' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [72.76, 24.68], [72.80, 24.68], [72.80, 24.62], [72.76, 24.62], [72.76, 24.68]
                  ]]
                }
              },
              // High peaks (1000-1500m) - Southern Rajasthan highlands around Mount Abu
              {
                type: 'Feature',
                properties: { color: '#DC143C' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [72.6, 24.9], [73.0, 24.9], [73.2, 24.7], [73.3, 24.5], [73.1, 24.3],
                    [72.8, 24.2], [72.5, 24.3], [72.4, 24.6], [72.6, 24.9]
                  ]]
                }
              },
              // Medium elevation (700-1000m) - Central Aravalli belt (Sirohi to Udaipur)
              {
                type: 'Feature',
                properties: { color: '#FF6347' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [72.3, 25.5], [73.5, 25.5], [73.8, 25.2], [74.0, 24.8], [73.8, 24.4],
                    [73.5, 24.1], [73.0, 24.0], [72.4, 24.1], [72.2, 24.5], [72.1, 25.0], [72.3, 25.5]
                  ]]
                }
              },
              // Low hills (400-700m) - Ajmer to Jaipur region
              {
                type: 'Feature',
                properties: { color: '#FFA500' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [72.0, 26.5], [74.5, 26.5], [75.0, 26.2], [75.3, 25.8], [75.2, 25.3],
                    [74.8, 24.7], [74.3, 24.3], [73.7, 24.0], [73.0, 23.9], [72.2, 24.0],
                    [72.0, 24.8], [72.0, 26.5]
                  ]]
                }
              },
              // Foothills (200-400m) - Alwar, Rewari to Delhi NCR region
              {
                type: 'Feature',
                properties: { color: '#FFD700' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [77.2, 28.7], [76.8, 28.5], [76.5, 28.2], [76.2, 27.8], [75.8, 27.3],
                    [75.4, 26.8], [75.0, 26.5], [74.6, 26.0], [74.2, 25.5], [73.8, 25.0],
                    [73.4, 24.6], [73.0, 24.3], [72.6, 24.2], [72.3, 24.1], [72.0, 24.2],
                    [72.0, 25.5], [72.0, 27.0], [72.3, 27.8], [72.7, 28.2], [73.5, 28.4],
                    [74.5, 28.5], [75.5, 28.6], [76.5, 28.7], [77.2, 28.7]
                  ]]
                }
              }
            ]
          }
        })
      }

      if (!map.current.getLayer('elevation-fill')) {
        map.current.addLayer({
          id: 'elevation-fill',
          type: 'fill',
          source: 'elevation-zones',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.55
          }
        })
      }

      // Show layers
      if (map.current.getLayer('elevation-hillshade')) {
        map.current.setLayoutProperty('elevation-hillshade', 'visibility', 'visible')
      }
      if (map.current.getLayer('elevation-fill')) {
        map.current.setLayoutProperty('elevation-fill', 'visibility', 'visible')
      }
    } else {
      // Hide layers
      if (map.current.getLayer('elevation-hillshade')) {
        map.current.setLayoutProperty('elevation-hillshade', 'visibility', 'none')
      }
      if (map.current.getLayer('elevation-fill')) {
        map.current.setLayoutProperty('elevation-fill', 'visibility', 'none')
      }
    }
  }, [showElevationColors, isLoaded])

  // Handle desert barrier visualization
  useEffect(() => {
    if (!map.current || !isLoaded) return

    if (showDesertBarrier) {
      // Add Thar Desert region (west of Aravalli)
      if (!map.current.getSource('thar-desert')) {
        map.current.addSource('thar-desert', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: 'Thar Desert' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [68.0, 29.0],   // Northwest corner
                [72.0, 29.0],   // Northeast - meets Aravalli
                [72.0, 28.5],
                [72.3, 27.8],
                [72.5, 26.8],
                [72.4, 25.8],
                [72.3, 24.8],
                [72.0, 24.0],   // Southeast - meets Aravalli
                [69.5, 24.0],   // Southwest corner
                [68.0, 25.0],
                [68.0, 29.0]    // Close
              ]]
            }
          }
        })

        // Desert fill with sandy yellow
        map.current.addLayer({
          id: 'desert-fill',
          type: 'fill',
          source: 'thar-desert',
          paint: {
            'fill-color': '#EDC967',
            'fill-opacity': 0.5
          }
        })

        // Desert border
        map.current.addLayer({
          id: 'desert-border',
          type: 'line',
          source: 'thar-desert',
          paint: {
            'line-color': '#D4A574',
            'line-width': 3,
            'line-opacity': 0.8
          }
        })

        // Desert label
        map.current.addLayer({
          id: 'desert-label',
          type: 'symbol',
          source: 'thar-desert',
          layout: {
            'text-field': 'THAR DESERT',
            'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            'text-size': 20,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.3
          },
          paint: {
            'text-color': '#D4A574',
            'text-halo-color': '#000000',
            'text-halo-width': 2
          }
        })
      }

      // Add green/fertile region (east of Aravalli) - protected zone
      if (!map.current.getSource('protected-zone')) {
        map.current.addSource('protected-zone', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: 'Protected Region' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [77.2, 28.7],   // Delhi NCR
                [77.5, 28.5],
                [77.8, 27.5],
                [77.5, 26.0],
                [77.0, 24.5],
                [76.0, 24.0],
                [75.0, 24.0],   // Meets Aravalli
                [74.5, 24.5],
                [74.0, 25.0],
                [73.8, 26.0],
                [74.0, 27.0],
                [75.0, 28.0],
                [76.0, 28.5],
                [77.2, 28.7]    // Close
              ]]
            }
          }
        })

        // Protected zone with green tint
        map.current.addLayer({
          id: 'protected-fill',
          type: 'fill',
          source: 'protected-zone',
          paint: {
            'fill-color': '#90EE90',
            'fill-opacity': 0.3
          }
        })

        // Protected zone label
        map.current.addLayer({
          id: 'protected-label',
          type: 'symbol',
          source: 'protected-zone',
          layout: {
            'text-field': 'PROTECTED FERTILE ZONE',
            'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            'text-size': 16,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.2
          },
          paint: {
            'text-color': '#2E7D32',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 2
          }
        })
      }

      // Show all desert barrier layers
      ['desert-fill', 'desert-border', 'desert-label', 'protected-fill', 'protected-label'].forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, 'visibility', 'visible')
        }
      })
    } else {
      // Hide all desert barrier layers
      ['desert-fill', 'desert-border', 'desert-label', 'protected-fill', 'protected-label'].forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, 'visibility', 'none')
        }
      })
    }
  }, [showDesertBarrier, isLoaded])

  // Handle mining zones and deforestation visualization
  useEffect(() => {
    if (!map.current || !isLoaded) return

    if (showMiningZones) {
      // Add mining sites
      if (!map.current.getSource('mining-sites')) {
        map.current.addSource('mining-sites', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', properties: { name: 'Alwar Mining Belt', type: 'Marble/Granite', status: 'Illegal' }, geometry: { type: 'Point', coordinates: [76.6, 27.5] } },
              { type: 'Feature', properties: { name: 'Rajsamand Quarries', type: 'Marble', status: 'Illegal' }, geometry: { type: 'Point', coordinates: [73.9, 25.1] } },
              { type: 'Feature', properties: { name: 'Faridabad Mines', type: 'Stone', status: 'Active' }, geometry: { type: 'Point', coordinates: [77.3, 28.4] } },
              { type: 'Feature', properties: { name: 'Udaipur Mining', type: 'Zinc/Lead', status: 'Active' }, geometry: { type: 'Point', coordinates: [73.7, 24.6] } },
              { type: 'Feature', properties: { name: 'Ajmer Quarries', type: 'Limestone', status: 'Illegal' }, geometry: { type: 'Point', coordinates: [74.6, 26.4] } },
              { type: 'Feature', properties: { name: 'Jaipur Belt', type: 'Sandstone', status: 'Active' }, geometry: { type: 'Point', coordinates: [75.8, 26.9] } }
            ]
          }
        })

        map.current.addLayer({
          id: 'mining-circles',
          type: 'circle',
          source: 'mining-sites',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 6, 8, 16],
            'circle-color': ['match', ['get', 'status'], 'Illegal', '#ef4444', '#f59e0b'],
            'circle-opacity': 0.7,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        })

        map.current.addLayer({
          id: 'mining-labels',
          type: 'symbol',
          source: 'mining-sites',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 11,
            'text-offset': [0, 1.5],
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 2
          }
        })
      }

      // Add deforestation zones
      if (!map.current.getSource('deforestation-zones')) {
        map.current.addSource('deforestation-zones', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { loss: 'High' },
                geometry: { type: 'Polygon', coordinates: [[[76.2, 27.8], [76.8, 27.8], [76.8, 27.2], [76.2, 27.2], [76.2, 27.8]]] }
              },
              {
                type: 'Feature',
                properties: { loss: 'High' },
                geometry: { type: 'Polygon', coordinates: [[[73.8, 25.3], [74.3, 25.3], [74.3, 24.8], [73.8, 24.8], [73.8, 25.3]]] }
              },
              {
                type: 'Feature',
                properties: { loss: 'Medium' },
                geometry: { type: 'Polygon', coordinates: [[[74.4, 26.7], [75.1, 26.7], [75.1, 26.1], [74.4, 26.1], [74.4, 26.7]]] }
              },
              {
                type: 'Feature',
                properties: { loss: 'Medium' },
                geometry: { type: 'Polygon', coordinates: [[[75.5, 27.2], [76.1, 27.2], [76.1, 26.6], [75.5, 26.6], [75.5, 27.2]]] }
              }
            ]
          }
        })

        map.current.addLayer({
          id: 'deforestation-fill',
          type: 'fill',
          source: 'deforestation-zones',
          paint: {
            'fill-color': ['match', ['get', 'loss'], 'High', '#8B4513', '#CD853F'],
            'fill-opacity': 0.45
          }
        })

        map.current.addLayer({
          id: 'deforestation-border',
          type: 'line',
          source: 'deforestation-zones',
          paint: {
            'line-color': ['match', ['get', 'loss'], 'High', '#654321', '#8B7355'],
            'line-width': 2,
            'line-dasharray': [3, 2],
            'line-opacity': 0.8
          }
        })
      }

      // Show layers
      ['mining-circles', 'mining-labels', 'deforestation-fill', 'deforestation-border'].forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, 'visibility', 'visible')
        }
      })
    } else {
      // Hide layers
      ['mining-circles', 'mining-labels', 'deforestation-fill', 'deforestation-border'].forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, 'visibility', 'none')
        }
      })
    }
  }, [showMiningZones, isLoaded])

  // Handle Aravalli highlight
  useEffect(() => {
    if (!map.current || !isLoaded) return

    // Aravalli polygon coordinates - Complete 692km range from Delhi to Gujarat
    const aravalliPolygon = {
      type: 'Feature',
      properties: { name: 'Aravalli Range' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.2, 28.7],   // Delhi NCR (North)
          [76.8, 28.5],   // Gurgaon
          [76.6, 28.0],   // Alwar region
          [76.3, 27.5],   // Alwar-Jaipur
          [75.8, 27.0],   // Jaipur East
          [75.5, 26.5],   // Jaipur South
          [75.0, 26.0],   // Ajmer region
          [74.6, 25.5],   // Ajmer-Udaipur
          [74.0, 25.0],   // Rajsamand
          [73.7, 24.6],   // Mount Abu (Guru Shikhar peak)
          [73.3, 24.3],   // Abu Road
          [73.0, 24.2],   // Gujarat border
          [72.5, 24.0],   // Palanpur (South end)
          [72.3, 24.5],   // Southwest
          [72.0, 25.0],   // West slope
          [72.0, 26.0],   // Sirohi West
          [72.2, 26.8],   // Jodhpur region
          [72.5, 27.5],   // Pali region
          [73.0, 28.0],   // Nagaur
          [73.8, 28.3],   // Jhunjhunu
          [75.0, 28.5],   // Rewari
          [76.0, 28.7],   // Mahendragarh
          [77.2, 28.7]    // Close at Delhi
        ]]
      }
    }

    if (showAravalliHighlight) {
      // Add source if doesn't exist
      if (!map.current.getSource('aravalli-highlight')) {
        map.current.addSource('aravalli-highlight', {
          type: 'geojson',
          data: aravalliPolygon
        })

        // Add fill layer
        map.current.addLayer({
          id: 'aravalli-fill',
          type: 'fill',
          source: 'aravalli-highlight',
          paint: {
            'fill-color': '#4ade80',
            'fill-opacity': 0.3
          }
        })

        // Add outline layer
        map.current.addLayer({
          id: 'aravalli-outline',
          type: 'line',
          source: 'aravalli-highlight',
          paint: {
            'line-color': '#4ade80',
            'line-width': 4,
            'line-opacity': 0.9
          }
        })

        // Add label
        map.current.addLayer({
          id: 'aravalli-label',
          type: 'symbol',
          source: 'aravalli-highlight',
          layout: {
            'text-field': 'ARAVALLI HILLS',
            'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            'text-size': 24,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.3
          },
          paint: {
            'text-color': '#4ade80',
            'text-halo-color': '#000000',
            'text-halo-width': 2
          }
        })
      } else {
        // Show layers
        map.current.setLayoutProperty('aravalli-fill', 'visibility', 'visible')
        map.current.setLayoutProperty('aravalli-outline', 'visibility', 'visible')
        map.current.setLayoutProperty('aravalli-label', 'visibility', 'visible')
      }
    } else {
      // Hide layers if they exist
      if (map.current.getLayer('aravalli-fill')) {
        map.current.setLayoutProperty('aravalli-fill', 'visibility', 'none')
      }
      if (map.current.getLayer('aravalli-outline')) {
        map.current.setLayoutProperty('aravalli-outline', 'visibility', 'none')
      }
      if (map.current.getLayer('aravalli-label')) {
        map.current.setLayoutProperty('aravalli-label', 'visibility', 'none')
      }
    }
  }, [showAravalliHighlight, isLoaded])

  // Handle style changes
  useEffect(() => {
    if (!map.current || !isLoaded) return
    if (map.current.getStyle().sprite !== style) {
      map.current.setStyle(style)
    }
  }, [style, isLoaded])

  // Handle config changes - smooth camera transitions
  useEffect(() => {
    if (!map.current || !isLoaded) return

    const currentCenter = map.current.getCenter()
    const currentZoom = map.current.getZoom()
    const currentPitch = map.current.getPitch()
    const currentBearing = map.current.getBearing()

    // Check if any config has actually changed
    const centerChanged = Math.abs(currentCenter.lng - config.center[0]) > 0.01 || 
                         Math.abs(currentCenter.lat - config.center[1]) > 0.01
    const zoomChanged = Math.abs(currentZoom - config.zoom) > 0.1
    const pitchChanged = Math.abs(currentPitch - (config.pitch || 0)) > 1
    const bearingChanged = Math.abs(currentBearing - (config.bearing || 0)) > 1

    if (centerChanged || zoomChanged || pitchChanged || bearingChanged) {
      const transitionOptions = {
        center: config.center,
        zoom: config.zoom,
        pitch: config.pitch || 0,
        bearing: config.bearing || 0,
        duration: 2000,
        essential: true,
        easing: (t) => {
          return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2
        }
      }

      map.current.flyTo(transitionOptions)
    }
  }, [config.center, config.zoom, config.pitch, config.bearing, isLoaded])

  // Desert Expansion Simulation
  useEffect(() => {
    if (!map.current || !isLoaded) return

    if (showDesertExpansion) {
      // Current Thar Desert baseline (2024)
      const currentDesert = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [70.0, 24.5], [71.5, 24.5], [72.5, 25.0],
            [73.0, 26.0], [73.0, 27.5], [72.0, 28.5],
            [71.0, 29.0], [70.0, 29.0], [69.0, 27.5],
            [69.0, 25.0], [70.0, 24.5]
          ]]
        },
        properties: { year: '2024', severity: 'current' }
      }

      // 2035 Projection - Initial spread
      const expansion2035 = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [73.0, 24.8], [74.2, 25.2], [74.8, 26.0],
            [75.0, 27.2], [74.5, 28.3], [73.5, 29.0],
            [73.0, 28.5], [73.0, 26.0], [73.0, 24.8]
          ]]
        },
        properties: { year: '2035', severity: 'moderate' }
      }

      // 2050 Projection - Significant spread
      const expansion2050 = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [74.8, 24.5], [76.0, 25.0], [76.8, 26.0],
            [77.2, 27.5], [76.5, 28.8], [75.5, 29.5],
            [74.5, 29.0], [74.0, 27.5], [74.8, 24.5]
          ]]
        },
        properties: { year: '2050', severity: 'severe' }
      }

      // 2070 Projection - Critical expansion
      const expansion2070 = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [76.8, 24.2], [78.0, 24.8], [78.8, 26.0],
            [79.0, 27.8], [78.2, 29.2], [77.0, 30.0],
            [76.0, 29.5], [75.5, 28.0], [76.8, 24.2]
          ]]
        },
        properties: { year: '2070', severity: 'critical' }
      }

      map.current.addSource('desert-expansion', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [currentDesert, expansion2035, expansion2050, expansion2070]
        }
      })

      // Current desert (baseline)
      map.current.addLayer({
        id: 'desert-current',
        type: 'fill',
        source: 'desert-expansion',
        filter: ['==', ['get', 'year'], '2024'],
        paint: {
          'fill-color': '#D2B48C',
          'fill-opacity': 0.6
        }
      })

      // 2035 expansion zone
      map.current.addLayer({
        id: 'desert-2035',
        type: 'fill',
        source: 'desert-expansion',
        filter: ['==', ['get', 'year'], '2035'],
        paint: {
          'fill-color': '#E8C468',
          'fill-opacity': 0.5
        }
      })

      // 2050 expansion zone
      map.current.addLayer({
        id: 'desert-2050',
        type: 'fill',
        source: 'desert-expansion',
        filter: ['==', ['get', 'year'], '2050'],
        paint: {
          'fill-color': '#DAA520',
          'fill-opacity': 0.45
        }
      })

      // 2070 expansion zone
      map.current.addLayer({
        id: 'desert-2070',
        type: 'fill',
        source: 'desert-expansion',
        filter: ['==', ['get', 'year'], '2070'],
        paint: {
          'fill-color': '#B8860B',
          'fill-opacity': 0.4
        }
      })

      // Borders for all zones
      map.current.addLayer({
        id: 'desert-expansion-borders',
        type: 'line',
        source: 'desert-expansion',
        paint: {
          'line-color': '#8B4513',
          'line-width': 2,
          'line-dasharray': [3, 2]
        }
      })

      // Add year labels
      map.current.addLayer({
        id: 'desert-expansion-labels',
        type: 'symbol',
        source: 'desert-expansion',
        layout: {
          'text-field': ['get', 'year'],
          'text-size': 16,
          'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold']
        },
        paint: {
          'text-color': '#FFFFFF',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      })

    } else {
      // Remove layers when not showing
      const layers = [
        'desert-current',
        'desert-2035',
        'desert-2050',
        'desert-2070',
        'desert-expansion-borders',
        'desert-expansion-labels'
      ]
      
      layers.forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId)
        }
      })

      if (map.current.getSource('desert-expansion')) {
        map.current.removeSource('desert-expansion')
      }
    }
  }, [showDesertExpansion, isLoaded])

  // Future Scenarios - Conservation vs Collapse
  useEffect(() => {
    if (!map.current || !isLoaded) return

    if (showFutureScenarios) {
      // Conservation Success Scenario (left/north side)
      const conservationZones = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { scenario: 'Conservation', status: 'Restored Forest', percentage: '85%' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [73.0, 27.0], [74.5, 27.5], [75.5, 28.0],
                [76.0, 28.5], [75.5, 29.0], [74.5, 28.8],
                [73.5, 28.0], [73.0, 27.0]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { scenario: 'Conservation', status: 'Protected Zones', percentage: '70%' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [73.5, 25.5], [75.0, 26.0], [76.0, 26.5],
                [76.5, 27.0], [75.5, 27.2], [74.5, 26.8],
                [73.8, 26.0], [73.5, 25.5]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { scenario: 'Conservation', status: 'Reforestation', percentage: '60%' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [73.0, 24.0], [74.5, 24.5], [75.5, 25.0],
                [75.8, 25.5], [75.0, 25.8], [74.0, 25.5],
                [73.2, 24.8], [73.0, 24.0]
              ]]
            }
          }
        ]
      }

      // Collapse Scenario (right/south side)
      const collapseZones = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { scenario: 'Collapse', status: 'Severe Degradation', percentage: '80%' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [76.5, 27.0], [77.5, 27.2], [78.0, 27.8],
                [77.8, 28.5], [77.0, 28.3], [76.5, 27.8],
                [76.5, 27.0]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { scenario: 'Collapse', status: 'Vegetation Loss', percentage: '60%' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [76.0, 25.5], [77.0, 25.8], [77.8, 26.5],
                [77.5, 27.0], [76.8, 26.8], [76.2, 26.2],
                [76.0, 25.5]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { scenario: 'Collapse', status: 'Desertification', percentage: '90%' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [76.5, 24.0], [77.5, 24.3], [78.0, 25.0],
                [77.8, 25.5], [77.0, 25.3], [76.7, 24.8],
                [76.5, 24.0]
              ]]
            }
          }
        ]
      }

      // Add conservation zones
      map.current.addSource('conservation-zones', {
        type: 'geojson',
        data: conservationZones
      })

      map.current.addLayer({
        id: 'conservation-fill',
        type: 'fill',
        source: 'conservation-zones',
        paint: {
          'fill-color': [
            'match',
            ['get', 'status'],
            'Restored Forest', '#22c55e',
            'Protected Zones', '#4ade80',
            'Reforestation', '#86efac',
            '#10b981'
          ],
          'fill-opacity': 0.6
        }
      })

      map.current.addLayer({
        id: 'conservation-borders',
        type: 'line',
        source: 'conservation-zones',
        paint: {
          'line-color': '#16a34a',
          'line-width': 2
        }
      })

      map.current.addLayer({
        id: 'conservation-labels',
        type: 'symbol',
        source: 'conservation-zones',
        layout: {
          'text-field': ['concat', ['get', 'status'], '\n', ['get', 'percentage']],
          'text-size': 12,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold']
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#065f46',
          'text-halo-width': 2
        }
      })

      // Add collapse zones
      map.current.addSource('collapse-zones', {
        type: 'geojson',
        data: collapseZones
      })

      map.current.addLayer({
        id: 'collapse-fill',
        type: 'fill',
        source: 'collapse-zones',
        paint: {
          'fill-color': [
            'match',
            ['get', 'status'],
            'Severe Degradation', '#dc2626',
            'Vegetation Loss', '#f97316',
            'Desertification', '#78350f',
            '#ef4444'
          ],
          'fill-opacity': 0.6
        }
      })

      map.current.addLayer({
        id: 'collapse-borders',
        type: 'line',
        source: 'collapse-zones',
        paint: {
          'line-color': '#991b1b',
          'line-width': 2
        }
      })

      map.current.addLayer({
        id: 'collapse-labels',
        type: 'symbol',
        source: 'collapse-zones',
        layout: {
          'text-field': ['concat', ['get', 'status'], '\n', ['get', 'percentage']],
          'text-size': 12,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold']
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#7f1d1d',
          'text-halo-width': 2
        }
      })

      // Add dividing line between scenarios
      map.current.addSource('scenario-divider', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [76.2, 24.0],
              [76.3, 29.0]
            ]
          }
        }
      })

      map.current.addLayer({
        id: 'scenario-divider-line',
        type: 'line',
        source: 'scenario-divider',
        paint: {
          'line-color': '#ffffff',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      })

    } else {
      // Remove layers when not showing
      const layers = [
        'conservation-fill',
        'conservation-borders',
        'conservation-labels',
        'collapse-fill',
        'collapse-borders',
        'collapse-labels',
        'scenario-divider-line'
      ]
      
      layers.forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId)
        }
      })

      const sources = ['conservation-zones', 'collapse-zones', 'scenario-divider']
      sources.forEach(sourceId => {
        if (map.current.getSource(sourceId)) {
          map.current.removeSource(sourceId)
        }
      })
    }
  }, [showFutureScenarios, isLoaded])

  return (
    <div className="map-controller">
      <div ref={mapContainer} className="mapbox-container" />
      {!isLoaded && (
        <div className="map-loading">
          <div className="map-loading-spinner"></div>
        </div>
      )}
    </div>
  )
})

MapController.displayName = 'MapController'

export default MapController
