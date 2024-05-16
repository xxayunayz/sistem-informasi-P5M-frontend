import { useEffect, useRef, useState } from "react";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";

export default function MasterKelasIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Nama Kelas] asc",
    status: "Aktif",
    pic: "",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();
  const searchFilterPIC = useRef();

  const dataDummy = [
    {
      Key: 1,
      No: 1,
      "Nama Kelas": "Kelas A",
      "Nama PIC": "John Doe",
      Status: "Aktif",
      Count: 100,
    },
    {
      Key: 2,
      No: 2,
      "Nama Kelas": "Kelas B",
      "Nama PIC": "Jane Smith",
      Status: "Aktif",
      Count: 150,
    },
    {
      Key: 3,
      No: 3,
      "Nama Kelas": "Kelas C",
      "Nama PIC": "John Doe",
      Status: "Tidak Aktif",
      Count: 80,
    },
  ];

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
      pic: searchFilterPIC.current.value,
    }));
  }

  function handleSetStatus(id) {
    setIsLoading(true);
    setIsError(false);
    const newData = currentData.map((item) => {
      if (item.Key === id) {
        return {
          ...item,
          Status: item.Status === "Aktif" ? "Tidak Aktif" : "Aktif",
        };
      }
      return item;
    });
    setCurrentData(newData);
    setIsLoading(false);
  }

  useEffect(() => {
    const fetchData = () => {
      setIsError(false);

      try {
        let filteredData = dataDummy.filter(
          (item) =>
            item["Nama Kelas"]
              .toLowerCase()
              .includes(currentFilter.query.toLowerCase()) &&
            item.Status === currentFilter.status &&
            (currentFilter.pic === "" || item["Nama PIC"] === currentFilter.pic)
        );

        if (currentFilter.sort === "[Nama Kelas] asc") {
          filteredData.sort((a, b) =>
            a["Nama Kelas"].localeCompare(b["Nama Kelas"])
          );
        } else if (currentFilter.sort === "[Nama Kelas] desc") {
          filteredData.sort((a, b) =>
            b["Nama Kelas"].localeCompare(a["Nama Kelas"])
          );
        }

        setCurrentData(filteredData);
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
                arrData={[
                  { Value: "[Nama Kelas] asc", Text: "Nama Kelas [↑]" },
                  { Value: "[Nama Kelas] desc", Text: "Nama Kelas [↓]" },
                ]}
                defaultValue="[Nama Kelas] asc"
              />
              <DropDown
                ref={searchFilterPIC}
                forInput="ddPIC"
                label="PIC"
                type="none"
                arrData={[
                  { Value: "", Text: "Semua" },
                  { Value: "John Doe", Text: "John Doe" },
                  { Value: "Jane Smith", Text: "Jane Smith" },
                ]}
                defaultValue=""
              />
              <DropDown
                ref={searchFilterStatus}
                forInput="ddStatus"
                label="Status"
                type="none"
                arrData={[
                  { Value: "Aktif", Text: "Aktif" },
                  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
                ]}
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
              {currentData && currentData.length > 0 ? (
                <>
                  <Table
                    data={currentData}
                    onToggle={handleSetStatus}
                    onDetail={onChangePage}
                    onEdit={onChangePage}
                  />
                  <Paging
                    pageCurrent={currentFilter.page}
                    totalData={currentData.length}
                    navigation={handleSetCurrentPage}
                  />
                </>
              ) : (
                <Alert
                  type="info"
                  message="Tidak ada data yang ditemukan."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
