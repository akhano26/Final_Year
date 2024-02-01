import React from "react";
import {Detector} from "react-detect-offline";



const CheckConnection=props=>{
    return(
        <>
        <Detector
        render={({online})=>(
            online? props.chindren:
            <div style={{paddingTop:'10px', textAlign:'center'}}>
              
                <h1 style={{marginBottom:'5px'}}>No Connection</h1>
                <h4 style={{margin:'0'}}>Please check your internet connection</h4>
            </div>
        )}
        
        />
            
            </>
    )
}
export default CheckConnection;