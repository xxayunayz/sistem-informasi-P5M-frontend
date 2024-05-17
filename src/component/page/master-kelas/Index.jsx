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

const initialData = [
  {
    Key: null,
    No: null,
    "Nama PIC": null,
    "Kelas": null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Kelas] asc", Text: "Kelas Pic [↑]" },
  { Value: "[Kelas] desc", Text: "Kelas Pic [↓]" },
];

const dataFilterStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];
  

export default function MasterKelasIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(initialData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Kelas] asc",
    status: "Aktif",
  });
  
  const searchQuery = useRef("");
  const searchFilterSort = useRef("[Kelas] asc");
  const searchFilterStatus = useRef("Aktif");

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
      status: searchFilterStatus.current.value,
    }));
  }

  // ini function yg sebelum dr gpt
   function handleSetStatus(id) {
     setIsLoading(true);
     setIsError(false);
     UseFetch(API_LINK + "MasterKelas/SetStatusKelas", {
       idKelas: id,
     })
       .then((data) => {
         if (data === "ERROR" || data.length === 0) setIsError(true);
         else {
           SweetAlert(
             "Sukses",
             "Status data kelas berhasil diubah menjadi " + data[0].Status,
             "success"
           );
           handleSetCurrentPage(currentFilter.page);
         }
       })
       .then(() => setIsLoading(false));
   }

  // async function handleSetStatus(id) {
  //   setIsLoading(true);
  //   setIsError(false);
  //   try {
  //     const data = await UseFetch(API_LINK + "MasterKelas/SetStatusKelas", {
  //       idKelas: id,
  //     });
  //     if (data === "ERROR" || data.length === 0) {
  //       setIsError(true);
  //     } else {
  //       SweetAlert(
  //         "Sukses",
  //         "Status data kelas berhasil diubah menjadi " + data[0].Status,
  //         "success"
  //       );
  //       handleSetCurrentPage(currentFilter.page);
  //     }
  //   } catch (error) {
  //     setIsError(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "MasterKelas/GetDataKelas",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(initialData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Aksi: ["Toggle", "Detail", "Edit"],
            Alignment: ["center", "center", "left", "center", "center", "center"],
          }));
          setCurrentData(formattedData);

        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

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
          <div className="input-group">
            <Button
              iconName="add"
              classType="success"
              label="Tambah"
              onClick={() => onChangePage("add")}
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
