import React, { 
  useEffect,
  useState,  
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import Map from "./Map";

const App = () => {
  // 104.215.148.63
  // 142.250.191.78
  // 104.68.105.169
  // 101.0.105.110
  // 108.163.194.20
  // 40.112.0.0 40.113.200.201
  // 128.100.10.10
  // Test: https://geo-lookup.ipify.org/
  const [position, setPosition] = useState([0,0]);
  const [ipaddress, setIpaddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [isMapLoaded, setIsMapLoaded] = useState({  
          ipaddress: "",
          location: "",
          timezone: "",
          isp: ""
    });

  const ref = useRef();

  const api_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const api_url = "https://geo.ipify.org/api/v1?";

  const reset = () => {
    setIsMapLoaded({
      ipaddress: "",
      location: "",
      timezone: "",
      isp: ""
    });
    setPosition([0, 0]);   
    setIsLoading(false);
    setIsError(false);  
    setZoom(12);
  };

  const IsIPAddress = (inputText) => {
        var ipformat =
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (inputText.match(ipformat)) {         
          return true;
        } else {
          return false;
        }
      }
  const getGeoData =  async (address) => {
    let api_url_ip = '';
    try 
    {
        if(address === "")return;
        let useIP = IsIPAddress(address);
        if(useIP){
          api_url_ip = `${api_url}apiKey=${api_key}&ipAddress=${address}`;    
        }else{
            api_url_ip = `${api_url}apiKey=${api_key}&domain=${address}`;
        }
        setIsLoading(true);
        const response = await fetch(api_url_ip);
        if (!response.ok) {
          reset(false);
          setIsError(true);
          throw new Error("Request failed - Status Code: " + response.status);
        }       
        const data = await response.json();   
        setPosition([data.location.lat, data.location.lng]);
        setIpaddress(data.ip);       
        setIsMapLoaded({
          ipaddress: data.ip,
          location: data.location.city + " " + data.location.country,
          timezone: data.location.timezone,
          isp: data.isp          
        });     
        
        setIsLoading(false);
        setIsError(false);      
    } 
    catch (err) {
        reset()
        setIsError(true);
    }
  };

  useEffect(() => {  
    reset();     
    // Returns OWN IP Data - https://ipapi.co/json/
    // Test Site https://ipfind.com/   
    fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {     
      getGeoData(data.ip); 
    }).catch(err => {
        setIsError(false);
        console.log(err);
    });
      return () => {
        reset();
      }
   }, []);
 

  const searchHandler = (event) => {
    event.preventDefault();   
    reset(); 
    getGeoData(ref.current.value);   
  };

  return (
    <React.Fragment>
      <div>
        <header>
          <h1>IP Address Tracker</h1>
          <form action="#" onSubmit={searchHandler}>
            <input
              ref={ref}
              defaultValue={ipaddress}
              id="searchaddress"
              type="text"
              placeholder="Enter IP Address or Domain Name"
            />
            <button type="submit">
              {" "}
              <FontAwesomeIcon icon={faAngleRight} className="arrow" />
            </button>
          </form>
          {isLoading && (
            <div className="at-container">
              <h1 className="at-item">Loading...</h1>
            </div>
          )}
          {isError && (
            <div className="at-container">
              <h1 className="at-item" style={{ color: "red" }}>
                Error!
              </h1>
            </div>
          )}

          <div id="card" className="card">
            <div className="columns">
              <div className="column">
                <h3>IP Address</h3>              
                <h2>{isMapLoaded.ipaddress ? isMapLoaded.ipaddress : "0.0.0.0"}</h2>
              </div>

              <div className="column">
                <h3>location</h3>
                <h2>{isMapLoaded.location ? isMapLoaded.location : "No Location"}</h2>
              </div>

              <div className="column">
                <h3>Timezone</h3>
                <h2>UTC {isMapLoaded.timezone ? isMapLoaded.timezone : "00:00"}</h2>
              </div>

              <div className="column">
                <h3>isp</h3>
                <h2>{isMapLoaded.isp ? isMapLoaded.isp : "NO ISP"}</h2>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div id="map">
            {!isLoading && <Map position={position} zoom={zoom} /> }
          </div>
        </main>
        <footer>
          <div className="attribution">
            Challenge by{" "}
            <a
              href="https://www.frontendmentor.io?ref=challenge"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Frontend Mentor
            </a>
            Coded by{" "}
            <a
              href="https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Marty Hill
            </a>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default App;
