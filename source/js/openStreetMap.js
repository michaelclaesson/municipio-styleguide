import L from 'leaflet';
import 'leaflet.markercluster';
import ShowPost from './openstreetmap/showPost';
import ZoomMarkerClick from './openstreetmap/zoomMarkerClick';
import { createMarkerElementPairs, setParams, getParams, zoomToMarker } from './openstreetmap/helpers/osmHelpers';

class OpenStreetMap {
    constructor(container) {
        this.container = container;
        let map = false;
        let id = this.container.getAttribute('data-js-map-id') ?? false;
        this.markers = false;

        if (this.container && id) {
            map = L.map(`openstreetmap__map-${id}`, {
                scrollWheelZoom: false,
                keyboard: false,
            });
            this.markers = L.markerClusterGroup({
                maxClusterRadius: 50,
            });
        }
        let run = this.container && map && this.markers;

        // run && new ScrollToMarker(map, this.markers, this.container);
        run && this.init(map);
    }

    init(map) {
        if (
            !this.container.hasAttribute('js-map-pin-data') ||
            !this.container.hasAttribute('js-map-start-position')
        ) {
            return;
        }

        this.observe(map);
        map.zoomControl.setPosition('bottomright');
        let startPosition = JSON.parse(this.container.getAttribute('js-map-start-position'));
        let locations = JSON.parse(this.container.getAttribute('js-map-pin-data'));
        let tiles = this.getTilesStyle(this.container);
        this.setMapView(locations, startPosition, tiles, map);
    }

    setMapView(locations, startPosition, tiles, map) {
        let expand = this.container.querySelector('.c-openstreetmap__expand-icon');
        map.setView([startPosition.lat, startPosition.lng], startPosition.zoom);
        L.tileLayer(tiles?.url ? tiles.url : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: tiles?.attribution
                ? tiles.attribution
                : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        locations.forEach((location, index) => {
            if (location?.lat && location?.lng) {
                let customIcon = false;
                if (location?.icon) {
                    customIcon = location.icon;
                }
                let marker = L.marker([location.lat, location.lng], {
                    icon: this.createMarker(customIcon, index),
                    url: {lat: location.lat, lng: location.lng},
                    id: `${'marker' + index}`,
                });
                if (location.tooltip) {
                    marker.bindPopup(this.createTooltip(location.tooltip), { maxWidth: 300 });
                }
                marker.on('click', (e) => {
                    let latlng = e.latlng
                        ? e.latlng
                        : e.sourceTarget?._latlng
                        ? e.sourceTarget?._latlng
                        : false;
                    let zoomLevel = map.getZoom();
                    if (latlng) {
                        if (zoomLevel >= 16) {
                            map.setView(latlng);
                        } else {
                            map.setView(latlng, 16);
                        }
                    }
                    setParams({lat: location.lat, lng: location.lng});
                });
                this.markers.addLayer(marker);
            }
        });
        this.markers.addTo(map);

        this.initialize(map); 
        //Controls the accessibiltiy of the map, called after printing the map and markers
        this.handleAccessibility(map);

        /* TODO: makes it a little jumpy but centers the map correctly based on the users */
        if (expand) {
            expand.addEventListener('click', () => {
                setTimeout(function () {
                    map.invalidateSize();
                }, 200);
            });
        }
    }

    initialize(map) {
        const markerElementPairs = createMarkerElementPairs(map, this.markers, this.container);
        this.handleParams();
        new ShowPost(map, this.markers, this.container, markerElementPairs);
        new ZoomMarkerClick(markerElementPairs);
    }

    handleParams() {
        const params = getParams();
        if (!params || !this.markers) return;

        this.markers.getLayers().forEach(marker => {
            const latLng = marker._latlng;
            if (latLng && latLng.lat == params.lat && latLng.lng == params.lng) {
                zoomToMarker(marker);
            }    
        });
    }

    handleAccessibility(map) {
        const markers = [...this.markers.getLayers()].filter(layer => layer instanceof L.Marker);
        let currentMarker = 0;
        const attributions = this.container.querySelector('.leaflet-control-attribution');

        attributions?.querySelectorAll('a')?.forEach(attribution => {
            attribution.setAttribute('tabindex', '-1');
        });

        map.addEventListener('keydown', (e) => {
            const event = e.originalEvent;
            switch (event.key) {
                case 'ArrowDown':
                case 'ArrowLeft':
                    event.preventDefault();
                    currentMarker = (currentMarker - 1 + markers.length) % markers.length;
                    this.zoomClusterMarker(markers[currentMarker]);
                    break;

                case 'ArrowUp':
                case 'ArrowRight':
                    event.preventDefault();
                    currentMarker = (currentMarker + 1) % markers.length;
                    this.zoomClusterMarker(markers[currentMarker]);
                    break;

                case '+':
                    map.zoomIn();
                    break;

                case '-':
                    map.zoomOut();
                    break;
            }
        });
    }

    zoomClusterMarker(marker) {
        if (marker?.__parent) {
            const cluster = marker.__parent;
            cluster.zoomToBounds();
            setTimeout(() => {
                marker.openPopup();
            }, 300);
        }
    }

    getPrimaryColor() {
        let color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        return color ? color : '#ae0b05';
    }

    createMarker(customIcon, index) {
        let template = this.container.querySelector('.c-openstreetmap__pin-icon');
        let html = template.innerHTML;
        let icon = customIcon?.icon ? customIcon.icon : 'location_on';
        let color = customIcon.backgroundColor
            ? customIcon.backgroundColor
            : this.getPrimaryColor();
        html = html
            .replace('{icon-name}', icon)
            .replaceAll('{ICON_NAME}', icon)
            .replace('{ICON_BACKGROUND_COLOR}', color);
        let marker = L.divIcon({
            className: 'c-openstreetmap__icon',
            html: html,
        });

        return marker;
    }

    createTooltip(tooltip) {
        let template = this.container.querySelector('.c-openstreetmap__pin-tooltip');
        let clone = template.cloneNode(true);

        if (!tooltip.image?.src && clone.content.querySelector('figure')) {
            clone.content.querySelector('figure').remove();
        }

        if (!tooltip.url) {
            let link = clone.content.querySelector('.c-openstreetmap__tooltip-link');
            let title = clone.content.querySelector('.c-openstreetmap__tooltip-title');

            link.parentNode.insertBefore(title, link);
            link.remove();
        }
        let html = clone.innerHTML;
        html = html
            .replace('{TOOLTIP_HEADING}', tooltip.title ? tooltip.title : '')
            .replace('{TOOLTIP_DIRECTIONS_URL}', tooltip.directions?.url ? tooltip.directions.url  : '')
            .replace('{TOOLTIP_DIRECTIONS_LABEL}', tooltip.directions?.label ? tooltip.directions.label : '')
            .replace('{TOOLTIP_EXCERPT}', tooltip.excerpt ? tooltip.excerpt : '')
            .replace('{TOOLTIP_IMAGE_SRC}', tooltip.image?.src ? tooltip.image.src : '')
            .replace('{TOOLTIP_IMAGE_ALT}', tooltip.image?.alt ? tooltip.image.alt : '')
            .replace('{TOOLTIP_LINK}', tooltip.url ? tooltip.url :  '');
        return html;
    }

    getTilesStyle(container) {
        let tiles = container.hasAttribute('js-map-style')
            ? container.getAttribute('js-map-style')
            : 'default';

        switch (tiles) {
            case 'dark':
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                };
            case 'pale':
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                };
            case 'default':
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                };
            case 'color':
                return {
                    attribution:
                        'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                };
            default:
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                };
        }
    }
    updateBrowserHistory(url) {
        window.history.pushState({}, '', url);
    }

    observe() {
        let mapContainer = this.container.querySelector('.c-openstreetmap__map');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((addedNode) => {
                        if (
                        addedNode instanceof HTMLElement &&
                        (addedNode.classList?.contains('c-openstreetmap__icon') || 
                        addedNode.classList?.contains('marker-cluster'))
                        ) {
                            addedNode.setAttribute('tabindex', '-1');
                        }
                    });
                }
            });
        });
        observer.observe(mapContainer, { childList: true, subtree: true });
    }
}

export function initializeOpenStreetMaps() {
    const componentElements = [...document.querySelectorAll('.c-openstreetmap')];
    componentElements.forEach((element) => {
        new OpenStreetMap(element);
    });
}

export default OpenStreetMap;
