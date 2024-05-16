import { FC, useEffect, useState } from "react";
import React from "react";
import { MedicineDetails } from "../MedicineDetails";
import "./styles.css";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";

type Props = {};
export interface Medicine {
  available_forms: string[];
  salt:string;
  salt_forms_json: { [key: string]: any };
}
export const Medicines: FC<Props> = () => {
  const [searchData, setSearchData] = useState<string>("");
  const [medicinesData, setMedicinesData] = useState<Medicine[]>([]);

  const fetchData = async (searchData: string | ""): Promise<void> => {
    console.log(searchData, "search");
    try {
      await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${searchData}&pharmacyIds=1,2,3`
      )
        .then((res) => res.json())
        .then((response) => setMedicinesData(response?.data?.saltSuggestions))
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData("paracetamol");
  }, []);

  return (
    <>
      Capsule Web Development Test
      <div className="search-bar">
        {searchData.length > 0 ? <ArrowLeftOutlined /> : <SearchOutlined />}
        <input
          type="text"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setMedicinesData([]);
              fetchData(searchData);
            }
          }}
          onChange={(e) => setSearchData(e.target.value)}
          value={searchData}
          placeholder="Type your medicine name here"
        />
        <span className="search-text"> Search</span>{" "}
      </div>
      <div className="divider"></div>
      {medicinesData?.length
        ? medicinesData?.map((data: Medicine) => {
            return (
              <>
                <MedicineDetails data={data} />
              </>
            );
          })
        : "No data found"}
    </>
  );
};
