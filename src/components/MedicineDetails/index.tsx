import React, { FC, useEffect, useState } from 'react';
import { Medicine } from '../Medicines';
import { Card, Row, Tag } from 'antd';

interface Props {
  data: Medicine;
}

export const MedicineDetails: FC<Props> = ({ data }) => {
  const { available_forms = [], salt_forms_json = {},salt } = data;
  // state to check active Medicines
    const firstFarm=Object.keys(salt_forms_json)[0];
    const firstStrength= Object.keys(salt_forms_json[firstFarm])[0];
    const firstPackaging= Object.keys(salt_forms_json[firstFarm][firstStrength])[0];
  const [activeMeds, setActiveMeds] = useState({
    Forms: firstFarm,
    Strength: firstStrength,
    Packaging: firstPackaging,
  });
  // This function handles strength data
  const handleStrengthData = (salt: Object): JSX.Element[] => {
    return Object.keys(salt).map((strength,index) => {
      return <div key={strength} onClick={()=>handleActiveMedsStrength(strength)}> 
      <Tag color={activeMeds?.Strength===strength?"green":"grey"}> {strength}</Tag>
      </div>;
    });
  };
  // This function handles packaging data
  const handlePackagingData = (strength: Object): JSX.Element => {
    const elements = Object.keys(strength).map((packaging) => {
      return <div key={packaging} onClick={()=>handleActiveMedsPackaging(packaging)}> <Tag color={activeMeds?.Packaging===packaging?"green":"grey"}>{packaging}</Tag></div>;
    });
    return <>{elements}</>;
  };
  const handleAvailableMedicines=()=>{

  }
   // This function handles active meds data when we select Farm
  const handleActiveMedsForms = (salt: string) => {
    setActiveMeds((prev) => {
      const newStrength = Object.keys(salt_forms_json[salt])[0];
      const newPackaging = Object.keys(salt_forms_json[salt][newStrength])[0];
      return { 
        ...prev, 
        Forms: salt, 
        Strength: newStrength, 
        Packaging: newPackaging 
      };
    });
  
  }
   // This function handles active meds data when we select Strength
  const handleActiveMedsStrength = (strength: string) => {
    setActiveMeds((prev) => {
      const newPackaging = Object.keys(salt_forms_json[prev?.Forms][strength])[0];
      return { 
        ...prev,
        Strength: strength, 
        Packaging: newPackaging 
      };
    });
  }
     // This function handles active meds data when we select Packaging
  const handleActiveMedsPackaging = (packaging: string) => {
    setActiveMeds((prev) => {
      return { 
        ...prev,
        Packaging: packaging 
      };
    });
  }
   // This function handles logic to find minimum price of meds and if its out of stock
  const handlePharmacyPrice = (packaging: { [key: string]: { selling_price: number | null }[] | null }): JSX.Element => {
    let min = Infinity;
    Object.keys(packaging || {}).forEach((key: string) => {
      const medsArray = packaging[key];
      if (medsArray !== null) {
        medsArray.forEach((medsPrice) => {
          if (medsPrice?.selling_price !== null && medsPrice.selling_price < min) {
            min = medsPrice.selling_price;
          }
        });
      }
    });
  
    const displayMin = min === Infinity ? "No valid prices available" : `From ${min}`;
  
    return <>{displayMin}</>;
  };

  
  const saltForms: any = salt_forms_json;
  return (
    <>
    {activeMeds?.Forms? <Card><div className='d-flex' style={{ justifyContent: 'center' }}>
      {/* render farm data */}
    <Row>
        Farm:
        <div style={{width:"30%"}}>
        {Object.keys(saltForms).map((salt, index) => (
          <React.Fragment key={index}>
            <Tag color={activeMeds?.Forms===salt?"green":"grey"}> <p
              onClick={() =>
                handleActiveMedsForms(salt)
              }
            >
              {salt}
            </p></Tag>
           
            <br />
          </React.Fragment>
        ))}
            </div>
            </Row>
          {/* render strength data */}
     <Row> Strength: {handleStrengthData(saltForms[activeMeds?.Forms])}</Row>   
     {/* render packaging data */}
     <Row>    Packaging:
        {handlePackagingData(
          saltForms[activeMeds?.Forms][activeMeds?.Strength]
        )}
        </Row> 
  {/* render salt details */}
    <div className='d-flex' style={{ alignItems: 'center' }}>
      {salt}
        {activeMeds?.Forms}|{activeMeds?.Strength}|{activeMeds?.Packaging}
        </div>
        {/* render pharmacy price */}
        <div className='d-flex' style={{ alignItems: 'center' }}>
          <Row>  {handlePharmacyPrice(saltForms[activeMeds?.Forms]?.[activeMeds?.Strength]?.[activeMeds?.Packaging])}</Row>
    </div>
      </div>
 
      </Card>
        :<>
      Loading.....
      </>}
    </>
  );
};
