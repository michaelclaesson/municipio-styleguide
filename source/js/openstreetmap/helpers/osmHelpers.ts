export function getElementJSONLocation(el: HTMLElement) {
    const locationAttr = el.getAttribute('data-js-map-location');
    if (!locationAttr) return false;

    const location = JSON.parse(locationAttr);

    return location;
}

export function getMarkerDataFromElement(el: HTMLElement) {
    const json = getElementJSONLocation(el);
    if (json !== null && typeof json === 'object' && 'lat' in json && 'lng' in json) {
        const lat = json.lat;
        const lng = json.lng;
        const tooltip = json.tooltip ?? false;
        const url = json.url ?? false;
        const icon = json.icon ?? false;

        return {lat: lat, lng: lng, tooltip: tooltip, url: url, element: el, icon: icon};
    }
    
    return {lat: undefined, lng: undefined};
}

export function pushCoordinatesToBrowserHistory({ lat, lng }: { lat: number | undefined, lng: number | undefined }) {
    const searchParams = new URLSearchParams(window.location.search);

    if (lat && lng) {
        searchParams.set('osmLat', lat.toString());
        searchParams.set('osmLng', lng.toString());
        const setParams = window.location.origin + window.location.pathname + '?' + searchParams.toString();
        history.pushState({}, '', setParams);
    } else {
        searchParams.delete('osmLat');
        searchParams.delete('osmLng');
        const setParams = window.location.origin + window.location.pathname + '?' + searchParams.toString();
        history.replaceState({}, '', setParams);
    }
}

export function getCoordinatesFromURLSearchParams(): { lat: string, lng: string } | false {
    const queryParams = new URLSearchParams(window.location.search);
    
    if(queryParams.has('osmLat') && queryParams.has('osmLng')) {
        return {lat: queryParams.get('osmLat') ?? '', lng: queryParams.get('osmLng') ?? ''}
    }
    
    return false;
}


