import { FC, useEffect, useState } from "react";
import React from "react";
import { MedicineDetails } from "../MedicineDetails";
import "./styles.css";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Pagination, PaginationProps } from "antd";

type Props = {};
export interface Medicine {
  available_forms: string[];
  salt: string;
  salt_forms_json: { [key: string]: any };
}
export const Medicines: FC<Props> = () => {
  const [searchData, setSearchData] = useState<string>("");
  const [medicinesData, setMedicinesData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (searchData: string | ""): Promise<void> => {
    try {
      setLoading(true);
      await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${searchData}&pharmacyIds=1,2,3`
      )
        .then((res) => res.json())
        .then((response) => setMedicinesData(response?.data?.saltSuggestions))
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false);
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
      {loading ? (
      `  Loading...`
      ) : (
        <>
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
      )}
  </>
  );
};
