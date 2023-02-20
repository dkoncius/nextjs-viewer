import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Router from 'next/router'

export default function Home() {
  let [model, setModel] = useState('/glb/RobotExpressive.glb')

  // Model ref
  const modelViewer = useRef(null)

  // Upload model
  useEffect(() => {
      document.querySelector('input[type="file"]').addEventListener('change', function() {
          if (this.files && this.files[0]) {
              modelViewer.onload = () => {
                  URL.revokeObjectURL(modelViewer.src);  // no longer needed, free memory
              }
  
              modelViewer.src = URL.createObjectURL(this.files[0]); // set src to blob url

              setModel( modelViewer.src)
          }
      });

  }, [model])


  // Slider data
  const sliderData = ['RobotExpressive', 'Chair', 'GeoPlanter', "LittlestTokyo", "Hamburger"]

  // Change model
  const switchSrc = (event, name) => {
    modelViewer.src = `/glb/${name}.glb`;

    setModel( modelViewer.src)
    const slides = document.querySelectorAll(".slide");
    slides.forEach((element) => {element.classList.remove("selected");});
    event.currentTarget.classList.add("selected")
  };

  useEffect(() => {
    document.querySelector(".slider").addEventListener('beforexrselect', (ev) => {
      // Keep slider interactions from affecting the XR scene.
      ev.preventDefault();
    });
  })
 

  return (
    <>
      <Script
        id="model-viewer"
        type="module" 
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.0.0/model-viewer.min.js"
      />

    {/* Upload model */}
    <label for="file-upload" class="custom-file-upload">
        <i class="fa fa-cloud-upload"></i> Custom Upload
    </label>
    <input id="file-upload" type="file"/>
    
      {/* Model */}
      <model-viewer ref={modelViewer} src={model} autoplay ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="poster.webp" shadow-intensity="1" render-scale="1" camera-orbit="-60deg auto 100%" 
      field-of-view='7deg' max-field-of-view='12deg'>
      
      {/* Ar buttons */}
      <button slot="ar-button" id="ar-button">
        <img src="ic_view_in_ar_new_googblue_48dp.png"/>
        <span>View in your space</span>
      </button>

        <div id="ar-prompt">
          <img src="./hand.png"/>
        </div>

        <button id="ar-failure">
          AR is not tracking!
        </button>


      {/* Slider */}
      <div className="slider">
        <div className="slides">
            {
                sliderData.map(data => 
                  <button 
                  onClick={(e) => switchSrc(e, data)}
                  className="slide"
                  style={{
                    background: `url(/slider/${data}.webp)`,
                    backgroundSize: 'contain',
                    backgroundColor: 'white',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                  ></button>
                  )
            }
        </div>
      </div>
      </model-viewer>
    
    </>
  )
}
