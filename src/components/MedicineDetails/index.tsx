import React, { FC, useEffect, useState } from 'react';
import { Medicine } from '../Medicines';
import { Card, Row, Tag } from 'antd';

interface Props {
  data: Medicine;
}

export const MedicineDetails: FC<Props> = ({ data }) => {
  // interface MedsData {
  //   Forms: string;
  //   Strength: string;
  // }
  const { available_forms = [], salt_forms_json = {} } = data;
  const [activeMeds, setActiveMeds] = useState({
    Forms: "",
    Strength: "",
    Packaging: "",
  });
  const handleData = (salt: Object): JSX.Element[] => {
    return Object.keys(salt).map((strength,index) => {
      return <div key={strength} onClick={()=>handleActiveMedsStrength(strength)}> 
      <Tag color={activeMeds?.Strength===strength?"green":"grey"}> {strength}</Tag>
      </div>;
    });
  };

  const handlePackagingData = (strength: Object): JSX.Element => {
    const elements = Object.keys(strength).map((packaging) => {
      return <div key={packaging} onClick={()=>handleActiveMedsPackaging(packaging)}> <Tag color={activeMeds?.Packaging===packaging?"green":"grey"}>{packaging}</Tag></div>;
    });
    return <>{elements}</>;
  };
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
  const handleActiveMedsPackaging = (packaging: string) => {
    setActiveMeds((prev) => {
      return { 
        ...prev,
        Packaging: packaging 
      };
    });
  }
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
  
    // If no valid price was found, set min to a fallback value
    const displayMin = min === Infinity ? "No valid prices available" : `From ${min}`;
  
    return <>{displayMin}</>;
  };

  useEffect(() => {
    handleActiveMedsForms(Object.keys(salt_forms_json)[0])
  }, [])
  
  const saltForms: any = salt_forms_json;
  return (
    <>

   

    {activeMeds?.Forms? <Card><div className='d-flex' style={{ justifyContent: 'center', flexDirection: 'row' }}>
    <Row>
        Forms:
      
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
     <Row> Strength: {handleData(saltForms[activeMeds?.Forms])}</Row>   
     <Row>    Packaging:
        {handlePackagingData(
          saltForms[activeMeds?.Forms][activeMeds?.Strength]
        )}
        </Row> 

    <div className='d-flex' style={{ alignItems: 'center' }}>
        {activeMeds?.Forms}|{activeMeds?.Strength}|{activeMeds?.Packaging}
        </div>
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
