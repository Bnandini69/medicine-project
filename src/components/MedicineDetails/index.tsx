import { Card, Col, Row, Tag } from "antd";
import { FC, useState } from "react";
import { Medicine } from "../Medicines";
import "./styles.css";
import cx from "../../cx";

interface FarmType {
  [key: string]: boolean;
}
interface Props {
  data: Medicine;
}
const MAX_ITEMS_PER_ROW = 2;
export const MedicineDetails: FC<Props> = ({ data }) => {
  const { salt_forms_json = {}, salt = "" } = data;
  // state to check active Medicines
  const firstFarm = Object.keys(salt_forms_json)[0];
  const firstStrength = Object.keys(salt_forms_json[firstFarm])[0];
  const firstPackaging = Object.keys(
    salt_forms_json[firstFarm][firstStrength]
  )[0];
  const [activeMeds, setActiveMeds] = useState({
    Farm: firstFarm,
    Strength: firstStrength,
    Packaging: firstPackaging,
  });
  const [showMore, setShowMore] = useState<FarmType>({
    Farm: false,
    Strength: false,
    Packaging: false,
  });
  // This function handles active meds data when we select Farm
  const handleActiveMedsFarms = (salt: string) => {
    setActiveMeds((prev) => {
      const newStrength = Object.keys(salt_forms_json[salt])[0];
      const newPackaging = Object.keys(salt_forms_json[salt][newStrength])[0];
      return {
        ...prev,
        Farm: salt,
        Strength: newStrength,
        Packaging: newPackaging,
      };
    });
  };
  // This function handles active meds data when we select Strength
  const handleActiveMedsStrength = (strength: string) => {
    setActiveMeds((prev) => {
      const newPackaging = Object.keys(
        salt_forms_json[prev?.Farm][strength]
      )[0];
      return {
        ...prev,
        Strength: strength,
        Packaging: newPackaging,
      };
    });
  };
  // This function handles active meds data when we select Packaging
  const handleActiveMedsPackaging = (packaging: string) => {
    setActiveMeds((prev) => {
      return {
        ...prev,
        Packaging: packaging,
      };
    });
  };
  // Above two function handles show and hide functionality
  const handleShowMore = (key: string) => {
    setShowMore((prev) => ({ ...prev, [key]: true }));
  };

  const handleShowLess = (key: string) => {
    setShowMore((prev) => ({ ...prev, [key]: false }));
  };
  //This functon handles more and hide section
  const renderFooter = (saltKeys: string[], key: string): JSX.Element => {
    return (
      <div className="show-hide-more">
        {saltKeys.length > 2 &&
          (!showMore[key] ? (
            <p
              key="show-more"
              onClick={() => handleShowMore(key)}
              style={{ cursor: "pointer", color: "blue" }}>
              ...more
            </p>
          ) : (
            <p
              key="show-more"
              onClick={() => handleShowLess(key)}
              style={{ cursor: "pointer", color: "blue" }}>
              ...hide
            </p>
          ))}
      </div>
    );
  };
  // This function handles strength data
  const handleStrengthData = (salt: Object): JSX.Element => {
    const saltKeys = Object.keys(salt);
    const displayKeys = showMore?.Strength ? saltKeys : saltKeys.slice(0, 2);

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap:"2px" }}>
        {displayKeys.map((strength) => {
          let isAvailable = false;
          // check if there is any available stores near by
          Object.keys(salt_forms_json[activeMeds?.Farm][strength])?.forEach(
            (packaging) => {
              Object.keys(
                salt_forms_json[activeMeds?.Farm][strength][packaging] || {}
              ).forEach((key: any) => {
                const medsArray =
                  salt_forms_json[activeMeds?.Farm][strength][packaging][key];
                if (medsArray !== null) {
                  isAvailable = true;
                }
              });
            }
          );
          const isSelected=activeMeds?.Strength === strength;
          
          return (
            <div
              key={strength}
              className="strength-data"
              onClick={() => handleActiveMedsStrength(strength)}>
              <Tag color={isSelected ? "green" : ""} className={cx({isNotAvailable:!isAvailable},{isSelected})}>
                {strength}
              </Tag>
            </div>
          );
        })}
        {renderFooter(saltKeys, "Strength")}
      </div>
    );
  };

  // This function handles packaging data
  const handlePackagingData = (strength: Object): JSX.Element => {
    const strengthKeys = Object.keys(strength);
    const displayKeys = showMore?.Packaging
      ? strengthKeys
      : strengthKeys.slice(0, 2);

    const packagingElements = displayKeys.map((packaging, index) => {
      let isAvailable = false;
      // check if there is any available stores nearby
      Object.keys(
        salt_forms_json[activeMeds?.Farm][activeMeds?.Strength][packaging] || {}
      ).forEach((key: any) => {
        const medsArray =
          salt_forms_json[activeMeds?.Farm][activeMeds?.Strength][packaging][
            key
          ];
        if (medsArray !== null) {
          isAvailable = true;
        }
      });
      const isSelected=activeMeds?.Packaging === packaging;
      return (
        <div
          key={packaging}
          onClick={() => handleActiveMedsPackaging(packaging)}
          style={{
            display: "inline-block",
            margin: "5px",
            
          }}>
          <Tag color={isSelected ? "green" : ""}  className={cx({isNotAvailable:!isAvailable},{isSelected})}>
            {packaging}
          </Tag>
        </div>
      );
    });

    const packagingRows = [];
    for (let i = 0; i < packagingElements.length; i += MAX_ITEMS_PER_ROW) {
      packagingRows.push(
        <Row key={`row-${i}`} style={{ marginBottom: "10px" }}>
          {packagingElements.slice(i, i + MAX_ITEMS_PER_ROW)}
        </Row>
      );
    }

    return (
      <>
        {packagingRows}
        {renderFooter(strengthKeys, "Packaging")}
      </>
    );
  };

  // This function handles logic to find minimum price of meds and if its out of stock
  const handlePharmacyPrice = (packaging: {
    [key: string]: { selling_price: number | null }[] | null;
  }): JSX.Element => {
    let min = Infinity;
    Object.keys(packaging || {}).forEach((key: string) => {
      const medsArray = packaging[key];
      if (medsArray !== null) {
        medsArray.forEach((medsPrice) => {
          if (
            medsPrice?.selling_price !== null &&
            medsPrice.selling_price < min
          ) {
            min = medsPrice.selling_price;
          }
        });
      }
    });

    const displayMin =
      min === Infinity ? "No valid prices available" : `From ${min}`;

      return (
        <div className={min === Infinity ? "noData" : "haveData"}>
          {displayMin}
        </div>
      );
      };
  // Render Farm
  const renderSaltFarms = () => {
    const farmKeys = Object.keys(saltForms);
    const displayKeys = showMore?.Farm ? farmKeys : farmKeys.slice(0, 2);
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap:"10px", justifyContent:"start",marginLeft: "8px"}}>
        {displayKeys.map((farm) => {
          const isSelected: boolean = activeMeds?.Farm === farm;
          let isAvailable = false;
          // check if there is any available stores near by
          Object.keys(salt_forms_json[farm])?.forEach((strength) => {
            Object.keys(salt_forms_json[farm][strength])?.forEach(
              (packaging) => {
                Object.keys(
                  salt_forms_json[farm][strength][packaging] || {}
                ).forEach((key: any) => {
                  const medsArray =
                    salt_forms_json[farm][strength][packaging][key];
                  if (medsArray !== null) {
                    isAvailable = true;
                  }
                });
              }
            );
          });
          return (
            <div
              key={farm}
              onClick={() => handleActiveMedsFarms(farm)}>
              <Tag color={isSelected ? "green" : ""} className={cx({isNotAvailable:!isAvailable},{isSelected})}>{farm}</Tag>
            </div>
          );
        })}
        {renderFooter(farmKeys, "Farm")}
      </div>
    );
  };
  //Render Strength
  const renderSaltStrength = () => {
    return (
      <Row className="second-row" style={{ flex: 1 }}>
        <div className="medicine-div-label">Strength:</div>
        <div className="medicine-div-value">
          {handleStrengthData(saltForms[activeMeds?.Farm])}
        </div>
      </Row>
    );
  };
  // Render packaging
  const renderSaltPackaging = () => {
    return (
      <Row className="third-row" style={{ flex: 1 }}>
        <div className="medicine-div-label">Packaging:</div>
        <div className="medicine-div-value">
          {handlePackagingData(
            saltForms[activeMeds?.Farm][activeMeds?.Strength]
          )}
        </div>
      </Row>
    );
  };

  const saltForms: any = salt_forms_json;
  return (
    <>
      {activeMeds?.Farm ? (
        <Card>
          <div className="medicine-card">
            <Col style={{  maxWidth: "400px", minWidth:"350px" }}>
              {/* render farm data */}
              <Row className="first-row">
                <div className="medicine-div-label">Farm:</div>
                <div className="medicine-div-value">{renderSaltFarms()}</div>
              </Row>
              {renderSaltStrength()}
              {renderSaltPackaging()}
            </Col>
            <div
              className="d-flex"
              style={{
                display: "flex",
                alignItems: "center",
                
                color: "#01498d",
                justifyContent: "center",
                flexDirection: "column",
              }}>
              <span className="salt-name">{salt}</span>
              <span className="salt-choosen-details">
                {" "}
                {activeMeds?.Farm} | {activeMeds?.Strength} |  {activeMeds?.Packaging}
              </span>
            </div>
            {/* render pharmacy price */}
            <div
              className="d-flex"
              style={{ display: "flex", alignItems: "center", marginRight:"35px" }}>
              <Row className="price-details">
                {handlePharmacyPrice(
                  saltForms[activeMeds?.Farm]?.[activeMeds?.Strength]?.[
                    activeMeds?.Packaging
                  ]
                )}
              </Row>
            </div>
          </div>
        </Card>
      ) : (
        <>Loading.....</>
      )}
    </>
  );
};
