import React, { useEffect,useCallback, useRef, useState } from 'react'
import _, { constant } from 'underscore';
import OptimizationRequest, { OPTIMIZER_API_URL } from '../../../services/OptimizationRequest';

import './optimizer.css'


const latPattern = /^(-?\d+(\.\d+)?)$/;
const lngPattern = /^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/;
var polylineRoutes = [];


function extractCoords(str) {
  let lat, lng;
  if (str.match(latPattern) && str.match(lngPattern)) { // case 1: "lat,lng" format
    lat = parseFloat(str.match(latPattern)[1]);
    lng = parseFloat(str.match(lngPattern)[1]);
  } else if (str.startsWith('"') && str.endsWith('"')) { 
    const arr = str.replace(/['"]+/g, '').split(",");
    if (Array.isArray(arr) && arr.length >= 2) {
      lat = parseFloat(arr[0]);
      lng = parseFloat(arr[1]);
    }
  }  else if (str.startsWith("[") && str.endsWith("]")) { // case 2: "[lat,lng]" format
    const arr = JSON.parse(str);
    if (Array.isArray(arr) && arr.length >= 2) {
      lat = parseFloat(arr[0]);
      lng = parseFloat(arr[1]);
    }
  } else { // case 3: invalid format
    return null;
  }
  // validate the extracted values
  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  return { lat, lng };
}


const _Markersvg = (number, color) => {
  return `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle stroke="white" stroke-width="7" cx="50%" cy="60%" r="40%" fill="${color}" /><text x="50%" y="70%" text-anchor="middle" style="isolation:isolate;font-size:25px;fill:#fff;font-family:Arial-BoldMT, Arial;font-weight:700"  fill="white">${number}</text></svg>`;
};


const OptimizerMap = (props) => {


  const { jobs = [] } = props;


  const ref = useRef();
  const [map, setMap] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const loadScript = useCallback(() => {

    const onLoad = () => {
      
      var m = new window.google.maps.Map(ref.current, {
        center:  {
          lat: 25.204849,
          lng: 55.270782
        },
        zoom: 8,
        keyboardShortcuts: false,
        mapTypeControl: false,
        onMapCreated : () =>{
          alert('Map created');
        }
      });

      setMap(m)

    };

    if (!window.google) {
      const script = document.createElement(`script`);
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC-ahgqsPN7HgQz_2fjWFLlUYzQkI6FHKo`;
      document.head.append(script);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, []);

  


  const drawRoutes = async (_vehicles, _m) => {


    if (polylineRoutes && polylineRoutes.length !== 0) {
      // Clear Old
      polylineRoutes.map(p => {
        try {
          p.setMap(null)
        } catch (e) {

        }
      })
    }

    for (
      let vehicleIndex = 0;
      vehicleIndex < _vehicles.length;
      vehicleIndex++
    ) {
      const _vehicle = _vehicles[vehicleIndex];

      const jobsData = _vehicle.jobs;

      var steps = [];

      let color = "#" + Math.floor(Math.random() * 16777215).toString(16);

      for (let index = 0; index < jobsData.length; index++) {
        const job = jobsData[index];

        for (let sIndex = 0; sIndex < job.steps.length; sIndex++) {
          const step = job.steps[sIndex];

          steps.push({
            lat: step[0],
            lng: step[1],
          });
        }

        // Marker
        var icon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(_Markersvg(index + 1, color)),
          scaledSize: new window.google.maps.Size(40, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(20, 20),
        };

        var start = job.start;
        var end = job.end;

        if (index == job.steps.length - 1) {
          // end
          drawMarker(_m, { lat: end[0], lng: end[1] }, icon);
        } else {
          drawMarker(_m, { lat: start[0], lng: start[1] }, icon);
        }


      }

      let polyline = new window.google.maps.Polyline({
        path: steps,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 5.0,
        zIndex: 99,
      });

      polyline.setMap(_m);

      polylineRoutes.push(polyline)
    }
  };

  const drawMarker = (_m, markerPosition, icon, title = "") => {
    new window.google.maps.Marker({
      position: markerPosition,
      map: _m,
      icon: icon,
      title: title,
    });
  };


  const getOptimizerResult = async ( id ) => {

    try {

      const result = await fetch(
        `${OPTIMIZER_API_URL}/results/${id}`
      );

      const _r = await result.json();
      if(!_r.vehicleRouteDTOList){
        getOptimizerResult(id)
      } else{
        drawRoutes(_r.vehicleRouteDTOList, map);
        setShowLoader(false)
      }
      
    } catch (error) {
      console.log('Error',error)
      // alert('Oops! Something went wrong, Please check optimize request data')
      setShowLoader(false)
    }

  }


  const getResponseFromOptimizer = async ( payloadData ) => {

    try {
      setShowLoader(true)
      const response = await OptimizationRequest('/solve',JSON.stringify(payloadData))
      
      if(response.status == 'Scenario received'){
        getOptimizerResult(response.id)
      }
      
    } catch (error) {
      console.log('Error',error)
      alert('Oops! Something went wrong, Please check optimize request data')
      setShowLoader(false)
    }

  }


  const optimizeJobsData = async () => {

    if (jobs.length == 0) {
      return false;
    }


    var uniqMembersJobs = _.groupBy(jobs, 'job_technician_id');

    console.log('uniqMembersJobs',uniqMembersJobs)

    var finalMembers = [];
    var finalMembersJobs = [];
    
    Object.keys(uniqMembersJobs).map((key,index) => {

        try {
            
          // JOBS
            uniqMembersJobs[key].map((job,indexOfJob) =>{

              const jobCoords = extractCoords(job.job_address_cordinates);

                if(jobCoords){
                  finalMembersJobs.push({
                    id: index + 1,
                    location: [jobCoords.lat, jobCoords.lng],
                    time_window: {
                        startTime: "00:00:00",
                        endTime: "23:59:59",
                    },
                    priority: "normal",
                    weight: 1,
                    quantity: 1,
                    duration : 10,
                  });
                }
                
            })


            // VEHICLES
            finalMembers.push({
              id: (index  + 1),
              profile: "driving-car",
              capacity: 999999999,
              start : [25.204849,55.270782],
              end : [25.204849,55.270782],
              time_window: {
                startTime: "00:00:00",
                endTime: "23:59:59",
              },
              vehicleType: "Car",
              driverType: "senior",
              speed: "maximum",
          })


        } catch (error) {
            console.log('Error',error)
        }

    })

    var data = {
      name: "scenario",
      customerList: finalMembersJobs,
      vehicleList: finalMembers,
    }

  //   var data = {
  //     "name": "scenario",
  //     "customerList": [
  //         {
  //             "id": 2,
  //             "taskID": "2",
  //             "location": [
  //                 25.3461555,
  //                 55.42109319999999
  //             ],
  //             "time_window": {
  //                 "startTime": "00:00:00",
  //                 "endTime": "23:59:59"
  //             },
  //             "priority": "normal",
  //             "weight": 1,
  //             "quantity": 5,
  //             "duration": 900,
  //         },
  //         {
  //             "id": 3,
  //             "taskID": "3",
  //             "location": [
  //                 25.1411914,
  //                 55.18524679999999
  //             ],
  //             "time_window": {
  //                 "startTime": "00:00:00",
  //                 "endTime": "23:59:59"
  //             },
  //             "priority": "normal",
  //             "weight": 1,
  //             "quantity": 5,
  //             "duration": 600,
  //         },
  //         {
  //             "id": 4,
  //             "taskID": "4",
  //             "location": [
  //                 25.21937,
  //                 55.272887
  //             ],
  //             "time_window": {
  //                 "startTime": "00:00:00",
  //                 "endTime": "23:59:59"
  //             },
  //             "priority": "normal",
  //             "weight": 1,
  //             "quantity": 1,
  //             "duration": 300,
  //         }
  //     ],
  //     "vehicleList": [
  //         {
  //             "id": 2,
  //             "profile": "driving-car",
  //             "time_window": {
  //                 "startTime": "00:00:00",
  //                 "endTime": "23:59:59"
  //             },
  //             "speed": "maximum",
  //             "capacity": 999999999,
  //             "start": [
  //                 25.20993581881188,
  //                 55.26511776653246
  //             ],
  //             "end": [
  //                 25.0907436,
  //                 55.3860044
  //             ]
  //         }
  //     ],
  //     "constraints": {
  //         "shortestTime": false,
  //         "shortestDistance": false,
  //         "excludeToll": false,
  //         "excludeTimeWindow": false,
  //         "excludeZone": []
  //     }
  // }

    getResponseFromOptimizer(data)
 

}


  useEffect(() => {
    loadScript();
  }, []);


  useEffect(() => {
    optimizeJobsData()
  },[jobs,map])


  return (
   <React.Fragment>
    {showLoader && <div className='route-loader'> Please wait.. </div>}
     <div
      ref={ref}
      style={{ height: `80vh`, width: "100%", borderRadius: "0 3px 3px 0" }}
    />
   </React.Fragment>
  )
}


export default OptimizerMap