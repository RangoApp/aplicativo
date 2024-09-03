import { apiGoogleKey } from "../../config/ApiConfig";
import {GoogleMap,Marker,useJsApiLoader} from '@react-google-maps/api';
import './GMaps.css';
const GMaps = ({latitude,longitude,width,height,text}) => {
    const { isLoaded } = useJsApiLoader({
        id:"google-map-script",
        googleMapsApiKey:apiGoogleKey
    })
    return isLoaded? (
        
            
            <GoogleMap
            mapContainerStyle={{width:width,height:height}}
            center={{
                lat: latitude,
                lng: longitude
            }}
            zoom={18}
            >
                <Marker 
                position={{lat:latitude,lng:longitude}}
                options={text != '' ?{
                    label: {
                        text:text
                        ,className:"gmaps-label"
                    }
                }:{}}
                />
            </GoogleMap>
        
    ) : <></>
}

export default GMaps;