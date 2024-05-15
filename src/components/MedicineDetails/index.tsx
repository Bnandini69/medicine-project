import React, { FC, useEffect, useState } from 'react';
import { Medicine } from '../Medicines';

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
    return Object.keys(salt).map((strength) => {
      return <div key={strength} onClick={()=>handleActiveMedsStrength(strength)}> {strength}</div>;
    });
  };

  const handlePackagingData = (strength: Object): JSX.Element => {
    const elements = Object.keys(strength).map((packaging) => {
      return <div key={packaging} onClick={()=>handleActiveMedsPackaging(packaging)}> {packaging}</div>;
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
    {activeMeds?.Forms? <div className='d-flex' style={{ justifyContent: 'center', flexDirection: 'row' }}>
      <div style={{ marginRight: '20px' }}>
        Forms:
        {Object.keys(saltForms).map((salt, index) => (
          <React.Fragment key={index}>
            <p
              style={{ border: '1px solid blue',cursor:"pointer" }}
              onClick={() =>
                handleActiveMedsForms(salt)
              }
            >
              {salt}
            </p>
            <br />
          </React.Fragment>
        ))}
        Strength: {handleData(saltForms[activeMeds?.Forms])}
        Packaging:
        {handlePackagingData(
          saltForms[activeMeds?.Forms][activeMeds?.Strength]
        )}
    </div>
    <div className='d-flex' style={{ alignItems: 'center' }}>
        {activeMeds?.Forms}|{activeMeds?.Strength}|{activeMeds?.Packaging}
        </div>
        <div className='d-flex' style={{ alignItems: 'center' }}>
        
        {handlePharmacyPrice(saltForms[activeMeds?.Forms]?.[activeMeds?.Strength]?.[activeMeds?.Packaging])}
 
    </div>
      </div>:<>
      Loading.....
      </>}
    </>
  );
};
