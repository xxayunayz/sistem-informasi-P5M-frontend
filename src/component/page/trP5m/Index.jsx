import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";

const initialData = [];

const dataFilterSort = [
  { Value: "[Kelas] asc", Text: "Kelas Pic [↑]" },
  { Value: "[Kelas] desc", Text: "Kelas Pic [↓]" },
];

const dataFilterStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function TrP5mIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(initialData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Kelas] asc",
    status: "Aktif",
    selectedClass: "",
  });

  const searchQuery = useRef("");
  const searchFilterSort = useRef("[Kelas] asc");
  const searchFilterStatus = useRef("Aktif");
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const classData = await UseFetch(API_LINK + "MasterKelas/GetDataKelasCombo");
        if (classData && classData !== "ERROR") {
          setClassList(classData);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassList();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://api.polytechnic.astra.ac.id:2906/api_dev/efcc359990d14328fda74beb65088ef9660ca17e/SIA/getListMahasiswa?id_konsentrasi=3"
        );
        const jsonData = await response.json();

        console.log("Fetched data:", jsonData);

        if (!jsonData || jsonData === "ERROR") {
          setIsError(true);
        } else {
          const filteredData = jsonData.filter(
            (item) => item.kelas === currentFilter.selectedClass
          );

          const formattedData = filteredData.map((value) => ({
            Nim: value.nim,
            Nama: value.nama,
            Kelas: value.kelas,
            IDCARD: (
              <input type="checkbox" onChange={() => handleCheckboxChange(value.id)} />
            ),
            NameTag: (
              <input type="checkbox" onChange={() => handleCheckboxChange(value.id)} />
            ),
            Rambut: (
              <input type="checkbox" onChange={() => handleCheckboxChange(value.id)} />
            ),
            Kuku: (
              <input type="checkbox" onChange={() => handleCheckboxChange(value.id)} />
            ),
            Sepatu: (
              <input type="checkbox" onChange={() => handleCheckboxChange(value.id)} />
            ),
            // Aksi: ["Toggle", "Detail", "Edit"],
            Alignment: ["center", "center", "center", "center", "center", "center",  "center","center"],
          }));

          setCurrentData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentFilter.selectedClass) {
      fetchData();
    }
  }, [currentFilter.selectedClass]);

  const handleCheckboxChange = (id) => {
    // Handle checkbox state change
    console.log("Checkbox state changed for ID:", id);
  };

  const handleSetCurrentPage = (newCurrentPage) => {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
      status: searchFilterStatus.current.value,
    }));
  };

  const handleSetStatus = (id) => {
    setIsLoading(true);
    setIsError(false);

    UseFetch(API_LINK + "MasterKelas/SetStatusKelas", { idKel: id })
      .then((response) => {
        if (response === "ERROR" || !response || response.length === 0) {
          throw new Error("Error or empty response");
        }
        SweetAlert(
          "Sukses",
          "Status data Kelas berhasil diubah menjadi " + response[0].Status,
          "success"
        );
        handleSetCurrentPage(currentFilter.page);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data kelas."
            />
          </div>
        )}
        <div className="flex-fill">
          <DropDown
            forInput="ddClasses"
            label="Pilih Kelas"
            type="none"
            arrData={classList.map((item) => ({
              Value: item.Kelas,
              Text: item.Kelas,
            }))}
            onChange={(e) => {
              setCurrentFilter((prevFilter) => ({
                ...prevFilter,
                selectedClass: e.target.value,
              }));
            }}
            defaultValue="" 
          />
          <div className="input-group">
            <Button
              iconName="add"
              classType="success"
              label="Simpan"
              onClick={() => onChangePage("Simpan")}
            />
            <Input
              ref={searchQuery}
              forInput="pencarianKelas"
              placeholder="Cari"
            />
            <Button
              iconName="search"
              classType="primary px-4"
              title="Cari"
              onClick={handleSearch}
            />
            <Filter>
              <DropDown
                ref={searchFilterSort}
                forInput="ddUrut"
                label="Urut Berdasarkan"
                type="none"
                arrData={dataFilterSort}
                defaultValue="[Kelas] asc"
              />
              <DropDown
                ref={searchFilterStatus}
                forInput="ddStatus"
                label="Status"
                type="none"
                arrData={dataFilterStatus}
                defaultValue="Aktif"
              />
            </Filter>
          </div>
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="d-flex flex-column">
              <Table
                data={currentData}
                onToggle={handleSetStatus}
                onDetail={onChangePage}
                onEdit={onChangePage}
              />
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={currentData.length > 0 ? currentData[0].Count : 0}
                navigation={handleSetCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
